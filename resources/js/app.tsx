import ProjectTable from '@/components/table/admin/project-table';
import OwnProjectTable from '@/components/table/project/own-projects';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRoot } from 'react-dom/client';

const roots = new WeakMap<HTMLElement, ReturnType<typeof createRoot>>();
const queryClient = new QueryClient();

const mounts = [
    { id: 'project-table', component: ProjectTable },
    { id: 'project-own-projects-table', component: OwnProjectTable },
];

function mountAllTables() {
    mounts.forEach(({ id, component: Component }) => {
        const container = document.getElementById(id);
        if (container && !roots.has(container)) {
            const root = createRoot(container);
            roots.set(container, root);

            root.render(
                <QueryClientProvider client={queryClient}>
                    <Component />
                </QueryClientProvider>,
            );
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
