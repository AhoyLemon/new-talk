// The sample demo's script, bundled to demos/js/sample-demo.js. demos/demos.md covers how demo scripts are built and loaded.

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
