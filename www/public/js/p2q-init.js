import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { navUnderline } from './modules/nav-underline.js';

window.Alpine = Alpine;

document.addEventListener('alpine:init', () => {
    Alpine.data('navUnderline', navUnderline);
    Alpine.data('loadingState', () => ({
        loading: false,
        init() {
            document.body.addEventListener('htmx:beforeRequest', () => this.loading = true);
            document.body.addEventListener('htmx:afterSwap', () => this.loading = false);
            document.body.addEventListener('htmx:responseError', () => this.loading = false);
        }
    }))
});

Alpine.start();