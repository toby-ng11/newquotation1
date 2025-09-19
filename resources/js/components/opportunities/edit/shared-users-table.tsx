import { DataTableColumnHeader } from '@/components/table-header';
import DataTableRowDeleteButton from '@/components/table-row-delete-button';
import { DataTableLoadingSpinner } from '@/components/table-spinner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTanStackQuery } from '@/hooks/use-query';
import { OpportunityShare } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';
import RoleCell from './shared-users-table-row-cell';
import ShareOpportunityButton from './shared-users-table-share-button';

export default function OpportunitySharedUsersTable() {
    const opportunityId = window.location.pathname.split('/')[2];
    const ENDPOINT = '/opportunity-shares';
    const qKey = ['opportunity-shares', opportunityId];

    const queryClient = useQueryClient();
    const { data: users = [], isLoading, isRefetching } = useTanStackQuery<OpportunityShare>(ENDPOINT + `?opp=${opportunityId}`, qKey);

    const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }]);

    const handleDelete = async (rowId: string) => {
        if (!rowId) return;
        try {
            const { data } = await axios.delete(`${ENDPOINT}/${rowId}`);

            if (data.success) {
                await queryClient.invalidateQueries({ queryKey: qKey });
                toast.success(data.message);
                return true;
            } else {
                toast.error(`Error saving: ${data.message}`);
                return false;
            }
        } catch (error) {
            toast.warning(`Error: ${error}.`);
            return false;
        }
    };

    const columns: ColumnDef<OpportunityShare>[] = [
        {
            accessorKey: 'shared_user',
            header: ({ column }) => <DataTableColumnHeader column={column} title="User ID" />,
        },
        {
            accessorKey: 'role',
            header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
            cell: ({ row }) => {
                const original = row.original;
                const rowId = original.id;
                const role = original.role;

                if (!window.canEdit) return role;

                return <RoleCell endpoint={ENDPOINT} queryKey={qKey} id={rowId} role={role} />;
            },
        },
        {
            accessorKey: 'options',
            header: () => null,
            cell: ({ row }) => {
                if (!window.canEdit) return null;
                const rowId = row.original.id;
                const sharedUser = row.original.shared_user;
                return <DataTableRowDeleteButton label={`share with ${sharedUser}`} handleDelete={() => handleDelete(rowId)} />;
            },
            enableHiding: false,
        },
    ];

    const table = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    return (
        <div>
            <div className="widget-table bg-widget-background flex flex-1 flex-col gap-4 rounded-xl p-6">
                {window.isOwner && <ShareOpportunityButton endpoint={ENDPOINT} queryKey={qKey} opportunityId={opportunityId} />}
                <div className="flex flex-col gap-1">
                    <h2 className="font-mono text-2xl font-semibold uppercase">Shared Users</h2>
                    <p className="text-muted-foreground">Here're shared users of this opportunity.</p>
                </div>
                <div className="flex flex-col gap-4">
                    {!isLoading ? (
                        <>
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
