import { describe, it, expect } from 'vitest';
import { localizePath, swapLocalePath } from './navigation';

describe('localizePath', () => {
  it('prefixes an absolute in-app path with the active locale', () => {
    expect(localizePath('/paths', 'fr')).toBe('/fr/paths');
    expect(localizePath('/glossary?term=tri', 'en')).toBe('/en/glossary?term=tri');
  });

  it('maps the root to the bare locale', () => {
    expect(localizePath('/', 'fr')).toBe('/fr');
  });

  it('leaves an already-localized path unchanged', () => {
    expect(localizePath('/fr/paths', 'fr')).toBe('/fr/paths');
    expect(localizePath('/en/paths', 'fr')).toBe('/en/paths');
  });

  it('passes through relative paths, hashes, mailto and absolute URLs', () => {
    expect(localizePath('paths', 'fr')).toBe('paths');
    expect(localizePath('#section', 'fr')).toBe('#section');
    expect(localizePath('mailto:a@b.com', 'fr')).toBe('mailto:a@b.com');
    expect(localizePath('https://example.com', 'fr')).toBe('https://example.com');
  });
});

describe('swapLocalePath', () => {
  it('swaps an existing locale segment while keeping the rest', () => {
    expect(swapLocalePath('/fr/glossary', 'en')).toBe('/en/glossary');
    expect(swapLocalePath('/en/cases/airbnb', 'fr')).toBe('/fr/cases/airbnb');
  });

  it('prefixes when there is no locale segment yet', () => {
    expect(swapLocalePath('/glossary', 'en')).toBe('/en/glossary');
  });

  it('handles the bare locale root', () => {
    expect(swapLocalePath('/fr', 'en')).toBe('/en');
  });
});
