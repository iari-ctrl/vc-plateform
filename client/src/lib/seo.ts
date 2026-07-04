import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { plainText } from './markdown-text';

const SITE_NAME = 'VC Premium Experience';
const FALLBACK_SITE_URL = 'https://vcpx.io';
const DEFAULT_TITLE = `${SITE_NAME} — Intelligence VC, formation et décisions`;
const DEFAULT_DESCRIPTION =
  "Analyser les écosystèmes, suivre des convictions, étudier des décisions et structurer sa progression dans le capital-risque.";

type OgType = 'website' | 'article';

export interface PageMetaOptions {
  type?: OgType;
  image?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

const clean = (value: string | undefined): string => plainText(value, Infinity);

function pageTitle(title: string | undefined): string {
  const text = clean(title);
  return text ? `${text} · ${SITE_NAME}` : DEFAULT_TITLE;
}

function pageDescription(description: string | undefined): string {
  return clean(description) || DEFAULT_DESCRIPTION;
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

interface MetaModel {
  title: string;
  titlePlain: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  type: OgType;
  noindex: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

function buildMetaModel(pathname: string, title: string | undefined, description: string | undefined, options: PageMetaOptions): MetaModel {
  const { type = 'website', image, noindex, publishedTime, modifiedTime } = options;
  const imageUrl = image ? toAbsoluteUrl(image) : toAbsoluteUrl('/og/default.png');
  
  return {
    title: pageTitle(title),
    titlePlain: clean(title),
    description: pageDescription(description),
    canonicalUrl: toAbsoluteUrl(pathname),
    imageUrl,
    type,
    noindex: noindex ?? false,
    publishedTime,
    modifiedTime,
  };
}

interface MetaTag {
  attr: 'name' | 'property';
  key: string;
  content?: string;
}

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

function upsertCanonical(href: string): void {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
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
  const { type, image, noindex, publishedTime, modifiedTime } = options;

  useEffect(() => {
    applyMetaModel(
      buildMetaModel(pathname, title, description, {
        type,
        image,
        noindex,
        publishedTime,
        modifiedTime,
      }),
    );
  }, [pathname, title, description, type, image, noindex, publishedTime, modifiedTime]);
}
