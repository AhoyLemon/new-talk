// demos/ts/sample-demo.ts
var trigger = document.querySelector(".demo-trigger");
var subject = document.querySelector(".subject");
var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
trigger?.addEventListener("click", () => {
  if (reducedMotion.matches)
    return;
  subject?.animate([
    { transform: "translateY(0)" },
    { transform: "translateY(-12px)" },
    { transform: "translateY(0)" }
  ], {
    duration: 420,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)"
  });
});
