import OwnOpportunitiesTable from "@/components/dashboard/opportunity/opportunities-table";
import SharedOpportunitiesTable from "@/components/dashboard/opportunity/shared-opportunities-table";

export default function OpportunityTempDashboard() {
    return <div className="flex flex-col gap-4 md:gap-6">
        <OwnOpportunitiesTable />
        <SharedOpportunitiesTable />
    </div>;
}
