import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, BookOpen, Clock, Layers } from 'lucide-react';
import { WaxSeal } from '@/components/ornaments/Illustrations';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
import { LevelBadge, ProgressRing } from '@/components/ui/primitives';
import { antiPortfolioPatternById } from '@/content/antiPortfolio';
import { FAMILY_META, lessonIdsForParcours } from '@/content/parcours';
import { formatMinutes, parcoursTimeSummary } from '@/content/learningTime';
import { CASE_KIND_LABEL, ECOSYSTEM_KIND_LABEL } from '@/content/labels';
import { useUserData } from '@/context/UserDataContext';
import { parcoursSealName } from '@/lib/parcoursMorph';
import { cn, formatDateFr, pluralize } from '@/lib/utils';
import type { AntiPortfolioEntry, BlogPost, CaseStudy, Deliverable, EcosystemDossier, InvestmentMemo, Simulator } from '@/content/types';
import type { Parcours } from '@/content/parcours';
import type { ParcoursProgressSummary } from '@/lib/parcoursProgress';
import { useLearningWorkspace } from '@/lib/learningWorkspace';

/**
 * La carte de recommandation — tableau de bord, résultat de profil.
 *
 * L'index `/parcours` ne l'utilise plus : il compare vingt-quatre parcours, ce
 * qu'une grille de cartes rend impossible. Voir `ParcoursRow`.
 */
