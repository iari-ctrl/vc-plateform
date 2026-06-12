import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_LOCALE, LOCALES, isLocale, type Locale } from '@/i18n/config';

const SITE_NAME = 'VC Premium Experience';
const FALLBACK_SITE_URL = 'https://vcpx.io';
const DEFAULT_TITLE = `${SITE_NAME} — Comprendre, tester, apprendre le capital-risque`;
const DEFAULT_DESCRIPTION =
  "Comprendre le capital-risque, tester son alignement avec le métier, puis apprendre selon son niveau. Une plateforme éditoriale d'introspection et d'apprentissage.";

const OG_IMAGES = {
  default: '/og/default.png',
  lesson: '/og/lesson.png',
  blog: '/og/blog.png',
  'case-study': '/og/case-study.png',
  course: '/og/course.png',
  path: '/og/path.png',
  glossary: '/og/glossary.png',
  simulator: '/og/simulator.png',
  memo: '/og/memo.png',
  'anti-portfolio': '/og/anti-portfolio.png',
} as const;

type OgImageKey = keyof typeof OG_IMAGES;
type OgType = 'website' | 'article';

export interface PageMetaOptions {
  /** Open Graph type. Use `article` for long-form shareable content. */
  type?: OgType;
  /** One of the bundled OG image keys, a public path, or an absolute URL. */
  image?: OgImageKey | string;
  /** In-app canonical path without locale, e.g. `/lessons/foo`. */
  canonicalPath?: string;
  /** Prevent indexing for private or utility pages. */
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

const OG_LOCALES: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_US',
};

