import Alpine from "https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/module.esm.js";
import { navUnderline } from "./api/nav-underline.js";
import { loadingState } from "./api/loading-state.js";
import { projectModal } from "./modules/architect.js";

window.Alpine = Alpine;

document.addEventListener("alpine:init", () => {
  Alpine.data("navUnderline", navUnderline);
  Alpine.data("loadingState", loadingState);
  Alpine.data("projectModal", projectModal);
});

Alpine.start();
