import chokidar from "chokidar";
import pug from "pug";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import routes from "../routes/pug.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

/**
 * Compile a single Pug file
 */
function compilePugFile(
  source: string,
  output: string,
  silent = false
): boolean {
  try {
    const sourcePath = path.resolve(projectRoot, source);
    const outputPath = path.resolve(projectRoot, output);

    if (!fs.existsSync(sourcePath)) {
      console.error(`❌ Source file not found: ${source}`);
      return false;
    }

    const html = pug.renderFile(sourcePath, {
      pretty: true,
      basedir: path.dirname(sourcePath),
    });

    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, html);
    if (!silent) {
      console.log(`✓ ${source} → ${output}`);
    }
    return true;
  } catch (error: any) {
    console.error(`❌ Error compiling ${source}:`, error?.message ?? error);
    return false;
  }
}

/**
 * Rebuild all Pug files
 */
function rebuildAll(silent = false) {
  Object.entries(routes).forEach(([source, output]) => {
    compilePugFile(source, output, silent);
  });
}

/**
 * Watch Pug files for changes
 */
function watchPug() {
  // Initial build (silent mode)
  rebuildAll(true);

  // Watch all .pug files
  const watcher = chokidar.watch(["pug/**/*.pug", "demos/pug/**/*.pug"], {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    cwd: projectRoot,
    ignoreInitial: true, // Don't fire events for files that exist when watcher starts
  });

  watcher.on("change", (filePath) => {
    console.log(`\n🔄 ${filePath}`);

    // If it's a partial (starts with _), rebuild all files silently
    const fileName = path.basename(filePath);
    if (fileName.startsWith("_")) {
      rebuildAll(true);
    } else {
      // Otherwise, find and rebuild the specific file
      const normalizedPath = filePath.replace(/\\/g, "/");
      const matchingRoute = Object.entries(routes).find(
        ([source]) => source.replace(/\\/g, "/") === normalizedPath
      );

      if (matchingRoute) {
        const [source, output] = matchingRoute;
        compilePugFile(source, output, true);
      } else {
        rebuildAll(true);
      }
    }
  });

  watcher.on("add", (filePath) => {
    console.log(`\n➕ ${filePath}`);
    rebuildAll(true);
  });

  watcher.on("unlink", (filePath) => {
    console.log(`\n➖ ${filePath}`);
    rebuildAll(true);
  });

  // Signal ready for dev.ts without extra output
  console.log("👀 Watching");
}

watchPug();
