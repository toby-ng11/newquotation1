import { useTheme, type Appearance } from '@/hooks/use-appearance';
import { Monitor, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ThemeToggleFloat() {
  const { appearance, updateAppearance } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const options: { value: Appearance; icon: React.FC<React.SVGProps<SVGSVGElement>>; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="relative">
        <button
          onClick={toggleExpanded}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg transition-all hover:bg-gray-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          aria-label="Toggle theme selector"
        >
          {appearance === 'light' && <Sun className="h-5 w-5" />}
          {appearance === 'dark' && <Moon className="h-5 w-5" />}
          {appearance === 'system' && <Monitor className="h-5 w-5" />}
        </button>
        {isExpanded && (
          <div
            className="absolute bottom-16 right-0 rounded-lg bg-white p-2 shadow-xl dark:bg-neutral-800"
          >
            <div className="flex flex-col gap-1">
              {options.map(({ value, icon: Icon, label }) => (
                <button
                  key={value}
                  onClick={() => {
                    updateAppearance(value);
                    setIsExpanded(false);
                  }}
                  className={cn(
                    'flex w-32 items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors',
                    appearance === value
                      ? 'bg-neutral-100 font-medium dark:bg-neutral-700'
                      : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-700'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
