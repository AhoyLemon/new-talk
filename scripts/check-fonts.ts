import fs from "fs";
import os from "os";
import path from "path";
import { execSync } from "child_process";
import chalk from "chalk";

// The deck loads these from Google Fonts. A local install is the offline fallback: with no network, the browser still matches the family name against installed fonts.
interface DeckFont {
  family: string;
  url: string;
}

const deckFonts: DeckFont[] = [
  { family: "Yrsa", url: "https://fonts.google.com/specimen/Yrsa" },
  { family: "Syne", url: "https://fonts.google.com/specimen/Syne" },
  { family: "Share Tech Mono", url: "https://fonts.google.com/specimen/Share+Tech+Mono" },
];

const fontDirectories = [
  path.join(os.homedir(), "Library", "Fonts"),
  "/Library/Fonts",
  "/System/Library/Fonts",
  path.join(os.homedir(), ".local", "share", "fonts"),
  path.join(os.homedir(), ".fonts"),
  "/usr/share/fonts",
  "/usr/local/share/fonts",
];

const squash = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

function listFontFiles(directory: string, depth = 0): string[] {
  if (depth > 3 || !fs.existsSync(directory)) return [];
  try {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return listFontFiles(fullPath, depth + 1);
      return /\.(ttf|otf|ttc|woff2?)$/i.test(entry.name) ? [entry.name] : [];
    });
  } catch {
    return [];
  }
}

function listFontconfigFamilies(): string[] {
  try {
    return execSync("fc-list : family", { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] })
      .split("\n")
      .flatMap((line) => line.split(","))
      .map(squash)
      .filter(Boolean);
  } catch {
    return [];
  }
}

// A font file's family is its name up to the first separator: "Syne[wght].ttf", "Syne-Regular.ttf" and "Yrsa-VariableFont_wght.ttf" are Syne, Syne and Yrsa, while "SyneMono-Regular.ttf" is a different family. A name with no separator but spaces ("Share Tech Mono.ttf") is the family itself.
const familyStem = (fileName: string) => squash(fileName.replace(/\.[a-z0-9]+$/i, "").split(/[-_[(]/)[0]);

function isInstalled(font: DeckFont, fileNames: string[], families: string[]): boolean {
  const wanted = squash(font.family);
  return families.includes(wanted) || fileNames.some((fileName) => familyStem(fileName) === wanted);
}

function main() {
  if (process.env.CI) return;

  const files = fontDirectories.flatMap((directory) => listFontFiles(directory));
  const families = listFontconfigFamilies();
  const missing = deckFonts.filter((font) => !isInstalled(font, files, families));

  if (missing.length === 0) {
    console.log(chalk.green("✓ Deck fonts installed locally:"), deckFonts.map((font) => font.family).join(", "));
    return;
  }

  console.log(chalk.yellow(`\n⚠ ${missing.length} deck font${missing.length === 1 ? " isn't" : "s aren't"} installed locally.`));
  console.log(chalk.dim("  The deck still loads them from Google Fonts. Install them so it looks right offline too.\n"));
  for (const font of missing) {
    console.log(`  ${chalk.bold(font.family.padEnd(16))} ${chalk.cyan(font.url)}`);
  }
  console.log("");
}

try {
  main();
} catch (error) {
  console.warn(chalk.yellow("Font check skipped:"), error instanceof Error ? error.message : error);
}
