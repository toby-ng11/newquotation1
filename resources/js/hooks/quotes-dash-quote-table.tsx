import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface QuoteItem {
    id: number;
    item_code: string;
    item_desc: string;
    quantity: number;
    unit_price: number;
    unit_of_measure: string;
    total_price: number;
    project_name: string;
    customer_name: string;
    contact_full_name: string;
    quote_id: string;
    note: string;
}

export function useQuotesQuote(view = true) {
    return useQuery<QuoteItem[]>({
        queryKey: ['projects', view], // caches by view type
        queryFn: async () => {
            const res = await axios.get('/index/quotes/items', {
                params: { view },
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            return res.data;
        },
        staleTime: 5 * 60 * 1000,
    });
}
