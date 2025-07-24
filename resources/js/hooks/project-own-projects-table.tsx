import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Project {
    id: string;
    project_id_ext: string;
    project_name: string;
    owner_id: string;
    shared_id: string;
    reed: string;
    quote_count: string,
    created_at: { date: string };
    due_date: { date: string };
    architect_name: string;
    market_segment_desc: string;
    status_desc: string;
    legacy_id: string;
}

export function useProjects(view = true) {
    return useQuery<Project[]>({
        queryKey: ['projects', view], // caches by view type
        queryFn: async () => {
            const res = await axios.get('/index/project/own', {
                params: { view },
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            return res.data;
        },
    });
}
