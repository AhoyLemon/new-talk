# Lemon's Talk Template

[![RevealJS](https://img.shields.io/badge/reveal.js-000?style=for-the-badge&labelColor=F2E142&logo=reveal.js&logoColor=111&color=222)](https://revealjs.com/)
[![Pug](https://img.shields.io/badge/Pug-000?style=for-the-badge&labelColor=A86454&logo=pug&logoColor=white&color=222)](https://pugjs.org/)

A [reveal.js](https://revealjs.com/) presentation template with Pug, Sass, and modern build tools.
This template is designed to help you quickly create and customize your own reveal.js presentations using Pug for templating and Sass for styling

## Prerequisites

You'll either need [Node.js](https://nodejs.org/) or [Bun](https://bun.sh/). It will work with either.

## Getting Started

1. Click [Use This Template](https://github.com/AhoyLemon/startHere/generate) to use this repo as a project template.
1. Clone your new repository locally
1. Run `npm install`[^1] to install dependencies
1. Run `npm run setup` to configure your project name and details
1. Run `npm run update:reveal` to copy reveal.js files
1. Run `npm run dev` to start the development server

[^1]: Any npm command will work with bun as well, eg `bun install`, `bun run setup`, `bun run dev`, etc.

## Commands

```bash
npm run dev   # Start development server with live reload
npm run build # Build all files for production
npm run update:reveal # Update reveal.js files from node_modules to reveal/ folder
npm test      # Check for Sass errors
```

## How do I edit the deck?

- Edit the [`pug/index.pug`](pug/index.pug) file to modify your slides. You can use Pug syntax to create sections, add content, and include mixins.
  - **Strongly Recommended:** Split your slides into multiple partials in the `pug/partials/` directory and include them in `index.pug` for better organization.
  - Check out [`pug/partials/_mixins.pug`](pug/partials/_mixins.pug) for useful mixins like `demo` and `iframe`.
- Edit the global styles by editing [`scss/lemon.scss`](scss/lemon.scss). You can add your own styles or override existing ones.
- **Need help with demos?** See [`demos/demos.md`](demos/demos.md)
- Edit [`js/reveal-config.js`](js/reveal-config.js) to customize reveal.js settings like transitions, controls, and plugins.
- Need additional reveal.js help? Check out the [reveal.js documentation](https://revealjs.com/).

## Updating reveal.js

When you want to update to the latest version of reveal.js:

1. Update the reveal.js dependency: `npm update reveal.js`
2. Copy the new files: `npm run update:reveal`
3. Commit the updated `reveal/` folder to git

## License

[CC-BY-4.0](LICENSE) - Creative Commons Attribution 4.0 International License