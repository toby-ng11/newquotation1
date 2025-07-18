import { DataTableViewOptions } from '@/components/table-column-toggle';
import { DataTableFacetedFilter, getColumnOptions } from '@/components/table-faceted-filter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Table } from '@tanstack/react-table';
import { PlusCircle } from 'lucide-react';

interface FacetedFilterConfig {
    columnId: string;
    title: string;
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>;
    facetedFilters?: FacetedFilterConfig[];
    showAddButton?: boolean;
    onAddClick?: () => void;
    searchColumn?: string;
    searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
    table,
    facetedFilters = [],
    showAddButton = false,
    onAddClick,
    searchColumn = 'project_name',
    searchPlaceholder = 'Filter...',
}: DataTableToolbarProps<TData>) {
    const searchCol = table.getColumn(searchColumn);

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center gap-2">
                {searchCol && (
                    <Input
                        placeholder={searchPlaceholder}
                        value={(searchCol.getFilterValue() as string) ?? ''}
                        onChange={(event) => searchCol.setFilterValue(event.target.value)}
                        className="h-8 w-[150px] lg:w-[250px]"
                    />
                )}
                <>
                    <div className="hidden flex-wrap gap-2 lg:flex">
                        {facetedFilters.map(({ columnId, title }) => {
                            const col = table.getColumn(columnId);
                            return col && <DataTableFacetedFilter key={columnId} column={col} title={title} options={getColumnOptions(col)} />;
                        })}
                    </div>

                    <div className="flex lg:hidden">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8">
                                    <PlusCircle className="mr-2 size-4" />
                                    Filters
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-fit max-w-[400px] p-4" align="start">
                                <div className="flex flex-col gap-2">
                                    {facetedFilters.map(({ columnId, title }) => {
                                        const col = table.getColumn(columnId);
                                        return (
                                            col && (
                                                <DataTableFacetedFilter key={columnId} column={col} title={title} options={getColumnOptions(col)} />
                                            )
                                        );
                                    })}
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </>
            </div>

            <div className="flex items-center gap-4">
                <DataTableViewOptions table={table} />
                {showAddButton && (
                    <Button className="text-white" size="sm" onClick={onAddClick}>
                        <PlusCircle className="mr-1 size-4" /> Add Project
                    </Button>
                )}
            </div>
        </div>
    );
}
