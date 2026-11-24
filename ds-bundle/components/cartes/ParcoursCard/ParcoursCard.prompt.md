ParcoursCard from @vcpx/design-system. Use via `window.VCPX.ParcoursCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Carte de **recommandation** d'un parcours : tableau de bord, résultat de profil. Elle met en avant une trajectoire ciblée.

**Ce n'est pas l'unité d'un index.** L'index `/parcours` compare vingt-quatre parcours, ce qu'une grille de cartes rend impossible — il utilise `ParcoursRow`. Règle générale du design system : un inventaire destiné à être comparé se rend en rangées, pas en cartes.

La carte lit la progression dans les données locales et calcule un ratio de leçons lues. **Écart documenté :** ce ratio ne couvre pas les mêmes activités que le résumé d'étapes employé par l'index et la fiche. Ne pas présenter ces deux indicateurs comme équivalents.

`parcours.family` doit être une famille connue : la carte y lit son accent et son kanji par défaut.

## Props

```ts
interface ParcoursCardProps {
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
  /** Rang affiché en l'absence de progression. */
  index?: number;
}
```
