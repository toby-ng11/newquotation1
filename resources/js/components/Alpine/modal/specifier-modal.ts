import { showFlashMessage } from '@/components/flashmessage';
import { sheetID } from '@/components/init';
import { architectSpecifiersTable } from '@/components/ui/table/tables';
import { resetForm } from '@/components/utils';

function initSpecifier() {
    // Edit button
    document.addEventListener('click', function (e: Event) {
        const target = e.target as HTMLElement;
        if (target.closest('.specifier-edit')) {
            e.preventDefault();
            const specifierEditBtn = target.closest('.specifier-edit') as HTMLAnchorElement;
            const specfierID = specifierEditBtn.dataset.id as string;

            if (window.specifierModalComponent && specfierID) {
                window.specifierModalComponent.editSpecifier(specfierID);
            }
        }
    });

    // Delete button
    document.addEventListener('click', async function (e: Event) {
        const target = e.target as HTMLElement;
        const deleteBtn = target.closest('.specifier-delete') as HTMLButtonElement;

        if (deleteBtn) {
            e.preventDefault();
            const specfierID = deleteBtn.dataset.id;
            if (!specfierID) return;

            const confirmed = confirm('Are you sure you want to delete this specifier?');
            if (!confirmed) return;

            try {
                const response = await fetch(`/specifiers/${specfierID}/delete`, {
                    method: 'POST',
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    architectSpecifiersTable.ajax.reload();
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

function specifierModal() {
    const form = document.getElementById('specifier-form') as HTMLFormElement;

    return {
        open: false,
        isEditing: false,

        // Save note
        async submitForm() {
            const formData = new FormData(form);
            formData.append('architect_id', sheetID);

            const specifierID = form.specifier_id.value;
            this.isEditing = !!specifierID;

            try {
                const response = await fetch(this.isEditing ? `/specifiers/${specifierID}/edit` : '/specifiers', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    architectSpecifiersTable.ajax.reload();
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
        async editSpecifier(specifierID: string) {
            try {
                const response = await fetch(`/specifiers/${specifierID}`);
                const data = await response.json();

                if (data && data.specifier) {
                    form.specifier_first_name.value = data.specifier.first_name;
                    form.specifier_last_name.value = data.specifier.last_name || '';
                    form.specifier_job_title.value = data.specifier.job_title || '';
                    form.specifier_phone_number.value = data.specifier.central_phone_number || '';
                    form.specifier_email.value = data.specifier.email_address || '';
                    form.specifier_address_id.value = data.specifier.address_id;
                    form.specifier_id.value = specifierID;

                    this.open = true;
                    this.isEditing = true;
                } else {
                    alert('Specifier not found.');
                }
            } catch (error) {
                console.error('Error loading specifier:', error);
                alert('Failed to load specifier.');
            }
        },
        closeModal() {
            resetForm(form);
            this.isEditing = false;
            this.open = false;
        },
    };
}

export { initSpecifier, specifierModal };
