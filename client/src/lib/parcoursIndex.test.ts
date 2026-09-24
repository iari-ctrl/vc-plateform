import { describe, expect, it } from 'vitest';

import { PARCOURS, parcoursBySlug, FAMILY_ORDER } from '@/content/parcours';
import { parcoursTimeSummary } from '@/content/learningTime';
import {
  FAMILY_FILTER_OPTIONS,
  compareParcoursInFamily,
  groupParcoursByFamily,
  matchesParcoursFilters,
  parcoursIndexHref,
  parseParcoursIndexFilters,
} from './parcoursIndex';

const filters = (search: string) => parseParcoursIndexFilters(new URLSearchParams(search));

describe('lecture des filtres depuis l’URL', () => {
  it('retombe sur les défauts en l’absence de paramètre', () => {
    expect(filters('')).toEqual({ family: 'all', budget: 'high', budgetExplicit: false });
  });

  it('ignore une valeur inconnue plutôt que de coincer la page', () => {
    expect(filters('family=licorne&budget=infini')).toEqual({
      family: 'all',
      budget: 'high',
      budgetExplicit: false,
    });
  });

  it('accepte les valeurs valides et signale un niveau explicitement choisi', () => {
    expect(filters('family=levee&budget=low')).toEqual({
      family: 'levee',
      budget: 'low',
      budgetExplicit: true,
    });
  });

  it('distingue « Complet » choisi du défaut, alors que les deux retiennent tout', () => {
    expect(filters('budget=high').budgetExplicit).toBe(true);
    expect(filters('').budgetExplicit).toBe(false);
  });

  it('expose « Toutes » puis les six familles dans l’ordre éditorial', () => {
    expect(FAMILY_FILTER_OPTIONS.map((option) => option.id)).toEqual(['all', ...FAMILY_ORDER]);
  });
});

describe('prédicat de filtrage', () => {
  it('filtre sur timeFit, pas sur une durée', () => {
    const principal = parcoursBySlug('passer-principal');
    if (!principal) throw new Error('parcours introuvable');
    expect(principal.timeFit).toEqual(['high']);
    expect(matchesParcoursFilters(principal, 'all', 'high')).toBe(true);
    expect(matchesParcoursFilters(principal, 'all', 'low')).toBe(false);
  });

  it('croise destination et niveau', () => {
    const seed = parcoursBySlug('preparer-ma-seed');
    if (!seed) throw new Error('parcours introuvable');
    expect(matchesParcoursFilters(seed, 'levee', 'medium')).toBe(true);
    expect(matchesParcoursFilters(seed, 'entretien', 'medium')).toBe(false);
  });
});

describe('ordre à l’intérieur d’un rayon', () => {
  it('place la curation éditoriale avant la durée', () => {
    const now = parcoursBySlug('venture-philanthropy-foundations');
    const next = parcoursBySlug('dimensionner-un-marche');
    if (!now || !next) throw new Error('parcours introuvable');
    // Le « phare » dure 35 h, le primer 45 min : un tri par durée l’enterrerait.
    expect(parcoursTimeSummary(now).requiredMinutes).toBeGreaterThan(parcoursTimeSummary(next).requiredMinutes);
    expect(compareParcoursInFamily(now, next)).toBeLessThan(0);
  });

  it('départage deux parcours de même rang par le temps requis', () => {
    const court = parcoursBySlug('dimensionner-un-marche');
    const long = parcoursBySlug('decoder-une-term-sheet');
    if (!court || !long) throw new Error('parcours introuvable');
    expect(court.roadmap).toBe(long.roadmap);
    expect(compareParcoursInFamily(court, long)).toBeLessThan(0);
  });

  it('reste déterministe quand rang et durée sont à égalité', () => {
    const a = parcoursBySlug('l-entretien-vc-en-1h');
    const b = parcoursBySlug('lever-en-1h-l-essentiel');
    if (!a || !b) throw new Error('parcours introuvable');
    expect(a.roadmap).toBe(b.roadmap);
    expect(parcoursTimeSummary(a).requiredMinutes).toBe(parcoursTimeSummary(b).requiredMinutes);
    expect(compareParcoursInFamily(a, b)).toBeLessThan(0);
    expect(compareParcoursInFamily(b, a)).toBeGreaterThan(0);
  });
});

describe('groupage du catalogue', () => {
  it('rend les six rayons dans l’ordre éditorial et n’en perd aucun parcours', () => {
    const groups = groupParcoursByFamily('all', 'high');
    expect(groups.map((group) => group.family)).toEqual([...FAMILY_ORDER]);
    expect(groups.reduce((sum, group) => sum + group.items.length, 0)).toBe(PARCOURS.length);
  });

  it('réduit à un seul rayon peuplé quand une destination est choisie', () => {
    const groups = groupParcoursByFamily('entretien', 'high');
    const peuples = groups.filter((group) => group.items.length > 0);
    expect(peuples).toHaveLength(1);
    expect(peuples[0].family).toBe('entretien');
  });

  it('laisse un rayon vide plutôt que de l’inventer — « Monter en grade » n’a rien en Essentiel', () => {
    const groups = groupParcoursByFamily('all', 'low');
    const grade = groups.find((group) => group.family === 'grade');
    expect(grade?.items).toHaveLength(0);
    expect(groups.reduce((sum, group) => sum + group.items.length, 0)).toBeLessThan(PARCOURS.length);
  });

  it('rend le croisement destination × niveau capable de ne rien retourner', () => {
    const total = groupParcoursByFamily('grade', 'low')
      .reduce((sum, group) => sum + group.items.length, 0);
    expect(total).toBe(0);
  });
});

describe('propagation du niveau dans le lien', () => {
  const seed = parcoursBySlug('preparer-ma-seed');
  if (!seed) throw new Error('parcours introuvable');

  it('n’ajoute rien tant que le lecteur n’a pas choisi', () => {
    expect(parcoursIndexHref(seed, filters(''))).toBe('/parcours/preparer-ma-seed');
  });

  it('porte le niveau choisi jusqu’au curseur d’étapes du détail', () => {
    expect(parcoursIndexHref(seed, filters('budget=medium'))).toBe('/parcours/preparer-ma-seed?budget=medium');
  });

  it('ne propage pas le défaut implicite, qui écraserait le budget du profil', () => {
    expect(parcoursIndexHref(seed, filters('family=levee'))).toBe('/parcours/preparer-ma-seed');
  });
});
