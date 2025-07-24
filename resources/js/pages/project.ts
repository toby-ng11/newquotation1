import { disableAutoSave, initAutoSave } from '@/components/AutoSave';
import { disableButton } from '@/components/DisableButton';
import { showFlashMessage } from '@/components/flashmessage';
import { projectForm, projectID } from '@/components/init.js';
import { hideLoading, showLoading } from '@/components/LoadingOverlay';
import { setState } from '@/components/state';

const architectDetails = document.querySelector('#architect-details') as HTMLDetailsElement;
const architectNameInput = document.querySelector('#architect_name') as HTMLInputElement;
const contractorDetails = document.querySelector('#contractor-details') as HTMLDetailsElement;
const generalContractorInput = document.querySelector('#general_contractor_name') as HTMLInputElement;
const awardedContractorInput = document.querySelector('#awarded_contractor_name') as HTMLInputElement;
const saveButton = document.getElementById('form-btn-save-project') as HTMLButtonElement;

async function initProject() {
    const { setupAutoComplete } = await import('@/components/autocomplete');

    if (projectForm && projectForm.dataset.page === 'edit') {
        initAutoSave(projectForm, () => saveProject(true));
    }

    // Autocomplete for architect_rep
    setupAutoComplete({
        fieldName: '#architect_rep_id',
        fetchUrl: '/user/fetchbypattern',
        fillFields: [{ fieldSelector: '#architect_rep_id', itemKey: 'id' }],
        renderItem: (item) => `<div><strong>${item.id}</strong><br>${item.name}</div>`,
    });

    // Auto expand architect details
    if (architectDetails && architectNameInput.value.trim() !== '') architectDetails.open = true;

    // Auto expand contractor details
    // if either general or awarded contractor field is available (check with length)
    if (contractorDetails && (generalContractorInput.value.trim() !== '' || awardedContractorInput.value.trim() !== ''))
        contractorDetails.open = true;

    // Enable save button
    if (projectForm) {
        projectForm.addEventListener('change', () => {
            (document.querySelector('#form-btn-save-project') as HTMLButtonElement).disabled = false;
            setState({ unsave: true, lastChanged: 'project' });
        });
    }

    // Save edit
    if (saveButton) {
        saveButton.addEventListener('click', async (e) => {
            e.preventDefault();
            saveProject();
        });
    }

    // Delete project
    document.querySelectorAll('.delete_pro').forEach((button) => {
        button.addEventListener('click', async () => {
            if (!confirm('Are you sure you want to delete this project?')) return;

            showLoading();
            try {
                const response = await fetch(`/project/${projectID}/delete`, {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                });
                const data = await response.json();

                if (data.success) {
                    window.location.href = '/index/home';
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

    /* ----------------------------- Contractor / Customer -------------------------------- */

    const contractorFields = [
        {
            fieldName: '#general_contractor_name',
            targetPrefix: 'general_contractor',
        },
        {
            fieldName: '#awarded_contractor_name',
            targetPrefix: 'awarded_contractor',
        },
    ];

    // Loop over both and initialize autocomplete
    contractorFields.forEach(({ fieldName, targetPrefix }) => {
        setupAutoComplete({
            fieldName,
            fetchUrl: '/customer',
            fillFields: [],
            minLength: 2,
            queryParamName: 'search',
            limitParamName: 'limit',
            renderItem: (item) => `
        <div class="autocomplete-item">
          <strong>${item.customer_id} - ${item.company_id}</strong><br>
          <span>${item.customer_name}</span>
        </div>`,
            extraSelectActions: [
                (item) => {
                    if (item.customer_id) {
                        fetchAndFillContractor(item.customer_id, targetPrefix);
                    }
                },
            ],
        });
    });

    async function fetchAndFillContractor(id: string, prefix: string) {
        if (!id || !prefix) return;
        try {
            const response = await fetch(`/customer/${id}/fetchbyid`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const result = await response.json();

            if (result) {
                const idField = document.getElementById(`${prefix}_id`) as HTMLInputElement;
                const nameField = document.getElementById(`${prefix}_name`) as HTMLInputElement;

                if (idField) idField.value = result.customer_id || '';
                if (nameField) nameField.value = result.customer_name || '';
            }
        } catch (error: any) {
            showFlashMessage(`Failed to fetch contractor (${id}): ${error.message}`, false);
        }
    }
}

async function saveProject(isAutoSave = false) {
    if (!projectForm.checkValidity()) {
        projectForm.reportValidity();
        return;
    }
    if (generalContractorInput.value.trim() === '') (document.querySelector('#general_contractor_id') as HTMLInputElement).value = '';
    if (awardedContractorInput.value.trim() === '') (document.querySelector('#awarded_contractor_id') as HTMLInputElement).value = '';

    if (!isAutoSave) {
        showLoading();
    }
    setState({ unsave: false });
    const formData = new FormData(projectForm);
    const formAction = projectForm.getAttribute('action') as RequestInfo | URL;
    const formMethod = projectForm.getAttribute('method') as string | undefined;

    try {
        const response = await fetch(formAction, {
            method: formMethod,
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Auto-Save': isAutoSave ? 'true' : 'false',
            },
        });
        const data = await response.json();

        if (data.success) {
            if (isAutoSave) {
                showFlashMessage('Changes auto-saved.', true);
                disableButton(saveButton, true);
            } else {
                window.location.href = data.redirect;
            }
        } else {
            window.location.href = data.redirect;
        }
    } catch (error) {
        console.error('Save failed:', error);
        alert('An error occurred while saving the project.');
    } finally {
        if (!isAutoSave) {
            hideLoading();
        }
    }
}

let isProjectArchitectFormSaved = true;

async function initArchitectForm() {
    const { setupAutoComplete } = await import('@/components/autocomplete');

    const architectFields = document.querySelectorAll(
        '#architect_name, #architect_id, #architect_company_id, #architect_rep_id,#architect_type_id, #architect_class_id',
    ) as NodeListOf<HTMLInputElement>;

    const addressDropdown = document.getElementById('address_list') as HTMLSelectElement;
    const addressFields = document.querySelectorAll(
        '#address_id, #address_name, #phys_address1, #phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, #central_phone_number, #email_address, #url',
    ) as NodeListOf<HTMLInputElement>;

    const specifierDropdown = document.getElementById('specifier_name') as HTMLSelectElement;
    const specifierFields = document.querySelectorAll(
        '#specifier_id, #specifier_address_id, #specifier_first_name, #specifier_last_name, #specifier_job_title, #specifier_phone_number, #specifier_email',
    ) as NodeListOf<HTMLInputElement>;

    const architectForm = document.getElementById('project-architect-form') as HTMLFormElement;
    const architectFormSaveBtn = document.getElementById('form-btn-save-architect-project') as HTMLButtonElement;
    const architectIDField = document.getElementById('architect_id') as HTMLInputElement;

    setupAutoComplete({
        fieldName: '#architect_name',
        fetchUrl: '/architect',
        fillFields: [],
        minLength: 2,
        queryParamName: 'search',
        limitParamName: 'limit',
        renderItem: (item) => `
    <div class="autocomplete-item">
      <strong>${item.architect_name}</strong><br>
      <span>${item.architect_rep_id} - ${item.company_id}</span>
    </div>`,
        extraSelectActions: [
            (item) => {
                if (item.architect_id) {
                    getArchitectById(item.architect_id);
                    getAddress(item.architect_id);
                    getSpecifier(item.architect_id);
                }
            },
        ],
    });

    async function getArchitectById(id: string) {
        if (!id) return;

        try {
            const response = await fetch(`/architect/${id}/fetchfull`);
            if (!response.ok) throw new Error('Something happened. Please try again');

            const architect = await response.json();

            if (architect) {
                architectFields.forEach((field) => {
                    const fieldName = field.id;
                    field.value = architect[fieldName] || '';
                });

                const companyField = document.getElementById('architect_company_id') as HTMLSelectElement;
                if (companyField) companyField.value = architect.company_id || '';

                const nameField = document.getElementById('architect_name') as HTMLInputElement;
                if (nameField) nameField.readOnly = false;
            } else {
                // Clear fields if no architect found
                architectFields.forEach((field) => {
                    field.value = '';
                    field.readOnly = false;
                });
                showFlashMessage(`No architect found for this ${id}`, false);
            }
        } catch (error: any) {
            showFlashMessage(error, false);
        }
    }

    async function getAddress(id: string) {
        if (!id) return;
        try {
            const response = await fetch(`/architect/${id}/address`);
            if (!response.ok) throw new Error('Something happened. Please try again');

            const addresses = await response.json();

            if (addresses) {
                addressDropdown.innerHTML = '';
                if (!addresses || addresses.length === 0) {
                    addressDropdown.innerHTML = `<option value="">No addresses found, please add.</option>`;
                    addressFields.forEach((field) => {
                        field.value = '';
                        field.readOnly = false;
                    });
                    return;
                }

                addresses.forEach((item: Record<string, any>) => {
                    const option = document.createElement('option');
                    option.value = item.address_id;
                    option.textContent = item.name;
                    addressDropdown.appendChild(option);
                });

                const newOption = document.createElement('option');
                newOption.value = 'new';
                newOption.textContent = '+ Add New Address';
                addressDropdown.appendChild(newOption);

                addressDropdown.selectedIndex = 0;
                getAddressInfo(addressDropdown);
            }
        } catch (error: any) {
            showFlashMessage(error, false);
        }
    }

    async function getAddressInfo(dropdown: HTMLSelectElement) {
        const addressID = dropdown.value;
        if (!addressID || addressID === 'new') return;

        try {
            const response = await fetch(`/architect/${addressID}/addressinfo`);
            if (!response.ok) throw new Error('Something happened. Please try again');

            const address = await response.json();
            if (address) {
                addressFields.forEach((field) => {
                    const fieldName = field.id;
                    field.value = address[fieldName] || '';
                });
                const addressNickname = document.getElementById('address_name') as HTMLInputElement;
                if (addressNickname) addressNickname.value = address.name || '';
            }
        } catch (error: any) {
            showFlashMessage(error, false);
        }
    }

    async function getSpecifier(id: string) {
        if (!id) return;

        try {
            const response = await fetch(`/architect/${id}/fetchspecs`);
            if (!response.ok) throw new Error('Network response was not ok');

            const specifiers = await response.json();

            specifierDropdown.innerHTML = '';

            if (!specifiers || specifiers.length === 0) {
                specifierDropdown.innerHTML = '<option value="">No specifiers found, please add.</option>';

                specifierFields.forEach((field) => {
                    field.value = '';
                    field.readOnly = false;
                });

                return;
            }

            specifiers.forEach((item: Record<string, any>) => {
                const option = document.createElement('option');
                option.value = item.specifier_id;
                option.textContent = `${item.first_name} ${item.last_name}`;
                specifierDropdown.appendChild(option);
            });

            const newOption = document.createElement('option');
            newOption.value = 'new';
            newOption.textContent = '+ Add New Specifier';
            specifierDropdown.appendChild(newOption);

            specifierDropdown.selectedIndex = 0;
            getSpecifierInfo(specifierDropdown);
        } catch (error: any) {
            showFlashMessage(error, false);
        }
    }

    async function getSpecifierInfo(dropdown: HTMLSelectElement) {
        const specifierId = dropdown.value;
        if (!specifierId || specifierId === 'new') return;

        try {
            const response = await fetch(`/architect/${specifierId}/specinfo`);
            if (!response.ok) throw new Error('Network response was not ok');

            const specifier = await response.json();

            if (specifier) {
                const fieldMap = {
                    specifier_id: 'specifier_id',
                    specifier_address_id: 'address_id',
                    specifier_first_name: 'first_name',
                    specifier_last_name: 'last_name',
                    specifier_job_title: 'job_title',
                    specifier_phone_number: 'central_phone_number',
                    specifier_email: 'email_address',
                };

                Object.entries(fieldMap).forEach(([fieldId, dataKey]) => {
                    const field = document.getElementById(fieldId) as HTMLInputElement;
                    if (field) field.value = specifier[dataKey] || '';
                });
            }
        } catch (error) {
            console.error('Error fetching specifier details:', error);
        }
    }

    // Init auto save
    if (architectForm && architectIDField.value != '') {
        (document.getElementById('architect_name') as HTMLInputElement).readOnly = true;
        //initAutoSave(architectForm, () => saveProjectArchitectForm(true));
    }

    const addArchitectProjectEditBtn = document.getElementById('add-architect-project-edit') as HTMLButtonElement;

    if (addArchitectProjectEditBtn) {
        addArchitectProjectEditBtn.addEventListener('click', (e) => {
            console.log('Add Architect Project Edit Button Clicked');
            e.preventDefault();
            disableAutoSave();
            architectFields.forEach((field) => {
                field.readOnly = false;
                field.value = '';
            });
            addressFields.forEach((field) => {
                field.readOnly = false;
                field.value = '';
            });
            specifierFields.forEach((field) => {
                field.readOnly = false;
                field.value = '';
            });
            [addressDropdown, specifierDropdown].forEach(
                (dropdown) => (dropdown.innerHTML = '<option value="">-- Please search for an architect first --</option>'),
            );
            disableButton(architectFormSaveBtn, false);
            isProjectArchitectFormSaved = false;
        });
    }

    if (specifierDropdown) {
        specifierDropdown.addEventListener('change', function () {
            if (this.value === 'new') {
                disableAutoSave();
                specifierFields.forEach((field) => {
                    field.value = '';
                    field.readOnly = false;
                });
            } else {
                getSpecifierInfo(specifierDropdown);
            }
        });
    }

    if (addressDropdown) {
        addressDropdown.addEventListener('change', function () {
            if (this.value === 'new') {
                disableAutoSave();
                // Clear and unlock fields for adding a new address
                addressFields.forEach((field) => {
                    field.value = '';
                    field.readOnly = false;
                });
            } else {
                getAddressInfo(addressDropdown);
            }
        });
    }

    // Enable save button on change
    if (architectForm) {
        architectForm.addEventListener('change', () => {
            disableButton(architectFormSaveBtn, false);
            isProjectArchitectFormSaved = false;
        });
    }

    if (architectFormSaveBtn) {
        architectFormSaveBtn.addEventListener('click', async function (e) {
            e.preventDefault();
            isProjectArchitectFormSaved = true;
            architectFormSaveBtn.disabled = true;
            await saveProjectArchitectForm();
        });
    }

    window.onbeforeunload = function () {
        if (!isProjectArchitectFormSaved) {
            architectFormSaveBtn.focus();
            return 'You have unsaved changes. Do you want to leave this page?';
        }
    };
}

async function saveProjectArchitectForm(isAutoSave = false) {
    const architectForm = document.getElementById('project-architect-form') as HTMLFormElement;
    const architectFormSaveBtn = document.getElementById('form-btn-save-architect-project') as HTMLButtonElement;

    if (!isAutoSave) {
        showLoading();
    }

    try {
        const formData = new FormData(architectForm);
        const action = architectForm.getAttribute('action') as RequestInfo | URL;
        const method = architectForm.getAttribute('method') as string | undefined;

        const response = await fetch(action, {
            method: method,
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-Auto-Save': isAutoSave ? 'true' : 'false',
            },
        });

        const data = await response.json();
        if (data.success) {
            isProjectArchitectFormSaved = true;
            if (isAutoSave) {
                showFlashMessage('Changes auto-saved.', true);
                disableButton(architectFormSaveBtn, true);
            } else {
                window.location.href = data.redirect;
            }
        } else {
            window.location.href = data.redirect;
        }
    } catch (error) {
        console.error('Error submitting form:', error);
    } finally {
        hideLoading();
    }
}

export { initArchitectForm, initProject };
