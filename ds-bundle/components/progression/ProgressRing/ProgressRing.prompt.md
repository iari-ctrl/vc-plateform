ProgressRing from @vcpx/design-system. Use via `window.VCPX.ProgressRing` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Progression circulaire, pour les emplacements denses — coin de carte, colonne d'état d'une rangée — là où une barre serait trop large.

Deux libellés distincts, à ne pas confondre : `label` est le texte visible au centre, `accessibleLabel` nomme l'indicateur pour les technologies d'assistance. Renseigner `accessibleLabel` avec le décompte et son dénominateur.

Même règle que `ProgressBar` : la progression représente une donnée réelle.

## Props

```ts
interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  accent?: string;
  label?: React.ReactNode;
  accessibleLabel?: string;
}
```
