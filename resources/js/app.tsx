import '../css/app.css';

import { FloatingThemeProvider } from '@/components/theme-floating-provider';
import { initializeTheme, ThemeProvider } from '@/hooks/use-appearance';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

createInertiaApp({
    title: (title) => (title ? `${title} | P2Q` : 'P2Q'),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        return pages[`./pages/${name}.tsx`];
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <ThemeProvider>
                <FloatingThemeProvider>
                    <App {...props} />
                    <Toaster richColors position="top-right" />
                </FloatingThemeProvider>
            </ThemeProvider>,
        );
    },
});

initializeTheme();
