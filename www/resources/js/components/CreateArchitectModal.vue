<script setup lang="ts">
import { AnimatePresence, Motion } from 'motion-v';
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle } from 'reka-ui';
import { ref } from 'vue';

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
    <!-- Trigger button (optional) -->
    <DialogRoot v-model:open="isOpen">
        <DialogPortal>
            <AnimatePresence multiple>
                <DialogOverlay as-child class="fixed inset-0 z-[999] bg-black/60 backdrop-blur-md">
                    <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" />
                </DialogOverlay>
                <DialogContent
                    class="fixed top-1/2 left-1/2 z-[1000] max-h-[90vh] w-full max-w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-[var(--widget-background-primary)] p-8 shadow-[0_10px_25px_rgba(0,0,0,0.2)] backdrop-blur-md"
                    asChild
                >
                    <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }"></Motion>
                    <DialogTitle class="text-[2rem] font-semibold">Create Architect</DialogTitle>

                    <div class="line mt-4 mb-4"></div>

                    <form @submit.prevent="submitForm" class="space-y-4">
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
            </AnimatePresence>
        </DialogPortal>
    </DialogRoot>
</template>
