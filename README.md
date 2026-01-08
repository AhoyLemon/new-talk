# Lemon's Reveal.js Talk Template

A reveal.js presentation template with Pug, Sass, and modern build tools.

## What Changed? (Migration from Prepros/Gulp setup)

This template has been updated to use:

- ✅ **reveal.js as an npm dependency** (v5.2.1) with committed files in `reveal/`
- ✅ **Browser-sync** for live reload development
- ✅ **Modern Sass** with @use syntax instead of @import
- ✅ **Pug templating** with routing configuration
- ✅ **TypeScript-based build scripts** for better tooling
- ✅ **No more Prepros/Gulp** - simplified build system with npm scripts

## Prerequisites

You'll need [Node.js](https://nodejs.org/) (v18 or higher) and npm installed.

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Copy reveal.js files** (only needed once, or when updating reveal.js)

   ```bash
   npm run update:reveal
   ```

   This copies reveal.js files from node_modules to the `reveal/` folder (which is committed to git).

3. **Start development server**

   ```bash
   npm run dev
   ```

   This will:

   - Compile Pug templates to HTML
   - Watch and compile Sass files
   - Start BrowserSync on http://localhost:3000
   - Auto-reload when you save files

4. **Build for production**
   ```bash
   npm run build
   ```

## Commands

- `npm run dev` - Start development server with live reload
- `npm run build` - Build all files for production
- `npm run build:pug` - Build Pug files only
- `npm run build:sass` - Build Sass files only
- `npm run watch:pug` - Watch Pug files only
- `npm run watch:sass` - Watch Sass files only
- `npm run update:reveal` - Update reveal.js files from node_modules to reveal/ folder
- `npm test` - Check for Sass errors

## How do I use this?

1. Clone or download this repository
2. Run `npm install` to get dependencies
3. Run `npm run update:reveal` to copy reveal.js files
4. Run `npm run dev` to start the development server
5. Edit `pug/index.pug` to create your slides
6. Edit `scss/lemon.scss` for custom styling
7. Need to change the Reveal configuration? Edit `js/reveal-config.js`

## Updating reveal.js

When you want to update to the latest version of reveal.js:

1. Update the reveal.js dependency: `npm update reveal.js`
2. Copy the new files: `npm run update:reveal`
3. Commit the updated `reveal/` folder to git
