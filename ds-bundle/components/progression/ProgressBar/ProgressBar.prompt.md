ProgressBar from @vcpx/design-system. Use via `window.VCPX.ProgressBar` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Progression linéaire. `value` est un pourcentage déjà calculé — le composant ne dérive aucun ratio métier, c'est au consommateur de le faire.

`label` est le nom accessible de l'indicateur : y nommer ce qui est compté et son dénominateur, par exemple « 4 étapes effectuées sur 11 », et non « Progression ».

**Règle du design system : la progression n'est jamais décorative.** Elle doit représenter une donnée utilisateur réelle. Un pourcentage inventé pour meubler une maquette doit être annoncé comme fictif.

## Props

```ts
interface ProgressBarProps {
  value: number;
  accent?: string;
  className?: string;
  label?: string;
}
```
