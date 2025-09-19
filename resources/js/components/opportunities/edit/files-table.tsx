import DataTableRowDeleteButton from '@/components/table-row-delete-button';
import { DataTableLoadingSpinner } from '@/components/table-spinner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTanStackQuery } from '@/hooks/use-query';
import { OpportunityFile } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function OpportunityFilesTable() {
    const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
    const ALLOWED_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'image/png',
        'image/jpeg',
        'image/heic',
        'image/heif',
    ];

    const opportunityId = window.location.pathname.split('/')[2];
    const ENDPOINT = '/opportunity-files';
    const qKey = ['opportunity-files', opportunityId];

    const queryClient = useQueryClient();
    const { data: files = [], isLoading, isRefetching } = useTanStackQuery<OpportunityFile>(ENDPOINT + `?opp=${opportunityId}`, qKey);

    const [sorting, setSorting] = useState<SortingState>([{ id: 'id', desc: true }]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const uploadMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return axios.post(ENDPOINT + `?opp=${opportunityId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (event) => {
                    if (event.total) {
                        const percent = Math.round((event.loaded * 100) / event.total);
                        setProgress(percent);
                    }
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: qKey });
            toast.success('File uploaded successfully');
        },
        onError: () => {
            toast.error('Upload failed');
        },
        onSettled: () => {
            setUploading(false);
            setProgress(0);
        },
    });

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

    const columns: ColumnDef<OpportunityFile>[] = [
        {
            header: 'File',
            accessorKey: 'original_name',
            cell: ({ row }) => (
                <a href={`${ENDPOINT}/${row.original.id}/download`} className="text-blue-600 underline">
                    {row.original.original_name}
                </a>
            ),
        },
        {
            header: 'Size',
            accessorKey: 'file_size',
            cell: ({ getValue }) => {
                const size = Number(getValue());
                if (!size) return '-';
                return `${(size / 1024).toFixed(1)} KB`;
            },
        },
        {
            header: 'Uploaded At',
            accessorKey: 'created_at',
            accessorFn: (row) => row.created_at?.date,
            cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' }),
        },
        {
            accessorKey: 'options',
            header: () => null,
            cell: ({ row }) => {
                if (!window.canEdit) return null;
                const rowId = row.original.id;
                return <DataTableRowDeleteButton label="file" handleDelete={() => handleDelete(rowId)} />;
            },
            enableHiding: false,
        },
    ];

    const table = useReactTable({
        data: files,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            toast.error(`File is too large. Max allowed size is ${MAX_FILE_SIZE / (1024 * 1024)} MB.`);
            return;
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error('Unsupported file format. Please upload PDF, Word, Excel, or an image.');
            return;
        }

        const formData = new FormData();
        formData.append('upload', file);

        setUploading(true);
        uploadMutation.mutate(formData);
    };

    useEffect(() => {
        if (uploading) {
            toast.custom(
                () => (
                    <div className="w-64 p-4">
                        <p className="mb-2 font-medium">Uploading file…</p>
                        <Progress value={progress} className="w-full" />
                        <p className="text-muted-foreground mt-1 text-xs">{progress}%</p>
                    </div>
                ),
                { id: 'upload-progress', duration: Infinity },
            );
        } else {
            toast.dismiss('upload-progress');
        }
    }, [uploading, progress]);

    return (
        <div>
            <div className="widget-table bg-widget-background flex flex-1 flex-col gap-4 rounded-xl p-6 shadow-lg">
                <div className="flex flex-col gap-1">
                    <h2 className="font-mono text-2xl font-semibold uppercase">Files</h2>
                    <p className="text-muted-foreground">Here're attached files of this opportunity.</p>
                </div>

                <div className="absolute top-4 right-4 z-10">
                    <Button variant="outline" size="sm" disabled={uploading}>
                        <Label className="cursor-pointer">
                            <Plus className="size-4" />
                            {uploading ? 'Uploading...' : 'Upload'}
                            <Input
                                type="file"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.heic"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </Label>
                    </Button>
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
