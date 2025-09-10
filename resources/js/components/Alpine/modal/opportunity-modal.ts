import { showFlashMessage } from '@/components/flashmessage';
import { resetForm } from '@/components/utils';

export function opportunityModal() {
    return {
        open: false,
        async submitForm() {
            const form = document.getElementById('new-opportunity-form') as HTMLFormElement;
            const formData = new FormData(form);

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
            const form = document.getElementById('new-opportunity-form') as HTMLFormElement;
            resetForm(form);
            this.open = false;
        },
    };
}
