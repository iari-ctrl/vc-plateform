import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { InlineMarkdown } from '@/lib/markdown';
import {
  ArrowLeft, ArrowRight, Check, Clock, Users, Target, Trophy, BookOpen,
  Briefcase, FlaskConical, BookA, Dumbbell, Heart, CircleDot, ClipboardCheck, FileCheck2,
  type LucideIcon,
} from 'lucide-react';
import {
  parcoursBySlug, resolveStep, lessonIdsForParcours, visibleSteps,
  FAMILY_META, type ParcoursStep, type StepType, type TimeBudget,
} from '@/content/parcours';
import { formatMinutes, parcoursTimeSummary } from '@/content/learningTime';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
import { ProgressBar, LevelBadge } from '@/components/ui/primitives';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useUserData } from '@/context/UserDataContext';
import { useResourcePageMeta } from '@/lib/seo';
import { productionStageAtLeast, useLearningWorkspace, type ProductionStage } from '@/lib/learningWorkspace';
import NotFoundPage from '@/pages/system/NotFoundPage';

const STEP_META: Record<StepType, { label: string; icon: LucideIcon; color: string; hint: string }> = {
  coeur: { label: 'Cœur', icon: Target, color: 'var(--primary)', hint: 'La colonne vertébrale — l’indispensable.' },
  pratique: { label: 'Pratique', icon: Dumbbell, color: '#3E7C6A', hint: 'Fais quelque chose : un simulateur, un livrable.' },
  bonus: { label: 'Bonus', icon: BookOpen, color: '#8A5A8A', hint: 'L’approfondissement, si le temps suit.' },
  respiration: { label: 'Respiration', icon: Heart, color: '#C2603F', hint: 'Léger et fun : un cas, un mythe démonté.' },
};

const KIND_ICON: Record<string, LucideIcon> = {
  lesson: BookOpen, case: Briefcase, simulator: FlaskConical, glossary: BookA, deliverable: FileCheck2, milestone: Trophy,
};

const TIME_BUDGETS: { id: TimeBudget; label: string; sub: string }[] = [
  { id: 'low', label: 'Essentiel', sub: 'Étapes essentielles' },
  { id: 'medium', label: 'Standard', sub: 'Cœur + pratique' },
  { id: 'high', label: 'Complet', sub: 'Toutes les étapes' },
];

const HOURS_FORMATTER = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 2 });

