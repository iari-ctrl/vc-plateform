CaseCard from @vcpx/design-system. Use via `window.VCPX.CaseCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Cas d'étude en grille. L'en-tête porte la nature du cas et l'année ; le corps enchaîne titre, sous-titre en italique, résumé tronqué à trois lignes, puis durée de lecture et entreprise.

Le libellé de `kind` est résolu en interne depuis un registre ; une valeur hors registre est affichée telle quelle.

## Props

```ts
interface CaseCardProps {
cs: {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    kind: "startup" | "fund" | "deal" | "market" | string;
    company: string;
    year: number;
    readMin: number;
    summary: string;
    tags: string[];
    glossaryRefs: string[];
    sections: { heading: string; body: string }[];
    takeaways: string[];
  };
}
```
