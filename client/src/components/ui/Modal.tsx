import { useRef, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLayerBehavior } from '@/components/ui/layerStack';

export function Modal({
  open,
  onClose,
  children,
  className,
  containerClassName,
  labelledBy,
  describedBy,
  initialFocusRef,
  showCloseButton = true,
  closeLabel = 'Fermer',
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  labelledBy?: string;
  describedBy?: string;
  initialFocusRef?: RefObject<HTMLElement | null>;
  showCloseButton?: boolean;
  closeLabel?: string;
}) {
  const layerRootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const { layerProps } = useLayerBehavior({
    open,
    onClose,
    layerRootRef,
    focusRootRef: dialogRef,
    initialFocusRef,
  });

  if (!open) return null;

  return createPortal(
    <div
      ref={layerRootRef}
      {...layerProps}
      className={cn(
        'fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto p-4 sm:items-center sm:p-6',
        containerClassName,
      )}
    >
      <div
        className="fixed inset-0 bg-[color-mix(in_srgb,var(--secondary)_30%,transparent)] backdrop-blur-sm animate-fade-in motion-reduce:animate-none"
        onClick={onClose}
        aria-hidden
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full max-w-lg rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-editorial-lg animate-scale-in focus:outline-none motion-reduce:animate-none',
          className,
        )}
      >
        {showCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-4 top-4 z-20 grid h-8 w-8 place-items-center rounded-full text-surface-variant transition-colors hover:bg-surface-container hover:text-foreground motion-reduce:transition-none"
          >
            <X size={16} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
