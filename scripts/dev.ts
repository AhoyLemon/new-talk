import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import ora from "ora";
import chalk from "chalk";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

interface PackageJson {
  name: string;
  version?: string;
}

let browserSyncReady = false;
let sassReady = false;
let pugReady = false;
let tsReady = false;
let hasErrors = false;

let localUrl = "http://localhost:3000";
let externalUrl = "";
let uiUrl = "http://localhost:3001";

const processes: any[] = [];

function getProjectName(): string {
  try {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson: PackageJson = JSON.parse(
      fs.readFileSync(packageJsonPath, "utf8")
    );
    return packageJson.name || "Your Project";
  } catch {
    return "Your Project";
  }
}

function clearConsole() {
  process.stdout.write("\x1Bc");
}

function displaySuccess(spinner: any) {
  spinner.stop();
  clearConsole();

  const projectName = getProjectName();

  console.log("\n");
  console.log(
    chalk.yellow("  🍋 ") +
      chalk.bold.white(`${projectName} is running locally\n`)
  );
  console.log(chalk.cyan("  Local:      ") + chalk.white(localUrl));
  if (externalUrl) {
    console.log(chalk.cyan("  Network:    ") + chalk.white(externalUrl));
  }
  console.log(chalk.cyan("  UI:         ") + chalk.dim(uiUrl));
  console.log(chalk.dim("\n  Watching for changes. Live reload enabled."));
  console.log(
    chalk.dim("  Press ") + chalk.white("Ctrl+C") + chalk.dim(" to stop\n")
  );
}

function checkAllReady(spinner: any) {
  if (browserSyncReady && sassReady && pugReady && tsReady && !hasErrors) {
    // Give it a moment for BrowserSync to fully start
    setTimeout(() => displaySuccess(spinner), 500);
  }
}

function startProcess(
  name: string,
  command: string,
  args: string[],
  spinner: any
) {
  const proc = spawn(command, args, {
    shell: true,
    cwd: projectRoot,
  });

  processes.push(proc);

  let hasOutput = false;

  // bun build streams an error frame across several stderr chunks: the "11 | " source gutter arrives separately from the "error:" line. Hold a chunk that carries no keyword so the error block can print the whole frame rather than just the half that happened to match.
  let pendingStderr = "";

  proc.stdout.on("data", (data: Buffer) => {
    const output = data.toString();
    hasOutput = true;

    if (name === "BrowserSync") {
      const localMatch = output.match(/Local:\s+(https?:\/\/[^\s]+)/);
      const externalMatch = output.match(/External:\s+(https?:\/\/[^\s]+)/);
      const uiMatch = output.match(/UI:\s+(https?:\/\/[^\s]+)/);

      if (localMatch) localUrl = localMatch[1];
      if (externalMatch) externalUrl = externalMatch[1];
      if (uiMatch) uiUrl = uiMatch[1];
    }

    if (name === "Sass") {
      if (
        !sassReady &&
        (output.includes("Compiled") ||
          output.includes("Sass is watching") ||
          output.includes("watching for changes"))
      ) {
        sassReady = true;
        spinner.text = `${chalk.green("✓")} Sass ready`;
        checkAllReady(spinner);
      }
    } else if (name === "Pug") {
      if (
        !pugReady &&
        (output.includes("Watching") ||
          output.includes("👀") ||
          output.includes("Building"))
      ) {
        pugReady = true;
        spinner.text = `${chalk.green("✓")} Pug ready`;
        checkAllReady(spinner);
      }
    } else if (name === "BrowserSync") {
      if (
        !browserSyncReady &&
        (output.includes("Local:") ||
          output.includes("Serving files") ||
          output.includes("Access URLs"))
      ) {
        browserSyncReady = true;
        spinner.text = `${chalk.green("✓")} BrowserSync ready`;
        checkAllReady(spinner);
      }
    } else if (name === "TypeScript") {
      // bun build puts its success summary on stdout:
      //   Bundled 1 module in 12ms
      //
      //     sample-demo.js  387 bytes  (entry point)
      if (
        !tsReady &&
        (output.includes("Bundled") || output.includes("(entry point)"))
      ) {
        tsReady = true;
        spinner.text = `${chalk.green("✓")} TypeScript ready`;
        checkAllReady(spinner);
      }
    }

    if (browserSyncReady && sassReady && pugReady && tsReady) {
      // bun build's summary runs to four lines. Condense it to one so saving a demo mid-talk does not scroll the URLs off the screen.
      if (name === "TypeScript") {
        const summary = output.match(/Bundled \d+ modules? in [\d.]+m?s/);
        if (summary) {
          process.stdout.write(chalk.dim(`  [${name}] `) + summary[0] + "\n");
        }
        return;
      }

      // Once everything is up, pass through only file changes and errors, not compilation output
      const shouldShow =
        output.includes("error") ||
        output.includes("Error") ||
        output.includes("🔄") ||
        output.includes("➕") ||
        output.includes("➖") ||
        (name === "Sass" && output.includes("Compiled")) ||
        /\d+:\d+:\d+\s+[AP]M/.test(output); // Timestamp pattern

      if (shouldShow) {
        if (output.trim().length > 0) {
          process.stdout.write(chalk.dim(`  [${name}] `) + output);
        }
      }
    }
  });

  proc.stderr.on("data", (data: Buffer) => {
    const output = data.toString();
    hasOutput = true;

    // Some processes write normal info to stderr, check before treating as error. Sass often writes its "watching" messages to stderr
    if (
      name === "Sass" &&
      !sassReady &&
      (output.includes("Sass is watching") ||
        output.includes("watching for changes"))
    ) {
      sassReady = true;
      spinner.text = `${chalk.green("✓")} Sass ready`;
      checkAllReady(spinner);
      return;
    }

    // A failed bun build writes nothing to stdout and, under --watch, does not exit either. So a demo that is already broken when `bun run dev` starts would never set tsReady and the spinner would turn under the error block forever. Resolve the flag here instead. checkAllReady still refuses to claim success, because the block below sets hasErrors.
    if (name === "TypeScript") {
      if (
        !output.toLowerCase().includes("error") &&
        !output.toLowerCase().includes("fail")
      ) {
        // A gutter/caret fragment, or an ANSI-only chunk. Keep it for the frame.
        pendingStderr = (pendingStderr + output).slice(-4096);
        return;
      }
      tsReady = true;
      spinner.stop();
    }

    // Only treat as error if it actually contains error keywords
    if (
      output.toLowerCase().includes("error") ||
      output.toLowerCase().includes("fail")
    ) {
      hasErrors = true;
      clearConsole();
      console.error(chalk.red(`\n  ❌ Error in ${name}:\n`));
      console.error(
        chalk.dim("  ─────────────────────────────────────────────\n")
      );
      console.error(pendingStderr + output);
      pendingStderr = "";
      console.error(
        chalk.dim("  ─────────────────────────────────────────────\n")
      );
    }
  });

  // After a short delay, assume the process is ready if it hasn't crashed
  setTimeout(() => {
    if (!hasOutput && proc.exitCode === null) {
      if (name === "Sass" && !sassReady) {
        sassReady = true;
        checkAllReady(spinner);
      } else if (name === "Pug" && !pugReady) {
        pugReady = true;
        checkAllReady(spinner);
      } else if (name === "TypeScript" && !tsReady) {
        tsReady = true;
        checkAllReady(spinner);
      } else if (name === "BrowserSync" && !browserSyncReady) {
        browserSyncReady = true;
        checkAllReady(spinner);
      }
    }
  }, 3000);

  proc.on("error", (error) => {
    console.error(chalk.red(`\n  ❌ Failed to start ${name}:`), error.message);
    hasErrors = true;
  });

  proc.on("exit", (code) => {
    if (code !== 0 && code !== null) {
      console.error(chalk.red(`\n  ❌ ${name} exited with code ${code}\n`));
      hasErrors = true;
    }
  });
}

