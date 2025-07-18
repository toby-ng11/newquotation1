import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import axios from 'axios';
import { EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { showFlashMessage } from '../flashmessage';

interface DataTableProjectOptionsProps {
    rowId?: string | number;
    onEdit?: (id?: string | number) => void;
    onCopy?: (id?: string | number) => void;
    onFavorite?: (id?: string | number) => void;
    onDelete?: (id?: string | number) => void;
}

function DataTableProjectOptions({ rowId, onEdit, onCopy, onFavorite, onDelete }: DataTableProjectOptionsProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!rowId) return;
        setLoading(true);
        try {
            const { data } = await axios.get(`/project/${rowId}/delete`);
            if (data.success) {
                showFlashMessage(data.message, true);
            }
            onDelete?.(rowId);
            setOpen(false);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete project. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" size="icon">
                        <EllipsisVertical />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem onClick={() => onEdit?.(rowId)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopy?.(rowId)}>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onFavorite?.(rowId)}>Favorite</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setOpen(true)}>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the project
                            <span className="font-medium"> #{rowId}</span>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={loading}
                            className="bg-destructive dark:bg-destructive/50 dark:hover:bg-destructive/60 hover:bg-destructive/90 text-white"
                            onClick={handleDelete}
                        >
                            {loading ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
export { DataTableProjectOptions };
