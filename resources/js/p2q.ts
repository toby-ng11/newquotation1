import 'basecoat-css/all';
import '../css/app.css';

import { mountAllTables, unmountAllTables } from '@/tables';
import { initAddress } from '@/components/Alpine/modal/address-modal';
import { initCustomer } from '@/components/Alpine/modal/customer-modal';
import { initItem } from '@/components/Alpine/modal/item-modal';
import { initNote } from '@/components/Alpine/modal/note-modal';
import { initRoleOverride } from '@/components/Alpine/modal/role-override-modal';
import { initShare } from '@/components/Alpine/modal/share-modal';
import { initSpecifier } from '@/components/Alpine/modal/specifier-modal';
import { initAlpine } from '@/components/Alpine/p2q-init';
import { runFadeInAnimation } from '@/components/FadeInAnimation';
import { showLoadedFlashMessage } from '@/components/flashmessage';
import { initLucide } from '@/components/lucide';
import { scrollOffset } from '@/components/scroll-offset';
import { initSidebarToggle } from '@/components/SideBar';
import { initFlatpickr } from '@/components/ui/calendar/flatpickr';
import { initCharts } from '@/components/ui/chart/chart';
import { initUserMenu } from '@/components/ui/NavUser';
import { initSearchBox } from '@/components/ui/searchbox/searchbox';
import { initTables } from '@/components/ui/table/tables';
import { InitTheme } from '@/components/ui/theme/Theme';
import { initArchitect } from '@/pages/architect';
import { initArchitectForm, initProject } from '@/pages/project';
import { $dialogMakeQuote, initQuote } from '@/pages/quote';

initAlpine();

document.addEventListener('DOMContentLoaded', () => {
    InitTheme();
    initLucide();
    initSidebarToggle();
    showLoadedFlashMessage();
    initUserMenu();
    scrollOffset();
    initSearchBox();
    initTables();
    initFlatpickr();
    initRoleOverride();
    initShare();
    initItem();
    initNote();
    initCustomer();
    initProject();
    initQuote();
    initArchitectForm();
    initArchitect();
    initAddress();
    initSpecifier();
    initCharts();
    runFadeInAnimation();

    // React
    mountAllTables();

    // Make quote from table
    const params = new URLSearchParams(window.location.search);
    const dialogToOpen = params.get('open');

    if (dialogToOpen === 'make-quote') {
        $dialogMakeQuote.dialog('open');
    }

    (document.querySelectorAll('.top-level-entry') as NodeListOf<HTMLElement>).forEach((link) => {
        link.addEventListener('click', function () {
            document.querySelectorAll('.top-level-entry').forEach((el) => el.classList.remove('active'));
            this.classList.add('active');
        });
    });
});

document.body.addEventListener('htmx:beforeSwap', function (e: Event) {
    const target = (e.target as HTMLElement) || null;

    // React
    if (target?.querySelector('#project-table') || target?.id === 'project-table') {
        unmountAllTables();
    }
});

document.body.addEventListener('htmx:afterSwap', function (e: Event) {
    const target = e.target as HTMLElement;
    // only re-init if content is replaced in #content or similar
    scrollOffset();
    initLucide();
    if (target.querySelector('#options-button')) {
        initSidebarToggle();
    }
    if (target.querySelector('#search-overlay') || target.querySelector('.search-architect-button')) {
        initSearchBox();
    }
    if (target.id === 'content') {
        setTimeout(runFadeInAnimation, 50);
    }
    if (target.querySelector('.sTable:not([data-initialized])')) {
        initTables();
    }
    if (target.querySelector('.chart')) {
        initCharts();
    }

    // React
    mountAllTables();
});
