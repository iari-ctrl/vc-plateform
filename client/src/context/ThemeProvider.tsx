import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { commitOnStorageSuccess, storage, STORAGE_PREFIX } from '@/lib/storage';
import { localDataChanges } from '@/lib/localDataChanges';
import { STORAGE_CONTRACTS } from '@/lib/storageDomains';
import { ThemeContext, type Theme } from '@/context/ThemeContext';

function resolveTheme(saved: Theme | null): Theme {
  if (saved === 'light' || saved === 'dark') return saved;
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => resolveTheme(storage.getParsed(STORAGE_CONTRACTS.theme)));

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#0D0E12' : '#FDFCF7');
  }, [theme]);

  useEffect(() => {
    storage.migrate(STORAGE_CONTRACTS.theme);
  }, []);

  useEffect(() => localDataChanges.subscribe(snapshot => {
    setTheme(resolveTheme(storage.parseStored(STORAGE_CONTRACTS.theme, snapshot[STORAGE_PREFIX + STORAGE_CONTRACTS.theme.key] ?? null)));
  }), []);

  const toggle = useCallback(() => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const result = storage.setParsed(STORAGE_CONTRACTS.theme, next);
    commitOnStorageSuccess(result, next, setTheme);
  }, [theme]);
  const value = useMemo(() => ({ theme, toggle }), [theme, toggle]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
