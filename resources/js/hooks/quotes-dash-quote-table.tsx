import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Quote {
    id: string;
    project_id: string;
    project_name: string;
    customer_name: string;
    contact_full_name: string;
    quote_status: string;
    created_by: string;
    created_at: { date: string };
    expire_date: { date: string };
    ship_required_date: { date: string };
}

export function useQuotesQuote(view = true) {
    return useQuery<Quote[]>({
        queryKey: ['projects', view], // caches by view type
        queryFn: async () => {
            const res = await axios.get('/index/quotes/quote', {
                params: { view },
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            return res.data;
        },
    });
}
