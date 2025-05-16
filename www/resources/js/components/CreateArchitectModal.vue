<script setup lang="ts">
import { ref } from 'vue';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const isOpen = ref(false);
const form = ref({
    name: '',
    type: '',
    class: '',
});

function close() {
    isOpen.value = false;
}

function open() {
    isOpen.value = true;
}

function submitForm() {
    console.log('Form Submitted:', form.value);
    close();
}

// Expose open() to window so it can be triggered externally
(window as any).openCreateArchitectModal = open;
</script>

<template>
    <Dialog v-model:open="isOpen">
        <DialogContent>
            <form @submit.prevent="submitForm" class="space-y-4">
                <DialogHeader class="space-y-3">
                    <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                    <DialogDescription>
                        Once your account is deleted, all of its resources and data will also be permanently deleted. Please enter your password to
                        confirm you would like to permanently delete your account.
                    </DialogDescription>
                </DialogHeader>

                <div class="line mt-4 mb-4"></div>

                <div class="flex gap-8">
                    <div class="flex-auto">
                        <label class="block text-sm font-medium">Name</label>
                        <input v-model="form.name" type="text" class="mt-1 w-full rounded border p-2" required />
                    </div>
                    <div class="flex-auto">
                        <label class="block text-sm font-medium">Type</label>
                        <input v-model="form.type" type="text" class="mt-1 w-full rounded border p-2" />
                    </div>
                    <div class="flex-auto">
                        <label class="block text-sm font-medium">Class</label>
                        <input v-model="form.class" type="text" class="mt-1 w-full rounded border p-2" />
                    </div>
                </div>

                <div class="line mt-4 mb-4"></div>

                <div class="flex justify-end gap-2">
                    <DialogClose as-child>
                        <button type="button" class="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">Cancel</button>
                    </DialogClose>
                    <button type="submit" class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create</button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>
