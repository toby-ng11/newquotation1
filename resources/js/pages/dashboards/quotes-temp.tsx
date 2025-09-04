import OwnQuotesTable from '@/components/dashboard/quote/own-quote-table';
import SharedQuotesTable from '@/components/dashboard/quote/shared-quote-table';

export default function OpportunityTempDashboard() {
    return (
        <div className="flex flex-col gap-4 md:gap-6">
            <OwnQuotesTable />
            <SharedQuotesTable />
        </div>
    );
}
