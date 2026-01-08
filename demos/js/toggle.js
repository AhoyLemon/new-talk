document.addEventListener("click", (event) => {
  if (event.target.matches("button[aria-controls]")) {
    const button = event.target;
    const content = button.closest("dt").nextElementSibling;

    // Remove 'active' class and set aria-expanded to false for all buttons
    document.querySelectorAll("button[aria-controls]").forEach((btn) => {
      if (btn !== button) {
        btn.classList.remove("active");
        btn.setAttribute("aria-expanded", "false");
      }
    });

    // Remove 'visible' class from all content elements
    document.querySelectorAll('[role="region"]').forEach((item) => {
      if (item !== content) {
        item.classList.remove("visible");
      }
    });

    // Toggle the clicked button and its corresponding content
    const isActive = button.classList.toggle("active");
    button.setAttribute("aria-expanded", isActive ? "true" : "false");
    if (content && content.matches('[role="region"]')) {
      content.classList.toggle("visible");
    }
  }
});
