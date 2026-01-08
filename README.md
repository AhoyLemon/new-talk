# Lemon's Reveal.js Talk Template

A reveal.js presentation template with Pug, Sass, and modern build tools.

## What Changed? (Migration from Prepros/Gulp setup)

This template has been updated to use:

- ✅ **reveal.js as an npm dependency** (v5.1.0) instead of local files
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

2. **Start development server**

   ```bash
   npm run dev
   ```

   This will:

   - Compile Pug templates to HTML
   - Watch and compile Sass files
   - Start BrowserSync on http://localhost:3000
   - Auto-reload when you save files

3. **Build for production**
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
- `npm test` - Check for Sass errors

## How do I use this?

1. Clone or download this repository
2. Run `npm install` to get dependencies
3. Run `npm run dev` to start the development server
4. Edit `pug/index.pug` to create your slides
5. Edit `scss/lemon.scss` for custom styling
6. Need to change the Reveal configuration? Edit `js/reveal-config.js`
