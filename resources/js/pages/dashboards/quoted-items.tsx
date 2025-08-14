import QuotesQuoteTable from '@/components/table/quotes/quote-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Quoted Items',
        href: '/dashboard/quoted-items',
    },
];

export default function QuotedItemDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Opportunity Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <QuotesQuoteTable />
            </div>
        </AppLayout>
    );
}
