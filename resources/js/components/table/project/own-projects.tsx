import { DataTableColumnHeader } from '@/components/table-header';
import { DataTablePagination } from '@/components/table-pagination';
import { DataTableLoadingSpinner } from '@/components/table-spinner';
import { DataTableToolbar } from '@/components/table-toolbar';
import { DataTableProjectOptions } from '@/components/table/project-options';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useProjects } from '@/hooks/project-own-projects-table';
import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
    VisibilityState,
} from '@tanstack/react-table';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';

interface Project {
    project_id: string;
    project_id_ext: string;
    project_name: string;
    owner_id: string;
    shared_id: string;
    reed: string;
    created_at: {
        date: string;
    };
    due_date: {
        date: string;
    };
    architect_name: string;
    market_segment_desc: string;
    status_desc: string;
}

const multiValueFilter: FilterFn<Project> = (row, columnId, filterValue) => {
    if (!Array.isArray(filterValue)) return true;
    const rowValue = row.getValue(columnId);
    return filterValue.includes(rowValue);
};

export default function OwnProjectTable() {
    const { data: projects = [], isLoading, refetch } = useProjects(true);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'project_id', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [isReady, setIsReady] = useState(false);
    const lastSavedVisibility = useRef<VisibilityState>({});

    // Restore saved visibility
    useEffect(() => {
        axios.get('/lapi/preferences/projectTableColumnVisibility').then((res) => {
            setColumnVisibility(res.data || {});
            lastSavedVisibility.current = res.data;
            setIsReady(true);
        });
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const current = JSON.stringify(columnVisibility);
        const previous = JSON.stringify(lastSavedVisibility.current);

        if (current !== previous) {
            axios.post('/lapi/preferences/projectTableColumnVisibility', {
                value: columnVisibility,
            });
            lastSavedVisibility.current = columnVisibility;
        }
    }, [columnVisibility, isReady]);

    const columns: ColumnDef<Project>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <div className="flex items-center justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex items-center justify-center">
                    <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: 'project_id',
            header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
            cell: ({ row }) => (
                <a href={'/project/' + row.getValue('project_id') + '/edit'} className="text-blue-500 dark:text-blue-300">
                    {row.getValue('project_id')}
                </a>
            ),
            enableHiding: false,
            meta: 'ID',
        },
        {
            header: ({ column }) => <DataTableColumnHeader column={column} title="Ext. ID" />,
            accessorKey: 'project_id_ext',
            meta: 'Ext. ID',
        },
        {
            accessorKey: 'project_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => <div className="max-w-[300px] min-w-[300px] truncate">{row.getValue('project_name')}</div>,
            meta: 'Name',
        },
        {
            accessorKey: 'owner_id',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Owner" />,
            filterFn: 'arrIncludesSome',
            meta: 'Owner',
        },
        {
            accessorKey: 'shared_id',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Shared" />,
            filterFn: 'arrIncludesSome',
            meta: 'Shared',
        },
        {
            accessorKey: 'quote_count',
            header: ({ column }) => <DataTableColumnHeader column={column} title="No. of Quotes" />,
            filterFn: 'arrIncludesSome',
            meta: 'No. of Quotes',
        },
        {
            accessorKey: 'reed',
            header: ({ column }) => <DataTableColumnHeader column={column} title="REED" />,
            filterFn: 'arrIncludesSome',
            meta: 'REED',
        },
        {
            id: 'created_at',
            accessorFn: (row) => row.created_at?.date,
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
            cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }),
            sortingFn: 'datetime',
            meta: 'Created At',
        },
        {
            id: 'due_date',
            accessorFn: (row) => row.due_date?.date,
            header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
            cell: ({ row }) => new Date(row.getValue('due_date')).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }),
            sortingFn: 'datetime',
            meta: 'Due Date',
        },
        {
            accessorKey: 'architect_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Architect" />,
            cell: ({ row }) => <div className="max-w-[300px] truncate font-medium">{row.getValue('architect_name')}</div>,
            filterFn: 'arrIncludesSome',
            meta: 'Architect',
        },
        {
            accessorKey: 'market_segment_desc',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Market Segment" />,
            filterFn: 'arrIncludesSome',
            meta: 'Market Segment',
        },
        {
            accessorKey: 'status_desc',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            filterFn: 'arrIncludesSome',
            meta: 'Status',
        },
        {
            accessorKey: 'options',
            header: () => null,
            cell: ({ row }) => {
                const projectId = row.original.project_id; // adjust based on your data shape

                return (
                    <DataTableProjectOptions
                        rowId={projectId}
                        onEdit={(id) => console.log('Edit', id)}
                        onCopy={(id) => console.log('Copy', id)}
                        onFavorite={(id) => console.log('Favorite', id)}
                        onDelete={() => refetch()}
                    />
                );
            },
            enableHiding: false,
        },
    ];

    const table = useReactTable({
        data: projects,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
        filterFns: {
            multi: multiValueFilter,
        },
    });

    return (
        <div>
            <div className="widget-table bg-widget-background flex flex-1 flex-col gap-4 rounded-xl p-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">All Projects</h2>
                    <p className="text-muted-foreground">Here's the list of all projects across all branches.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <DataTableToolbar
                        table={table}
                        searchColumn="project_name"
                        searchPlaceholder="Filter project names..."
                        showAddButton
                        onAddClick={() => console.log('Add clicked')}
                        facetedFilters={[
                            { columnId: 'owner_id', title: 'Owner' },
                            { columnId: 'shared_id', title: 'Shared' },
                            { columnId: 'reed', title: 'REED' },
                            { columnId: 'architect_name', title: 'Architect' },
                            { columnId: 'market_segment_desc', title: 'Market Segment' },
                            { columnId: 'status_desc', title: 'Status' },
                        ]}
                    />

                    {!isLoading ? (
                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader className="bg-muted sticky top-0 z-10 [&_tr]:border-b">
                                    {table.getHeaderGroups().map((headerGroup) => (
                                        <TableRow key={headerGroup.id}>
                                            {headerGroup.headers.map((header) => {
                                                return (
                                                    <TableHead key={header.id} colSpan={header.colSpan}>
                                                        {header.isPlaceholder
                                                            ? null
                                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                                    </TableHead>
                                                );
                                            })}
                                        </TableRow>
                                    ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows?.length ? (
                                        table.getRowModel().rows.map((row) => (
                                            <TableRow key={row.id}>
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="p-2 text-left whitespace-nowrap">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                                No projects found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <DataTableLoadingSpinner />
                    )}
                </div>

                <DataTablePagination table={table} />
            </div>
        </div>
    );
}