export function ParcoursCard({
  parcours,
  index = 0,
}: {
  parcours: Parcours;
  index?: number;
}) {
  const { progress } = useUserData();
  const workspace = useLearningWorkspace();
  const meta = FAMILY_META[parcours.family];
  const accent = parcours.accent ?? meta.accent;
  const lessonIds = lessonIdsForParcours(parcours);
  const done = lessonIds.filter((id) => progress[id]?.status === 'done').length;
  const pct = lessonIds.length ? Math.round((done / lessonIds.length) * 100) : 0;
  const time = parcoursTimeSummary(parcours);
  const finalStep = parcours.steps.find((step) => step.ref.kind === 'milestone');
  const finalEntry = finalStep ? workspace.productions[finalStep.ref.id] : undefined;
  const finalLabel = finalEntry?.declaredCompleteAt
    ? 'Jalon terminé'
    : finalEntry?.stage === 'revised'
      ? 'Jalon révisé'
      : finalEntry
        ? 'Jalon en cours'
        : 'Jalon à produire';

  return (
    <Link
      to={`/parcours/${parcours.slug}`}
      className="premium-card premium-card-hover sheen-host group isolate flex h-full min-w-0 flex-col overflow-hidden p-6"
      style={{ borderTopColor: `color-mix(in srgb, ${accent} 50%, transparent)`, borderTopWidth: 2 }}
    >
      <span
        aria-hidden
        className="contour-field pointer-events-none absolute -right-10 -top-10 -z-10 h-44 w-44 rounded-full opacity-70 transition-opacity duration-500 group-hover:opacity-100"
        style={{ '--contour': accent } as React.CSSProperties}
      />
      <div className="flex items-start justify-between gap-4">
        <WaxSeal
          glyph={parcours.kanji ?? meta.kanji}
          accent={accent}
          size={48}
          className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-rotate-6 group-hover:scale-105"
        />
        {pct > 0 ? (
          <ProgressRing value={pct} size={42} stroke={3} accent={accent} accessibleLabel={`Progression : ${done} leçons lues sur ${lessonIds.length}`} />
        ) : (
          <span className="font-mono text-xs text-surface-variant">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <LevelBadge level={parcours.level} accent={accent} />
        <span className="chip">{meta.label}</span>
      </div>
      <h3 className="mt-3 font-headline text-headline-md font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">
        {parcours.title}
      </h3>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-surface-variant">{parcours.hook}</p>
      {finalStep && <p className="mt-3 text-xs text-surface-variant"><span className="font-medium text-foreground">{finalLabel}</span> · {done}/{lessonIds.length} leçons lues</p>}
      <div className="mt-5 flex items-end justify-between gap-3 text-xs text-surface-variant">
        <span className="inline-flex flex-col gap-1">
          <span className="inline-flex items-center gap-1.5"><Clock size={13} aria-hidden /> {parcours.time.source === 'derived' ? `${formatMinutes(time.readingMinutes)} de lecture` : `≈ ${formatMinutes(time.requiredMinutes)} au total`}</span>
          {parcours.time.source === 'derived' && <span>{formatMinutes(time.guidedPracticeMinutes + time.consolidationMinutes + time.finalMinutes)} de production</span>}
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium text-[color:var(--primary)]">
          {pct > 0 ? 'Reprendre' : 'Commencer'} <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

/**
 * Un fait de la bande méta, séparateur compris.
 *
 * Le point est solidaire de l'élément qu'il précède : posé en enfant flex
 * autonome, il resterait orphelin en fin de ligne dès que la bande passe à la
 * ligne — ce qui arrive à 390 px.
 */
function MetaItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <span aria-hidden className="text-outline-variant">·</span>
      {children}
    </span>
  );
}

/**
 * L'unité de l'index `/parcours` : une rangée comparable, pas une carte.
 *
 * Vingt-quatre parcours en grille de cartes empêchent la seule chose que le
 * lecteur veut faire — les comparer. La rangée aligne les faits qui décident
 * réellement du choix : le temps requis, le nombre de séances, le niveau et la
 * nature du jalon. Le tout sur une seule ligne de lecture, et une seule cible
 * cliquable par parcours.
 *
 * La progression vient d'en haut : la page calcule les vingt-quatre résumés en
 * une passe mémoïsée et les distribue, plutôt que chaque rangée recalculant le
 * sien.
 */
export function ParcoursRow({ parcours, summary, href, morph = false, onOpen }: {
  parcours: Parcours;
  summary: ParcoursProgressSummary;
  href: string;
  /** Vrai pour la seule rangée dont le sceau est emporté dans la transition. */
  morph?: boolean;
  /**
   * Prend la main sur un clic gauche simple pour piloter la transition du sceau.
   * Les clics modifiés — nouvel onglet, nouvelle fenêtre — restent au navigateur.
   */
  onOpen?: () => void;
}) {
  const workspace = useLearningWorkspace();
  const meta = FAMILY_META[parcours.family];
  const accent = parcours.accent ?? meta.accent;
  const time = parcoursTimeSummary(parcours);

  // Le jalon se lit sur l'objet `milestone`, pas sur la présence d'une étape :
  // quatorze parcours en déclarent un sans étape correspondante et n'affichaient
  // donc aucun signal. L'état, lui, reste réservé aux dix qui portent une
  // production traçable — un état sans donnée utilisateur serait une décoration.
  const milestone = parcours.milestone && parcours.milestone.type !== 'none' ? parcours.milestone : undefined;
  const milestoneStep = parcours.steps.find((step) => step.ref.kind === 'milestone');
  const production = milestoneStep ? workspace.productions[milestoneStep.ref.id] : undefined;
  const milestoneLabel = !milestone
    ? undefined
    : production?.declaredCompleteAt
      ? 'Jalon terminé'
      : production?.stage === 'revised'
        ? 'Jalon révisé'
        : production
          ? 'Jalon en cours'
          : `Jalon : ${milestone.label}`;


  return (
    <li>
      <Link
        to={href}
        onClick={(event) => {
          if (!onOpen || event.defaultPrevented) return;
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          onOpen();
        }}
        className="group -mx-3 flex items-start gap-4 rounded-xl px-3 py-4 transition-colors duration-200 hover:bg-surface-container-low/60 sm:gap-5"
      >
        <KanjiSeal
          kanji={parcours.kanji ?? meta.kanji}
          accent={accent}
          size={40}
          className="mt-0.5"
          morphName={morph ? parcoursSealName(parcours.slug) : undefined}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="font-headline text-headline-sm font-semibold leading-snug transition-colors group-hover:text-[color:var(--primary)]">
              {parcours.title}
            </h3>
            <ArrowRight
              size={14}
              aria-hidden
              className="shrink-0 self-center text-surface-variant transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[color:var(--primary)]"
            />
          </div>
          <p className="mt-1 line-clamp-2 max-w-[58ch] text-sm leading-relaxed text-surface-variant">
            {parcours.hook}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs text-surface-variant">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={13} aria-hidden /> {formatMinutes(time.requiredMinutes)}
            </span>
            <MetaItem>{pluralize(parcours.steps.length, 'étape')}</MetaItem>
            <MetaItem><LevelBadge level={parcours.level} accent={accent} /></MetaItem>
            {milestoneLabel && (
              <MetaItem className="min-w-0"><span className="truncate">{milestoneLabel}</span></MetaItem>
            )}
          </div>
        </div>

        {/* Une seule colonne d'état, à hauteur du titre : l'anneau quand il y a
            une progression réelle, sinon la mise en avant éditoriale. Le libellé
            « Commencer » a été retiré — répété vingt-quatre fois, il n'informait
            plus, et déplaçait la colonne de lecture d'une rangée à l'autre. */}
        <div className="shrink-0 pt-0.5">
          {summary.percent > 0 ? (
            <ProgressRing
              value={summary.percent}
              size={34}
              stroke={3}
              accent={accent}
              accessibleLabel={`Progression : ${summary.completedSteps} étapes effectuées sur ${summary.totalSteps}`}
            />
          ) : parcours.roadmap === 'now' ? (
            <span className="chip !border-[color-mix(in_srgb,var(--primary)_45%,transparent)] !text-[color:var(--primary)]">
              Phare
            </span>
          ) : null}
        </div>
      </Link>
    </li>
  );
}

export function LessonRow({ slug, href, order, title, kicker, readMin, practiceMin, summary, done, reading, upcoming = false }: {
  slug: string; href?: string; order: number; title: string; kicker: string; readMin: number; practiceMin?: number; summary?: string; done?: boolean; reading?: boolean; upcoming?: boolean;
}) {
  const content = (
    <>
      <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-xs ${done ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[color:var(--primary)]' : reading ? 'border-[color-mix(in_srgb,var(--primary)_40%,transparent)] text-foreground' : 'border-outline-variant text-surface-variant'}`}>
        {done ? '✓' : String(order).padStart(2, '0')}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-surface-variant">{kicker}</span>
          {reading && <span className="chip !py-0 text-[0.5625rem]">en cours</span>}
          {upcoming && <span className="chip !py-0 text-[0.5625rem]">à venir</span>}
        </span>
        <span className="mt-0.5 block font-medium leading-snug transition-colors group-hover:text-[color:var(--primary)]">{title}{upcoming ? ' (à venir)' : ''}</span>
        {summary && <span className="mt-1 line-clamp-1 block text-sm text-surface-variant">{summary}</span>}
      </span>
      {!upcoming && (
        <span className="mt-1 shrink-0 text-right text-xs text-surface-variant">
          <span className="block">{readMin} min lecture</span>
          {practiceMin && <span className="mt-0.5 block">{practiceMin} min pratique</span>}
        </span>
      )}
    </>
  );
  const className = "group flex items-start gap-4 rounded-xl border border-transparent px-3 py-3.5 transition-colors";
  if (upcoming) return <div className={`${className} opacity-70`}>{content}</div>;
  return <Link to={href ?? `/lessons/${slug}`} className={`${className} hover:border-outline-variant hover:bg-surface-container-low`}>{content}</Link>;
}

export function CaseCard({ cs }: { cs: CaseStudy }) {
  return (
    <Link to={`/cases/${cs.slug}`} className="premium-card premium-card-hover group flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-outline-variant px-6 py-3">
        <span className="chip">{CASE_KIND_LABEL[cs.kind] ?? cs.kind}</span>
        <span className="font-mono text-xs text-surface-variant">{cs.year}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-headline text-headline-sm font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">{cs.title}</h3>
        <p className="mt-1.5 text-sm italic text-surface-variant">{cs.subtitle}</p>
        <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-surface-variant">{cs.summary}</p>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-surface-variant"><Clock size={13} /> {cs.readMin} min · {cs.company}</div>
      </div>
    </Link>
  );
}

export function MemoCard({ memo }: { memo: InvestmentMemo }) {
  return (
    <Link to={`/memos/${memo.slug}`} className="premium-card premium-card-hover group flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-outline-variant px-6 py-3">
        <span className="chip">{memo.fund}</span>
        <span className="font-mono text-xs text-surface-variant">{memo.stage} · {memo.date}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-headline text-headline-md font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">
          {memo.company}
        </h3>
        <p className="mt-1.5 text-sm italic text-surface-variant">{memo.author}{memo.amount ? ` · ${memo.amount}` : ''}</p>
        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-surface-variant">{memo.whyItMatters}</p>
        <div className="mt-5 flex items-center justify-between text-xs text-surface-variant">
          <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {memo.readMin} min</span>
          <span className="inline-flex items-center gap-1.5 font-medium text-[color:var(--primary)]">
            Lire l'annotation <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function AntiPortfolioEntryCard({ entry }: { entry: AntiPortfolioEntry }) {
  const firstPass = entry.passes[0];
  const patterns = entry.patternIds
    .map((id) => antiPortfolioPatternById(id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <Link to={`/anti-portfolio/${entry.slug}`} className="premium-card premium-card-hover group flex flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-outline-variant px-6 py-3">
        <span className="font-mono text-xs text-surface-variant">{firstPass.year}</span>
        <span className="flex items-center gap-1.5">
          {patterns.map((p) => (
            <span key={p.id} title={p.label} className="grid h-6 w-6 place-items-center rounded-full text-[0.7rem]" style={{ color: p.accent, background: `color-mix(in srgb, ${p.accent} 12%, transparent)` }}>
              {p.glyph}
            </span>
          ))}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">
          {entry.passes.map((p) => p.fund).join(' · ')}
        </p>
        <h3 className="mt-2 font-headline text-headline-md font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">
          {entry.company}
        </h3>
        <p className="mt-1.5 text-sm italic text-surface-variant">{entry.subtitle}</p>
        {entry.quote ? (
          <blockquote className="mt-4 border-l-2 border-[color-mix(in_srgb,var(--primary)_40%,transparent)] pl-3 font-headline text-[0.95rem] italic leading-snug">
            « {entry.quote.text} »
          </blockquote>
        ) : (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-surface-variant">{entry.summary}</p>
        )}
        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-surface-variant">
          <span className="line-clamp-1">{entry.outcome.split('.')[0].slice(0, 64)}...</span>
          <ArrowUpRight size={15} className="shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}

export function DeliverableCard({ deliverable }: { deliverable: Deliverable }) {
  return (
    <Link to={`/livrables/${deliverable.slug}`} className="premium-card premium-card-hover group flex flex-col p-6">
      <div className="flex items-center justify-between gap-3 text-xs text-surface-variant">
        <span className="chip">Livrable</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {deliverable.readMin} min</span>
      </div>
      <h3 className="mt-4 font-headline text-headline-md font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)]">
        {deliverable.title}
      </h3>
      {deliverable.kicker && <p className="mt-1.5 text-sm italic text-surface-variant">{deliverable.kicker}</p>}
      <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-surface-variant">{deliverable.summary}</p>
      {deliverable.tags && deliverable.tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {deliverable.tags.slice(0, 3).map((tag) => <span key={tag} className="chip">{tag}</span>)}
        </div>
      )}
    </Link>
  );
}

export function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  return (
    <Link to={`/blog/${post.slug}`} className={`premium-card premium-card-hover group flex flex-col p-6 ${featured ? 'md:p-8' : ''}`}>
      <div className="flex items-center gap-3 text-xs text-surface-variant">
        <span className="chip">{post.category}</span>
        <span>{formatDateFr(post.date)}</span>
      </div>
      <h3 className={`mt-4 font-headline font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)] ${featured ? 'text-display-sm' : 'text-headline-md'}`}>
        {post.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm italic text-surface-variant">{post.subtitle}</p>
      {post.books && post.books.length > 0 && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-surface-variant">
          <BookOpen size={13} />
          {post.books.map((b) => `${b.title} — ${b.author}${b.year ? ` (${b.year})` : ''}`).join(' · ')}
        </p>
      )}
      <p className={`mt-3 flex-1 text-sm leading-relaxed text-surface-variant ${featured ? 'line-clamp-4' : 'line-clamp-3'}`}>{post.excerpt}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-surface-variant">
        <span>{post.author}</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {post.readMin} min</span>
      </div>
    </Link>
  );
}

export function EcosystemCard({ dossier, childCount = 0, featured = false }: { dossier: EcosystemDossier; childCount?: number; featured?: boolean }) {
  const convictions = dossier.convictions?.length ?? 0;
  const signals = dossier.signals?.length ?? 0;
  // Adaptive meta: branch nodes advertise their sub-dossiers; leaves show their
  // convictions/signals, falling back to the section count when they have none.
  const meta = childCount > 0
    ? pluralize(childCount, 'sous-dossier')
    : convictions + signals > 0
      ? `${pluralize(convictions, 'conviction')} · ${pluralize(signals, 'signal', 'signaux')}`
      : pluralize(dossier.sections.length, 'partie');
  return (
    <Link
      to={`/ecosystemes/${dossier.slug}`}
      className={`premium-card premium-card-hover group flex flex-col p-6 ${featured ? 'md:p-8' : ''}`}
      style={{ borderTopColor: `color-mix(in srgb, ${dossier.accent} 50%, transparent)`, borderTopWidth: 2 }}
    >
      <div className="flex items-center justify-between gap-3 text-xs text-surface-variant">
        <span className="flex items-center gap-2">
          <span className="chip" style={{ color: dossier.accent }}>{ECOSYSTEM_KIND_LABEL[dossier.kind] ?? dossier.kind}</span>
          <span className="font-medium text-foreground">{dossier.name}</span>
        </span>
        <span>MAJ {formatDateFr(dossier.updatedAt)}</span>
      </div>
      <h3 className={`mt-4 font-headline font-semibold leading-tight transition-colors group-hover:text-[color:var(--primary)] ${featured ? 'text-display-sm' : 'text-headline-md'}`}>
        {dossier.title}
      </h3>
      <p className="mt-2 line-clamp-2 text-sm italic text-surface-variant">{dossier.subtitle}</p>
      <p className={`mt-3 flex-1 text-sm leading-relaxed text-surface-variant ${featured ? 'line-clamp-4' : 'line-clamp-3'}`}>{dossier.summary}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-surface-variant">
        <span>{meta}</span>
        <span className="inline-flex items-center gap-1.5"><Clock size={13} /> {dossier.readMin} min</span>
      </div>
    </Link>
  );
}

export function SimulatorCard({ sim }: { sim: Simulator }) {
  const titleId = `outil-${sim.slug}`;
  return (
    <Link
      id={`simulateur-${sim.slug}`}
      to={`/simulators/${sim.slug}`}
      aria-labelledby={titleId}
      aria-describedby={`${titleId}-resultat`}
      className="group grid scroll-my-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-3.5 hover:bg-surface-container-low focus-visible:bg-surface-container-low sm:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)_auto] sm:gap-x-5 sm:px-3 sm:py-3"
    >
      <h3 id={titleId} className="font-headline text-headline-sm font-semibold leading-tight group-hover:text-primary">{sim.title}</h3>
      <p id={`${titleId}-resultat`} className="col-start-1 text-sm leading-relaxed text-surface-variant sm:col-start-2 sm:row-start-1">{sim.subtitle}</p>
      <ArrowRight size={17} aria-hidden className="col-start-2 row-start-1 row-end-3 text-primary sm:col-start-3 sm:row-end-2" />
    </Link>
  );
}

export function GlossaryRefList({ slugs, title = 'Termes liés' }: { slugs: string[]; title?: string }) {
  if (!slugs.length) return null;
  return (
    <div>
      <p className="eyebrow mb-3 flex items-center gap-2"><Layers size={13} /> {title}</p>
      <div className="flex flex-wrap gap-2">
        {slugs.map((s) => (
          <Link key={s} to={`/glossary?term=${s}`} className="chip transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:text-foreground">
            {s.replace(/-/g, ' ')}
          </Link>
        ))}
      </div>
    </div>
  );
}
