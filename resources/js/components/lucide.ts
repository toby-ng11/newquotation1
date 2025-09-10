import { ChevronDown, createIcons, Ellipsis, ExternalLink, FilePlus2, Info, Pencil, Plus, Printer, Search, Trash2 } from 'lucide';

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
            Pencil,
            ChevronDown,
        },
    });
}

export { initLucide };
