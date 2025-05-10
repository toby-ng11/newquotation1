import { InitTheme } from "./components/ui/theme/Theme.js";
import { initAlpine } from "./components/Alpine/p2q-init.js";
import { initFlatpickr } from "./components/ui/calendar/flatpickr.js";
import { initTables } from "./components/ui/table/tables.js";
import { runFadeInAnimation } from "./components/FadeInAnimation.js";
import { initSearchBox } from "./components/ui/searchbox/searchbox.js";
import { scrollOffset } from "./components/scroll-offset.js";
import { initItem } from "./pages/item.js";
import { initNote } from "./pages/note.js";
import { initProject } from "./pages/project.js";
import { initQuote, $dialogMakeQuote } from "./pages/quote.js";
import { initArchitect } from "./pages/architect.js";
import { initCharts } from "./components/ui/chart/chart.js";
import { initUserMenu } from "./components/ui/NavUser.js";

initAlpine();

document.addEventListener("DOMContentLoaded", () => {
  InitTheme();
  initUserMenu();
  scrollOffset();
  initSearchBox();
  initTables();
  initFlatpickr();
  initItem();
  initNote();
  initProject();
  initQuote();
  initArchitect();
  initCharts();
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
    initCharts();
    setTimeout(runFadeInAnimation, 50);
  }
});