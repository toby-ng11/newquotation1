import { DataTableColumnHeader } from '@/components/table-header';
import { DataTablePagination } from '@/components/table-pagination';
import { DataTableLoadingSpinner } from '@/components/table-spinner';
import { DataTableToolbar } from '@/components/table-toolbar';
import { DataTableProjectOptions } from '@/components/table/project-options';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTanStackQuery } from '@/hooks/use-query';
import { Opportunity, Quote } from '@/types';
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


const multiValueFilter: FilterFn<Quote> = (row, columnId, filterValue) => {
    if (!Array.isArray(filterValue)) return true;
    const rowValue = row.getValue(columnId);
    return filterValue.includes(rowValue);
};

export default function SharedQuotesTable() {
    const ENDPOINT = '/dashboards/quote/shared';
    const qKey = ['quote-dash', 'shared'];
    const columnVisibilityPref = '/api/preferences/quote-shared-table-column-visibility';

    const { data: quotes = [], isLoading, isRefetching, refetch } = useTanStackQuery<Quote>(ENDPOINT, qKey);

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
                    <a href={`/quote/${id}/edit`} className="text-blue-500 dark:text-blue-300">
                        {id}
                    </a>
                );
            },
            enableHiding: false,
            meta: 'ID',
        },
        {
            accessorKey: 'project_id',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Project ID" />,
            cell: ({ row }) => {
                const id = row.getValue<number>('project_id');
                return (
                    <a href={`/project/${id}/edit`} className="text-blue-500 dark:text-blue-300">
                        {id}
                    </a>
                );
            },
            meta: 'ID',
        },
        {
            accessorKey: 'project_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => <div className="max-w-[300px] min-w-[300px] truncate">{row.getValue('project_name')}</div>,
            meta: 'Name',
        },
        {
            accessorKey: 'created_by',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Taker" />,
            filterFn: 'arrIncludesSome',
            meta: 'Taker',
        },
        {
            accessorKey: 'shared_user',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Share With" />,
            filterFn: 'arrIncludesSome',
            meta: 'Share With',
        },
        {
            accessorKey: 'price_approve_id',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Price Approve" />,
            filterFn: 'arrIncludesSome',
            meta: 'Price Approve',
        },
        {
            accessorKey: 'status_desc',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
            filterFn: 'arrIncludesSome',
            meta: 'Status',
        },
        {
            accessorKey: 'architect_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Architect" />,
            cell: ({ row }) => <div className="max-w-[300px] truncate font-medium">{row.getValue('architect_name')}</div>,
            filterFn: 'arrIncludesSome',
            meta: 'Architect',
        },
        {
            accessorKey: 'customer_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
            cell: ({ row }) => <div className="max-w-[300px] truncate font-medium">{row.getValue('customer_name')}</div>,
            filterFn: 'arrIncludesSome',
            meta: 'Customer',
        },
        {
            accessorKey: 'contact_full_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
            cell: ({ row }) => <div className="max-w-[300px] truncate font-medium">{row.getValue('contact_full_name')}</div>,
            filterFn: 'arrIncludesSome',
            meta: 'Contact',
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
        data: quotes,
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
                    <h2 className="text-2xl font-semibold tracking-tight">Shared Quotes</h2>
                    <p className="text-muted-foreground">Here's the list of quotes that is shared with you.</p>
                </div>
                <div className="flex flex-col gap-4">
                    {!isLoading ? (
                        <>
                            <DataTableToolbar
                                table={table}
                                searchColumn="project_name"
                                searchPlaceholder="Filter project names..."
                                facetedFilters={[
                                    { columnId: 'created_by', title: 'Created By' },
                                    { columnId: 'price_approve_id', title: 'Price Approve' },
                                    { columnId: 'status_desc', title: 'Status' },
                                    { columnId: 'architect_name', title: 'Architect' },
                                    { columnId: 'customer_name', title: 'Customer' },
                                    { columnId: 'contact_full_name', title: 'Contact' },
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
