import { disableButton } from '@/components/DisableButton';
import { showFlashMessage } from '@/components/flashmessage';
import { projectForm, sheetID, sheetType } from '@/components/init';
import { hideLoading, showLoading } from '@/components/LoadingOverlay';
import { resetForm } from '@/components/utils';

const contactDropdown = document.getElementById('contact_name') as HTMLSelectElement;

async function initCustomer() {
    const { setupAutoComplete } = await import('@/components/autocomplete');

    // Add quote from quote page button
    const addAnotherQuoteBtn = document.getElementById('widget-btn-add-quote') as HTMLButtonElement;
    if (addAnotherQuoteBtn) {
        addAnotherQuoteBtn.addEventListener('click', () => {
            if (window.customerModalComponent) {
                window.customerModalComponent.open = true;
                window.customerModalComponent.isEditing = false;
            }
        });
    }

    // Widget Edit button
    const customerEditBtn = document.getElementById('edit-quote-customer') as HTMLButtonElement;
    if (customerEditBtn) {
        customerEditBtn.addEventListener('click', () => {
            const contactIdInput = document.getElementById('contact_id') as HTMLInputElement;
            const contactId = customerEditBtn.dataset.id as string;
            if (window.customerModalComponent && contactIdInput) {
                window.customerModalComponent.open = true;
                window.customerModalComponent.isEditing = true;
                window.customerModalComponent.getContactInfo(contactId);
            }
        });
    }

    const customerNameInput = document.getElementById('customer_name') as HTMLInputElement;
    if (customerNameInput) {
        setupAutoComplete({
            fieldName: '#customer_name',
            fetchUrl: '/customer',
            fillFields: [
                { fieldSelector: `#customer_id`, itemKey: 'customer_id' },
                {
                    fieldSelector: `#customer_name`,
                    itemKey: 'customer_name',
                },
                { fieldSelector: `#company_id`, itemKey: 'company_id' },
                {
                    fieldSelector: `#salesrep_full_name`,
                    itemKey: 'salesrep_full_name',
                },
            ],
            minLength: 2,
            queryParamName: 'search',
            limitParamName: 'limit',
            renderItem: (item) =>
                `<div>
                    <b>${item.customer_id}</b> - ${item.customer_name} -
                    <span class="text-[0.7rem] italic">${item.from_P21}</span>
                </div>`,
            extraSelectActions: [
                (item) => {
                    if (item.customer_id) {
                        window.customerModalComponent?.getCustomerContacts(item.customer_id);
                    }
                },
            ],
        });
    }

    contactDropdown?.addEventListener('change', () => {
        window.customerModalComponent?.getContactInfo();
    });
}

