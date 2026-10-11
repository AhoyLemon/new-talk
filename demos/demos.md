## To add a new demo...

- Create a new Pug file in the `demos/pug/` directory.
  - You can use the existing `sample-demo.pug` as a template.
- Add the input and output to `routes/pug.routes.ts`
- scss goes in `demos/scss/`
- TypeScript goes in `demos/ts/`, and is bundled to `demos/js/`

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
