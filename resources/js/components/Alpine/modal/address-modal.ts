import { showFlashMessage } from '@/components/flashmessage';
import { sheetID } from '@/components/init';
import { architectAddressesTable } from '@/components/ui/table/tables';
import { resetForm } from '@/components/utils';

function initAddress() {
    // Edit button
    document.addEventListener('click', function (e: Event) {
        const target = e.target as HTMLElement;
        if (target.closest('.address-edit')) {
            e.preventDefault();
            const addressEditBtn = target.closest('.address-edit') as HTMLAnchorElement;
            const addressID = addressEditBtn.dataset.id as string;

            if (window.addressModalComponent && addressID) {
                window.addressModalComponent.editAddress(addressID);
            }
        }
    });

    // Delete button
    document.addEventListener('click', async function (e: Event) {
        const target = e.target as HTMLElement;
        const deleteBtn = target.closest('.address-delete') as HTMLButtonElement;

        if (deleteBtn) {
            e.preventDefault();
            const specfierID = deleteBtn.dataset.id;
            if (!specfierID) return;

            const confirmed = confirm('Are you sure you want to delete this address?');
            if (!confirmed) return;

            try {
                const response = await fetch(`/addresses/${specfierID}/delete`, {
                    method: 'POST',
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    architectAddressesTable.ajax.reload();
                } else {
                    showFlashMessage(data.message || data.success);
                }
            } catch (err) {
                alert('Error deleting address.');
                console.error(err);
            }
        }
    });
}

function addressModal() {
    const form = document.getElementById('address-form') as HTMLFormElement;

    return {
        open: false,
        isEditing: false,

        // Save note
        async submitForm() {
            const formData = new FormData(form);
            formData.append('architect_id', sheetID);

            const addressID = form.address_id.value;
            this.isEditing = !!addressID;

            try {
                const response = await fetch(this.isEditing ? `/addresses/${addressID}/edit` : '/addresses', {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    architectAddressesTable.ajax.reload();
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
        async editAddress(addressID: string) {
            try {
                const response = await fetch(`/addresses/${addressID}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                const data = await response.json();

                if (data && data.address) {
                    form.address_name.value = data.address.address_name;
                    form.phys_address1.value = data.address.phys_address1;
                    form.phys_address2.value = data.address.phys_address2 || '';
                    form.phys_city.value = data.address.phys_city || '';
                    form.phys_state.value = data.address.phys_state || '';
                    form.phys_postal_code.value = data.address.phys_postal_code || '';
                    form.phys_country.value = data.address.phys_country || '';
                    form.central_phone_number.value = data.address.central_phone_number || '';
                    form.email_address.value = data.address.email_address || '';
                    form.url.value = data.address.url || '';
                    form.address_id.value = addressID;

                    this.open = true;
                    this.isEditing = true;
                } else {
                    alert('Address not found.');
                }
            } catch (error) {
                console.error('Error loading address:', error);
                alert('Failed to load address.');
            }
        },
        closeModal() {
            resetForm(form);
            this.isEditing = false;
            this.open = false;
        },
    };
}

export { addressModal, initAddress };
