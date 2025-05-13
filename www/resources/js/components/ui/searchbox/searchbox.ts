export function initSearchBox() {
  const searchBtn = document.querySelector(".search-architect-button");
  const overlay = document.getElementById("search-overlay");
  const closeBtn = document.getElementById("close-search");
  const input = document.getElementById("architect-search") as HTMLInputElement;
  const body = document.body;

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      if (overlay) overlay.classList.add("active");
      body.classList.add("noscroll");
      if (input) setTimeout(() => input.focus(), 100);
    });
  }

  function hideOverlay() {
    if (overlay) overlay.classList.remove("active");
    body.classList.remove("noscroll");
    if (input) setTimeout(() => input.value = "", 400); // match the fade-out duration
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", hideOverlay);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hideOverlay();
    });
  }
}
