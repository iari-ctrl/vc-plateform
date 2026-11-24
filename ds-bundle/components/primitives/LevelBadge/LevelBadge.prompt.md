LevelBadge from @vcpx/design-system. Use via `window.VCPX.LevelBadge` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Niveau de difficulté d'un contenu pédagogique. Les valeurs attendues sont `debutant`, `intermediaire`, `avance` et `tous` ; le libellé affiché est résolu en interne, ne pas le réécrire.

`accent` colore la pastille — y passer la couleur d'accent du parcours ou du dossier plutôt qu'une teinte arbitraire. Comme `Chip`, le rendu est un `span` : ce n'est pas un contrôle.

## Props

```ts
interface LevelBadgeProps {
  level: string;
  accent?: string;
}
```
