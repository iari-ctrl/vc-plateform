Spinner from @vcpx/design-system. Use via `window.VCPX.Spinner` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Indicateur d'activité purement décoratif. Il n'annonce rien aux technologies d'assistance.

Pour un chargement qui doit être annoncé, utiliser `PageLoader`, ou associer ce composant à une zone `aria-live` et à un libellé explicite. Un `Spinner` seul dans un bouton en cours d'enregistrement doit être accompagné du texte d'état.

## Props

```ts
interface SpinnerProps {
  className?: string;
}
```
