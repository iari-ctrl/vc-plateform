DeliverableCard from @vcpx/design-system. Use via `window.VCPX.DeliverableCard` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Livrable à produire dans un parcours : gabarit, grille d'évaluation et modèle. La carte n'en montre que l'intention — titre, accroche, résumé, trois étiquettes au plus.

`template` et `rubric` sont requis par le contrat mais ne sont pas lus par la carte : un tableau vide suffit pour un rendu correct.

Même registre institutionnel que les autres pièces d'intelligence.

## Props

```ts
interface DeliverableCardProps {
deliverable: {
    id: string;
    slug: string;
    title: string;
    kicker?: string;
    readMin: number;
    summary: string;
    brief: string;
    template: unknown[];
    rubric: unknown[];
    /** Les trois premiers sont rendus en pastilles. */
    tags?: string[];
  };
}
```
