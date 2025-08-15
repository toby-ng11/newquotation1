import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw } from 'lucide-react';

interface DataTableRefreshDataButtonProps {
    fetchTableData: () => Promise<void>;
    isTableReady?: boolean;
    isTableFetching?: boolean;
}

export default function DataTableRefreshDataButton({
    fetchTableData,
    isTableReady = false,
    isTableFetching = false,
}: DataTableRefreshDataButtonProps) {
    return (
        <div className="absolute top-4 right-4 z-10">
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        type="button"
                        aria-label="Refresh data"
                        variant="outline"
                        className="size-8"
                        onClick={fetchTableData}
                        disabled={!isTableReady || !isTableFetching}
                    >
                        <RefreshCw className={!isTableFetching ? 'animate-spin' : ''} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Refresh data</p>
                </TooltipContent>
            </Tooltip>
        </div>
    );
}
