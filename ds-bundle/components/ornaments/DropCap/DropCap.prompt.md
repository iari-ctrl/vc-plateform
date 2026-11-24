DropCap from @vcpx/design-system. Use via `window.VCPX.DropCap` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Lettrine ouvrant un texte éditorial. `letter` prend la première lettre du paragraphe, qu'il faut alors retirer du texte courant sous peine de la lire deux fois.

Une seule lettrine par article, au premier paragraphe.

## Props

```ts
interface DropCapProps {
  letter: string;
  hue?: string;
  size?: number;
  className?: string;
}
```
