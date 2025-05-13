export function loadingCanvas() {
    return {
        loading: false,
        init() {
            document.body.addEventListener('htmx:beforeRequest', () => this.loading = true);
            document.body.addEventListener('htmx:afterSwap', () => this.loading = false);
            document.body.addEventListener('htmx:responseError', () => this.loading = false);
        }
    }
}