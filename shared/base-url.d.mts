// Type surface for `base-url.mjs`, shared between Node configuration and the client.

export function normalizeBaseUrl(value?: string | null): string;
export function appRouteUrl(routePath: string, baseUrl?: string | null): string;
export function publicAssetUrl(assetPath: string, baseUrl?: string | null): string;
export function resolveSiteBaseUrl(
  configuredSiteUrl?: string | null,
  baseUrl?: string | null,
  runtimeOrigin?: string | null,
): string | undefined;
