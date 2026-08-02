import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { buildMetaModel, buildMetaTags } from './seo';

describe('SEO metadata policy', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_BASE_URL', '/');
  });

  afterEach(() => vi.unstubAllEnvs());

  it('keeps a canonical URL for an indexable route', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://example.test');

    const model = buildMetaModel('/home', 'Accueil', 'Description', {});
    expect(model.canonicalUrl).toBe('https://example.test/home');
    expect(buildMetaTags(model).find((tag) => tag.key === 'og:url')?.content)
      .toBe('https://example.test/home');
  });

  it('keeps canonical metadata under the configured deployment base', () => {
    vi.stubEnv('VITE_BASE_URL', '/vc-plateform/');
    vi.stubEnv('VITE_SITE_URL', 'https://example.test/vc-plateform');

    const model = buildMetaModel('/home', 'Accueil', 'Description', {});
    expect(model.canonicalUrl).toBe('https://example.test/vc-plateform/home');
    expect(buildMetaTags(model).find((tag) => tag.key === 'og:url')?.content)
      .toBe('https://example.test/vc-plateform/home');
  });

  it('marks a not-found document noindex without a self-referencing canonical', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://example.test');

    const model = buildMetaModel('/missing', 'Page introuvable', 'Description', {
      canonical: false,
      noindex: true,
    });
    const tags = buildMetaTags(model);

    expect(model.canonicalUrl).toBeUndefined();
    expect(tags.find((tag) => tag.key === 'robots')?.content).toBe('noindex,nofollow');
    expect(tags.find((tag) => tag.key === 'og:url')?.content).toBeUndefined();
  });

  it('lets a missing resource override stale metadata from its detail page', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://example.test');

    const model = buildMetaModel('/courses/slug-inexistant', 'Ancien titre', 'Ancienne description', {
      type: 'article',
      publishedTime: '2026-07-22',
      notFound: true,
    });
    const tags = buildMetaTags(model);

    expect(model.titlePlain).toBe('Terra Incognita');
    expect(model.type).toBe('website');
    expect(model.noindex).toBe(true);
    expect(model.canonicalUrl).toBeUndefined();
    expect(model.publishedTime).toBeUndefined();
    expect(tags.find((tag) => tag.key === 'robots')?.content).toBe('noindex,nofollow');
    expect(tags.find((tag) => tag.key === 'og:url')?.content).toBeUndefined();
  });

  it('never emits a canonical or og:url for a shared noindex route', () => {
    vi.stubEnv('VITE_SITE_URL', 'https://example.test');

    const model = buildMetaModel('/dashboard', 'Tableau de bord', 'Description', {});
    const tags = buildMetaTags(model);

    expect(model.noindex).toBe(true);
    expect(model.canonicalUrl).toBeUndefined();
    expect(tags.find((tag) => tag.key === 'og:url')?.content).toBeUndefined();
  });
});