export default function ParcoursDetailPage() {
  const { slug } = useParams();
  const parcours = slug ? parcoursBySlug(slug) : undefined;
  const { progress, profile } = useUserData();
  const workspace = useLearningWorkspace();
  const [budget, setBudget] = useState<TimeBudget>((profile?.timeBudget as TimeBudget) ?? 'high');

  useResourcePageMeta(Boolean(parcours), parcours?.title, parcours?.hook);

  const lessonIds = useMemo(() => (parcours ? lessonIdsForParcours(parcours) : []), [parcours]);
  const done = lessonIds.filter((id) => progress[id]?.status === 'done').length;
  const pct = lessonIds.length ? Math.round((done / lessonIds.length) * 100) : 0;

  if (!parcours) return <NotFoundPage />;

  const meta = FAMILY_META[parcours.family];
  const accent = parcours.accent ?? meta.accent;
  const steps = visibleSteps(parcours, budget);
  const allSteps = [...parcours.steps].sort((a, b) => a.order - b.order);
  const timeSummary = parcoursTimeSummary(parcours);
  const finalStep = allSteps.find((step) => step.ref.kind === 'milestone');
  const finalEntry = finalStep ? workspace.productions[finalStep.ref.id] : undefined;
  const finalStatus = finalEntry?.declaredCompleteAt
    ? 'Déclaré terminé'
    : finalEntry
      ? ({
          started: 'Production commencée',
          'first-version-completed': 'Première version terminée',
          reviewed: 'Retour effectué',
          revised: 'Production révisée',
        } satisfies Record<ProductionStage, string>)[finalEntry.stage]
      : 'Non commencé';
  const diagnosticAnswers = parcours.entryDiagnosticId
    ? Object.keys(workspace.diagnostics[parcours.entryDiagnosticId]?.answers ?? {}).length
    : 0;
  const isResolvedDone = (r: ReturnType<typeof resolveStep>) => {
    const ids = r.lessonIds ?? (r.lessonId ? [r.lessonId] : []);
    return ids.length > 0 && ids.every((id) => progress[id]?.status === 'done');
  };

  // « Reprendre où j'en étais » — first reachable step that isn't done yet.
  const hasLearningActivity = done > 0 || allSteps.some((step) => (
    (step.ref.kind === 'deliverable' || step.ref.kind === 'milestone') && Boolean(workspace.productions[step.ref.id])
  ));
  const resume = allSteps
    .map((s) => ({ s, r: resolveStep(s) }))
    .find(({ s, r }) => {
      if (!r.href) return false;
      if (s.ref.kind === 'case') return !hasLearningActivity && s.order === allSteps[0]?.order;
      if (s.ref.kind === 'deliverable' || s.ref.kind === 'milestone') {
        const entry = workspace.productions[s.ref.id];
        return s.ref.kind === 'milestone' ? !entry?.declaredCompleteAt : !productionStageAtLeast(entry?.stage, 'revised');
      }
      return !isResolvedDone(r);
    });
  const diagnosticHref = parcours.entryDiagnosticId ? `/parcours/${parcours.slug}/diagnostic` : null;
  const resumeHref = !hasLearningActivity && diagnosticAnswers === 0 && diagnosticHref
    ? diagnosticHref
    : resume?.r.href ?? allSteps.map((s) => resolveStep(s)).find((r) => r.href)?.href ?? null;

  const hidden = parcours.steps.length - steps.length;

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-outline-variant" style={{ background: `linear-gradient(180deg, color-mix(in srgb, ${accent} 8%, transparent), transparent)` }}>
        <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8">
          <Link to="/parcours" className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} /> Tous les parcours</Link>
          <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <KanjiSeal kanji={parcours.kanji ?? meta.kanji} accent={accent} size={64} />
                <div>
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-surface-variant">{meta.label}</p>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <LevelBadge level={parcours.level} accent={accent} />
                    {parcours.perspective === 'both' && <span className="chip">Les deux sièges de la table</span>}
                  </div>
                </div>
              </div>
              <h1 className="mt-5 font-headline text-display-md font-semibold leading-[1.05] tracking-tight text-balance">{parcours.title}</h1>
              <p className="mt-3 max-w-2xl text-[1.0625rem] font-headline italic leading-relaxed text-surface-variant text-pretty">{parcours.hook}</p>
              <p className="mt-4 max-w-2xl text-[0.95rem] leading-relaxed text-surface-variant text-pretty">{parcours.goal}</p>
              <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-surface-variant">
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={15} aria-hidden />
                  {parcours.time.source === 'derived'
                    ? `${formatMinutes(timeSummary.readingMinutes)} de lecture · ${formatMinutes(timeSummary.guidedPracticeMinutes + timeSummary.consolidationMinutes + timeSummary.finalMinutes)} de production`
                    : parcours.time.withBonusHours
                      ? `≈ ${HOURS_FORMATTER.format(parcours.time.coreHours)} h pour l’essentiel · ${HOURS_FORMATTER.format(parcours.time.withBonusHours)} h pour le parcours complet`
                      : `≈ ${HOURS_FORMATTER.format(parcours.time.coreHours)} h`}
                </span>
                <span className="inline-flex items-center gap-1.5"><Target size={15} /> {parcours.steps.length} étapes</span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                {resumeHref && (
                  <Link to={resumeHref} className="btn-foil">
                    {pct > 0 ? 'Reprendre où j’en étais' : 'Commencer le parcours'}
                  </Link>
                )}
                <BookmarkButton variant="labelled" item={{ itemType: 'parcours', itemId: parcours.id, title: parcours.title, href: `/parcours/${parcours.slug}` }} />
              </div>
            </div>

            <div className="space-y-5 rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
              {lessonIds.length > 0 && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">Leçons déclarées lues</span>
                    <span className="text-surface-variant">{done}/{lessonIds.length} · {pct}%</span>
                  </div>
                  <ProgressBar value={pct} accent={accent} label="Leçons déclarées lues" />
                  {finalStep && <p className="mt-3 text-xs text-surface-variant"><span className="font-medium text-foreground">Jalon final :</span> {finalStatus}</p>}
                </div>
              )}
              <div>
                <p className="eyebrow mb-3 flex items-center gap-2"><Users size={13} /> Pour qui</p>
                <div className="flex flex-wrap gap-2">
                  {parcours.forWhom.map((w, i) => <span key={i} className="chip">{w}</span>)}
                </div>
              </div>
              {parcours.prerequisites && parcours.prerequisites.length > 0 && (
                <div>
                  <p className="eyebrow mb-3 flex items-center gap-2"><BookOpen size={13} /> Pré-requis</p>
                  <ul className="space-y-2">
                    {parcours.prerequisites.map((p, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-surface-variant">
                        <span className="mt-[0.35rem] h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
                        <span className="leading-relaxed text-foreground"><InlineMarkdown source={p} glossaryPreview /></span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <p className="eyebrow mb-3">Compétences visées</p>
                <ul className="space-y-2">
                  {parcours.outcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-surface-variant">
                      <Check size={15} className="mt-0.5 shrink-0" style={{ color: accent }} />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spine */}
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {parcours.time.source === 'derived' && (
          <section className="mb-8 rounded-2xl border border-outline-variant bg-surface-container-lowest p-5" aria-labelledby="parcours-time-title">
            <p className="eyebrow">Temps estimés</p>
            <h2 id="parcours-time-title" className="mt-2 font-headline text-headline-md font-semibold">Lecture et production</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div><dt className="text-xs text-surface-variant">Lecture des leçons</dt><dd className="mt-1 font-mono text-lg font-semibold">{formatMinutes(timeSummary.readingMinutes)}</dd></div>
              <div><dt className="text-xs text-surface-variant">Contributions guidées</dt><dd className="mt-1 font-mono text-lg font-semibold">{formatMinutes(timeSummary.guidedPracticeMinutes)}</dd></div>
              <div><dt className="text-xs text-surface-variant">Consolidation et jalon</dt><dd className="mt-1 font-mono text-lg font-semibold">{formatMinutes(timeSummary.consolidationMinutes + timeSummary.finalMinutes)}</dd></div>
              <div><dt className="text-xs text-surface-variant">Activités facultatives</dt><dd className="mt-1 font-mono text-lg font-semibold">{formatMinutes(timeSummary.optionalMinutes)}</dd></div>
            </dl>
            <p className="mt-4 border-t border-outline-variant pt-4 text-sm text-surface-variant">Charge requise estimée, lecture comprise : <strong className="font-medium text-foreground">{formatMinutes(timeSummary.requiredMinutes)}</strong>. Les activités facultatives ajoutent {formatMinutes(timeSummary.optionalMinutes)}.</p>
          </section>
        )}

        {parcours.entryDiagnosticId && (
          <section className="mb-8 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-5 sm:p-6" aria-labelledby="entry-diagnostic-title">
            <p className="eyebrow flex items-center gap-2"><ClipboardCheck size={14} aria-hidden /> Facultatif · sans note</p>
            <h2 id="entry-diagnostic-title" className="mt-2 font-headline text-headline-md font-semibold">Diagnostic d’entrée</h2>
            <p className="mt-2 text-sm leading-relaxed text-surface-variant">5 situations donnent des repères individuels et des renvois vers les contenus utiles. Le diagnostic ne bloque aucune étape.</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Link to={`/parcours/${parcours.slug}/diagnostic`} className="btn-ghost">{diagnosticAnswers > 0 ? 'Reprendre le diagnostic' : 'Faire le diagnostic'} <ArrowRight size={15} aria-hidden /></Link>
              {diagnosticAnswers > 0 && <span className="text-xs text-surface-variant">{diagnosticAnswers}/5 réponses enregistrées</span>}
            </div>
          </section>
        )}
        {/* Time cursor */}
        <div className="mb-8 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">Niveau d’approfondissement</p>
            <div className="flex gap-1.5" role="group" aria-label="Niveau d’approfondissement">
              {TIME_BUDGETS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  aria-pressed={budget === b.id}
                  title={b.sub}
                  className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    budget === b.id
                      ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground'
                      : 'border-outline-variant text-surface-variant hover:text-foreground'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>
          {hidden > 0 && (
            <p className="mt-2 text-xs text-surface-variant">
              {hidden} étape{hidden > 1 ? 's' : ''} non affichée{hidden > 1 ? 's' : ''} avec ce réglage. Sélectionnez <em>Complet</em> pour afficher l’ensemble du parcours.
            </p>
          )}
        </div>

        <ol className="relative space-y-3 border-l border-outline-variant pl-6">
          {steps.map((step) => (
            <StepRow key={`${step.order}-${step.ref.id}`} step={step} accent={accent} />
          ))}
        </ol>

        {/* Milestone — the reward, not an exam */}
        {parcours.milestone && (
          <div className="mt-10 rounded-2xl border-2 border-dashed p-6 sm:p-7" style={{ borderColor: `color-mix(in srgb, ${accent} 40%, transparent)`, background: `color-mix(in srgb, ${accent} 5%, transparent)` }}>
            <p className="eyebrow flex items-center gap-2"><Trophy size={14} style={{ color: accent }} /> Mise en situation finale</p>
            <h3 className="mt-3 font-headline text-headline-md font-semibold">{parcours.milestone.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-surface-variant">{parcours.milestone.description}</p>
            {parcours.milestone.evaluation && parcours.milestone.evaluation.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {parcours.milestone.evaluation.includes('auto') && <span className="chip">Auto-évaluation (grille)</span>}
                {parcours.milestone.evaluation.includes('peer') && <span className="chip">Revue facultative par un pair</span>}
                {parcours.milestone.evaluation.includes('practitioner') && <span className="chip">Revue facultative par un praticien</span>}
              </div>
            )}
            {finalStep && resolveStep(finalStep).href && (
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Link to={resolveStep(finalStep).href!} className="btn-foil">Ouvrir le jalon final <ArrowRight size={15} aria-hidden /></Link>
                <span className="text-xs text-surface-variant">État : {finalStatus}</span>
              </div>
            )}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-surface-variant">
          Chaque ressource peut être consultée indépendamment. L’ordre proposé constitue une progression recommandée.
        </p>
      </section>
    </div>
  );
}

function StepRow({ step, accent }: { step: ParcoursStep; accent: string }) {
  const { progress } = useUserData();
  const workspace = useLearningWorkspace();
  const sm = STEP_META[step.type];
  const r = resolveStep(step);
  const KindIcon = KIND_ICON[step.ref.kind] ?? BookOpen;
  const trackedLessonIds = r.lessonIds ?? (r.lessonId ? [r.lessonId] : []);
  const isDone = trackedLessonIds.length > 0 && trackedLessonIds.every((id) => progress[id]?.status === 'done');
  const isReading = trackedLessonIds.some((id) => progress[id]?.status === 'reading');
  const production = step.ref.kind === 'deliverable' || step.ref.kind === 'milestone'
    ? workspace.productions[step.ref.id]
    : undefined;
  const productionLabel = production?.declaredCompleteAt
    ? 'terminé'
    : production
      ? ({ started: 'commencé', 'first-version-completed': 'version 1', reviewed: 'revu', revised: 'révisé' } satisfies Record<ProductionStage, string>)[production.stage]
      : undefined;

  const inner = (
    <>
      <span
        aria-hidden
        className="absolute -left-[calc(1.5rem+1px)] top-5 grid h-7 w-7 -translate-x-1/2 place-items-center rounded-full border-2 bg-surface text-[0.6rem]"
        style={{ borderColor: isDone ? accent : `color-mix(in srgb, ${sm.color} 55%, transparent)`, color: sm.color }}
      >
        {isDone ? <Check size={13} style={{ color: accent }} /> : <KindIcon size={13} />}
      </span>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider" style={{ color: sm.color, background: `color-mix(in srgb, ${sm.color} 12%, transparent)` }}>
              {sm.label}
            </span>
            {step.keystone && (
              <span className="inline-flex items-center gap-1 text-[0.6rem] font-medium text-surface-variant"><CircleDot size={10} aria-hidden /> jalon du parcours</span>
            )}
            {isReading && <span className="chip !py-0 text-[0.5625rem]">en cours</span>}
            {productionLabel && <span className="chip !py-0 text-[0.5625rem]">{productionLabel}</span>}
            {step.status === 'a-produire' && !r.exists && <span className="chip !py-0 text-[0.5625rem]">bientôt</span>}
          </div>
          <p className="mt-1 font-medium leading-snug text-foreground">{step.label}</p>
          {step.prereqNote && <p className="mt-0.5 text-xs italic text-surface-variant">Conseillé d’abord : {step.prereqNote}</p>}
        </div>
        {r.href && (
          <span className="mt-1 shrink-0 text-surface-variant transition-transform group-hover:translate-x-0.5">
            <ArrowRight size={16} />
          </span>
        )}
      </div>
    </>
  );

  const base = 'group relative block rounded-xl border px-4 py-3.5 transition-colors';
  if (r.href) {
    return (
      <li>
        <Link to={r.href} className={`${base} border-transparent hover:border-outline-variant hover:bg-surface-container-low`}>
          {inner}
        </Link>
      </li>
    );
  }
  return (
    <li>
      <div className={`${base} border-dashed border-outline-variant opacity-80`}>
        {inner}
      </div>
    </li>
  );
}
