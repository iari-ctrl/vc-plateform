import * as React from 'react';

/**
 * LessonRow — from @vcpx/design-system@0.1.0.
 */
export interface LessonRowProps {
  slug: string;
  href?: string;
  order: number;
  title: string;
  kicker: string;
  readMin: number;
  practiceMin?: number;
  summary?: string;
  done?: boolean;
  reading?: boolean;
  upcoming?: boolean;
}

export declare const LessonRow: React.ComponentType<LessonRowProps>;
