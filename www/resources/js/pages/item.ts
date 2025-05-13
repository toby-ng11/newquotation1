import { projectID, sheetType } from "../components/init";
import { itemTable } from "../components/ui/table/tables";
import { resetForm } from "../components/utils";
import { showFlashMessage } from "../components/flashmessage";
import { setupAutoComplete } from "../components/autocomplete";
import { disableButton } from "../components/DisableButton";

let isEditItem = false;

const $dialogItem = $("#dialog-item");
const $itemForm = $("#dialog-item-form");
const $dialogBtnAddItem = $("item-form-btn-add");
const dialogBtnAddItem = document.getElementById("item-form-btn-add");
const $uomDropdown = $("#uom");

$uomDropdown.data("default-options", $uomDropdown.html());

export function initItem() {
  const uomDropdown = document.getElementById("uom");
  const itemForm = document.getElementById("dialog-item-form");

  // Open Edit Dialog
  $(document).on("click", "a.item-edit", function (e) {
    e.preventDefault();

    isEditItem = true;

    $dialogItem.dialog("option", "title", "Edit Item");
    $dialogItem.dialog("open");
    $dialogBtnAddItem.text("Save Changes");

    $.ajax({
      url: $(this).attr("href"),
      type: "GET",
      dataType: "json",
    })
      .done((response) => {
        if (response.success && response.data) {
          const data = response.data;

          $("#dialog-item-form #item_uid").val(data["item_uid"] || "");
          $("#dialog-item-form #item_id").val(data["item_id"] || "");
          //$("#dialog-item-form #unit_price").val(data["unit_price"] || "");
          $("#dialog-item-form #quantity").val(data["quantity"] || "");
          $("#dialog-item-form #note").val(data["note"] || "");
          $("#dialog-item-form #uom").val(data["uom"] || "");

          getoum(
            data["item_id"],
            data["uom"],
            data["unit_price"],
            data["item_uid"]
          );
        } else {
          alert(response.message || "Failed to fetch item data.");
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error deleting item:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
      });
  });

  // Open Add Item Dialog
  $("#widget-btn-add-item").on("click", function () {
    isEditItem = false;
    $dialogItem.dialog("option", "title", "Add Item");
    $dialogItem.dialog("open");
    $dialogBtnAddItem.text("Add Item");
  });

  // Item Dialog Setup
  $("#dialog-item").dialog({
    autoOpen: false,
    modal: true,
    minWidth: 800,
    width: 800,
    //minHeight: 600,
    open: function () {
      // fade in background
      resetForm(itemForm);
      $(".ui-widget-overlay").hide().fadeIn().css("z-index", 1000);
      $(".ui-dialog").css("z-index", 2000);
    },
    beforeClose: function () {
      //fade out background
      $(".ui-widget-overlay").fadeOut(400, function () {
        $(this).remove();
      });
    },
    dialogClass: "add-item-dialog",
    buttons: [
      {
        id: "item-form-btn-add",
        text: "Save",
        click: function () {
          if ($itemForm.validationEngine("validate")) {
            disableButton(dialogBtnAddItem, true);
            if (!isEditItem) {
              additem();
            } else {
              edititem();
            }
            $(this).dialog("close");
            //resetForm($itemForm);
            setTimeout(() => disableButton(dialogBtnAddItem, false), 1000);
          }
        },
        "aria-label": "Add Item",
      },
      {
        id: "item-form-btn-cancel",
        text: "Cancel",
        click: function () {
          $(this).dialog("close");
        },
        "aria-label": "Cancel",
      },
    ],
  });

  // Autocomplete for Item ID
  if (document.querySelector(".dialog #item_id")) {
    setupAutoComplete({
      fieldName: ".dialog #item_id",
      fetchUrl: "/item/index",
      fillFields: [
        { fieldSelector: "#item_id", itemKey: "item_id" },
        { fieldSelector: "#item_input", itemKey: "item_desc" },
      ],
      minLength: 2,
      queryParamName: "term",
      limitParamName: "limit",
      renderItem: (item) => `
      <div class="autocomplete-item">
        <strong>${item.item_id}</strong><br>
        <span>${item.item_desc}</span>
      </div>`,
      extraSelectActions: [
        (item) => {
          if (item.item_id) {
            getoum(item.item_id);
            uomDropdown.disabled = false;
            uomDropdown.classList.remove("disabled");
          }
        },
      ],
    });
  }

  // Fetch price when UOM changes
  $uomDropdown.on("change", function () {
    getP21Price($("#item_id").val(), $("#uom").val());
  });

  // Fetch UOMs and select the old one when editing
  function getoum(item_id, old_uom = null, old_price = null, item_uid = null) {
    if (!item_id) return;
    $.ajax({
      url: "/item/uom",
      dataType: "json",
      data: { term: item_id },
      type: "get",
    })
      .done(function (data) {
        $uomDropdown.empty();

        $.each(data, function (i, item) {
          let option = $("<option></option>")
            .attr("value", item.uom)
            .text(item.uom);

          //set the selected UOM if editing
          if (old_uom && item.uom === old_uom) {
            option.attr("selected", "selected");
          }

          $uomDropdown.append(option);
        });

        if (isEditItem) {
          getQuotedPrice(item_uid, sheetType);
        } else {
          getP21Price(item_id, old_uom || $("#uom").val(), old_price);
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error fetching specifier:", textStatus, errorThrown);
      });
  }

  // Fetch P21 Item Price
  function getP21Price(item_id, uom, old_price = null) {
    if (!item_id || !uom) return;
    $.ajax({
      url: "/item/price",
      data: { item_id, uom },
      dataType: "json",
    })
      .done((data) => {
        $("#unit_price").val(data?.price || old_price || "");
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error fetching price:", textStatus, errorThrown);
      });
  }

  function getQuotedPrice(item_uid, type) {
    if (!item_uid) return;
    $.ajax({
      url: "/item/quotedprice",
      data: { item_uid, type },
      dataType: "json",
    })
      .done((data) => {
        $("#unit_price").val(data?.unit_price || "");
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error fetching price:", textStatus, errorThrown);
      });
  }

  // Add Item Function
  function additem() {
    disableButton(dialogBtnAddItem, true);
    let formData =
      $itemForm.serialize() +
      "&project_id=" +
      encodeURIComponent(projectID) +
      "&type=" +
      encodeURIComponent(sheetType);

    $.ajax({
      url: "/item/add",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done((response) => {
        itemTable.ajax.reload();
        showFlashMessage(response.message, response.success);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding item:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to add item. Please try again.");
      })
      .always(() => disableButton(dialogBtnAddItem, false));
  }

  // Edit Item Function
  function edititem() {
    disableButton(dialogBtnAddItem, true);
    let formData =
      $itemForm.serialize() + "&type=" + encodeURIComponent(sheetType);
    $.ajax({
      url: "/item/edit",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done((response) => {
        itemTable.ajax.reload();
        showFlashMessage(response.message, response.success);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding item:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to edit item. Please try again.");
      })
      .always(() => disableButton(dialogBtnAddItem, false));
  }

  // Handle Item Delete
  $(document).on("click", ".item_delete", function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this item?")) {
      $.ajax({
        url: $(this).attr("href"),
        type: "GET",
      })
        .done(() => itemTable.ajax.reload())
        .fail((jqXHR, textStatus, errorThrown) => {
          console.error(
            "Error deleting item:",
            textStatus,
            errorThrown,
            jqXHR.responseText
          );
        });
    }
  });
}
