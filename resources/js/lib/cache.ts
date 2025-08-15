type CacheEntry<T> = { data: T; expiresAt: number; etag?: string };
const store = new Map<string, CacheEntry<any>>();

export function getCache<T>(key: string): T | undefined {
    const entry = store.get(key);
    if (!entry) return;
    if (Date.now() > entry.expiresAt) {
        store.delete(key);
        return;
    }
    return entry.data as T;
}

export function setCache<T>(key: string, data: T, ttlMs: number) {
    store.set(key, { data, expiresAt: Date.now() + ttlMs });
}

export function clearCache(key?: string) {
    if (key) store.delete(key);
    else store.clear();
}
