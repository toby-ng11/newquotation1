import Alpine from 'https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js'
import { navUnderline } from './api/nav-underline.js';
import { loadingCanvas } from './api/loading-canvas.js';

window.Alpine = Alpine;

document.addEventListener('alpine:init', () => {
    Alpine.data('navUnderline', navUnderline);
    Alpine.data('loadingState', loadingCanvas)
});

Alpine.start();