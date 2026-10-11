import prompts from "prompts";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { spawnSync } from "child_process";

import { setPugConst } from "./_pug-vars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// Prompts for a new talk's title, shortname, live URL, handle and description, writes them into package.json, _variables.pug and the README, then rebuilds the HTML.
async function setup() {
  console.log(`
╭───────────────────────────────────────────────────╮
│ 🍋 Lemon Talk Template — Project Setup            │
├───────────────────────────────────────────────────┤
│ 🎤 Setting up your new talk...                    │
╰───────────────────────────────────────────────────╯
`);

  const response = await prompts([
    {
      type: "text",
      name: "talkTitle",
      message: "What is the title of your talk?",
      initial: "My Amazing Talk",
      validate: (value: string) =>
        value.length > 0 ? true : "Talk title is required",
    },
    {
      type: "text",
      name: "subtitle",
      message: "Talk subtitle (optional):",
      initial: "",
    },
    {
      type: "text",
      name: "shortname",
      message: "Talk shortname (for URLs, e.g., 'my-talk'):",
      initial: (prev: string, values: any) =>
        values.talkTitle
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      format: (value: string) =>
        value.trim().replace(/[‐-―−]/g, "-"),
      validate: (value: string) => {
        const cleaned = value.trim().replace(/[‐-―−]/g, "-");
        if (/^[a-z0-9-]+$/.test(cleaned)) return true;
        const badChars = [...new Set(cleaned.replace(/[a-z0-9-]/g, ""))]
          .map((c) => `"${c}" (U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")})`)
          .join(", ");
        return `Only lowercase letters, numbers, and hyphens. Found: ${badChars}`;
      },
    },
    {
      type: "text",
      name: "liveURL",
      message: "Live URL (e.g., 'https://ahoylemon.github.io/my-talk/'):",
      initial: (prev: string) => `https://ahoylemon.github.io/${prev}/`,
      // og:image is built as liveURL + "og-image.png", so the URL needs its trailing slash.
      format: (value: string) => (value.trim().endsWith("/") ? value.trim() : `${value.trim()}/`),
    },
    {
      type: "text",
      name: "authorHandle",
      message: "Your handle (for the intro byline and twitter:creator):",
      initial: "@AhoyLemon",
    },
    {
      type: "text",
      name: "description",
      message: "Talk description (for social previews; leave blank to use the title):",
      initial: "",
    },
  ]);

  if (!response.talkTitle || !response.shortname) {
    console.log("\n❌ Setup cancelled.");
    process.exit(0);
  }

  // The template's own description must never ship in a talk's social meta, so a blank answer falls back to the title.
  const description = response.description?.trim() || `${response.talkTitle}, a talk by ${response.authorHandle}`;

  console.log("\n📝 Updating project files...");

  try {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    packageJson.name = response.shortname;
    packageJson.description = description;

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n"
    );
    console.log("✓ Updated package.json");
  } catch (error) {
    console.error("❌ Error updating package.json:", (error as any).message);
  }

  try {
    const pugVarsPath = path.join(
      projectRoot,
      "pug",
      "partials",
      "_variables.pug"
    );
    let pugVars = fs.readFileSync(pugVarsPath, "utf8");

    pugVars = setPugConst(pugVars, "talkTitle", response.talkTitle);
    pugVars = setPugConst(pugVars, "subtitle", response.subtitle || "");
    pugVars = setPugConst(pugVars, "liveURL", response.liveURL);
    pugVars = setPugConst(pugVars, "localURL", "http://localhost:3000/");
    pugVars = setPugConst(pugVars, "authorHandle", response.authorHandle || "@AhoyLemon");
    pugVars = setPugConst(pugVars, "description", description);

    fs.writeFileSync(pugVarsPath, pugVars);
    console.log("✓ Updated Pug variables");
  } catch (error) {
    console.error("❌ Error updating Pug variables:", (error as any).message);
  }

  try {
    const readmePath = path.join(projectRoot, "README.md");
    let readme = fs.readFileSync(readmePath, "utf8");

    readme = readme.replace(/# .*/, () => `# ${response.talkTitle}`);

    fs.writeFileSync(readmePath, readme);
    console.log("✓ Updated README.md");
  } catch (error) {
    console.error("❌ Error updating README:", (error as any).message);
  }

  // Rebuild the HTML so the committed index.html and demos stop saying [LEMON TALK TEMPLATE].
  console.log("\n🔨 Rebuilding HTML...");
  const build = spawnSync("npm", ["run", "build:pug"], {
    cwd: projectRoot,
    stdio: "inherit",
    shell: process.platform === "win32",
  });
  if (build.status !== 0) {
    console.error("❌ HTML rebuild failed. Run `npm run build` once you've fixed it.");
  }

  console.log("\n✨ Setup complete! Your talk is ready to go.");
  console.log(`\n🎤 Talk: ${response.talkTitle}`);
  console.log(`📦 Name: ${response.shortname}`);
  console.log(`🌐 URL: ${response.liveURL}`);
  console.log("\n📦 Next steps:");
  console.log("   npm run dev           - Start development server");
  console.log("   npm run build         - Build for production");
  console.log("   npm run update:reveal - Update reveal.js");
  console.log("\n🚀 To deploy: on GitHub, set Settings → Pages → Source to \"GitHub Actions\".");
  console.log("   Until then, .github/workflows/deploy.yml skips itself; test.yml still runs.\n");
}

setup().catch((error) => {
  console.error("Setup error:", error);
  process.exit(1);
});
