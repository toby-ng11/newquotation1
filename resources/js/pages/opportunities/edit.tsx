import OpportunityFilesTable from '@/components/opportunities/edit/files-table';
import OpportunitySharedUsersTable from '@/components/opportunities/edit/shared-users-table';

export default function OpportunityEditPage() {
    if (window.isOwner) {
        return (
            <div className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6">
                <OpportunitySharedUsersTable />
                <OpportunityFilesTable />
            </div>
        );
    } else {
        return <OpportunityFilesTable />;
    }
}
