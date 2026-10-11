---
name: Lemon Deck
description: The look every Lemon talk starts from. A mixtape J-card on a dark stage (statements hung high and flush left, a spine down the left of any section that can be summarised in it, one dissolve between slides). Ink ground, Cream text, Focus Yellow marks the one thing to watch, Rust is where you touch. Demos share the palette as rehearsal posters (a near-black stage, a cream context strip and a rust control rail).

# deck-* values belong to the Lemon deck system: colors from scss/lemon/base/_root.scss, type and space from scss/lemon/abstracts/_variables.scss. Deck type sizes in em are em of the slide root size (deck-root-size, 40px on the 1280 canvas); cqw and cqh are fractions of the 1280 x 720 canvas.
# Unprefixed demo values are exported from demos/scss/partials/_demo-foundation.scss. Update the Sass first, then keep this frontmatter in sync.
colors:
  ink: "#141411"                                # the ground
  focus-yellow: "#ffe600"                       # the single thing to watch
  rust: "#d95a2c"                               # touch: link underlines, strikes, the demo control rail
  mustard: "#e1d36f"                            # every yellow that is not focus: the divider field, quote marks, metric names
  wheat: "#f3e6a8"                              # values in code, flat illustration accent
  cream: "#f7f0d8"                              # text, the cream strip
  cream-line: "rgba(247, 240, 216, 0.68)"       # rules and frames
  cream-muted: "rgba(247, 240, 216, 0.32)"      # the spine's fold
  deck-surface: "#22221e"                       # the spine's ground; Ink with 8% Cream, mixed in oklab
  deck-code-surface: "#1b1b17"                  # code block and filename tab ground; Ink with 4% Cream, mixed in oklab
  deck-code-frame: "rgba(247, 240, 216, 0.18)"  # the hairline frame around code
  deck-text-quiet: "rgba(247, 240, 216, 0.72)"  # secondary text, asides, table headers, line numbers

typography:
  deck-shout:
    fontFamily: "Yrsa, Georgia, serif"
    fontSize: "2.4em"
    fontWeight: 500
    lineHeight: 0.95
    letterSpacing: "-0.02em"
  deck-statement:
    fontFamily: "Syne, Avenir Next, Helvetica Neue, sans-serif"
    fontSize: "1.9em"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  deck-heading:
    fontFamily: "Syne, Avenir Next, Helvetica Neue, sans-serif"
    fontSize: "1.25em"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  deck-lead:
    fontFamily: "Syne, Avenir Next, Helvetica Neue, sans-serif"
    fontSize: "1em"
    fontWeight: 400
    lineHeight: 1.2
  deck-body:
    fontFamily: "Syne, Avenir Next, Helvetica Neue, sans-serif"
    fontSize: "0.8em"
    fontWeight: 400
    lineHeight: 1.3
  deck-aside:
    fontFamily: "Share Tech Mono, ui-monospace, monospace"
    fontSize: "0.6em"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.02em"
  deck-code:
    fontFamily: "Share Tech Mono, ui-monospace, monospace"
    fontSize: "0.7em"
    fontWeight: 400
    lineHeight: 1.4
  deck-table-header:
    fontFamily: "Share Tech Mono, ui-monospace, monospace"
    fontSize: "0.6em"
    fontWeight: 400
    letterSpacing: "0.08em"
  label-small:
    fontFamily: "Syne, sans-serif"
    fontSize: "clamp(0.82rem, 1.2vw, 0.98rem)"
    fontWeight: 400
    letterSpacing: "0.08em"

rounded:
  none: "0"

spacing:
  deck-root-size: "3.125cqw"
  deck-safe-x: "7.5cqw"
  deck-safe-y: "10cqh"
  deck-gap: "2.5cqw"
  deck-spine: "7cqw"
  deck-panel-gap: "4cqw"
  deck-fold: "0.16cqw"
  deck-divider-field: "40cqw"
  deck-statement-drop: "26cqh"
  strip-height: "44px"
  rail-height: "88px"

