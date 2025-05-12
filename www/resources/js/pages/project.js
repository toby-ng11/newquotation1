import { setupAutoComplete } from "../components/autocomplete.js";
import { showFlashMessage } from "../components/flashmessage.js";
import { projectID, projectForm } from "../components/init.js";
import { hideLoading, showLoading } from "../components/LoadingOverlay.js";
import { initAutoSave } from "../components/pageload.js";
import { showFlashMessage } from "../components/flashmessage.js";
import { projectID, projectForm } from "../components/init.js";
import { hideLoading, showLoading } from "../components/LoadingOverlay.js";
import { initAutoSave } from "../components/pageload.js";
import { setState } from "../components/state.js";

const architectDetails = document.querySelector("#architect-details");
const architectNameInput = document.querySelector("#architect_name");
const contractorDetails = document.querySelector("#contractor-details");
const generalContractorInput = document.querySelector(
  "#general_contractor_name"
);
const awardedContractorInput = document.querySelector(
  "#awarded_contractor_name"
);

export function initProject() {

  if (projectForm) {
    initAutoSave(projectForm, saveProject);
  }
const architectDetails = document.querySelector("#architect-details");
const architectNameInput = document.querySelector("#architect_name");
const contractorDetails = document.querySelector("#contractor-details");
const generalContractorInput = document.querySelector(
  "#general_contractor_name"
);
const awardedContractorInput = document.querySelector(
  "#awarded_contractor_name"
);

export function initProject() {

  if (projectForm) {
    initAutoSave(projectForm, saveProject);
  }

  // Autocomplete for shared_id
  setupAutoComplete({
    fieldName: "#shared_id",
    fetchUrl: "/user/fetchbypattern",
    fillFields: [{ fieldSelector: "#shared_id", itemKey: "id" }],
    renderItem: (item) =>
      `<div><strong>${item.id}</strong><br>${item.name}</div>`,
  });

  // Auto expand architect details
  if (architectDetails && architectNameInput.value.trim() !== "")
    architectDetails.open = true;

  // Auto expand contractor details
  // if either general or awarded contractor field is available (check with length)
  if (
    contractorDetails &&
    (generalContractorInput.value.trim() !== "" ||
      awardedContractorInput.value.trim() !== "")
  )
    contractorDetails.open = true;

  // Enable save button
  if (projectForm) {
    projectForm.addEventListener("change", () => {
      document.querySelector("#form-btn-save-project").disabled = false;
      setState({ unsave: true, lastChanged: "project" });
    });
  }

  // Save edit

  const saveButton = document.getElementById("#form-btn-save-project");
  if (saveButton) {
    saveButton.addEventListener("click", async (e) => {
      e.preventDefault();
      saveProject();
    saveButton.addEventListener("click", async (e) => {
      e.preventDefault();
      saveProject();
    });
  }

  // Delete project
  document.querySelectorAll(".delete_pro").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this project?")) return;

      document.querySelector(".loading").style.display = "flex";
      try {
        const response = await fetch(`/project/${projectID}/delete`, {
        const response = await fetch(`/project/${projectID}/delete`, {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });
        const data = await response.json();

        if (data.success) {
          window.location.href = "/index/home";
        } else {
          alert(data.message || "Failed to delete the project.");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Error occurred while deleting the project.");
      } finally {
        document.querySelector(".loading").style.display = "none";
      }
    });
  });

  /* ----------------------------- Architect / Specifier -------------------------------- */

  let architectFields = document.querySelectorAll(
    "#architect_name, #architect_id, #architect_company_id, #architect_rep_id,#architect_type_id, #architect_class_id"
  let architectFields = document.querySelectorAll(
    "#architect_name, #architect_id, #architect_company_id, #architect_rep_id,#architect_type_id, #architect_class_id"
  );

  let addressDropdown = document.getElementById("address_list");
  let addressFields = document.querySelectorAll(
    "#address_id, #address_name, #phys_address1, #phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, #central_phone_number, #email_address, #url"
  let addressDropdown = document.getElementById("address_list");
  let addressFields = document.querySelectorAll(
    "#address_id, #address_name, #phys_address1, #phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, #central_phone_number, #email_address, #url"
  );

  let specifierDropdown = document.getElementById("specifier_name");
  let specifierFields = document.querySelectorAll(
    "#specifier_id, #specifier_address_id, #specifier_first_name, #specifier_last_name, #specifier_job_title, #specifier_phone_number, #specifier_email"
  let specifierDropdown = document.getElementById("specifier_name");
  let specifierFields = document.querySelectorAll(
    "#specifier_id, #specifier_address_id, #specifier_first_name, #specifier_last_name, #specifier_job_title, #specifier_phone_number, #specifier_email"
  );

  const addArchitectProjectEditBtn = document.getElementById(
    "add-architect-project-edit"
  );
  if (addArchitectProjectEditBtn) {
    addArchitectProjectEditBtn.addEventListener("click", (e) => {
      e.preventDefault();
      [architectFields, addressFields, specifierFields].forEach(
        (field) => (field.readOnly = false)
      );
      [addressDropdown, specifierDropdown].forEach(
        (dropdown) =>
          (dropdown.innerHTML =
            '<option value="">-- Please search for an architect first --</option>')
      );
    });
  }
  const addArchitectProjectEditBtn = document.getElementById(
    "add-architect-project-edit"
  );
  if (addArchitectProjectEditBtn) {
    addArchitectProjectEditBtn.addEventListener("click", (e) => {
      e.preventDefault();
      [architectFields, addressFields, specifierFields].forEach(
        (field) => (field.readOnly = false)
      );
      [addressDropdown, specifierDropdown].forEach(
        (dropdown) =>
          (dropdown.innerHTML =
            '<option value="">-- Please search for an architect first --</option>')
      );
    });
  }

  setupAutoComplete({
    fieldName: "#architect_name",
    fetchUrl: "/architect",
    fillFields: [],
    minLength: 2,
    queryParamName: "search",
    limitParamName: "limit",
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

  async function getArchitectById(id) {
  async function getArchitectById(id) {
    if (!id) return;

    try {
      const response = await fetch(`/architect/${id}/fetchfull`);
      if (!response.ok) throw new Error("Something happened. Please try again");

      const architect = await response.json();

      if (architect) {
        architectFields.forEach((field) => {
          const fieldName = field.id;
          field.value = architect[fieldName] || "";
        });

        const companyField = document.getElementById("architect_company_id");
        if (companyField) companyField.value = architect.company_id || "";

        const nameField = document.getElementById("architect_name");
        if (nameField) nameField.readOnly = false;
      } else {
        // Clear fields if no architect found
        architectFields.forEach((field) => {
          field.value = "";
          field.readOnly = false;
        });
        showFlashMessage(`No architect found for this ${id}`, false);
      }
    } catch (error) {
      showFlashMessage(error, false);
    }
  }

  async function getAddress(id) {

    try {
      const response = await fetch(`/architect/${id}/fetchfull`);
      if (!response.ok) throw new Error("Something happened. Please try again");

      const architect = await response.json();

      if (architect) {
        architectFields.forEach((field) => {
          const fieldName = field.id;
          field.value = architect[fieldName] || "";
        });

        const companyField = document.getElementById("architect_company_id");
        if (companyField) companyField.value = architect.company_id || "";

        const nameField = document.getElementById("architect_name");
        if (nameField) nameField.readOnly = false;
      } else {
        // Clear fields if no architect found
        architectFields.forEach((field) => {
          field.value = "";
          field.readOnly = false;
        });
        showFlashMessage(`No architect found for this ${id}`, false);
      }
    } catch (error) {
      showFlashMessage(error, false);
    }
  }

  async function getAddress(id) {
    if (!id) return;

    try {
      const response = await fetch(`/architect/${id}/address`);
      if (!response.ok) throw new Error("Something happened. Please try again");

      const addresses = await response.json();

      if (addresses) {
        addressDropdown.innerHTML = "";
        if (!addresses || addresses.length === 0) {
          addressDropdown.innerHTML = `<option value="">No addresses found, please add.</option>`;
          addressFields.forEach((field) => {
            field.value = "";
            field.readOnly = false;
          });

    try {
      const response = await fetch(`/architect/${id}/address`);
      if (!response.ok) throw new Error("Something happened. Please try again");

      const addresses = await response.json();

      if (addresses) {
        addressDropdown.innerHTML = "";
        if (!addresses || addresses.length === 0) {
          addressDropdown.innerHTML = `<option value="">No addresses found, please add.</option>`;
          addressFields.forEach((field) => {
            field.value = "";
            field.readOnly = false;
          });
          return;
        }

        addresses.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.address_id;
          option.textContent = item.name;
          addressDropdown.appendChild(option);
        });

        const newOption = document.createElement("option");
        newOption.value = "new";
        newOption.textContent = "+ Add New Address";
        addressDropdown.appendChild(newOption);

        addressDropdown.selectedIndex = 0;
        getAddressInfo(addressDropdown);
      }
    } catch (error) {
      showFlashMessage(error, false);
    }
  }

  async function getAddressInfo(dropdown) {
    const addressID = dropdown.value;
    if (!addressID || addressID === "new") return;

    try {
      const response = await fetch(`/architect/${addressID}/addressinfo`);
      if (!response.ok) throw new Error("Something happened. Please try again");

      const address = await response.json();
      if (address) {
        addressFields.forEach((field) => {
          const fieldName = field.id;
          field.value = address[fieldName] || "";
        });
        const addressNickname = document.getElementById("address_name");
        if (addressNickname) addressNickname.value = address.name || "";
      }
    } catch (error) {
      showFlashMessage(error, false);
    }
  }

  async function getSpecifier(id) {
        }

        addresses.forEach((item) => {
          const option = document.createElement("option");
          option.value = item.address_id;
          option.textContent = item.name;
          addressDropdown.appendChild(option);
        });

        const newOption = document.createElement("option");
        newOption.value = "new";
        newOption.textContent = "+ Add New Address";
        addressDropdown.appendChild(newOption);

        addressDropdown.selectedIndex = 0;
        getAddressInfo(addressDropdown);
      }
    } catch (error) {
      showFlashMessage(error, false);
    }
  }

  async function getAddressInfo(dropdown) {
    const addressID = dropdown.value;
    if (!addressID || addressID === "new") return;

    try {
      const response = await fetch(`/architect/${addressID}/addressinfo`);
      if (!response.ok) throw new Error("Something happened. Please try again");

      const address = await response.json();
      if (address) {
        addressFields.forEach((field) => {
          const fieldName = field.id;
          field.value = address[fieldName] || "";
        });
        const addressNickname = document.getElementById("address_name");
        if (addressNickname) addressNickname.value = address.name || "";
      }
    } catch (error) {
      showFlashMessage(error, false);
    }
  }

  async function getSpecifier(id) {
    if (!id) return;

    try {
      const response = await fetch(`/architect/${id}/fetchspecs`);
      if (!response.ok) throw new Error("Network response was not ok");

      const specifiers = await response.json();

      specifierDropdown.innerHTML = "";

      if (!specifiers || specifiers.length === 0) {
        specifierDropdown.innerHTML =
          '<option value="">No specifiers found, please add.</option>';

        specifierFields.forEach((field) => {
          field.value = "";
          field.readOnly = false;
        });

        return;
      }

      specifiers.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.specifier_id;
        option.textContent = `${item.first_name} ${item.last_name}`;
        specifierDropdown.appendChild(option);
      });

      const newOption = document.createElement("option");
      newOption.value = "new";
      newOption.textContent = "+ Add New Specifier";
      specifierDropdown.appendChild(newOption);

      specifierDropdown.selectedIndex = 0;
      getSpecifierInfo(specifierDropdown);
    } catch (error) {
      showFlashMessage(error, false);
    }
  }

  async function getSpecifierInfo(dropdown) {
    const specifierId = dropdown.value;
    if (!specifierId || specifierId === "new") return;

    try {
      const response = await fetch(`/architect/${specifierId}/specinfo`);
      if (!response.ok) throw new Error("Network response was not ok");

      const specifier = await response.json();

      if (specifier) {
        const fieldMap = {
          specifier_id: "specifier_id",
          specifier_address_id: "address_id",
          specifier_first_name: "first_name",
          specifier_last_name: "last_name",
          specifier_job_title: "job_title",
          specifier_phone_number: "central_phone_number",
          specifier_email: "email_address",
        };

        Object.entries(fieldMap).forEach(([fieldId, dataKey]) => {
          const field = document.getElementById(fieldId);
          if (field) field.value = specifier[dataKey] || "";
        });
      }
    } catch (error) {
      console.error("Error fetching specifier details:", error);
    }
  }

  if (specifierDropdown) {
    specifierDropdown.addEventListener("change", function () {
      if (this.value === "new") {
        specifierFields.forEach((field) => {
          field.value = "";
          field.readOnly = false;
        });
      } else {
        getSpecifierInfo(specifierDropdown);
      }
    });
  }
  
  if (addressDropdown) {
    addressDropdown.addEventListener("change", function () {
      if (this.value === "new") {
        // Clear and unlock fields for adding a new address
        addressFields.forEach((field) => {
          field.value = "";
          field.readOnly = false;
        });
      } else {
        getAddressInfo(addressDropdown);
      }
    });
  }

  /* ----------------------------- Contractor / Customer -------------------------------- */

  const contractorFields = [
    {
      fieldName: "#general_contractor_name",
      targetPrefix: "general_contractor",
    },
    {
      fieldName: "#awarded_contractor_name",
      targetPrefix: "awarded_contractor",
    },
  ];

  // Loop over both and initialize autocomplete
  contractorFields.forEach(({ fieldName, targetPrefix }) => {
    setupAutoComplete({
      fieldName,
      fetchUrl: "/customer",
      fillFields: [],
      minLength: 2,
      queryParamName: "search",
      limitParamName: "limit",
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

  async function fetchAndFillContractor(id, prefix) {
    if (!id || !prefix) return;
    try {
      const response = await fetch(`/customer/${id}/fetchbyid`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();

      if (result) {
        const idField = document.getElementById(`${prefix}_id`);
        const nameField = document.getElementById(`${prefix}_name`);

        if (idField) idField.value = result.customer_id || "";
        if (nameField) nameField.value = result.customer_name || "";
      }
    } catch (error) {
      showFlashMessage(
        `Failed to fetch contractor (${id}): ${error.message}`,
        false
      );
    }
  }
}

export async function saveProject() {
  if (!projectForm.checkValidity()) return;
  if (generalContractorInput.value.trim() === "")
    document.querySelector("#general_contractor_id").value = "";
  if (awardedContractorInput.value.trim() === "")
    document.querySelector("#awarded_contractor_id").value = "";

  showLoading();
  setState({ unsave: false });
  const formData = FormData(projectForm);

  try {
    const response = await fetch(projectForm.getAttribute("action"), {
      method: projectForm.getAttribute("method"),
      body: formData,
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    const data = await response.json();

    if (data.success) {
      window.location.href = data.redirect;
    } else {
      alert(data.message || "Failed to save project.");
    }
  } catch (error) {
    console.error("Save failed:", error);
    alert("An error occurred while saving the project.");
  } finally {
    hideLoading();
  async function fetchAndFillContractor(id, prefix) {
    if (!id || !prefix) return;
    try {
      const response = await fetch(`/customer/${id}/fetchbyid`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result = await response.json();

      if (result) {
        const idField = document.getElementById(`${prefix}_id`);
        const nameField = document.getElementById(`${prefix}_name`);

        if (idField) idField.value = result.customer_id || "";
        if (nameField) nameField.value = result.customer_name || "";
      }
    } catch (error) {
      showFlashMessage(
        `Failed to fetch contractor (${id}): ${error.message}`,
        false
      );
    }
  }
}

export async function saveProject() {
  if (!projectForm.checkValidity()) return;
  if (generalContractorInput.value.trim() === "")
    document.querySelector("#general_contractor_id").value = "";
  if (awardedContractorInput.value.trim() === "")
    document.querySelector("#awarded_contractor_id").value = "";

  showLoading();
  setState({ unsave: false });
  const formData = FormData(projectForm);

  try {
    const response = await fetch(projectForm.getAttribute("action"), {
      method: projectForm.getAttribute("method"),
      body: formData,
      headers: { "X-Requested-With": "XMLHttpRequest" },
    });
    const data = await response.json();

    if (data.success) {
      window.location.href = data.redirect;
    } else {
      alert(data.message || "Failed to save project.");
    }
  } catch (error) {
    console.error("Save failed:", error);
    alert("An error occurred while saving the project.");
  } finally {
    hideLoading();
  }
}
