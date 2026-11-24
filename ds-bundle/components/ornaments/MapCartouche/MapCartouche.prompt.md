MapCartouche from @vcpx/design-system. Use via `window.VCPX.MapCartouche` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Cartouche de carte ancienne : un cadre ouvragé portant un titre et un sous-titre. Sert d'en-tête de page éditoriale là où un titre nu manquerait de tenue.

`width` fixe la largeur du tracé ; le composant ne se redimensionne pas tout seul, prévoir une largeur maximale sur petit écran.

## Props

```ts
interface MapCartoucheProps {
  title?: string;
  sub?: string;
  hue?: string;
  width?: number;
  className?: string;
}
```
