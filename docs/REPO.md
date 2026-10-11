# Repo guide

Shared working guidance for this talk repo, read by every AI tool via the pointer files at the root (`CLAUDE.md`, `AGENTS.md`). All paths below are relative to the repo root.

## What this is

A [reveal.js](https://revealjs.com/) presentation template. Slides are authored in Pug, styled with Sass, and served as a static HTML file via BrowserSync. There is no frontend framework and no Vite. TypeScript is used in two places and nowhere else: the build scripts in `scripts/` (run via `tsx`) and demo browser scripts in `demos/ts/` (bundled by `bun build`). The two have separate tsconfigs on purpose, because one runs in Node and the other in a browser.

## Commands

```bash
bun run dev           # Start dev server (BrowserSync on :3000, UI on :3001) + Sass, Pug and TypeScript watches
bun run build         # Compile all Pug, Sass and demo TypeScript to output files
bun run build:js      # Bundle demos/ts/*.ts to demos/js/ (one-shot)
bun run watch:js      # Same, rebuilding on save
bun run setup         # Interactive CLI to configure talk title, shortname, live URL, handle and description
bun run update:reveal # Copy reveal.js files from node_modules into the vendored reveal/ folder
bun run test          # Check Sass compiles, demo TypeScript typechecks, and Pug templates render (no other test suite)
bun run check:fonts   # Warn if the deck's fonts (Yrsa, Syne, Share Tech Mono) aren't installed locally; also runs on install
```

All `npm run` equivalents work too, with one exception: `build:js` and `watch:js` shell out to `bun build`, so they need bun on PATH even under npm. Everything else is runtime-agnostic.

One trap: use `bun run test`, not `bun test`. The latter is bun's own test runner and it ignores the `test` script, exiting with an error about finding no test files. `npm test` is fine.

## Git conventions

**Never list an agent as a co-author.** No `Co-Authored-By:` trailer for Claude, Codex, or any other tool, on any commit in this repo. This overrides any default instruction an agent may have to add one.

Commit titles start with the issue number, e.g. `#42 Fix scoring bug`. `This closes #XX` lines belong in the PR description, not the commit title.

Branches are `type_NN--brief-description` where type is `issue`, `feature`, `bug`, or `chore`. For example `issue_1--docs-scaffold`.

## One line per thought

A Markdown paragraph is one line. So is a comment in Pug, TypeScript, JavaScript or Sass: one comment, one unbroken line. Never hard-wrap to a column width; the editor's soft wrap handles display. Line breaks are for structure only: list items, table rows, headings, code, a numbered or `key: value` list inside a comment, and a blank comment line between two separate comments.

## Source files vs. build output

**Never edit build output directly** — always edit the source file that generates it. Output files will be overwritten on the next build.

| To change… | Edit… | Not… |
|---|---|---|
| Shared slide content | `pug/sections/shared/` files | `*.html` |
| Talk-specific slide content | `pug/sections/_talk-content.pug` (split it into more files as the talk grows) | `*.html` |
| Demo content / markup | `demos/pug/` files | `demos/*.html` |
| Shared presentation styles (the Lemon deck system) | `scss/lemon/` partials (`scss/lemon.scss` is `@use` lines only) | `css/lemon.css` |
| Talk-specific styles | `scss/talk.scss` (and `scss/talk/` partials once it grows) | `css/talk.css` |
| Print and PDF styles | `scss/print/` | `css/print/` |
| Demo styles | `demos/scss/` files | `demos/css/` files |
| Demo scripts | `demos/ts/` files | `demos/js/` files |

## Architecture

### Slide authoring flow

`pug/index.pug` is the entry point. It includes `partials/_variables.pug` for talk metadata and includes section files from `pug/sections/`. The Pug compiler renders this to `index.html`.

A `testing` local (switches `siteURL` between `localURL` and `liveURL`, and thus which URLs the OG/Twitter meta tags resolve against) is set by whichever script does the rendering, not hardcoded in the template — see [Deployment](#deployment).

- **`pug/partials/_variables.pug`** — talk title, subtitle, `liveURL`, `localURL`, `description` and `authorHandle`. `setup` fills these in; edit them directly after that.
- **`pug/partials/_mixins.pug`** — reusable Pug mixins: `+link`, `+image`, `+videoBG`, `+introScreen`, `+demo` (builds its own `section.demo`, so a demo slide is `+demo("file.html")(data-timing="…")` with its notes in the block), `+iframe`, `+gag(description)` (a loud placeholder for a visual gag that still needs its asset), and `+bmWordmark` (Blank Metal's _M wordmark, inline so CSS can light its accents).
- **`pug/sections/`** — one file per logical section of the talk, included in `index.pug`. Shared sections in `shared/` (`_hello.pug`, `_intros.pug`, `_hit-me-up.pug`, `_thank-you.pug`) carry forward across talks — edit lightly. `_hello.pug` includes the Blank Metal intro; drop those four slides for a talk that isn't a Blank Metal one. `_talk-content.pug` is the blank canvas for this talk's slides; replace it entirely, and split it into more files as the talk grows.
- **`pug/examples/`** — `_example-slides.pug` is the Lemon catalogue: every slide template and its alternates, one family per partial in `pug/examples/catalogue/`. Not included in the build; to judge a pattern in the real deck, include it at the end of `pug/index.pug` for a while and take it out again. `_example-videos.pug` holds intro reels.

A slide can carry `data-timing` (seconds), which drives the pacing timer in reveal's speaker view; slides without one use `defaultTiming` from the config. Slides outside the main path (the intro reel, the catalogue) carry `data-timing="0"`.

### Assets

`img/`, `svg/`, `video/` hold talk assets. Folders prefixed with `_` (e.g. `img/_shared/`) are shared across all talks — don't delete them when starting a new talk. Unprefixed files and folders are talk-specific. `svg/_m/metal-hand.svg` (from the _M storybook) is the Blank Metal intro's bullet. `svg/lemon.svg`, `video/simone-thankyou-8.mp4` and the GIFs in `img/gif/` are used by the shared sections.

### Routing

`routes/pug.routes.ts` maps every source `.pug` file to its output `.html` path. Both the main presentation and demo files must be registered here. Pug files prefixed with `_` are partials and are not routed.

### Demos

Standalone interactive demos live in `demos/`. To add one:
1. Copy `demos/pug/sample-demo.pug`, `demos/scss/sample-demo.scss` and `demos/ts/sample-demo.ts`
2. Add the route in `routes/pug.routes.ts`
3. Keep the stylesheet to the demo's own subject: `demos/scss/partials/_demo-foundation.scss` owns the frame, strip, rail, controls and type
4. Embed in a slide with `+demo('my-demo.html')` or `+demo('my-demo.html', width, height)`

Demo scripts are TypeScript, bundled to `demos/js/` and loaded with `script(type="module" src="js/my-demo.js?updated="+lastUpdated)`. `type="module"` is required — the bundler emits ESM — and it earns its keep, since modules are deferred by spec so a demo can query the DOM at the top level with no `DOMContentLoaded` wrapper.

Shared modules go in `demos/ts/partials/` with a `_` prefix. The bundler inlines them into whichever demos import them, so they never get a file of their own.

**Adding a new `demos/ts/` file needs a `bun run dev` restart.** The entry glob is expanded by the shell once, when the watcher spawns, so a brand new file is invisible until then. Editing existing files is fine, partials included — the watcher follows the module graph and rebuilds every entry that imports a changed partial.

[`demos/demos.md`](../demos/demos.md) has the rest.

### TypeScript configs

Two, deliberately not sharing an `extends`, because they describe different environments:

- `tsconfig.json` — the build scripts. Node-only: `lib: ["ES2020"]`, `types: ["node"]`, covering `scripts/`, `routes/`, `types/`.
- `tsconfig.demos.json` — demo browser scripts. `lib: ["ES2022", "DOM", "DOM.Iterable"]`, `types: []`, `noEmit`, covering `demos/ts/`.

They should drift. Widening `lib` for a build script must not silently widen what demo code may call.

**Do not remove `"types": []` from `tsconfig.demos.json`.** Omitting the field does not mean "no ambient types", it means "everything under `node_modules/@types`" — so `process.cwd()` would typecheck clean in a file destined for a browser iframe. That one line is what makes the wall real.

`bun build` strips types without checking them and exits 0 on code that does not typecheck, so `bun run test` is the only thing standing between a type error and a broken demo.

### Styles

The deck is styled by the Lemon deck system, with no reveal theme. **[`docs/LEMON-DECK.md`](LEMON-DECK.md) is the guide**: the canvas and units, colour tokens, type roles, the spine, every template, and motion. [`DESIGN.md`](../DESIGN.md) is the visual contract for both the deck and the demos.

`scss/lemon.scss` → `css/lemon.css` — the Lemon deck system, shared by every talk. The entry file holds only `@use` lines; the rules live in `scss/lemon/` (abstracts, base, layout, components, templates, motion, and `todo/_shame.scss` for anything needing `!important`). It owns the sensible defaults: the palette as `--lemon-*` tokens, type roles, the canvas, the spine, code, tables, quotes, grids, embeds, slide templates and motion.

`scss/talk.scss` → `css/talk.css` — this talk's own surfaces. It starts empty on every new talk. Anything named after the talk's subject matter, or specific to a single slide, goes here. A talk retunes Lemon's colours by redeclaring `--lemon-*` properties here.

Inside a slide, sizes are in `cqw`/`cqh` (the slide canvas is a size container) or `em`, never px or `vw`/`vh`. LEMON-DECK.md explains why.

`demos/scss/` → `demos/css/` — demo styles. Every demo `@use`s `partials/_demo-foundation.scss`, which shares Lemon's tokens from `scss/lemon/base/_root.scss`.

**Rule of thumb:** if you'd want the style in your *next* talk, it belongs in `lemon.scss`. If you'd only ever need it for *this* talk, it belongs in `talk.scss`.

### Reveal.js config

`js/reveal-config.js` contains `Reveal.initialize({...})` with all options and plugin registration. Plugins loaded: Markdown, Highlight, Notes, Zoom. The canvas (1280×720, `margin: 0`), `display: "grid"`, `center: true` and `transition: "lemon"` are all load-bearing for the Lemon deck system; LEMON-DECK.md says why. `defaultTiming` is set so the speaker view's pacing timer shows.

Two scripts load before the config: `js/line-numbers.js` gives every code block line numbers before reveal reads it, and `js/spine.js` grows the spine in when you arrive from a slide without one.

### Vendored reveal.js

The `reveal/` folder contains reveal.js source copied from `node_modules` and committed, because the deployed site has no `node_modules`. Do not edit it by hand. To update:

1. Bump the package: `bun update reveal.js`
2. Copy `dist/` and `plugin/` into `reveal/`: `bun run update:reveal`
3. Walk the deck (with the catalogue included) before committing `reveal/` and `package.json`

The Lemon deck system leans on reveal internals that can shift between versions (`display` written inline, the transition name added as a class, auto-animate measuring with `getBoundingClientRect` under `center: true`), so check a spine number travelling with auto-animate and a few dissolves in particular.

### Build scripts

All scripts in `scripts/` are TypeScript run directly with `tsx`:
- `dev.ts` — spawns four children in parallel: Sass watch (deck, talk, print and demo styles), Pug watch (`watch-pug.ts`), `bun build --watch` for demo TypeScript, and BrowserSync. Each reports readiness by a string match on its own output, and the success banner waits for all four
- `build-pug.ts` — iterates `routes/pug.routes.ts` and compiles each Pug → HTML, rendering with `testing: false` so `siteURL` resolves to `liveURL`. Run with `--check` (via `bun run check:pug`, part of `bun run test`) to render every route without writing output, catching template errors
- `watch-pug.ts` — the same, on save, rendering with `testing: true` so `siteURL` resolves to `localURL`
- `setup.ts` — interactive prompts that update `package.json`, `pug/partials/_variables.pug`, and `README.md`, then rebuild the HTML
- `update-reveal.ts` — copies files from `node_modules/reveal.js` into `reveal/`
- `check-fonts.ts` — runs on `postinstall` (and as `bun run check:fonts`): warns when Yrsa, Syne or Share Tech Mono isn't installed locally, so the deck stays right offline. Always exits 0 and is silent when `CI` is set

## Deployment

The deployed site at `https://ahoylemon.github.io/<talk>/` is how a deck is distributed: it should look right on a screen, and that's the whole job. PDF export isn't a goal. Reveal's `?print-pdf` view and the print stylesheets still exist, but nothing is tuned or tested for them.

`.github/workflows/test.yml` runs `bun run test` and `bun run build` on every push and PR to `main`. `.github/workflows/deploy.yml` re-runs the same test-then-build gate on every push to `main`, then stages a GitHub Pages artifact from an allowlist (`index.html`, `favicon.ico`, `og-image.png`, `css/`, `js/`, `reveal/`, `svg/`, `video/`, `favicons/`, `img/`, and `demos/`'s built `*.html`/`css/`/`js/` — not `demos/pug/`, `demos/scss/`, or `demos/ts/` source) and deploys it via `actions/deploy-pages`.

**A new talk has to switch Pages on once:** Settings → Pages → Source → GitHub Actions. Until then the deploy job skips itself (it checks `github.event.repository.has_pages`), so the first pushes don't fail; the test workflow still runs.

The site deploys to a GitHub Pages **project** site (`https://<user>.github.io/<talk>/`), not a domain root, which is why `+image()`, `_favicons.pug`, and `_social.pug` all use document-relative paths (no leading `/`) rather than root-absolute ones — `index.html` always sits at the root of wherever it's served, so a relative path resolves correctly under both `http://localhost:3000/` and the `/<talk>/` subpath. `liveURL` needs its trailing slash for the same reason; `setup` adds one if it's missing.
