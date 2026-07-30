import { NAVIGATION_PILLARS, type NavigationPillar } from '@/lib/navigation';

const homePillar = (id: NavigationPillar['id']) => {
  const pillar = NAVIGATION_PILLARS.find((item) => item.id === id);
  if (!pillar) throw new Error(`Navigation pillar "${id}" is missing.`);
  return pillar;
};

/** The two poles the home bar exposes — everything else lives behind them. */
export const HOME_FORMATION = homePillar('formation');
export const HOME_INTELLIGENCE = homePillar('intelligence');

/** The reference switches the two poles to a viewport-bottom bar below md. */
export const HOME_COMPACT_MEDIA_QUERY = '(max-width: 767px)';

/* ── Shared geometry & type ──────────────────────────────────────────────────
   The entrance curtain (HomeIntro) paints a throwaway copy of this bar in the
   middle of the screen, then flies it up to the top. Both the copy and the real
   fixed header read their classes from here, so the hand-over at ~3.6s lands on
   exactly the same pixels — no jump, no reflow. Change a value once, both move.
   ──────────────────────────────────────────────────────────────────────────── */

/** The three-column row: left pole · wordmark · right pole. */
export const HOME_BAR_ROW =
  'grid h-[var(--home-topbar-h)] grid-cols-[1fr_auto_1fr] items-center px-3 sm:px-6 lg:px-10';

/** Wrapper for a pole, filling its grid cell. */
export const HOME_BAR_CELL = 'flex h-full items-center';

/** Type and spacing of a pole label (Formation / Intelligence VC). */
export const HOME_BAR_PILLAR =
  'flex h-full min-h-0 items-center gap-1.5 font-mono text-[0.377rem] font-medium uppercase tracking-[0.16em] text-foreground sm:gap-2.5 sm:text-[0.4875rem] sm:tracking-[0.24em] md:h-auto md:min-h-11';

/** The centred wordmark — deliberately the largest thing on the bar. */
export const HOME_BAR_WORDMARK =
  'relative inline-flex h-full min-h-0 items-center justify-center px-2 text-center font-headline text-[0.66625rem] font-medium uppercase tracking-[0.1em] text-foreground sm:px-5 sm:text-[0.86125rem] sm:tracking-[0.2em] md:h-auto md:min-h-11 lg:text-[0.95875rem] lg:tracking-[0.24em]';

/** "Sapience VC" — the weighted half of the wordmark. */
export const HOME_BAR_WORDMARK_ACCENT =
  'font-semibold tracking-[0.12em] sm:tracking-[0.22em] lg:tracking-[0.26em]';

/** Chrome of the fixed header — reused by the entrance copy as it docks. */
export const HOME_BAR_SHELL =
  "bg-transparent text-foreground after:pointer-events-none after:absolute after:inset-x-2.5 after:bottom-0 after:h-px after:bg-[color-mix(in_srgb,var(--outline-variant)_70%,transparent)] after:content-['']";

/** Fixed two-pole navigation used on mobile and other compact widths. */
export const HOME_MOBILE_NAV_SHELL =
  'fixed inset-x-0 bottom-0 z-[75] grid h-[calc(var(--home-mobile-nav-h)+env(safe-area-inset-bottom))] box-border grid-cols-2 border-t border-outline-variant bg-[color-mix(in_srgb,var(--surface)_96%,transparent)] pb-[env(safe-area-inset-bottom)] text-foreground';
