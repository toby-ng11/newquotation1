import { createIcons, Ellipsis, ExternalLink, FilePlus2, Plus, Printer, Trash2 } from 'lucide';

function initLucide() {
    createIcons({
        icons: {
            Printer,
            ExternalLink,
            FilePlus2,
            Ellipsis,
            Trash2,
            Plus
        },
    });
}

export { initLucide };
