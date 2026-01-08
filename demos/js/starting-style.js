document.addEventListener("DOMContentLoaded", () => {
  const hamburgerMenu = document.querySelector("#HamburgerMenu");
  const toggleButton = document.querySelector("#ToggleHamburgerMenu");
  if (hamburgerMenu) {
    hamburgerMenu.classList.remove("visible");
  }
  toggleButton.addEventListener("click", () => {
    const isExpanded = toggleButton.getAttribute("aria-expanded") === "true";
    toggleButton.setAttribute("aria-expanded", !isExpanded);
    hamburgerMenu.classList.toggle("visible");
  });
});
