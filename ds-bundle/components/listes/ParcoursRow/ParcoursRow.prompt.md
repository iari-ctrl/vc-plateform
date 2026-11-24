ParcoursRow from @vcpx/design-system. Use via `window.VCPX.ParcoursRow` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

La forme de référence pour comparer des parcours, et l'unité de l'index `/parcours`. À préférer à `ParcoursCard` dès qu'il s'agit d'un inventaire.

Anatomie imposée : sceau, titre, accroche sur deux lignes au plus, puis une bande méta dont l'ordre est **constant d'une rangée à l'autre** — temps requis, étapes, niveau, jalon. Une seule cible cliquable par rangée, séparateurs en filet, aucune boîte.

`summary` vient d'en haut : la page calcule les résumés de progression en une passe mémoïsée et les distribue, plutôt que chaque rangée recalculant le sien.

Le composant rend un `li` — l'envelopper dans une `ul` ou une `ol`.

## Props

```ts
interface ParcoursRowProps {
parcours: {
    id: string;
    slug: string;
    family: "decouvrir" | "entretien" | "levee" | "grade" | "maitriser" | "express";
    roadmap: "now" | "next" | "later";
    title: string;
    hook: string;
    kanji?: string;
    accent?: string;
    goal: string;
    forWhom: string[];
    level: "debutant" | "intermediaire" | "avance" | "tous";
    entryLevel: "debutant" | "intermediaire" | "avance" | "tous";
    time:
      | { source?: "declared"; coreHours: number; withBonusHours?: number; sessions?: number; cadence?: string }
      | { source: "derived"; sessions?: number; cadence?: string };
    timeFit: ("low" | "medium" | "high")[];
    recommendedForProfiles: string[];
    milestone?: { type: string; label: string; description: string };
    steps: {
      order: number;
      type: "coeur" | "bonus" | "pratique" | "respiration";
      ref: { kind: "lesson" | "course" | "case" | "simulator" | "glossary" | "deliverable" | "milestone"; id: string };
      label: string;
      status: "existant" | "a-produire";
      keystone?: boolean;
    }[];
    outcomes: string[];
    prerequisites?: string[];
  };
  /** Calculé par la page en une passe, puis distribué aux rangées. */
  summary: {
    budget: "low" | "medium" | "high";
    steps: unknown[];
    totalSteps: number;
    completedSteps: number;
    percent: number;
    resumeHref?: string;
  };
  href: string;
  morph?: boolean;
  onOpen?: () => void;
}
```