function customerModal() {
    return {
        open: false,
        isEditing: false,

        async submitForm() {
            const dialogBtnAddCustomer = document.getElementById('customer-make-quote-btn') as HTMLButtonElement;
            disableButton(dialogBtnAddCustomer, true);

            const form = document.getElementById('make-quote-form') as HTMLFormElement;
            if (!form.checkValidity()) {
                form.reportValidity();
                disableButton(dialogBtnAddCustomer, false);
                return;
            }

            const contactID = (document.getElementById('contact_id') as HTMLInputElement)?.value;
            if (!contactID) {
                alert('Please select a contact.');
                disableButton(dialogBtnAddCustomer, false);
                return;
            }

            const formData = new URLSearchParams();

            if (sheetType === 'project') {
                if (projectForm) {
                    const formEntries = new FormData(projectForm);
                    for (const [key, value] of formEntries.entries()) {
                        if (value) formData.append(key, value.toString());
                    }
                }
                formData.append('contact_id', contactID);
                formData.append('project_id', sheetID);
            } else if (sheetType === 'quote') {
                const projectIdInput = (document.getElementById('project_id') as HTMLInputElement)?.value || '';
                formData.append('contact_id', contactID);
                formData.append('project_id', projectIdInput);
            }

            showLoading();

            try {
                const response = await fetch(this.isEditing ? `/quote/${sheetID}/edit?contact=${contactID}` : '/quote', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                    body: formData.toString(),
                });

                const result = await response.json();

                if (result.success && result.quote_id) {
                    resetForm(form);
                    this.open = false;
                    window.location.href = `/quote/${result.quote_id}/edit`;
                } else {
                    console.error('Quote creation error:', result);
                    alert(result?.message || 'Failed to make quote. Please try again.');
                }
            } catch (err: any) {
                console.error('Network or server error:', err);
                alert('An error occurred while creating the quote. Please try again.');
            } finally {
                disableButton(dialogBtnAddCustomer, false);
                hideLoading();
            }
        },
        closeModal() {
            const form = document.getElementById('make-quote-form') as HTMLFormElement;
            resetForm(form);
            this.open = false;
        },

        async getCustomerContacts(customer_id: string) {
            if (!customer_id) return;

            try {
                const res = await fetch(`/customer/${customer_id}/contacts`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!res.ok) throw new Error(`Server returned ${res.status}`);
                const data: { contact_id: string; contact_full_name: string }[] = await res.json();

                const contactSelect = document.getElementById('contact_name') as HTMLSelectElement;

                contactSelect.innerHTML = '';

                data.forEach((item) => {
                    const option = document.createElement('option');
                    option.value = item.contact_id;
                    option.textContent = item.contact_full_name;
                    contactSelect.appendChild(option);
                });

                this.getContactInfo();
            } catch (err: any) {
                showFlashMessage(`Failed to fetch contacts: ${err.message}`, false);
            }
        },

        async getContactInfo(contactId?: string | null) {
            const contactSelect = document.getElementById('contact_name') as HTMLSelectElement;
            const contactID = contactId ?? contactSelect?.value?.trim();
            if (!contactID) return;

            try {
                const res = await fetch(`/customer/${contactID}/contactinfo`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!res.ok) throw new Error(`Server returned ${res.status}`);
                const data = await res.json();

                const contactIdInput = document.getElementById('contact_id') as HTMLInputElement;
                contactIdInput.value = data['contact_id'];

                const fields = [
                    'first_name',
                    'last_name',
                    'phys_address1',
                    'phys_address2',
                    'phys_city',
                    'phys_state',
                    'phys_postal_code',
                    'phys_country',
                    'central_phone_number',
                    'email_address',
                ];

                fields.forEach((field) => {
                    const input = document.getElementById(`contact_${field}`) as HTMLInputElement;
                    if (input) {
                        input.value = data[field] || '';
                    }
                });

                if (this.isEditing) this.getCustomerForEdit(contactID);
            } catch (err: any) {
                showFlashMessage(`Failed to fetch contact info: ${err.message}`, false);
            }
        },
        async getCustomerForEdit(contactId: string) {
            try {
                const res = await fetch(`/customer/${contactId}/customer`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!res.ok) throw new Error(`Server returned ${res.status}`);
                const data = await res.json();

                const fields = ['customer_id', 'customer_name', 'company_id', 'salesrep_full_name'];

                fields.forEach((field) => {
                    const input = document.getElementById(`${field}`) as HTMLInputElement;
                    if (input) {
                        input.value = data[field] || '';
                    }
                });

                const customerId = data['customer_id'];

                await this.getCustomerContactsEdit(customerId, contactId);
            } catch (err: any) {
                showFlashMessage(`Failed to fetch customer: ${err.message}`, false);
            }
        },
        async getCustomerContactsEdit(customerId: string, contactId: string) {
            if (!customerId) return;

            try {
                const res = await fetch(`/customer/${customerId}/contacts`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!res.ok) throw new Error(`Server returned ${res.status}`);
                const data: { contact_id: string; contact_full_name: string }[] = await res.json();

                const contactSelect = document.getElementById('contact_name') as HTMLSelectElement;

                contactSelect.innerHTML = '';

                data.forEach((item) => {
                    const option = document.createElement('option');
                    option.value = item.contact_id;
                    option.textContent = item.contact_full_name;
                    if (item.contact_id === contactId) {
                        option.selected = true;
                    }
                    contactSelect.appendChild(option);
                });
            } catch (err: any) {
                showFlashMessage(`Failed to fetch contacts: ${err.message}`, false);
            }
        },
    };
}

export { customerModal, initCustomer };
