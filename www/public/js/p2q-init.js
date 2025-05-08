import Alpine from "https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js";
import { navUnderline } from "./api/nav-underline.js";
import { loadingState } from "./api/loading-state.js";
import { projectModal } from "./modules/architect.js";
import { noteModal } from "./modules/note.js";

window.Alpine = Alpine;

document.addEventListener("alpine:init", () => {
  Alpine.data("navUnderline", navUnderline);
  Alpine.data("loadingState", loadingState);
  Alpine.data("projectModal", projectModal);
  Alpine.data("noteModal", noteModal);
});

Alpine.start();
