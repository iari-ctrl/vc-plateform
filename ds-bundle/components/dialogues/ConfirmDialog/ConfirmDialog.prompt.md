ConfirmDialog from @vcpx/design-system. Use via `window.VCPX.ConfirmDialog` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Confirmation d'une action irréversible — suppression, purge de données locales. Construit sur `Modal`, dont il hérite la gestion du focus.

Comportement à connaître : le focus initial va au bouton de confirmation, sauf si `focusCancel` le place sur l'annulation — ce qu'il faut faire quand l'action est destructrice et que la validation par mégarde coûte cher.

Le dialogue se ferme dès l'appel de `onConfirm`, **sans attendre une opération asynchrone**. Si la suppression peut échouer, c'est au consommateur d'afficher l'échec après coup.

## Props

```ts
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  focusCancel?: boolean;
}
```
