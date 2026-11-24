import * as React from 'react';

/**
 * ProgressBar — from @vcpx/design-system@0.1.0.
 */
export interface ProgressBarProps {
  value: number;
  accent?: string;
  className?: string;
  label?: string;
}

export declare const ProgressBar: React.ComponentType<ProgressBarProps>;
