import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, pingApi } from '@/lib/api';
import type { AuthUser } from '@/content/types';

interface AuthCtx {
  user: AuthUser | null;
  ready: boolean;
  apiUp: boolean;
  isAuthed: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [apiUp, setApiUp] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const up = await pingApi();
      if (!active) return;
      setApiUp(up);
      if (up) {
        try {
          const { user } = await api.get<{ user: AuthUser | null }>('/auth/me');
          if (active) setUser(user);
        } catch {
          /* guest */
        }
      }
      if (active) setReady(true);
    })();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user } = await api.post<{ user: AuthUser }>('/auth/login', { email, password });
    setUser(user);
  }, []);

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const { user } = await api.post<{ user: AuthUser }>('/auth/register', { email, password, name });
    setUser(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      /* ignore */
    }
    setUser(null);
    // Drop every cached server response so a shared device doesn't surface the
    // previous session's data once user-scoped queries land.
    queryClient.clear();
  }, [queryClient]);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,
      apiUp,
      isAuthed: !!user,
      isAdmin: user?.role === 'admin',
      login,
      register,
      logout,
    }),
    [user, ready, apiUp, login, register, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
