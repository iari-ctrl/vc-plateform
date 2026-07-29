import parcoursRelationsJson from '@data/parcoursRelations.json';

import type { ParcoursRelation } from './parcoursTypes';

/** Graphe éditorial clairsemé utilisé par la carte des parcours. */
export const PARCOURS_RELATIONS = parcoursRelationsJson as ParcoursRelation[];

/** Retourne les relations entrantes et sortantes d’un parcours. */
export function relationsForParcours(parcoursId: string): ParcoursRelation[] {
  return PARCOURS_RELATIONS.filter(
    (relation) => relation.sourceId === parcoursId || relation.targetId === parcoursId,
  );
}

export function otherParcoursId(relation: ParcoursRelation, parcoursId: string): string {
  return relation.sourceId === parcoursId ? relation.targetId : relation.sourceId;
}
