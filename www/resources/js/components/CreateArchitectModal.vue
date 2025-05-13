<template>
    <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-md space-y-4">
            <h2 class="text-xl font-semibold">Create Architect</h2>
            <form @submit.prevent="submitForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium">Name</label>
                    <input v-model="form.name" type="text" class="w-full mt-1 p-2 border rounded" required />
                </div>
                <div>
                    <label class="block text-sm font-medium">Type</label>
                    <input v-model="form.type" type="text" class="w-full mt-1 p-2 border rounded" />
                </div>
                <div>
                    <label class="block text-sm font-medium">Class</label>
                    <input v-model="form.class" type="text" class="w-full mt-1 p-2 border rounded" />
                </div>
                <div class="flex justify-end gap-2">
                    <button type="button" @click="close"
                        class="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded">Cancel</button>
                    <button type="submit"
                        class="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded">Create</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const isOpen = ref(false);
const form = ref({
    name: '',
    type: '',
    class: '',
});

function open() {
    isOpen.value = true;
}

function close() {
    isOpen.value = false;
}

function submitForm() {
    console.log('Form Submitted:', form.value);
    close();
}

// Expose open() to window so it can be triggered externally
(window as any).openCreateArchitectModal = open;
</script>
