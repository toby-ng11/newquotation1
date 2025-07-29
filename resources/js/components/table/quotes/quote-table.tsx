import { DataTableColumnHeader } from '@/components/table-header';
import { DataTablePagination } from '@/components/table-pagination';
import { DataTableLoadingSpinner } from '@/components/table-spinner';
import { DataTableToolbar } from '@/components/table-toolbar';
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
    id: number;
    item_code: string;
    item_desc: string;
    quantity: number;
    unit_price: number;
    unit_of_measure: string;
    total_price: number;
    project_name: string;
    customer_name: string;
    contact_full_name: string;
    quote_id: string;
    note: string;
}

const multiValueFilter: FilterFn<Quote> = (row, columnId, filterValue) => {
    if (!Array.isArray(filterValue)) return true;
    const rowValue = row.getValue(columnId);
    return filterValue.includes(rowValue);
};

export default function QuotesQuoteTable() {
    const { data: quotedItems = [], isLoading, isRefetching } = useQuotesQuote(true);
    const [sorting, setSorting] = useState<SortingState>([{ id: 'quote_id', desc: true }]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [isReady, setIsReady] = useState(false);
    const lastSavedVisibility = useRef<VisibilityState>({});
    const [globalFilter, setGlobalFilter] = useState('');

    // Restore saved visibility
    useEffect(() => {
        axios.get('/api/preferences/quotesQuoteTableColumnVisibility').then((res) => {
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
            axios.post('/api/preferences/quotesQuoteTableColumnVisibility', {
                value: columnVisibility,
            });
            lastSavedVisibility.current = columnVisibility;
        }
    }, [columnVisibility, isReady]);

    const columns: ColumnDef<Quote>[] = [
        {
            accessorKey: 'quote_id',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Quote ID" />,
            cell: ({ row }) => (
                <a className="min-w-[80px] text-blue-500 hover:underline" href={`/quote/${row.original.quote_id}/edit`}>
                    {row.original.quote_id}
                </a>
            ),
            enableHiding: false,
        },
        {
            accessorKey: 'item_code',
            header: ({ column }) => <DataTableColumnHeader column={column} title="SKU" />,
            cell: ({ row }) => <div className="min-w-[100px]">{row.getValue('item_code')}</div>,
            enableHiding: false,
        },
        {
            accessorKey: 'item_desc',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Description" />,
            cell: ({ row }) => <div className="max-w-[250px] min-w-[250px] truncate">{row.getValue('item_desc')}</div>,
            meta: 'Description',
        },
        {
            accessorKey: 'quantity',
            header: ({ column }) => <DataTableColumnHeader column={column} title="QTY" />,
            cell: ({ row }) => <div className="min-w-[80px]">{row.getValue('quantity')}</div>,
            meta: 'Quantity',
        },
        {
            accessorKey: 'unit_price',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Unit Price" />,
            cell: ({ getValue }) => <div className="min-w-[100px]">${Number(getValue()).toFixed(2)}</div>,
            meta: 'Unit Price',
        },
        {
            accessorKey: 'note',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Note" />,
            cell: ({ row }) => <div className="max-w-[250px] min-w-[250px] truncate">{row.getValue('note')}</div>,
            meta: 'Description',
        },
        {
            accessorKey: 'project_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Project Name" />,
            filterFn: 'arrIncludesSome',
            meta: 'Project Name',
        },
        {
            accessorKey: 'customer_name',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Customer" />,
            filterFn: 'arrIncludesSome',
            meta: 'Customer',
        },
        {
            accessorKey: 'total_price',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Total" />,
            cell: ({ getValue }) => <div className="min-w-[100px]">${Number(getValue()).toFixed(2)}</div>,
            meta: 'Total',
        },
    ];

    const table = useReactTable({
        data: quotedItems,
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
        onGlobalFilterChange: setGlobalFilter,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            globalFilter,
        },
        filterFns: {
            multi: multiValueFilter,
        },
        globalFilterFn: (row, _, filterValue) => {
            return (
                row.original.customer_name?.toLowerCase().includes(filterValue.customer.toLowerCase()) &&
                row.original.note?.toLowerCase().includes(filterValue.item_note.toLowerCase())
            );
        },
        initialState: {
            pagination: {
                pageSize: 15,
            },
        },
    });

    return (
        <>
            <div className="widget-table bg-widget-background flex flex-1 flex-col gap-4 rounded-xl p-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-semibold tracking-tight">All Quoted Items</h2>
                    <p className="text-muted-foreground">Here's the list of quoted items.</p>
                </div>

                <div className="flex flex-col gap-4">
                    {!isLoading ? (
                        <>
                            <DataTableToolbar
                                table={table}
                                searchColumn="note"
                                searchPlaceholder="Search quoted item note..."
                                facetedFilters={[
                                    { columnId: 'customer_name', title: 'Customer Filter' },
                                    { columnId: 'item_code', title: 'SKU Filter' },
                                    { columnId: 'project_name', title: 'Project Filter' },
                                ]}
                                searchAfterFilter={true}
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
                                                    No quotes found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
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

                <DataTablePagination table={table} hasSelect={false} />
            </div>
        </>
    );
}
