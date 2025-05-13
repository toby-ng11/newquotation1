export function initSidebarToggle() {
  const optionsButton = document.getElementById(
    "options-button"
  ) as HTMLButtonElement | null;
  const optionsMenuItems = document.getElementById(
    "options-menu-items"
  ) as HTMLElement | null;
  const optionsMenu = document.querySelector(
    ".options-menu"
  ) as HTMLElement | null;

  if (!optionsButton || !optionsMenuItems || !optionsMenu) return;

  let sideBarExpanded = false;

  optionsButton.addEventListener("click", () => {
    if (!sideBarExpanded) {
      optionsMenuItems.style.display = "flex";
      optionsMenuItems.style.maxHeight = optionsMenuItems.scrollHeight + "px";
      optionsMenuItems.style.overflow = "hidden";
      optionsMenuItems.style.transition = "max-height 0.4s ease";
      optionsMenu.style.transform = "translateX(-20%)";
      sideBarExpanded = true;
    } else {
      optionsMenuItems.style.maxHeight = "0";
      optionsMenuItems.addEventListener("transitionend", function handleHide() {
        optionsMenuItems.style.display = "none";
        optionsMenuItems.removeEventListener("transitionend", handleHide);
      });
      optionsMenu.style.transform = "translateX(60%)";
      sideBarExpanded = false;
    }
  });

  // Dismiss on outside click
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (
      sideBarExpanded &&
      !optionsMenu.contains(target) &&
      !optionsButton.contains(target)
    ) {
      optionsMenuItems.style.maxHeight = "0";
      optionsMenuItems.addEventListener("transitionend", function handleHide() {
        optionsMenuItems.style.display = "none";
        optionsMenuItems.removeEventListener("transitionend", handleHide);
      });
      optionsMenu.style.transform = "translateX(60%)";
      sideBarExpanded = false;
    }
  });
}