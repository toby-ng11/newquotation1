import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Key, ReactNode, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

type RenderFn<T> = (item: T) => ReactNode;

export type AutoCompleteProps<T> = {
    /** Endpoint to fetch from */
    fetchUrl: string;
    /** Called when user picks an item */
    onSelect: (item: T) => void;

    /** Renders each item (default tries id/name) */
    renderItem?: RenderFn<T>;
    /** Unique key for list items (default: (item as any).id ?? index) */
    getItemKey?: (item: T, index: number) => Key;

    /** UI / behavior */
    placeholder?: string;
    className?: string;

    /** Query behavior */
    minLength?: number; // default 1
    queryParamName?: string; // default 'pattern'
    limitParamName?: string; // default 'limit'
    limit?: number; // default 10
    debounceMs?: number; // default 300

    inputId?: string;
    inputName?: string;

    /** Controlled input (optional) */
    inputValue?: string;
    onInputValueChange?: (value: string) => void;

    /** Extra search params if needed */
    extraParams?: Record<string, string | number | boolean | undefined>;
};

export function AutoCompleteInput<T>({
    fetchUrl,
    onSelect,
    renderItem,
    getItemKey,
    placeholder = 'Search...',
    className,
    minLength = 1,
    queryParamName = 'pattern',
    limitParamName = 'limit',
    limit = 10,
    debounceMs = 300,
    inputId,
    inputName,
    inputValue,
    onInputValueChange,
    extraParams,
}: AutoCompleteProps<T>) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isControlled = typeof inputValue === 'string';
    const value = isControlled ? inputValue! : query;

    // Debounce
    const debouncedValue = useDebouncedValue(value, debounceMs);

    // Fetch on debounced change
    useEffect(() => {
        if (debouncedValue.trim().length < minLength) {
            setItems([]);
            setError(null);
            return;
        }

        const controller = new AbortController();
        const params = new URLSearchParams();
        params.set(queryParamName, debouncedValue);
        params.set(limitParamName, String(limit));
        if (extraParams) {
            for (const [k, v] of Object.entries(extraParams)) {
                if (v !== undefined && v !== null) params.set(k, String(v));
            }
        }

        const url = `${fetchUrl}?${params.toString()}`;
        setLoading(true);
        setError(null);

        fetch(url, {
            method: 'GET',
            signal: controller.signal,
        })
            .then(async (res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: T[]) => {
                setItems(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                if (e.name !== 'AbortError') setError(e.message || 'Fetch error');
            })
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [debouncedValue, fetchUrl, limit, limitParamName, queryParamName, minLength, extraParams]);

    const handleInputChange = (val: string) => {
        if (isControlled) onInputValueChange?.(val);
        else setQuery(val);
    };

    const defaultRenderItem: RenderFn<T> = (item) => {
        const anyItem = item as unknown as Record<string, unknown>;
        const id = anyItem?.id ?? '';
        const name = anyItem?.name ?? '';
        return (
            <div className="flex flex-col">
                <strong>{String(id)}</strong>
                <span className="text-muted-foreground text-sm">{String(name)}</span>
            </div>
        );
    };

    const keyFor = (item: T, index: number) => {
        if (getItemKey) return getItemKey(item, index);
        const anyItem = item as unknown as Record<string, string>;
        return anyItem?.id ?? index;
    };

    const selectItem = (item: T) => {
        onSelect(item);
        setOpen(false);
    };

    return (
        <>
            <Input id={inputId} name={inputName ?? inputId} type="hidden" value={inputValue} required readOnly />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn('justify-between', className)}
                        role="combobox"
                        aria-expanded={open}
                        aria-autocomplete="list"
                    >
                        {value === '' ? placeholder : value}
                        <Search className="opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={placeholder}
                            value={value}
                            onValueChange={(v) => handleInputChange(v)}
                            // show spinner when loading
                        />
                        <CommandList>
                            {loading && <div className="text-muted-foreground py-3 text-center text-sm">Searching…</div>}

                            {!loading && error && <div className="text-destructive py-3 text-center text-sm">{error}</div>}

                            {!loading && !error && (
                                <>
                                    <CommandEmpty>No matches found.</CommandEmpty>
                                    <CommandGroup>
                                        {items.map((item, idx) => (
                                            <CommandItem
                                                key={keyFor(item, idx)}
                                                // cmdk gives full keyboard nav & aria
                                                onSelect={() => selectItem(item)}
                                            >
                                                {(renderItem ?? defaultRenderItem)(item)}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </>
                            )}
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}

/** Small debounced value hook */
function useDebouncedValue<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return debounced;
}
