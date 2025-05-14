<template>
  <div v-if="isOpen" class="fixed inset-0 z-999 flex items-center justify-center bg-black/60">
    <div class="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl dark:bg-gray-800">
      <h2 class="text-xl font-semibold">Create Architect</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Name</label>
          <input v-model="form.name" type="text" class="mt-1 w-full rounded border p-2" required />
        </div>
        <div>
          <label class="block text-sm font-medium">Type</label>
          <input v-model="form.type" type="text" class="mt-1 w-full rounded border p-2" />
        </div>
        <div>
          <label class="block text-sm font-medium">Class</label>
          <input v-model="form.class" type="text" class="mt-1 w-full rounded border p-2" />
        </div>
        <div class="flex justify-end gap-2">
          <button type="button" @click="close" class="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">Cancel</button>
          <button type="submit" class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">Create</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const isOpen = ref(false);
const form = ref({
  name: "",
  type: "",
  class: "",
});

function open() {
  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function submitForm() {
  console.log("Form Submitted:", form.value);
  close();
}

// Expose open() to window so it can be triggered externally
(window as any).openCreateArchitectModal = open;
</script>
