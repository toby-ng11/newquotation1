import { showFlashMessage } from '@/components/flashmessage';
import { sheetID, sheetType } from '@/components/init';
import { itemTable } from '@/components/ui/table/tables';
import { resetForm } from '@/components/utils';

const uomDropdown = document.getElementById('unit_of_measure') as HTMLSelectElement;

async function initItem() {
    const { setupAutoComplete } = await import('@/components/autocomplete');

    // Edit button
    document.addEventListener('click', function (e: Event) {
        const target = e.target as HTMLElement;
        if (target.closest('.item-edit')) {
            e.preventDefault();
            const itemEditBtn = target.closest('.item-edit') as HTMLButtonElement;
            const itemUID = itemEditBtn.dataset.id as string;

            if (window.itemModalComponent && itemUID) {
                window.itemModalComponent.editNote(itemUID);
            }
        }
    });

    // Delete button
    document.addEventListener('click', async function (e: Event) {
        const target = e.target as HTMLElement;
        const deleteBtn = target.closest('.item-delete') as HTMLButtonElement;

        if (deleteBtn) {
            e.preventDefault();
            const itemUID = deleteBtn.dataset.id;
            if (!itemUID) return;

            const confirmed = confirm('Are you sure you want to delete this item?');
            if (!confirmed) return;

            try {
                const response = await fetch(`/item/${itemUID}/delete?type=${sheetType}`, {
                    method: 'POST',
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    itemTable.ajax.reload();
                } else {
                    showFlashMessage(data.message || data.success);
                }
            } catch (err) {
                alert('Error deleting item.');
                console.error(err);
            }
        }
    });

    const projectBranch = document.getElementById('location_id') as HTMLInputElement;
    const quoteBranch = document.getElementById('quote_branch') as HTMLInputElement;

    const itemUrl = `/item/index` ;

    // Autocomplete for Item ID
    if (document.querySelector('#dialog-item-form #item_code')) {
        setupAutoComplete({
            fieldName: '#dialog-item-form #item_code',
            fetchUrl: '/item/index',
            fillFields: [
                { fieldSelector: '#item_code', itemKey: 'item_id' },
                { fieldSelector: '#item_input', itemKey: 'item_desc' },
            ],
            minLength: 2,
            queryParamName: 'term',
            limitParamName: 'limit',
            renderItem: (item) => `
      <div class="autocomplete-item">
        <strong>${item.item_id}</strong><br>
        <span>${item.item_desc}</span>
      </div>`,
            extraSelectActions: [
                (item) => {
                    if (item.item_id) {
                        window.itemModalComponent?.getUOM(item.item_id);
                        uomDropdown.disabled = false;
                        uomDropdown.classList.remove('disabled');
                    }
                },
            ],
        });
    }

    uomDropdown?.addEventListener('change', () => {
        const itemIDField = document.getElementById('item_code') as HTMLInputElement;
        window.itemModalComponent?.getP21Price(itemIDField.value, uomDropdown.value);
    });
}

function itemModal() {
    const form = document.getElementById('dialog-item-form') as HTMLFormElement;

    return {
        open: false,
        isEditing: false,

        // Save note
        async submitForm() {
            const formData = new FormData(form);
            formData.append('sheet_id', sheetID);
            formData.append('sheet_type', sheetType);

            const itemUID = form.item_id.value;
            this.isEditing = !!itemUID;

            try {
                const response = await fetch(this.isEditing ? `/item/${itemUID}/edit` : '/item', {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    itemTable.ajax.reload();
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
        // Fetch item for edit
        async editNote(itemUID: string) {
            try {
                const response = await fetch(`/item/${itemUID}?type=${sheetType}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                const data = await response.json();

                if (data && data.item) {
                    this.isEditing = true;

                    form.item_id.value = itemUID;
                    form.item_code.value = data.item.item_code;
                    form.unit_of_measure.value = data.item.unit_of_measure;
                    form.quantity.value = data.item.quantity;
                    form.note.value = data.item.note || '';

                    await this.getUOM(data.item.item_code, data.item.unit_of_measure, data.item.unit_price, itemUID);

                    this.open = true;
                    this.isEditing = true;
                } else {
                    alert('Item not found.');
                }
            } catch (error) {
                console.error('Error loading item:', error);
                alert('Failed to load item.');
            }
        },
        closeModal() {
            resetForm(form);
            this.isEditing = false;
            this.open = false;
        },
        // Fetch UOMs and select the old one when editing
        async getUOM(item_id: string, old_uom: string, old_price: string, item_uid: string) {
            if (!item_id) return;
            try {
                const response = await fetch(`/item/${item_id}/uom`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const data: { uom: string }[] = await response.json();

                uomDropdown.innerHTML = '';

                data.forEach((item) => {
                    const option = document.createElement('option');
                    option.value = item.uom;
                    option.textContent = item.uom;

                    if (old_uom && item.uom === old_uom) {
                        option.selected = true;
                    }

                    uomDropdown.appendChild(option);
                });

                if (this.isEditing) {
                    await this.getQuotedPrice(item_uid);
                } else {
                    await this.getP21Price(item_id, old_uom || uomDropdown.value, old_price);
                }
            } catch (error) {
                console.error('Error fetching UOMs:', error);
            }
        },

        // Fetch P21 Item Price
        async getP21Price(item_id: string, uom: string, old_price: string | null = null) {
            if (!item_id || !uom) return;

            try {
                const response = await fetch(`/item/${item_id}/price?uom=${uom}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                const data = await response.json();

                const input = document.getElementById('unit_price') as HTMLInputElement;
                input.value = data?.price || old_price || '';
            } catch (err) {
                console.error('Error fetching price:', err);
            }
        },

        async getQuotedPrice(item_uid: string) {
            if (!item_uid) return;

            try {
                const response = await fetch(`/item/${item_uid}/quotedprice?type=${sheetType}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                const data = await response.json();

                const input = document.getElementById('unit_price') as HTMLInputElement;
                input.value = data?.unit_price || '';
            } catch (err) {
                console.error('Error fetching quoted price:', err);
            }
        },
    };
}

export { initItem, itemModal };
