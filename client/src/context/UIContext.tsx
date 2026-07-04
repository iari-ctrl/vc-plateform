import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { CommandPalette } from '@/components/ui/CommandPalette';

interface UICtx {
    openSearch: () => void;
}

const Ctx = createContext<UICtx | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
      const [searchOpen, setSearchOpen] = useState(false);

    const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((s) => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const value = useMemo(() => ({ openSearch }), [openSearch]);

  return (
    <Ctx.Provider value={value}>
      {children}
            <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Ctx.Provider>
  );
}

export function useUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
