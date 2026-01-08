document.addEventListener("DOMContentLoaded", () => {
  const addBoxBtn = document.getElementById("AddBox");
  const grid = document.querySelector(".grid");
  if (addBoxBtn) {
    function updateAddBoxBtnText() {
      const boxes = grid.querySelectorAll(".box");
      if (boxes.length >= 4) {
        addBoxBtn.textContent = "Remove A Box";
      } else {
        addBoxBtn.textContent = "Add A Box";
      }
    }
    updateAddBoxBtnText();
  }
  if (addBoxBtn) {
    addBoxBtn?.addEventListener("click", () => {
      const boxes = grid.querySelectorAll(".box");
      if (boxes.length >= 4) {
        // Remove the last box
        const lastBox = boxes[boxes.length - 1];
        if (lastBox) {
          grid.removeChild(lastBox);
        }
      } else {
        // Add a new box
        const newBox = document.createElement("div");
        newBox.className = "box";
        const content = document.createElement("div");
        content.className = "content";
        content.textContent = `Box #${boxes.length + 1}`;
        newBox.appendChild(content);
        grid.appendChild(newBox);
      }
      updateAddBoxBtnText();
    });
  }

  const gridOrFlexBtn = document.getElementById("GridOrFlex");
  const gridWithFour = document.querySelector(".grid[four]"); // renamed to avoid redeclaration

  if (gridOrFlexBtn && gridWithFour) {
    gridOrFlexBtn.addEventListener("click", () => {
      const current = gridOrFlexBtn.getAttribute("current");
      if (current === "grid") {
        gridOrFlexBtn.setAttribute("current", "flex");
        gridWithFour.setAttribute("four", "flex");
        gridOrFlexBtn.textContent = "Grid 4";
      } else {
        gridOrFlexBtn.setAttribute("current", "grid");
        gridWithFour.setAttribute("four", "grid");
        gridOrFlexBtn.textContent = "Flex Center";
      }
    });
  }
});
