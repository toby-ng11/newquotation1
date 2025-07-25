import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';

const roots = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>();
const queryClient = new QueryClient();

const mounts = [
    { id: 'project-table', loader: () => import('@/components/table/admin/project-table') },
    { id: 'project-own-projects-table', loader: () => import('@/components/table/project/own-projects') },
    { id: 'quotes-dash-quote-table', loader: () => import('@/components/table/quotes/quote-table') },
];

function mountAllTables() {
    mounts.forEach(({ id, loader }) => {
        const container = document.getElementById(id);
        if (container && !roots.has(container)) {
            const root = createRoot(container);
            roots.set(container, root);

            loader().then((module) => {
                const Component = module.default;
                root.render(
                    <React.Suspense fallback={<div>Loading table...</div>}>
                        <QueryClientProvider client={queryClient}>
                            <Component />
                        </QueryClientProvider>
                    </React.Suspense>,
                );
            });
        }
    });
}

function unmountAllTables() {
    mounts.forEach(({ id }) => {
        const container = document.getElementById(id);
        const root = container ? roots.get(container) : undefined;
        if (root) {
            root.unmount();
            roots.delete(container!);
        }
    });
}

export { mountAllTables, unmountAllTables };
