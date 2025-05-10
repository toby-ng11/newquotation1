export function runFadeInAnimation() {
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
