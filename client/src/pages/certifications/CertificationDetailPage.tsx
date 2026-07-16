import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Award,
  BadgeCheck,
  BookOpen,
  Check,
  ChevronDown,
  CircleDashed,
  FileCheck2,
  GraduationCap,
  Landmark,
  LockKeyhole,
  Scale,
  ShieldCheck,
  SlidersHorizontal,
  Target,
  Users,
} from 'lucide-react';
import {
  certificationBySlug,
  createCertificationEnrollment,
  domainById,
  resolveCertificationCurriculum,
  resolveCertificationProgress,
  resolveFinalAssessment,
  upsertCertificationEnrollment,
  type Certification,
  type CertificationAxis,
  type CertificationEnrollment,
  type CertificationOption,
  type CertificationSelection,
  type ResolvedCourseRequirement,
} from '@/content/certifications';
import { courseById } from '@/content/courses';
import { lessonById } from '@/content/lessons';
import { ProgressBar } from '@/components/ui/primitives';
import { useUserData } from '@/context/UserDataContext';
import { usePageMeta } from '@/lib/seo';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { cn } from '@/lib/utils';
import NotFoundPage from '@/pages/system/NotFoundPage';

const AXIS_KEYS = ['fundStage', 'dealRole', 'specialty'] as const;
const AXIS_STEP_LABEL = {
  fundStage: 'Stade',
  dealRole: 'Rôle',
  specialty: 'Spécialité',
} as const;
const CERTIFICATION_STEPS = [
  { id: 'overview', label: 'Aperçu' },
  { id: 'options', label: 'Options' },
  { id: 'program', label: 'Programme' },
  { id: 'assessment', label: 'Évaluation' },
] as const;

const SOURCE_LABEL: Record<ResolvedCourseRequirement['source'], string> = {
  core: 'Tronc commun',
  fundStage: 'Stade',
  dealRole: 'Rôle',
  specialty: 'Spécialité',
};

type CertificationStepId = (typeof CERTIFICATION_STEPS)[number]['id'];
type EnrollmentMap = Record<string, CertificationEnrollment>;

