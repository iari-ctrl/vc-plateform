import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

/**
 * Renders bundled content instantly, then overlays fresh data from the API when
 * the server is reachable. This keeps the app fully usable offline / as a guest,
 * while letting admin/CMS edits surface on the public site.
 *
 * Backed by TanStack Query: the bundled `fallback` is seeded as stale initial
 * data so it shows immediately *and* triggers a background refetch, and results
 * are cached/deduped across mounts (e.g. navigating back to a list page).
 */
export function useApiData<T>(path: string | null, fallback: T) {
  const { apiUp, ready } = useAuth();
  const enabled = ready && apiUp && !!path;

  const query = useQuery<T>({
    queryKey: ['api', path],
    queryFn: () => api.get<T>(path as string),
    enabled,
    // Seed the bundle and mark it stale so the API copy is fetched on mount.
    initialData: fallback,
    initialDataUpdatedAt: 0,
  });

  // `?? fallback` keeps the bundled copy if the API ever answers with null.
  return { data: query.data ?? fallback, loading: query.isFetching };
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
export function useApiItem<T>(path: string | null, fallback: T | undefined) {
  const { apiUp, ready } = useAuth();
  const enabled = ready && apiUp && !!path;

  const query = useQuery<T>({
    queryKey: ['api', path],
    queryFn: () => api.get<T>(path as string),
    enabled,
    initialData: fallback,
    initialDataUpdatedAt: 0,
    // A missing item is a 404, not a transient failure — don't retry.
    retry: false,
  });

  const item = query.data ?? fallback;

  // "Settled" = we've concluded what to show: auth isn't ready yet (can't fetch,
  // so we only know once a bundled copy exists), the query is disabled
  // (offline / no path → the bundle is the final answer), or it has resolved.
  const settled = !ready ? false : !enabled || query.isSuccess || query.isError;

  // Pending only when we have nothing to show yet and haven't settled.
  return { item, pending: !settled && item == null };
}
