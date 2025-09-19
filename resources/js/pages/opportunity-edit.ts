import { showFlashMessage } from '@/components/flashmessage';
import { sheetID } from '@/components/init';
import { hideLoading, showLoading } from '@/components/LoadingOverlay';

export function initOpportunity() {
    // Delete
    document.querySelectorAll('.opp-delete-btn').forEach((button) => {
        button.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to delete this opportunity? Projects and quotes by this opportunity will also be deleted.')) return;

            showLoading();
            try {
                const response = await fetch(`/opportunities/${sheetID}`, {
                    method: 'DELETE',
                });
                const data = await response.json();

                if (data.success) {
                    window.location.href = '/index/opportunities';
                } else {
                    alert(data.message || 'Failed to delete the project.');
                }
            } catch (error) {
                console.error('Delete failed:', error);
                alert('Error occurred while deleting the project.');
            } finally {
                hideLoading();
            }
        });
    });

    const form = document.getElementById('edit-opportunity-form') as HTMLFormElement;
    const submitButton = document.getElementById('save-opp-button') as HTMLButtonElement;

    form?.addEventListener('submit', () => {
        showLoading();
        submitButton.disabled = true;
        submitButton.textContent = "Saving...";
    });

    // Convert to project
    const confirmDialog = document.getElementById('confirm-convert-dialog') as HTMLDialogElement;

    document.querySelectorAll('.opp-to-project-btn').forEach((button) => {
        button.addEventListener('click', () => {
            confirmDialog?.showModal();
        });
    });

    document.querySelectorAll<HTMLButtonElement>('.confirm-convert-button').forEach((button: HTMLButtonElement) => {
        button.addEventListener('click', async () => {
            showLoading();
            try {
                const response = await fetch(`/opportunities/${sheetID}/convert`, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                    },
                });
                const data = await response.json();

                if (data.success) {
                    window.location.href = `/project/${data.project_id}/edit`;
                } else {
                    showFlashMessage(data.message, data.success);
                }
            } catch (error: any) {
                showFlashMessage(error, false);
            } finally {
                hideLoading();
                confirmDialog?.close();
            }
        });
    });
}
