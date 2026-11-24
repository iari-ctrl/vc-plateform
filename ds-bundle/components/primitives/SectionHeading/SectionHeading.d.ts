import * as React from 'react';

/**
 * SectionHeading — from @vcpx/design-system@0.1.0.
 */
export interface SectionHeadingProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export declare const SectionHeading: React.ComponentType<SectionHeadingProps>;
