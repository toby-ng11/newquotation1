import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

const roots = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>();
const queryClient = new QueryClient();

declare global {
    interface Window {
        __TANSTACK_QUERY_CLIENT__: import('@tanstack/query-core').QueryClient;
    }
}

const mounts = [
    { id: 'project-table', loader: () => import('@/components/table/admin/project-table') },
    { id: 'project-own-projects-table', loader: () => import('@/components/table/project/own-projects') },
    { id: 'quoted-item-dashboard', loader: () => import('@/pages/quoted-item/dashboard') },
    { id: 'opportunity-temp', loader: () => import('@/pages/dashboards/opportunity-temp') },
    { id: 'quotes-temp', loader: () => import('@/pages/dashboards/quotes-temp') },
    { id: 'opportunity-edit-temp', loader: () => import('@/pages/opportunities/edit') },
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
                    <QueryClientProvider client={queryClient}>
                        <Component />
                    </QueryClientProvider>,
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
