import OtherUsersOpportunitiesTable from '@/components/dashboard/opportunity/other-users-opportunities-table';
import OwnOpportunitiesTable from '@/components/dashboard/opportunity/own-opportunities-table';
import SharedOpportunitiesTable from '@/components/dashboard/opportunity/shared-opportunities-table';

export default function OpportunityTempDashboard() {
    return (
        <div className="flex flex-col gap-4 md:gap-6">
            <OwnOpportunitiesTable />
            <SharedOpportunitiesTable />
            {(window.userRole === 'admin' || window.userRole === 'manager') && <OtherUsersOpportunitiesTable />}
        </div>
    );
}
