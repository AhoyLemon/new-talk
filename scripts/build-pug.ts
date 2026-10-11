import pug from "pug";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import routes from "../routes/pug.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const checkOnly = process.argv.includes("--check");

/**
 * Build all Pug files according to the routing configuration. In --check mode, renders every route to catch template errors without writing output, so `bun run test` can validate Pug without side effects.
 */
function buildPug() {
  console.log(checkOnly ? "Checking Pug files..." : "Building Pug files...");

  let successCount = 0;
  let errorCount = 0;

  Object.entries(routes).forEach(([source, output]) => {
    try {
      const sourcePath = path.resolve(projectRoot, source);
      const outputPath = path.resolve(projectRoot, output);

      if (!fs.existsSync(sourcePath)) {
        console.error(`❌ Source file not found: ${source}`);
        errorCount++;
        return;
      }

      // Compile Pug to HTML. testing:false makes siteURL/asset links resolve to the live URL, matching what gets committed/deployed.
      const html = pug.renderFile(sourcePath, {
        pretty: true,
        basedir: path.dirname(sourcePath),
        testing: false,
      });

      if (!checkOnly) {
        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, html);
      }

      console.log(checkOnly ? `✓ ${source}` : `✓ ${source} → ${output}`);
      successCount++;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Error compiling ${source}:`, error.message);
      } else {
        console.error(`❌ Error compiling ${source}:`, error);
      }
      errorCount++;
    }
  });

  console.log(
    `\n✨ ${checkOnly ? "Check" : "Build"} complete: ${successCount} successful, ${errorCount} failed`
  );

  if (errorCount > 0) {
    process.exit(1);
  }
}

buildPug();
