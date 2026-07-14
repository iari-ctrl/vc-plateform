import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { InlineMarkdown } from '@/lib/markdown';
import {
  ArrowLeft, ArrowRight, Check, Clock, Users, Target, Trophy, BookOpen,
  Briefcase, FlaskConical, BookA, Dumbbell, Heart, Lock,
  type LucideIcon,
} from 'lucide-react';
import {
  parcoursBySlug, resolveStep, lessonIdsForParcours, visibleSteps,
  FAMILY_META, type ParcoursStep, type StepType, type TimeBudget,
} from '@/content/parcours';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
import { ProgressBar, LevelBadge } from '@/components/ui/primitives';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useUserData } from '@/context/UserDataContext';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';

const STEP_META: Record<StepType, { label: string; icon: LucideIcon; color: string; hint: string }> = {
  coeur: { label: 'Cœur', icon: Target, color: 'var(--primary)', hint: 'La colonne vertébrale — l’indispensable.' },
  pratique: { label: 'Pratique', icon: Dumbbell, color: '#3E7C6A', hint: 'Fais quelque chose : un simulateur, un livrable.' },
  bonus: { label: 'Bonus', icon: BookOpen, color: '#8A5A8A', hint: 'L’approfondissement, si le temps suit.' },
  respiration: { label: 'Respiration', icon: Heart, color: '#C2603F', hint: 'Léger et fun : un cas, un mythe démonté.' },
};

const KIND_ICON: Record<string, LucideIcon> = {
  lesson: BookOpen, case: Briefcase, simulator: FlaskConical, glossary: BookA, milestone: Trophy,
};

const TIME_BUDGETS: { id: TimeBudget; label: string; sub: string }[] = [
  { id: 'low', label: 'L’essentiel', sub: 'Cœur seulement' },
  { id: 'medium', label: 'Standard', sub: 'Cœur + pratique' },
  { id: 'high', label: 'Immersion', sub: 'Tout débloqué' },
];

export default function ParcoursDetailPage() {
  const { slug } = useParams();
  const parcours = slug ? parcoursBySlug(slug) : undefined;
  const { progress, profile } = useUserData();
  const [budget, setBudget] = useState<TimeBudget>((profile?.timeBudget as TimeBudget) ?? 'high');

  usePageMeta(parcours?.title, parcours?.hook);

  const lessonIds = useMemo(() => (parcours ? lessonIdsForParcours(parcours) : []), [parcours]);
  const done = lessonIds.filter((id) => progress[id]?.status === 'done').length;
  const pct = lessonIds.length ? Math.round((done / lessonIds.length) * 100) : 0;

  if (!parcours) return <NotFoundPage />;

  const meta = FAMILY_META[parcours.family];
  const accent = parcours.accent ?? meta.accent;
  const steps = visibleSteps(parcours, budget);
  const allSteps = [...parcours.steps].sort((a, b) => a.order - b.order);
  const isResolvedDone = (r: ReturnType<typeof resolveStep>) => {
    const ids = r.lessonIds ?? (r.lessonId ? [r.lessonId] : []);
    return ids.length > 0 && ids.every((id) => progress[id]?.status === 'done');
  };

  // « Reprendre où j'en étais » — first reachable step that isn't done yet.
  const resume = allSteps
    .map((s) => ({ s, r: resolveStep(s) }))
    .find(({ r }) => r.href && !isResolvedDone(r));
  const resumeHref = resume?.r.href ?? allSteps.map((s) => resolveStep(s)).find((r) => r.href)?.href ?? null;

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
                <span className="inline-flex items-center gap-1.5"><Clock size={15} /> ≈ {parcours.time.coreHours} h{parcours.time.withBonusHours ? ` · ${parcours.time.withBonusHours} h en immersion` : ''}</span>
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
              {pct > 0 && (
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-medium">Ta progression</span>
                    <span className="text-surface-variant">{pct}%</span>
                  </div>
                  <ProgressBar value={pct} accent={accent} />
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
                <p className="eyebrow mb-3">Ce que tu sauras faire</p>
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
        {/* Time cursor */}
        <div className="mb-8 rounded-2xl border border-outline-variant bg-surface-container-low/40 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium">Curseur temps <span className="font-normal text-surface-variant">— combien tu déploies</span></p>
            <div className="flex gap-1.5" role="group" aria-label="Curseur temps">
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
              {hidden} étape{hidden > 1 ? 's' : ''} masquée{hidden > 1 ? 's' : ''} à ce rythme — passe en <em>Immersion</em> pour tout voir. Rien n’est verrouillé.
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
            <p className="eyebrow flex items-center gap-2"><Trophy size={14} style={{ color: accent }} /> Le jalon — ta récompense</p>
            <h3 className="mt-3 font-headline text-headline-md font-semibold">{parcours.milestone.label}</h3>
            <p className="mt-2 text-sm leading-relaxed text-surface-variant">{parcours.milestone.description}</p>
            {parcours.milestone.evaluation && parcours.milestone.evaluation.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {parcours.milestone.evaluation.includes('auto') && <span className="chip">Auto-évaluation (grille)</span>}
                {parcours.milestone.evaluation.includes('peer') && <span className="chip">Puis revue par les pairs</span>}
              </div>
            )}
          </div>
        )}

        <p className="mt-8 text-center text-xs text-surface-variant">
          Tout atome est autonome — on entre par n’importe où, on dévie quand on veut. Le parcours suggère, il n’enferme jamais.
        </p>
      </section>
    </div>
  );
}

function StepRow({ step, accent }: { step: ParcoursStep; accent: string }) {
  const { progress } = useUserData();
  const sm = STEP_META[step.type];
  const r = resolveStep(step);
  const KindIcon = KIND_ICON[step.ref.kind] ?? BookOpen;
  const trackedLessonIds = r.lessonIds ?? (r.lessonId ? [r.lessonId] : []);
  const isDone = trackedLessonIds.length > 0 && trackedLessonIds.every((id) => progress[id]?.status === 'done');
  const isReading = trackedLessonIds.some((id) => progress[id]?.status === 'reading');

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
              <span className="inline-flex items-center gap-1 text-[0.6rem] font-medium text-surface-variant"><Lock size={10} /> important pour la suite</span>
            )}
            {isReading && <span className="chip !py-0 text-[0.5625rem]">en cours</span>}
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
