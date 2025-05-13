export function runFadeInAnimation() {
  document
    .querySelectorAll(".hero.fade-in-up, .features.fade-in-up")
    .forEach((el) => {
      el.classList.add("show");
    });

  // Stagger the feature cards
  document.querySelectorAll(".feature.fade-in-up").forEach((el, index) => {
    setTimeout(() => {
      el.classList.add("show");
    }, index * 300);
  });

  let sideBarExpanded = false;
  const optionsButton = document.getElementById("options-button");
  const optionsMenuItems = document.getElementById("options-menu-items");
  const optionsMenu = document.querySelector(".options-menu");

  optionsButton.addEventListener("click", () => {
    if (!sideBarExpanded) {
      // Slide down with flex display
      optionsMenuItems.style.display = "flex";
      optionsMenuItems.style.maxHeight = optionsMenuItems.scrollHeight + "px";
      optionsMenuItems.style.overflow = "hidden";
      optionsMenuItems.style.transition = "max-height 0.4s ease";

      optionsMenu.style.transform = "translateX(-20%)";
      sideBarExpanded = true;
    } else {
      // Slide up
      optionsMenuItems.style.maxHeight = "0";
      optionsMenuItems.addEventListener("transitionend", function handleHide() {
        optionsMenuItems.style.display = "none";
        optionsMenuItems.removeEventListener("transitionend", handleHide);
      });

      optionsMenu.style.transform = "translateX(60%)";
      sideBarExpanded = false;
    }
  });

  const elements = document.querySelectorAll(".fade-in-up:not(.show)");

  // Fallback if Intersection Observer is not supported
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("show"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // Animate once
        }
      });
    },
    {
      threshold: 0.1, // <-- Adjust this value to control when the animation starts
    }
  );

  elements.forEach((el) => observer.observe(el));
}
