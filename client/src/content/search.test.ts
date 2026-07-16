import { describe, expect, it } from 'vitest';

import { searchLocal } from './search';

describe('global search', () => {
  it.each([
    ['Dictionnaire', '/glossary'],
    ['Glossaire', '/glossary'],
    ['Lexique', '/glossary'],
    ['Formation', '/parcours'],
  ])('returns the relevant navigation page for %s', (query, href) => {
    expect(searchLocal(query)[0]).toMatchObject({ type: 'page', href });
  });

  it('does not match a query in the middle of another word', () => {
    const hits = searchLocal('formation');

    expect(hits.some((hit) => hit.slug === 'information-asymmetry')).toBe(false);
    expect(hits.some((hit) => hit.title.toLowerCase().includes('transformation'))).toBe(false);
  });

  it('does not index editorial prose as a search criterion', () => {
    expect(searchLocal('nigérians')).toEqual([]);
  });

  it('keeps partial searches from the beginning of a word', () => {
    expect(searchLocal('dict')[0]).toMatchObject({ type: 'page', href: '/glossary' });
  });

  it('indexes the published Analyst certification and never exposes upcoming lessons as reading links', () => {
    expect(searchLocal('Analyst')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'certification',
          href: '/certifications/analyste-en-capital-risque',
        }),
      ]),
    );
    expect(searchLocal('Intentionnalité et additionalité').some((hit) => hit.type === 'lesson')).toBe(false);
  });
});
