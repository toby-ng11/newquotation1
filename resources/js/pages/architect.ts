import { hideLoading, showLoading } from '@/components/LoadingOverlay';
import { showFlashMessage } from '@/components/flashmessage';
import { architectID } from '@/components/init';
import { setState } from '@/components/state';

async function initArchitect() {
    const { setupAutoComplete } = await import('@/components/autocomplete');
    const architectForm = document.getElementById('architect-form') as HTMLFormElement;
    const architectFormSaveBtn = document.getElementById('form-btn-save-architect') as HTMLButtonElement;

    // Enable save button on change
    if (architectForm) {
        architectForm.addEventListener('change', () => {
            architectFormSaveBtn.disabled = false;
            setState({ unsave: true, lastChanged: 'project' });
        });
    }

    // Save edit
    if (architectFormSaveBtn) {
        architectFormSaveBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            showLoading();

            try {
                const formData = new FormData(architectForm);
                const action = architectForm.getAttribute('action') as RequestInfo | URL;
                const method = architectForm.getAttribute('method') as string | undefined;

                const response = await fetch(action, {
                    method: method,
                    body: formData,
                });

                const data = await response.json();
                if (data.sucess) {
                    setState({ unsave: false });
                    window.location.href = data.redirect || `/architect/${architectID}/edit`;
                    showFlashMessage(data.message, data.success);
                } else {
                    showFlashMessage(data.message, data.success);
                }
            } catch (error) {
                console.error('Error submitting form:', error);
            } finally {
                hideLoading();
            }
        });
    }

    // Project Form
    setupAutoComplete({
        fieldName: '#architect-search',
        fetchUrl: '/architect',
        queryParamName: 'search',
        limitParamName: 'limit',
        fillFields: [],
        minLength: 2,
        renderItem: (item) => `
    <div class="autocomplete-item">
      <strong>${item.architect_id} - ${item.architect_name}</strong><br>
      <span>${item.architect_rep_id} - ${item.company_id}</span>
    </div>`,
        extraSelectActions: [
            function (item) {
                document.getElementById('search-overlay').classList.remove('active');
                document.body.classList.remove('noscroll');
                window.location.href = `/architect/${item.architect_id}/edit`;
            },
        ],
    });

    // Delete architect
    document.querySelectorAll('.delete-architect-button').forEach((button) => {
        button.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to delete this architect? This will delete all associate addresses and specifiers.')) return;

            showLoading();
            try {
                const response = await fetch(`/architect/${architectID}/delete`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                const data = await response.json();

                if (data.success) {
                    window.location.href = '/index/architect';
                } else {
                    showFlashMessage(data.message || data.success);
                }
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Error occurred while deleting the architect.');
            } finally {
                hideLoading();
            }
        });
    });
}

export { initArchitect };
