import * as React from 'react';

/**
 * DeliverableCard — from @vcpx/design-system@0.1.0.
 */
export interface DeliverableCardProps {
deliverable: {
    id: string;
    slug: string;
    title: string;
    kicker?: string;
    readMin: number;
    summary: string;
    brief: string;
    template: unknown[];
    rubric: unknown[];
    /** Les trois premiers sont rendus en pastilles. */
    tags?: string[];
  };
}

export declare const DeliverableCard: React.ComponentType<DeliverableCardProps>;
