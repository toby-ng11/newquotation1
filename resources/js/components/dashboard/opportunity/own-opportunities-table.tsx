import { DataTableColumnHeader } from '@/components/table-header';
import { DataTablePagination } from '@/components/table-pagination';
import { DataTableLoadingSpinner } from '@/components/table-spinner';
import { DataTableToolbar } from '@/components/table-toolbar';
import { DataTableProjectOptions } from '@/components/table/project-options';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTanStackQuery } from '@/hooks/use-query';
import { Opportunity } from '@/types';
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

const multiValueFilter: FilterFn<Opportunity> = (row, columnId, filterValue) => {
    if (!Array.isArray(filterValue)) return true;
    const rowValue = row.getValue(columnId);
    return filterValue.includes(rowValue);
};

export default function OwnOpportunitiesTable() {
    const ENDPOINT = '/dashboards/opportunity/opportunities';
    const qKey = ['opportunity-dash', 'own'];
    const columnVisibilityPref = '/api/preferences/opp-dash-own-table-column-visibility';

    const { data: opportunities = [], isLoading, isRefetching, refetch } = useTanStackQuery<Opportunity>(ENDPOINT, qKey);

    const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [isReady, setIsReady] = useState(false);
    const lastSavedVisibility = useRef<VisibilityState>({});

    // Restore saved visibility
    useEffect(() => {
        axios.get(columnVisibilityPref).then((res) => {
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
            axios.post(columnVisibilityPref, {
                value: columnVisibility,
            });
            lastSavedVisibility.current = columnVisibility;
        }
    }, [columnVisibility, isReady]);

    const columns: ColumnDef<Opportunity>[] = [
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
            accessorKey: 'id',
            header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
            cell: ({ row }) => {
                const id = row.getValue<number>('id');
                return (
                    <a href={`/opportunities/${id}/edit`} className="text-blue-500 dark:text-blue-300">
                        {id}
                    </a>
                );
            },
            enableHiding: false,
            meta: 'ID',
        },
        {
            accessorKey: 'opp_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => <div className="max-w-[300px] min-w-[300px] truncate">{row.getValue('opp_name')}</div>,
            meta: 'Name',
        },
        {
            accessorKey: 'created_by',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created By" />,
            filterFn: 'arrIncludesSome',
            meta: 'Created By',
        },
        {
            accessorKey: 'shared_users',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Shared" />,
            filterFn: 'arrIncludesSome',
            meta: 'Shared',
        },
        {
            accessorKey: 'reed',
            header: ({ column }) => <DataTableColumnHeader column={column} title="REED" />,
            filterFn: 'arrIncludesSome',
            meta: 'REED',
        },
        {
            id: 'created_at',
            accessorFn: (row) => row.created_at?.date ?? null,
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created At" />,
            cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }),
            sortingFn: 'datetime',
            meta: 'Created At',
        },
        {
            id: 'start_date',
            accessorFn: (row) => row.start_date?.date ?? null,
            header: ({ column }) => <DataTableColumnHeader column={column} title="Start Date" />,
            cell: ({ row }) => {
                const value = row.getValue<string | null>('start_date');
                if (!value) return '';
                return new Date(value).toLocaleDateString('en-CA', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                });
            },
            sortingFn: 'datetime',
            meta: 'Start Date',
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
            header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
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
                const projectId = row.original.id; // adjust based on your data shape

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
        data: opportunities,
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
                    <h2 className="text-2xl font-semibold tracking-tight">All Opportunities</h2>
                    <p className="text-muted-foreground">Here's the list of all your opportunities.</p>
                </div>
                <div className="flex flex-col gap-4">
                    {!isLoading ? (
                        <>
                            <DataTableToolbar
                                table={table}
                                searchColumn="opp_name"
                                searchPlaceholder="Filter project names..."
                                facetedFilters={[
                                    { columnId: 'created_by', title: 'Created By' },
                                    { columnId: 'shared_users', title: 'Shared With' },
                                    { columnId: 'reed', title: 'REED' },
                                    { columnId: 'architect_name', title: 'Architect' },
                                    { columnId: 'market_segment_desc', title: 'Category' },
                                    { columnId: 'status_desc', title: 'Status' },
                                ]}
                            />

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
                                                    No data found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                            <DataTablePagination table={table} />
                        </>
                    ) : (
                        <DataTableLoadingSpinner />
                    )}

                    {isRefetching && (
                        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-white/70 backdrop-blur-sm transition-opacity">
                            <span className="h-6 w-6 animate-spin rounded-full border-2 border-gray-500 border-t-transparent" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
