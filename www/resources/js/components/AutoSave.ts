import { showFlashMessage } from '@/components/flashmessage';
import { setState } from './state';

export function initAutoSave(formElement: HTMLFormElement, saveCallback: () => void, delay = 5000) {
    if (!formElement || typeof saveCallback !== 'function') return;

    let autoSaveTimer: ReturnType<typeof setTimeout> | undefined = undefined;

    formElement.addEventListener('input', () => {
        setState({ unsave: true });

        if (autoSaveTimer) clearTimeout(autoSaveTimer);

        autoSaveTimer = setTimeout(() => {
            showFlashMessage('Auto-saving changes...', true);
            saveCallback();
        }, delay);
    });
}
