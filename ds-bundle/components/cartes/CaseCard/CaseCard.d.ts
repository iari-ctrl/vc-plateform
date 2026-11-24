import * as React from 'react';

/**
 * CaseCard — from @vcpx/design-system@0.1.0.
 */
export interface CaseCardProps {
cs: {
    id: string;
    slug: string;
    title: string;
    subtitle: string;
    kind: "startup" | "fund" | "deal" | "market" | string;
    company: string;
    year: number;
    readMin: number;
    summary: string;
    tags: string[];
    glossaryRefs: string[];
    sections: { heading: string; body: string }[];
    takeaways: string[];
  };
}

export declare const CaseCard: React.ComponentType<CaseCardProps>;
