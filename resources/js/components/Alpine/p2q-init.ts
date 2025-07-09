import Alpine from 'alpinejs';
import { loadingState } from '@/components/Alpine/lib/loading-state';
import { noteModal } from '@/components/Alpine/modal/NoteModal';
import { projectModal } from '@/components/Alpine/modal/ProjectModal';
import { navUnderline } from '@/components/Alpine/ui/nav-underline';

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
