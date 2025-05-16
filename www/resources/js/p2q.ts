import '../css/app.css';

import { InitTheme } from "@/components/ui/theme/Theme";
import { initAlpine } from "@/components/Alpine/p2q-init";
import { initFlatpickr } from "@/components/ui/calendar/flatpickr";
import { initTables } from "@/components/ui/table/tables";
import { runFadeInAnimation } from "@/components/FadeInAnimation";
import { initSearchBox } from "@/components/ui/searchbox/searchbox";
import { scrollOffset } from "@/components/scroll-offset";
import { initItem } from "@/pages/item";
import { initProject } from "@/pages/project";
import { initQuote, $dialogMakeQuote } from "@/pages/quote";
import { initArchitect } from "@/pages/architect";
import { initCharts } from "@/components/ui/chart/chart";
import { initUserMenu } from "@/components/ui/NavUser";
import { showLoadedFlashMessage } from "@/components/flashmessage";
import { initNote } from "@/components/Alpine/modal/NoteModal";
import { initSidebarToggle } from "@/components/SideBar";

initAlpine();

document.addEventListener("DOMContentLoaded", () => {
  InitTheme();
  initSidebarToggle();
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

document.body.addEventListener("htmx:afterSwap", function (e: Event) {
  const target = e.target as HTMLElement;
  // only re-init if content is replaced in #content or similar
  scrollOffset();
  if (target.querySelector("#options-button")) {
    initSidebarToggle();
  }
  if (
    target.querySelector("#search-overlay") ||
    target.querySelector(".search-architect-button")
  ) {
    initSearchBox();
  }
  if (target.id === "content") {
    setTimeout(runFadeInAnimation, 50);
  }
  if (target.querySelector(".sTable")) {
    initTables();
  }
  if (target.querySelector(".chart")) {
    initCharts();
  }
});
