$(function () {
  /* --------------------------  GLOBAL VARIABLES ---------------------------- */

  const $projectId = window.location.pathname.split("/")[2];
  const $projectForm = $("#project_content");

  /* --------------------------  TABLES ---------------------------- */

  let adminProjectTable = $("#admin-project-table").DataTable({
    ajax: {
      url: "/index/admin/project?view=true",
      dataSrc: "",
    },
    processing: true,
    //serverSide: true, // experimetal: server-side processing
    columns: [
      {
        data: "project_id_ext",
        render: function (data, type, row, meta) {
          return (
            "<a target='_blank' href='/project/" +
            row.project_id +
            "/edit'>" +
            data +
            "</a>"
          );
        },
      },
      {
        data: "project_name",
      },
      {
        data: "owner_id",
      },
      {
        data: "shared_id",
      },
      {
        data: "create_date.date",
        render: function (data) {
          let date = new Date(data);
          return date.toLocaleDateString();
        },
      },
      {
        data: "due_date.date",
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
        data: "architect_name",
      },
      {
        data: "market_segment_desc",
      },
      {
        data: "status_desc",
      },
      {
        data: "project_id",
        render: function (data, type, row, meta) {
          return (
            '<a class="make-quote-button" title="Make Quote">' +
            '<span class="button-wrap"><span class="icon icon-money"></span></span></a>'
          );
        },
      },
    ],
    columnDefs: [
      {
        targets: "_all",
        className: "dt-head-center",
      },
      {
        targets: [0, 2, 3, 4, 5, 7, 8],
        className: "dt-body-center",
      },
    ],
    //"responsive": true,
    order: [[0, "desc"]],
    fixedColumns: {
      start: 1,
      end: 1,
    },
    scrollX: true,
    layout: {
      topStart: function () {
        let info = document.createElement("div");
        info.innerHTML = "<h2>All projects</h2>";
        return info;
      },
      bottomStart: "pageLength",
    },
  });

  let adminQuoteTable = $("#admin-quote-table").DataTable({
    ajax: {
      url: "/index/admin/quote?view=true",
      dataSrc: "",
    },
    processing: true,
    //serverSide: true, // to-do: server-side processing with laminas
    columns: [
      {
        data: "quote_id",
        render: function (data, type, row, meta) {
          return (
            "<a target='_blank' href='/quote/" +
            data +
            "/edit'>" +
            data +
            "</a>"
          );
        },
      },
      {
        data: "project_name",
      },
      {
        data: "market_segment_desc",
      },
      {
        data: "quote_date.date",
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
        data: "project_status",
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
    ],
    columnDefs: [
      {
        targets: "_all",
        className: "dt-head-center",
      },
      {
        targets: [0, 2, 3, 4, 5, 6, 7],
        className: "dt-body-center",
      },
    ],
    order: [[0, "desc"]],
    fixedColumns: {
      start: 1,
      end: 1,
    },
    scrollX: true,
    layout: {
      topStart: function () {
        let info = document.createElement("div");
        info.innerHTML = "<h2>All quotes</h2>";
        return info;
      },
      bottomStart: "pageLength",
    },
  });

  let projectNoteTable = $("#project_note").DataTable({
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
        render: function (data) {
          if (!data) {
            return "<p><b>--</b></p>";
          }
          let date = new Date(data);
          return "<p><b>" + date.toLocaleDateString("en-CA") + "</b></p>";
        },
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
              '<a title="Edit this note" class="note-edit" href="/note/fetch?id=' +
              data +
              '">' +
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

  let projectItemTable = $("#project-item-table").DataTable({
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
        data: "item_uid",
        render: function (data) {
          //var oldData = getolddata($(this).closest('tr'));
          return (
            '<div class="row-button">' +
            '<a title="Edit this item" class="item-edit" href="/item/fetch?uid=' +
            data +
            '&type=project">' +
            '<span class="button-wrap">' +
            '<span class="icon icon-edit"></span>' +
            "</span></a>" +
            '<a title="Delete this item" class="item_delete" href="/item/delete?uid=' +
            data +
            '&type=project">' +
            '<span class="button-wrap">' +
            '<span class="icon icon-delete"></span>' +
            "</span></a></div>"
          );
        },
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
      url: `/project/${$projectId}/quotetable`,
      dataSrc: "",
    },
    processing: true,
    columns: [
      {
        data: "quote_id",
        render: function (data, type, row, meta) {
          return (
            "<a target='_blank' href='/quote/" +
            data +
            "/edit'>" +
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

  /* -------------------------- GLOBAL FUNCTIONS ---------------------------- */
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

  // Utility function to enable/disable buttons
  function disableButton($button, state) {
    $button.prop("disabled", state);
  }

  /* --------------------------  ITEM FUNCTION ---------------------------- */

  let isEditItem = false;

  const $dialogItem = $("#dialog-item");
  const $itemForm = $("#dialog-item-form");
  const $dialogBtnAddItem = $("#item-form-btn-add");
  const $uomDropdown = $("#uom");

  $uomDropdown.data("default-options", $uomDropdown.html());

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
          $("#dialog-item-form #price").val(data["unit_price"] || "");
          $("#dialog-item-form #qty").val(data["quantity"] || "");
          $("#dialog-item-form #note").val(data["note"] || "");
          $("#dialog-item-form #uom").val(data["uom"] || "");

          getoum(data["item_id"], data["uom"], data["price"]);
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

  // Fetch price when UOM changes
  $uomDropdown.on("change", function () {
    getprice($("#item_id").val(), $("#uom").val());
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
        id: "item-form-btn-add",
        click: function () {
          if ($itemForm.validationEngine("validate")) {
            disableButton($dialogBtnAddItem, true);
            if (!isEditItem) {
              additem();
            } else {
              edititem();
            }
            $(this).dialog("close");
            //resetForm($itemForm);
            setTimeout(() => disableButton($dialogBtnAddItem, false), 1000);
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
  if ($(".dialog #item_id").length) {
    $(".dialog #item_id")
      .autocomplete({
        appendTo: "#dialog-item-form",
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
    disableButton($dialogBtnAddItem, true);
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
      .done(() => projectItemTable.ajax.reload())
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding item:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to add item. Please try again.");
      })
      .always(() => disableButton($dialogBtnAddItem, false));
  }

  // Edit Item Function
  function edititem() {
    disableButton($dialogBtnAddItem, true);
    let formData = $itemForm.serialize() + "&type=project";

    $.ajax({
      url: "/item/edit",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => projectItemTable.ajax.reload())
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding item:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to edit item. Please try again.");
      })
      .always(() => disableButton($dialogBtnAddItem, false));
  }

  // Handle Item Delete
  $(document).on("click", ".item_delete", function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this item?")) {
      $.ajax({
        url: $(this).attr("href"),
        type: "GET",
      })
        .done(() => projectItemTable.ajax.reload())
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

  /* --------------------------  NOTE FUNCTION ---------------------------- */

  const $noteForm = $("#note");
  const $dialogNote = $("#dialog-message");
  const $dialogBtnAddNote = $("#note-form-btn-add");

  let isEditnote = false;

  $("#dialog-message").dialog({
    autoOpen: false,
    modal: true,
    minWidth: 800,
    width: 1000,
    height: 650,
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
    dialogClass: "add-note-dialog",
    buttons: [
      {
        id: "note-form-btn-add",
        text: "Add Log",
        click: function () {
          if ($noteForm.validationEngine("validate")) {
            if (!isEditnote) {
              addnote();
            } else {
              editnote();
            }
            $(this).dialog("close");
            setTimeout(() => disableButton($dialogBtnAddNote, false), 1000);
          }
        },
        "aria-label": "Add Log",
      },
      {
        id: "note-form-btn-cancel",
        text: "Cancel",
        click: function () {
          $(this).dialog("close");
        },
        "aria-label": "Cancel",
      },
    ],
  });

  $(document).on("click", ".note-edit", function (e) {
    e.preventDefault();

    isEditnote = true;

    $dialogNote.dialog("option", "title", "Edit Log");
    $dialogNote.dialog("open");
    $dialogBtnAddNote.text("Save Changes");

    $.ajax({
      url: $(this).attr("href"),
      type: "GET",
      dataType: "json",
    })
      .done((response) => {
        if (response.success && response.data) {
          const data = response.data;

          $("#note #note_id").val(data["project_note_id"] || "");
          $("#note #note_title").val(data["note_title"] || "");
          $("#note #project_note").val(data["project_note"] || "");
          $("#note #next_action").val(data["next_action"] || "");
          if (data["follow_up_date"]) {
            let followUpDate = new Date(data["follow_up_date"]["date"] || "");
            $("#note #follow_up_date").val(
              followUpDate.toLocaleDateString() || ""
            );
          }
        } else {
          alert(response.message || "Failed to fetch note data.");
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error fetch note data:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
      });
  });

  $("#widget-btn-add-note").on("click", function () {
    isEditnote = false;
    $dialogNote.dialog("option", "title", "Add Log");
    $dialogNote.dialog("open");
    $dialogBtnAddNote.text("Add Note");
  });

  function addnote() {
    disableButton($dialogBtnAddNote, true);
    let formData =
      $noteForm.serialize() + "&project_id=" + encodeURIComponent($projectId);

    $.ajax({
      url: "/note/add",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => projectNoteTable.ajax.reload())
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error adding note:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to add note. Please try again.");
      })
      .always(() => disableButton($dialogBtnAddNote, false));
  }

  function editnote() {
    disableButton($dialogBtnAddNote, true);
    let formData = $noteForm.serialize();

    $.ajax({
      url: "/note/edit",
      type: "post",
      data: formData,
      contentType: "application/x-www-form-urlencoded",
    })
      .done(() => projectNoteTable.ajax.reload())
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error(
          "Error editing note:",
          textStatus,
          errorThrown,
          jqXHR.responseText
        );
        alert("Failed to edit note. Please try again.");
      })
      .always(() => disableButton($dialogBtnAddNote, false));
  }

  $(document).on("click", ".note_delete", function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this log?")) {
      $.ajax({
        url: $(this).attr("href"),
        type: "get",
      })
        .done(() => projectNoteTable.ajax.reload())
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

  /* --------------------------  MAKE QUOTE FUNCTION ---------------------------- */

  const $makeQuoteForm = $("#dialog-make-quote-form");
  const $dialogMakeQuote = $("#dialog-make-quote");
  const $dialogBtnAddCustomer = $("#customer-form-btn-add");

  let $customerFields = $(
    "#customer_id, #customer_name, #company_id, #salesrep_full_name"
  );
  let $contactDropdown = $("#contact_name");
  let $contactFields = $(
    "#contact_id, #first_name, #last_name, #phys_address1, #phys_address2, #phys_city, #phys_state, #phys_postal_code, #phys_country, #central_phone_number, #email_address"
  );

  $contactDropdown.data("default-options", $contactDropdown.html());
  $contactFields.prop("readonly", true);

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

  $("#widget-btn-add-quote").on("click", function () {
    //$dialogNote.dialog("option", "title", "Add Log");
    $dialogMakeQuote.dialog("open");
  });

  if ($(".dialog #customer_name").length) {
    $(".dialog #customer_name")
      .autocomplete({
        appendTo: "#dialog-make-quote-form",
        source: function (request, response) {
          $.ajax({
            url: "/customer/fetch",
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
          if (ui.item && ui.item.customer_id) {
            $customerFields.each(function () {
              let fieldName = $(this).attr("id");
              $(this).val(ui.item[fieldName] || "");
            });
            getCustomerContacts(ui.item.customer_id);
          }
          return false;
        },
      })
      .autocomplete("instance")._renderItem = function (ul, item) {
      return $("<li>")
        .append(
          $("<div>")
            .addClass("autocomplete-item")
            .append($("<strong>").text(item.customer_id))
            .append($("<span>").text(" - " + item.customer_name))
        )
        .appendTo(ul);
    };
  }

  function getCustomerContacts(customer_id) {
    if (!customer_id) return;
    $.ajax({
      url: "/customer/contacts",
      data: { customer_id },
      dataType: "json",
      type: "get",
    })
      .done((data) => {
        $contactDropdown.empty();

        $.each(data, function (i, item) {
          $contactDropdown.append(
            '<option value="' +
              item.contact_id +
              '">' +
              item.contact_full_name +
              "</option>"
          );
        });
        getContactInfo();
      })
      .fail(function (jqXHR, textStatus, errorThrown) {
        console.error("Error fetching specifier:", textStatus, errorThrown);
      });
  }

  $("#contact_name").on("change", function () {
    getContactInfo();
  });

  function getContactInfo() {
    let contactID = $("#contact_name").val();
    if (!contactID) return;
    $.ajax({
      url: "/customer/contactinfo",
      data: { contact_id: contactID },
      dataType: "json",
      type: "get",
    })
      .done((data) => {
        if (data) {
          $contactFields.each(function () {
            let fieldName = $(this).attr("id");
            $(this).val(data[fieldName] || "");
          });
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error fetching specifier:", textStatus, errorThrown);
      });
  }

  function makeQuote() {
    disableButton($dialogBtnAddCustomer, true);

    let contactID = $("#contact_id").val();
    let formData =
      $projectForm.serialize() + "&contact_id=" + encodeURIComponent(contactID);

    $.ajax({
      url: "/quote/create",
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
      .always(() => disableButton($dialogBtnAddCustomer, false));
  }

  /* ----------------------------- Page Load -------------------------------- */

  const $architectDetails = $("#architect-details");
  const architectName = $("#architect_name").val();

  const $contractorDetails = $("#contractor-details");
  const generalContractor = $("#general_contractor_name").val();
  const awardedContractor = $("#awarded_contractor_name").val();

  // Auto expand architect details
  if ($architectDetails.length && architectName.trim() != "") {
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

  let unsave = false;

  $projectForm.on("change", function () {
    $("#save-project").prop("disabled", false);
    unsave = true;
  });

  $("#save-project").on("click", function (e) {
    e.preventDefault();
    if ($projectForm.validationEngine("validate") == true) {
      if ($("#status").val() != 13) {
        if (generalContractor.trim() == "") {
          $("#general_contractor_id").val("");
        } // delete contractor
        if (awardedContractor.trim() == "") {
          $("#awarded_contractor_id").val("");
        }
        $projectForm.trigger("submit");
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
