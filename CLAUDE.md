# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A [reveal.js](https://revealjs.com/) presentation template. Slides are authored in Pug, styled with Sass, and served as a static HTML file via BrowserSync. There is no frontend framework and no Vite — TypeScript is only used in the build scripts (run via `tsx`).

## Commands

```bash
bun run dev           # Start dev server (BrowserSync on :3000, UI on :3001) + Sass watch + Pug watch
bun run build         # Compile all Pug and Sass to output files
bun run setup         # Interactive CLI to configure talk title, shortname, and live URL
bun run update:reveal # Copy reveal.js files from node_modules into the vendored reveal/ folder
bun test              # Check Sass compiles without errors (no other test suite)
```

All `npm run` equivalents work too.

## Source files vs. build output

**Never edit build output directly** — always edit the source file that generates it. Output files will be overwritten on the next build.

| To change… | Edit… | Not… |
|---|---|---|
| Shared slide content | `pug/sections/shared/` files | `*.html` |
| Talk-specific slide content | `pug/sections/_talk-content.pug` | `*.html` |
| Demo content / markup | `demos/pug/` files | `demos/*.html` |
| Shared presentation styles | `scss/lemon.scss` | `css/lemon.css` |
| Talk-specific styles | `scss/talk.scss` | `css/talk.css` |
| Demo styles | `demos/scss/` files | `demos/css/` files |
| Browser JS (if compiled) | `src/` or `ts/` source files | `js/` output files |

## Architecture

### Slide authoring flow

`pug/index.pug` is the entry point. It sets a `testing` flag (switches `siteURL` between `localURL` and `liveURL`), includes `partials/_variables.pug` for talk metadata, and includes section files from `pug/sections/`. The Pug compiler renders this to `index.html`.

- **`pug/partials/_variables.pug`** — talk title, subtitle, `liveURL`, `localURL`. Edit these after running `setup`, or directly.
- **`pug/partials/_mixins.pug`** — reusable Pug mixins: `+link`, `+image`, `+videoBG`, `+introScreen`, `+demo`, `+iframe`.
- **`pug/sections/`** — one file per logical section of the talk, included in `index.pug`. Shared sections (`_hello.pug`, `_intros.pug`, `_hit-me-up.pug`, `_thank-you.pug`) carry forward across talks — edit lightly. `_talk-content.pug` is the blank canvas for this talk's slides; replace it entirely.
- **`pug/examples/`** — reference sections showing all available slide types (`_example-slides.pug`, `_example-videos.pug`). Not included in the build — copy from here when you need to reference a pattern.

### Assets

`img/`, `svg/`, `video/` hold talk assets. Folders prefixed with `_` (e.g. `img/_blank-metal/`) are shared across all talks — don't delete them when starting a new talk. Unprefixed files and folders are talk-specific.

### Routing

`routes/pug.routes.ts` maps every source `.pug` file to its output `.html` path. Both the main presentation and demo files must be registered here. Pug files prefixed with `_` are partials and are not routed.

### Demos

Standalone interactive demos live in `demos/`. To add one:
1. Create `demos/pug/my-demo.pug` (use `sample-demo.pug` as a template)
2. Add the route in `routes/pug.routes.ts`
3. Put styles in `demos/scss/` and scripts in `demos/js/`
4. Embed in a slide with `+demo('my-demo.html')` or `+demo('my-demo.html', width, height)`

### Styles

`scss/lemon.scss` → `css/lemon.css` — shared presentation styles that carry forward to every talk. Scoped inside `.reveal`. Things like grid utilities, table styles, `.strobe`, `.source`, blockquote styling, and other generic components belong here.

`scss/talk.scss` → `css/talk.css` — talk-specific styles. Starts empty on every new talk. Anything named after the talk's subject matter (`.metric-card`, `.cls-trap`) or specific to a single demo goes here.

`demos/scss/` → `demos/css/` — per-demo styles.

**Rule of thumb:** if you'd want the style in your *next* talk, it belongs in `lemon.scss`. If you'd only ever need it for *this* talk, it belongs in `talk.scss`.

### Reveal.js config

`js/reveal-config.js` contains `Reveal.initialize({...})` with all options and plugin registration. Plugins loaded: Markdown, Highlight, Notes, Zoom.

### Vendored reveal.js

The `reveal/` folder contains reveal.js source copied from `node_modules`. Do not edit it manually — update via `bun run update:reveal` after bumping the `reveal.js` package version.

### Build scripts

All scripts in `scripts/` are TypeScript run directly with `tsx`:
- `dev.ts` — spawns Sass watch, Pug watch (`watch-pug.ts`), and BrowserSync in parallel
- `build-pug.ts` — iterates `routes/pug.routes.ts` and compiles each Pug → HTML
- `setup.ts` — interactive prompts that update `package.json`, `pug/partials/_variables.pug`, and `README.md`
- `update-reveal.ts` — copies files from `node_modules/reveal.js` into `reveal/`
