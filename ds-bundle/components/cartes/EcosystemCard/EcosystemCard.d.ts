import * as React from 'react';

/**
 * EcosystemCard — from @vcpx/design-system@0.1.0.
 */
export interface EcosystemCardProps {
dossier: {
    id: string;
    slug: string;
    name: string;
    title: string;
    subtitle: string;
    kind: "geographie" | "secteur" | "these";
    accent: string;
    author: string;
    createdAt: string;
    updatedAt: string;
    readMin: number;
    summary: string;
    tags: string[];
    sections: unknown[];
    glossaryRefs: string[];
    convictions?: unknown[];
    signals?: unknown[];
  };
  /** Non nul, la bande méta annonce les sous-dossiers plutôt que les convictions. */
  childCount?: number;
  featured?: boolean;
}

export declare const EcosystemCard: React.ComponentType<EcosystemCardProps>;
