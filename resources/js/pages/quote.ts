import { initAutoSave } from '@/components/AutoSave';
import { disableButton } from '@/components/DisableButton';
import { showFlashMessage } from '@/components/flashmessage';
import { projectForm, projectID, quoteForm, quoteID, sheetType } from '@/components/init';
import { hideLoading, showLoading } from '@/components/LoadingOverlay';
import { setState } from '@/components/state';
import { resetForm } from '@/components/utils';

const $makeQuoteForm = $('#dialog-make-quote-form');
const makeQuoteForm = document.getElementById('dialog-make-quote-form') as HTMLFormElement;
export const $dialogMakeQuote = $('#dialog-make-quote');
const dialogBtnAddCustomer = document.getElementById('customer-form-btn-add') as HTMLButtonElement;
const quoteSaveBtn = document.getElementById('form-btn-save-quote') as HTMLButtonElement;

let $customerFields = document.querySelectorAll('#customer_id, #customer_name, #company_id, #salesrep_full_name');

let $contactFields = document.querySelectorAll(
    '#contact_id, #first_name, #last_name, #phys_address1, #phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, #central_phone_number, #email_address',
);

const contactDropdown = document.getElementById('contact_name') as HTMLSelectElement;
if (contactDropdown) {
    contactDropdown.dataset.defaultOptions = contactDropdown.innerHTML;
}

async function initQuote() {
    const { setupAutoComplete } = await import('@/components/autocomplete');
    // Enable save button
    if (quoteForm) {
        initAutoSave(quoteForm, () => saveQuoteWithAction('save', true));

        quoteForm.addEventListener('change', () => {
            quoteSaveBtn.disabled = false;
            setState({ unsave: true, lastChanged: 'project' });
        });
    }
    // Save edit
    if (quoteSaveBtn) {
        quoteSaveBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const quoteForm = document.querySelector('form') as HTMLFormElement;
            const submitEvent = new Event('submit', { cancelable: true });
            quoteForm.dispatchEvent(submitEvent);
            setState({ unsave: false });
        });
    }

    // Submit approval
    document.querySelectorAll('.quote-action-button').forEach((button) => {
        button.addEventListener('click', async function (e) {
            e.preventDefault();

            const action = button.dataset.action;
            const label = button.dataset.label?.toLowerCase();

            if (!action) return;

            // Only validate for 'submit' and 'approve' actions
            const requiresValidation = ['submit', 'approve', 'submit-approve'].includes(action);
            if (requiresValidation && !quoteForm.checkValidity()) {
                quoteForm.reportValidity();
                return;
            }

            if (!confirm(`You are about to ${label} this quote. Continue?`)) return;

            button.disabled = true;
            await saveQuoteWithAction(action, false, label);
            setTimeout(() => (button.disabled = false), 1000);
        });
    });

    const deleteButtons = document.querySelectorAll('.delete-quote-btn');
    if (deleteButtons.length > 0) {
        deleteButtons.forEach((button) => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();

                const confirmed = confirm('Are you sure you want to delete this quote?');
                if (!confirmed) return;

                setState({ unsave: false });
                showLoading();

                try {
                    const res = await fetch(`/quote/${quoteID}/delete`, {
                        method: 'GET',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                        },
                    });

                    const response = await res.json();

                    if (response.success) {
                        window.location.href = '/index/project';
                    } else {
                        showFlashMessage(`Failed to delete the quote. Error: ${response.message}`, false);
                    }
                } catch (error) {
                    showFlashMessage(`Error occurred while trying to delete the quote. Error: ${error.message}`, false);
                } finally {
                    hideLoading();
                }
            });
        });
    }

    const editAgainLink = document.querySelector('a.quote-edit-again');
    if (editAgainLink) {
        editAgainLink.addEventListener('click', async (e) => {
            const confirmed = confirm('You are about to edit this approved quote. Continue?');
            if (!confirmed) {
                e.preventDefault();
                return;
            }

            e.preventDefault();
            showLoading();

            try {
                const response = await fetch(`/quote/${quoteID}/edit`, {
                    method: 'GET',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                showFlashMessage('Changes saved! Reloading...', true);

                // Wait briefly so user sees the message
                setTimeout(() => location.reload(), 1500);
            } catch (error) {
                showFlashMessage(`Failed to edit quote. Error: ${error.message}`, false);
            } finally {
                hideLoading();
            }
        });
    }
}

async function saveQuoteWithAction(action, isAutoSave = false, label = action) {
    if (!action) return;

    if (!quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
    }

    setState({ unsave: false });

    const formData = new FormData(quoteForm);
    const formBody = new URLSearchParams(formData).toString();

    if (!isAutoSave) {
        showLoading();
    }

    try {
        const response = await fetch(`/quote/${quoteID}/${action}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Auto-Save': isAutoSave ? 'true' : 'false',
            },
            body: formBody,
        });

        const result = await response.json();

        if (result.success) {
            if (isAutoSave) {
                showFlashMessage('Quote saved automatically.', true);
                disableButton(quoteSaveBtn, true);
            } else {
                window.location.href = result.redirect;
            }
        } else {
            showFlashMessage(`Failed to ${label} the quote. Error: ${result.message}`, false);
        }
    } catch (error) {
        showFlashMessage(`Error while trying to ${label} the quote. ${error.message}`, false);
    } finally {
        if (!isAutoSave) {
            hideLoading();
        }
    }
}

export { initQuote };
