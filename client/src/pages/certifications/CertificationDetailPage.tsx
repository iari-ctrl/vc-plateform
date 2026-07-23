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

import { ProgressBar } from '@/components/ui/primitives';
import { assessmentForCertification } from '@/content/certificationAssessments';
import {
  certificationById,
  certificationBySlug,
  createCertificationEnrollment,
  domainById,
  resolveCertificationCurriculum,
  resolveCertificationSupplement,
  resolveFinalAssessment,
  upsertCertificationEnrollment,
} from '@/content/certifications';
import type {
  Certification,
  CertificationAxis,
  CertificationEnrollment,
  CertificationOption,
  CertificationSelection,
  CertificationSupplement,
  CourseRequirement,
  KnowledgeCertification,
  ProfessionalCertification,
} from '@/content/certificationTypes';
import { courseById } from '@/content/courses';
import { deliverableById } from '@/content/deliverables';
import { lessonById } from '@/content/lessons';
import { useUserData } from '@/context/UserDataContext';
import { useResourcePageMeta } from '@/lib/seo';
import { commitOnStorageSuccess, storage } from '@/lib/storage';
import { STORAGE_CONTRACTS } from '@/lib/storageDomains';
import { cn } from '@/lib/utils';
import NotFoundPage from '@/pages/system/NotFoundPage';

const AXIS_KEYS = ['fundStage', 'dealRole', 'specialty'] as const;
const AXIS_STEP_LABEL = {
  fundStage: 'Stade',
  dealRole: 'Rôle',
  specialty: 'Spécialité',
} as const;

const KNOWLEDGE_STEPS = [
  { id: 'overview', label: 'Aperçu' },
  { id: 'program', label: 'Programme' },
  { id: 'assessment', label: 'Évaluation' },
] as const;

const PROFESSIONAL_STEPS = [
  { id: 'overview', label: 'Aperçu' },
  { id: 'preparation', label: 'Préparation' },
  { id: 'options', label: 'Options' },
  { id: 'program', label: 'Programme' },
  { id: 'assessment', label: 'Évaluation' },
] as const;

type KnowledgeStepId = (typeof KNOWLEDGE_STEPS)[number]['id'];
type ProfessionalStepId = (typeof PROFESSIONAL_STEPS)[number]['id'];
type LessonProgress = Record<string, { status: 'reading' | 'done' }>;

export default function CertificationDetailPage() {
  const { slug } = useParams();
  const certification = slug ? certificationBySlug(slug) : undefined;

  useResourcePageMeta(Boolean(certification), certification?.shortTitle, certification?.summary);

  if (!certification) return <NotFoundPage />;
  return certification.certificateType === 'knowledge'
    ? <KnowledgeCertificationPage key={certification.id} certification={certification} />
    : <ProfessionalCertificationPage key={certification.id} certification={certification} />;
}

