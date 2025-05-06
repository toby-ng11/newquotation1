export function showFlashMessage(message, success = true) {
  const type = success ? "success" : "error";
  const flash = document.createElement("div");
  flash.className = `flash-message widget-table ${type}`;
  flash.innerHTML = `<p>${message}</p>`;

  const container = document.getElementById("js-flash-container");
  if (!container) return;

  container.appendChild(flash);

  // Force reflow to allow animation
  void flash.offsetWidth;
  flash.classList.add("show");

  setTimeout(() => {
    flash.style.opacity = "0";
    flash.style.transform = "translateY(-10px)";
    setTimeout(() => flash.remove(), 500); // match fade-out duration
  }, 4000);
}

// Auto-show existing flash messages on page load
document.addEventListener("DOMContentLoaded", () => {
  const flash = document.querySelector(".flash-message");
  if (flash) {
    setTimeout(() => {
      flash.classList.add("show");
    }, 300);

    setTimeout(() => {
      flash.style.opacity = "0";
      flash.style.transform = "translateY(-10px)";
      setTimeout(() => flash.remove(), 500);
    }, 4000);
  }
});
