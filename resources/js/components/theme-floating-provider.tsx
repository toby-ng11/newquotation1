import { ThemeToggleFloat } from '@/components/theme-toggle-float';
import { ReactNode } from 'react';

export function FloatingThemeProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ThemeToggleFloat />
    </>
  );
}
