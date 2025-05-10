import { projectID } from "../../init.js";
import { showFlashMessage } from "../../flashmessage.js";
import { projectNoteTable } from "../../ui/table/tables.js";
import { resetForm } from "../../utils.js";

export function noteModal() {
  const form = document.getElementById("dialog-note-form");
  return {
    open: false,
    // Save note
    async submitForm() {
      const formData = new FormData(form);
      formData.append("project_id", projectID);

      const noteId = form.note_id.value;
      const isEditing = !!noteId;

      try {
        const response = await fetch(
          isEditing ? `/note/${noteId}/edit` : "/note",
          {
            method: "POST",
            body: formData,
            headers: {
              "X-Requested-With": "XMLHttpRequest",
            },
          }
        );

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
    // Edit note
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

          const followUpDataInput =
            document.getElementById("follow_up_date")._flatpickr;
          if (followUpDataInput && data.note.follow_up_date)
            followUpDataInput.setDate(data.note.follow_up_date.date);

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
