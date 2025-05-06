import Alpine from "alpinejs";
import { navUnderline } from "./api/nav-underline";
import { loadingState } from "./api/loading-state";
import { projectModal } from "./modules/architect";

window.Alpine = Alpine;

document.addEventListener("alpine:init", () => {
  Alpine.data("navUnderline", navUnderline);
  Alpine.data("loadingState", loadingState);
  Alpine.data("projectModal", projectModal);
});

Alpine.start();
