# Cleanup and Demos Setup Summary

## reveal.js File Structure

The project now uses a **committed `reveal/` folder** instead of referencing node_modules:

- ✅ reveal.js files are copied from `node_modules/reveal.js/dist/` to `reveal/`
- ✅ Plugin files are copied from `node_modules/reveal.js/plugin/` to `reveal/plugin/`
- ✅ The `reveal/` folder is committed to git (unlike node_modules)
- ✅ Pug files reference `reveal/` paths instead of `node_modules/`
- ✅ Run `npm run update:reveal` to update reveal.js files

### Why this approach?

- node_modules is gitignored, so files wouldn't be available in production
- Committing the reveal/ folder ensures all files are available for deployment
- The update script makes it easy to update reveal.js when needed

## Folders Cleaned Up

### ✅ Deleted (No longer needed with npm-based build)

- **dist/** - Contained reveal.js build files, now comes from `node_modules/reveal.js/dist/`
- **examples/** - Contained reveal.js demo HTML files, not needed for this project
- **test/** - Contained reveal.js test files, not needed for this project
- **js/components/**, **js/controllers/**, **js/utils/** - reveal.js source code, now in `node_modules`
- **js/config.js**, **js/index.js**, **js/reveal.js** - reveal.js source files, now in `node_modules`
- **demos/prepros.config** - Old build system config file

### ✅ Kept (Still needed)

- **js/reveal-config.js** - Custom reveal.js configuration for this presentation
- **favicons/** - Used by the main presentation (`pug/partials/_favicons.pug`)

## Demos Folder Setup

Added 21 CSS demo pages with automatic compilation:

### Demo Pages

- **Container Queries**: 4 demos (container-queries-1 through 4)
- **:has() Selector**: 5 demos (has-1 through 5)
- **Scroll Animation**: 3 demos (scroll-animation-1 through 3)
- **@starting-style**: 3 demos (starting-style-1 through 3)
- **Text Wrap**: 1 demo (text-wrap-1)
- **Toggle**: 4 demos (toggle-1 through 4)
- **CSS Variables**: 1 demo (css-variables-1)

### Build System Updates

1. **Pug Routes** ([routes/pug.routes.ts](routes/pug.routes.ts))

   - Added all 21 demo routes
   - Pattern: `demos/pug/[name].pug` → `demos/[name].html`

2. **SCSS Compilation** ([package.json](package.json))

   - Added 6 demo SCSS files to build:sass and watch:sass scripts
   - Output: `demos/css/[name].css`
   - Converted all demo SCSS from `@import` to `@use` for variables

3. **Development Server** ([scripts/dev.ts](scripts/dev.ts))

   - Updated Sass watcher to compile all demo SCSS files
   - Updated BrowserSync to watch demos folder:
     - `demos/**/*.html`
     - `demos/css/*.css`
     - `demos/js/*.js`

4. **Pug Compiler** ([scripts/build-pug.ts](scripts/build-pug.ts))

   - Updated basedir to use source file's directory
   - Allows demos to use their own partials folder

5. **Git Ignore** ([.gitignore](.gitignore))
   - Added `demos/css/*.css` (generated files)
   - Added `demos/*.html` (generated files)
   - Kept `demos/pug/**/*.html` and `demos/scss/` in version control

### Demo Structure

```
demos/
├── pug/               # Pug templates (version controlled)
│   ├── partials/
│   │   ├── _head.pug
│   │   └── _accordion-content.pug
│   └── *.pug         # 21 demo templates
├── scss/             # Sass styles (version controlled)
│   ├── partials/
│   │   ├── _reset.scss
│   │   └── _variables.scss
│   └── *.scss        # 6 demo stylesheets
├── js/               # JavaScript (version controlled)
│   └── *.js          # 4 demo scripts
├── css/              # Compiled CSS (generated, ignored by git)
│   └── *.css
└── *.html            # Compiled HTML (generated, ignored by git)
```

## Commands

```bash
# Development (with live reload)
npm run dev

# Build all files
npm run build

# Build specific parts
npm run build:pug    # Compiles all Pug files (main + demos)
npm run build:sass   # Compiles all SCSS files (main + demos)
```

## Live Reload

BrowserSync now watches:

- Main presentation files
- All demo HTML files
- All demo CSS files
- All demo JavaScript files

Changes to any Pug or SCSS files in the demos folder will trigger automatic compilation and browser refresh.
