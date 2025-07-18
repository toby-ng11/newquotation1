import { createColumnHelper, getCoreRowModel, getPaginationRowModel, getSortedRowModel, Table } from '@tanstack/table-core';
import { ArrowDown, ArrowUp, ChevronsUpDown, createElement, LoaderCircle } from 'lucide';

type AdminProjects = {
    project_id: string;
    project_id_ext: string;
    project_name: string;
    owner_id: string;
    shared_id: string;
    created_at: {
        date: string;
    };
    due_date: {
        date: string;
    };
    architect_name: string;
    market_segment_desc: string;
    status_desc: string;
};

const columnHelper = createColumnHelper<AdminProjects>();

const columns = [
    columnHelper.accessor('project_id', {
        cell: (info) =>
            `<a href="/project/${info.getValue()}/edit" class="text-blue-500 dark:text-blue-300"><div class="text-center">${info.getValue()}</div></a>`,
        header: () => 'ID',
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor((row) => row.project_id_ext, {
        id: 'project_id_ext',
        cell: (info) => `<div class="min-w-[100px] text-center">${info.getValue()}</div>`,
        header: () => 'Ext. ID',
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('project_name', {
        header: () => 'Name',
        cell: (info) => `<div class="min-w-[300px] max-w-[300px] truncate">${info.getValue()}</div>`,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('owner_id', {
        header: () => 'Owner',
        cell: (info) => `<div class="min-w-[100px] text-center">${info.getValue() || ''}<div>`,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('shared_id', {
        header: () => `Shared`,
        cell: (info) => `<div class="min-w-[100px] text-center">${info.getValue() || ''}<div>`,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('created_at.date', {
        header: () => 'Created At',
        cell: (info) => {
            let date = new Date(info.getValue()).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
            return `<div class="min-w-[100px] text-center">${date}</div>`;
        },
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('due_date.date', {
        header: () => 'Due On',
        cell: (info) => {
            let date = new Date(info.getValue()).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' });
            return `<div class="min-w-[100px] text-center">${date}</div>`;
        },
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('architect_name', {
        header: () => 'Architect',
        cell: (info) => `<div class="min-w-[200px] max-w-[200px] truncate">${info.getValue() || '-'}</div>`,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('market_segment_desc', {
        header: () => 'Market Segment',
        cell: (info) => `<div class="max-w-[120px] truncate text-center">${info.getValue() || ''}<div>`,
        footer: (info) => info.column.id,
    }),
    columnHelper.accessor('status_desc', {
        header: () => 'Status',
        cell: (info) => `<div class="min-w-[120px] text-center">${info.getValue()}</div>`,
        footer: (info) => info.column.id,
    }),
];

function renderTable(table: Table<AdminProjects>) {
    const tableElement = document.createElement('table');
    const theadElement = document.createElement('thead');
    const tbodyElement = document.createElement('tbody');

    tableElement.appendChild(theadElement);
    tableElement.appendChild(tbodyElement);

    // Headers
    table.getHeaderGroups().forEach((headerGroup) => {
        const trElement = document.createElement('tr');
        headerGroup.headers.forEach((header) => {
            const thElement = document.createElement('th');
            thElement.colSpan = header.colSpan;
            const divElement = document.createElement('div');
            divElement.classList.add('table-header', ...(header.column.getCanSort() ? ['cursor-pointer', 'select-none'] : []));
            (divElement.onclick = (e) => header.column.getToggleSortingHandler()?.(e)),
                (divElement.innerHTML = header.isPlaceholder ? '' : flexRender(header.column.columnDef.header, header.getContext()));
            const iconElement = createElement(
                {
                    asc: ArrowUp,
                    desc: ArrowDown,
                }[header.column.getIsSorted() as string] || ChevronsUpDown,
            );
            divElement.appendChild(iconElement);
            thElement.appendChild(divElement);
            trElement.appendChild(thElement);
        });
        theadElement.appendChild(trElement);
    });

    // Rows
    table.getRowModel().rows.forEach((row) => {
        const trElement = document.createElement('tr');
        row.getVisibleCells().forEach((cell) => {
            const tdElement = document.createElement('td');
            tdElement.innerHTML = flexRender(cell.column.columnDef.cell, cell.getContext());
            trElement.appendChild(tdElement);
        });
        tbodyElement.appendChild(trElement);
    });

    // Render table state info
    const stateInfoElement = document.createElement('pre');
    stateInfoElement.textContent = JSON.stringify(
        {
            pagination: table.getState().pagination,
            sorting: table.getState().sorting,
        },
        null,
        2,
    );

    const wrapperElement = document.getElementById('project-table') as HTMLDivElement;
    if (wrapperElement) {
        wrapperElement.innerHTML = ''; // clear previous
        wrapperElement.appendChild(tableElement);
        //wrapperElement.appendChild(stateInfoElement); // for debugging
    }
}

function renderToolbar(table: Table<AdminProjects>) {
    const toolbarElement = renderTableToolbar({
        table,
        searchColumn: 'project_name',
        searchPlaceholder: 'Filter project names...',
        showAddButton: true,
        onAddClick: () => console.log('Add clicked'),
        facetedFilters: [
            { columnId: 'created_by', title: 'Owner' },
            { columnId: 'shared_id', title: 'Shared' },
            { columnId: 'architect_name', title: 'Architect' },
            { columnId: 'market_segment_desc', title: 'Market Segment' },
            { columnId: 'status_desc', title: 'Status' },
        ],
    });

    // Render pagination to a separate container
    const toolbarContainer = document.getElementById('project-toolbar') as HTMLDivElement;
    if (toolbarContainer) {
        toolbarContainer.innerHTML = ''; // clear previous
        toolbarContainer.appendChild(toolbarElement);
    }
}

function renderPagination(table: Table<AdminProjects>) {
    // Create pagination using the generic component
    const paginationElement = createPagination(table, {
        pageSizeOptions: [10, 20, 30, 40, 50],
        showPageInfo: true,
        showRowsPerPage: true,
        containerClasses: ['flex', 'items-center', 'space-x-6', 'lg:space-x-8'],
    });

    // Render pagination to a separate container
    const paginationContainer = document.getElementById('project-pagination') as HTMLDivElement;
    if (paginationContainer) {
        paginationContainer.innerHTML = ''; // clear previous
        paginationContainer.appendChild(paginationElement);
    }
}

async function initAdminProjectsTable() {
    const container = document.getElementById('project-table') as HTMLDivElement;
    if (!container) return;

    const loadingIcon = createElement(LoaderCircle);
    loadingIcon.classList.add('animate-spin');
    container.appendChild(loadingIcon);

    try {
        const res = await fetch('/index/admin/project?view=true', {
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: AdminProjects[] = await res.json();

        // 2) Create table instance
        const table = useTable<AdminProjects>({
            data,
            columns,
            initialState: {
                pagination: {
                    pageIndex: 0,
                    pageSize: 10,
                },
                sorting: [
                    {
                        id: 'project_id',
                        desc: true,
                    },
                ],
            },
            getCoreRowModel: getCoreRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            onStateChange: () => {
                renderTable(table);
                renderToolbar(table);
                renderPagination(table);
            },
        });

        // 3) Render table
        renderTable(table);
        renderToolbar(table);
        renderPagination(table);
    } catch (err) {
        container.innerHTML = `
            <div class="p-4 text-red-600 text-sm">
                Failed to load projects. Please try again later.
            </div>
        `;
        console.error(err);
    }
}

export { initAdminProjectsTable };
