import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

/**
 * Renders bundled content instantly, then overlays fresh data from the API when
 * the server is reachable. This keeps the app fully usable offline / as a guest,
 * while letting admin/CMS edits surface on the public site.
 */
export function useApiData<T>(path: string | null, fallback: T) {
  const { apiUp, ready } = useAuth();
  const [data, setData] = useState<T>(fallback);
  const [loading, setLoading] = useState(false);
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  useEffect(() => {
    if (!ready) return;
    if (!apiUp || !path) {
      setData(fallbackRef.current);
      return;
    }
    let active = true;
    setLoading(true);
    api
      .get<T>(path)
      .then((d) => {
        if (active && d != null) setData(d);
      })
      .catch(() => {
        if (active) setData(fallbackRef.current);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [path, apiUp, ready]);

  return { data, loading };
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
  const [item, setItem] = useState<T | undefined>(fallback);
  const [settled, setSettled] = useState(false);
  const fallbackRef = useRef(fallback);
  fallbackRef.current = fallback;

  useEffect(() => {
    if (!ready) {
      setItem(fallbackRef.current);
      setSettled(false);
      return;
    }
    if (!apiUp || !path) {
      setItem(fallbackRef.current);
      setSettled(true);
      return;
    }
    let active = true;
    setSettled(false);
    setItem(fallbackRef.current);
    api
      .get<T>(path)
      .then((d) => {
        if (active && d != null) setItem(d);
      })
      .catch(() => {
        if (active) setItem(fallbackRef.current);
      })
      .finally(() => {
        if (active) setSettled(true);
      });
    return () => {
      active = false;
    };
  }, [path, apiUp, ready]);

  // Pending only when we have nothing to show yet and the API hasn't answered.
  return { item, pending: !settled && item == null };
}
