import { useId, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

/**
 * Accessible confirmation dialog for irreversible actions (deletes…).
 * Built on Modal, so it inherits the focus trap, Escape handling and focus
 * restoration. The confirm button is auto-focused for fast keyboard use.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = 'Supprimer',
  cancelLabel = 'Annuler',
  destructive = true,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}) {
  const titleId = useId();
  const bodyId = useId();
  const confirmRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      open={open}
      onClose={onClose}
      labelledBy={titleId}
      describedBy={body ? bodyId : undefined}
      initialFocusRef={confirmRef}
      className="max-w-md"
    >
      <div className="p-7">
        <div className="flex items-start gap-3.5">
          {destructive && (
            <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--error)_12%,transparent)] text-error">
              <AlertTriangle size={18} />
            </span>
          )}
          <div className="min-w-0">
            <h2 id={titleId} className="font-headline text-headline-sm font-semibold">{title}</h2>
            {body && <p id={bodyId} className="mt-2 text-sm text-surface-variant text-pretty">{body}</p>}
          </div>
        </div>
        <div className="mt-7 flex justify-end gap-2">
          <button onClick={onClose} className="btn-quiet">{cancelLabel}</button>
          <button
            ref={confirmRef}
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={
              destructive
                ? 'inline-flex items-center gap-1.5 rounded-full bg-error px-4 py-2.5 text-sm font-semibold text-error-foreground transition-colors hover:bg-[color-mix(in_srgb,var(--error)_85%,black)]'
                : 'btn-foil !py-2.5'
            }
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}
