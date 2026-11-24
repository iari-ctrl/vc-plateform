import * as React from 'react';

/**
 * ProgressRing — from @vcpx/design-system@0.1.0.
 */
export interface ProgressRingProps {
  value: number;
  size?: number;
  stroke?: number;
  accent?: string;
  label?: React.ReactNode;
  accessibleLabel?: string;
}

export declare const ProgressRing: React.ComponentType<ProgressRingProps>;
