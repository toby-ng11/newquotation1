export function initSearchBox() {
  const searchBtn = document.querySelector(".search-architect-button");
  const overlay = document.getElementById("search-overlay");
  const closeBtn = document.getElementById("close-search");
  const input = document.getElementById("architect-search");
  const body = document.body;

  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      overlay.classList.add("active");
      body.classList.add("noscroll");
      setTimeout(() => input.focus(), 100);
    });
  }

  function hideOverlay() {
    overlay.classList.remove("active");
    body.classList.remove("noscroll");
    setTimeout(() => input.value = "", 400); // match the fade-out duration
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", hideOverlay);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") hideOverlay();
    });
  }
}
