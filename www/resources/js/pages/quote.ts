import { setupAutoComplete } from "@/components/autocomplete";
import { disableButton } from "@/components/DisableButton";
import { showFlashMessage } from "@/components/flashmessage";
import {
  projectID,
  quoteForm,
  sheetType,
  quoteID,
  projectForm,
} from "@/components/init";
import { hideLoading, showLoading } from "@/components/LoadingOverlay";
import { initAutoSave } from "@/components/AutoSave";
import { setState } from "@/components/state";
import { resetForm } from "@/components/utils";

const $makeQuoteForm = $("#dialog-make-quote-form");
const makeQuoteForm = document.getElementById(
  "dialog-make-quote-form"
) as HTMLFormElement;
export const $dialogMakeQuote = $("#dialog-make-quote");
const dialogBtnAddCustomer = document.getElementById(
  "customer-form-btn-add"
) as HTMLButtonElement;
const quoteSaveBtn = document.getElementById(
  "form-btn-save-quote"
) as HTMLButtonElement;

let $customerFields = document.querySelectorAll(
  "#customer_id, #customer_name, #company_id, #salesrep_full_name"
);

let $contactFields = document.querySelectorAll(
  "#contact_id, #first_name, #last_name, #phys_address1, #phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, #central_phone_number, #email_address"
);

const contactDropdown = document.getElementById(
  "contact_name"
) as HTMLSelectElement;
if (contactDropdown) {
  contactDropdown.dataset.defaultOptions = contactDropdown.innerHTML;
}

