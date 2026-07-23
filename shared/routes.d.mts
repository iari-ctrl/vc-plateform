// Type surface for `routes.mjs` (plain ESM, shared between the Node sitemap
// script and the TS client bundle). The runtime values live in the `.mjs`;
// this file only describes them for `tsc` / the Vite build.

export type Changefreq = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export interface StaticRoute {
  path: string;
  changefreq: Changefreq;
  priority: string;
}

export interface LegacyRedirect {
  from: string;
  to: string;
}

export const STATIC_ROUTES: readonly StaticRoute[];
export const LEGACY_REDIRECTS: readonly LegacyRedirect[];
export const EXECUTABLE_ROUTE_PATTERNS: readonly string[];
export const PUBLIC_ROUTE_PATTERNS: readonly string[];
export const NOINDEX_ROUTE_PATTERNS: readonly string[];
export const OG_IMAGE_BY_SEGMENT: Readonly<Record<string, string>>;

export function firstSegment(unlocalizedPath: string): string;
export function matchesRoutePattern(path: string, pattern: string): boolean;
export function isNoindexPath(unlocalizedPath: string): boolean;
export function isPublicRoutePath(unlocalizedPath: string): boolean;
export function ogImageKeyForPath(unlocalizedPath: string): string | undefined;
