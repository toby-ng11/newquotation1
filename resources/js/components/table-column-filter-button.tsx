import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Row, Table } from '@tanstack/react-table';
import { PlusCircle, Search } from 'lucide-react';
import { useMemo, useState } from 'react';

interface ColumnFilterDropdownProps<TData> {
    table: Table<TData>;
    columnId: string;
    label: string;
}

export function ColumnFilterDropdownButton<TData>({ table, columnId, label }: ColumnFilterDropdownProps<TData>) {
    const [search, setSearch] = useState('');
    const column = table.getColumn(columnId);
    const currentValue = column?.getFilterValue() as string | undefined;

    const uniqueValues = useMemo(() => {
        const rows = table.getFilteredRowModel().rows;
        if (!rows || rows.length === 0) return [];

        const values = new Set<string>();
        rows.forEach((row: Row<TData>) => {
            const value = row.getValue<string>(columnId);
            if (value) values.add(value);
        });
        return Array.from(values).sort();
    }, [table, columnId]);

    const filteredValues = uniqueValues.filter((value) => value.toLowerCase().includes(search.toLowerCase()));

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="border-dashed">
                    <PlusCircle /> {label}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-fit">
                <div className="flex h-9 items-center gap-2 px-3">
                    <Search className="size-4 shrink-0 opacity-50" />
                    <input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                <DropdownMenuSeparator />
                {filteredValues.length > 0 ? (
                    filteredValues.map((value) => (
                        <DropdownMenuItem
                            key={value}
                            onClick={() => {
                                column?.setFilterValue(value === currentValue ? '' : value);
                            }}
                            className={value === currentValue ? 'font-semibold' : ''}
                        >
                            {value}
                        </DropdownMenuItem>
                    ))
                ) : (
                    <DropdownMenuItem disabled>No results</DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
