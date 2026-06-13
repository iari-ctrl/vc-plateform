import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { DEFAULT_LOCALE, LOCALES, type Locale } from '@/i18n/config';
import { cleanPath, currentLocale, localizePath, stripLocale } from '@/i18n/paths';
import { isNoindexPath, ogImageKeyForPath } from '@/i18n/routes';
import { plainText } from './markdown-text';

const SITE_NAME = 'VC Premium Experience';
const FALLBACK_SITE_URL = 'https://vcpx.io';
const DEFAULT_TITLE = `${SITE_NAME} — Comprendre, tester, apprendre le capital-risque`;
const DEFAULT_DESCRIPTION =
  "Comprendre le capital-risque, tester son alignement avec le métier, puis apprendre selon son niveau. Une plateforme éditoriale d'introspection et d'apprentissage.";

// Open Graph image key → file. The presentation table; the page → key mapping
// lives in the shared route registry (shared/routes.mjs) so pages no longer
// hard-code their card — see `ogImageKeyForPath`.
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
  /** One of the bundled OG image keys, a public path, or an absolute URL.
   *  Omit to derive the card from the route (cf. shared/routes.mjs). */
  image?: OgImageKey | string;
  /** In-app canonical path without locale, e.g. `/lessons/foo`. */
  canonicalPath?: string;
  /** Force the index policy. Omit to derive it from the route registry. */
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

const OG_LOCALES: Record<Locale, string> = {
  fr: 'fr_FR',
  en: 'en_US',
};

// --- pure text helpers -------------------------------------------------------

/** Strip markup without truncating — SEO formats the full string itself. */
const clean = (value: string | undefined): string => plainText(value, Infinity);

function pageTitle(title: string | undefined): string {
  const text = clean(title);
  return text ? `${text} · ${SITE_NAME}` : DEFAULT_TITLE;
}

function pageDescription(description: string | undefined): string {
  return clean(description) || DEFAULT_DESCRIPTION;
}

// --- pure URL helpers --------------------------------------------------------

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

function resolveOgImage(image: string | undefined): string {
  if (!image) return OG_IMAGES.default;
  return Object.prototype.hasOwnProperty.call(OG_IMAGES, image) ? OG_IMAGES[image as OgImageKey] : image;
}

// --- pure meta model ---------------------------------------------------------

interface MetaModel {
  title: string;
  titlePlain: string;
  description: string;
  locale: Locale;
  unlocalizedPath: string;
  canonicalUrl: string;
  imageUrl: string;
  type: OgType;
  noindex: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

/** The whole SEO computation, pure and testable — no DOM, no React. */
function buildMetaModel(pathname: string, title: string | undefined, description: string | undefined, options: PageMetaOptions): MetaModel {
  const { type = 'website', image, canonicalPath, noindex, publishedTime, modifiedTime } = options;
  const locale = currentLocale(pathname);
  const unlocalizedPath = cleanPath(canonicalPath ?? stripLocale(pathname));
  const imageKey = image ?? ogImageKeyForPath(unlocalizedPath);

  return {
    title: pageTitle(title),
    titlePlain: clean(title),
    description: pageDescription(description),
    locale,
    unlocalizedPath,
    canonicalUrl: toAbsoluteUrl(localizePath(unlocalizedPath, locale)),
    imageUrl: toAbsoluteUrl(resolveOgImage(imageKey)),
    type,
    noindex: noindex ?? isNoindexPath(unlocalizedPath),
    publishedTime,
    modifiedTime,
  };
}

interface MetaTag {
  attr: 'name' | 'property';
  key: string;
  content?: string;
}

/** Flatten the model into the `<meta>` tags to upsert (undefined content removes). */
function buildMetaTags(m: MetaModel): MetaTag[] {
  return [
    { attr: 'name', key: 'description', content: m.description },
    { attr: 'name', key: 'robots', content: m.noindex ? 'noindex,nofollow' : undefined },
    { attr: 'property', key: 'og:site_name', content: SITE_NAME },
    { attr: 'property', key: 'og:type', content: m.type },
    { attr: 'property', key: 'og:title', content: m.title },
    { attr: 'property', key: 'og:description', content: m.description },
    { attr: 'property', key: 'og:url', content: m.canonicalUrl },
    { attr: 'property', key: 'og:image', content: m.imageUrl },
    { attr: 'property', key: 'og:image:secure_url', content: m.imageUrl },
    { attr: 'property', key: 'og:image:type', content: 'image/png' },
    { attr: 'property', key: 'og:image:width', content: '1200' },
    { attr: 'property', key: 'og:image:height', content: '630' },
    { attr: 'property', key: 'og:image:alt', content: `${SITE_NAME} — ${m.titlePlain || 'capital-risque'}` },
    { attr: 'property', key: 'og:locale', content: OG_LOCALES[m.locale] },
    { attr: 'property', key: 'article:published_time', content: m.type === 'article' ? m.publishedTime : undefined },
    { attr: 'property', key: 'article:modified_time', content: m.type === 'article' ? m.modifiedTime : undefined },
    { attr: 'name', key: 'twitter:card', content: 'summary_large_image' },
    { attr: 'name', key: 'twitter:title', content: m.title },
    { attr: 'name', key: 'twitter:description', content: m.description },
    { attr: 'name', key: 'twitter:image', content: m.imageUrl },
  ];
}

// --- DOM application (impure) ------------------------------------------------

function upsertMeta(attribute: 'name' | 'property', key: string, content: string | undefined): void {
  const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
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

/** Write a computed model to the document head. */
function applyMetaModel(m: MetaModel): void {
  document.title = m.title;
  for (const tag of buildMetaTags(m)) upsertMeta(tag.attr, tag.key, tag.content);
  upsertCanonical(m.canonicalUrl);
  setHreflang(m.unlocalizedPath);
  setOpenGraphLocaleAlternates(m.locale);
}

/** Sets page-level SEO, social card, canonical and i18n alternate metadata. */
export function usePageMeta(title?: string, description?: string, options: PageMetaOptions = {}) {
  const { pathname } = useLocation();
  const { type, image, canonicalPath, noindex, publishedTime, modifiedTime } = options;

  useEffect(() => {
    applyMetaModel(
      buildMetaModel(pathname, title, description, {
        type,
        image,
        canonicalPath,
        noindex,
        publishedTime,
        modifiedTime,
      }),
    );
  }, [pathname, title, description, type, image, canonicalPath, noindex, publishedTime, modifiedTime]);
}
