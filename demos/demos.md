## To add a new demo...

- Copy `sample-demo.pug`, `sample-demo.scss` and `sample-demo.ts`. They are the skeleton: `#app.demo-frame` holding a stage, an optional context strip and an optional control rail.
- Add the input and output to `routes/pug.routes.ts`
- scss goes in `demos/scss/`. Start it with `@use "partials/demo-foundation" as demo;` and keep the file to that demo's own subject, composition, keyframes and lesson states.
- TypeScript goes in `demos/ts/`, and is bundled to `demos/js/`. Shared helpers live in `demos/ts/partials/` (`_range.ts` wires up the range picker).

## The demo foundation

`demos/scss/partials/_demo-foundation.scss` gives every demo the same ground as the deck: Lemon's `--lemon-*` tokens (shared from `scss/lemon/base/_root.scss`, not copied), the three faces, an Ink page, and a frame sized for `+demo`'s 1280 × 600 iframe. The frame is a stage, then a cream context strip naming the API or idea, then a Rust control rail. The rail's controls are `.demo-trigger` (the run button), `.stage-action`, `label.demo-toggle` and `label.demo-range`, all with hover, focus-visible and active states. The `reduce-motion` and `visually-hidden` mixins come with it.

Demos are real pages in an iframe, not slides on the canvas, so px and viewport units are fine in demo styles.

## Demo scripts

One file per demo in `demos/ts/`, each its own bundle entry. A demo that needs no script has no file here and no script tag. Load a script from the demo's Pug with:

```pug
script(type="module" src="js/my-demo.js?updated="+lastUpdated)
```

`type="module"` is required, because the bundler emits ESM. It also means the script is deferred, so you can query the DOM at the top level without a `DOMContentLoaded` wrapper. The `?updated=` query is the same cache-bust the main deck uses. Demo iframes cache hard, and a live talk is a bad time to find that out.

Shared modules go in `demos/ts/partials/` with a `_` prefix. They get inlined into whichever demos import them and never build to a file of their own.

The JavaScript build uses `demos/ts/` as Bun's entry root so every bundle lands directly at `demos/js/<demo-name>.js`. Keep that root in place: the Pug templates load that flat `js/<demo-name>.js` path.

**Adding a new file in `demos/ts/` needs a `bun run dev` restart.** The entry glob is expanded once when the watcher spawns, so a brand new file is invisible to it until you restart. Editing existing files is fine, partials included.

Types are stripped without being checked, so `bun build` will happily bundle code that does not typecheck. Run `bun run test` to actually check it.

## To use a demo

You can use the `demo` mixin by declaring the filename and optional width/height.

```pug
+demo('sample-demo.html') // default size: 1280x600
// or
+demo('sample-demo.html', 800, 400) // custom size: 800x400
```
