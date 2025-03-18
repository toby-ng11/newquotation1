$(function () {
  /* --------------------------  GLOBAL VARIABLES ---------------------------- */

  const $projectId = $("#project_id").val();

  /* --------------------------  TABLES ---------------------------- */
  let noteTable = $("#project_note").DataTable({
    ajax: {
      url: "/note/table",
      data: {
        id: $projectId,
      },
      dataSrc: "",
    },
    processing: true,
    columns: [
      {
        data: "date_added.date",
        render: function (data) {
          let date = new Date(data);
          return "<p><b>" + date.toLocaleString("en-CA") + "</b></p>";
        },
      },
      {
        data: "note_title",
        render: function (data, type, row, meta) {
          if (data == "") {
            let formattedText = row.project_note.replace(
              /(?:\r\n|\r|\n)/g,
              "<br>"
            );
            return "<p>" + formattedText + "</p>";
          } else if (row.project_note == null) {
            // this is for old quote system rendering
            return "<p>" + data + "</p>";
          } else {
            let formattedText = row.project_note.replace(
              /(?:\r\n|\r|\n)/g,
              "<br>"
            );
            return "<p><b>" + data + "</b></br>" + formattedText + "</p>";
          }
        },
      },
      {
        data: "next_action",
        render: function (data) {
          let formattedText = data.replace(/(?:\r\n|\r|\n)/g, "<br>");
          return "<p>" + formattedText + "</p>";
        },
      },
      {
      	data: "follow_up_date.date",
      	render: function(data) {
          if (!data) {
            return '<p><b>--</b></p>';
          }
      		let date = new Date(data);
      		return '<p><b>' + date.toLocaleDateString("en-CA") + '</b></p>';
      	}
      },
      {
        data: "owner_id",
        render: function (data) {
          if (data != null) {
            return "<p><b>" + data + "</b></p>";
          } else {
            return data;
          }
        },
      },
      {
        data: "project_note_id",
        render: function (data) {
          if (isOwner) {
            return (
              '<div class="row-button">' +
              '<a title="Edit this note" class="note-edit" href="#">' +
              '<span class="button-wrap">' +
              '<span class="icon icon-edit"></span>' +
              "</span></a>" +
              '<a title="Delete this note" class="note_delete" target="_blank" href="/note/delete?note_id=' +
              data +
              '"><span class="button-wrap"><span class="icon icon-delete"></span></span></a></div>'
            );
          } else {
            return null;
          }
        },
      },
    ],
    columnDefs: [
      {
        targets: "_all",
        className: "dt-head-center",
      },
      {
        targets: [0, 3, 4, 5],
        className: "dt-body-center",
      },
    ],
    order: [[0, "desc"]],
    scrollX: true,
    fixedColumns: {
      end: 1,
    },
  });

  let itemTable = $("#items").DataTable({
    ajax: {
      url: "/item/table",
      data: {
        id: $projectId,
        type: "project",
      },
      dataSrc: "",
    },
    processing: true,
    columns: [
      {
        data: "item_id",
        render: function (data, type, row, meta) {
          return (
            '<b class="item-name">' + data + "</b>" + "<br>" + row.item_desc
          );
        },
      },
      {
        data: "quantity",
        render: function (data) {
          let qty = Number.parseFloat(data).toFixed(0);
          return "<b>" + qty + "</b>";
        },
      },
      {
        data: "unit_price",
        render: function (data) {
          return "<b>" + data + "</b>";
        },
      },
      {
        data: "uom",
        render: function (data) {
          return "<b>" + data + "</b>";
        },
      },
      {
        data: "subtotal",
        render: function (data) {
          return "<b>" + data + "</b>";
        },
      },
      {
        data: "note",
        render: function (data) {
          let formattedText = data.replace(/(?:\r\n|\r|\n)/g, "<br>");
          return "<p>" + formattedText + "</p>";
        },
      },
      {
        data: "item_id",
        render: function (data, type, row, meta) {
          //var oldData = getolddata($(this).closest('tr'));
          return (
            '<div class="row-button">' +
            '<a title="Edit this item" class="edit" href="#">' +
            '<span class="button-wrap">' +
            '<span class="icon icon-edit"></span>' +
            "</span></a>" +
            '<a title="Delete this item" class="item_delete" href="/item/delete?uid=' +
            row.item_uid + '&type=project' +
            '"' +
            'index="' +
            data +
            '">' +
            '<span class="button-wrap">' +
            '<span class="icon icon-delete"></span>' +
            "</span></a></div>"
          );
        },
      },
      {
        data: "item_uid",
        visible: false,
      },
    ],
    columnDefs: [
      {
        targets: "_all",
        className: "dt-head-center",
      },
      {
        targets: [0, 1, 2, 3, 4],
        className: "dt-body-center",
      },
    ],
    layout: {
      topStart: null,
      topEnd: null,
    },
    order: [[7, "desc"]], // sort by item uid, newest item on top
    paging: false,
    scrollX: true,
    fixedColumns: {
      start: 1,
      end: 1,
    },
    //rowReorder: true
  });

  let projectQuoteTable = $("#project-quote-table").DataTable({
    ajax: {
      url: "/project/quotetable/id/" + $projectId,
      dataSrc: "",
    },
    processing: true,
    columns: [
      {
        data: "quote_id",
        render: function (data, type, row, meta) {
          return (
            "<a target='_blank' href='/quote/edit/id/" +
            data +
            "'>" +
            data +
            "</a>"
          );
        },
      },
      {
        data: "project_name",
      },
      {
        data: "quote_date",
        render: function (data) {
          let date = new Date(data);
          return date.toLocaleDateString();
        },
      },
      {
        data: "expire_date.date",
        render: function (data) {
          let date = new Date(data);
          let today = new Date();
          if (date <= today) {
            return '<span class="red">' + date.toLocaleDateString() + "</span>";
          } else {
            return date.toLocaleDateString();
          }
        },
      },
      {
        data: "ship_required_date.date",
        render: function (data) {
          let date = new Date(data);
          return date.toLocaleDateString();
        },
      },
      {
        data: "quote_status",
        render: function (data) {
          if (data == -1) {
            return '<span class="disapproved red">Disapproved</span>';
          } else if (data == 10) {
            return '<span class="approved green">Approved</span>';
          } else if (data == 1) {
            return '<span class="waiting orange">Waiting</span>';
          } else {
            return "Not submitted";
          }
        },
      },
      {
        data: "order_no",
      },
    ],
    columnDefs: [
      {
        targets: "_all",
        className: "dt-head-center",
      },
      {
        targets: [0, 2, 3, 4, 5, 6],
        className: "dt-body-center",
      },
    ],
    order: [[0, "desc"]],
    scrollX: true,
    layout: {
      topStart: null,
      topEnd: null,
    },
  });

  /* -------------------------- FORM FUNCTIONS ---------------------------- */
  function resetForm($form) {
    $form
      .find(
        "input:hidden, input:text, input:password, input:file, select, textarea"
      )
      .val("")
      .trigger("change");
    $form
      .find("input:radio, input:checkbox")
      .prop("checked", false)
      .prop("selected", false)
      .trigger("change");
    $form.find("select").each(function () {
      let $select = $(this);
      if ($select.data("default-options")) {
        $select.html($select.data("default-options"));
      }
      $select.prop("selectedIndex", 0).trigger("change");
    });
    $form.find("input, select, textarea").prop("disabled", false);
  }

  /* --------------------------  ITEM FUNCTION ---------------------------- */

  let currentRow = "";
  let isEditItem = false;

  const $dialogItem = $("#dialog-item");
  const $itemForm = $("#item");
  const $btnAdd = $("#btn-add");
  const $uomDropdown = $("#uom");

  $uomDropdown.data("default-options", $uomDropdown.html());

  // Get selected row data
  $("#items tbody").on("click", "tr", function () {
    currentRow = itemTable.row(this).data();
    console.log(currentRow);
  });

  // Open Edit Dialog
  $(document).on("click", "a.edit", function (e) {
    e.preventDefault();

    isEditItem = true;

    $dialogItem.dialog("option", "title", "Edit Item");
    $dialogItem.dialog("open");

    $("#item #item_id").val(currentRow["item_id"] || "");
    $("#item #price").val(currentRow["unit_price"] || "");
    $("#item #qty").val(currentRow["quantity"] || "");
    $("#item #note").val(currentRow["note"] || "");
    $("#item #uom").val(currentRow["uom"] || "");

    getoum(currentRow["item_id"], currentRow["uom"], currentRow["price"]);
  });

  // Fetch price when UOM changes
  $uomDropdown.on("change", function () {
    getprice($("#item_id").val(), $("#uom").val());
  });

  // Open Add Item Dialog
  $("#add_item").on("click", function () {
    isEditItem = false;
    $dialogItem.dialog("option", "title", "Add Item");
    $dialogItem.dialog("open");
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
      resetForm($itemForm);
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
        id: "btn-add",
        text: "Add",
        click: function () {
          if ($itemForm.validationEngine("validate")) {
            disableButton($btnAdd, true);
            if (!isEditItem) {
              additem();
            } else {
              edititem();
            }
            $(this).dialog("close");
            //resetForm($itemForm);
            setTimeout(() => disableButton($btnAdd, false), 1000);
          }
        },
        "aria-label": "Add Item",
      },
      {
        id: "btn-cancel",
        text: "Cancel",
        click: function () {
          $(this).dialog("close");
        },
        "aria-label": "Cancel",
      },
    ],
  });

  // Autocomplete for Item ID
  if ($(".dialog #item_id").length) {
    $(".dialog #item_id")
      .autocomplete({
        appendTo: ".ui-dialog",
        source: function (request, response) {
          $.ajax({
            url: "/item/index",
            dataType: "json",
            data: { term: request.term, limit: 10 },
          })
            .done((data) => response(data))
            .fail((jqXHR, textStatus, errorThrown) => {
              console.error(
                "AJAX Error: ",
                textStatus,
                errorThrown,
                jqXHR.responseText
              );
              response([]);
            });
        },
        minLength: 2,
        open: function (event, ui) {
          $("ui-autocomplete").css("z-index", 2001);
        },
        select: function (event, ui) {
          if (ui.item && ui.item.item_id) {
            $("#item_id").val(ui.item.item_id);
            $("#item_input").val(ui.item.item_desc);
            getoum(ui.item.item_id);
            $("#uom").prop("disabled", false).removeClass("disabled");
          }
          return false;
        },
      })
      .autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>")
        .append(
          $("<div>")
            .addClass("autocomplete-item")
            .append($("<strong>").text(item.item_id))
            .append($("<span>").text(" - " + item.item_desc))
        )
        .appendTo(ul);
    };
  }

  // Utility function to enable/disable buttons
  function disableButton($button, state) {
    $button.prop("disabled", state);
  }

  // Fetch UOMs and select the old one when editing
  function getoum(item_id, old_uom = null, old_price = null) {
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
        getprice(item_id, old_uom || $("#uom").val(), old_price);
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error fetching specifier:", textStatus, errorThrown);
      });
  }

  // Fetch Item Price
  function getprice(item_id, uom, old_price = null) {
    if (!item_id || !uom) return;
    $.ajax({
      url: "/item/price",
      data: { item_id, uom },
      dataType: "json",
    })
      .done((data) => {
        $("#price").val(data?.price || old_price || "");
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error fetching price:", textStatus, errorThrown);
      });
  }

  // Add Item Function
  function additem() {
    disableButton($btnAdd, true);
    let formData =
      $itemForm.serialize() +
      "&project_id=" +
      encodeURIComponent($projectId) +
      "&type=project";

    $.ajax({
      url: "/item/add",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => itemTable.ajax.reload())
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding item:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to add item. Please try again.");
      })
      .always(() => disableButton($btnAdd, false));
  }

  function getolddata(row = currentRow) {
    if (!row) {
      console.error("getolddata(): currentRow is undefined");
      return {};
    }

    const { item_uid, item_id, note, quantity, unit_price, uom } = currentRow;

    return {
      item_uid,
      old_item_id: item_id,
      old_uom: uom,
      old_price: unit_price,
      old_qty: quantity,
      old_note: note,
    };
  }

  // Edit Item Function
  function edititem() {
    disableButton($btnAdd, true);
    let formData =
      $itemForm.serialize() +
      "&uid=" +
      encodeURIComponent(getolddata().item_uid) +
      "&type=project";

    $.ajax({
      url: "/item/edit",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => itemTable.ajax.reload())
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding item:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to edit item. Please try again.");
      })
      .always(() => disableButton($btnAdd, false));
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
          console.error("Error deleting item:", textStatus, errorThrown, jqXHR.responseText);
        });
    }
  });

  /* --------------------------  NOTE FUNCTION ---------------------------- */

  const $noteForm = $("#note");
  const $dialogNote = $("#dialog-message");

  let currentnoteRow = "";
  let isEditnote = false;

  $("#dialog-message").dialog({
    autoOpen: false,
    modal: true,
    minWidth: 800,
    width: 1000,
    //minHeight: 600,
    open: function () {
      // fade in background
      resetForm($noteForm);
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
        id: "btn-add",
        text: "Add Log",
        click: function () {
          if ($noteForm.validationEngine("validate")) {
            if (!isEditnote) {
              addnote();
            } else {
              editnote();
            }
            $(this).dialog("close");
            setTimeout(() => disableButton($btnAdd, false), 1000);
          }
        },
        "aria-label": "Add Log",
      },
      {
        id: "btn-cancel",
        text: "Cancel",
        click: function () {
          $(this).dialog("close");
        },
        "aria-label": "Cancel",
      },
    ],
  });

  $("#project_note tbody").on("click", "tr", function () {
    currentnoteRow = noteTable.row(this).data();
    console.log(currentnoteRow);
  });

  $(document).on("click", ".note-edit", function (e) {
    e.preventDefault();

    isEditnote = true;

    $dialogNote.dialog("option", "title", "Edit Log");
    $dialogNote.dialog("open");

    $("#note #note_title").val(currentnoteRow["note_title"] || "");
    $("#note #project_note").val(currentnoteRow["project_note"] || "");
    $("#note #next_action").val(currentnoteRow["next_action"] || "");
    let followUpDate = new Date(currentnoteRow["follow_up_date"]["date"] || "");
    $("#note #follow_up_date").val(followUpDate.toLocaleDateString() || "");
  });

  $("#opener").on("click", function () {
    isEditnote = false;
    $dialogNote.dialog("option", "title", "Add Log");
    $dialogNote.dialog("open");
  });

  function addnote() {
    disableButton($btnAdd, true);
    let formData =
      $noteForm.serialize() + "&project_id=" + encodeURIComponent($projectId);

    $.ajax({
      url: "/note/add",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => noteTable.ajax.reload())
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding note:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to add note. Please try again.");
      })
      .always(() => disableButton($btnAdd, false));
  }

  function editnote() {
    disableButton($btnAdd, true);
    let formData =
      $noteForm.serialize() +
      "&note_id=" +
      encodeURIComponent(currentnoteRow["project_note_id"]);

    $.ajax({
      url: "/note/edit",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => noteTable.ajax.reload())
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error editing note:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to edit note. Please try again.");
      })
      .always(() => disableButton($btnAdd, false));
  }

  $(document).on("click", ".note_delete", function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this log?")) {
      $.ajax({
        url: $(this).attr("href"),
        type: "get",
      })
      .done(() => noteTable.ajax.reload())
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error deleting item:", textStatus, errorThrown, jqXHR.responseText);
      });;
    }
  });

  /* ----------------------------- Page Load -------------------------------- */

  let unsave = false;

  $("#project_content").on("change", function () {
    $("#save-project").prop("disabled", false);
    unsave = true;
  });

  $("#save-project").on("click", function (e) {
    e.preventDefault();
    if ($("#project_content").validationEngine("validate") == true) {
      if ($("#status").val() != 13) {
        if ($("#gerneral_contractor").val() == "") {
          $("#gerneral_contractor_id").val("");
        } // delete contractor
        if ($("#awarded_contractor").val() == "") {
          $("#awarded_contractor_id").val("");
        }
        $("#project_content").trigger("submit");
        unsave = false;
      }
    }
  });

  window.onbeforeunload = function () {
    if (unsave) {
      $("#save-project").trigger("focus");
      return "You have unsaved changes project information. Do you want to leave this page and discard your changes or stay on this page?";
    }
  };

  $(".delete_pro").on("click", function () {
    if (confirm("Are you sure you want to delete this project?") == true) {
      $(".loading").show();
      $.ajax({
        url: "/project/delete/id/" + $projectId,
        type: "get",
        success: function (data) {
          $(".loading").hide();

          window.location = "/";
        },
      });
    }
  });

  /* ------------------------------   For project/{new, edit} ---------------------------------*/
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
    "#architect_name, #architect_id, #architect_company_id, #architect_rep_id, #address_id, " +
      "#phys_address1, #phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, " +
      "#central_phone_number, #email_address, #url"
  );

  let specifierDropdown = $("#specifier_name");
  let specifierFields = $(
    "#specifier_id, #specifier_address_id, #specifier_first_name, #specifier_last_name, #specifier_job_title, #specifier_phone_number, #specifier_email"
  );

  $("#add_architect").on("click", function () {
    architectFields.val("").prop("readonly", false);
    specifierFields.val("").prop("readonly", false);
  });

  if ($("#architect_name").length) {
    $("#architect_name")
      .autocomplete({
        source: function (request, response) {
          $.ajax({
            url: "/architect/fetch",
            dataType: "json",
            data: {
              term: request.term,
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
      url: "/architect/fetchfull/id/" + id,
      dataType: "json",
      type: "get",
    })
      .done(function (architect) {
        if (architect) {
          architectFields.each(function () {
            let fieldName = $(this).attr("id");
            $(this)
              .val(architect[fieldName] || "")
              .prop("readonly", true);
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

  function getSpecifier(id) {
    if (!id) return;
    $.ajax({
      url: "/architect/fetchspecs/id/" + id,
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

  function getSpecifierInfo() {
    let specifierId = $("#specifier_name").val();
    if (!specifierId || specifierId === "new") return;
    $.ajax({
      url: "/architect/specinfo/id/" + specifierId,
      dataType: "json",
      type: "get",
    })
      .done(function (specifier) {
        if (specifier) {
          specifierFields.each(function () {
            let fieldName = $(this).attr("id");
            $(this)
              .val(specifier[fieldName] || "")
              .prop("readonly", true);
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

  /* ----------------------------- Contractor / Customer -------------------------------- */

  setupAutocomplete(
    "#general_contractor_name",
    "/customer/fetch",
    function (item) {
      getContractor(item.customer_id, "general_contractor");
    }
  );

  setupAutocomplete(
    "#awarded_contractor_name",
    "/customer/fetch",
    function (item) {
      getContractor(item.customer_id, "awarded_contractor");
    }
  );

  function getContractor(id, targetPrefix) {
    $.ajax({
      url: "/customer/fetchbyid/id/" + id,
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
});
