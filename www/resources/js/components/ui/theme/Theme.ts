export function InitTheme() {
  const themeBtnIcon = document.querySelector(".theme-switcher-menu .icon");
  const themeButton = document.querySelector(".button.theme-switcher-menu");

  if (themeButton) themeButton.addEventListener("click", toggleTheme);
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
    if (themeBtnIcon) {
      if (currentTheme === "dark") {
        themeBtnIcon.classList.remove("icon-theme-light");
        themeBtnIcon.classList.add("icon-theme-dark");
      } else {
        themeBtnIcon.classList.remove("icon-theme-dark");
        themeBtnIcon.classList.add("icon-theme-light");
      }
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
}
