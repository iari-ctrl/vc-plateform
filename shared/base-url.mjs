// Cross-runtime URL helpers shared by Vite, React Router and public assets.
// Keep this module pure: it runs in Node during configuration and in the browser.

const URL_ORIGIN = 'https://base.invalid';

/** Return the deployment base in Vite's canonical form: leading and trailing slash. */
export function normalizeBaseUrl(value) {
  const raw = String(value ?? '').trim();
  if (!raw) return '/';

  let pathname;
  try {
    pathname = /^[a-z][a-z\d+.-]*:\/\//i.test(raw)
      ? new URL(raw).pathname
      : new URL(raw.startsWith('/') ? raw : `/${raw}`, URL_ORIGIN).pathname;
  } catch {
    pathname = raw;
  }

  const normalized = `/${pathname}`.replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  return normalized === '' ? '/' : `${normalized}/`;
}

function joinBasePath(path, baseUrl, preserveTrailingSlash) {
  const raw = String(path ?? '').trim();
  const suffixIndex = raw.search(/[?#]/);
  const pathname = suffixIndex === -1 ? raw : raw.slice(0, suffixIndex);
  const suffix = suffixIndex === -1 ? '' : raw.slice(suffixIndex);
  const hadTrailingSlash = pathname.length > 1 && pathname.endsWith('/');
  const relativePath = pathname
    .replace(/^(?:\.\/)+/, '')
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  if (relativePath.split('/').includes('..')) {
    throw new TypeError(`Path must stay within the deployment base: "${path}"`);
  }

  let resolved = relativePath ? `${normalizeBaseUrl(baseUrl)}${relativePath}` : normalizeBaseUrl(baseUrl);
  if (preserveTrailingSlash && hadTrailingSlash && !resolved.endsWith('/')) resolved += '/';
  return `${resolved}${suffix}`;
}

/** Prefix an application route for a hard navigation outside React Router. */
export function appRouteUrl(routePath, baseUrl) {
  return joinBasePath(routePath, baseUrl, true);
}

/** Prefix a file served from Vite's public directory. */
export function publicAssetUrl(assetPath, baseUrl) {
  return joinBasePath(assetPath, baseUrl, false);
}

/**
 * Resolve the canonical site base without assuming a production origin.
 * `configuredSiteUrl` may be an origin or the full deployed base. When absent,
 * callers may supply the current runtime origin. With neither, no URL is invented.
 */
export function resolveSiteBaseUrl(configuredSiteUrl, baseUrl, runtimeOrigin) {
  const configured = String(configuredSiteUrl ?? '').trim();
  const runtime = String(runtimeOrigin ?? '').trim();
  const source = configured || runtime;
  if (!source) return undefined;

  let url;
  try {
    url = new URL(source);
  } catch {
    throw new TypeError(`Invalid canonical site URL: "${source}"`);
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new TypeError(`Canonical site URL must use HTTP(S): "${source}"`);
  }

  const deploymentBase = normalizeBaseUrl(baseUrl);
  const configuredBase = normalizeBaseUrl(url.pathname);
  if (configured && configuredBase !== '/' && configuredBase !== deploymentBase) {
    throw new TypeError(
      `Canonical site path "${configuredBase}" must match the deployment base "${deploymentBase}"`,
    );
  }

  url.pathname = configuredBase === '/' ? deploymentBase : configuredBase;
  url.search = '';
  url.hash = '';
  return url.toString().replace(/\/$/, '');
}
