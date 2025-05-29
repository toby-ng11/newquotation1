let loadingOverlay: HTMLElement | null;

function getLoadingOverlay() {
    if (!loadingOverlay) {
        loadingOverlay = document.querySelector('.loading') as HTMLElement | null;
    }
    return loadingOverlay;
}

function showLoading() {
    const overlay = getLoadingOverlay();
    if (overlay) overlay.style.display = 'flex';
}

function hideLoading() {
    const overlay = getLoadingOverlay();
    if (overlay) overlay.style.display = 'none';
}

export { hideLoading, showLoading };
