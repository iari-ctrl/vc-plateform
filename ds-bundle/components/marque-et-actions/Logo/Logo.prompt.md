Logo from @vcpx/design-system. Use via `window.VCPX.Logo` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

La signature de Maison Sapience VC. `compact` donne la forme réduite pour une barre dense ou un rail replié.

Le logo est un lien ; `to` change sa destination, qui reste l'accueil par défaut. Ne pas le reconstruire en texte ni le remplacer par un libellé composé à la main.

## Props

```ts
interface LogoProps {
  compact?: boolean;
  className?: string;
  to?: string;
}
```