export function initQuote() {
  // Enable save button
  if (quoteForm) {
    initAutoSave(quoteForm, () => saveQuoteWithAction("save", true));

    quoteForm.addEventListener("change", () => {
      quoteSaveBtn.disabled = false;
      setState({ unsave: true, lastChanged: "project" });
    });
  }
  // Save edit
  if (quoteSaveBtn) {
    quoteSaveBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const quoteForm = document.querySelector("form") as HTMLFormElement;
      const submitEvent = new Event("submit", { cancelable: true });
      quoteForm.dispatchEvent(submitEvent);
      setState({ unsave: false });
    });
  }

  // Submit approval
  document.querySelectorAll(".quote-action-button").forEach((button) => {
    button.addEventListener("click", async function (e) {
      e.preventDefault();

      const action = button.dataset.action;
      const label = button.dataset.label?.toLowerCase();

      if (!action) return;

      // Only validate for 'submit' and 'approve' actions
      const requiresValidation = [
        "submit",
        "approve",
        "submit-approve",
      ].includes(action);
      if (requiresValidation && !quoteForm.checkValidity()) {
        quoteForm.reportValidity();
        return;
      }

      if (!confirm(`You are about to ${label} this quote. Continue?`)) return;

      button.disabled = true;
      await saveQuoteWithAction(action, false, label);
      setTimeout(() => (button.disabled = false), 1000);
    });
  });

  const deleteButtons = document.querySelectorAll(".delete_quote");
  if (deleteButtons.length > 0) {
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        e.preventDefault();

        const confirmed = confirm(
          "Are you sure you want to delete this quote?"
        );
        if (!confirmed) return;

        setState({ unsave: false });
        showLoading();

        try {
          const res = await fetch(`/quote/${quoteID}/delete`, {
            method: "GET",
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          });

          const response = await res.json();

          if (response.success) {
            window.location.href = "/index/home";
          } else {
            showFlashMessage(
              `Failed to delete the quote. Error: ${response.message}`,
              false
            );
          }
        } catch (error) {
          showFlashMessage(
            `Error occurred while trying to delete the quote. Error: ${error.message}`,
            false
          );
        } finally {
          hideLoading();
        }
      });
    });
  }

  const editAgainLink = document.querySelector("a.quote-edit-again");
  if (editAgainLink) {
    editAgainLink.addEventListener("click", async (e) => {
      const confirmed = confirm(
        "You are about to edit this approved quote. Continue?"
      );
      if (!confirmed) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      showLoading();

      try {
        const response = await fetch(`/quote/${quoteID}/edit`, {
          method: "GET",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        showFlashMessage("Changes saved! Reloading...", true);

        // Wait briefly so user sees the message
        setTimeout(() => location.reload(), 1500);
      } catch (error) {
        showFlashMessage(
          `Failed to edit quote. Error: ${error.message}`,
          false
        );
      } finally {
        hideLoading();
      }
    });
  }

  /* --------------------------  MAKE QUOTE FUNCTION ---------------------------- */

  //$contactFields.prop("readonly", true);

  $dialogMakeQuote.dialog({
    autoOpen: false,
    modal: true,
    minWidth: 800,
    width: 1200,
    height: 650,
    open: function () {
      // fade in background
      resetForm(makeQuoteForm);
      $(".ui-widget-overlay").hide().fadeIn().css("z-index", 1000);
      $(".ui-dialog").css("z-index", 2000);
    },
    beforeClose: function () {
      //fade out background
      $(".ui-widget-overlay").fadeOut(400, function () {
        $(this).remove();
      });
    },
    dialogClass: "add-customer-dialog",
    buttons: [
      {
        id: "customer-form-btn-add",
        text: "Make Quote",
        click: function () {
          if ($makeQuoteForm.validationEngine("validate")) {
            const dialogBtnAddCustomer = document.getElementById(
              "customer-form-btn-add"
            ) as HTMLButtonElement;
            disableButton(dialogBtnAddCustomer, true);
            makeQuote();
            $(this).dialog("close");
            setTimeout(() => disableButton(dialogBtnAddCustomer, false), 1000);
          }
        },
        "aria-label": "Make Quote",
      },
      {
        id: "customer-form-btn-cancel",
        text: "Cancel",
        click: function () {
          $(this).dialog("close");
        },
        "aria-label": "Cancel",
      },
    ],
  });

  $("#widget-btn-add-quote, .make-quote").on("click", function (e) {
    //$dialogNote.dialog("option", "title", "Add Log");
    e.preventDefault();
    $dialogMakeQuote.dialog("open");
  });

  function initCustomerAutocomplete(section) {
    const input = section.querySelector("input[id$='_customer_name']");
    const formType = section.dataset.type;

    setupAutoComplete({
      fieldName: `#${input.id}`,
      fetchUrl: "/customer",
      fillFields: [
        { fieldSelector: `#${formType}_customer_id`, itemKey: "customer_id" },
        {
          fieldSelector: `#${formType}_customer_name`,
          itemKey: "customer_name",
        },
        { fieldSelector: `#${formType}_company_id`, itemKey: "company_id" },
        {
          fieldSelector: `#${formType}_salesrep_full_name`,
          itemKey: "salesrep_full_name",
        },
      ],
      minLength: 2,
      queryParamName: "search",
      limitParamName: "limit",
      renderItem: (item) =>
        `<div>
        <b>${item.customer_id}</b> - ${item.customer_name} - 
        <small>${item.from_P21}</small>
      </div>`,
      extraSelectActions: [
        (item) => {
          if (item.customer_id) {
            getCustomerContacts(item.customer_id, section);
          }
        },
      ],
    });
  }

  async function getCustomerContacts(customer_id, section) {
    if (!customer_id || !section) return;

    try {
      const res = await fetch(`/customer/${customer_id}/contacts`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();

      const contactSelect = section.querySelector(
        "select[id$='_contact_name']"
      );
      if (!contactSelect) return;

      contactSelect.innerHTML = "";

      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.contact_id;
        option.textContent = item.contact_full_name;
        contactSelect.appendChild(option);
      });

      getContactInfo(section);
    } catch (err) {
      showFlashMessage(`Failed to fetch contacts: ${err.message}`, false);
    }
  }

  async function getContactInfo(section) {
    const contactSelect = section.querySelector("select[id$='_contact_name']");
    const contactID = contactSelect?.value;
    if (!contactID || !section) return;

    try {
      const res = await fetch(`/customer/${contactID}/contactinfo`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();

      const type = section.dataset.type;
      const fields = [
        "contact_id",
        "first_name",
        "last_name",
        "phys_address1",
        "phys_address2",
        "phys_city",
        "phys_state",
        "phys_postal_code",
        "phys_country",
        "central_phone_number",
        "email_address",
      ];

      fields.forEach((field) => {
        const input = document.getElementById(`${type}_${field}`);
        if (input) {
          input.value = data[field] || "";
        }
      });
    } catch (err) {
      showFlashMessage(`Failed to fetch contact info: ${err.message}`, false);
    }
  }

  // Initialize both sections (main and dialog)
  document.querySelectorAll(".customer-section").forEach((section) => {
    initCustomerAutocomplete(section);

    const contactSelect = section.querySelector("select[id$='_contact_name']");
    if (contactSelect) {
      contactSelect.addEventListener("change", () => getContactInfo(section));
    }
  });

  async function makeQuote() {
    const dialogBtnAddCustomer = document.getElementById(
      "customer-form-btn-add"
    ) as HTMLButtonElement;
    disableButton(dialogBtnAddCustomer, true);

    const contactID = document.getElementById("dialog_contact_id")?.value || "";
    let formData = new URLSearchParams();

    if (sheetType === "project") {
      // if make quote from project page
      if (projectForm) {
        const form = new FormData(projectForm);
        for (const [key, value] of form.entries()) {
          formData.append(key, value);
        }
      }
      formData.append("contact_id", contactID);
      formData.append("project_id", projectID);
    }

    if (sheetType === "quote") {
      // if make quote from quote page
      const projectIdInput = document.getElementById("project_id")?.value || "";
      formData.append("contact_id", contactID);
      formData.append("project_id", projectIdInput);
    }

    showLoading();

    try {
      const response = await fetch("/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: formData.toString(),
      });

      const result = await response.json();

      if (result.success && result.quote_id) {
        window.location.href = `/quote/${result.quote_id}/edit`;
      } else {
        alert(result.message || "Failed to make quote. Please try again.");
      }
    } catch (error) {
      showFlashMessage(`Error making quote: ${error.message}`, false);
    } finally {
      disableButton(dialogBtnAddCustomer, false);
      hideLoading();
    }
  }
}

export async function saveQuoteWithAction(
  action,
  isAutoSave = false,
  label = action
) {
  if (!action) return;

  if (!quoteForm.checkValidity()) {
    quoteForm.reportValidity();
    return;
  }

  setState({ unsave: false });

  const formData = new FormData(quoteForm);
  const formBody = new URLSearchParams(formData).toString();

  if (!isAutoSave) {
    showLoading();
  }

  try {
    const response = await fetch(`/quote/${quoteID}/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
        "X-Auto-Save": isAutoSave ? "true" : "false",
      },
      body: formBody,
    });

    const result = await response.json();

    if (result.success) {
      if (isAutoSave) {
        showFlashMessage("Quote saved automatically.", true);
        disableButton(quoteSaveBtn, true);
      } else {
        window.location.href = result.redirect;
      }
    } else {
      showFlashMessage(
        `Failed to ${label} the quote. Error: ${result.message}`,
        false
      );
    }
  } catch (error) {
    showFlashMessage(
      `Error while trying to ${label} the quote. ${error.message}`,
      false
    );
  } finally {
    if (!isAutoSave) {
      hideLoading();
    }
  }
}
