const FRAGMENT = /^#[A-Za-z0-9][A-Za-z0-9:._-]*$/;

function hasControlOrWhitespace(value) {
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code <= 0x20 || code === 0x7f) return true;
  }
  return false;
}

/**
 * Validate a URL coming from editorial data.
 *
 * External links are HTTPS-only. Internal routes and same-page fragments must
 * be enabled explicitly by the caller because they follow different routing
 * and asset contracts.
 */
export function safeEditorialUrl(value, options = {}) {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  if (!trimmed || hasControlOrWhitespace(trimmed) || trimmed.includes('\\')) return undefined;

  if (options.allowFragment && FRAGMENT.test(trimmed)) return trimmed;
  if (options.allowInternal && trimmed.startsWith('/') && !trimmed.startsWith('//')) return trimmed;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'https:' || url.username || url.password) return undefined;
    return trimmed;
  } catch {
    return undefined;
  }
}

export function isSafeEditorialUrl(value, options = {}) {
  return safeEditorialUrl(value, options) !== undefined;
}
