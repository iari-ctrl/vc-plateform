import * as React from 'react';

/**
 * EmptyState — from @vcpx/design-system@0.1.0.
 */
export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export declare const EmptyState: React.ComponentType<EmptyStateProps>;
