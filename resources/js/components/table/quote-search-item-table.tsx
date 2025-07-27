import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useEffect, useState } from 'react';

interface QuoteItem {
    id: number;
    item_code: string;
    item_desc: string;
    quantity: number;
    unit_price: number;
    unit_of_measure: string;
    total_price: number;
    note: string;
    quote_id: number;
    customer_name: string;
    contact_full_name: string;
}

export default function DialogQuoteItemsTable() {
    const [data, setData] = useState<QuoteItem[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!search) return;
        const timeout = setTimeout(async () => {
            const res = await fetch(`/item/index?sku=${encodeURIComponent(search)}`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } });
            setData(await res.json());
        }, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    const columns: ColumnDef<QuoteItem>[] = [
        { accessorKey: 'item_code', header: 'SKU' },
        { accessorKey: 'item_desc', header: 'Description' },
        { accessorKey: 'quantity', header: 'QTY' },
        {
            accessorKey: 'unit_price',
            header: 'Unit Price',
            cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
        },
        {
            accessorKey: 'total_price',
            header: 'Total',
            cell: ({ getValue }) => `$${Number(getValue()).toFixed(2)}`,
        },
        { accessorKey: 'customer_name', header: 'Customer' },
        {
            accessorKey: 'quote_id',
            header: 'Quote',
            cell: ({ row }) => (
                <a className="text-blue-500 hover:underline" href={`/quote/${row.original.quote_id}/edit`}>
                    {row.original.quote_id}
                </a>
            ),
        },
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="space-y-2">
            <Input
                type="text"
                placeholder="Search by SKU or Description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full"
            />
            <div className="overflow-hidden rounded-md border">
                <Table className="w-full">
                    <TableHeader className="bg-muted sticky top-0 z-10 [&_tr]:border-b">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="">
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id}>
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="p-2 text-left whitespace-nowrap">
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {data.length === 0 && <p className="text-muted-foreground text-sm">No quote items found.</p>}
        </div>
    );
}
