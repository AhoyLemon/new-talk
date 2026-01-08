import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ora from 'ora';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const revealDistSource = path.join(projectRoot, 'node_modules', 'reveal.js', 'dist');
const revealPluginSource = path.join(projectRoot, 'node_modules', 'reveal.js', 'plugin');
const revealDest = path.join(projectRoot, 'reveal');

/**
 * Recursively copy directory contents
 */
function copyDir(src: string, dest: string, relativePath: string = '') {
  // Create destination directory
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    const displayPath = path.join(relativePath, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath, displayPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(chalk.dim(`  ✓ ${displayPath}`));
    }
  }
}

/**
 * Get reveal.js version from package.json
 */
function getRevealVersion(): string {
  try {
    const packageJsonPath = path.join(projectRoot, 'node_modules', 'reveal.js', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    return packageJson.version || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Remove directory recursively
 */
function removeDir(dir: string) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

async function updateReveal() {
  console.log('\n');
  const spinner = ora({
    text: chalk.cyan('Updating reveal.js files...'),
    color: 'cyan',
  }).start();

  try {
    // Check if source exists
    if (!fs.existsSync(revealDistSource)) {
      spinner.fail(chalk.red('reveal.js not found in node_modules'));
      console.log(chalk.yellow('\n  Run ') + chalk.white('npm install') + chalk.yellow(' first\n'));
      process.exit(1);
    }

    const version = getRevealVersion();
    
    // Remove old reveal folder
    if (fs.existsSync(revealDest)) {
      spinner.text = chalk.cyan('Removing old reveal.js files...');
      removeDir(revealDest);
    }

    // Copy new files
    spinner.text = chalk.cyan(`Copying reveal.js v${version}...`);
    spinner.stop();
    
    console.log(chalk.cyan(`\n  📦 Copying reveal.js v${version} from node_modules...\n`));
    
    // Copy dist files
    copyDir(revealDistSource, revealDest, 'reveal');
    
    // Copy plugin folder
    console.log('');
    const pluginDest = path.join(revealDest, 'plugin');
    copyDir(revealPluginSource, pluginDest, 'reveal/plugin');

    console.log('\n');
    console.log(chalk.green('  ✨ reveal.js updated successfully!'));
    console.log(chalk.dim(`  Version: ${version}`));
    console.log(chalk.dim(`  Location: ${path.relative(projectRoot, revealDest)}/`));
    console.log('\n');

  } catch (error) {
    spinner.fail(chalk.red('Failed to update reveal.js'));
    if (error instanceof Error) {
      console.error(chalk.red(`\n  ❌ ${error.message}\n`));
    }
    process.exit(1);
  }
}

updateReveal().catch((error) => {
  console.error(chalk.red('\n  ❌ Fatal error:\n'));
  console.error(error);
  process.exit(1);
});
