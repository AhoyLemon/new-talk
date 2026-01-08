# reveal.js Update Process

## Current Version

reveal.js v5.2.1 (last updated: January 8, 2026)

## How It Works

This project uses reveal.js as an npm dependency but commits the files to git for deployment.

### Structure

```
reveal/                    # Committed to git
├── reveal.js             # Main reveal.js file
├── reveal.css            # Main reveal.js styles
├── reset.css             # CSS reset
├── theme/                # Reveal.js themes
│   ├── blood.css
│   ├── white.css
│   └── ...
└── plugin/               # Reveal.js plugins
    ├── highlight/
    ├── markdown/
    ├── notes/
    └── ...
```

### Why Not Use node_modules Directly?

- `node_modules/` is gitignored (not committed to git)
- Production deployments wouldn't have access to reveal.js files
- Committing `reveal/` ensures files are always available

## Updating reveal.js

When a new version of reveal.js is released:

1. **Update the npm package:**
   ```bash
   npm update reveal.js
   ```

2. **Copy the new files:**
   ```bash
   npm run update:reveal
   ```

3. **Test the changes:**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 and verify everything works

4. **Commit the changes:**
   ```bash
   git add reveal/ package.json package-lock.json
   git commit -m "Update reveal.js to v5.x.x"
   ```

## What Gets Copied

The `npm run update:reveal` script copies:

- All files from `node_modules/reveal.js/dist/` → `reveal/`
- All files from `node_modules/reveal.js/plugin/` → `reveal/plugin/`

This includes:
- reveal.js and reveal.esm.js (with source maps)
- reveal.css and reset.css
- All official themes
- All official plugins (highlight, markdown, notes, zoom, search, math)

## Troubleshooting

### "reveal.js not found in node_modules"

Run `npm install` first to install dependencies.

### Files aren't updating

Delete the `reveal/` folder and run `npm run update:reveal` again.

### Presentation doesn't work after update

1. Check browser console for errors
2. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
3. Verify `reveal/reveal.js` exists and isn't corrupted
4. Check that pug files reference `reveal/` paths (not `node_modules/`)

## Related Files

- `scripts/update-reveal.ts` - The script that copies files
- `pug/partials/_head.pug` - Loads reveal.js CSS
- `pug/partials/_javascripts.pug` - Loads reveal.js JS
- `package.json` - Contains the reveal.js dependency version
