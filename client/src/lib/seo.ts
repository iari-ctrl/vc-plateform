import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { appRouteUrl, publicAssetUrl, resolveSiteBaseUrl } from '@shared/base-url.mjs';
import { isNoindexPath, ogImageKeyForPath } from '@shared/routes.mjs';
import { plainText } from './markdown-text';

const SITE_NAME = 'VC Premium Experience';
const DEFAULT_TITLE = `${SITE_NAME} — Intelligence VC, formation et décisions`;
export const NOT_FOUND_TITLE = 'Terra Incognita';
const DEFAULT_DESCRIPTION =
  "Analyser les écosystèmes, suivre des convictions, étudier des décisions et structurer sa progression dans le capital-risque.";

type OgType = 'website' | 'article';
type OgImageKey = 'anti-portfolio' | 'blog' | 'case-study' | 'course' | 'default' | 'glossary' | 'lesson' | 'memo' | 'path' | 'simulator';

export interface PageMetaOptions {
  type?: OgType;
  image?: string;
  noindex?: boolean;
  canonical?: boolean;
  notFound?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

const clean = (value: string | undefined): string => plainText(value, Infinity);

const OG_IMAGE_BY_KEY: Record<OgImageKey, string> = {
  'anti-portfolio': 'og/anti-portfolio.png',
  blog: 'og/blog.png',
  'case-study': 'og/case-study.png',
  course: 'og/course.png',
  default: 'og/default.png',
  glossary: 'og/glossary.png',
  lesson: 'og/lesson.png',
  memo: 'og/memo.png',
  path: 'og/path.png',
  simulator: 'og/simulator.png',
};

function pageTitle(title: string | undefined): string {
  const text = clean(title);
  return text ? `${text} · ${SITE_NAME}` : DEFAULT_TITLE;
}

function pageDescription(description: string | undefined): string {
  return clean(description) || DEFAULT_DESCRIPTION;
}

function deploymentBaseUrl(): string {
  return import.meta.env.VITE_BASE_URL ?? import.meta.env.BASE_URL;
}

function siteUrl(): string {
  const configured = import.meta.env.VITE_SITE_URL?.trim();
  const runtimeOrigin = typeof window !== 'undefined' ? window.location.origin : undefined;
  const resolved = resolveSiteBaseUrl(configured, deploymentBaseUrl(), runtimeOrigin);
  if (!resolved) throw new Error('Canonical site URL unavailable: configure VITE_SITE_URL outside the browser.');
  return resolved;
}

function siteOrigin(): string {
  return new URL(siteUrl()).origin;
}

function toAbsoluteAssetUrl(pathOrUrl: string): string {
  try {
    return new URL(pathOrUrl).toString();
  } catch {
    return new URL(publicAssetUrl(pathOrUrl, deploymentBaseUrl()), siteOrigin()).toString();
  }
}

function toAbsoluteRouteUrl(pathname: string): string {
  return new URL(appRouteUrl(pathname, deploymentBaseUrl()), siteOrigin()).toString();
}

function ogImageForPath(pathname: string): string {
  const key = ogImageKeyForPath(pathname) as OgImageKey | undefined;
  return key ? OG_IMAGE_BY_KEY[key] ?? OG_IMAGE_BY_KEY.default : OG_IMAGE_BY_KEY.default;
}

export interface MetaModel {
  title: string;
  titlePlain: string;
  description: string;
  canonicalUrl?: string;
  imageUrl: string;
  type: OgType;
  noindex: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

export function buildMetaModel(pathname: string, title: string | undefined, description: string | undefined, options: PageMetaOptions): MetaModel {
  const {
    type = 'website',
    image,
    noindex,
    canonical = true,
    notFound = false,
    publishedTime,
    modifiedTime,
  } = options;
  const effectiveTitle = notFound ? NOT_FOUND_TITLE : title;
  const effectiveDescription = notFound ? undefined : description;
  const effectiveNoindex = notFound || (noindex ?? isNoindexPath(pathname));
  const imageUrl = toAbsoluteAssetUrl(image ?? ogImageForPath(pathname));

  return {
    title: pageTitle(effectiveTitle),
    titlePlain: clean(effectiveTitle),
    description: pageDescription(effectiveDescription),
    canonicalUrl: canonical && !effectiveNoindex ? toAbsoluteRouteUrl(pathname) : undefined,
    imageUrl,
    type: notFound ? 'website' : type,
    noindex: effectiveNoindex,
    publishedTime: notFound ? undefined : publishedTime,
    modifiedTime: notFound ? undefined : modifiedTime,
  };
}

interface MetaTag {
  attr: 'name' | 'property';
  key: string;
  content?: string;
}

export function buildMetaTags(m: MetaModel): MetaTag[] {
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
    { attr: 'property', key: 'og:locale', content: 'fr_FR' },
    { attr: 'property', key: 'article:published_time', content: m.type === 'article' ? m.publishedTime : undefined },
    { attr: 'property', key: 'article:modified_time', content: m.type === 'article' ? m.modifiedTime : undefined },
    { attr: 'name', key: 'twitter:card', content: 'summary_large_image' },
    { attr: 'name', key: 'twitter:title', content: m.title },
    { attr: 'name', key: 'twitter:description', content: m.description },
    { attr: 'name', key: 'twitter:image', content: m.imageUrl },
  ];
}

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

function upsertCanonical(href: string | undefined): void {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    tag?.remove();
    return;
  }
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', 'canonical');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
}

function applyMetaModel(m: MetaModel): void {
  document.title = m.title;
  for (const tag of buildMetaTags(m)) upsertMeta(tag.attr, tag.key, tag.content);
  upsertCanonical(m.canonicalUrl);
}

export function usePageMeta(title?: string, description?: string, options: PageMetaOptions = {}) {
  const { pathname } = useLocation();
  const { type, image, noindex, canonical, notFound, publishedTime, modifiedTime } = options;

  useEffect(() => {
    applyMetaModel(
      buildMetaModel(pathname, title, description, {
        type,
        image,
        noindex,
        canonical,
        notFound,
        publishedTime,
        modifiedTime,
      }),
    );
  }, [pathname, title, description, type, image, noindex, canonical, notFound, publishedTime, modifiedTime]);
}

/** Keeps a detail page and its nested NotFoundPage on the same head policy. */
export function useResourcePageMeta(
  resourceExists: boolean,
  title?: string,
  description?: string,
  options: PageMetaOptions = {},
) {
  usePageMeta(title, description, { ...options, notFound: !resourceExists });
}
