import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { UIContext } from '@/context/UIContext';

export function UIProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const value = useMemo(() => ({ openSearch }), [openSearch]);

  return (
    <UIContext.Provider value={value}>
      {children}
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </UIContext.Provider>
  );
}
