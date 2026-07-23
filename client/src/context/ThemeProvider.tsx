import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { commitOnStorageSuccess, storage } from '@/lib/storage';
import { STORAGE_CONTRACTS } from '@/lib/storageDomains';
import { ThemeContext, type Theme } from '@/context/ThemeContext';

function getInitialTheme(): Theme {
  const saved = storage.getParsed(STORAGE_CONTRACTS.theme);
  if (saved === 'light' || saved === 'dark') return saved;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0D0E12' : '#FDFCF7');
  }, [theme]);

  useEffect(() => {
    storage.migrate(STORAGE_CONTRACTS.theme);
  }, []);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const result = storage.setParsed(STORAGE_CONTRACTS.theme, next);
    commitOnStorageSuccess(result, next, setTheme);
  }, [theme]);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
