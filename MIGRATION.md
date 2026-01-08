# Migration Summary

This document outlines the changes made to migrate from the old Prepros/Gulp-based setup to a modern npm-based build system with reveal.js as a dependency.

## What Was Done

### ✅ 1. Updated package.json

- Replaced reveal.js-specific package.json with project-specific one
- Added **reveal.js v5.1.0** as an npm dependency
- Added modern build tool dependencies:
  - `browser-sync` for live reload
  - `pug` for HTML templating
  - `sass` (Dart Sass) for CSS compilation
  - `tsx` for running TypeScript build scripts
  - `chalk`, `ora`, `chokidar` for enhanced CLI experience
- Updated scripts to use npm commands instead of gulp

### ✅ 2. Created TypeScript Build System

Created `scripts/` folder with three main files:

- **`dev.ts`**: Development server that runs all watchers and browser-sync
- **`build-pug.ts`**: Builds all Pug files according to routing configuration
- **`watch-pug.ts`**: Watches Pug files for changes and rebuilds

### ✅ 3. Added Pug Routing Configuration

- Created `routes/pug.routes.ts` to explicitly define which Pug files compile to which HTML files
- This gives full control over the output structure
- Supports nested routes and demos folders

### ✅ 4. Updated Pug Files

- Added `testing` variable to `pug/index.pug` for build-time environment detection
- Updated `pug/partials/_variables.pug` to include `lastUpdated` cachebuster
- Updated `pug/partials/_head.pug` to:
  - Load reveal.js CSS from `node_modules/reveal.js/dist/`
  - Load plugins from `node_modules/reveal.js/plugin/`
  - Add cachebuster to custom CSS
- Updated `pug/partials/_javascripts.pug` to:
  - Load reveal.js JS from node_modules
  - Add cachebuster to custom JS
- Fixed HTML structure in `pug/index.pug` (proper html/head/body tags)

### ✅ 5. Converted SCSS @import to @use

- Updated `scss/reveal.scss` to use modern `@use 'layout'` syntax
- Kept `@import` for print styles (print/pdf.scss, print/paper.scss) as they need to be loaded conditionally at the end
- Added comment explaining why print styles still use @import
- Your custom `scss/lemon.scss` didn't have any @import statements

### ✅ 6. Updated reveal.js Integration

- Removed local `dist/` and `plugin/` folders (these now come from node_modules)
- Updated all references to point to `node_modules/reveal.js/`
- reveal.js is now managed as a package and can be updated with `npm update reveal.js`

### ✅ 7. Added TypeScript Support

- Created `types/pug.d.ts` for Pug type definitions
- Created `tsconfig.json` for TypeScript configuration
- All build scripts are written in TypeScript for better tooling

### ✅ 8. Added Configuration Files

- Created `.gitignore` to exclude node_modules, generated files, and old config files
- Updated `README.md` with new setup instructions
- Removed `gulpfile.js` (no longer needed)

## File Changes Summary

### New Files

```
scripts/
  ├── dev.ts              # Development server
  ├── build-pug.ts        # Pug build script
  └── watch-pug.ts        # Pug watch script
routes/
  └── pug.routes.ts       # Pug routing configuration
types/
  └── pug.d.ts           # TypeScript definitions
tsconfig.json            # TypeScript configuration
.gitignore               # Git ignore rules
```

### Modified Files

```
package.json             # New dependencies and scripts
pug/index.pug           # Added testing variable and fixed HTML structure
pug/partials/_variables.pug    # Added lastUpdated cachebuster
pug/partials/_head.pug         # Updated to use node_modules paths
pug/partials/_javascripts.pug # Updated to use node_modules paths
scss/reveal.scss        # Converted @import to @use (except print styles)
README.md               # Updated documentation
```

### Removed Files

```
gulpfile.js             # Old build system
dist/                   # Now comes from node_modules/reveal.js/
plugin/                 # Now comes from node_modules/reveal.js/
```

## How to Use

### Development

```bash
npm install    # Install dependencies
npm run dev    # Start dev server with live reload
```

Visit http://localhost:3000 to see your presentation.

### Building

```bash
npm run build        # Build everything
npm run build:pug    # Build Pug only
npm run build:sass   # Build Sass only
```

### Adding New Pages/Demos

1. Create your Pug file in `pug/` or `pug/demos/`
2. Add a route in `routes/pug.routes.ts`:
   ```typescript
   'pug/demos/my-demo.pug': 'demos/my-demo/index.html'
   ```
3. Run `npm run dev` and it will auto-compile

## Browser-Sync Features

When running `npm run dev`, you get:

- **Live Reload**: Automatically refreshes when you save files
- **Network Access**: Test on other devices using the Network URL
- **UI Dashboard**: Access advanced features at http://localhost:3001

## Notable Decisions

### Why Keep Some @import Statements?

The print styles (`print/pdf.scss` and `print/paper.scss`) still use `@import` because:

1. They need to be at the end of the CSS file
2. `@use` rules must be at the top of the file
3. These are loaded conditionally anyway

### Why reveal.js as an npm Dependency?

- **Easy Updates**: Just run `npm update reveal.js`
- **Version Control**: Lock to specific versions
- **Smaller Repo**: Don't commit the entire reveal.js framework
- **Standard Practice**: How most projects use libraries now

### Why TypeScript for Build Scripts?

- **Type Safety**: Catch errors before running
- **Better IDE Support**: Autocomplete and inline documentation
- **Modern JavaScript**: Use latest features without worry

## Demos Folder Support

The build system fully supports demos folders with their own Pug/SCSS/JS:

1. Create demo files:

   ```
   pug/demos/demo1.pug
   scss/demos/demo1.scss
   js/demos/demo1.js
   ```

2. Add route in `routes/pug.routes.ts`:

   ```typescript
   'pug/demos/demo1.pug': 'demos/demo1/index.html'
   ```

3. Add Sass compilation in `package.json` if needed:
   ```json
   "build:sass": "sass scss/lemon.scss:css/lemon.css scss/demos/demo1.scss:demos/demo1/demo1.css"
   ```

## Troubleshooting

### "Module not found" errors

Run `npm install` to ensure all dependencies are installed.

### Browser-sync not loading

Check that port 3000 and 3001 aren't already in use.

### Pug compilation errors

Check your Pug syntax and make sure partials exist.

### Sass compilation warnings

Some deprecation warnings from reveal.js's print styles are expected and safe to ignore.

## Next Steps

1. ✅ Delete old config files if desired:

   - `prepros-6.config`
   - `prepros.config`
   - `config.codekit3`

2. ✅ Commit changes:

   ```bash
   git add .
   git commit -m "Migrate to npm-based build system with reveal.js as dependency"
   ```

3. ✅ Start building your presentation:
   ```bash
   npm run dev
   ```

## Reference Links

- [reveal.js Documentation](https://revealjs.com/)
- [Pug Documentation](https://pugjs.org/)
- [Sass @use Documentation](https://sass-lang.com/documentation/at-rules/use)
- [BrowserSync Documentation](https://browsersync.io/)

---

## Questions?

This migration was modeled after the changes in [AhoyLemon/startHere#4](https://github.com/AhoyLemon/startHere/pull/4) but adapted for reveal.js presentations.
