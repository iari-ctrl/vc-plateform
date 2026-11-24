import * as React from 'react';

/**
 * Modal — from @vcpx/design-system@0.1.0.
 * @replaces dialog
 */
export interface ModalProps {
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

export declare const Modal: React.ComponentType<ModalProps>;
