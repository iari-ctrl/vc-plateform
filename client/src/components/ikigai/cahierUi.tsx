import { useEffect, useRef, type ReactNode } from 'react';
import { BookOpen, GraduationCap, Zap, AlignLeft } from 'lucide-react';
import type { IkigaiMode, OnboardingMode } from '@/content/types';
import { cn } from '@/lib/utils';
import { subsectionAnchorStyle } from './cahierSections/shared';

/**
 * Compact segmented control to switch a single section between the pedagogical
 * "Découverte" reading and the expert "Avancé" reading. Each section owns its
 * own state — this is never a single global switch.
 */
export function ModeToggle({
  mode,
  onChange,
  size = 'sm',
}: {
  mode: IkigaiMode;
  onChange: (m: IkigaiMode) => void;
  size?: 'sm' | 'xs';
}) {
  const pad = size === 'xs' ? 'px-2 py-0.5 text-[0.6rem]' : 'px-2.5 py-1 text-[0.65rem]';
  return (
    <div
      role="group"
      aria-label="Niveau de lecture de la section"
      className="inline-flex items-center gap-0.5 rounded-full border border-outline-variant bg-surface-container-low p-0.5"
    >
      {(['decouverte', 'avance'] as const).map((m) => {
        const active = mode === m;
        const Icon = m === 'decouverte' ? BookOpen : GraduationCap;
        return (
          <button
            key={m}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(m)}
            className={`inline-flex items-center gap-1 rounded-full font-medium uppercase tracking-[0.1em] transition-colors ${pad} ${
              active
                ? 'bg-[color:var(--primary)] text-[color:var(--on-primary)]'
                : 'text-surface-variant hover:text-foreground'
            }`}
          >
            <Icon size={size === 'xs' ? 10 : 11} aria-hidden />
            {m === 'decouverte' ? 'Découverte' : 'Avancé'}
          </button>
        );
      })}
    </div>
  );
}

/** Numbered editorial section header (§ NN — label) with an optional mode toggle. */
export function SectionRule({
  n,
  label,
  mode,
  onMode,
  className,
}: {
  n: string;
  label: string;
  mode?: IkigaiMode;
  onMode?: (m: IkigaiMode) => void;
  className?: string;
}) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-center gap-x-4 gap-y-3', className)}>
      <span className="font-mono text-xs font-semibold tracking-[0.2em] text-[color:var(--primary)]">§ {n}</span>
      <span className="h-px flex-1 bg-[color-mix(in_srgb,var(--outline-variant)_70%,transparent)]" />
      <span className="eyebrow !tracking-[0.28em]">{label}</span>
      {mode && onMode && <ModeToggle mode={mode} onChange={onMode} />}
    </div>
  );
}

/** Sticky chapter head: it remains inside its own section and is pushed away by the next one. */
export function StickyChapterHeader({
  n,
  label,
  title,
  description,
  mode,
  onMode,
}: {
  n: string;
  label: string;
  title: ReactNode;
  description?: ReactNode;
  mode?: IkigaiMode;
  onMode?: (m: IkigaiMode) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const section = el?.closest('section');
    if (!el || !(section instanceof HTMLElement)) return;

    const mq = window.matchMedia('(min-width: 1024px)');
    const updateOffset = () => {
      const chromeOffset = mq.matches ? 0 : 56;
      section.style.setProperty('--ikigai-subhead-top', `${Math.ceil(el.offsetHeight + chromeOffset)}px`);
    };

    updateOffset();
    const resizeObserver = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateOffset) : null;
    resizeObserver?.observe(el);
    window.addEventListener('resize', updateOffset);
    mq.addEventListener('change', updateOffset);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener('resize', updateOffset);
      mq.removeEventListener('change', updateOffset);
      section.style.removeProperty('--ikigai-subhead-top');
    };
  }, []);

  return (
    <>
      <div
        ref={ref}
        className="sticky top-14 z-30 -mx-4 border-y border-outline-variant bg-[color-mix(in_srgb,var(--surface)_90%,transparent)] px-4 py-4 shadow-editorial-sm backdrop-blur-xl sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-8 lg:px-8"
      >
        <SectionRule n={n} label={label} mode={mode} onMode={onMode} className="mb-3" />
        <h2 className="max-w-3xl font-headline text-headline-lg font-semibold leading-tight text-balance sm:text-display-sm">
          {title}
        </h2>
      </div>
      {description && <p className="mt-3 max-w-2xl text-surface-variant">{description}</p>}
    </>
  );
}

