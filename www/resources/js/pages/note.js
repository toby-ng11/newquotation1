import { $projectId } from "../components/init.js";
import { projectNoteTable } from "../components/ui/table/tables.js";
import { resetForm } from "../components/utils.js";
import { showFlashMessage } from "../components/flashmessage.js";
import { disableButton } from "../components/DisableButton.js";

const $noteForm = $("#dialog-note-form");
const $dialogNote = $("#dialog-message");
const $dialogBtnAddNote = $("#note-form-btn-add");

let isEditnote = false;

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

  document.addEventListener("click", function (e) {
    if (e.target.closest(".note-edit")) {
      e.preventDefault();
      const noteId = e.target.closest(".note-edit").dataset.id;
  
      if (window.noteModalComponent && noteId) {
        window.noteModalComponent.editNote(noteId);
      }
    }
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

  // Delete note
  document.addEventListener("click", async function (e) {
    const deleteBtn = e.target.closest(".note-delete");
  
    if (deleteBtn) {
      e.preventDefault();
      const noteId = deleteBtn.dataset.id;
      if (!noteId) return;
  
      const confirmed = confirm("Are you sure you want to delete this note?");
      if (!confirmed) return;
  
      try {
        const response = await fetch(`/note/${noteId}/delete`, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });
  
        const data = await response.json();
  
        if (data.success) {
          showFlashMessage(data.message, data.success);
          projectNoteTable.ajax.reload();
        } else {
          showFlashMessage(data.message || data.success);
        }
      } catch (err) {
        alert("Error deleting note.");
        console.error(err);
      }
    }
  });
}
