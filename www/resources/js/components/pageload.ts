import { getState } from "@/components/state";

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
