import { showFlashMessage } from '@/components/flashmessage';
import { projectID } from '@/components/init';
import { projectNoteTable } from '@/components/ui/table/tables';
import { resetForm } from '@/components/utils';
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';

export function initNote() {
    // Edit button
    document.addEventListener('click', function (e: Event) {
        const target = e.target as HTMLElement;
        if (target.closest('.note-edit')) {
            e.preventDefault();
            const noteEditBtn = target.closest('.note-edit') as HTMLButtonElement;
            const noteId = noteEditBtn.dataset.id as string;

            if (window.noteModalComponent && noteId) {
                window.noteModalComponent.editNote(noteId);
            }
        }
    });

    // Delete button
    document.addEventListener('click', async function (e: Event) {
        const target = e.target as HTMLElement;
        const deleteBtn = target.closest('.note-delete') as HTMLButtonElement;

        if (deleteBtn) {
            e.preventDefault();
            const noteId = deleteBtn.dataset.id;
            if (!noteId) return;

            const confirmed = confirm('Are you sure you want to delete this note?');
            if (!confirmed) return;

            try {
                const response = await fetch(`/note/${noteId}/delete`, {
                    method: 'POST',
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    projectNoteTable.ajax.reload();
                } else {
                    showFlashMessage(data.message || data.success);
                }
            } catch (err) {
                alert('Error deleting note.');
                console.error(err);
            }
        }
    });
}

export function noteModal() {
    const form = document.getElementById('dialog-note-form') as HTMLFormElement;

    return {
        open: false,
        isEditing: false,

        // Save note
        async submitForm() {
            const formData = new FormData(form);
            formData.append('project_id', projectID);

            const noteId = form.note_id.value;
            this.isEditing = !!noteId;

            try {
                const response = await fetch(this.isEditing ? `/note/${noteId}/edit` : '/note', {
                    method: 'POST',
                    body: formData,
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    projectNoteTable.ajax.reload();
                    resetForm(form);
                    this.open = false;
                } else {
                    showFlashMessage(data.message, data.success);
                }
            } catch (err) {
                alert('Error submitting form.');
                console.error(err);
            }
        },
        // Edit note
        async editNote(noteId: string) {
            try {
                const response = await fetch(`/note/${noteId}/edit`, {
                    headers: { 'X-Requested-With': 'XMLHttpRequest' },
                });
                const data = await response.json();

                if (data && data.note) {
                    form.note_title.value = data.note.note_title;
                    form.project_note.value = data.note.project_note;
                    form.next_action.value = data.note.next_action || '';

                    const followUpDataInput = document.getElementById('follow_up_date') as HTMLInputElement & {
                        _flatpickr?: FlatpickrInstance;
                    };

                    if (followUpDataInput._flatpickr && data.note.follow_up_date) {
                        followUpDataInput._flatpickr.setDate(data.note.follow_up_date.date);
                    }

                    form.note_id.value = noteId;

                    this.open = true;
                    this.isEditing = true;
                } else {
                    alert('Note not found.');
                }
            } catch (error) {
                console.error('Error loading note:', error);
                alert('Failed to load note.');
            }
        },
        closeModal() {
            resetForm(form);
            this.isEditing = false;
            this.open = false;
        },
    };
}
