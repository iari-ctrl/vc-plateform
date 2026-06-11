import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthDialog } from '@/components/ui/AuthDialog';
import { CommandPalette } from '@/components/ui/CommandPalette';

interface UICtx {
  openAuth: (reason?: string) => void;
  openSearch: () => void;
}

const Ctx = createContext<UICtx | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [authOpen, setAuthOpen] = useState(false);
  const [authReason, setAuthReason] = useState<string | undefined>();
  const [searchOpen, setSearchOpen] = useState(false);

  const openAuth = useCallback((reason?: string) => {
    setAuthReason(reason);
    setAuthOpen(true);
  }, []);
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

  const value = useMemo(() => ({ openAuth, openSearch }), [openAuth, openSearch]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} reason={authReason} />
      <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
    </Ctx.Provider>
  );
}

export function useUI() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUI must be used within UIProvider');
  return ctx;
}
