/* global $ */

document.addEventListener("DOMContentLoaded", () => {
  const themeBtnIcon = document.querySelector(".theme-switcher-menu .icon");
  const themeButton = document.querySelector(".button.theme-switcher-menu");

  themeButton.addEventListener("click", toggleTheme);
  updateThemeIcon();
  loadFlatpickrTheme(localStorage.getItem("theme") || "material_blue");

  function setTheme(themeName) {
    const validThemes = ["light", "dark"]; // Add more themes as needed
    if (!validThemes.includes(themeName)) {
      console.error("Invalid theme name:", themeName);
      return; // Exit function if themeName is invalid
    }
    localStorage.setItem("theme", themeName);
    document.documentElement.className = themeName;
    updateThemeIcon();
    loadFlatpickrTheme(themeName);
  }

  function toggleTheme() {
    const currentTheme = localStorage.getItem("theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    //console.log(`Theme is set to ${newTheme}-mode.`);
  }

  function updateThemeIcon() {
    const currentTheme = localStorage.getItem("theme") || "light";
    if (currentTheme === "dark") {
      themeBtnIcon.classList.remove("icon-theme-light");
      themeBtnIcon.classList.add("icon-theme-dark");
    } else {
      themeBtnIcon.classList.remove("icon-theme-dark");
      themeBtnIcon.classList.add("icon-theme-light");
    }
  }

  function loadFlatpickrTheme(theme) {
    const existing = document.querySelector("link[data-flatpickr-theme]");
    if (existing) existing.remove();

    let themeFile;
    if (theme === "dark") {
      themeFile = "dark";
    } else {
      themeFile = "material_blue";
    }

    const themeHref = `https://npmcdn.com/flatpickr/dist/themes/${themeFile}.css`;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = themeHref;
    link.setAttribute("data-flatpickr-theme", "true");

    document.head.appendChild(link);
  }

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

  // Animate hero and features section first
  $(".hero.fade-in-up, .features.fade-in-up").addClass("show");

  // Stagger the feature cards
  $(".feature.fade-in-up").each(function (index) {
    let that = $(this);
    setTimeout(function () {
      that.addClass("show");
    }, index * 500); // 300ms delay between each card
  });

  let sideBarExpanded = false;

  $("#options-button").on("click", function () {
    if (sideBarExpanded != true) {
      $("#options-menu-items").slideToggle({
        start: function () {
          $(this).css("display", "flex");
          $(".options-menu").css("transform", "translateX(-20%)");
        },
      });
      sideBarExpanded = true;
    } else {
      $("#options-menu-items").slideToggle();
      $(".options-menu").css("transform", "translateX(60%)");
      sideBarExpanded = false;
    }
  });
});
