import { Loader2 } from 'lucide-react';

export function DataTableLoadingSpinner() {
    return (
        <div className="flex h-40 items-center justify-center">
            <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
        </div>
    );
}
