import { describe, expect, it } from 'vitest';

import { PARCOURS } from './parcours';
import { PARCOURS_RELATIONS, relationsForParcours } from './parcoursRelations';

describe('parcoursRelations', () => {
  it('contient uniquement des relations éditoriales valides', () => {
    const parcoursById = new Map(PARCOURS.map((parcours) => [parcours.id, parcours]));

    for (const relation of PARCOURS_RELATIONS) {
      const source = parcoursById.get(relation.sourceId);
      const target = parcoursById.get(relation.targetId);

      expect(source, `source inconnue : ${relation.sourceId}`).toBeDefined();
      expect(target, `cible inconnue : ${relation.targetId}`).toBeDefined();
      expect(relation.rationale.trim().length).toBeGreaterThan(20);
      if (relation.kind === 'peer') expect(source?.level).toBe(target?.level);
    }
  });

  it('reste clairsemé et exclut les rapprochements éditoriaux ambigus', () => {
    const canonicalPair = (sourceId: string, targetId: string) => [sourceId, targetId].sort().join('|');
    const relationPairs = new Set(
      PARCOURS_RELATIONS.map((relation) => canonicalPair(relation.sourceId, relation.targetId)),
    );
    const excludedPairs = [
      ['p-stage', 'p-express-entretien'],
      ['p-entretien-associate', 'p-passer-associate'],
      ['p-entretien-principal', 'p-passer-principal'],
      ['p-entretien-associate', 'p-entretien-principal'],
      ['p-analyst-foundations', 'p-venture-philanthropy-foundations'],
      ['p-express-lever', 'p-preseed'],
    ] as const;

    expect(PARCOURS_RELATIONS).toHaveLength(19);
    for (const [sourceId, targetId] of excludedPairs) {
      expect(relationPairs).not.toContain(canonicalPair(sourceId, targetId));
    }
  });

  it('retrouve les relations entrantes et sortantes d’un parcours', () => {
    const relations = relationsForParcours('p-entretien-analyst');

    expect(relations).toEqual(expect.arrayContaining([
      expect.objectContaining({ sourceId: 'p-stage', targetId: 'p-entretien-analyst', kind: 'progression' }),
      expect.objectContaining({ sourceId: 'p-entretien-analyst', targetId: 'p-entretien-associate', kind: 'progression' }),
      expect.objectContaining({ sourceId: 'p-entretien-analyst', targetId: 'p-market-sizing', kind: 'peer' }),
    ]));
  });
});
