import * as React from 'react';

/**
 * ConfirmDialog — from @vcpx/design-system@0.1.0.
 */
export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  body?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  focusCancel?: boolean;
}

export declare const ConfirmDialog: React.ComponentType<ConfirmDialogProps>;
