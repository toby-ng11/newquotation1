import { $projectId, $projectForm, $quoteForm, $sheetType, $quoteId } from "./init.js";
import { setState } from "./state.js";
import { resetForm } from "./utils.js";
import { disableButton } from "./utils.js";

const $makeQuoteForm = $("#dialog-make-quote-form");
export const $dialogMakeQuote = $("#dialog-make-quote");
const $dialogBtnAddCustomer = $("#customer-form-btn-add");

let $customerFields = $(
  "#customer_id, #customer_name, #company_id, #salesrep_full_name"
);
let $contactDropdown = $("#contact_name");
let $contactFields = $(
  "#contact_id, #first_name, #last_name, #phys_address1, #phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, #central_phone_number, #email_address"
);

$contactDropdown.data("default-options", $contactDropdown.html());

export function initQuote() {
  // Enable save button
  $quoteForm.on("change", function () {
    $("#form-btn-save-quote").prop("disabled", false);
    setState({ unsave: true, lastChanged: "quote" });
  });

  // Save edit
  $("#form-btn-save-quote").on("click", function (e) {
    e.preventDefault();
    $quoteForm.trigger("submit");
    setState({ unsave: false });
  });

  // Submit approval
  $(".quote-action-button").on("click", async function (e) {
    e.preventDefault();

    const $button = $(this);
    const action = $button.data("action");
    const label = $button.data("label")?.toLowerCase();

    if (!action) return;

    // Only validate for 'submit' and 'approve' actions
    const requiresValidation = ["submit", "approve", "submit-approve"].includes(
      action
    );
    if (requiresValidation && !$quoteForm.validationEngine("validate")) return;

    if (!confirm(`You are about to ${label} this quote. Continue?`)) return;

    $button.prop("disabled", true);
    setState({ unsave: false });
    let formData = $quoteForm.serialize();
    $(".loading").show();

    try {
      const response = await $.post(`/quote/${$quoteId}/${action}`, formData);

      if (response.success) {
        window.scrollTo(0, 0);
        location.reload();
      } else {
        alert(response.message || `Failed to ${label} the quote.`);
      }
    } catch (error) {
      console.error(`Submit failed:`, error);
      alert(`Error occurred while trying to ${label} the quote.`);
    } finally {
      $(".loading").hide();
      setTimeout(() => $button.prop("disabled", false), 1000); // Prevents spam clicking
    }
  });

  $(".delete_quote").on("click", async function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this quote?") == true) {
      setState({ unsave: false });
      $(".loading").show();
      try {
        const response = await $.ajax({
          url: `/quote/${$quoteId}/delete`,
          type: "GET",
          dataType: "json",
        });

        if (response.success) {
          window.location.href = "/index/project";
        } else {
          alert(response.message || "Failed to delete the quote.");
        }
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Error occurred while deleting the quote.");
      } finally {
        $(".loading").hide();
      }
    }
  });

  $("a.quote-edit-again").on("click", function (e) {
    if (
      confirm("You are about to edit this approved quote. Continue?") == true
    ) {
      e.preventDefault();
      $(".loading").show();
      $.ajax({
        url: `/quote/${$quoteId}/edit`,
        type: "get",
        success: function (data) {
          //$('#status').html('<div class="nNote nInformation hideit"><p><strong>INFORMATION: </strong>You Need submit again after edit</p></div>');
          location.reload();
        },
      });
      $(".loading").hide();
    } else {
      e.preventDefault();
    }
  });

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
      resetForm($makeQuoteForm);
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
            disableButton($dialogBtnAddCustomer, true);
            makeQuote();
            $(this).dialog("close");
            setTimeout(() => disableButton($dialogBtnAddCustomer, false), 1000);
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

  function initCustomerAutocomplete($section) {
    $section
      .find("input[id$='_customer_name']")
      .autocomplete({
        appendTo:
          $section.data("type") === "dialog" ? "#dialog-make-quote-form" : null,
        source: function (request, response) {
          $.ajax({
            url: "/customer",
            dataType: "json",
            data: { term: request.term, limit: 10 },
          })
            .done(response)
            .fail(() => response([]));
        },
        minLength: 2,
        select: function (event, ui) {
          if (ui.item && ui.item.customer_id) {
            // Populate all customer fields dynamically
            [
              "customer_id",
              "customer_name",
              "company_id",
              "salesrep_full_name",
            ].forEach((field) => {
              $section
                .find(`#${$section.data("type")}_${field}`)
                .val(ui.item[field] || "");
            });
            getCustomerContacts(ui.item.customer_id, $section);
          }
          return false;
        },
      })
      .autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>")
        .append(
          `<div><strong>${item.customer_id}</strong> - ${item.customer_name}</div>`
        )
        .appendTo(ul);
    };
  }

  function getCustomerContacts(customer_id, $section) {
    if (!customer_id) return;
    $.ajax({
      url: `/customer/${customer_id}/contacts`,
      dataType: "json",
    }).done((data) => {
      const $contactDropdown = $section
        .find("select[id$='_contact_name']")
        .empty();
      $.each(data, (i, item) => {
        $contactDropdown.append(
          `<option value="${item.contact_id}">${item.contact_full_name}</option>`
        );
      });
      getContactInfo($section);
    });
  }

  function getContactInfo($section) {
    const contactID = $section.find("select[id$='_contact_name']").val();
    if (!contactID) return;
    $.ajax({
      url: `/customer/${contactID}/contactinfo`,
      dataType: "json",
    }).done((data) => {
      // Fill contact fields dynamically based on ID suffix
      [
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
      ].forEach((field) => {
        $section
          .find(`#${$section.data("type")}_${field}`)
          .val(data[field] || "");
      });
    });
  }

  // Initialize both sections (main and dialog)
  $(".customer-section").each(function () {
    const $section = $(this);
    initCustomerAutocomplete($section);
    $section
      .find("select[id$='_contact_name']")
      .on("change", () => getContactInfo($section));
  });

  function makeQuote() {
    disableButton($dialogBtnAddCustomer, true);

    let contactID = $("#dialog_contact_id").val();
    let formData = "";
    if ($sheetType === "project") {
      // if make quote from project page
      formData =
        $projectForm.serialize() +
        "&contact_id=" +
        encodeURIComponent(contactID) +
        "&project_id=" +
        encodeURIComponent($projectId);
    }

    if ($sheetType === "quote") {
      // if make quote from quote page
      formData =
        "&contact_id=" +
        encodeURIComponent(contactID) +
        "&project_id=" +
        encodeURIComponent($("#project_id").val());
    }

    $(".loading").show();

    $.ajax({
      url: "/quote",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
      dataType: "json",
    })
      .done((response) => {
        if (response.success && response.quote_id) {
          window.location.href = `/quote/${response.quote_id}/edit`;
        } else {
          alert(response.message || "Failed to make quote. Please try again.");
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error making quote:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to make quote. Please try again.");
      })
      .always(() => {
        disableButton($dialogBtnAddCustomer, false);
        $(".loading").hide();
      });
  }
}
