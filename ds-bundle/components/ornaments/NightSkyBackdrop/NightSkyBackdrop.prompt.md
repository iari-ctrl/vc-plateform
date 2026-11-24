NightSkyBackdrop from @vcpx/design-system. Use via `window.VCPX.NightSkyBackdrop` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Fond de ciel nocturne, en deux formats : `hero` pour une pleine largeur d'accueil, `panel` pour un bloc. Le fond photographique n'apparaît qu'en thème sombre.

Se place en couche de fond d'un conteneur isolé, sous le contenu. Prévoir un contraste de texte suffisant par-dessus.

## Props

```ts
interface NightSkyBackdropProps {
  variant?: "hero" | "panel";
  className?: string;
}
```