components:
  deck-spine:
    backgroundColor: "{colors.deck-surface}"
    textColor: "{colors.cream}"
    typography: "{typography.deck-aside}"
    width: "{spacing.deck-spine}"
  deck-statement:
    textColor: "{colors.cream}"
    typography: "{typography.deck-statement}"
  deck-shout:
    textColor: "{colors.cream}"
    typography: "{typography.deck-shout}"
  deck-divider-field:
    backgroundColor: "{colors.mustard}"
    textColor: "{colors.ink}"
    width: "{spacing.deck-divider-field}"
  deck-code-block:
    backgroundColor: "{colors.deck-code-surface}"
    textColor: "{colors.cream}"
    typography: "{typography.deck-code}"
    rounded: "{rounded.none}"
    padding: "0.9em 1.1em"
  deck-code-tab:
    backgroundColor: "{colors.deck-code-surface}"
    textColor: "{colors.deck-text-quiet}"
    rounded: "{rounded.none}"
    padding: "0.35em 0.9em 0.3em"
  deck-table-header:
    textColor: "{colors.deck-text-quiet}"
    typography: "{typography.deck-table-header}"
    padding: "0.45em 0.8em"
  deck-over-media-caption:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.deck-heading}"
    padding: "0.12em 0.35em 0.18em"
  demo-context-strip:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.ink}"
    typography: "{typography.label-small}"
    height: "{spacing.strip-height}"
  demo-control-rail:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.ink}"
    height: "{spacing.rail-height}"
  demo-run-button:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.rust}"
    typography: "{typography.label-small}"
    rounded: "{rounded.none}"
    padding: "9px 14px"
---

# Design System: The Lemon Deck

The visual contract for every talk built on this template. The working guide, with file locations and traps, is [`docs/LEMON-DECK.md`](docs/LEMON-DECK.md); the catalogue of every template is `pug/examples/_example-slides.pug`. The shared layer is `scss/lemon.scss`; a talk's own surfaces live in `scss/talk.scss`, and a talk that retunes or extends this contract records it here.

## Overview

**Creative North Star: "The Mixtape J-Card"**

A talk is a home-made tape. Sections are sides, dividers turn the tape over, and a section that's about one thing carries its summary on a spine down the left edge. The slides borrow the cassette insert's structure rather than its texture: a spine that carries the current track, a front panel where one thing is placed. There is no paper, no scan, no worn edges. The structure is what makes it a J-card.

The deck sits in a dark hall at projection scale and the presenter talks fast, so a slide carries about a dozen words and the room reads position without effort. Nothing is centred, nothing floats, nothing casts a shadow. Statements hang from the same high line on every slide, so the eye stops hunting. Size is billing: the biggest thing on a slide is structure (a number, a section name, "Hi!"), and the thing to read is set at working size beside it.

The deck uses no reveal theme. Lemon's own stylesheets draw everything over reveal's reset and core CSS. The demos share the palette, so a demo iframe sits on its slide without a seam.

**Key Characteristics:**
- One 1280 x 720 canvas, and every size inside a slide measured against it (cqw, cqh, or em of the slide root). No px, no vw or vh inside a slide.
- Ink ground, Cream text, and at most two other colours on any slide.
- Syne does the work, Share Tech Mono carries code, numbers and asides, Yrsa is rationed.
- A spine only on sections that can be summarised in it.
- Flush left, high, and placed. Never centred.
- One dissolve between slides; fragments land on a recorded spring.

## Colors

The palette (Ink, Cream, Cream Line, Cream Muted, Focus Yellow, Rust, Mustard, Wheat) is declared as `--lemon-*` custom properties on `:root`. Templates read role properties, never palette names, so a talk retunes the palette from its own `talk.scss` by redeclaring a property.

