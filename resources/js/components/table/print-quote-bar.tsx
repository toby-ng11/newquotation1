import { Button } from '@/components/ui/button';

export function PrintSelectedQuotesBar({ table }: { table: any }) {
    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row: any) => row.original.id);

    if (selectedIds.length === 0) return null;

    const handlePrint = () => {
        // For now: open new tab for each quote (can later merge into 1 PDF)
        selectedIds.forEach((id: number) => {
            window.open(`/quote/${id}/export`, '_blank');
        });
    };

    return (
        <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 transform items-center gap-4 rounded-lg border bg-white px-4 py-2 shadow-lg dark:bg-neutral-900">
            <span className="text-sm font-medium">
                {selectedIds.length} quote{selectedIds.length > 1 ? 's' : ''} selected
            </span>
            <Button size="sm" onClick={handlePrint}>
                Print Selected
            </Button>
        </div>
    );
}
