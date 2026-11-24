import * as React from 'react';

/**
 * MemoCard — from @vcpx/design-system@0.1.0.
 */
export interface MemoCardProps {
memo: {
    id: string;
    slug: string;
    company: string;
    title: string;
    fund: string;
    author: string;
    date: string;
    stage: string;
    amount?: string;
    outcome: string;
    whyItMatters: string;
    sourceUrl: string;
    sourceNote: string;
    readMin: number;
    summary: string;
    context: string;
    sections: unknown[];
    lessons: string[];
    glossaryRefs: string[];
    tags: string[];
  };
}

export declare const MemoCard: React.ComponentType<MemoCardProps>;
