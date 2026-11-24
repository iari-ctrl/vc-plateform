import * as React from 'react';

/**
 * InkStamp — from @vcpx/design-system@0.1.0.
 */
export interface InkStampProps {
  label?: string;
  date?: string;
  hue?: string;
  rotate?: number;
  className?: string;
}

export declare const InkStamp: React.ComponentType<InkStampProps>;