export default function CertificationDetailPage() {
  const { slug } = useParams();
  const certification = slug ? certificationBySlug(slug) : undefined;
  const { progress } = useUserData();
  const stepPanelRef = useRef<HTMLElement>(null);
  const shouldFocusStepRef = useRef(false);

  const [activeStep, setActiveStep] = useState<CertificationStepId>('overview');
  const [activeAxisIndex, setActiveAxisIndex] = useState(0);
  const [enrollment, setEnrollment] = useState<CertificationEnrollment | null>(() => {
    if (!certification) return null;
    return storage.get<EnrollmentMap>(STORAGE_KEYS.certificationEnrollments, {})[certification.id] ?? null;
  });
  const [draft, setDraft] = useState<CertificationSelection>(() => enrollment?.selection ?? {});
  const [editing, setEditing] = useState(() => !enrollment);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  usePageMeta(certification?.shortTitle, certification?.summary);

  useEffect(() => {
    if (!shouldFocusStepRef.current) return;
    shouldFocusStepRef.current = false;
    const panel = stepPanelRef.current;
    if (!panel) return;
    panel.focus({ preventScroll: true });
    panel.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [activeStep]);

  if (!certification) return <NotFoundPage />;
  const activeCertification = certification;

  const activeSelection = editing ? draft : enrollment?.selection ?? {};
  const curriculum = resolveCertificationCurriculum(certification, activeSelection);
  const progressSnapshot = resolveCertificationProgress(certification, activeSelection, progress);
  const { requiredLessonIds, doneCount, availableCount, upcomingCount, percentage: progressPct } = progressSnapshot;
  const domain = domainById(certification.domainId);
  const firstAvailable = requiredLessonIds
    .map((lessonId) => lessonById(lessonId))
    .find((lesson) => lesson && lesson.status !== 'upcoming' && progress[lesson.id]?.status !== 'done');

  function openStep(step: CertificationStepId) {
    if (step === activeStep) return;
    shouldFocusStepRef.current = true;
    setActiveStep(step);
  }

  function updateSelection(axisId: keyof CertificationSelection, value: string | undefined) {
    setDraft((current) => ({ ...current, [axisId]: value || undefined } as CertificationSelection));
    setSaveMessage('');
    setSaveError('');
  }

  function saveEnrollment() {
    const now = new Date().toISOString();
    const next = createCertificationEnrollment(activeCertification.id, draft, enrollment, now);
    const all = storage.get<EnrollmentMap>(STORAGE_KEYS.certificationEnrollments, {});
    const result = storage.set(STORAGE_KEYS.certificationEnrollments, upsertCertificationEnrollment(all, next));
    if (!result.ok) {
      setSaveMessage('');
      setSaveError('Enregistrement impossible. Vérifiez le stockage du navigateur.');
      return;
    }
    setEnrollment(next);
    setEditing(false);
    setSaveError('');
    setSaveMessage('Parcours enregistré.');
    openStep('program');
  }

  function editEnrollment() {
    setDraft(enrollment?.selection ?? {});
    setActiveAxisIndex(0);
    setEditing(true);
    setSaveMessage('');
    setSaveError('');
  }

  return (
    <div className="overflow-hidden">
      <CertificationHero certification={certification} domainTitle={domain?.title} onConfigure={() => openStep('options')} />

      <main className="mx-auto max-w-[var(--content-max)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <CertificationStepNav activeStep={activeStep} onSelect={openStep} />

        {saveMessage && <p className="mt-5 text-sm text-success" role="status">{saveMessage}</p>}
        {saveError && <p className="mt-5 text-sm text-error" role="alert">{saveError}</p>}

        <section
          ref={stepPanelRef}
          id="certification-step-panel"
          tabIndex={-1}
          aria-labelledby="certification-step-title"
          className="scroll-mt-24 pt-10 outline-none sm:pt-12"
        >
          {activeStep === 'overview' && (
            <OverviewStep certification={certification} onNext={() => openStep('options')} />
          )}

          {activeStep === 'options' && (
            <OptionsStep
              certification={certification}
              curriculumCount={curriculum.length}
              lessonCount={requiredLessonIds.length}
              draft={draft}
              enrollment={enrollment}
              editing={editing}
              activeAxisIndex={activeAxisIndex}
              onAxisChange={setActiveAxisIndex}
              onSelectionChange={updateSelection}
              onEdit={editEnrollment}
              onSave={saveEnrollment}
              onPreviousStep={() => openStep('overview')}
              onNextStep={() => openStep('program')}
            />
          )}

          {activeStep === 'program' && (
            <ProgramStep
              certification={certification}
              curriculum={curriculum}
              enrollment={enrollment}
              requiredLessonCount={requiredLessonIds.length}
              doneCount={doneCount}
              availableCount={availableCount}
              upcomingCount={upcomingCount}
              progressPct={progressPct}
              firstAvailable={firstAvailable}
              progress={progress}
              onPrevious={() => openStep('options')}
              onNext={() => openStep('assessment')}
            />
          )}

          {activeStep === 'assessment' && (
            <AssessmentStep
              certification={certification}
              activeSelection={activeSelection}
              onPrevious={() => openStep('program')}
            />
          )}
        </section>
      </main>
    </div>
  );
}

function CertificationStepNav({
  activeStep,
  onSelect,
}: {
  activeStep: CertificationStepId;
  onSelect: (step: CertificationStepId) => void;
}) {
  const activeIndex = CERTIFICATION_STEPS.findIndex((step) => step.id === activeStep);
  return (
    <nav aria-label="Étapes de la certification">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-surface-variant" aria-live="polite">
          Étape {activeIndex + 1} sur {CERTIFICATION_STEPS.length}
        </p>
        <span className="text-xs text-surface-variant">Accès libre</span>
      </div>
      <div
        role="progressbar"
        aria-label="Progression dans la fiche"
        aria-valuemin={1}
        aria-valuemax={CERTIFICATION_STEPS.length}
        aria-valuenow={activeIndex + 1}
      >
        <ProgressBar value={((activeIndex + 1) / CERTIFICATION_STEPS.length) * 100} />
      </div>
      <ol className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
        {CERTIFICATION_STEPS.map((step, index) => {
          const active = step.id === activeStep;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onSelect(step.id)}
                aria-current={active ? 'step' : undefined}
                className={cn(
                  'flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-[border-color,background-color,color] duration-200',
                  active
                    ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_9%,transparent)] text-[color:var(--on-surface)]'
                    : 'border-outline-variant bg-surface-container-lowest text-surface-variant hover:border-[color-mix(in_srgb,var(--primary)_45%,transparent)] hover:text-[color:var(--on-surface)]',
                )}
              >
                <span className="font-mono text-[0.625rem] tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm font-medium">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function OverviewStep({ certification, onNext }: { certification: Certification; onNext: () => void }) {
  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <p className="eyebrow">Aperçu</p>
          <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold">Compétences</h2>
          <p className="mt-2 text-sm text-surface-variant">Ce que le titre atteste.</p>
          <ol className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {certification.competencies.map((competency, index) => (
              <li key={competency} className="flex items-start gap-3">
                <span className="mt-0.5 font-mono text-xs text-[color:var(--on-primary-container)]">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm leading-relaxed">{competency}</span>
              </li>
            ))}
          </ol>
        </div>

        <aside className="rounded-2xl border border-outline-variant bg-surface-container-low/35 p-6" aria-label="Délivrance">
          <p className="eyebrow flex items-center gap-2"><ShieldCheck aria-hidden="true" size={14} /> Délivrance</p>
          <p className="mt-4 font-headline text-headline-sm font-semibold">La progression seule ne certifie pas.</p>
          <dl className="mt-6 space-y-3 border-t border-outline-variant pt-5 text-sm">
            <div className="flex items-center justify-between gap-4"><dt className="text-surface-variant">Seuil</dt><dd className="font-semibold">{certification.finalAssessment.passingScore}/100</dd></div>
            <div className="flex items-center justify-between gap-4"><dt className="text-surface-variant">Décision</dt><dd className="font-semibold">Expert + jury</dd></div>
          </dl>
        </aside>
      </div>

      <StepControls nextLabel="Options" onNext={onNext} />
    </div>
  );
}

function OptionsStep({
  certification,
  curriculumCount,
  lessonCount,
  draft,
  enrollment,
  editing,
  activeAxisIndex,
  onAxisChange,
  onSelectionChange,
  onEdit,
  onSave,
  onPreviousStep,
  onNextStep,
}: {
  certification: Certification;
  curriculumCount: number;
  lessonCount: number;
  draft: CertificationSelection;
  enrollment: CertificationEnrollment | null;
  editing: boolean;
  activeAxisIndex: number;
  onAxisChange: (index: number) => void;
  onSelectionChange: (axisId: keyof CertificationSelection, value: string | undefined) => void;
  onEdit: () => void;
  onSave: () => void;
  onPreviousStep: () => void;
  onNextStep: () => void;
}) {
  if (!editing) {
    return (
      <div>
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Options</p>
            <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold">Parcours enregistré</h2>
          </div>
          <button type="button" onClick={onEdit} className="btn-ghost">Modifier</button>
        </div>
        <EnrollmentSummary certification={certification} selection={enrollment?.selection ?? {}} />
        <StepControls previousLabel="Aperçu" nextLabel="Programme" onPrevious={onPreviousStep} onNext={onNextStep} />
      </div>
    );
  }

  const axisId = AXIS_KEYS[activeAxisIndex];
  const axis = certification.axes[axisId] as CertificationAxis<string>;
  return (
    <div>
      <div>
        <p className="eyebrow">Options · facultatif</p>
        <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold">Configurer</h2>
        <p className="mt-2 text-sm text-surface-variant">Un choix par axe, ou tronc commun uniquement.</p>
      </div>

      {enrollment && (
        <div role="note" className="mt-6 flex items-start gap-3 rounded-xl border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-4 text-sm">
          <AlertTriangle aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[color:var(--primary)]" />
          <p>Programme recalculé. Vos acquis restent conservés.</p>
        </div>
      )}

      <nav className="mt-7" aria-label="Options de certification">
        <ol className="grid grid-cols-3 gap-2">
          {AXIS_KEYS.map((candidateId, index) => {
            const active = index === activeAxisIndex;
            return (
              <li key={candidateId}>
                <button
                  type="button"
                  onClick={() => onAxisChange(index)}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'w-full rounded-lg border px-2 py-2.5 text-center text-xs font-medium transition-[border-color,background-color,color] duration-200 sm:text-sm',
                    active
                      ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_9%,transparent)]'
                      : 'border-outline-variant text-surface-variant hover:text-[color:var(--on-surface)]',
                  )}
                >
                  {index + 1}. {AXIS_STEP_LABEL[candidateId]}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="mt-6">
        <AxisSelector
          axis={axis}
          index={activeAxisIndex + 1}
          selected={draft[axisId]}
          onChange={(value) => onSelectionChange(axisId, value)}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant pt-6">
        <div>
          <p className="font-headline text-lg font-semibold">{certification.shortTitle}</p>
          <p className="mt-1 text-xs text-surface-variant">{curriculumCount} cours · {lessonCount} leçons</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {activeAxisIndex > 0 && (
            <button type="button" onClick={() => onAxisChange(activeAxisIndex - 1)} className="btn-quiet">
              <ArrowLeft aria-hidden="true" size={14} /> Précédent
            </button>
          )}
          {activeAxisIndex < AXIS_KEYS.length - 1 ? (
            <button type="button" onClick={() => onAxisChange(activeAxisIndex + 1)} className="btn-ghost">
              Suivant <ArrowRight aria-hidden="true" size={14} />
            </button>
          ) : (
            <button type="button" onClick={onSave} className="btn-foil">
              Enregistrer <ArrowRight aria-hidden="true" size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ProgramStep({
  certification,
  curriculum,
  enrollment,
  requiredLessonCount,
  doneCount,
  availableCount,
  upcomingCount,
  progressPct,
  firstAvailable,
  progress,
  onPrevious,
  onNext,
}: {
  certification: Certification;
  curriculum: ResolvedCourseRequirement[];
  enrollment: CertificationEnrollment | null;
  requiredLessonCount: number;
  doneCount: number;
  availableCount: number;
  upcomingCount: number;
  progressPct: number;
  firstAvailable?: NonNullable<ReturnType<typeof lessonById>>;
  progress: Record<string, { status: 'reading' | 'done' }>;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr]">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <p className="eyebrow flex items-center gap-2"><BookOpen aria-hidden="true" size={14} /> Programme</p>
          <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold">{certification.shortTitle}</h2>

          <div className="mt-7 rounded-2xl border border-outline-variant bg-surface-container-low/30 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Progression</p>
                <p className="mt-1 text-xs text-surface-variant">{doneCount}/{requiredLessonCount} leçons</p>
              </div>
              <span className="font-mono text-xl text-[color:var(--on-primary-container)] tabular-nums">{progressPct}%</span>
            </div>
            <div
              className="mt-4"
              role="progressbar"
              aria-label="Progression de la certification"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progressPct}
            >
              <ProgressBar value={progressPct} />
            </div>
            <p className="mt-4 text-xs text-surface-variant">{availableCount} disponibles · {upcomingCount} à venir</p>
            {enrollment && firstAvailable && (
              <Link to={`/lessons/${firstAvailable.slug}`} className="btn-ghost mt-5 w-full justify-center">
                {doneCount > 0 ? 'Reprendre' : 'Commencer'} <ArrowRight aria-hidden="true" size={14} />
              </Link>
            )}
          </div>

          {!enrollment && (
            <p className="mt-4 rounded-xl border border-outline-variant bg-surface-container-low/25 p-4 text-xs text-surface-variant">
              Aperçu actif. Enregistrez les options pour démarrer.
            </p>
          )}
        </div>

        <div className="space-y-3">
          {curriculum.map((requirement, index) => (
            <RequirementCard key={`${requirement.source}-${requirement.id}`} requirement={requirement} index={index + 1} progress={progress} />
          ))}
        </div>
      </div>

      <StepControls previousLabel="Options" nextLabel="Évaluation" onPrevious={onPrevious} onNext={onNext} />
    </div>
  );
}

function AssessmentStep({
  certification,
  activeSelection,
  onPrevious,
}: {
  certification: Certification;
  activeSelection: CertificationSelection;
  onPrevious: () => void;
}) {
  const assessment = resolveFinalAssessment(certification, activeSelection);
  const choices = selectedChoices(certification, activeSelection);
  return (
    <div>
      <div className="max-w-3xl">
        <p className="eyebrow flex items-center gap-2"><GraduationCap aria-hidden="true" size={14} /> Évaluation</p>
        <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold">Cas d’investissement et soutenance</h2>
        <p className="mt-3 text-sm leading-relaxed text-surface-variant">Produisez un dossier, puis défendez votre recommandation. Le cas suit vos options.</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="chip"><Scale aria-hidden="true" size={12} /> {assessment.passingScore}/100</span>
          <span className="chip"><LockKeyhole aria-hidden="true" size={12} /> Critères critiques</span>
          {choices.map((choice) => <span key={choice.axis} className="chip">{choice.label}</span>)}
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <AssessmentDisclosure icon={<FileCheck2 aria-hidden="true" size={15} />} title={`Livrables · ${assessment.deliverables.length}`}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {assessment.deliverables.map((deliverable) => (
              <li key={deliverable} className="flex items-start gap-2.5 text-sm">
                <Check aria-hidden="true" size={14} className="mt-0.5 shrink-0 text-[color:var(--primary)]" /> {deliverable}
              </li>
            ))}
          </ul>
        </AssessmentDisclosure>

        <AssessmentDisclosure icon={<ShieldCheck aria-hidden="true" size={15} />} title={`Conditions · ${certification.eligibilityConditions.length}`}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {certification.eligibilityConditions.map((condition) => (
              <li key={condition} className="flex items-start gap-2.5 text-sm">
                <Check aria-hidden="true" size={14} className="mt-0.5 shrink-0 text-[color:var(--primary)]" /> {condition}
              </li>
            ))}
          </ul>
        </AssessmentDisclosure>

        <AssessmentDisclosure icon={<Scale aria-hidden="true" size={15} />} title={`Grille · ${assessment.rubricCriteria.length}`}>
          <div className="divide-y divide-outline-variant">
            {assessment.rubricCriteria.map((criterion) => (
              <div key={criterion.id} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div>
                  <p className="text-sm font-medium">{criterion.label}{criterion.critical ? ' · critique' : ''}</p>
                  <p className="mt-1 text-xs leading-relaxed text-surface-variant">{criterion.description}</p>
                </div>
                <span className="font-mono text-sm text-[color:var(--on-primary-container)] tabular-nums">{criterion.maxScore} pts</span>
              </div>
            ))}
          </div>

          {assessment.optionVariants.length > 0 && (
            <div className="mt-6 border-t border-outline-variant pt-5">
              <p className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">Options prises en compte</p>
              <ul className="mt-4 space-y-4">
                {assessment.optionVariants.map((variant) => (
                  <li key={variant.id}>
                    <p className="text-sm">{variant.caseAdaptation}</p>
                    <p className="mt-1 text-xs text-surface-variant">{variant.rubricCriteria.join(' · ')}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AssessmentDisclosure>

        <AssessmentDisclosure
          icon={<AlertTriangle aria-hidden="true" size={15} />}
          title={`Éliminatoires · ${certification.criticalErrors.length}`}
          tone="error"
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {certification.criticalErrors.map((error) => (
              <li key={error} className="flex items-start gap-2.5 text-sm"><span className="text-error">×</span>{error}</li>
            ))}
          </ul>
        </AssessmentDisclosure>
      </div>

      <div className="mt-7 flex items-start gap-4 rounded-xl border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-5">
        <BadgeCheck aria-hidden="true" size={22} className="shrink-0 text-[color:var(--primary)]" />
        <div>
          <p className="font-medium">La progression seule ne certifie pas.</p>
          <p className="mt-1 text-sm text-surface-variant">Évaluation, identité vérifiée et décision experte restent requises.</p>
        </div>
      </div>

      <StepControls previousLabel="Programme" onPrevious={onPrevious} />
    </div>
  );
}

function CertificationHero({
  certification,
  domainTitle,
  onConfigure,
}: {
  certification: Certification;
  domainTitle?: string;
  onConfigure: () => void;
}) {
  return (
    <section className="relative isolate border-b border-outline-variant bg-surface-container-low/25">
      <div className="mx-auto max-w-[var(--content-max)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link to="/certifications" className="btn-quiet mb-7 -ml-3"><ArrowLeft aria-hidden="true" size={15} /> Certifications</Link>
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-surface-variant"><Landmark aria-hidden="true" size={14} /> {domainTitle}</span>
            <span className="chip">Certification pro</span>
            <span className="chip !border-[color-mix(in_srgb,var(--primary)_40%,transparent)] !text-[color:var(--on-primary-container)]">En construction</span>
          </div>
          <h1 className="mt-5 font-headline text-display-md font-semibold leading-[1.02] tracking-tight text-balance">{certification.shortTitle}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-surface-variant text-pretty">{certification.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-surface-variant">
            <span className="inline-flex items-center gap-1.5"><Users aria-hidden="true" size={15} /> {certification.targetRoles[0]}</span>
            <span className="inline-flex items-center gap-1.5"><Target aria-hidden="true" size={15} /> {certification.coreRequirements.length} cours</span>
            <span className="inline-flex items-center gap-1.5"><Award aria-hidden="true" size={15} /> Validation experte</span>
          </div>
          <button type="button" onClick={onConfigure} className="btn-foil mt-7">
            Configurer <SlidersHorizontal aria-hidden="true" size={15} />
          </button>
        </div>
      </div>
    </section>
  );
}

function AxisSelector({
  axis,
  index,
  selected,
  onChange,
}: {
  axis: CertificationAxis<string>;
  index: number;
  selected?: string;
  onChange: (value: string | undefined) => void;
}) {
  const options: Array<CertificationOption<string> | null> = [null, ...axis.options];
  return (
    <fieldset className="rounded-2xl border border-outline-variant bg-surface-container-low/20 p-5 sm:p-7">
      <legend className="sr-only">{axis.label}</legend>
      <div className="flex items-start gap-4">
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[color-mix(in_srgb,var(--primary)_45%,transparent)] font-mono text-xs text-[color:var(--on-primary-container)]">{index}</span>
        <div>
          <h3 className="font-headline text-headline-sm font-semibold">{axis.label}</h3>
          <p className="mt-1 text-sm text-surface-variant">{axis.description}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {options.map((option) => {
          const value = option?.id;
          const checked = selected === value || (!selected && !value);
          return (
            <label key={value ?? 'none'} className="block cursor-pointer">
              <input
                type="radio"
                className="peer sr-only"
                name={`certification-${axis.id}`}
                value={value ?? ''}
                checked={checked}
                onChange={() => onChange(value)}
              />
              <span
                className={cn(
                  'block min-h-[5.25rem] rounded-xl border p-4 text-left transition-[border-color,background-color] duration-200 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--primary)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[color:var(--surface)]',
                  checked
                    ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_9%,transparent)] shadow-editorial-sm'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)]',
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-medium">{option?.label ?? 'Aucune option'}</span>
                  {checked && <Check aria-hidden="true" size={15} className="text-[color:var(--primary)]" />}
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-surface-variant">{option?.description ?? 'Tronc commun uniquement.'}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function EnrollmentSummary({ certification, selection }: { certification: Certification; selection: CertificationSelection }) {
  const choices = selectedChoices(certification, selection);
  return (
    <div className="mt-7 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_40%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <BadgeCheck aria-hidden="true" size={26} className="shrink-0 text-[color:var(--primary)]" />
        <div>
          <p className="font-headline text-headline-sm font-semibold">{certification.shortTitle}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {choices.length ? choices.map((choice) => <span key={choice.axis} className="chip">{choice.label}</span>) : <span className="text-sm text-surface-variant">Tronc commun uniquement.</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function RequirementCard({
  requirement,
  index,
  progress,
}: {
  requirement: ResolvedCourseRequirement;
  index: number;
  progress: Record<string, { status: 'reading' | 'done' }>;
}) {
  const lessons = requirement.lessonIds.map((lessonId) => lessonById(lessonId)).filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));
  const done = lessons.filter((lesson) => progress[lesson.id]?.status === 'done').length;
  const upcoming = lessons.filter((lesson) => lesson.status === 'upcoming').length;
  const course = courseById(requirement.courseId);
  return (
    <details className="group rounded-2xl border border-outline-variant bg-surface-container-lowest open:border-[color-mix(in_srgb,var(--primary)_38%,transparent)]">
      <summary className="flex cursor-pointer list-none items-start gap-4 p-5 marker:hidden sm:p-6 [&::-webkit-details-marker]:hidden">
        <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-outline-variant font-mono text-xs text-surface-variant">{String(index).padStart(2, '0')}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2 font-mono text-[0.58rem] uppercase tracking-wider text-surface-variant">
            {SOURCE_LABEL[requirement.source]}
            {upcoming > 0 && <span className="chip !py-0 text-[0.55rem]">{upcoming} à venir</span>}
          </span>
          <span className="mt-1.5 block font-headline text-headline-sm font-semibold leading-snug">{requirement.title}</span>
          <span className="mt-2 block text-xs text-surface-variant">{done}/{lessons.length} validées · Évaluation requise</span>
        </span>
        <ChevronDown aria-hidden="true" size={18} className="mt-2 shrink-0 text-surface-variant transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-outline-variant px-5 py-4 sm:px-6 sm:py-5">
        <p className="mb-4 text-sm leading-relaxed text-surface-variant">{requirement.summary}</p>
        <ol className="space-y-2">
          {lessons.map((lesson) => {
            const isUpcoming = lesson.status === 'upcoming';
            const inner = (
              <>
                <span className={cn('mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border', progress[lesson.id]?.status === 'done' ? 'border-success text-success' : 'border-outline-variant text-surface-variant')}>
                  {progress[lesson.id]?.status === 'done' ? <Check aria-hidden="true" size={12} /> : isUpcoming ? <CircleDashed aria-hidden="true" size={12} /> : <BookOpen aria-hidden="true" size={12} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-sm font-medium">{lesson.title}{isUpcoming ? ' (à venir)' : ''}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-surface-variant">{lesson.summary}</span>
                </span>
                {!isUpcoming && <span className="shrink-0 font-mono text-[0.58rem] text-surface-variant">{lesson.readMin} min</span>}
              </>
            );
            return (
              <li key={lesson.id}>
                {isUpcoming ? (
                  <div className="flex items-start gap-3 rounded-xl px-3 py-3 opacity-65">{inner}</div>
                ) : (
                  <Link to={`/lessons/${lesson.slug}`} className="flex items-start gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-surface-container-low">{inner}</Link>
                )}
              </li>
            );
          })}
        </ol>
        {course && <Link to={`/courses/${course.slug}`} className="btn-quiet mt-3">Voir le cours <ArrowRight aria-hidden="true" size={13} /></Link>}
      </div>
    </details>
  );
}

function AssessmentDisclosure({
  icon,
  title,
  tone = 'default',
  children,
}: {
  icon: React.ReactNode;
  title: string;
  tone?: 'default' | 'error';
  children: React.ReactNode;
}) {
  return (
    <details
      className={cn(
        'group rounded-2xl border bg-surface-container-lowest',
        tone === 'error' ? 'border-[color-mix(in_srgb,var(--error)_32%,transparent)]' : 'border-outline-variant',
      )}
    >
      <summary className="flex cursor-pointer list-none items-center gap-3 p-5 marker:hidden sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className={tone === 'error' ? 'text-error' : 'text-[color:var(--primary)]'}>{icon}</span>
        <span className="flex-1 text-sm font-medium">{title}</span>
        <ChevronDown aria-hidden="true" size={18} className="text-surface-variant transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t border-outline-variant px-5 py-5 sm:px-6">{children}</div>
    </details>
  );
}

function StepControls({
  previousLabel,
  nextLabel,
  onPrevious,
  onNext,
}: {
  previousLabel?: string;
  nextLabel?: string;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  return (
    <div className={cn('mt-10 flex flex-wrap items-center gap-3 border-t border-outline-variant pt-6', onPrevious ? 'justify-between' : 'justify-end')}>
      {onPrevious && previousLabel && (
        <button type="button" onClick={onPrevious} className="btn-quiet">
          <ArrowLeft aria-hidden="true" size={14} /> {previousLabel}
        </button>
      )}
      {onNext && nextLabel && (
        <button type="button" onClick={onNext} className="btn-ghost">
          {nextLabel} <ArrowRight aria-hidden="true" size={14} />
        </button>
      )}
    </div>
  );
}

function selectedChoices(certification: Certification, selection: CertificationSelection) {
  return AXIS_KEYS.flatMap((axisId) => {
    const selected = selection[axisId];
    if (!selected) return [];
    const option = certification.axes[axisId].options.find((candidate) => candidate.id === selected);
    return option ? [{ axis: certification.axes[axisId].label, label: option.label }] : [];
  });
}