### Roles
- **Ground** (Ink): every slide's field, and the window around the canvas.
- **Text** (Cream): statements, headings, body, the code block's structure.
- **Quiet text** (Deck Text Quiet): secondary lines, asides, table headers, captions, line numbers, the cover byline.
- **Line** (Cream Line): table rules, the `kbd` frame.
- **Fold** (Cream Muted): the spine's right edge.
- **Touch** (Rust): link underlines and the strike that draws through a word.
- **Field** (Mustard) with **On field** (Ink): a slide or region that sits on a colour, like the divider's left field. A field slide carries its colour on the section itself, so it travels with the slide during the dissolve.
- **Surface** (Deck Surface): the spine's ground, a barely lifted Ink.
- **Code surface** (Deck Code Surface) and **Code frame** (Deck Code Frame): a code block's ground and its hairline frame, darker than the spine so code never reads as part of the structure.

### In code
The syntax palette is Cream for structure, Mustard for property names, Wheat for values, Rust for keywords and at-rules, and Quiet text (faded further) for comments. Focus Yellow stays off code, so it can still mean the one thing to watch. A line-highlight step dims the other lines to 32%.

### Named Rules
**The One Watch Rule.** Focus Yellow marks one thing per slide at most: a mark that sweeps behind one word, a highlighted row, the one figure the slide is about.

**The Tint Not Fill Rule.** A highlighted table row is tinted with Focus Yellow at 8 to 9% behind its text, never filled, so the row stays readable with the rest of the table.

## Typography

**Working Font:** Syne (with Avenir Next, Helvetica Neue, sans-serif) **Rationed Font:** Yrsa (with Georgia, serif) **Mono Font:** Share Tech Mono (with ui-monospace, SF Mono, Menlo, monospace)

**Character:** Syne is the talk's voice, geometric and a little odd. Share Tech Mono is the voice of code and of the thing said under the breath. Yrsa is the occasion: it appears only where a moment earns a serif, so it lands every time it shows up.

### Hierarchy
The slide root is 40px on the 1280 canvas; every step is em of that root, so the ramp scales with the canvas.
- **Shout** (Yrsa 500, 2.4em, line-height 0.95): the sentence cap, the loud register. Also the cover title, the thank-you, and the last slide's address.
- **Statement** (Syne 600, 1.9em, line-height 1.02, -0.025em, measure 17ch): one sentence, placed. Every `h2` defaults to this size.
- **Heading** (Syne 600, 1.25em): `h3`, Q&A questions, resource names, the divider promise, over-media captions, quotes.
- **Lead** (Syne 400, 1em, line-height 1.2): the reply under a statement, column heads in a grid, the table caption (at 600), metric meanings, Q&A answers.
- **Body** (Syne 400, 0.8em, line-height 1.3): paragraphs, list items, table cells. Measure 34ch.
- **Aside** (Share Tech Mono 400, 0.6em, line-height 1.35, 0.02em, Quiet text): the parenthetical, the joke, the source credit. Nothing meant to be read goes below this size.
- **Code** (Share Tech Mono 400, 0.7em, line-height 1.4): code blocks; `.huge` raises it to 1.05em for a block that is the slide. Inline code keeps its line's size and colour and changes only the face.
- **Table header** (Share Tech Mono 400, 0.6em, 0.08em, uppercase, Quiet text).
- **Billing scale** (sized off the canvas height, not the ramp): "Hi!" (Yrsa, 34cqh), a metric term (Yrsa, 30cqh), a divider name (Yrsa).

### Where Yrsa appears
The cover title, "Hi!", divider names, the shout, the thank-you, the last slide's address, a metric term, and a quote's cite in italic. Nowhere else.

### Named Rules
**The Syne Six Hundred Rule.** Syne is never set above weight 600. Past that it widens into an extended cut that is hard to read from the back of a room. Bold is 600.

**The Rationed Serif Rule.** Yrsa appears only on the moments listed above. A new slide that wants a serif has to be one of those moments.

**The Italic Is Yrsa Rule.** `em` in Syne is not italic: it turns Focus Yellow. The only italics in the deck are Yrsa's, on a quote's cite.

No uppercase in headings, no text shadow, no theme heading font. The only uppercase is the table header.

## Layout