async function startDev() {
  const projectName = getProjectName();

  console.log("\n");
  const spinner = ora({
    text: chalk.cyan(`Loading ${projectName}...`),
    color: "cyan",
  }).start();

  startProcess(
    "Sass",
    "sass",
    [
      "scss/lemon.scss:css/lemon.css",
      "scss/talk.scss:css/talk.css",
      "scss/print:css/print",
      "demos/scss:demos/css",
      "--no-source-map",
      "--watch",
    ],
    spinner
  );

  startProcess("Pug", "tsx", ["scripts/watch-pug.ts"], spinner);

  startProcess(
    "TypeScript",
    "bun",
    [
      "build",
      // [!_] skips _-prefixed partials. bun build bundles, so an imported partial is inlined into every entry that uses it and never needs a file of its own. The shell expands this once, at spawn, which is why adding a NEW demo needs a `bun run dev` restart. --root matches package.json's build:js so bundles land flat at demos/js/<name>.js.
      "--root",
      "demos/ts",
      "demos/ts/[!_]*.ts",
      "--outdir",
      "demos/js",
      "--target",
      "browser",
      "--watch",
      // Without this, every rebuild writes a clear-screen escape to both stdout and stderr, even through pipes, wiping the banner below.
      "--no-clear-screen",
    ],
    spinner
  );

  startProcess(
    "BrowserSync",
    "browser-sync",
    [
      "start",
      "--server",
      "--files",
      "*.html, css/*.css, js/**/*.js, demos/**/*.html, demos/css/*.css, demos/js/*.js",
      "--no-notify",
      "--no-open",
    ],
    spinner
  );

  process.on("SIGINT", () => {
    console.log(chalk.yellow("\n\n  Stopping dev server...\n"));
    processes.forEach((proc) => proc.kill());
    process.exit(0);
  });

  // Timeout check - if not ready in 10 seconds, something is wrong
  setTimeout(() => {
    if (!browserSyncReady || !sassReady || !pugReady || !tsReady) {
      spinner.warn(
        chalk.yellow("Some services are taking longer than expected...")
      );
    }
  }, 10000);
}

startDev().catch((error) => {
  console.error(chalk.red("\n  ❌ Fatal error:\n"));
  console.error(error);
  process.exit(1);
});
