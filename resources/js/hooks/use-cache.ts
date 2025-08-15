import { clearCache, getCache, setCache } from '@/lib/cache';
import axios from 'axios';

export async function fetchWithCache<T>(url: string, { ttlMs = 5 * 60_000, force = false }: { ttlMs?: number; force?: boolean } = {}): Promise<T> {
    const key = url;

    if (!force) {
        const cached = getCache<T>(key);
        if (cached) return cached;
    }

    const res = await axios.get<T>(url);
    setCache<T>(key, res.data, ttlMs);
    return res.data;
}

export function invalidate(url: string) {
    clearCache(url);
}