function plainText(value: string | undefined): string {
  return (value ?? '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[#*_`[\]()>{}|~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function pageTitle(title: string | undefined): string {
  const clean = plainText(title);
  return clean ? `${clean} · ${SITE_NAME}` : DEFAULT_TITLE;
}

function pageDescription(description: string | undefined): string {
  return plainText(description) || DEFAULT_DESCRIPTION;
}

function siteUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL?.trim();
  const raw = configured || (typeof window !== 'undefined' ? window.location.origin : FALLBACK_SITE_URL);

  try {
    const url = new URL(raw);
    return `${url.origin}${url.pathname.replace(/\/+$/, '')}`;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

function toAbsoluteUrl(pathOrUrl: string): string {
  try {
    return new URL(pathOrUrl).toString();
  } catch {
    const path = pathOrUrl.startsWith('/') ? pathOrUrl.slice(1) : pathOrUrl;
    return new URL(path, `${siteUrl()}/`).toString();
  }
}

function stripLocale(pathname: string): string {
  const segments = pathname.split('/');
  if (isLocale(segments[1])) {
    const rest = `/${segments.slice(2).join('/')}`;
    return rest === '/' ? '/' : rest.replace(/\/+$/, '');
  }
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
}

function currentLocale(pathname: string): Locale {
  const first = pathname.split('/')[1];
  return isLocale(first) ? first : DEFAULT_LOCALE;
}

function cleanPath(path: string): string {
  const [pathname] = path.split(/[?#]/);
  const normalized = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return normalized === '/' ? '/' : normalized.replace(/\/+$/, '');
}

function localizePath(path: string, locale: Locale): string {
  const normalized = cleanPath(path);
  const first = normalized.slice(1).split('/', 1)[0];
  if (isLocale(first)) return normalized;
  return normalized === '/' ? `/${locale}` : `/${locale}${normalized}`;
}

function resolveOgImage(image: PageMetaOptions['image']): string {
  if (!image) return OG_IMAGES.default;
  return Object.prototype.hasOwnProperty.call(OG_IMAGES, image) ? OG_IMAGES[image as OgImageKey] : image;
}

function findMeta(attribute: 'name' | 'property', key: string): HTMLMetaElement | undefined {
  return Array.from(document.head.querySelectorAll<HTMLMetaElement>('meta')).find(
    (tag) => tag.getAttribute(attribute) === key,
  );
}

function upsertMeta(attribute: 'name' | 'property', key: string, content: string | undefined): void {
  const existing = findMeta(attribute, key);
  if (!content) {
    existing?.remove();
    return;
  }

  const tag = existing ?? document.createElement('meta');
  tag.setAttribute(attribute, key);
  tag.setAttribute('content', content);
  if (!existing) document.head.appendChild(tag);
}

function upsertCanonical(href: string): void {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

function setHreflang(path: string): void {
  document.head.querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]').forEach((tag) => tag.remove());

  for (const locale of LOCALES) {
    const tag = document.createElement('link');
    tag.setAttribute('rel', 'alternate');
    tag.setAttribute('hreflang', locale);
    tag.setAttribute('href', toAbsoluteUrl(localizePath(path, locale)));
    document.head.appendChild(tag);
  }

  const fallback = document.createElement('link');
  fallback.setAttribute('rel', 'alternate');
  fallback.setAttribute('hreflang', 'x-default');
  fallback.setAttribute('href', toAbsoluteUrl(localizePath(path, DEFAULT_LOCALE)));
  document.head.appendChild(fallback);
}

function setOpenGraphLocaleAlternates(locale: Locale): void {
  document.head.querySelectorAll<HTMLMetaElement>('meta[property="og:locale:alternate"]').forEach((tag) => tag.remove());

  for (const alternate of LOCALES.filter((candidate) => candidate !== locale)) {
    const tag = document.createElement('meta');
    tag.setAttribute('property', 'og:locale:alternate');
    tag.setAttribute('content', OG_LOCALES[alternate]);
    document.head.appendChild(tag);
  }
}

/** Sets page-level SEO, social card, canonical and i18n alternate metadata. */
export function usePageMeta(title?: string, description?: string, options: PageMetaOptions = {}) {
  const location = useLocation();
  const {
    type = 'website',
    image,
    canonicalPath,
    noindex = false,
    publishedTime,
    modifiedTime,
  } = options;

  useEffect(() => {
    const locale = currentLocale(location.pathname);
    const unlocalizedPath = cleanPath(canonicalPath ?? stripLocale(location.pathname));
    const canonicalUrl = toAbsoluteUrl(localizePath(unlocalizedPath, locale));
    const formattedTitle = pageTitle(title);
    const formattedDescription = pageDescription(description);
    const imageUrl = toAbsoluteUrl(resolveOgImage(image));

    document.title = formattedTitle;

    upsertMeta('name', 'description', formattedDescription);
    upsertMeta('name', 'robots', noindex ? 'noindex,nofollow' : undefined);
    upsertCanonical(canonicalUrl);
    setHreflang(unlocalizedPath);

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:title', formattedTitle);
    upsertMeta('property', 'og:description', formattedDescription);
    upsertMeta('property', 'og:url', canonicalUrl);
    upsertMeta('property', 'og:image', imageUrl);
    upsertMeta('property', 'og:image:secure_url', imageUrl);
    upsertMeta('property', 'og:image:type', 'image/png');
    upsertMeta('property', 'og:image:width', '1200');
    upsertMeta('property', 'og:image:height', '630');
    upsertMeta('property', 'og:image:alt', `${SITE_NAME} — ${plainText(title) || 'capital-risque'}`);
    upsertMeta('property', 'og:locale', OG_LOCALES[locale]);
    setOpenGraphLocaleAlternates(locale);

    upsertMeta('property', 'article:published_time', type === 'article' ? publishedTime : undefined);
    upsertMeta('property', 'article:modified_time', type === 'article' ? modifiedTime : undefined);

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', formattedTitle);
    upsertMeta('name', 'twitter:description', formattedDescription);
    upsertMeta('name', 'twitter:image', imageUrl);
  }, [
    canonicalPath,
    description,
    image,
    location.pathname,
    modifiedTime,
    noindex,
    publishedTime,
    title,
    type,
  ]);
}
