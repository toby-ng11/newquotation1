import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DataTableRowDeleteButtonProps {
    label?: number | string;
    handleDelete: () => Promise<boolean | undefined>;
}

export default function DataTableRowDeleteButton({ handleDelete, label }: DataTableRowDeleteButtonProps) {
    const [loading, setLoading] = useState(false);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button size="icon" className="data-[state=open]:bg-muted text-muted-foreground flex size-8" variant="ghost">
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>This will delete the {label}.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        disabled={loading}
                        className="bg-destructive dark:bg-destructive/50 dark:hover:bg-destructive/60 hover:bg-destructive/90 text-white"
                        onClick={async () => {
                            setLoading(true);
                            await handleDelete();
                            setLoading(false);
                        }}
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
