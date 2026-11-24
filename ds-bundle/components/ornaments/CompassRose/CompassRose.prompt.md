CompassRose from @vcpx/design-system. Use via `window.VCPX.CompassRose` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Rose des vents — l'ornement cardinal du langage cartographique de la plateforme. Le survol la fait pivoter ; `floating` lui ajoute une dérive lente.

Décoratif : ne déclenche aucune action et ne doit pas servir de cible cliquable.

## Props

```ts
interface CompassRoseProps {
  size?: number;
  hue?: string;
  className?: string;
  floating?: boolean;
}
```
