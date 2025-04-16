document.addEventListener("DOMContentLoaded", () => {
  const themeBtnIcon = document.querySelector(".theme-switcher-menu .icon");
  const themeButton = document.querySelector(".button.theme-switcher-menu");

  themeButton.addEventListener("click", toggleTheme);
  updateThemeIcon(); 

  function setTheme(themeName) {
    const validThemes = ["light", "dark"]; // Add more themes as needed
    if (!validThemes.includes(themeName)) {
      console.error("Invalid theme name:", themeName);
      return; // Exit function if themeName is invalid
    }
    localStorage.setItem("theme", themeName);
    document.documentElement.className = themeName;
    updateThemeIcon();
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

  const $elements = $(".fade-in-up");

  // Fallback if Intersection Observer is not supported
  if (!("IntersectionObserver" in window)) {
    $elements.addClass("show");
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $(entry.target).addClass("show");
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of the element is visible
    }
  );

  $elements.each(function () {
    observer.observe(this);
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
