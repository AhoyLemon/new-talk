// Demo script for demos/sample-demo.html.
//
// Built to demos/js/sample-demo.js by `bun run build:js`, and rebuilt on save by `bun run dev`. The page loads it as <script type="module">, which is deferred by spec, so the DOM is already parsed and this can query the document at the top level with no DOMContentLoaded wrapper.
//
// Conventions for anything added alongside this file:
//   - demos/ts/*.ts        one file per demo, each its own bundle entry
//   - demos/ts/partials/   shared modules, _-prefixed, inlined by the bundler into whichever demos import them
//
// Adding a NEW file here needs a `bun run dev` restart. The entry glob is expanded by the shell once when the watcher spawns. Editing existing files (partials included) rebuilds fine.
//
// `bun build` strips these types without checking them, so it will happily bundle code that does not typecheck. `bun run test` is the only thing that actually checks it.

const trigger = document.querySelector<HTMLButtonElement>(".demo-trigger");
const subject = document.querySelector<HTMLElement>(".subject");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

trigger?.addEventListener("click", () => {
  // Reduced motion: land the same end state without the journey. Here the end state is where the subject already is, so there is nothing to do.
  if (reducedMotion.matches) return;

  subject?.animate(
    [
      { transform: "translateY(0)" },
      { transform: "translateY(-12px)" },
      { transform: "translateY(0)" },
    ],
    {
      duration: 420,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    }
  );
});
