// Stack-level defaults: a vertical stack (a section of sections) sets something once for every slide in it, instead of repeating it on each. It runs before Reveal.initialize, so the speaker view, auto-animate and the overview all see the result.
//
//   data-timing="0" on a stack           every slide in it without its own data-timing gets this one (the speaker view's pacing timer reads slides, never stacks)
//   data-spine="Media" on a stack        every slide in it gets the spine: a number (the stack's place among spine stacks, or data-spine-number) and the label
//   data-spine-section="Images" on a slide   the label reads "Media › Images" from that slide on
//
// Slides that draw their own left edge keep it: dividers, spine cards, slides that already have a spine, Blank Metal slides, and anything marked .no-spine.
(() => {
  const stacks = [...document.querySelectorAll(".reveal .slides > section")].filter((section) => section.querySelector(":scope > section"));
  const slidesOf = (stack) => stack.querySelectorAll(":scope > section");

  stacks
    .filter((stack) => stack.hasAttribute("data-timing"))
    .forEach((stack) => {
      slidesOf(stack).forEach((slide) => {
        if (!slide.hasAttribute("data-timing")) slide.setAttribute("data-timing", stack.getAttribute("data-timing"));
      });
    });

  const keepsItsOwnEdge = ".divider, .spine-card, .has-spine, .bm, .no-spine";
  const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // A p and a data-id at both ends, so auto-animate holds the number still; the label's data-id carries its text, so a new subsection crossfades instead of stretching one label into another.
  const buildTag = (number, label) => {
    const tag = document.createElement("div");
    tag.className = "spine-tag";

    const digits = document.createElement("p");
    digits.className = "spine-number";
    digits.dataset.id = `spine-${number}-number`;
    digits.textContent = number;

    const text = document.createElement("span");
    text.className = "spine-label";
    text.dataset.id = `spine-${number}-${slug(label)}`;
    text.textContent = label;

    tag.append(digits, text);
    return tag;
  };

  stacks
    .filter((stack) => stack.hasAttribute("data-spine"))
    .forEach((stack, index) => {
      const number = stack.dataset.spineNumber ?? String(index + 1).padStart(2, "0");
      let label = stack.dataset.spine;

      slidesOf(stack).forEach((slide) => {
        if (slide.dataset.spineSection) label = `${stack.dataset.spine} › ${slide.dataset.spineSection}`;
        if (slide.matches(keepsItsOwnEdge)) return;

        slide.classList.add("has-spine");
        // Appended, not prepended, so templates that style their first child (a statement's lead-in) still find it.
        slide.append(buildTag(number, label));
      });
    });
})();
