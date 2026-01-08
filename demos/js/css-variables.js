document.addEventListener("click", (event) => {
  const button = event.target.closest("[toggle-scheme], [toggle-dark]"); // Ensure the correct button is selected

  if (button) {
    if (button.hasAttribute("toggle-scheme")) {
      // Remove the "active" class and "disabled" attribute from all buttons with "toggle-scheme"
      document.querySelectorAll("[toggle-scheme]").forEach((btn) => {
        btn.classList.remove("active");
        btn.removeAttribute("disabled");
      });

      // Add the "active" class and "disabled" attribute to the clicked button
      button.classList.add("active");
      button.setAttribute("disabled", true);

      // Get the value of the "toggle-scheme" attribute
      const schemeValue = button.getAttribute("toggle-scheme");

      // Set the "data-scheme" attribute on the body with the value
      document.body.setAttribute("data-scheme", schemeValue);
    }

    if (button.hasAttribute("toggle-dark")) {
      // Remove the "active" class and "disabled" attribute from all buttons with "toggle-dark"
      document.querySelectorAll("[toggle-dark]").forEach((btn) => {
        btn.classList.remove("active");
        btn.removeAttribute("disabled");
      });

      // Add the "active" class and "disabled" attribute to the clicked button
      button.classList.add("active");
      button.setAttribute("disabled", true);

      // Check the value of the "toggle-dark" attribute
      const darkModeValue = button.getAttribute("toggle-dark");

      if (darkModeValue === "on") {
        document.body.setAttribute("data-theme", "dark");
      } else if (darkModeValue === "off") {
        document.body.removeAttribute("data-theme");
      }
    }
  }
});
