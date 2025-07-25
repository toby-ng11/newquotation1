import { DataTableColumnHeader } from '@/components/table-header';
import { DataTablePagination } from '@/components/table-pagination';
import { DataTableLoadingSpinner } from '@/components/table-spinner';
import { DataTableToolbar } from '@/components/table-toolbar';
import { DataTableProjectOptions } from '@/components/table/project-options';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useQuotesQuote } from '@/hooks/quotes-dash-quote-table';
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

export interface Quote {
    id: string;
    project_id: string;
    project_name: string;
    customer_name: string;
    contact_full_name: string;
    quote_status: string;
    created_by: string;
    created_at: { date: string };
    expire_date: { date: string };
    ship_required_date: { date: string };
}

const multiValueFilter: FilterFn<Quote> = (row, columnId, filterValue) => {
    if (!Array.isArray(filterValue)) return true;
    const rowValue = row.getValue(columnId);
    return filterValue.includes(rowValue);
};

export default function QuotesQuoteTable() {
    const { data: projects = [], isLoading, refetch } = useQuotesQuote(true);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [isReady, setIsReady] = useState(false);
    const lastSavedVisibility = useRef<VisibilityState>({});

    // Restore saved visibility
    useEffect(() => {
        axios.get('/lapi/preferences/quotesQuoteTableColumnVisibility').then((res) => {
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
            axios.post('/lapi/preferences/quotesQuoteTableColumnVisibility', {
                value: columnVisibility,
            });
            lastSavedVisibility.current = columnVisibility;
        }
    }, [columnVisibility, isReady]);

    const columns: ColumnDef<Quote>[] = [
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
            header: ({ column }) => <DataTableColumnHeader column={column} title="Project ID" />,
            accessorKey: 'project_id',
            meta: 'Project ID',
        },
        {
            accessorKey: 'project_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
            cell: ({ row }) => <div className="max-w-[300px] min-w-[300px] truncate">{row.getValue('project_name')}</div>,
            meta: 'Name',
        },
        {
            accessorKey: 'customer_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
            cell: ({ row }) => <div className="max-w-[300px] min-w-[300px] truncate">{row.getValue('customer_name')}</div>,
            filterFn: 'arrIncludesSome',
            meta: 'Customer',
        },
        {
            accessorKey: 'contact_full_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Contact" />,
            filterFn: 'arrIncludesSome',
            meta: 'Contact',
        },
        {
            accessorKey: 'quote_status',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Quote Status" />,
            meta: 'Quote Status',
        },
        {
            accessorKey: 'created_by',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Created By" />,
            meta: 'Created By',
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
            id: 'expire_date',
            accessorFn: (row) => row.expire_date?.date,
            header: ({ column }) => <DataTableColumnHeader column={column} title="Expire Date" />,
            cell: ({ row }) => new Date(row.getValue('expire_date')).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }),
            sortingFn: 'datetime',
            meta: 'Expire Date',
        },
        {
            id: 'ship_required_date',
            accessorFn: (row) => row.ship_required_date?.date,
            header: ({ column }) => <DataTableColumnHeader column={column} title="Tender Closing Date" />,
            cell: ({ row }) => new Date(row.getValue('ship_required_date')).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }),
            sortingFn: 'datetime',
            meta: 'Tender Closing Date',
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
                    <h2 className="text-2xl font-semibold tracking-tight">All Quotes</h2>
                    <p className="text-muted-foreground">Here's the list of all customers and their quotes.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <DataTableToolbar
                        table={table}
                        searchColumn="project_name"
                        searchPlaceholder="Filter quote names..."
                        showAddButton
                        onAddClick={() => console.log('Add clicked')}
                        facetedFilters={[
                            { columnId: 'customer_name', title: 'Customer' },
                            { columnId: 'contact_full_name', title: 'Contact' },
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
                                                No quotes found.
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
