import * as React from 'react';

/**
 * KanjiSeal — from @vcpx/design-system@0.1.0.
 */
export interface KanjiSealProps {
  kanji: string;
  accent: string;
  size?: number;
  className?: string;
  /** View-transition name, so the same seal can be carried from a catalogue card into the page it opens. A name must be uniqu */
  morphName?: string;
}

export declare const KanjiSeal: React.ComponentType<KanjiSealProps>;
