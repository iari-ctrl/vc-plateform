PageLoader from @vcpx/design-system. Use via `window.VCPX.PageLoader` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Chargement d'une surface entière, avec un statut nommé — c'est ce qui le distingue de `Spinner`.

Renseigner `label` avec ce qui charge réellement (« Chargement du catalogue… ») plutôt que de laisser le libellé générique.

## Props

```ts
interface PageLoaderProps {
  label?: string;
}
```
