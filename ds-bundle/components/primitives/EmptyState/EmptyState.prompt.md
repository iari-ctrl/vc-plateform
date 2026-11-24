EmptyState from @vcpx/design-system. Use via `window.VCPX.EmptyState` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

État vide d'une liste ou d'un espace de travail. Les quatre éléments ont un rôle distinct : l'icône signale, le titre nomme ce qui manque, la description dit comment le remplir, l'action y conduit.

Un état vide sans description utile est un état vide raté : dire ce que l'utilisateur peut faire, pas seulement constater l'absence.

## Props

```ts
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}
```
