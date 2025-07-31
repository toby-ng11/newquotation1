import { showFlashMessage } from '@/components/flashmessage';
import { submitFormHelper } from '@/components/form-helper';
import { adminAllUsersTable, adminRoleOverrideTable } from '@/components/ui/table/tables';
import { resetForm } from '@/components/utils';

async function initRoleOverride() {
    const { setupAutoComplete } = await import('@/components/autocomplete');

    // Autocomplete for shared_id
    setupAutoComplete({
        fieldName: '#ro_user_id',
        fetchUrl: '/user/fetchbypattern',
        fillFields: [
            { fieldSelector: '#ro_user_id', itemKey: 'id' },
            { fieldSelector: '#ro_role', itemKey: 'p2q_system_role' },
        ],
        renderItem: (item) => `<div><strong>${item.id} - ${item.p2q_system_role}</strong><br>${item.name}</div>`,
    });

    // Edit button
    document.addEventListener('click', function (e: Event) {
        const target = e.target as HTMLElement;
        if (target.closest('.role-override-edit')) {
            e.preventDefault();
            const editBtn = target.closest('.role-override-edit') as HTMLAnchorElement;
            const roleOverrideId = editBtn.dataset.id as string;

            if (window.roleOverrideModalComponent && roleOverrideId) {
                window.roleOverrideModalComponent.editRoleOverride(roleOverrideId);
            }
        }
    });

    // Delete button
    document.addEventListener('click', async function (e: Event) {
        const target = e.target as HTMLElement;
        const deleteBtn = target.closest('.role-override-delete') as HTMLButtonElement;

        if (deleteBtn) {
            e.preventDefault();
            const roleOverrideId = deleteBtn.dataset.id;
            if (!roleOverrideId) return;

            const confirmed = confirm('Are you sure you want to delete this role override?');
            if (!confirmed) return;

            try {
                const response = await fetch(`/role-override/${roleOverrideId}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    adminRoleOverrideTable.ajax.reload();
                    adminAllUsersTable.ajax.reload();
                } else {
                    showFlashMessage(data.message || data.success);
                }
            } catch (err) {
                alert('Error deleting role override.');
                console.error(err);
            }
        }
    });
}

function roleOverrideModal() {
    const form = document.getElementById('role-override-form') as HTMLFormElement;

    return {
        open: false,
        isEditing: false,

        // Save note
        async submitForm() {
            await submitFormHelper({
                form,
                idField: 'ro_user_id',
                isEditing: this.isEditing,
                endpoint: '/role-override',
                reloadTables: [() => adminRoleOverrideTable.ajax.reload(), () => adminAllUsersTable.ajax.reload()],
                onSuccess: () => {
                    this.open = false;
                },
            });
        },
        // Edit note
        async editRoleOverride(projectShareId: string) {
            try {
                const response = await fetch(`/role-override/${projectShareId}`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                const data = await response.json();

                if (data.success && data.role_override) {
                    (form.querySelector('[name="ro_user_id"]') as HTMLInputElement).value = data.role_override.user_id;
                    (form.querySelector('[name="ro_role"]') as HTMLSelectElement).value = data.role_override.override_role;

                    this.open = true;
                    this.isEditing = true;
                } else {
                    alert('Role override not found.');
                }
            } catch (error) {
                console.error('Error loading role override:', error);
                alert('Failed to load role override.');
            }
        },
        closeModal() {
            resetForm(form);
            this.isEditing = false;
            this.open = false;
        },
    };
}

export { initRoleOverride, roleOverrideModal };
