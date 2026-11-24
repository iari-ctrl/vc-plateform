import * as React from 'react';

/**
 * AntiPortfolioEntryCard — from @vcpx/design-system@0.1.0.
 */
export interface AntiPortfolioEntryCardProps {
entry: {
    id: string;
    slug: string;
    company: string;
    title: string;
    subtitle: string;
    /** Au moins une entrée : la carte lit `passes[0].year`. */
    passes: { fund: string; partner?: string; year: number; stage: string }[];
    sector: string;
    /** Ids de motifs ; seuls ceux du registre rendent un glyphe. */
    patternIds: string[];
    readMin: number;
    summary: string;
    /** Présente, la citation remplace le résumé sur la carte. */
    quote?: { text: string; author: string; source: string };
    knownAtTheTime: { date: string; fact: string }[];
    statedReason: string;
    reasonIsPublic: boolean;
    missedSignal: string;
    steelman: string;
    outcome: string;
    takeaways: string[];
    glossaryRefs: string[];
    sources: { label: string; url: string }[];
  };
}

export declare const AntiPortfolioEntryCard: React.ComponentType<AntiPortfolioEntryCardProps>;
