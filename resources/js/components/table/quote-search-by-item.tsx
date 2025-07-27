import DialogQuoteItemsTable from '@/components/table/quote-search-item-table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function DialogQuoteSearchByItem() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <Search className="mr-1 size-4" /> Search By Item
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-h-180 min-w-280 overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Search Quoted Items</DialogTitle>
                    </DialogHeader>
                    <DialogQuoteItemsTable />
                </DialogContent>
            </Dialog>
        </>
    );
}
