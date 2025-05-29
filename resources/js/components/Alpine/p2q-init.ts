import Alpine from 'alpinejs';
import { loadingState } from './lib/loading-state.js';
import { noteModal } from './modal/NoteModal.js';
import { projectModal } from './modal/ProjectModal.js';
import { navUnderline } from './ui/nav-underline.js';

export function initAlpine() {
    window.Alpine = Alpine;

    document.addEventListener('alpine:init', () => {
        Alpine.data('navUnderline', navUnderline);
        Alpine.data('loadingState', loadingState);
        Alpine.data('projectModal', projectModal);
        Alpine.data('noteModal', noteModal);
    });

    Alpine.start();
}
