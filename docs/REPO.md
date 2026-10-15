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
bun run test          # Sass compiles, both TypeScript configs typecheck, the script tests (scripts/*.test.ts) pass, and every Pug route renders
bun run check:fonts   # Warn if the deck's fonts (Yrsa, Syne, Share Tech Mono) aren't installed locally; also runs on install
```

All `npm run` equivalents work too. Both runtimes are required: the scripts run on Node through `tsx` (and some chain `npm run`), and `build:js` / `watch:js` shell out to `bun build`.

One trap: use `bun run test`, not `bun test`. The latter is bun's own test runner: it ignores the `test` script and runs only the `*.test.ts` files, under bun instead of Node. `npm test` is fine.

## Git conventions

**Never list an agent as a co-author.** No `Co-Authored-By:` trailer for Claude, Codex, or any other tool, on any commit in this repo. This overrides any default instruction an agent may have to add one.

Commit titles start with the issue number, e.g. `#42 Fix scoring bug`. `This closes #XX` lines belong in the PR description, not the commit title.

Branches are `type_NN--brief-description` where type is `issue`, `feature`, `bug`, or `chore`. For example `issue_1--docs-scaffold`.

## One line per thought

A Markdown paragraph is one line. So is a comment in Pug, TypeScript, JavaScript or Sass: one comment, one unbroken line. Never hard-wrap to a column width; the editor's soft wrap handles display. Line breaks are for structure only: list items, table rows, headings, code, a numbered or `key: value` list inside a comment, and a blank comment line between two separate comments.

## Source files vs. build output

**Never edit build output directly** — always edit the source file that generates it. Output files will be overwritten on the next build.

**Build output is never committed.** Everything in the "Not…" column is gitignored: `bun run dev` renders every route, compiles the Sass and bundles the demo scripts when it starts, `bun run build` does the same once, and the deploy workflow builds it fresh. A fresh clone has no `index.html` until one of those runs.

| To change… | Edit… | Not… |
|---|---|---|
| Shared slide content | `pug/sections/shared/` files | `*.html` |
| Talk-specific slide content | your own files in `pug/sections/`, included from `pug/index.pug` in place of the catalogue | `*.html` |
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
- **`pug/partials/_mixins.pug`** — reusable Pug mixins: `+link`, `+image`, `+videoBG`, `+introScreen`, `+demo` (builds its own `section.demo`; its block holds the notes), `+iframe`, `+gag` and `+bmLogo`. LEMON-DECK.md says when to use each.
- **`pug/sections/`** — one file per logical section of the talk, included in `index.pug`. Shared sections in `shared/` (`_hello.pug`, `_intros.pug`, `_hit-me-up.pug`, `_thank-you.pug`) carry forward across talks — edit lightly. `_hello.pug` includes the Blank Metal intro (`_blank-metal.pug`); delete that include for a talk that isn't a Blank Metal one. The talk's own slides go in new files here.
- **`pug/examples/`** — `_example-slides.pug` is the Lemon catalogue: every slide template and its alternates, one family per vertical stack in `pug/examples/catalogue/`. A fresh talk includes it as its starting content between the shared intro and outro; copy what you need into `pug/sections/`, then swap the include in `pug/index.pug` for your own. `_example-videos.pug` holds intro reels.

A slide can carry `data-timing` (seconds) for the speaker view's pacing timer; without one it uses `defaultTiming`. `js/stacks.js` lets a vertical stack set `data-timing` or `data-spine` once for all its slides (LEMON-DECK.md has the details).

### Assets

`img/`, `svg/`, `video/` hold talk assets. Folders prefixed with `_` (e.g. `img/_shared/`) are shared across all talks — don't delete them when starting a new talk. Unprefixed files and folders are talk-specific. `svg/_m/metal-hand.svg` (from the _M storybook) is the Blank Metal intro's bullet, and `img/_shared/` holds the hit-me-up photos. `svg/lemon.svg`, `video/simone-thankyou-8.mp4` and the GIFs in `img/gif/` are used by the shared sections.

### Routing

`routes/pug.routes.ts` maps every source `.pug` file to its output `.html` path. Both the main presentation and demo files must be registered here. Pug files prefixed with `_` are partials and are not routed.

### Demos

Standalone interactive demos live in `demos/`, embedded with `+demo('my-demo.html')`. [`demos/demos.md`](../demos/demos.md) covers adding one, the shared demo foundation, and demo scripts (including the restart a new `demos/ts/` file needs).

### TypeScript configs

Two, deliberately not sharing an `extends`, because they describe different environments:

- `tsconfig.json` — the build scripts. Node-only: `lib: ["ES2020"]`, `types: ["node"]`, covering `scripts/`, `routes/`, `types/`.
- `tsconfig.demos.json` — demo browser scripts. `lib: ["ES2022", "DOM", "DOM.Iterable"]`, `types: []`, `noEmit`, covering `demos/ts/`.

They should drift. Widening `lib` for a build script must not silently widen what demo code may call.

