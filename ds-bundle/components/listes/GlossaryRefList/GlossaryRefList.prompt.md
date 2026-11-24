GlossaryRefList from @vcpx/design-system. Use via `window.VCPX.GlossaryRefList` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Renvoi de fin de contenu vers le dictionnaire : une liste de pastilles, une par terme.

`slugs` attend des identifiants de glossaire, pas des libellés — l'affichage est dérivé du slug. Le composant ne rend rien si la liste est vide, il est donc sûr de l'appeler sans condition.

## Props

```ts
interface GlossaryRefListProps {
  slugs: string[];
  title?: string;
}
```
