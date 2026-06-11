import { useLocation } from 'react-router-dom';
import { DEFAULT_LOCALE, isLocale, type Locale } from './config';

/**
 * The active locale, read from the first path segment (`/fr/…` → `fr`).
 *
 * Deriving it from `useLocation` rather than `useParams` means it works for
 * components mounted *outside* the `/:locale` route subtree too — e.g. the
 * global CommandPalette / AuthDialog rendered by `UIProvider` above `<Routes>` —
 * which would otherwise see no `:locale` param. Falls back to the default so it
 * is always safe to call.
 */
export function useLocale(): Locale {
  const { pathname } = useLocation();
  const first = pathname.split('/')[1];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}
