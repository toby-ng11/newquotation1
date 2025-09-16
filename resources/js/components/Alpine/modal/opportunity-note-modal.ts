import { showFlashMessage } from '@/components/flashmessage';
import { sheetID } from '@/components/init';
import { opportunityNoteTable } from '@/components/ui/table/tables';
import { resetForm } from '@/components/utils';
import { OpportunityNote } from '@/types';
import axios from 'axios';
import { Instance as FlatpickrInstance } from 'flatpickr/dist/types/instance';

export function initOpportunityNote() {
    // Edit button
    document.addEventListener('click', function (e: Event) {
        const target = e.target as HTMLElement;
        if (target.closest('.opp-note-edit')) {
            e.preventDefault();
            const noteEditBtn = target.closest('.opp-note-edit') as HTMLButtonElement;
            const noteId = noteEditBtn.dataset.id as string;

            if (window.opportunityNoteModalComponent && noteId) {
                window.opportunityNoteModalComponent.editNote(noteId);
            }
        }
    });

    // Delete button
    document.addEventListener('click', async function (e: Event) {
        const target = e.target as HTMLElement;
        const deleteBtn = target.closest('.opp-note-delete') as HTMLButtonElement;

        if (deleteBtn) {
            e.preventDefault();
            const noteId = deleteBtn.dataset.id;
            if (!noteId) return;

            const confirmed = confirm('Are you sure you want to delete this note?');
            if (!confirmed) return;

            try {
                const response = await fetch(`/opportunity-notes/${noteId}`, {
                    method: 'DELETE',
                });

                const data = await response.json();

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    opportunityNoteTable.ajax.reload();
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

export function opportunityNoteModal() {
    const form = document.getElementById('opportunity-note-form') as HTMLFormElement;

    return {
        open: false,
        isEditing: false,

        // Save note
        async submitForm() {
            const formValues = {
                note_id: (form.elements.namedItem('note_id') as HTMLInputElement).value,
                title: (form.elements.namedItem('title') as HTMLInputElement).value,
                content: (form.elements.namedItem('content') as HTMLInputElement).value,
                next_action: (form.elements.namedItem('next_action') as HTMLInputElement).value,
                notified_at: (form.elements.namedItem('notified_at') as HTMLInputElement).value,
            };

            this.isEditing = !!formValues.note_id;

            const ENDPOINT = '/opportunity-notes';

            try {
                const response = this.isEditing
                    ? await axios.put(`${ENDPOINT}/${formValues.note_id}`, formValues)
                    : await axios.post(ENDPOINT, {
                          ...formValues,
                          opportunity_id: sheetID,
                      });

                const data = response.data;

                if (data.success) {
                    showFlashMessage(data.message, data.success);
                    opportunityNoteTable.ajax.reload();
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
                const response = await fetch(`/opportunity-notes/${noteId}`, {
                    headers: { Accept: 'application/json' },
                });
                const data: OpportunityNote = await response.json();

                if (data) {
                    (form.elements.namedItem('title') as HTMLInputElement).value = data.title ?? '';
                    (form.elements.namedItem('content') as HTMLInputElement).value = data.content ?? '';
                    (form.elements.namedItem('next_action') as HTMLInputElement).value = data.next_action ?? '';
                    (form.elements.namedItem('note_id') as HTMLInputElement).value = data.id ?? '';

                    const notifiedAtInput = document.getElementById('notified_at') as HTMLInputElement & {
                        _flatpickr?: FlatpickrInstance;
                    };

                    if (notifiedAtInput._flatpickr && data.notified_at) {
                        notifiedAtInput._flatpickr.setDate(data.notified_at.date);
                    }

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
