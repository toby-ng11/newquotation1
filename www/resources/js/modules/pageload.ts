import { getState, subscribe } from "./state";

window.onbeforeunload = function () {
  const { unsave, lastChanged } = getState();

  if (unsave) {
    if (lastChanged === "project") $("#form-btn-save-project").trigger("focus");
    if (lastChanged === "quote") $("#form-btn-save-quote").trigger("focus");

    return "You have unsaved changes. Do you want to leave this page?";
  }
};

// Optional: react to state changes in real time
subscribe((state) => {
  console.log("State changed:", state);
});


