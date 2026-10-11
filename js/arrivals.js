// Panels that slide in when you arrive from a slide without them: the spine, and the white side of a Blank Metal split. Reveal's events bubble from the .reveal element, which exists before Reveal.initialize runs, so this can load ahead of the config like the other slide scripts.
(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // A label's centre, measured from its slide's own box. Offsets ignore transforms, so reveal's canvas scale and the label's own rotation don't skew it.
  const centreOf = (element, slide) => {
    let x = element.offsetWidth / 2;
    let y = element.offsetHeight / 2;
    for (let node = element; node && node !== slide; node = node.offsetParent) {
      x += node.offsetLeft;
      y += node.offsetTop;
    }
    return { x, y };
  };

  // From a .spine-card into a spine slide, the card's label turns on its side, shrinks and lands in the band. Reveal can't do it (auto-animate morphs boxes, not rotation or writing mode), so the card's label has no data-id and this moves the band's label instead. The band's label reads bottom to top: vertical-rl plus rotate: 180deg, so starting it at 270deg sets it upright and horizontal.
  const landLabel = (card, slide) => {
    const from = card.querySelector(":scope > .spine-label");
    const to = slide.querySelector(".spine-tag .spine-label");
    if (!from || !to || reducedMotion.matches) return;

    const start = centreOf(from, card);
    const end = centreOf(to, slide);
    const scale = parseFloat(getComputedStyle(from).fontSize) / parseFloat(getComputedStyle(to).fontSize);
    const { autoAnimateDuration, autoAnimateEasing } = Reveal.getConfig();
    // Reveal holds unmatched elements at opacity 0 until its animation starts, so fall back to the band label's usual 0.75.
    const settled = Number(getComputedStyle(to).opacity) || 0.75;

    to.animate(
      [
        { translate: `${start.x - end.x}px ${start.y - end.y}px`, rotate: "270deg", scale: String(scale), opacity: 1 },
        { translate: "0 0", rotate: "180deg", scale: "1", opacity: settled },
      ],
      { duration: autoAnimateDuration * 1000, easing: autoAnimateEasing }
    );
  };

  document.querySelector(".reveal")?.addEventListener("slidechanged", ({ currentSlide, previousSlide }) => {
    if (!currentSlide) return;

    // The band slides in only when it wasn't already on screen, so stepping through a section that has one doesn't replay it.
    const arriving = currentSlide.classList.contains("has-spine") && !previousSlide?.classList.contains("has-spine");
    currentSlide.classList.toggle("spine-arrives", arriving);

    if (arriving && previousSlide?.classList.contains("spine-card")) landLabel(previousSlide, currentSlide);

    // The same for the white side of a Blank Metal split: it slides in once, then holds still across the split slides that follow.
    const splitArriving = currentSlide.classList.contains("bm-split") && !previousSlide?.classList.contains("bm-split");
    currentSlide.classList.toggle("bm-arrives", splitArriving);
  });
})();
