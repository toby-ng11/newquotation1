<template>
  <div v-if="isOpen" class="fixed inset-0 z-999 flex items-center justify-center bg-black/60">
    <div
      class="relative flex max-h-[90vh] w-full max-w-[1000px] translate-y-0 animate-[floatIn_0.4s_ease-out] flex-col rounded-2xl bg-[var(--widget-background-primary)] p-8 shadow-[0_10px_25px_rgba(0,0,0,0.2)] backdrop-blur-md transition-transform"
    >
      <h2 class="mb-4">Create Architect</h2>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div class="line"></div>
        <div class="mt-4 mb-4 flex justify-between gap-8">
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
        <div class="line"></div>
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
