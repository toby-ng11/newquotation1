export function initUserMenu() {
  const menu = document.querySelector(".top-navigation");
  const menuBtn = document.querySelector(".main-menu-toggle");
  const menuBtnIcon = document.querySelector(".main-menu-toggle .icon");
  const menuBtnText = document.querySelector(
    ".main-menu-toggle .visually-hidden"
  );

  if (menuBtn) {
    menuBtn.addEventListener("click", toggleMainMenu);
  }

  function toggleMainMenu() {
    const isMenuOpen = menu.classList.contains("show-nav");
    menu.classList.toggle("show-nav");
    if (isMenuOpen) {
      updateButtonAttributes(
        "Open main menu",
        "false",
        "icon-menu",
        "Close main menu"
      );
    } else {
      updateButtonAttributes(
        "Close main menu",
        "true",
        "icon-cancel",
        "Open main menu"
      );
    }
  }

  function updateButtonAttributes(title, ariaExpanded, iconClass, buttonText) {
    menuBtn.setAttribute("title", title);
    menuBtn.setAttribute("aria-label", title);
    menuBtn.setAttribute("aria-expanded", ariaExpanded);
    menuBtnIcon.classList.remove("icon-menu", "icon-cancel");
    menuBtnIcon.classList.add(iconClass);
    menuBtnText.textContent = buttonText;
  }

  const userBtn = document.getElementById("centura-account-button");
  const userMenu = document.getElementById("centura-account");

  userBtn.addEventListener("click", () => {
    const isExpanded = userBtn.getAttribute("aria-expanded") === "true";

    userBtn.setAttribute("aria-expanded", String(!isExpanded));
    userMenu.style.display = isExpanded ? "none" : "block";
  });

  // Optional: Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target) && !userBtn.contains(e.target)) {
      userMenu.style.display = "none";
      userBtn.setAttribute("aria-expanded", "false");
    }
  });
}
