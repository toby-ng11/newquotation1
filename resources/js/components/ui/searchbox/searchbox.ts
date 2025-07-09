export function initSearchBox() {
  const searchBtn = document.querySelector(
    ".search-architect-button"
  ) as HTMLButtonElement | null;
  const overlay = document.getElementById(
    "search-overlay"
  ) as HTMLElement | null;
  const closeBtn = document.getElementById(
    "close-search"
  ) as HTMLButtonElement | null;
  const input = document.getElementById(
    "architect-search"
  ) as HTMLInputElement | null;
  const body = document.body;

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      if (overlay) overlay.classList.add("active");
      body.classList.add("overflow-hidden");
      if (input) setTimeout(() => input.focus(), 100);
    });
  }

  function hideOverlay() {
    if (overlay) overlay.classList.remove("active");
    body.classList.remove("overflow-hidden");
    if (input) setTimeout(() => (input.value = ""), 400); // match the fade-out duration
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", hideOverlay);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hideOverlay();
    });
  }
}
