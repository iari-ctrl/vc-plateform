Modal from @vcpx/design-system. Use via `window.VCPX.Modal` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Dialogue de base de la plateforme. Le piège de focus, la fermeture par Échap et la restauration du focus sont délégués à la pile de couches interne : réutiliser ce composant plutôt que de recomposer un dialogue, sous peine de perdre ces comportements.

`labelledBy` doit pointer l'identifiant de l'élément qui nomme le dialogue — sans lui, le dialogue n'a pas de nom accessible. `initialFocusRef` vise l'élément qui reçoit le focus à l'ouverture.

Le composant rend dans un portail : il n'hérite pas du contexte visuel de son parent et se positionne par-dessus la page.

## Props

```ts
interface ModalProps {
open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  backdropClassName?: string;
  dialogProps?: React.HTMLAttributes<HTMLDivElement>;
  /** Id de l'élément qui nomme le dialogue. Requis en pratique pour l'accessibilité. */
  labelledBy?: string;
  describedBy?: string;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  showCloseButton?: boolean;
  closeLabel?: string;
}
```
