BookmarkButton from @vcpx/design-system. Use via `window.VCPX.BookmarkButton` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Mise en signet d'un élément. L'état est lu et écrit dans les données locales de l'apprenant : le composant est autonome, il n'attend pas d'état piloté de l'extérieur.

`item` décrit la cible du signet — type, identifiant, titre et lien — et non le signet déjà enregistré. `variant="labelled"` ajoute le libellé à côté de l'icône, pour les emplacements où une icône seule serait ambiguë.

## Props

```ts
interface BookmarkButtonProps {
item: {
    id?: string;
    itemType: string;
    itemId: string;
    title: string;
    href: string;
    createdAt?: string;
  };
  variant?: "icon" | "labelled";
  className?: string;
}
```
