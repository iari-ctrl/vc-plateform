import * as React from 'react';

/**
 * SimulatorCard — from @vcpx/design-system@0.1.0.
 */
export interface SimulatorCardProps {
sim: {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    category: string;
    accent: string;
    description: string;
    relatedLessonIds: string[];
    glossaryRefs: string[];
  };
}

export declare const SimulatorCard: React.ComponentType<SimulatorCardProps>;
