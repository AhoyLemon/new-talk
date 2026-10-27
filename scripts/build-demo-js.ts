import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";

/** Entry points for `bun build`: every demos/ts/*.ts that isn't a `_`-prefixed partial. bun build bundles, so an imported partial is inlined into every entry that uses it and never needs a file of its own. Expanded here, not by a shell glob, because cmd.exe doesn't expand globs and bun doesn't either, so on Windows the literal pattern reaches bun and fails. */
export function demoEntries(dir = "demos/ts"): string[] {
  return readdirSync(dir)
    .filter((f) => f.endsWith(".ts") && !f.startsWith("_"))
    .sort()
    .map((f) => `${dir}/${f}`);
}

/** The `bun build` arguments for the demo scripts. --root keeps bundles flat at demos/js/<name>.js. */
export function demoBuildArgs(extra: string[] = []): string[] {
  return ["build", "--root", "demos/ts", ...demoEntries(), "--outdir", "demos/js", "--target", "browser", ...extra];
}

// Run directly (`tsx scripts/build-demo-js.ts [--watch]`): build once, or watch.
if (process.argv[1]?.endsWith("build-demo-js.ts")) {
  const watch = process.argv.includes("--watch");
  const args = demoBuildArgs(watch ? ["--watch", "--no-clear-screen"] : []);
  const result = spawnSync("bun", args, { stdio: "inherit", shell: process.platform === "win32" });
  process.exit(result.status ?? 1);
}
