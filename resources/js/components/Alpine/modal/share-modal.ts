import { showFlashMessage } from '@/components/flashmessage';
import { sheetID } from '@/components/init';
import { projectShareTable } from '@/components/ui/table/tables';
import { resetForm } from '@/components/utils';

async function initShare() {
    const { setupAutoComplete } = await import('@/components/autocomplete');

    // Autocomplete for shared_id
    setupAutoComplete({
        fieldName: '#shared_user',
        fetchUrl: '/user/fetchbypattern',
        fillFields: [{ fieldSelector: '#shared_user', itemKey: 'id' }],
        renderItem: (item) => `<div><strong>${item.id}</strong><br>${item.name}</div>`,
    });

    // Edit button
    document.addEventListener('click', function (e: Event) {
        const target = e.target as HTMLElement;
        if (target.closest('.project-share-edit')) {
            e.preventDefault();
            const editBtn = target.closest('.project-share-edit') as HTMLAnchorElement;
            const projectShareId = editBtn.dataset.id as string;

            if (window.shareModalComponent && projectShareId) {
                window.shareModalComponent.editShare(projectShareId);
            }
        }
    });

    // Delete button
    document.addEventListener('click', async function (e: Event) {
        const target = e.target as HTMLElement;
        const deleteBtn = target.closest('.project-share-delete') as HTMLButtonElement;

        if (deleteBtn) {
            e.preventDefault();
            const projectShareId = deleteBtn.dataset.id;
            if (!projectShareId) return;

            const confirmed = confirm('Are you sure you want to delete this specifier?');
            if (!confirmed) return;

            try {
                const response = await fetch(`/projectshare/${projectShareId}/delete`, {
                    method: 'POST',
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    projectShareTable.ajax.reload();
                } else {
                    showFlashMessage(data.message || data.success);
                }
            } catch (err) {
                alert('Error deleting specifier.');
                console.error(err);
            }
        }
    });
}

function shareModal() {
    const form = document.getElementById('share-form') as HTMLFormElement;

    return {
        open: false,
        isEditing: false,

        // Save note
        async submitForm() {
            const formData = new FormData(form);
            formData.append('project_id', sheetID);

            const projectShareId = form.project_share_id.value;
            this.isEditing = !!projectShareId;

            try {
                const response = await fetch(this.isEditing ? `/projectshare/${projectShareId}/edit` : '/projectshare', {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    projectShareTable.ajax.reload();
                    resetForm(form);
                    this.open = false;
                } else {
                    showFlashMessage(data.message, data.success);
                }
            } catch (err) {
                alert('Error submitting form.');
                console.error(err);
            }
        },
        // Edit note
        async editShare(projectShareId: string) {
            try {
                const response = await fetch(`/projectshare/${projectShareId}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                const data = await response.json();

                if (data && data.project_share) {
                    (form.querySelector('[name="shared_user"]') as HTMLInputElement).value = data.project_share.shared_user;
                    (form.querySelector('[name="role"]') as HTMLInputElement).value = data.project_share.role;
                    (form.querySelector('[name="project_share_id"]') as HTMLInputElement).value = projectShareId;

                    this.open = true;
                    this.isEditing = true;
                } else {
                    alert('Share user not found.');
                }
            } catch (error) {
                console.error('Error loading share user:', error);
                alert('Failed to load share user.');
            }
        },
        closeModal() {
            resetForm(form);
            this.isEditing = false;
            this.open = false;
        },
    };
}

export { initShare, shareModal };