/** Sticky sub-head for a list item inside the current chapter. */
export function StickySubsectionHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      style={{ top: 'var(--ikigai-subhead-top, 12rem)' }}
      className={cn(
        'sticky z-20 -mx-2 rounded-lg border border-outline-variant bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-2.5 py-2 shadow-editorial-xs backdrop-blur-xl sm:-mx-3 sm:px-3',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * A numbered subsection inside a pinned chapter: the scroll-anchored `<article>`
 * whose id drives the active dimension, dimmed when another subsection is active.
 */
export function SubsectionArticle({
  id,
  active,
  hasActive,
  children,
}: {
  id: string;
  /** This subsection is the active one. */
  active: boolean;
  /** Some subsection (this one or another) is active — dims the rest. */
  hasActive: boolean;
  children: ReactNode;
}) {
  return (
    <article
      id={id}
      className={`py-7 transition-opacity duration-500 ease-in-out ${hasActive && !active ? 'opacity-30' : 'opacity-100'} hover:opacity-100`}
      style={subsectionAnchorStyle}
    >
      {children}
    </article>
  );
}

/**
 * The numbered title line shared by the Intersections and Presque chapters:
 * roman numeral · title · italic subtitle, with an eyebrow caption underneath.
 * Lives inside a {@link StickySubsectionHeader}.
 */
export function SubsectionTitleRow({
  roman,
  title,
  subtitle,
  eyebrow,
  active,
}: {
  roman: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  eyebrow: ReactNode;
  active: boolean;
}) {
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-xs text-[color:var(--primary)]">{roman}.</span>
        <h3 className={`font-headline text-headline-md font-semibold transition-colors duration-500 ${active ? 'text-[color:var(--primary)]' : ''}`}>{title}</h3>
        <span className={`font-headline text-sm italic transition-colors duration-500 ${active ? 'text-[color:var(--primary)]/80' : 'text-surface-variant'}`}>{subtitle}</span>
      </div>
      <p className={`eyebrow mt-1.5 !tracking-[0.16em] normal-case transition-colors duration-500 ${active ? 'text-[color:var(--primary)]/90' : 'text-surface-variant'}`}>{eyebrow}</p>
    </>
  );
}

/** Explains the difference between the two reading levels, with a global shortcut. */
export function ReadingLevelLegend({ onSetAll }: { onSetAll: (m: IkigaiMode) => void }) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-low/60 p-5">
      <p className="eyebrow mb-3">Niveau de lecture</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-container text-surface-variant">
            <BookOpen size={14} aria-hidden />
          </span>
          <p className="text-sm leading-relaxed text-surface-variant">
            <span className="font-medium text-foreground">Découverte</span> — un langage clair et pédagogique. Aucun
            prérequis : les noms de fonds et d'outils restent cliquables.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_14%,transparent)] text-[color:var(--primary)]">
            <GraduationCap size={14} aria-hidden />
          </span>
          <p className="text-sm leading-relaxed text-surface-variant">
            <span className="font-medium text-foreground">Avancé</span> — le vocabulaire VC, les métriques et les
            concepts experts s'activent en popovers (LP, carry, DPI, due diligence…).
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-outline-variant pt-4 text-xs text-surface-variant">
        <span>Régler tout le cahier&nbsp;:</span>
        <button onClick={() => onSetAll('decouverte')} className="btn-quiet !px-3 !py-1 text-xs">
          Tout en Découverte
        </button>
        <button onClick={() => onSetAll('avance')} className="btn-quiet !px-3 !py-1 text-xs">
          Tout en Avancé
        </button>
        <span className="ml-auto italic">Chaque section garde son propre réglage.</span>
      </div>
    </div>
  );
}

export function ThreeModeSelector({
  mode,
  onChange,
}: {
  mode: OnboardingMode;
  onChange: (m: OnboardingMode) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Mode de parcours d'onboarding"
      className="inline-flex w-full items-center gap-1 rounded-2xl border border-outline-variant bg-surface-container-low p-1 sm:w-auto"
    >
      {([
        { id: 'editorial', label: 'Éditorial', Icon: BookOpen, desc: 'Cahier d’introspection complet' },
        { id: 'bref', label: 'Bref', Icon: AlignLeft, desc: 'Données synthétiques de l’écosystème' },
        { id: 'interactif', label: 'Interactif', Icon: Zap, desc: 'Scénarios décisionnels interactifs' }
      ] as const).map((item) => {
        const active = mode === item.id;
        return (
          <button
            key={item.id}
            type="button"
            title={item.desc}
            aria-pressed={active}
            onClick={() => onChange(item.id)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 px-3 text-[0.75rem] font-medium uppercase tracking-[0.08em] transition-all sm:flex-none ${
              active
                ? 'bg-[color:var(--primary)] text-[color:var(--on-primary)] shadow-editorial-xs'
                : 'text-surface-variant hover:text-foreground hover:bg-surface-container'
            }`}
          >
            <item.Icon size={13} aria-hidden />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