The canvas is 1280 x 720 with `margin: 0`; reveal scales the whole canvas with one transform. `.reveal .slides` is a size container, so cqw and cqh are fractions of the canvas before scaling, and the slide root size (3.125cqw) makes em the second ruler. Viewport units and px appear only on window chrome outside the canvas (reveal's arrows, progress bar and slide number), on a demo iframe's own CSS-pixel frame, and in SVG viewBox units.

Every slide that is not a stack is a grid (reveal writes `display: grid` from the config). The safe area is 7.5cqw left and right and 10cqh top and bottom; content runs down the left edge and is centred vertically unless a template places it. Stacks are containers, never layouts.

Text is flush left everywhere, except the spine card (see Recorded exceptions). A statement hangs from a fixed line 26cqh from the top, so every statement in the deck lands in the same spot with the empty canvas underneath. A source credit sits low on the panel, 3.5cqh from the bottom, beside the spine when there is one.

**The Hang High Rule.** Statements hang from the same high line, flush left, never centred vertically and never centred horizontally. Confidence comes from placement and room, not from size.

## The spine

A solid band down the left edge (7cqw wide), like the spine of a cassette's J-card, cut off on its right by a fold line (a 0.16cqw Cream Muted rule). Its ground is the Deck Surface, a barely lifted Ink. It carries a summary of what the section is about: a number at the top in Share Tech Mono (1.6em, tabular) and a label running up the band, bottom to top, in the Aside size at 75%. Slides with a spine pad their content by the spine width plus a 4cqw panel gap.

The spine is the section's own pseudo-element, so it travels with its slide, and its colour extends past the canvas edge so a window wider than 16:9 still shows one continuous band. Arriving from a slide without a spine, it slides in from the left edge (560ms, the deck's ease-out); moving within the section never replays it.

**The Earned Spine Rule.** A section gets a spine only when it can be summarised in it. Everything else runs edge to edge, so the band is never decoration. A vertical stack that is one concept can take the spine as a whole (`data-spine` on the stack), with the label naming its current subsection.

## Elevation & Depth

Flat. Depth is tonal and slight: the spine and code surfaces are Ink with a few percent of Cream mixed in, framed by a hairline, and nothing else rises. There is no shadow vocabulary. The only `box-shadow` in the deck is a zero-blur spread that extends the spine and the divider field past the canvas edge, which is a fill, not a lift. Text on a photo rides on a Cream strip, never a text shadow.

## Shapes

Square corners everywhere, the `kbd` key included. Rules and frames are one hairline weight (0.16cqw) throughout: the fold, table rules, the code frame and tab. Ornament comes from structure (the spine, the divider field, the cream strip), not from added shapes.

## Components

### Framed code
A self-contained object: the Deck Code Surface inside a Deck Code Frame hairline, square, padded 0.9em by 1.1em, capped at 72cqh with its own scroll. Every block has line numbers, faded to half of Quiet text. A filename is a tab drawn on the frame's top edge (`pre[data-file]`), on the same surface and frame, in Quiet text at 0.82em, so the label cannot drift from its code. The surface is opaque because highlight steps stack copies of the block over each other.

### Tables
Loose by default, for a handful of rows read from the back; `.dense` tightens padding and drops cells to the Aside size for a slide that is talked through. The caption is the title, in Syne 600 at Lead size, left aligned. Column headers are the Table header style, so caption and headers never look alike. Rows are ruled with Line hairlines and numbers are tabular. A highlighted row is tinted, its text warmed toward Focus Yellow.

### Quote
A Heading-size block (26ch) with its opening mark set inside the block in Mustard and the words starting just after it. The cite is indented under them in Yrsa italic, Quiet text.

### Over-media caption
For a photo, GIF or video that owns the canvas: the heading rides on a Cream strip (Ink text, Syne 600 at Heading size, 22ch), low on the left, with an optional mono line on an Ink strip beneath. The strip is the same Cream strip the demos use for context, and it is what makes text readable on any image.

### Links, focus and selection
Links keep their text colour with a Rust underline (0.08em, offset 0.18em); hover and `:focus-visible` turn the text Focus Yellow, `:active` turns it Rust. Focus is a Focus Yellow outline (0.12em, offset 0.18em). Selection is Ink on Focus Yellow.

