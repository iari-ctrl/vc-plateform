import { useCallback } from 'react';
import {
  useNavigate as useRouterNavigate,
  type NavigateOptions,
  type To,
} from 'react-router-dom';
import { isLocale, type Locale } from './config';
import { localizePath, stripLocale } from './paths';
import { useLocale } from './useLocale';

/**
 * Locale-aware navigation helpers shared between the routing components
 * (`Link`/`NavLink` in `routing.tsx`) and call sites. Kept in a plain module
 * (no component exports) so React Fast Refresh stays happy.
 *
 * The actual path math (`localizePath`, `stripLocale`, …) lives in `./paths`,
 * the single source shared with SEO and the sitemap script. Re-exported here so
 * existing `from './navigation'` call sites — including the `[[slug]]`/`{{slug}}`
 * glossary markers in `lib/markdown.tsx` (cf. ADR §3: marqueurs inchangés) —
 * keep working unchanged.
 */
export { localizePath };

export function localizeTo(to: To, locale: Locale): To {
  if (typeof to === 'string') return localizePath(to, locale);
  if (to.pathname) return { ...to, pathname: localizePath(to.pathname, locale) };
  return to;
}

/**
 * Replace the locale segment of a full pathname while preserving the rest of the
 * route — used by the language switcher (`/fr/glossary` → `/en/glossary`). If the
 * path has no locale segment yet, it is prefixed instead.
 */
export function swapLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split('/');
  if (isLocale(segments[1])) {
    segments[1] = next;
    return segments.join('/') || `/${next}`;
  }
  return localizePath(pathname, next);
}

/**
 * Drop-in for react-router's `useNavigate` that prefixes string destinations
 * with the active locale. Numeric history navigation (`navigate(-1)`) is passed
 * through unchanged.
 */
export function useNavigate() {
  const navigate = useRouterNavigate();
  const locale = useLocale();
  return useCallback(
    (to: To | number, options?: NavigateOptions): void => {
      if (typeof to === 'number') {
        navigate(to);
        return;
      }
      navigate(localizeTo(to, locale), options);
    },
    [navigate, locale],
  );
}

/**
 * Helper to check if a navigation link is active, accounting for localized paths and query parameters.
 */
export function isLinkActive(to: string, location: { pathname: string; search: string }): boolean {
  const [targetPath, targetQuery] = to.split('?');

  const currentPathClean = stripLocale(location.pathname);
  const targetPathClean = stripLocale(targetPath);

  if (currentPathClean !== targetPathClean) return false;

  if (targetQuery) {
    return location.search.includes(targetQuery);
  } else {
    if (location.search.includes('type=case')) return false;
  }

  return true;
}
