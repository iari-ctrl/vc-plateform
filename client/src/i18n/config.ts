// i18n configuration — the single source of truth for supported locales.
// Adding a third language later = extend LOCALES (+ a data/<locale> folder in
// Phase 3); nothing here is structural. UI strings are NOT handled here — that
// is Phase 2 (chrome i18n). This module is framework-agnostic (no React) so it
// can be reused by route guards, tests, and a future SSR/prerender step.

export const LOCALES = ['fr', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

/** Default language, used as the fallback everywhere (cf. ADR §1: FR by default). */
export const DEFAULT_LOCALE: Locale = 'fr';

/** Full names for the language selector (the chrome itself is not translated yet). */
export const LOCALE_NAMES: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
};

/** Short codes shown in the compact switcher. */
export const LOCALE_SHORT: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
};

const STORAGE_KEY = 'vc_locale';

/** Narrowing type guard — also used to validate the `:locale` route segment. */
export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * The explicit, user-chosen preference. Stored in localStorage (client) and
 * mirrored to a 1-year cookie so a future server/prerender step (Phase 5) can
 * read it without shipping JS. Returns null when no choice has been made.
 */
export function readStoredLocale(): Locale | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) return stored;
  } catch {
    // localStorage can throw in private mode / sandboxed iframes — ignore.
  }
  const match = typeof document !== 'undefined' && document.cookie.match(/(?:^|;\s*)vc_locale=([^;]+)/);
  if (match) {
    const value = decodeURIComponent(match[1]);
    if (isLocale(value)) return value;
  }
  return null;
}

/** Persist the user's explicit language choice (localStorage + cookie). */
export function storeLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // ignore — cookie below is enough on its own.
  }
  if (typeof document !== 'undefined') {
    document.cookie = `${STORAGE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`;
  }
}

/** Best-effort browser language; only a fallback when no explicit choice exists. */
function browserLocale(): Locale | null {
  if (typeof navigator === 'undefined') return null;
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language];
  for (const lang of langs) {
    const base = lang?.toLowerCase().split('-')[0];
    if (isLocale(base)) return base;
  }
  return null;
}

/**
 * Resolve the locale to use when the URL carries none — i.e. only at the root
 * `/` or on a legacy unprefixed path. Order: explicit preference → browser
 * language → default. This never runs on an already-prefixed content URL, so
 * crawlers reaching `/fr/…` or `/en/…` are never redirected by detection
 * (cf. ADR §1.9: no IP/Accept-Language auto-redirect that would block crawlers).
 */
export function detectLocale(): Locale {
  return readStoredLocale() ?? browserLocale() ?? DEFAULT_LOCALE;
}
