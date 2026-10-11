// Only the options that differ from reveal's defaults (https://revealjs.com/config/), plus center, which is the default but load-bearing. docs/LEMON-DECK.md says why the Lemon ones matter.
Reveal.initialize({
  // The canvas: true 16:9, edge to edge. Lemon draws its own safe area inside each slide, and sizes everything against this canvas (cqw/cqh).
  width: 1280,
  height: 720,
  margin: 0,
  maxScale: 4,

  // Reveal writes display inline on every visible slide, so the slide grid has to come from here, not the stylesheet.
  display: "grid",

  // Every Lemon slide is canvas-tall, so this centres nothing. It makes auto-animate measure with getBoundingClientRect, which anything travelling between two differently positioned parents (a number moving into the spine) needs.
  center: true,

  // Lemon's dissolve (scss/lemon/motion/_transitions.scss). A slide can still ask for one of reveal's with data-transition.
  transition: "lemon",
  autoAnimateEasing: "cubic-bezier(0.16, 1, 0.3, 1)",
  autoAnimateDuration: 0.8,

  // Flattened slide numbers on every slide, so a slide can be named in review ("slide 47") and reached with G and the number. Add showSlideNumber: "speaker" to keep them off the room's screen.
  slideNumber: "c",
  progress: false,

  // The URL tracks the slide (1-based, like the slide number) and every change lands in the browser history.
  hash: true,
  hashOneBasedIndex: true,
  history: true,

  touch: false,

  // The speaker view's pacing timer only appears when this isn't null. A slide or a whole stack can set its own with data-timing (js/stacks.js).
  defaultTiming: 10,

  pdfMaxPagesPerSlide: 1,

  plugins: [RevealMarkdown, RevealHighlight, RevealNotes, RevealZoom],
});
