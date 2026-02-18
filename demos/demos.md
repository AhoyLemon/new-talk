## To add a new demo...

- Create a new Pug file in the `demos/pug/` directory.
  - You can use the existing `sample-demo.pug` as a template.
- Add the input and output to `routes/pug.routes.ts`
- scss goes in `demos/scss/`
- js goes in `demos/js/`

## To Use A Demo

You can use the `demo` mixin by declaring the filename and optional width/height.

```pug
+demo('sample-demo.html') // default size: 1280x600
// or
+demo('sample-demo.html', 800, 400) // custom size: 800x400
```
