import { initTables } from "./modules/tables.js";
import { initItem } from "./modules/item.js";
import { initNote } from "./modules/note.js";
import { initFlatpickr, runFadeInAnimation } from "./modules/utils.js";
import { initProject } from "./modules/project.js";
import { initQuote, $dialogMakeQuote } from "./modules/quote.js";
import { initSearchBox } from "./api/searchbox.js";
import { scrollOffset } from "./modules/scroll-offset.js";
import { initArchitect } from "./modules/architect.js";

document.addEventListener("DOMContentLoaded", () => {
  scrollOffset();
  initSearchBox();
  initTables();
  initFlatpickr();
  initItem();
  initNote();
  initProject();
  initQuote();
  initArchitect();
  runFadeInAnimation();

  // Make quote from table
  const params = new URLSearchParams(window.location.search);
  const dialogToOpen = params.get("open");

  if (dialogToOpen === "make-quote") {
    $dialogMakeQuote.dialog("open");
  }

  document.querySelectorAll(".top-level-entry").forEach((link) => {
    link.addEventListener("click", function () {
      document
        .querySelectorAll(".top-level-entry")
        .forEach((el) => el.classList.remove("active"));
      this.classList.add("active");
    });
  });
});

document.body.addEventListener("htmx:afterSwap", function (e) {
  // only re-init if content is replaced in #content or similar
  scrollOffset();
  if (
    e.target.querySelector("#search-overlay") ||
    e.target.querySelector(".search-architect-button")
  ) {
    initSearchBox();
  }
  if (e.target.id === "content") {
    initTables();
    setTimeout(runFadeInAnimation, 50);
  }
});
