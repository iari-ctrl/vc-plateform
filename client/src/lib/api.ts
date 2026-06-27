/**
 * Thin fetch wrapper around the VC Premium API.
 * Every call is resilient: callers fall back to bundled content / localStorage
 * when the server is unreachable, so the app is fully usable offline & as guest.
 */

const BASE = '/api';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
    ...options,
  });
  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      // Non-JSON body (proxy error page, 502 HTML…). Surface it as an ApiError
      // carrying res.status so offline-first callers fall back to the bundle,
      // instead of a raw SyntaxError that no caller can interpret.
      if (!res.ok) {
        throw new ApiError(`Erreur ${res.status}`, res.status);
      }
      throw new ApiError(`Réponse non-JSON du serveur (statut ${res.status})`, res.status);
    }
  }
  if (!res.ok) {
    throw new ApiError((data as { error?: string } | null)?.error ?? `Erreur ${res.status}`, res.status);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  put: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  del: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/** Returns true if the API server responds to /api/health. */
export async function pingApi(): Promise<boolean> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1500);
    const res = await fetch(`${BASE}/health`, { signal: ctrl.signal, credentials: 'include' });
    clearTimeout(t);
    return res.ok;
  } catch {
    return false;
  }
}
