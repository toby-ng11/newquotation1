const loadingOverlay = document.querySelector(".loading") as HTMLElement;

export function showLoading() {
  loadingOverlay.style.display = "flex";
}

export function hideLoading() {
  loadingOverlay.style.display = "none";
}
