/* global $ */

import { initTables } from "./modules/tables.js";
import { initItem } from "./modules/item.js";
import { initNote } from "./modules/note.js";
import { initFlatpickr } from "./modules/utils.js";
import { initProject } from "./modules/project.js";
import { initQuote, $dialogMakeQuote } from "./modules/quote.js";

document.addEventListener("DOMContentLoaded", () => {
  initTables();
  initFlatpickr();
  initItem();
  initNote();
  initProject();
  initQuote();

  // Make quote from table
  const params = new URLSearchParams(window.location.search);
  const dialogToOpen = params.get("open");

  if (dialogToOpen === "make-quote") {
    $dialogMakeQuote.dialog("open");
  }
});
