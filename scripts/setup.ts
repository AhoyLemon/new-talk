import prompts from "prompts";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * Setup script for new talk projects
 * Prompts for talk title, shortname, and live URL
 */
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
      name: "shortname",
      message: "Talk shortname (for URLs, e.g., 'my-talk'):",
      initial: (prev: string) =>
        prev
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      validate: (value: string) =>
        /^[a-z0-9-]+$/.test(value)
          ? true
          : "Only lowercase letters, numbers, and hyphens",
    },
    {
      type: "text",
      name: "liveURL",
      message: "Live URL (e.g., 'https://ahoylemon.github.io/my-talk/'):",
      initial: (prev: string) => `https://ahoylemon.github.io/${prev}/`,
    },
    {
      type: "text",
      name: "description",
      message: "Talk description (optional):",
      initial: "",
    },
  ]);

  if (!response.talkTitle || !response.shortname) {
    console.log("\n❌ Setup cancelled.");
    process.exit(0);
  }

  console.log("\n📝 Updating project files...");

  // Update package.json
  try {
    const packageJsonPath = path.join(projectRoot, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    packageJson.name = response.shortname;
    if (response.description) {
      packageJson.description = response.description;
    }

    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(packageJson, null, 2) + "\n"
    );
    console.log("✓ Updated package.json");
  } catch (error) {
    console.error("❌ Error updating package.json:", (error as any).message);
  }

  // Update Pug variables
  try {
    const pugVarsPath = path.join(
      projectRoot,
      "pug",
      "partials",
      "_variables.pug"
    );
    let pugVars = fs.readFileSync(pugVarsPath, "utf8");

    // Update talk title
    pugVars = pugVars.replace(
      /- const talkTitle = ".*"/,
      `- const talkTitle = "${response.talkTitle}"`
    );

    // Update live URL
    pugVars = pugVars.replace(
      /- const liveURL = ".*"/,
      `- const liveURL = "${response.liveURL}"`
    );

    // Update local URL
    pugVars = pugVars.replace(
      /- const localURL = ".*"/,
      `- const localURL = "http://localhost:3000/"`
    );

    // Update description if provided
    if (response.description) {
      pugVars = pugVars.replace(
        /- const description = ".*"/,
        `- const description = "${response.description}"`
      );
    }

    fs.writeFileSync(pugVarsPath, pugVars);
    console.log("✓ Updated Pug variables");
  } catch (error) {
    console.error("❌ Error updating Pug variables:", (error as any).message);
  }

  // Update README
  try {
    const readmePath = path.join(projectRoot, "README.md");
    let readme = fs.readFileSync(readmePath, "utf8");

    // Update title in README
    readme = readme.replace(/# .*/, `# ${response.talkTitle}`);

    fs.writeFileSync(readmePath, readme);
    console.log("✓ Updated README.md");
  } catch (error) {
    console.error("❌ Error updating README:", (error as any).message);
  }

  console.log("\n✨ Setup complete! Your talk is ready to go.");
  console.log(`\n🎤 Talk: ${response.talkTitle}`);
  console.log(`📦 Name: ${response.shortname}`);
  console.log(`🌐 URL: ${response.liveURL}`);
  console.log("\n📦 Next steps:");
  console.log("   npm run dev          - Start development server");
  console.log("   npm run build        - Build for production");
  console.log("   npm run update:reveal - Update reveal.js\n");
}

setup().catch((error) => {
  console.error("Setup error:", error);
  process.exit(1);
});
