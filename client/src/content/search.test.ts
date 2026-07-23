import { describe, expect, it } from 'vitest';

import { searchLocal } from './search';

describe('global search', () => {
  it.each([
    ['Dictionnaire', '/glossary'],
    ['Glossaire', '/glossary'],
    ['Lexique', '/glossary'],
    ['Formation', '/parcours'],
    ['Niveaux de certification', '/certifications/niveaux'],
  ])('returns the relevant navigation page for %s', (query, href) => {
    expect(searchLocal(query)[0]).toMatchObject({ type: 'page', href });
  });

  it('routes future certification levels to the single levels overview', () => {
    expect(searchLocal('Principal')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'page', href: '/certifications/niveaux' }),
      ]),
    );
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

  it('indexes VC Analyst and the Analyst Foundations parcours without exposing upcoming lessons as reading links', () => {
    expect(searchLocal('Analyst')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'certification',
          href: '/certifications/analyste-en-capital-risque',
        }),
        expect.objectContaining({
          type: 'path',
          href: '/parcours/analyst-foundations',
        }),
      ]),
    );
    expect(searchLocal('Analyst').some((hit) => hit.href === '/certifications/analyst-foundations')).toBe(false);
    expect(searchLocal('Intentionnalité et additionalité').some((hit) => hit.type === 'lesson')).toBe(false);
  });

  it('indexes the Venture Philanthropy parcours', () => {
    expect(searchLocal('Venture Philanthropy')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'path',
          href: '/parcours/venture-philanthropy-foundations',
        }),
      ]),
    );
  });

  it('indexes the learner and transfer cases without exposing a correction route', () => {
    expect(searchLocal('Trait d’Union')).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'case', href: '/cases/insertion-3-regions' }),
    ]));
    expect(searchLocal('Énergie des Vallées')).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'case', href: '/cases/energie-des-vallees' }),
    ]));
    expect(searchLocal('Correction commentée Trait d’Union').some((hit) => hit.href.endsWith('/correction'))).toBe(false);
  });
});
