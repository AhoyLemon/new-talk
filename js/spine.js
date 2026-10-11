// The spine grows in only when it wasn't already on screen, so stepping through a section that has one doesn't replay it. Reveal's events bubble from the .reveal element, which exists before Reveal.initialize runs, so this can load ahead of the config like the other slide scripts.
document.querySelector(".reveal")?.addEventListener("slidechanged", ({ currentSlide, previousSlide }) => {
  if (!currentSlide) return;
  const arriving = currentSlide.classList.contains("has-spine") && !previousSlide?.classList.contains("has-spine");
  currentSlide.classList.toggle("spine-arrives", arriving);
});
