import { showFlashMessage } from '@/components/flashmessage';
import { resetForm } from '@/components/utils';

export function opportunityModal() {
    return {
        open: false,
        projectName: '',
        projectDescription: '',
        async submitForm() {
            const form = document.getElementById('architect-edit-project-form') as HTMLFormElement;
            const formData = new FormData(form);

            const ownerInput = document.getElementById('owner_id') as HTMLInputElement;
            if (ownerInput) {
                formData.append('owner_id', ownerInput.value);
            }

            try {
                const response = await fetch('/opportunities', {
                    method: 'POST',
                    body: formData,
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
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
        closeModal() {
            const form = document.getElementById('architect-edit-project-form') as HTMLFormElement;
            resetForm(form);
            this.projectName = '';
            this.projectDescription = '';
            this.open = false;
        },
    };
}
