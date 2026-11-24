import * as React from 'react';

/**
 * ParcoursCard — from @vcpx/design-system@0.1.0.
 */
export interface ParcoursCardProps {
parcours: {
    id: string;
    slug: string;
    family: "decouvrir" | "entretien" | "levee" | "grade" | "maitriser" | "express";
    roadmap: "now" | "next" | "later";
    title: string;
    hook: string;
    kanji?: string;
    accent?: string;
    goal: string;
    forWhom: string[];
    level: "debutant" | "intermediaire" | "avance" | "tous";
    entryLevel: "debutant" | "intermediaire" | "avance" | "tous";
    time:
      | { source?: "declared"; coreHours: number; withBonusHours?: number; sessions?: number; cadence?: string }
      | { source: "derived"; sessions?: number; cadence?: string };
    timeFit: ("low" | "medium" | "high")[];
    recommendedForProfiles: string[];
    milestone?: { type: string; label: string; description: string };
    steps: {
      order: number;
      type: "coeur" | "bonus" | "pratique" | "respiration";
      ref: { kind: "lesson" | "course" | "case" | "simulator" | "glossary" | "deliverable" | "milestone"; id: string };
      label: string;
      status: "existant" | "a-produire";
      keystone?: boolean;
    }[];
    outcomes: string[];
    prerequisites?: string[];
  };
  /** Rang affiché en l'absence de progression. */
  index?: number;
}

export declare const ParcoursCard: React.ComponentType<ParcoursCardProps>;
