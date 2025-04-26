import { setupAutoComplete } from "../api/autocomplete.js";
import { $projectId, $projectForm, projectForm } from "./init.js";
import { setState } from "./state.js";

export function initProject() {
  const architectDetails = document.querySelector("#architect-details");
  const architectNameInput = document.querySelector("#architect_name");
  const contractorDetails = document.querySelector("#contractor-details");
  const generalContractorInput = document.querySelector(
    "#general_contractor_name"
  );
  const awardedContractorInput = document.querySelector(
    "#awarded_contractor_name"
  );

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
  $projectForm.addEventListener("change", () => {
    document.querySelector("#form-btn-save-project").disabled = false;
    setState({ unsave: true, lastChanged: "project" });
  });

  // Save edit
  document
    .querySelector("#form-btn-save-project")
    .addEventListener("click", async (e) => {
      if (!projectForm.checkValidity()) return;
      e.preventDefault();
      if (
        window.jQuery &&
        window.jQuery($projectForm).validationEngine("validate")
      ) {
        if (generalContractorInput.value.trim() === "")
          document.querySelector("#general_contractor_id").value = "";
        if (awardedContractorInput.value.trim() === "")
          document.querySelector("#awarded_contractor_id").value = "";

        document.querySelector(".loading").style.display = "block";
        setState({ unsave: false });

        try {
          const response = await fetch($projectForm.action, {
            method: $projectForm.method,
            body: new URLSearchParams(new FormData($projectForm)),
            headers: { Accept: "application/json" },
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
          document.querySelector(".loading").style.display = "none";
        }
      }
    });

  // Delete project
  document.querySelectorAll(".delete_pro").forEach((button) => {
    button.addEventListener("click", async () => {
      if (!confirm("Are you sure you want to delete this project?")) return;

      document.querySelector(".loading").style.display = "block";
      try {
        const response = await fetch(`/project/${$projectId}/delete`);
        const data = await response.json();

        if (data.success) {
          window.location.href = "/index/project";
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

  let architectFields = $(
    "#architect_name, #architect_id, #architect_company_id, #architect_rep_id, " +
      "#architect_type_id, #architect_class_id"
  );

  let addressDropdown = $("#address_list");
  let addressFields = $(
    "#address_id, #address_name, #phys_address1, " +
      "#phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, " +
      "#central_phone_number, #email_address, #url"
  );

  let specifierDropdown = $("#specifier_name");
  let specifierFields = $(
    "#specifier_id, #specifier_address_id, #specifier_first_name, #specifier_last_name, " +
      "#specifier_job_title, #specifier_phone_number, #specifier_email"
  );

  $("#add_architect").on("click", function () {
    [architectFields, addressFields, specifierFields].forEach((field) =>
      field.val("").prop("readonly", false)
    );
    [addressDropdown, specifierDropdown].forEach((dropdown) =>
      dropdown.html(
        '<option value="">-- Please search for an architect first --</option>'
      )
    );
  });

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

  function getArchitectById(id) {
    if (!id) return;
    $.ajax({
      url: `/architect/${id}/fetchfull`,
      dataType: "json",
      type: "get",
    })
      .done(function (architect) {
        if (architect) {
          architectFields.each(function () {
            let fieldName = $(this).attr("id");
            $(this).val(architect[fieldName] || "");
            $("#architect_company_id").val(architect.company_id);
            $("#architect_name").prop("readonly", false);
          });
        } else {
          // Clear fields if no architect found
          architectFields.val("").prop("readonly", false);
          console.warn("No architect data found for ID:", id);
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error fetching architect details:",
          textStatus,
          errorThrown
        );
      });
  }

  function getAddress(id) {
    if (!id) return;
    $.ajax({
      url: `/architect/${id}/address`,
      dataType: "json",
      type: "get",
    })
      .done(function (address) {
        addressDropdown.empty();
        if (!address || address.length === 0) {
          addressDropdown.html(
            '<option value="">No addresses found, please add.</option>'
          );
          addressFields.val("").prop("readonly", false);
          return;
        } else {
          $.each(address, function (i, item) {
            addressDropdown.append(
              '<option value="' +
                item.address_id +
                '">' +
                item.name +
                "</option>"
            );
          });
          addressDropdown.append(
            '<option value="new">+ Add New Address</option>'
          );
          addressDropdown.prop("selectedIndex", 0);
          getAddressInfo();
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching address:", textStatus, errorThrown);
      });
  }

  function getSpecifier(id) {
    if (!id) return;
    $.ajax({
      url: `/architect/${id}/fetchspecs`,
      dataType: "json",
      type: "get",
    })
      .done(function (specifiers) {
        specifierDropdown.empty();
        if (!specifiers || specifiers.length === 0) {
          $("#specifier_name").html(
            '<option value="">No specifiers found, please add.</option>'
          );
          specifierFields.val("").prop("readonly", false);
          return;
        } else {
          $.each(specifiers, function (i, item) {
            specifierDropdown.append(
              '<option value="' +
                item.specifier_id +
                '">' +
                item.first_name +
                " " +
                item.last_name +
                "</option>"
            );
          });
          specifierDropdown.append(
            '<option value="new">+ Add New Specifier</option>'
          );
          specifierDropdown.prop("selectedIndex", 0);
          getSpecifierInfo();
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching specifier:", textStatus, errorThrown);
      });
  }

  $("#specifier_name").on("change", function () {
    if ($(this).val() === "new") {
      // for add new specifier
      specifierFields.val("");
      specifierFields.prop("readonly", false);
    } else {
      getSpecifierInfo();
    }
  });

  $("#address_list").on("change", function () {
    if ($(this).val() === "new") {
      // for add new specifier
      addressFields.val("");
      addressFields.prop("readonly", false);
    } else {
      getAddressInfo();
    }
  });

  function getSpecifierInfo() {
    let specifierId = $("#specifier_name").val();
    if (!specifierId || specifierId === "new") return;
    $.ajax({
      url: `/architect/${specifierId}/specinfo`,
      dataType: "json",
      type: "get",
    })
      .done(function (specifier) {
        if (specifier) {
          specifierFields.each(function () {
            let fieldName = $(this).attr("id");
            $(this).val(specifier[fieldName] || "");
            $("#specifier_address_id").val(specifier.address_id);
            $("#specifier_first_name").val(specifier.first_name);
            $("#specifier_last_name").val(specifier.last_name);
            $("#specifier_job_title").val(specifier.job_title);
            $("#specifier_phone_number").val(specifier.central_phone_number);
            $("#specifier_email").val(specifier.email_address);
          });
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error fetching specifier details:",
          textStatus,
          errorThrown
        );
      });
  }

  function getAddressInfo() {
    let addressID = $("#address_list").val();
    if (!addressID || addressID === "new") return;
    $.ajax({
      url: `/architect/${addressID}/addressinfo`,
      dataType: "json",
      type: "get",
    })
      .done(function (address) {
        if (address) {
          addressFields.each(function () {
            let fieldName = $(this).attr("id");
            $(this).val(address[fieldName] || "");
            $("#address_name").val(address.name);
          });
        }
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error fetching specifier details:",
          textStatus,
          errorThrown
        );
      });
  }

  /* ----------------------------- Contractor / Customer -------------------------------- */

  function setupAutocomplete(selector, sourceUrl, selectCallback) {
    if ($(selector).length) {
      $(selector)
        .autocomplete({
          source: sourceUrl,
          minLength: 2,
          select: function (event, ui) {
            selectCallback(ui.item);
          },
        })
        .data("ui-autocomplete")._renderItem = function (ul, item) {
        return $("<li>")
          .data("item.autocomplete", item)
          .append(
            "<a>" +
              (item.customer_id +
                " - " +
                item.company_id +
                "<br>" +
                item.customer_name) +
              "</a>"
          )
          .appendTo(ul);
      };
    }
  }

  setupAutocomplete("#general_contractor_name", "/customer", function (item) {
    getContractor(item.customer_id, "general_contractor");
  });

  setupAutocomplete("#awarded_contractor_name", "/customer", function (item) {
    getContractor(item.customer_id, "awarded_contractor");
  });

  function getContractor(id, targetPrefix) {
    $.ajax({
      url: `/customer/${id}/fetchbyid`,
      dataType: "json",
      type: "get",
      success: function (result) {
        if (result) {
          $("#" + targetPrefix + "_id").val(result.customer_id);
          $("#" + targetPrefix + "_name").val(result.customer_name);
        }
      },
    });
  }
}
