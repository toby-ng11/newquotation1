import { createIcons, Ellipsis, ExternalLink, FilePlus2, Info, Plus, Printer, Search, Trash2 } from 'lucide';

function initLucide() {
    createIcons({
        icons: {
            Printer,
            ExternalLink,
            FilePlus2,
            Ellipsis,
            Trash2,
            Plus,
            Info,
            Search,
        },
    });
}

export { initLucide };