function KnowledgeCertificationPage({ certification }: { certification: KnowledgeCertification }) {
  const { progress } = useUserData();
  const [activeStep, setActiveStep] = useState<KnowledgeStepId>('overview');
  const { panelRef, openStep } = useStepNavigation(activeStep, setActiveStep);
  const domain = domainById(certification.domainId);
  const snapshot = progressForRequirements(certification.coreRequirements, progress);
  const assessment = assessmentForCertification(certification.id);

  return (
    <div className="overflow-hidden">
      <CertificationHero
        certification={certification}
        domainTitle={domain?.title}
        categoryLabel="Certificat de connaissances"
        statusLabel="Évaluation locale disponible"
        facts={[
          `${certification.coreRequirements.length} blocs`,
          `${snapshot.lessonIds.length} leçons`,
          'Résultat enregistré sur cet appareil',
        ]}
        actionLabel="Voir le programme"
        actionIcon={<BookOpen aria-hidden="true" size={15} />}
        onAction={() => openStep('program')}
      />

      <div className="mx-auto max-w-[var(--content-max)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <CertificationStepNav steps={KNOWLEDGE_STEPS} activeStep={activeStep} onSelect={openStep} />

        <section
          ref={panelRef}
          id="certification-step-panel"
          tabIndex={-1}
          aria-labelledby="certification-step-title"
          className="scroll-mt-24 pt-10 sm:pt-12"
        >
          {activeStep === 'overview' && (
            <KnowledgeOverviewStep certification={certification} onNext={() => openStep('program')} />
          )}
          {activeStep === 'program' && (
            <KnowledgeProgramStep
              certification={certification}
              progress={progress}
              snapshot={snapshot}
              onPrevious={() => openStep('overview')}
              onNext={() => openStep('assessment')}
            />
          )}
          {activeStep === 'assessment' && (
            <KnowledgeAssessmentStep
              certification={certification}
              assessment={assessment}
              onPrevious={() => openStep('program')}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function ProfessionalCertificationPage({ certification }: { certification: ProfessionalCertification }) {
  const { progress } = useUserData();
  const [activeStep, setActiveStep] = useState<ProfessionalStepId>('overview');
  const [activeAxisIndex, setActiveAxisIndex] = useState(0);
  const [enrollment, setEnrollment] = useState<CertificationEnrollment | null>(() => (
    storage.getParsed(STORAGE_CONTRACTS.certificationEnrollments)[certification.id] ?? null
  ));
  const [draft, setDraft] = useState<CertificationSelection>(() => enrollment?.selection ?? {});
  const [editing, setEditing] = useState(() => !enrollment);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const { panelRef, openStep } = useStepNavigation(activeStep, setActiveStep);

  useEffect(() => {
    storage.migrate(STORAGE_CONTRACTS.certificationEnrollments);
  }, []);

  const domain = domainById(certification.domainId);
  const prerequisite = certification.prerequisiteCertificationId
    ? certificationById(certification.prerequisiteCertificationId)
    : undefined;
  const configuredSelection = enrollment?.selection ?? {};
  const optionSelection = editing ? draft : configuredSelection;
  const optionSupplement = resolveCertificationSupplement(certification, optionSelection);
  const configuredSupplement = resolveCertificationSupplement(certification, configuredSelection);
  const preparation = progressForRequirements(certification.recommendedPreparation, progress);
  const curriculum = resolveCertificationCurriculum(certification, configuredSelection);
  const curriculumProgress = progressForRequirements(curriculum, progress);

  function updateSelection(axisId: keyof CertificationSelection, value: string | undefined) {
    setDraft((current) => ({ ...current, [axisId]: value || undefined } as CertificationSelection));
    setSaveMessage('');
    setSaveError('');
  }

  function saveEnrollment() {
    const now = new Date().toISOString();
    const next = createCertificationEnrollment(certification.id, draft, enrollment, now);
    const all = storage.getParsed(STORAGE_CONTRACTS.certificationEnrollments);
    const result = storage.setParsed(
      STORAGE_CONTRACTS.certificationEnrollments,
      upsertCertificationEnrollment(all, next),
    );
    commitOnStorageSuccess(result, next, setEnrollment);
    if (!result.ok) {
      setSaveMessage('');
      setSaveError('Enregistrement impossible. Vérifiez le stockage du navigateur.');
      return;
    }
    setEditing(false);
    setSaveError('');
    setSaveMessage('Configuration enregistrée.');
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
      <CertificationHero
        certification={certification}
        domainTitle={domain?.title}
        categoryLabel="Certification professionnelle"
        statusLabel="En construction"
        facts={[
          `${certification.recommendedPreparation.length} blocs recommandés`,
          `${preparation.lessonIds.length} leçons`,
          'Validation experte prévue',
        ]}
        actionLabel="Configurer les options"
        actionIcon={<SlidersHorizontal aria-hidden="true" size={15} />}
        onAction={() => openStep('options')}
      />

      <div className="mx-auto max-w-[var(--content-max)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <CertificationStepNav steps={PROFESSIONAL_STEPS} activeStep={activeStep} onSelect={openStep} />

        {saveMessage && <p className="mt-5 text-sm text-success" role="status">{saveMessage}</p>}
        {saveError && <p className="mt-5 text-sm text-error" role="alert">{saveError}</p>}

        <section
          ref={panelRef}
          id="certification-step-panel"
          tabIndex={-1}
          aria-labelledby="certification-step-title"
          className="scroll-mt-24 pt-10 sm:pt-12"
        >
          {activeStep === 'overview' && (
            <ProfessionalOverviewStep
              certification={certification}
              prerequisite={prerequisite}
              onNext={() => openStep('preparation')}
            />
          )}
          {activeStep === 'preparation' && (
            <ProfessionalPreparationStep
              certification={certification}
              progress={progress}
              snapshot={preparation}
              onPrevious={() => openStep('overview')}
              onNext={() => openStep('options')}
            />
          )}
          {activeStep === 'options' && (
            <OptionsStep
              certification={certification}
              draft={draft}
              enrollment={enrollment}
              editing={editing}
              supplement={optionSupplement}
              activeAxisIndex={activeAxisIndex}
              onAxisChange={setActiveAxisIndex}
              onSelectionChange={updateSelection}
              onEdit={editEnrollment}
              onSave={saveEnrollment}
              onPreviousStep={() => openStep('preparation')}
              onNextStep={() => openStep('program')}
            />
          )}
          {activeStep === 'program' && (
            <ProfessionalProgramStep
              certification={certification}
              requirements={curriculum}
              progress={progress}
              snapshot={curriculumProgress}
              onPrevious={() => openStep('options')}
              onNext={() => openStep('assessment')}
            />
          )}
          {activeStep === 'assessment' && (
            <ProfessionalAssessmentStep
              certification={certification}
              activeSelection={configuredSelection}
              supplement={configuredSupplement}
              onPrevious={() => openStep('program')}
            />
          )}
        </section>
      </div>
    </div>
  );
}

function useStepNavigation<StepId extends string>(
  activeStep: StepId,
  setActiveStep: (step: StepId) => void,
) {
  const panelRef = useRef<HTMLElement>(null);
  const shouldFocusRef = useRef(false);

  useEffect(() => {
    if (!shouldFocusRef.current) return;
    shouldFocusRef.current = false;
    const panel = panelRef.current;
    if (!panel) return;
    panel.focus({ preventScroll: true });
    panel.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }, [activeStep]);

  function openStep(step: StepId) {
    if (step === activeStep) return;
    shouldFocusRef.current = true;
    setActiveStep(step);
  }

  return { panelRef, openStep };
}

function CertificationStepNav<StepId extends string>({
  steps,
  activeStep,
  onSelect,
}: {
  steps: readonly { id: StepId; label: string }[];
  activeStep: StepId;
  onSelect: (step: StepId) => void;
}) {
  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  return (
    <nav aria-label="Étapes de la certification">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="font-mono text-xs text-surface-variant tabular-nums" aria-live="polite">
          Étape {activeIndex + 1} sur {steps.length}
        </p>
        <span className="text-xs text-surface-variant">Consultation libre</span>
      </div>
      <div
        role="progressbar"
        aria-label="Progression dans la fiche"
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-valuenow={activeIndex + 1}
      >
        <ProgressBar value={((activeIndex + 1) / steps.length) * 100} />
      </div>
      <ol className={cn(
        'mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2',
        steps.length === 3 ? 'md:grid-cols-3' : steps.length === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4',
      )}>
        {steps.map((step, index) => {
          const active = step.id === activeStep;
          return (
            <li key={step.id}>
              <button
                type="button"
                onClick={() => onSelect(step.id)}
                aria-current={active ? 'step' : undefined}
                aria-controls="certification-step-panel"
                className={cn(
                  'flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors duration-200',
                  active
                    ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_9%,transparent)] text-[color:var(--on-surface)]'
                    : 'border-outline-variant bg-surface-container-lowest text-surface-variant hover:border-[color-mix(in_srgb,var(--primary)_45%,transparent)] hover:text-[color:var(--on-surface)]',
                )}
              >
                <span className="font-mono text-xs tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-sm font-medium">{step.label}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function KnowledgeOverviewStep({
  certification,
  onNext,
}: {
  certification: KnowledgeCertification;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <CompetencyList competencies={certification.competencies} />
        <aside className="rounded-2xl border border-outline-variant bg-surface-container-low/35 p-6" aria-label="Portée du résultat local">
          <p className="eyebrow flex items-center gap-2">
            <ShieldCheck aria-hidden="true" size={14} /> Résultat local
          </p>
          <p className="mt-4 text-sm leading-relaxed text-surface-variant text-pretty">
            La réussite est enregistrée sur cet appareil. Elle atteste le résultat obtenu à l’évaluation de connaissances de ce programme, sans délivrer une certification professionnelle.
          </p>
          <dl className="mt-6 space-y-3 border-t border-outline-variant pt-5 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-surface-variant">Tentatives</dt>
              <dd className="font-semibold">Illimitées</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-surface-variant">Stockage</dt>
              <dd className="font-semibold">Local</dd>
            </div>
          </dl>
        </aside>
      </div>
      <StepControls nextLabel="Programme" onNext={onNext} />
    </div>
  );
}

function ProfessionalOverviewStep({
  certification,
  prerequisite,
  onNext,
}: {
  certification: ProfessionalCertification;
  prerequisite?: Certification;
  onNext: () => void;
}) {
  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
        <CompetencyList competencies={certification.competencies} />
        <div className="space-y-4">
          {prerequisite && (
            <aside className="rounded-2xl border border-outline-variant bg-surface-container-low/35 p-6" aria-label="Prérequis de référence">
              <p className="eyebrow flex items-center gap-2">
                <BookOpen aria-hidden="true" size={14} /> Prérequis de référence
              </p>
              <p className="mt-4 font-headline text-headline-sm font-semibold text-balance">
                {prerequisite.shortTitle}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-surface-variant text-pretty">
                Ce prérequis situe le socle attendu. Il n’empêche jamais de consulter la préparation, les options ou le référentiel professionnel.
              </p>
              <Link to={`/certifications/${prerequisite.slug}`} className="btn-quiet mt-4 -ml-4">
                Consulter le prérequis <ArrowRight aria-hidden="true" size={14} />
              </Link>
            </aside>
          )}
          <aside className="rounded-2xl border border-outline-variant p-6" aria-label="Délivrance prévue">
            <p className="eyebrow flex items-center gap-2">
              <ShieldCheck aria-hidden="true" size={14} /> Délivrance prévue
            </p>
            <p className="mt-4 text-sm leading-relaxed text-surface-variant text-pretty">
              La délivrance dépendra de l’évaluation finale, de la vérification de l’identité et de la décision du jury.
            </p>
          </aside>
        </div>
      </div>
      <StepControls nextLabel="Préparation" onNext={onNext} />
    </div>
  );
}

function CompetencyList({ competencies }: { competencies: string[] }) {
  return (
    <div>
      <p className="eyebrow">Aperçu</p>
      <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold text-balance">Compétences</h2>
      <p className="mt-2 text-sm text-surface-variant text-pretty">Compétences visées par le référentiel.</p>
      <ol className="mt-7 grid gap-x-8 gap-y-4 sm:grid-cols-2">
        {competencies.map((competency, index) => (
          <li key={competency} className="flex items-start gap-3">
            <span className="mt-0.5 font-mono text-xs text-[color:var(--on-primary-container)] tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="text-sm leading-relaxed text-pretty">{competency}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function KnowledgeProgramStep({
  certification,
  progress,
  snapshot,
  onPrevious,
  onNext,
}: {
  certification: KnowledgeCertification;
  progress: LessonProgress;
  snapshot: ProgressSnapshot;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <ProgramLayout
      eyebrow="Programme"
      title={certification.shortTitle}
      requirements={certification.coreRequirements}
      sourceLabel="Programme certifiant"
      progress={progress}
      snapshot={snapshot}
      note="La progression indique les leçons terminées. Elle ne déclenche pas automatiquement un résultat d’évaluation."
    >
      <StepControls previousLabel="Aperçu" nextLabel="Évaluation" onPrevious={onPrevious} onNext={onNext} />
    </ProgramLayout>
  );
}

function ProfessionalPreparationStep({
  certification,
  progress,
  snapshot,
  onPrevious,
  onNext,
}: {
  certification: ProfessionalCertification;
  progress: LessonProgress;
  snapshot: ProgressSnapshot;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <ProgramLayout
      eyebrow="Préparation recommandée"
      title="Trois blocs pour préparer les travaux Analyst"
      requirements={certification.recommendedPreparation}
      sourceLabel="Recommandé"
      progress={progress}
      snapshot={snapshot}
      note="Cette progression reste informative. Aucune de ces leçons ne bloque les options ni la consultation de l’évaluation professionnelle."
    >
      <StepControls previousLabel="Aperçu" nextLabel="Options" onPrevious={onPrevious} onNext={onNext} />
    </ProgramLayout>
  );
}

function ProfessionalProgramStep({
  certification,
  requirements,
  progress,
  snapshot,
  onPrevious,
  onNext,
}: {
  certification: ProfessionalCertification;
  requirements: ProgramRequirement[];
  progress: LessonProgress;
  snapshot: ProgressSnapshot;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const contextualRequirementCount = requirements.filter((requirement) => (
    requirement.source && requirement.source !== 'recommended'
  )).length;

  return (
    <ProgramLayout
      eyebrow="Programme contextualisé"
      title="Programme correspondant à votre configuration"
      requirements={requirements}
      sourceLabel={(requirement) => professionalRequirementSourceLabel(certification, requirement)}
      progress={progress}
      snapshot={snapshot}
      note={contextualRequirementCount > 0
        ? 'Ce programme réunit la préparation recommandée et les blocs liés aux options enregistrées. Les blocs signalés « à venir » restent informatifs et ne bloquent pas l’accès à l’évaluation.'
        : 'Ce programme reprend la préparation recommandée. Vous pouvez revenir aux options pour ajouter un contexte ; aucun bloc ne conditionne l’accès à l’évaluation.'}
    >
      <StepControls previousLabel="Options" nextLabel="Évaluation" onPrevious={onPrevious} onNext={onNext} />
    </ProgramLayout>
  );
}

type ProgramRequirement = CourseRequirement & {
  source?: 'core' | 'recommended' | keyof CertificationSelection;
};

function professionalRequirementSourceLabel(
  certification: ProfessionalCertification,
  requirement: ProgramRequirement,
) {
  if (!requirement.source || requirement.source === 'recommended') return 'Préparation recommandée';
  if (requirement.source === 'core') return 'Socle';
  return `Option · ${certification.axes[requirement.source].label}`;
}

function ProgramLayout({
  eyebrow,
  title,
  requirements,
  sourceLabel,
  progress,
  snapshot,
  note,
  children,
}: {
  eyebrow: string;
  title: string;
  requirements: ProgramRequirement[];
  sourceLabel: string | ((requirement: ProgramRequirement) => string);
  progress: LessonProgress;
  snapshot: ProgressSnapshot;
  note: string;
  children: React.ReactNode;
}) {
  const firstAvailable = snapshot.lessonIds
    .map((lessonId) => lessonById(lessonId))
    .find((lesson) => lesson?.status === 'published' && progress[lesson.id]?.status !== 'done');

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-[0.68fr_1.32fr]">
        <div className="lg:sticky lg:top-10 lg:self-start">
          <p className="eyebrow flex items-center gap-2"><BookOpen aria-hidden="true" size={14} /> {eyebrow}</p>
          <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold text-balance">{title}</h2>
          <div className="mt-7 rounded-2xl border border-outline-variant bg-surface-container-low/30 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium">Progression</p>
                <p className="mt-1 text-xs text-surface-variant tabular-nums">{snapshot.doneCount}/{snapshot.availableCount} leçons disponibles</p>
              </div>
              <span className="font-mono text-xl text-[color:var(--on-primary-container)] tabular-nums">{snapshot.percentage}%</span>
            </div>
            <div
              className="mt-4"
              role="progressbar"
              aria-label={`Progression dans ${eyebrow.toLowerCase()}`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={snapshot.percentage}
            >
              <ProgressBar value={snapshot.percentage} />
            </div>
            <p className="mt-4 text-xs text-surface-variant tabular-nums">
              {snapshot.availableCount} disponibles · {snapshot.upcomingCount} à venir
            </p>
            {firstAvailable && (
              <Link to={`/lessons/${firstAvailable.slug}`} className="btn-ghost mt-5 w-full justify-center">
                {snapshot.doneCount > 0 ? 'Reprendre' : 'Commencer'} <ArrowRight aria-hidden="true" size={14} />
              </Link>
            )}
          </div>
          <p className="mt-4 rounded-xl border border-outline-variant p-4 text-xs leading-relaxed text-surface-variant text-pretty">
            {note}
          </p>
        </div>

        <div className="space-y-3">
          {requirements.map((requirement, index) => (
            <RequirementCard
              key={requirement.id}
              requirement={requirement}
              index={index + 1}
              sourceLabel={typeof sourceLabel === 'function' ? sourceLabel(requirement) : sourceLabel}
              progress={progress}
            />
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}

function OptionsStep({
  certification,
  draft,
  enrollment,
  editing,
  supplement,
  activeAxisIndex,
  onAxisChange,
  onSelectionChange,
  onEdit,
  onSave,
  onPreviousStep,
  onNextStep,
}: {
  certification: ProfessionalCertification;
  draft: CertificationSelection;
  enrollment: CertificationEnrollment | null;
  editing: boolean;
  supplement: CertificationSupplement;
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
            <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold text-balance">Configuration enregistrée</h2>
          </div>
          <button type="button" onClick={onEdit} className="btn-ghost">Modifier</button>
        </div>
        <EnrollmentSummary certification={certification} supplement={supplement} />
        <StepControls previousLabel="Préparation" nextLabel="Programme" onPrevious={onPreviousStep} onNext={onNextStep} />
      </div>
    );
  }

  const axisId = AXIS_KEYS[activeAxisIndex];
  const axis = certification.axes[axisId] as CertificationAxis<string>;
  const selectedCount = supplementOptions(supplement).length;

  return (
    <div>
      <div>
        <p className="eyebrow">Options · facultatif</p>
        <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold text-balance">Configurer le contexte</h2>
        <p className="mt-2 text-sm text-surface-variant text-pretty">Un choix par axe, ou aucune option. Le titre VC Analyst reste invariant.</p>
      </div>

      {enrollment && (
        <div role="note" className="mt-6 flex items-start gap-3 rounded-xl border border-outline-variant p-4 text-sm">
          <AlertTriangle aria-hidden="true" size={17} className="mt-0.5 shrink-0 text-[color:var(--primary)]" />
          <p className="text-pretty">La configuration peut être modifiée. La progression pédagogique déjà enregistrée reste conservée.</p>
        </div>
      )}

      <nav className="mt-7" aria-label="Options de certification">
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {AXIS_KEYS.map((candidateId, index) => {
            const active = index === activeAxisIndex;
            return (
              <li key={candidateId}>
                <button
                  type="button"
                  onClick={() => onAxisChange(index)}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'w-full rounded-lg border px-3 py-3 text-center text-sm font-medium transition-colors duration-200',
                    active
                      ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_9%,transparent)]'
                      : 'border-outline-variant text-surface-variant hover:text-[color:var(--on-surface)]',
                  )}
                >
                  <span className="font-mono tabular-nums">{index + 1}.</span> {AXIS_STEP_LABEL[candidateId]}
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
          <p className="mt-1 text-xs text-surface-variant tabular-nums">{selectedCount} axe{selectedCount > 1 ? 's' : ''} renseigné{selectedCount > 1 ? 's' : ''}</p>
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

function KnowledgeAssessmentStep({
  certification,
  assessment,
  onPrevious,
}: {
  certification: KnowledgeCertification;
  assessment: ReturnType<typeof assessmentForCertification>;
  onPrevious: () => void;
}) {
  const capstone = certification.capstoneDeliverableId
    ? deliverableById(certification.capstoneDeliverableId)
    : undefined;

  if (!assessment) {
    return (
      <div>
        <h2 id="certification-step-title" className="font-headline text-headline-lg font-semibold text-balance">Évaluation indisponible</h2>
        <p className="mt-3 text-sm text-error" role="alert">Le référentiel d’évaluation associé n’a pas été trouvé.</p>
        <StepControls previousLabel="Programme" onPrevious={onPrevious} />
      </div>
    );
  }

  const assessmentPoints = assessment.exam.points
    + assessment.miniCases.reduce((sum, miniCase) => sum + miniCase.points, 0);

  return (
    <div>
      <div className="max-w-3xl">
        <p className="eyebrow flex items-center gap-2"><GraduationCap aria-hidden="true" size={14} /> Évaluation locale</p>
        <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold text-balance">{assessment.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-surface-variant text-pretty">{assessment.description}</p>
      </div>

      {capstone && (
        <section className="mt-8 rounded-2xl border border-outline-variant bg-surface-container-low/30 p-6" aria-labelledby="capstone-deliverable-title">
          <p className="eyebrow flex items-center gap-2">
            <FileCheck2 aria-hidden="true" size={14} /> Mise en situation autoévaluée · hors score
          </p>
          <h3 id="capstone-deliverable-title" className="mt-3 font-headline text-headline-sm font-semibold text-balance">
            {capstone.title}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-surface-variant text-pretty">{capstone.summary}</p>
          <p className="mt-3 text-xs leading-relaxed text-surface-variant text-pretty">
            Ce livrable permet d’appliquer les compétences du programme et d’examiner le travail à l’aide d’une grille. Il n’entre pas dans le calcul du résultat local.
          </p>
          <Link to={`/livrables/${capstone.slug}`} className="btn-quiet mt-4 -ml-4">
            Consulter la mise en situation <ArrowRight aria-hidden="true" size={14} />
          </Link>
        </section>
      )}

      <dl className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <AssessmentStat label="Examen" value={`${assessment.exam.questionCount} questions`} hint={`${assessment.exam.points} points`} />
        <AssessmentStat label="Mini-cas" value={`${assessment.miniCases.length} cas`} hint={`${assessment.miniCases.reduce((sum, miniCase) => sum + miniCase.points, 0)} points`} />
        <AssessmentStat label="Seuil total" value={`${assessment.passingRules.totalMin}/${assessmentPoints}`} hint="Sans compensation des blocs" />
        <AssessmentStat label="Tentatives" value="Illimitées" hint="Sans chronomètre" />
      </dl>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-outline-variant p-6" aria-labelledby="assessment-rules-title">
          <h3 id="assessment-rules-title" className="font-headline text-headline-sm font-semibold text-balance">Règles de réussite</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-3"><Check aria-hidden="true" size={14} className="mt-1 shrink-0 text-success" /> Au moins {assessment.passingRules.examMin}/{assessment.exam.points} à l’examen.</li>
            {assessment.miniCases.map((miniCase, index) => (
              <li key={miniCase.id} className="flex items-start gap-3">
                <Check aria-hidden="true" size={14} className="mt-1 shrink-0 text-success" />
                <span>Au moins {assessment.passingRules.caseMinEach}/{miniCase.points} au mini-cas {index + 1}.</span>
              </li>
            ))}
            <li className="flex items-start gap-3"><Check aria-hidden="true" size={14} className="mt-1 shrink-0 text-success" /> Au moins {assessment.passingRules.totalMin}/{assessmentPoints} au total.</li>
          </ul>
        </section>
        <section className="rounded-2xl border border-outline-variant p-6" aria-labelledby="assessment-resources-title">
          <h3 id="assessment-resources-title" className="font-headline text-headline-sm font-semibold text-balance">Ressources et charte</h3>
          <p className="mt-4 text-sm leading-relaxed text-surface-variant text-pretty">{assessment.resourcePolicy.exam}</p>
          <p className="mt-3 text-sm leading-relaxed text-surface-variant text-pretty">{assessment.resourcePolicy.miniCases}</p>
          <p className="mt-4 border-t border-outline-variant pt-4 text-xs text-surface-variant">
            Charte du candidat · version {certification.candidateCharterVersion}
          </p>
        </section>
      </div>

      <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_40%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-medium">La tentative reprend automatiquement après rechargement.</p>
          <p className="mt-1 text-sm text-surface-variant text-pretty">La charte, les consignes et la déclaration d’outils sont présentées avant le démarrage.</p>
        </div>
        <Link to={`/certifications/${certification.slug}/evaluation`} className="btn-foil shrink-0">
          Accéder à l’évaluation <ArrowRight aria-hidden="true" size={15} />
        </Link>
      </div>

      <StepControls previousLabel="Programme" onPrevious={onPrevious} />
    </div>
  );
}

function AssessmentStat({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-xl border border-outline-variant bg-surface-container-low/30 p-5">
      <dt className="text-xs font-medium text-surface-variant">{label}</dt>
      <dd className="mt-2 font-headline text-headline-sm font-semibold tabular-nums">{value}</dd>
      <dd className="mt-1 text-xs text-surface-variant tabular-nums">{hint}</dd>
    </div>
  );
}

function ProfessionalAssessmentStep({
  certification,
  activeSelection,
  supplement,
  onPrevious,
}: {
  certification: ProfessionalCertification;
  activeSelection: CertificationSelection;
  supplement: CertificationSupplement;
  onPrevious: () => void;
}) {
  const assessment = resolveFinalAssessment(certification, activeSelection);
  const choices = supplementOptions(supplement);

  return (
    <div>
      <div className="max-w-3xl">
        <p className="eyebrow flex items-center gap-2"><GraduationCap aria-hidden="true" size={14} /> Évaluation professionnelle</p>
        <h2 id="certification-step-title" className="mt-3 font-headline text-headline-lg font-semibold text-balance">{assessment.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-surface-variant text-pretty">
          L’évaluation prévue comprend un dossier d’investissement et une soutenance. Les options décrivent le contexte du cas sans modifier le titre VC Analyst.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="chip tabular-nums"><Scale aria-hidden="true" size={12} /> {assessment.passingScore}/100</span>
          <span className="chip"><LockKeyhole aria-hidden="true" size={12} /> Critères critiques prévus</span>
        </div>
        {choices.length > 0 && (
          <dl className="mt-6 rounded-2xl border border-outline-variant p-5">
            <dt className="text-xs font-medium text-surface-variant">Supplément contextualisé au titre</dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {choices.map((choice) => <span key={choice.axisId} className="chip">{choice.certificateLabel}</span>)}
            </dd>
          </dl>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <AssessmentDisclosure icon={<FileCheck2 aria-hidden="true" size={15} />} title={`Livrables prévus · ${assessment.deliverables.length}`}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {assessment.deliverables.map((deliverable) => (
              <li key={deliverable} className="flex items-start gap-2.5 text-sm text-pretty">
                <Check aria-hidden="true" size={14} className="mt-0.5 shrink-0 text-[color:var(--primary)]" /> {deliverable}
              </li>
            ))}
          </ul>
        </AssessmentDisclosure>

        <AssessmentDisclosure icon={<ShieldCheck aria-hidden="true" size={15} />} title={`Conditions prévues · ${certification.eligibilityConditions.length}`}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {certification.eligibilityConditions.map((condition) => (
              <li key={condition} className="flex items-start gap-2.5 text-sm text-pretty">
                <Check aria-hidden="true" size={14} className="mt-0.5 shrink-0 text-[color:var(--primary)]" /> {condition}
              </li>
            ))}
          </ul>
        </AssessmentDisclosure>

        <AssessmentDisclosure icon={<Scale aria-hidden="true" size={15} />} title={`Grille prévue · ${assessment.rubricCriteria.length}`}>
          <div className="divide-y divide-outline-variant">
            {assessment.rubricCriteria.map((criterion) => (
              <div key={criterion.id} className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:gap-6">
                <div>
                  <p className="text-sm font-medium">{criterion.label}{criterion.critical ? ' · critique' : ''}</p>
                  <p className="mt-1 text-xs leading-relaxed text-surface-variant text-pretty">{criterion.description}</p>
                </div>
                <span className="font-mono text-sm text-[color:var(--on-primary-container)] tabular-nums">{criterion.maxScore} pts</span>
              </div>
            ))}
          </div>

          {assessment.optionVariants.length > 0 && (
            <div className="mt-6 border-t border-outline-variant pt-5">
              <p className="text-xs font-medium text-surface-variant">Adaptations prévues selon les options</p>
              <ul className="mt-4 space-y-4">
                {assessment.optionVariants.map((variant) => (
                  <li key={variant.id}>
                    <p className="text-sm text-pretty">{variant.caseAdaptation}</p>
                    <p className="mt-1 text-xs text-surface-variant text-pretty">{variant.rubricCriteria.join(' · ')}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </AssessmentDisclosure>

        <AssessmentDisclosure
          icon={<AlertTriangle aria-hidden="true" size={15} />}
          title={`Critères éliminatoires prévus · ${certification.criticalErrors.length}`}
          tone="error"
        >
          <ul className="grid gap-3 sm:grid-cols-2">
            {certification.criticalErrors.map((error) => (
              <li key={error} className="flex items-start gap-2.5 text-sm text-pretty"><span className="text-error">×</span>{error}</li>
            ))}
          </ul>
        </AssessmentDisclosure>
      </div>

      <div className="mt-7 flex items-start gap-4 rounded-xl border border-outline-variant p-5">
        <BadgeCheck aria-hidden="true" size={22} className="shrink-0 text-[color:var(--primary)]" />
        <div>
          <p className="font-medium">Modalités en cours de construction</p>
          <p className="mt-1 text-sm text-surface-variant text-pretty">La grille affichée présente le cadre prévu avant l’ouverture de la certification professionnelle.</p>
        </div>
      </div>

      <StepControls previousLabel="Programme" onPrevious={onPrevious} />
    </div>
  );
}

function CertificationHero({
  certification,
  domainTitle,
  categoryLabel,
  statusLabel,
  facts,
  actionLabel,
  actionIcon,
  onAction,
}: {
  certification: Certification;
  domainTitle?: string;
  categoryLabel: string;
  statusLabel: string;
  facts: string[];
  actionLabel: string;
  actionIcon: React.ReactNode;
  onAction: () => void;
}) {
  return (
    <header className="border-b border-outline-variant bg-surface-container-low/25">
      <div className="mx-auto max-w-[var(--content-max)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link to="/certifications" className="btn-quiet mb-7 -ml-3"><ArrowLeft aria-hidden="true" size={15} /> Certifications</Link>
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-surface-variant"><Landmark aria-hidden="true" size={14} /> {domainTitle}</span>
            <span className="chip">{categoryLabel}</span>
            <span className="chip">{statusLabel}</span>
          </div>
          <h1 className="mt-5 font-headline text-display-md font-semibold leading-[1.02] tracking-tight text-balance">{certification.shortTitle}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-surface-variant text-pretty">{certification.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-surface-variant">
            <span className="inline-flex items-center gap-1.5"><Users aria-hidden="true" size={15} /> {certification.targetRoles[0]}</span>
            {facts.map((fact, index) => (
              <span key={fact} className="inline-flex items-center gap-1.5 tabular-nums">
                {index === 0 ? <Target aria-hidden="true" size={15} /> : index === 1 ? <BookOpen aria-hidden="true" size={15} /> : <Award aria-hidden="true" size={15} />}
                {fact}
              </span>
            ))}
          </div>
          <button type="button" onClick={onAction} className="btn-foil mt-7">
            {actionLabel} {actionIcon}
          </button>
        </div>
      </div>
    </header>
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
        <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[color-mix(in_srgb,var(--primary)_45%,transparent)] font-mono text-xs text-[color:var(--on-primary-container)] tabular-nums">{index}</span>
        <div>
          <h3 className="font-headline text-headline-sm font-semibold text-balance">{axis.label}</h3>
          <p className="mt-1 text-sm text-surface-variant text-pretty">{axis.description}</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
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
                  'block min-h-[5.25rem] rounded-xl border p-4 text-left transition-colors duration-200 peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-[color:var(--primary)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[color:var(--surface)]',
                  checked
                    ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_9%,transparent)]'
                    : 'border-outline-variant bg-surface-container-lowest hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)]',
                )}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="font-medium">{option?.label ?? 'Aucune option'}</span>
                  {checked && <Check aria-hidden="true" size={15} className="text-[color:var(--primary)]" />}
                </span>
                <span className="mt-2 block text-xs leading-relaxed text-surface-variant text-pretty">{option?.description ?? 'Aucun contexte supplémentaire.'}</span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function EnrollmentSummary({
  certification,
  supplement,
}: {
  certification: ProfessionalCertification;
  supplement: CertificationSupplement;
}) {
  const choices = supplementOptions(supplement);
  return (
    <div className="mt-7 rounded-2xl border border-outline-variant p-6 sm:p-7">
      <div className="flex items-start gap-4">
        <BadgeCheck aria-hidden="true" size={26} className="shrink-0 text-[color:var(--primary)]" />
        <div className="min-w-0">
          <p className="font-headline text-headline-sm font-semibold text-balance">{certification.shortTitle}</p>
          <dl className="mt-4">
            <dt className="text-xs font-medium text-surface-variant">Supplément contextualisé au titre</dt>
            <dd className="mt-3 flex flex-wrap gap-2">
              {choices.length
                ? choices.map((choice) => <span key={choice.axisId} className="chip">{choice.certificateLabel}</span>)
                : <span className="text-sm text-surface-variant">Aucun supplément sélectionné.</span>}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}

function RequirementCard({
  requirement,
  index,
  sourceLabel,
  progress,
}: {
  requirement: CourseRequirement;
  index: number;
  sourceLabel: string;
  progress: LessonProgress;
}) {
  const lessons = requirement.lessonIds
    .map((lessonId) => lessonById(lessonId))
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));
  const done = lessons.filter((lesson) => progress[lesson.id]?.status === 'done').length;
  const upcoming = lessons.filter((lesson) => lesson.status === 'upcoming').length;
  const course = courseById(requirement.courseId);

  return (
    <details className="group rounded-2xl border border-outline-variant bg-surface-container-lowest open:border-[color-mix(in_srgb,var(--primary)_38%,transparent)]">
      <summary className="flex cursor-pointer list-none items-start gap-4 p-5 marker:hidden sm:p-6 [&::-webkit-details-marker]:hidden">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full border border-outline-variant font-mono text-xs text-surface-variant tabular-nums">{String(index).padStart(2, '0')}</span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2 text-xs font-medium text-surface-variant">
            {sourceLabel}
            {upcoming > 0 && <span className="chip !py-0">{upcoming} à venir</span>}
          </span>
          <span className="mt-1.5 block font-headline text-headline-sm font-semibold leading-snug text-balance">{requirement.title}</span>
          <span className="mt-2 block text-xs text-surface-variant tabular-nums">{done}/{lessons.length} terminées</span>
        </span>
        <ChevronDown aria-hidden="true" size={18} className="mt-2 shrink-0 text-surface-variant transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="border-t border-outline-variant px-5 py-4 sm:px-6 sm:py-5">
        <p className="mb-4 text-sm leading-relaxed text-surface-variant text-pretty">{requirement.summary}</p>
        <ol className="space-y-2">
          {lessons.map((lesson) => {
            const isUpcoming = lesson.status === 'upcoming';
            const completed = progress[lesson.id]?.status === 'done';
            const inner = (
              <>
                <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border', completed ? 'border-success text-success' : 'border-outline-variant text-surface-variant')}>
                  {completed ? <Check aria-hidden="true" size={12} /> : isUpcoming ? <CircleDashed aria-hidden="true" size={12} /> : <BookOpen aria-hidden="true" size={12} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-pretty">{lesson.title}{isUpcoming ? ' (à venir)' : ''}</span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-surface-variant text-pretty">{lesson.summary}</span>
                </span>
                {!isUpcoming && <span className="shrink-0 font-mono text-xs text-surface-variant tabular-nums">{lesson.readMin} min</span>}
              </>
            );
            return (
              <li key={lesson.id}>
                {isUpcoming
                  ? <div className="flex items-start gap-3 rounded-xl px-3 py-3 opacity-65">{inner}</div>
                  : <Link to={`/lessons/${lesson.slug}`} className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-surface-container-low">{inner}</Link>}
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
    <details className={cn('group rounded-2xl border bg-surface-container-lowest', tone === 'error' ? 'border-[color-mix(in_srgb,var(--error)_32%,transparent)]' : 'border-outline-variant')}>
      <summary className="flex cursor-pointer list-none items-center gap-3 p-5 marker:hidden sm:px-6 [&::-webkit-details-marker]:hidden">
        <span className={tone === 'error' ? 'text-error' : 'text-[color:var(--primary)]'}>{icon}</span>
        <span className="flex-1 text-sm font-medium">{title}</span>
        <ChevronDown aria-hidden="true" size={18} className="text-surface-variant transition-transform duration-200 group-open:rotate-180" />
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

interface ProgressSnapshot {
  lessonIds: string[];
  doneCount: number;
  availableCount: number;
  upcomingCount: number;
  percentage: number;
}

function progressForRequirements(requirements: CourseRequirement[], progress: LessonProgress): ProgressSnapshot {
  const lessonIds = [...new Set(requirements.flatMap((requirement) => requirement.lessonIds))];
  const availableLessonIds = lessonIds.filter((lessonId) => {
    const lesson = lessonById(lessonId);
    return lesson?.status === 'published';
  });
  const doneCount = availableLessonIds.filter((lessonId) => progress[lessonId]?.status === 'done').length;
  const availableCount = availableLessonIds.length;
  const upcomingCount = lessonIds.filter((lessonId) => lessonById(lessonId)?.status === 'upcoming').length;
  return {
    lessonIds,
    doneCount,
    availableCount,
    upcomingCount,
    percentage: availableCount ? Math.round((doneCount / availableCount) * 100) : 0,
  };
}

function supplementOptions(supplement: CertificationSupplement) {
  return AXIS_KEYS.flatMap((axisId) => supplement[axisId] ? [supplement[axisId]] : []).filter(
    (option): option is NonNullable<(typeof supplement)[typeof AXIS_KEYS[number]]> => Boolean(option),
  );
}
