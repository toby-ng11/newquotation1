export function initUserMenu() {
  const menu = document.querySelector(".top-navigation") as HTMLElement;
  const menuBtn = document.querySelector(
    ".main-menu-toggle"
  ) as HTMLButtonElement;
  const menuBtnIcon = document.querySelector(
    ".main-menu-toggle .icon"
  ) as HTMLSpanElement;
  const menuBtnText = document.querySelector(
    ".main-menu-toggle .visually-hidden"
  ) as HTMLSpanElement;

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

  function updateButtonAttributes(
    title: string,
    ariaExpanded: string,
    iconClass: string,
    buttonText: string
  ) {
    menuBtn.setAttribute("title", title);
    menuBtn.setAttribute("aria-label", title);
    menuBtn.setAttribute("aria-expanded", ariaExpanded);
    menuBtnIcon.classList.remove("icon-menu", "icon-cancel");
    menuBtnIcon.classList.add(iconClass);
    menuBtnText.textContent = buttonText;
  }

  const userBtn = document.getElementById(
    "centura-account-button"
  ) as HTMLButtonElement;
  const userMenu = document.getElementById("centura-account") as HTMLElement;

  userBtn.addEventListener("click", () => {
    const isExpanded = userBtn.getAttribute("aria-expanded") === "true";

    userBtn.setAttribute("aria-expanded", String(!isExpanded));
    userMenu.style.display = isExpanded ? "none" : "block";
  });

  // Optional: Close menu when clicking outside
  document.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    if (!userMenu.contains(target) && !userBtn.contains(target)) {
      userMenu.style.display = "none";
      userBtn.setAttribute("aria-expanded", "false");
    }
  });
}
