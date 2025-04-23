import { $projectId } from "./init.js";
import { projectNoteTable } from "./tables.js";
import { resetForm, disableButton } from "./utils.js";
import { showFlashMessage } from "./flashmessage.js";

const $noteForm = $("#dialog-note-form");
const $dialogNote = $("#dialog-message");
const $dialogBtnAddNote = $("#note-form-btn-add");

let isEditnote = false;

let follow_up_date = flatpickr("#dialog-note-form #follow_up_date", {
  enableTime: true,
  dateFormat: "Y-m-d H:i",
});

export function initNote() {
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
          $("#dialog-note-form #note_id").val(data["project_note_id"] || "");
          $("#dialog-note-form #note_title").val(data["note_title"] || "");
          $("#dialog-note-form #project_note").val(data["project_note"] || "");
          $("#dialog-note-form #next_action").val(data["next_action"] || "");
          if (data["follow_up_date"]) {
            follow_up_date.setDate(data["follow_up_date"]["date"]);
          } else {
            follow_up_date.clear();
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
      .done((response) => {
        projectNoteTable.ajax.reload();
        showFlashMessage(response.message, response.success);
      })
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
      .done(() => {
        projectNoteTable.ajax.reload();
        showFlashMessage(response.message, response.success);
      })
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
}
