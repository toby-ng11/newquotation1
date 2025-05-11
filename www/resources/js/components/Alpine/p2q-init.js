import Alpine from 'alpinejs';
import { navUnderline } from "./ui/nav-underline.js";
import { loadingState } from "./lib/loading-state.js";
import { projectModal } from "./modal/ProjectModal.js";
import { noteModal } from "./modal/NoteModal.js";

export function initAlpine() {
  window.Alpine = Alpine;

  document.addEventListener("alpine:init", () => {
    Alpine.data("navUnderline", navUnderline);
    Alpine.data("loadingState", loadingState);
    Alpine.data("projectModal", projectModal);
    Alpine.data("noteModal", noteModal);
  });

  Alpine.start();
}
