import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api, pingApi, API_ENABLED } from '@/lib/api';
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

/** While the API is unreachable, retry the health ping this often. */
const API_RETRY_MS = 15_000;

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [apiUp, setApiUp] = useState(false);

  // The API may come up *after* the client (dev server race, redeploy, laptop
  // back online). A single mount-time ping would lock the app in guest mode
  // until a reload, so while the API is down we re-ping on a light interval
  // plus on window focus / network-online. Once it answers, the session is
  // restored, `apiUp` flips (for offline-aware UI), and we invalidate the
  // content queries so they refetch the live copy on their own — no reload.
  useEffect(() => {
    // Frontend-only build: no server to reach. Settle into guest mode at once and
    // skip the health ping / retry loop — content renders from the bundle.
    if (!API_ENABLED) {
      setReady(true);
      return;
    }

    let active = true;
    let up = false;
    let checking = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const check = async () => {
      if (checking) return;
      checking = true;
      const nowUp = await pingApi();
      if (!active) return;
      if (nowUp && !up) {
        // Came (back) up: restore the cookie session before flipping `apiUp`,
        // so user-scoped queries fire with the user already in place.
        try {
          const { user } = await api.get<{ user: AuthUser | null }>('/auth/me');
          if (active) setUser(user);
        } catch {
          /* guest */
        }
        // Content queries aren't gated on `apiUp` — they show the bundle and
        // rely on this signal to refresh. Now that the API answers, drop their
        // staleness so they fetch the live copy without a page reload.
        if (active) void queryClient.invalidateQueries({ queryKey: ['api'] });
      }
      if (!active) return;
      up = nowUp;
      setApiUp(nowUp);
      setReady(true);
      checking = false;
      clearTimeout(timer);
      if (!nowUp) timer = setTimeout(() => void check(), API_RETRY_MS);
    };

    const recheckIfDown = () => {
      if (!up) void check();
    };

    void check();
    window.addEventListener('focus', recheckIfDown);
    window.addEventListener('online', recheckIfDown);
    return () => {
      active = false;
      clearTimeout(timer);
      window.removeEventListener('focus', recheckIfDown);
      window.removeEventListener('online', recheckIfDown);
    };
  }, [queryClient]);

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