## Templates

### Cover
The front of the J-card. The byline sits at the top of the panel like a label, in Quiet text at the Aside size; the title is set low in Yrsa at Shout size (13ch, line-height 0.92), with an aside under it. The talk's last slide wears the same composition, so the tape ends where it started.

### Hello
"Hi!" in Yrsa at billing scale, bottom-left, with the name under it at Statement size and an aside.

### Statement
One sentence hung from the high line, flush left (see Layout). A reply may follow in Lead, Quiet text, 30ch, reading as an answer rather than a second headline. A lead-in variant sets a quiet setup sentence (Heading size, weight 500) above the heading it sets up. Stacked statements share one edge and one rhythm.

### Shout
The statement's loud register, in Yrsa at Shout size, 14ch. Rare: once per talk, maybe twice.

### Divider
A new side of the tape. A Mustard field floods the left 40cqw of the slide, wall to wall, with the section name set high in it in Yrsa (On field Ink). A name longer than the field runs straight on past its edge, turning Mustard on the Ink ground where it leaves the field. The promise sits low on the Ink ground to the right (Heading size, 22ch), with its detail under it in Lead. Name top-left, promise bottom-right, so the eye crosses the whole slide. It must never be mistaken for anything that counts.

### Spine card
The title card for a section that gets a spine: its number at billing scale in Share Tech Mono (34cqh) and its label at Heading size, centred on the slide. Auto-animating into the section's first slide hands both to the band: the band slides in, the number shrinks into place, and the label turns on its side, shrinks and lands.

### Demo
A live demo iframe keeps the CSS-pixel frame its demo was designed for and is scaled as one piece to fit the panel beside the spine (97% of the free width, 92% of the height), centred in that panel.

### Over media
See Over-media caption. The thank-you is the same strip with the word in Yrsa at Shout size.

### Reference
A metric is a term at billing scale in Yrsa with its name in Mustard and one line of meaning. A Q&A pairs the question people actually ask (Heading) with a short answer (Lead), key terms in Mustard mono. Resources list what a thing is (Heading) over where it lives, an ordinary link in Body size.

## Motion

Slides and fragments move only opacity, translate and scale. The deliberate exceptions: a spine number travels by font-size (two characters, so re-laying them out each frame costs nothing and stays crisp where a scale would blur), the spine card's label turns as it lands on the band (rotate, still on the compositor), and links and the mark sweep transition colour.

- **The dissolve.** One transition between slides, reveal's custom `lemon` transition: the outgoing slide clears in 260ms ease-in, the incoming slide arrives a beat later (120ms) over 640ms on the ease-out curve. Stepping down a stack is a smaller step, so it dissolves faster (180ms out, 420ms in). Nothing flies.
- **Fragments land.** A fragment rises 0.32em and fades in: opacity over 360ms ease-out, the rise over 900ms on a recorded spring (`$spring`, all 87 samples, as `linear()`). `.fragment.bounce` falls from above so the spring's overshoot bounces it.
- **Strike and mark.** A strike is a Rust line drawn left to right through its word (520ms). A mark is Focus Yellow sweeping in behind one word (420ms), the text turning Ink; a slide gets one mark at most.
- **Auto-animate.** Inside an auto-animated stack, auto-animate replaces the dissolve. Matched text is animated by font-size alone so it never balloons. Everything unmatched rises 0.25em and fades in on the same ease-out, a beat behind.
- **Blink.** `.blink` holds a word still, then squashes it flat and back twice in quick succession every 3.2s, like an eye.
- **The spine card's hand-off.** The band slides in from the left edge (560ms, ease-out); the number travels by font-size; the label turns 90 degrees counter-clockwise from horizontal to the band's bottom-to-top reading while it shrinks and moves, over the auto-animate duration.
- **Reduced motion.** Fragments crossfade in place in 240ms, strikes and marks fade rather than draw, the slide dissolve is a 200ms linear fade, and auto-animate snaps while its content still crossfades. The strobe and blink effects stop.

