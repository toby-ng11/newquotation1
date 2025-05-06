import { initTables } from "./modules/tables";
import { initItem } from "./modules/item";
import { initNote } from "./modules/note";
import { initFlatpickr, runFadeInAnimation } from "./modules/utils";
import { initProject } from "./modules/project";
import { initQuote, $dialogMakeQuote } from "./modules/quote";
import { initSearchBox } from "./api/searchbox";
import { scrollOffset } from "./modules/scroll-offset";
import { initArchitect } from "./modules/architect";

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
