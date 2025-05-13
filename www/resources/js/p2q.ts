import { InitTheme } from "./components/ui/theme/Theme";
import { initAlpine } from "./components/Alpine/p2q-init";
import { initFlatpickr } from "./components/ui/calendar/flatpickr";
import { initTables } from "./components/ui/table/tables";
import { runFadeInAnimation } from "./components/FadeInAnimation";
import { initSearchBox } from "./components/ui/searchbox/searchbox";
import { scrollOffset } from "./components/scroll-offset";
import { initItem } from "./pages/item";
import { initProject } from "./pages/project";
import { initQuote, $dialogMakeQuote } from "./pages/quote";
import { initArchitect } from "./pages/architect";
import { initCharts } from "./components/ui/chart/chart";
import { initUserMenu } from "./components/ui/NavUser";
import { showLoadedFlashMessage } from "./components/flashmessage";
import { initNote } from "./components/Alpine/modal/NoteModal";



initAlpine();

document.addEventListener("DOMContentLoaded", () => {
  InitTheme();
  showLoadedFlashMessage();
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