**The One Dissolve Rule.** Every slide change is the same dissolve through the ground. A slide may ask for one of reveal's own transitions explicitly, and should only when the move means something (a smash cut, time passing, a turn to another side, a dive into a detail); the default never slides, zooms or flips.

## Demos

Demos are real pages in a `+demo` iframe (1280 x 600 by default), styled from `demos/scss/partials/_demo-foundation.scss` on the same `--lemon-*` tokens and faces. The frame is a rehearsal poster: an Ink stage with one oversized subject, a Cream context strip (44px) naming the API or idea, and a Rust control rail (88px) holding the run button (Ink on Rust, Cream on hover and focus), stage actions, toggles and range pickers. Square corners, no shadows. Demos may use px and viewport units, because they are pages, not slides on the canvas.

## Do's and Don'ts

### Do:
- **Do** size everything inside a slide in cqw, cqh or em of the slide root, and keep px and viewport units for window chrome, demo iframe frames and SVG viewBoxes.
- **Do** read role properties (`--lemon-text`, `--lemon-field`) in templates, and retune colour from a talk's `talk.scss` by redeclaring properties on `:root`.
- **Do** hang statements from the high line, flush left.
- **Do** give a section a spine only when the section can be summarised in it.
- **Do** put Focus Yellow on one thing per slide at most.
- **Do** frame every code block on the code surface, give it line numbers, and name its file with the frame's tab.
- **Do** put text that sits on media on a Cream strip.
- **Do** keep the reduced-motion paths the deck already has, which crossfade instead of moving. WCAG work on the deck is otherwise out of scope, and so is PDF export: the requirement is that a slide looks right on screen and is legible from the back of the room.

### Don't:
- **Don't** load a reveal theme or a theme heading font.
- **Don't** set Syne above weight 600.
- **Don't** use Yrsa outside its listed moments.
- **Don't** centre a statement, a heading or a block of text.
- **Don't** add shadows, glows, text shadows or rounded corners.
- **Don't** put Focus Yellow in the syntax palette.
- **Don't** use uppercase anywhere but table headers.
- **Don't** add a slide transition beside the dissolve as a default.

## Recorded exceptions

Deliberate deviations from the rules above. Anything not listed here is drift.

- **The gag placeholders are striped and dashed on purpose.** A visual gag that still needs its real image (`+gag`) is a dashed Focus Yellow frame over a faint 45-degree Focus Yellow stripe, with a mono label. It breaks the no-gradient and One Watch rules so it cannot ship by accident, and each one already sits in the over-media layout its real image will use. It disappears when the asset lands.
- **Syne's lowercase g has a flat, square-cut tail.** That is the letterform, not a rendering bug; no stylistic set changes it.
- **The Blank Metal slides carry _M's marks.** The four `.bm` hello slides (`components/_blank-metal.scss`) keep Lemon's ink ground, faces and statement line, and borrow from the _M storybook: the stacked _M logo, whose coral A (`#ff6b6b`) and magenta stem (`#fc2ffc`) light up after a beat to spell "AI" (640ms on _M's ease); _M's split, a 40cqw ink panel beside content on white (`#fff`), the white sliding in from the right on arrival; a tracked, uppercase label in _M's light cobalt (`#8c9fff`, its cobalt for text on ink); and magenta metal hands for bullets, each giving one headbang on _M's anticipate and overshoot curves as its item lands. Magenta, coral, cobalt, the white field and the uppercase label appear nowhere else in the deck.
- **The last slide is on lemon yellow.** The closing cover composition sits on a reveal background of `#e6e924`, outside the palette, with every role flipped to Ink. It is the lemon, once.
- **The strobe is loud on purpose.** Kept for a slide that wants to be loud, it cycles through the palette, never a rainbow, and stops under reduced motion, as does the blink.
- **The spine card is centred.** It's the moment before a section's summary goes onto the band, so the summary sits in the middle of the slide, the one place the deck centres anything.
- **Print and PDF export reassert the canvas grid with `!important`.** Reveal's print stylesheet forces every slide to block layout; the overrides live in the shame file where they are visible.
