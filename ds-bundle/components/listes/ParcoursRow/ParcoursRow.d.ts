import * as React from 'react';

/**
 * ParcoursRow — from @vcpx/design-system@0.1.0.
 */
export interface ParcoursRowProps {
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
  /** Calculé par la page en une passe, puis distribué aux rangées. */
  summary: {
    budget: "low" | "medium" | "high";
    steps: unknown[];
    totalSteps: number;
    completedSteps: number;
    percent: number;
    resumeHref?: string;
  };
  href: string;
  morph?: boolean;
  onOpen?: () => void;
}

export declare const ParcoursRow: React.ComponentType<ParcoursRowProps>;
