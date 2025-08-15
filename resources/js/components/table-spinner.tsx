import { LoaderCircle } from 'lucide-react';

export function DataTableLoadingSpinner() {
    return (
        <div className="flex h-40 items-center justify-center">
            <LoaderCircle className="text-muted-foreground size-7 animate-spin" />
        </div>
    );
}
