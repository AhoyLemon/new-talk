# The Lemon deck system

How every Lemon talk deck looks and moves, and how to build slides in it.

[`DESIGN.md`](../DESIGN.md) is the visual contract (tokens, rules, recorded exceptions) for both the deck and the demos. This file is the working guide: where things live, which template to reach for, and the traps. [`pug/examples/_example-slides.pug`](../pug/examples/_example-slides.pug) is the catalogue, with every template in it.

## Lemon owns defaults, the talk owns its own surfaces

- **`scss/lemon.scss`** (over `scss/lemon/`) owns the sensible defaults every talk gets: the palette as tokens, type roles, the canvas, the spine, everyday components (code, tables, quotes, grids, figures, embeds, credits, gag placeholders), slide templates and motion. If you'd want it in your next talk, it goes here.
- **`scss/talk.scss`** owns surfaces that are new to this talk and unlikely to recur. It starts empty. As it grows, keep it to `@use` lines over partials in `scss/talk/`.

There is no reveal theme. `reveal/reset.css` and `reveal/reveal.css` stay, because they're structure. The theme files in `reveal/theme/` are vendored but never linked.

## Files

| Path | What it holds |
|---|---|
| `scss/lemon/abstracts/` | `_variables.scss` (every decided value, with each custom property bound to a Sass variable once) and `_mixins.scss` (`on-field`, `aside`, `visually-hidden`). Abstracts emit no CSS. |
| `scss/lemon/base/` | `_root.scss` (the `--lemon-*` tokens), `_canvas.scss` (the slide box), `_type.scss` (default type), `_browser.scss` (selection, focus, links, reveal's arrows and slide number) |
| `scss/lemon/layout/_spine.scss` | The spine |
| `scss/lemon/components/` | Code and its syntax palette, tables, blocks (grid, quote, figure, credits, kbd), embeds (`.iframe-holder`), the loud effects, gag placeholders, and the Blank Metal pieces |
| `scss/lemon/templates/` | Cover and hello, statement, divider, demo, over-media, reference (metric, Q&A, links, contact table) |
| `scss/lemon/motion/` | The dissolve, landing fragments, auto-animate |
| `scss/lemon/todo/_shame.scss` | The few rules that need `!important` (print, and reduced motion inside auto-animate) |
| `js/line-numbers.js` | Gives every code block line numbers before reveal starts |
| `js/stacks.js` | Stack-level defaults: a vertical stack's `data-timing` and `data-spine` apply to every slide in it |
| `js/arrivals.js` | Slides the spine (and a Blank Metal split's white side) in when you arrive from a slide without one, and lands a spine card's label on the band |
| `pug/examples/_example-slides.pug` | The catalogue: an index over `pug/examples/catalogue/`, one vertical stack per family. A fresh talk's starting content. |

## The canvas, and why there are no px

The deck is a 1280×720 canvas (`width`, `height` and `margin: 0` in `js/reveal-config.js`). Reveal lays slides out on that canvas and then scales the whole thing with one `transform: scale()`, so the canvas is the only honest ruler.

`.reveal .slides` is a size container, and everything inside a slide is sized in `cqw` and `cqh` (percentages of the canvas) or in `em` off the slide's root size (`3.125cqw`, which is 40px at 1280).

- **No px inside slides.** A template has to survive a talk with a different canvas (1420 or 1920 wide, say), and px tuned to 1280 break the moment it moves.
- **No `vw`/`vh` inside slides.** They measure the browser window, not the slide, and then reveal's transform scales them a second time, so their proportions drift with every display.
- **Viewport units only for window-space chrome**: reveal's arrows, slide number and progress bar, which sit on the window rather than the canvas.

The exceptions are numbers that aren't sizes: a demo iframe keeps the CSS-pixel frame its demo was designed for, and SVG diagrams use their own viewBox units. `--lemon-canvas-w` and `--lemon-canvas-h` in `base/_root.scss` repeat the canvas size as plain numbers, so demo scaling can do arithmetic with them. A talk with a different canvas sets both, alongside `width` and `height` in the config.

## Colour

The palette is Ink, Cream, Focus Yellow, Rust, Mustard and Wheat, as `--lemon-*` custom properties on `:root`. Templates never read a palette name directly; they read roles: `--lemon-ground`, `--lemon-text`, `--lemon-text-quiet`, `--lemon-line`, `--lemon-touch`, `--lemon-field`, `--lemon-on-field`, `--lemon-fold`, `--lemon-spine-ground`, `--lemon-code-surface`, `--lemon-code-frame`.

A talk retunes by redeclaring any of these on `:root` in its own `talk.scss`:

```scss
:root {
  --lemon-field: var(--lemon-rust);
}
```

The rules for using them (One Watch, Tint Not Fill) are in DESIGN.md.

## Type

Three faces, loaded from Google Fonts in `pug/partials/_head.pug` (and in `demos/pug/partials/_head.pug` for the demos):

- **Syne** does the everyday work, never above weight 600.
- **Yrsa** is rationed to a few moments (DESIGN.md lists them).
- **Share Tech Mono** is for code and numbers, and also for asides and jokes: `p.aside` is the voice of "(I make websites.)".

`bun install` runs `scripts/check-fonts.ts` (also `bun run check:fonts`), which warns when any of the three isn't installed locally. With no network the browser falls back to an installed font of the same name, so installing them is what keeps a deck right offline. It never fails the install and is silent in CI.

## The spine

A solid dark band down the left edge, like the spine of a cassette's J-card. It carries a summary of the section it belongs to: a number at the top and a label running up the band.

**A section gets a spine only when it's about one thing that can be summarised there.** Everything else runs edge to edge, so the band is never decoration. Opt in with `.has-spine` on every slide of the section, and put the summary in a `.spine-tag` holding a `p.spine-number` and a `.spine-label`:

```pug
section.has-spine(data-auto-animate)
  .spine-tag
    p.spine-number(data-id="SpineNumber") 01
    code.spine-label(data-id="SpineLabel") one thing
  h3 The content sits beside the band
```

With `data-auto-animate` on each slide and `data-id` on the number and label, they hold still while the content changes. The band is the slide's own `::before`, so it travels with its slide, and its shadow carries it past the canvas into any letterboxing. Arriving from a slide without a spine, it slides in from the left edge: `js/arrivals.js` sets `.spine-arrives` on that step only.

**A whole stack on the spine.** When a vertical stack is one concept, set it once on the stack instead of writing a `.spine-tag` into every slide: `js/stacks.js` gives every slide in it the spine, numbered by the stack's place among spine stacks (or `data-spine-number`), labelled with `data-spine`. Put `data-spine-section` on the slide where a subsection starts and the label reads "Label › Subsection" from there on. Dividers, spine cards, slides that already have a spine, Blank Metal slides and anything marked `.no-spine` keep their own left edge. The catalogue does this for every family, so the spine always says where you are while you browse:

```pug
section(data-spine="Show it")
  section.divider
    h2 Show it
  section(data-spine-section="Images")
    +image("photo.jpg")
  section(data-spine-section="Grids")
    .grid(data-columns="2")
```

It's optional, like every spine: use it when a stack is one idea you want the room to keep in mind.

Open the section with a **spine card** and the summary is handed to the band. The card sets the number and label big in the middle of the slide; auto-animate into the first spine slide and the band slides in, reveal shrinks the number into place, and `js/arrivals.js` turns the label on its side, shrinks it and lands it:

```pug
section.spine-card(data-auto-animate)
  p.spine-number(data-id="SpineNumber") 01
  code.spine-label one thing
```

The card's label gets no `data-id` on purpose: reveal's auto-animate morphs boxes, not rotation or writing mode, so the script does that move.

## Templates

Each template is a class on the `section`. A slide with no template class still gets the canvas: content down the left edge, centred vertically. The catalogue shows every one, with alternates stacked under it.

| Class | Use it for | Notes |
|---|---|---|
| `.cover` | The first slide, and optionally the last | Byline at the top (`.a-talk-by`), title set low in Yrsa, subtitle as an aside. The lemon slide wears it too, so the deck ends where it started. |
| `.hello` | "Hi!" | Yrsa at billing scale, name under it, parenthetical as an aside |
| `.statement` | One sentence, placed | Hangs from a fixed line high on the panel, flush left. A following `p` is the kicker; `p.aside` makes it a mono aside. Several `h2`s stack as a build. `.is-shout` is the loud register, in Yrsa. `.lead-in` puts a quiet setup line before the heading. |
| `.divider` | A new section of the talk | A Mustard field floods the left 40%, wall to wall, with the name high in it in Yrsa; the promise sits low on the right. A name longer than the field runs on past its edge in the field's colour. Must never look like anything that counts. |
| `.spine-card` | Opening a section that gets a spine | The section's number and label big in the middle, handed to the band by auto-animate (see The spine) |
| `+demo("file.html", w, h)` | A live demo | Builds its own `section.demo`; the iframe keeps its own frame and scales as one piece to fit beside the spine (or the whole canvas, without one) |
| `.over-media` | A photo, GIF or video owning the canvas | Put the media in a reveal `data-background-*`. The heading rides on a cream strip low on the left; a `p` rides on an ink strip. `.thanks` sets the heading in Yrsa. |
| `+gag("description")` | A visual gag whose asset you haven't found yet | A loud dashed placeholder in the over-media layout. Swap the asset in as the slide's `data-background-*` and drop the mixin. |
| `dl.metric` | A term worth defining | The term in Yrsa at billing scale, its name in Mustard, one line of meaning |
| `.q-and-a` | The questions people actually ask | `dt` with `strong Q:`, `dd` with `strong A:` |
| `ul.links` | Resources | `strong` for what it is, then an ordinary link (`a` or `+link`) for where it lives |
| `.bm`, `.bm-hello`, `.bm-split` | The Blank Metal intro in `pug/sections/shared/_blank-metal.pug` | `+bmLogo` draws the stacked _M logo inline; on `.bm-hello` it ignites a beat after arrival. `.bm-split` puts a 40cqw ink panel beside `.bm-content` on white, which slides in from the right. `.bm-label` (with a `data-id`) holds still across them; `.bm-role` is a quiet line before a heading; `ul.bm-hands` bullets are metal hands that nod as they land. |

### Components

- **Code**: `pre > code` sits in a frame on a barely lifted surface, with line numbers on every block (`js/line-numbers.js`). `pre(data-file="name.css")` puts a filename tab on the frame's top edge. Highlight steps (`data-line-numbers="1-3|5-7"`) dim the other lines. `pre.huge` for a single big line.
- **Tables**: loose by default, `.dense` for a dozen rows that get talked through. The `caption` is the table's title, in Syne; `th` are small mono capitals; `tr.highlight` is a faint yellow tint, never a solid block.
- **Grids**: `.grid(data-columns="2|3|4")`, or `data-columns="2-1"` / `"1-2"` for an uneven split. A `.column` inside holds a small heading, a sentence or two, and maybe a code block. A `figure` in a grid sits flush left, so its caption lines up under the image.
- **Quote**: `blockquote` with an optional `cite`. The mark sits inside the block in Mustard; the cite is indented in Yrsa italic.
- **Embeds**: `.iframe-holder > iframe` is a 16:9 hole for YouTube, CodePen or a live site, capped to the safe area. `+iframe(url, w, h)` embeds a page at its own size.
- **Credits**: `.source` or `cite.credit`, low on the panel on an ink strip, fading in a beat after the slide arrives.
- **Effects**: `.strobe` cycles a word through the palette, for the slide that wants to be loud on purpose. `.blink` blinks a word like an eye: still, then two quick blinks every few seconds.
- **Busy backgrounds**: put `data-background-opacity` (around `0.35`) on a slide whose picture fights the words on it; the Ink ground shows through and the words stay readable.

## Motion

- **Between slides: one dissolve.** The custom `lemon` transition (`transition: "lemon"` in the config; reveal adds the name as a class and `motion/_transitions.scss` does the rest) clears the outgoing slide quickly and brings the next one in a beat later. Nothing flies. Moving down a stack dissolves faster than moving to the next idea.
- **Reveal's own transitions, when the move means something.** Because the default never flies, a slide that does says something. `data-transition` on a section asks for one of reveal's, and Lemon's rules step aside for it. The catalogue's Transitions family shows each where its move earns it:
  - `none` is a smash cut, for a punchline that can't wait a frame.
  - `fade` with `data-transition-speed="slow"` says time passed.
  - `slide` pushes the steps of one sequence along.
  - `convex` turns the cube to another side of the same thing.
  - `concave` folds inward, from the surface into how it works.
  - `zoom` dives into one detail of what came before.
  - A pair like `zoom-in fade-out` arrives one way and leaves another.
  - `data-transition-speed="fast"` or `"slow"` changes the pace of any transition.
  - `data-background-transition` moves a slide's picture separately from its words.
- **Fragments land**: a short rise and a fade, the rise eased on a recorded spring (`$spring`, all 87 samples). `.fragment.bounce` drops in from above and lets the spring's overshoot bounce it. `.fragment.strike` draws a Rust line through its text. `.fragment.mark` sweeps Focus Yellow behind a word.
- **Auto-animate** carries an element from one slide to the next. To move text crisply, match it with `data-id` on a `p` (or a heading or `li`) at both ends: reveal then animates its font-size alone. Matched on any other element, it scales the element *and* animates its font-size, and the text balloons before it settles.
- Slides and fragments animate only `transform`, `translate`, `scale`, `rotate` and `opacity`, so the compositor does the work. DESIGN.md lists the deliberate exceptions.

## Reveal config the system relies on

- `width: 1280, height: 720, margin: 0`: the canvas.
- `display: "grid"`: reveal writes `display` inline on every visible slide, so the slide grid has to come from the config. A `display` in CSS loses.
- `center: true`: it never actually centres anything, because every Lemon slide is exactly canvas-tall, so reveal's centring offset is zero. What it buys is auto-animate measuring with `getBoundingClientRect`. With `center: false` reveal measures `offsetLeft` against each element's own offset parent, and anything travelling between two differently positioned parents (a number moving into the spine) flies to the wrong place.
- `transition: "lemon"`.
- `defaultTiming` non-null, so the speaker view's pacing timer shows. A slide sets its own with `data-timing` (seconds), or a whole stack sets one for all its slides (`js/stacks.js`): the intro reel's stack uses `data-timing="0"` so its reels don't count.
- Script order in `pug/partials/_javascripts.pug`: anything that rewrites slides (`line-numbers.js`, `stacks.js`) or listens on `.reveal` (`arrivals.js`) loads after reveal's plugins and before `reveal-config.js`.

## Using the catalogue

A fresh talk starts with the catalogue as its content: `pug/index.pug` includes `pug/examples/_example-slides.pug` between the shared intro and outro. Each family in `pug/examples/catalogue/` is one vertical stack that opens with a divider and carries its name (and the current subsection) on the spine; walk down a stack to see each template and its alternates. Each slide's notes name the class and the partial that styles it. Copy what you need into your own files in `pug/sections/`, then swap the catalogue's include for yours. When you add a template to Lemon, add it to the catalogue in the same commit.
