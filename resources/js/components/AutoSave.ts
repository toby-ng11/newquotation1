import { showFlashMessage } from '@/components/flashmessage';
import { setState } from './state';

let enabled = true;

function disableAutoSave() {
    enabled = false;
}

function enableAutoSave() {
    enabled = true;
}

function initAutoSave(formElement: HTMLFormElement, saveCallback: () => void, delay = 50000) {
    if (!formElement || typeof saveCallback !== 'function') return;

    let autoSaveTimer: ReturnType<typeof setTimeout> | undefined = undefined;

    formElement.addEventListener('input', () => {
        if (!enabled) return;

        setState({ unsave: true });

        if (autoSaveTimer) clearTimeout(autoSaveTimer);

        autoSaveTimer = setTimeout(() => {
            showFlashMessage('Auto-saving changes...', true);
            saveCallback();
        }, delay);
    });
}

export { disableAutoSave, enableAutoSave, initAutoSave };
