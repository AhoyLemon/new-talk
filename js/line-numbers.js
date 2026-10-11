// Every code block in the deck gets line numbers. Reveal's highlight plugin only numbers a block that asks for it with data-line-numbers, so this asks on behalf of any block that didn't, before reveal reads them. Blocks that already list highlight steps ("1-2|4-5") keep them.
document.querySelectorAll(".reveal pre > code:not([data-line-numbers])").forEach((code) => {
  code.setAttribute("data-line-numbers", "");
});
