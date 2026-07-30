import { createContext, useContext } from 'react';

/**
 * Phases of the entrance played when /home opens after the splash portal.
 *
 *  running  — the curtain owns the screen: veil, then wordmark, rule, poles,
 *             then the whole header block flies from the centre to the top.
 *  handover — the real fixed header fades in while the curtain fades out.
 *  idle     — nothing playing (also the state on every ordinary home visit).
 */
export type HomeIntroPhase = 'idle' | 'running' | 'handover';

export interface HomeIntroValue {
  phase: HomeIntroPhase;
  /** `Date.now()` at the moment the entrance started — 0 while idle. */
  startedAt: number;
}

export const HOME_INTRO_IDLE: HomeIntroValue = { phase: 'idle', startedAt: 0 };

/** Curtain lifts and the hero title plays its own reveal from here. */
export const HOME_INTRO_HERO_DELAY = 2600;

/** The real header takes over. */
export const HOME_INTRO_HANDOVER_AT = 3600;

/** Curtain unmounts; the page is in its final, stable state. */
export const HOME_INTRO_END_AT = 3900;

export const HomeIntroContext = createContext<HomeIntroValue>(HOME_INTRO_IDLE);

/** Safe outside the provider: reads as `idle`, so pages render normally. */
export function useHomeIntro(): HomeIntroValue {
  return useContext(HomeIntroContext);
}
