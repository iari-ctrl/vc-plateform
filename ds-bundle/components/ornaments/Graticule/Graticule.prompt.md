Graticule from @vcpx/design-system. Use via `window.VCPX.Graticule` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Réseau de méridiens et parallèles, en filet très discret. Fond de page cartographique, à poser en couche absolue de faible opacité derrière le contenu.

**Caractéristique à connaître :** le tracé est délibérément à la limite du perceptible — pointillés de 0,5 px à 0,25 d'opacité sur une trame de 64 px. Aucun réglage ne le rend franc, et c'est voulu : il apporte une texture, pas une grille. Ne pas chercher à l'accentuer ; s'il doit se voir, c'est qu'il n'est pas le bon composant.

`hue` suit par défaut la couleur de contour du thème.

## Props

```ts
interface GraticuleProps {
  className?: string;
  hue?: string;
}
```
