import { describe, it, expect } from 'vitest';
import { cleanPath, currentLocale, localizePath, stripLocale } from './paths';

describe('cleanPath', () => {
  it('forces a leading slash and strips query/hash + trailing slashes', () => {
    expect(cleanPath('foo/bar')).toBe('/foo/bar');
    expect(cleanPath('/foo/bar/')).toBe('/foo/bar');
    expect(cleanPath('/foo?q=1#x')).toBe('/foo');
    expect(cleanPath('/foo///')).toBe('/foo');
    expect(cleanPath('/')).toBe('/');
  });
});

describe('stripLocale', () => {
  it('drops a leading locale segment and normalizes', () => {
    expect(stripLocale('/fr/glossary')).toBe('/glossary');
    expect(stripLocale('/en/cases/airbnb')).toBe('/cases/airbnb');
    expect(stripLocale('/fr')).toBe('/');
    expect(stripLocale('/fr/')).toBe('/');
  });

  it('leaves unprefixed paths normalized', () => {
    expect(stripLocale('/glossary')).toBe('/glossary');
    expect(stripLocale('/glossary/')).toBe('/glossary');
    expect(stripLocale('/')).toBe('/');
  });
});

describe('currentLocale', () => {
  it('reads the leading locale or falls back to the default', () => {
    expect(currentLocale('/fr/x')).toBe('fr');
    expect(currentLocale('/en/x')).toBe('en');
    expect(currentLocale('/glossary')).toBe('fr');
    expect(currentLocale('/')).toBe('fr');
  });
});

describe('localizePath', () => {
  it('prefixes an unlocalized path and preserves query/hash', () => {
    expect(localizePath('/paths', 'fr')).toBe('/fr/paths');
    expect(localizePath('/glossary?term=tri', 'en')).toBe('/en/glossary?term=tri');
    expect(localizePath('/', 'fr')).toBe('/fr');
  });

  it('is idempotent on already-localized paths and passes non-routes through', () => {
    expect(localizePath('/fr/paths', 'fr')).toBe('/fr/paths');
    expect(localizePath('/en/paths', 'fr')).toBe('/en/paths');
    expect(localizePath('paths', 'fr')).toBe('paths');
    expect(localizePath('#section', 'fr')).toBe('#section');
    expect(localizePath('mailto:a@b.com', 'fr')).toBe('mailto:a@b.com');
  });
});

// The reason this module exists: a canonical URL and its sitemap twin are built
// from the same path math, so they can never drift into a duplicate-content bug.
describe('canonical vs sitemap parity', () => {
  it('localize(cleanPath(stripLocale(pathname))) yields the sitemap-style URL path', () => {
    const unlocalized = cleanPath(stripLocale('/fr/glossary/tri/'));
    expect(unlocalized).toBe('/glossary/tri');
    expect(localizePath(unlocalized, 'fr')).toBe('/fr/glossary/tri');
    expect(localizePath(unlocalized, 'en')).toBe('/en/glossary/tri');
  });
});
