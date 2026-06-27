/**
 * Demo authentication for frontend-only builds (the static GitHub Pages deploy,
 * where `VITE_API_DISABLED=true` and no server exists). It is a *client-side
 * gate only* — there is no backend to protect, so this grants UI access to
 * explore admin/CMS surfaces, not real authorization. The session is kept in
 * localStorage so a reload preserves it.
 */
import { ApiError } from '@/lib/api';
import type { AuthUser } from '@/content/types';

const KEY = 'vcpx.localAuth.user';

/** The single demo credential pair recognised by the static build. */
const DEMO_EMAIL = 'admin';
const DEMO_PASSWORD = 'admin';

const DEMO_ADMIN: AuthUser = {
  id: 'local-admin',
  email: 'admin',
  name: 'Admin (démo)',
  role: 'admin',
};

export function loadLocalUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function persist(user: AuthUser | null): void {
  try {
    if (user) localStorage.setItem(KEY, JSON.stringify(user));
    else localStorage.removeItem(KEY);
  } catch {
    /* private mode / quota — session just won't survive a reload */
  }
}

export function localLogin(email: string, password: string): AuthUser {
  if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
    throw new ApiError('Identifiants invalides', 401);
  }
  persist(DEMO_ADMIN);
  return DEMO_ADMIN;
}

export function localRegister(email: string, _password: string, name?: string): AuthUser {
  const user: AuthUser = {
    id: `local-${Date.now().toString(36)}`,
    email: email.trim(),
    name: name?.trim() || email.trim(),
    role: 'user',
  };
  persist(user);
  return user;
}

export function localLogout(): void {
  persist(null);
}
