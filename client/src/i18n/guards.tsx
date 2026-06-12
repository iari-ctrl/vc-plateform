import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { detectLocale, isLocale, EN_ENABLED } from './config';

/**
 * Bare `/` → redirect once to the detected locale home (`/fr` or `/en`).
 * This is the *only* language-detection redirect (cf. ADR §1.2 / §1.9): content
 * URLs are already locale-prefixed, so crawlers are never bounced.
 */
export function RootRedirect() {
  return <Navigate to={`/${detectLocale()}`} replace />;
}

/**
 * Validates the `:locale` segment and renders the app shell.
 *
 * - Valid (`/fr`, `/en`) → keep `<html lang>` in sync with the page, then render
 *   `MainLayout` (whose `<Outlet/>` shows the matched child route).
 * - Invalid → a legacy unprefixed deep link (`/paths`) or an unsupported code.
 *   We redirect once, prepending the detected locale to the original path so the
 *   deep link survives (`/paths` → `/fr/paths`). Unsupported 2-letter codes fall
 *   back to the default locale and then resolve as NotFound — acceptable for a
 *   two-language site and cheaper than guessing the user's intent.
 */
export function LocaleBoundary() {
  const { locale } = useParams();
  const location = useLocation();
  const valid = isLocale(locale);

  useEffect(() => {
    // Reflect the language of the page actually being viewed. We intentionally
    // do NOT persist a preference here — only the explicit switcher does — so a
    // shared `/en/…` link never silently overrides a visitor's own choice.
    // While EN is not shipped (EN_ENABLED=false) the content is French even under
    // `/en`, so we force `lang="fr"` to avoid lying to screen readers / crawlers.
    if (isLocale(locale)) document.documentElement.lang = EN_ENABLED ? locale : 'fr';
  }, [locale]);

  if (!valid) {
    const target = `/${detectLocale()}${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={target} replace />;
  }

  return <MainLayout />;
}
