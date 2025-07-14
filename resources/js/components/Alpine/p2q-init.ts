import { loadingState } from '@/components/Alpine/lib/loading-state';
import { customerModal } from '@/components/Alpine/modal/customer-modal';
import { itemModal } from '@/components/Alpine/modal/item-modal';
import { noteModal } from '@/components/Alpine/modal/note-modal';
import { projectModal } from '@/components/Alpine/modal/project-modal';
import { navUnderline } from '@/components/Alpine/ui/nav-underline';
import Alpine from 'alpinejs';

export function initAlpine() {
    window.Alpine = Alpine;

    document.addEventListener('alpine:init', () => {
        Alpine.data('navUnderline', navUnderline);
        Alpine.data('loadingState', loadingState);
        Alpine.data('customerModal', customerModal);
        Alpine.data('itemModal', itemModal);
        Alpine.data('projectModal', projectModal);
        Alpine.data('noteModal', noteModal);
    });

    Alpine.start();
}
