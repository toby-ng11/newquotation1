import '../css/app.css';

import { FloatingThemeProvider } from '@/components/theme-floating-provider';
import { initializeTheme, ThemeProvider } from '@/hooks/use-appearance';
import { createInertiaApp } from '@inertiajs/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

const queryClient = new QueryClient();

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
                    <QueryClientProvider client={queryClient}>
                        <App {...props} />
                        <Toaster richColors position="top-right" />
                    </QueryClientProvider>
                </FloatingThemeProvider>
            </ThemeProvider>,
        );
    },
});

initializeTheme();
