import OtherUsersOpportunitiesTable from '@/components/dashboard/opportunity/other-users-opportunities-table';
import OwnOpportunitiesTable from '@/components/dashboard/opportunity/own-opportunities-table';
import SharedOpportunitiesTable from '@/components/dashboard/opportunity/shared-opportunities-table';

export default function OpportunityTempDashboard() {
    return (
        <div className="flex flex-col gap-4 md:gap-6">
            <div className="w-full rounded-md border-l-4 border-yellow-500 bg-yellow-100 p-4 text-yellow-700">
                <p className="font-semibold">⚠️ Please don't create Opportunity as it is still in testing phase.</p>
            </div>
            <OwnOpportunitiesTable />
            <SharedOpportunitiesTable />
            <OtherUsersOpportunitiesTable />
        </div>
    );
}
