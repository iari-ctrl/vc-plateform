import { describe, it, expect, vi, afterEach } from 'vitest';
import { api, ApiError } from './api';

/** Stub fetch with a single Response-like object (only the bits `request` reads). */
function mockFetch(body: string, init: { ok: boolean; status: number }) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({ ok: init.ok, status: init.status, text: async () => body }),
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('api request — non-JSON responses', () => {
  it('throws a status-bearing ApiError (not a raw SyntaxError) on 200 + non-JSON body', async () => {
    mockFetch('<!doctype html><html>not json</html>', { ok: true, status: 200 });
    const err = await api.get('/anything').catch((e) => e);
    // An offline-first caller (useApiData/useApiItem) needs an ApiError it can
    // interpret; a raw SyntaxError would leak through and crash the query.
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(200);
  });

  it('throws an ApiError carrying the status on 500 + HTML error page', async () => {
    mockFetch('<html><body>502 Bad Gateway</body></html>', { ok: false, status: 500 });
    const err = await api.get('/anything').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).status).toBe(500);
  });

  it('still returns null for an empty body (unchanged behaviour)', async () => {
    mockFetch('', { ok: true, status: 204 });
    await expect(api.get('/anything')).resolves.toBeNull();
  });

  it('still surfaces a JSON error payload on a failed response', async () => {
    mockFetch(JSON.stringify({ error: 'Accès refusé' }), { ok: false, status: 403 });
    const err = await api.get('/anything').catch((e) => e);
    expect(err).toBeInstanceOf(ApiError);
    expect((err as ApiError).message).toBe('Accès refusé');
    expect((err as ApiError).status).toBe(403);
  });
});
