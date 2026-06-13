import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

/**
 * Keep the bundled copy when the API answers with null *or* an empty list while
 * the bundle has content — an empty array (e.g. an un-seeded DB) must not blank a
 * page that ships with editorial content.
 */
function preferBundle<T>(fresh: T, fallback: T): T {
  const apiBlank =
    fresh == null ||
    (Array.isArray(fresh) && fresh.length === 0 && Array.isArray(fallback) && fallback.length > 0);
  return apiBlank ? fallback : fresh;
}

/**
 * Renders bundled content instantly, then overlays fresh data from the API when
 * the server is reachable. This keeps the app fully usable offline / as a guest,
 * while letting admin/CMS edits surface on the public site.
 *
 * Backed by TanStack Query: the bundled `fallback` is seeded as stale initial
 * data so it shows immediately *and* triggers a background refetch, and results
 * are cached/deduped across mounts (e.g. navigating back to a list page).
 *
 * The query is *not* gated on `apiUp`. TanStack owns availability: a failed fetch
 * leaves the seeded bundle on screen, and `AuthContext` invalidates `['api']`
 * when the server (re)appears, so an API that starts after the client — or drops
 * then returns — refreshes on its own, no reload.
 *
 * `staleTime` defaults to the client-wide policy (a few minutes — fine for
 * editorial content); pass an override for content that changes faster/slower.
 */
export function useApiData<T>(path: string | null, fallback: T, options?: { staleTime?: number }) {
  const { ready } = useAuth();
  const enabled = ready && !!path;

  const query = useQuery<T>({
    queryKey: ['api', path],
    queryFn: () => api.get<T>(path as string),
    enabled,
    // Seed the bundle and mark it stale so the API copy is fetched on mount.
    initialData: fallback,
    initialDataUpdatedAt: 0,
    ...(options?.staleTime !== undefined && { staleTime: options.staleTime }),
  });

  // Derive in the render body (not `select`): `select` would drop TanStack's
  // `initialData` "defined" guarantee and widen `data` to `T | undefined`,
  // forcing every consumer to null-check.
  return { data: preferBundle(query.data, fallback), loading: query.isFetching };
}

/**
 * Single-item variant for detail pages (lessons, blog posts, case studies…).
 *
 * Renders the bundled item instantly when present, then overlays the API copy —
 * so CMS edits surface and the page stays usable offline / as a guest. When the
 * slug is *not* in the bundle (e.g. content created via the CMS), `item` starts
 * undefined and `pending` stays true until the API resolves, so callers can show
 * a loader instead of flashing a 404. Once settled, `!item` means a genuine 404.
 */
export function useApiItem<T>(path: string | null, fallback: T | undefined, options?: { staleTime?: number }) {
  const { ready } = useAuth();
  const enabled = ready && !!path;

  const query = useQuery<T>({
    queryKey: ['api', path],
    queryFn: () => api.get<T>(path as string),
    enabled,
    initialData: fallback,
    initialDataUpdatedAt: 0,
    // A missing item is a 404, not a transient failure — don't retry.
    retry: false,
    ...(options?.staleTime !== undefined && { staleTime: options.staleTime }),
  });

  const item = query.data ?? fallback;

  // "Settled" = we've concluded what to show: auth isn't ready yet (can't fetch,
  // so we only know once a bundled copy exists), the query is disabled
  // (no path → the bundle is the final answer), or it has resolved (success or
  // error — an unreachable API errors out and leaves the bundle showing).
  const settled = !ready ? false : !enabled || query.isSuccess || query.isError;

  // Pending only when we have nothing to show yet and haven't settled.
  return { item, pending: !settled && item == null };
}
