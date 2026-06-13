// Path/locale normalization — the single source of truth for turning an in-app
// path into its canonical, locale-prefixed form. Framework-agnostic (no React,
// no DOM) so it is shared by navigation (`Link`/`useNavigate`), SEO metadata
// (`usePageMeta`: canonical + hreflang) and tests alike.
//
// Before this module the same four helpers were re-implemented in three places
// (navigation, seo, the sitemap script); `seo.ts` even shadowed navigation's
// `localizePath` with a subtly different one, so a canonical URL and its sitemap
// twin could drift apart (duplicate-content risk). Keep all path math here.

import { DEFAULT_LOCALE, isLocale, type Locale } from './config';

/**
 * Normalize a path to its canonical form: drop any query/hash, force a leading
 * slash, and strip trailing slashes (the root `/` excepted). `foo/bar/?q=1` →
 * `/foo/bar`. Use this before building a canonical/sitemap URL.
 */
export function cleanPath(path: string): string {
  const [pathname] = path.split(/[?#]/);
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
}

/**
 * Drop a leading locale segment and normalize the rest: `/fr/glossary/` →
 * `/glossary`, `/fr` → `/`. Paths without a locale segment are just normalized.
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split('/');
  if (isLocale(segments[1])) {
    const rest = `/${segments.slice(2).join('/')}`;
    return rest === '/' ? '/' : rest.replace(/\/+$/, '');
  }
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
}

/** Read the locale carried by a pathname's first segment, or the default. */
export function currentLocale(pathname: string): Locale {
  const first = pathname.split('/')[1];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

/**
 * Prefix an in-app absolute path with the active locale: `/paths` → `/fr/paths`.
 * Pass-throughs (untouched): relative paths, hashes, `mailto:`/`tel:`, absolute
 * URLs, and paths already starting with a locale segment. Query/hash are kept,
 * which is what lets call sites write `to="/glossary?term=tri"`. For a canonical
 * URL, pass a `cleanPath()`-ed argument so there is no query to preserve.
 */
export function localizePath(to: string, locale: Locale): string {
  if (!to.startsWith('/')) return to;
  const firstSegment = to.slice(1).split(/[/?#]/, 1)[0];
  if (isLocale(firstSegment)) return to;
  return to === '/' ? `/${locale}` : `/${locale}${to}`;
}
