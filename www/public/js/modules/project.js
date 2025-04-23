import { $projectId, $projectForm, projectForm } from "./init.js";
import { setState } from "./state.js";

const $architectDetails = $("#architect-details");
const architectNameVal = $("#architect_name").val();

const $contractorDetails = $("#contractor-details");
const generalContractor = $("#general_contractor_name").val();
const awardedContractor = $("#awarded_contractor_name").val();

export function initProject() {
  // Auto expand architect details
  if ($architectDetails.length && architectNameVal.trim() != "") {
    $architectDetails.prop("open", true);
  }

  // Auto expand contractor details
  // if either general or awarded contractor field is available (check with length)
  if (
    $contractorDetails.length &&
    (generalContractor.trim() != "" || awardedContractor.trim() != "")
  ) {
    $contractorDetails.prop("open", true);
  }

  // Enable save button
  $projectForm.on("change", function () {
    $("#form-btn-save-project").prop("disabled", false);
    setState({ unsave: true, lastChanged: "project" });
  });

  // Save edit
  $("#form-btn-save-project").on("click", function (e) {
    if (projectForm.checkValidity()) {
      e.preventDefault();
      if ($projectForm.validationEngine("validate")) {
        if ($("#general_contractor_name").val().trim() === "")
          $("#general_contractor_id").val("");
        if ($("#awarded_contractor_name").val().trim() === "")
          $("#awarded_contractor_id").val("");

        $(".loading").show();
        setState({unsave: false});

        // Submit via AJAX
        $.ajax({
          url: $projectForm.attr("action"),
          type: $projectForm.attr("method"),
          data: $projectForm.serialize(),
          dataType: "json",
        })
          .done(function (response) {
            if (response.success) {
              window.location.href = response.redirect;
            } else {
              alert(response.message || "Failed to save project.");
            }
          })
          .fail(function (xhr, status, error) {
            console.error("Save failed:", error);
            alert("An error occurred while saving the project.");
          })
          .always(function () {
            $(".loading").hide(); // Hide loading in all cases
          });
      }
    }
  });

  // Delete project
  $(".delete_pro").on("click", async function () {
    if (!confirm("Are you sure you want to delete this project?")) return;

    $(".loading").show();

    try {
      const response = await $.ajax({
        url: `/project/${$projectId}/delete`,
        type: "GET",
        dataType: "json",
      });

      if (response.success) {
        window.location.href = "/index/project";
      } else {
        alert(response.message || "Failed to delete the project.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Error occurred while deleting the project.");
    } finally {
      $(".loading").hide();
    }
  });

  // Autocomplete for shared_id
  if ($("#shared_id").length) {
    $("#shared_id")
      .autocomplete({
        source: function (request, response) {
          $.ajax({
            url: "/user/fetchbypattern",
            dataType: "json",
            data: {
              pattern: request.term,
              limit: 10,
            },
            success: function (data) {
              response(data);
            },
            error: function () {
              response([]); // Handle errors gracefully
            },
          });
        },
        minLength: 1,
        select: function (event, ui) {
          $("#shared_id").val(ui.item.id);
          return false;
        },
      })
      .autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>")
        .append(
          "<div><strong>" + item.id + "</strong><br>" + item.name + "</div>"
        )
        .appendTo(ul);
    };
  }

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

  if ($("#architect_name").length) {
    $("#architect_name")
      .autocomplete({
        source: function (request, response) {
          $.ajax({
            url: "/architect",
            dataType: "json",
            data: {
              search: request.term,
              limit: 10,
            },
          })
            .done(function (data) {
              response(data);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
              console.error(
                "AJAX Error: ",
                textStatus,
                errorThrown,
                jqXHR.responseText
              );
              response([]); // Handle failure gracefully
            });
        },
        minLength: 1,
        select: function (event, ui) {
          if (ui.item && ui.item.architect_id) {
            getArchitectById(ui.item.architect_id);
            getAddress(ui.item.architect_id);
            getSpecifier(ui.item.architect_id);
          }
          return false;
        },
      })
      .autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>")
        .append(
          $("<div>")
            .addClass("autocomplete-item")
            .append($("<strong>").text(item.architect_name))
            .append($("<br>"))
            .append(
              $("<span>").text(item.architect_rep_id + " - " + item.company_id)
            )
        )
        .appendTo(ul);
    };
  }

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
