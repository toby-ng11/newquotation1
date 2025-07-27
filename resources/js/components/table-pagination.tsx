import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface DataTablePaginationProps<TData> {
    table: Table<TData>;
    hasSelect?: boolean;
}

export function DataTablePagination<TData>({ table, hasSelect = true }: DataTablePaginationProps<TData>) {
    const PaginationRowSelectedNumber = () => (
        <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
    );

    const PaginationPageSize = () => (
        <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                    table.setPageSize(Number(value));
                }}
            >
                <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                    {[10, 15, 20, 25, 30, 40, 50].map((pageSize) => (
                        <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );

    const PaginationPageIndex = () => (
        <div className="flex w-[100px] items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
    );

    const PaginationButtonGroup = () => (
        <div className="flex items-center space-x-2">
            <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
            >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft />
            </Button>
            <Button variant="outline" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <span className="sr-only">Go to next page</span>
                <ChevronRight />
            </Button>
            <Button
                variant="outline"
                size="icon"
                className="hidden size-8 lg:flex"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
            >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight />
            </Button>
        </div>
    );

    return (
        <div className="flex items-center justify-between px-2">
            {hasSelect ? (
                <>
                    <PaginationRowSelectedNumber />
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <PaginationPageSize />
                        <PaginationPageIndex />
                        <PaginationButtonGroup />
                    </div>
                </>
            ) : (
                <>
                    <PaginationPageSize />
                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <PaginationPageIndex />
                        <PaginationButtonGroup />
                    </div>
                </>
            )}
        </div>
    );
}
