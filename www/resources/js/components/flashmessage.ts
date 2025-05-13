export function showFlashMessage(message: string, success = true) {
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
    flash.classList.remove("show");
    flash.classList.add("hide");
    setTimeout(() => flash.remove(), 500); // match fade-out duration
  }, 4000);
}

export function showLoadedFlashMessage() {
  const flashes = document.querySelectorAll(".flash-message");
  if (flashes) {
    flashes.forEach((flash) => {
      setTimeout(() => {
        flash.classList.add("show");
      }, 300);

      setTimeout(() => {
        flash.classList.remove("show");
        flash.classList.add("hide");
        setTimeout(() => flash.remove(), 500);
      }, 4300); // 300ms delay + 4s display
    });
  }
}
