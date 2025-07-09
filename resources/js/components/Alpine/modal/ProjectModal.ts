import { showFlashMessage } from '@/components/flashmessage';
import { architectID } from '@/components/init';
import { architectProjectsTable } from '@/components/ui/table/tables';
import { resetForm } from '@/components/utils';

export function projectModal() {
    return {
        open: false,
        projectName: '',
        projectDescription: '',
        architectId: architectID,
        async submitForm() {
            const form = document.getElementById('architect-edit-project-form');
            const formData = new FormData(form);

            const ownerInput = document.getElementById('owner_id');
            if (ownerInput) {
                formData.append('owner_id', ownerInput.value);
            }
            formData.append('architect_id', this.architectId);

            try {
                const response = await fetch('/project', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    architectProjectsTable.ajax.reload();
                    resetForm();
                    this.open = false;
                } else {
                    showFlashMessage(data.message, data.success);
                }
            } catch (err) {
                alert('Error submitting form.');
                console.error(err);
            }
        },
        closeModal() {
            const form = document.getElementById('architect-edit-project-form');
            resetForm(form);
            this.projectName = '';
            this.projectDescription = '';
            this.open = false;
        },
    };
}
