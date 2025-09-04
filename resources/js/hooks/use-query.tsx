import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import axios from 'axios';

export function useTanStackQuery<TData>(
    url: string,
    queryKey: unknown[],
    enabled?: boolean,
    options?: Omit<UseQueryOptions<TData[], Error>, 'queryKey' | 'queryFn'>,
) {
    return useQuery<TData[], Error>({
        queryKey: queryKey,
        queryFn: async () => {
            const res = await axios.get(url);
            return res.data;
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        ...options,
    });
}
