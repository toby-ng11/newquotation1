import { setupAutoComplete } from "../api/autocomplete";
import { showFlashMessage } from "../api/flashmessage";
import { architectID } from "./init";
import { setState } from "./state";
import { architectProjectsTable } from "./tables";
import { resetForm } from "./utils";

export function initArchitect() {
  const architectForm = document.getElementById("architect-form");
  const architectFormSaveBtn = document.getElementById(
    "form-btn-save-architect"
  ) as HTMLButtonElement;

  // Enable save button on change
  if (architectForm) {
    architectForm.addEventListener("change", () => {
      architectFormSaveBtn.disabled = false;
      setState({ unsave: true, lastChanged: "project" });
    });
  }

  // Save edit
  if (architectFormSaveBtn) {
    architectFormSaveBtn.addEventListener("click", async function (e) {
      e.preventDefault();
      document.querySelector(".loading").style.display = "flex";

      try {
        const formData = new FormData(architectForm);
        const action = architectForm.getAttribute("action");
        const method = architectForm.getAttribute("method");

        const response = await fetch(action, {
          method: method,
          body: formData,
        });

        const data = await response.json();
        if (data.sucess) {
          setState({ unsave: false });
          window.location.href =
            data.redirect || `/architect/${architectID}/edit`;
          showFlashMessage(data.message, data.success);
        } else {
          showFlashMessage(data.message, data.success);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        document.querySelector(".loading").style.display = "none";
      }
    });
  }

  // Project Form
  setupAutoComplete({
    fieldName: "#architect-search",
    fetchUrl: "/architect",
    queryParamName: "search",
    limitParamName: "limit",
    fillFields: [],
    minLength: 2,
    renderItem: (item) => `
    <div class="autocomplete-item">
      <strong>${item.architect_id} - ${item.architect_name}</strong><br>
      <span>${item.architect_rep_id} - ${item.company_id}</span>
    </div>`,
    extraSelectActions: [
      function (item) {
        document.getElementById("search-overlay").classList.remove("active");
        document.body.classList.remove("noscroll");
        window.location.href = `/architect/${item.architect_id}/edit`;
      },
    ],
  });
}

export function projectModal() {
  return {
    open: false,
    projectName: "",
    projectDescription: "",
    architectId: architectID,
    async submitForm() {
      const form = document.getElementById("architect-edit-project-form");
      const formData = new FormData(form);

      const ownerInput = document.getElementById("owner_id");
      if (ownerInput) {
        formData.append("owner_id", ownerInput.value);
      }
      formData.append("architect_id", this.architectId);

      try {
        const response = await fetch("/project", {
          method: "POST",
          body: formData,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
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
        alert("Error submitting form.");
        console.error(err);
      }
    },
    closeModal() {
      const form = document.getElementById("architect-edit-project-form");
      resetForm(form);
      this.projectName = "";
      this.projectDescription = "";
      this.open = false;
    },
  };
}
