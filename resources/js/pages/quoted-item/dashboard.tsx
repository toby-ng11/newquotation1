import Greeting from "@/components/greeting";
import QuotesQuoteTable from "@/components/table/quotes/quote-table";

export default function QuotedItemDashboard() {
    return (
        <div className="flex h-full flex-1 flex-col gap-4 p-8">
            <header>
                <Greeting />
                    <p className="text-muted-foreground">
                        Welcome to the quoted items dashboard. Here you can search through the item list, or filter by customer name, contact, or
                        project.
                    </p>
            </header>

            <div className="flex flex-col gap-4 md:gap-6">
                <QuotesQuoteTable />
            </div>
        </div>
    );
}
