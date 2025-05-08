import { $projectId } from "./init.js";
import { projectNoteTable } from "./tables.js";
import { resetForm, disableButton } from "./utils.js";
import { showFlashMessage } from "../api/flashmessage.js";

const $noteForm = $("#dialog-note-form");
const $dialogNote = $("#dialog-message");
const $dialogBtnAddNote = $("#note-form-btn-add");

let isEditnote = false;

let follow_up_date = document.getElementById("follow_up_date");

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

export function noteModal() {
  const form = document.getElementById("dialog-note-form");
  return {
    open: false,
    async submitForm() {
      const formData = new FormData(form);
      formData.append("project_id", $projectId);

      const noteId = form.note_id.value;
      const isEditing = !!noteId;

      try {
        const response = await fetch(isEditing ? `/note/${noteId}/edit` : "/note", {
          method: "POST",
          body: formData,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });

        const data = await response.json();

        if (data.success) {
          showFlashMessage(data.message, data.success);
          projectNoteTable.ajax.reload();
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
    async editNote(noteId) {
      try {
        const response = await fetch(`/note/${noteId}/edit`, {
          headers: { "X-Requested-With": "XMLHttpRequest" },
        });
        const data = await response.json();

        if (data && data.note) {
          form.note_title.value = data.note.note_title;
          form.project_note.value = data.note.project_note;
          form.next_action.value = data.note.next_action || "";

          const followUpDataInput = document.getElementById("follow_up_date")._flatpickr;
          if (followUpDataInput && data.note.follow_up_date) followUpDataInput.setDate(data.note.follow_up_date.date);

          form.note_id.value = noteId;

          this.open = true;
        } else {
          alert("Note not found.");
        }
      } catch (error) {
        console.error("Error loading note:", error);
        alert("Failed to load note.");
      }
    },
    closeModal() {
      resetForm(form);
      this.open = false;
    },
  };
}
