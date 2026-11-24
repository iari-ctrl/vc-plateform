ExLibris from @vcpx/design-system. Use via `window.VCPX.ExLibris` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Ex-libris d'explorateur : signe l'appartenance d'un document à un carnet d'étude. Employé en pied de page.

`owner` et `num` portent le texte gravé.

## Props

```ts
interface ExLibrisProps {
  owner?: string;
  num?: string;
  hue?: string;
  className?: string;
}
```