**Do not remove `"types": []` from `tsconfig.demos.json`.** Omitting the field does not mean "no ambient types", it means "everything under `node_modules/@types`" — so `process.cwd()` would typecheck clean in a file destined for a browser iframe. That one line is what makes the wall real.

`bun build` and `tsx` strip types without checking them, so `bun run test` (which typechecks both configs) is the only thing standing between a type error and a broken demo or build script.

### Styles

The deck is styled by the Lemon deck system, with no reveal theme. [`docs/LEMON-DECK.md`](LEMON-DECK.md) is the working guide and [`DESIGN.md`](../DESIGN.md) is the visual contract.

- `scss/lemon.scss` → `css/lemon.css`: the Lemon deck system, `@use` lines only over `scss/lemon/`. Shared by every talk.
- `scss/talk.scss` → `css/talk.css`: this talk's own surfaces, and any `--lemon-*` retuning. Starts empty.
- `demos/scss/` → `demos/css/`: demo styles, each over `partials/_demo-foundation.scss`.

Inside a slide, sizes are `cqw`/`cqh` or `em`, never px or `vw`/`vh`.

**Rule of thumb:** if you'd want the style in your *next* talk, it belongs in `lemon.scss`. If you'd only ever need it for *this* talk, it belongs in `talk.scss`.

### Reveal.js config

`js/reveal-config.js` holds `Reveal.initialize({...})`: only the options that differ from reveal's defaults, plus the plugins (Markdown, Highlight, Notes, Zoom). LEMON-DECK.md says which ones the deck relies on.

Three scripts load before the config: `js/line-numbers.js` gives every code block line numbers before reveal reads it, `js/stacks.js` hands a stack's `data-timing` and `data-spine` to its slides, and `js/arrivals.js` slides the spine (and a Blank Metal split's white side) in when you arrive from a slide without one.

### Vendored reveal.js

The `reveal/` folder contains reveal.js source copied from `node_modules` and committed, because the deployed site has no `node_modules`. Do not edit it by hand. To update:

1. Bump the package: `bun update reveal.js`
2. Copy `dist/` and `plugin/` into `reveal/`: `bun run update:reveal`
3. Walk the deck (the catalogue covers every template) before committing `reveal/` and `package.json`

The Lemon deck system leans on reveal internals that can shift between versions (`display` written inline, the transition name added as a class, auto-animate measuring with `getBoundingClientRect` under `center: true`), so check a spine number travelling with auto-animate and a few dissolves in particular.

### Build scripts

All scripts in `scripts/` are TypeScript run directly with `tsx`:
- `dev.ts` — spawns four children in parallel: Sass watch (deck, talk, print and demo styles), Pug watch (`watch-pug.ts`), `bun build --watch` for demo TypeScript, and BrowserSync. Each reports readiness by a string match on its own output, and the success banner waits for all four
- `build-pug.ts` — iterates `routes/pug.routes.ts` and compiles each Pug → HTML, rendering with `testing: false` so `siteURL` resolves to `liveURL`. Run with `--check` (via `bun run check:pug`, part of `bun run test`) to render every route without writing output, catching template errors
- `watch-pug.ts` — the same, on save, rendering with `testing: true` so `siteURL` resolves to `localURL`
- `setup.ts` — interactive prompts that update `package.json`, `pug/partials/_variables.pug`, and `README.md`, then rebuild the HTML
- `update-reveal.ts` — copies files from `node_modules/reveal.js` into `reveal/`
- `check-fonts.ts` — runs on `postinstall` (and as `bun run check:fonts`): warns when Yrsa, Syne or Share Tech Mono isn't installed locally, so the deck stays right offline. Always exits 0 and is silent when `CI` is set

Tests for script logic sit beside the scripts as `*.test.ts` (Node's test runner, through `tsx --test`), like `pug-vars.test.ts` for setup's substitution into `_variables.pug`.

## Deployment

The deployed site at `https://ahoylemon.github.io/<talk>/` is how a deck is distributed: it should look right on a screen. PDF export isn't a goal, so nothing is tuned or tested for `?print-pdf`.

`.github/workflows/test.yml` sets up Node and Bun, then runs `npm run test` and `npm run build` on every push and PR to `main`. `.github/workflows/deploy.yml` re-runs the same test-then-build gate on every push to `main`, then stages a GitHub Pages artifact from an allowlist (`index.html`, `favicon.ico`, `og-image.png`, `css/`, `js/`, `reveal/`, `svg/`, `video/`, `favicons/`, `img/`, and `demos/`'s built `*.html`/`css/`/`js/` — not `demos/pug/`, `demos/scss/`, or `demos/ts/` source) and deploys it via `actions/deploy-pages`.

**A new talk has to switch Pages on once:** Settings → Pages → Source → GitHub Actions. Until then the deploy job skips itself (it checks `github.event.repository.has_pages`), so the first pushes don't fail; the test workflow still runs.

It's a Pages **project** site, served from `/<talk>/` rather than a domain root, so asset paths are document-relative (no leading `/`) and `liveURL` keeps its trailing slash (`setup` adds one).
