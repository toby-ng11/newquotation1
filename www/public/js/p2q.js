/* global $ */

import { initTables } from "./modules/tables.js";
import { initItem } from "./modules/item.js";
import { initNote } from "./modules/note.js";
import { initFlatpickr, runFadeInAnimation } from "./modules/utils.js";
import { initProject } from "./modules/project.js";
import { initQuote, $dialogMakeQuote } from "./modules/quote.js";

document.body.addEventListener('htmx:afterSwap', function (e) {
  // only re-init if content is replaced in #content or similar
  if (e.target.id === 'content') {
    initTables();
    setTimeout(runFadeInAnimation, 50);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  initTables();
  initFlatpickr();
  initItem();
  initNote();
  initProject();
  initQuote();
  runFadeInAnimation();

  // Make quote from table
  const params = new URLSearchParams(window.location.search);
  const dialogToOpen = params.get("open");

  if (dialogToOpen === "make-quote") {
    $dialogMakeQuote.dialog("open");
  }

  document.querySelectorAll('.top-level-entry').forEach(link => {
    link.addEventListener('click', function () {
      document.querySelectorAll('.top-level-entry').forEach(el => el.classList.remove('active'));
      this.classList.add('active');
    });
  });
});
