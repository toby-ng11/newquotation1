import { showFlashMessage } from "./flashmessage";
import { getState, setState, subscribe } from "./state";

window.onbeforeunload = function () {
  const { unsave, lastChanged } = getState();

  if (unsave) {
    // Focus the relevant save button
    if (lastChanged === "project") {
      document.getElementById("form-btn-save-project")?.focus();
    }
    if (lastChanged === "quote") {
      document.getElementById("form-btn-save-quote")?.focus();
    }

    return "You have unsaved changes. Do you want to leave this page?";
  }
};

// Optional: react to state changes in real time
subscribe((state) => {
  console.log("State changed:", state);
});

export function initAutoSave(formElement, saveCallback, delay = 5000) {
  if (!formElement || typeof saveCallback !== "function") return;

  let autoSaveTimer;

  formElement.addEventListener("input", () => {
    setState({ unsave: true });

    if (autoSaveTimer) clearTimeout(autoSaveTimer);

    autoSaveTimer = setTimeout(() => {
      showFlashMessage("Auto-saving changes...", true);
      saveCallback();
    }, delay);
  });
}
