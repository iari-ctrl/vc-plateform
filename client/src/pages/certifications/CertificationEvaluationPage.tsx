import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  History,
  RotateCcw,
  Save,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { certificationBySlug } from '@/content/certifications';
import {
  assessmentForCertification,
  resolveCertificationEvaluationState,
} from '@/content/certificationAssessments';
import { candidateCharterByIdVersion } from '@/content/candidateCharters';
import type {
  AssessmentMiniCase,
  AssessmentQuestion,
  CandidateCharter,
  CertificationAssessment,
  NumericAssessmentQuestion,
} from '@/content/certificationTypes';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ProgressBar } from '@/components/ui/primitives';
import {
  compatibleAssessmentRecord,
  compatibleActiveAttempt,
  createAssessmentAttempt,
  historicalAssessmentContexts,
  migrateCertificationAssessmentStore,
  persistAssessmentRecordReset,
  readCertificationAssessmentStore,
  setAssessmentAnswer,
  submitAssessmentAttempt,
  updateAssessmentAttempt,
  withActiveAssessmentAttempt,
  writeCertificationAssessmentStore,
  type CertificationAssessmentAttempt,
  type CertificationAssessmentRecord,
  type CertificationAssessmentStore,
  type HistoricalAssessmentContext,
  type SubmittedCertificationAssessment,
} from '@/lib/certificationAssessment';
import { commitOnStorageSuccess } from '@/lib/storage';
import { useResourcePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';

const fieldClass =
  'w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-foreground placeholder:text-surface-variant focus:border-[color:var(--primary)]';

type StartAttemptErrors = Partial<Record<'declaration' | 'charter' | 'confirmation', string>>;

function focusAfterRender(id: string) {
  requestAnimationFrame(() => {
    const target = document.getElementById(id);
    target?.focus();
    target?.scrollIntoView({ block: 'start' });
  });
}

export default function CertificationEvaluationPage() {
  const { slug } = useParams();
  const certification = slug ? certificationBySlug(slug) : undefined;
  const assessment = certification?.certificateType === 'knowledge'
    ? assessmentForCertification(certification.id)
    : undefined;
  const charter = certification?.certificateType === 'knowledge'
    ? candidateCharterByIdVersion(certification.candidateCharterId, certification.candidateCharterVersion)
    : undefined;
  const activeCharter = charter?.status === 'active' ? charter : undefined;
  const evaluationState = resolveCertificationEvaluationState(
    certification?.certificateType,
    assessment,
    Boolean(activeCharter),
  );

  useResourcePageMeta(
    Boolean(certification),
    evaluationState === 'available' ? assessment?.title : 'Évaluation indisponible',
    evaluationState === 'available'
      ? assessment?.description
      : 'Aucune évaluation locale publiée n’est disponible pour cette certification.',
    { noindex: true, canonical: false },
  );

  const [store, setStore] = useState<CertificationAssessmentStore>(() => readCertificationAssessmentStore());
  const [attempt, setAttempt] = useState<CertificationAssessmentAttempt | null>(() => (
    assessment && activeCharter ? compatibleActiveAttempt(store, assessment, activeCharter) : null
  ));
  const [charterAccepted, setCharterAccepted] = useState(false);
  const [toolDeclaration, setToolDeclaration] = useState('');
  const [toolDeclarationConfirmed, setToolDeclarationConfirmed] = useState(false);
  const [startAttemptErrors, setStartAttemptErrors] = useState<StartAttemptErrors>({});
  const [localError, setLocalError] = useState('');
  const [resetOpen, setResetOpen] = useState(false);

  useEffect(() => {
    migrateCertificationAssessmentStore();
  }, []);

  const examQuestionById = useMemo(
    () => new Map(assessment?.exam.questions.map((question) => [question.id, question]) ?? []),
    [assessment],
  );

  if (!certification) {
    return <NotFoundPage />;
  }

  if (evaluationState !== 'available' || !assessment || !activeCharter) {
    return (
      <EvaluationUnavailable
        certificationSlug={certification.slug}
        certificationTitle={certification.shortTitle}
        reason={evaluationState === 'unsupported-type' ? 'unsupported-type' : 'unavailable'}
      />
    );
  }

  const activeAssessment = assessment;
  const availableCharter = activeCharter;
  const record = compatibleAssessmentRecord(store, activeAssessment, availableCharter);
  const latestSubmission = record.history[0];
  const previousContexts = historicalAssessmentContexts(store, activeAssessment, availableCharter);

  function saveAttempt(nextAttempt: CertificationAssessmentAttempt): boolean {
    const nextStore = withActiveAssessmentAttempt(store, nextAttempt);
    const result = writeCertificationAssessmentStore(nextStore);
    commitOnStorageSuccess(result, { nextStore, nextAttempt }, (stored) => {
      setStore(stored.nextStore);
      setAttempt(stored.nextAttempt);
    });
    if (!result.ok) {
      setLocalError("L'enregistrement local a échoué. La dernière modification n'a pas été appliquée.");
      return false;
    }
    setLocalError('');
    return true;
  }

  function startAttempt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors: StartAttemptErrors = {
      declaration: toolDeclaration.trim() ? undefined : 'Décrivez les outils utilisés ou prévus.',
      charter: charterAccepted ? undefined : 'Acceptez la charte du candidat.',
      confirmation: toolDeclarationConfirmed ? undefined : 'Confirmez la déclaration des outils.',
    };
    const hasErrors = Object.values(errors).some(Boolean);
    setStartAttemptErrors(errors);
    if (hasErrors) {
      setLocalError('Complétez la déclaration des outils, acceptez la charte et confirmez la déclaration avant de commencer.');
      return;
    }
    const nextAttempt = createAssessmentAttempt(activeAssessment, availableCharter, {
      charterAccepted: true,
      currentSectionId: 'exam',
      toolDeclaration: { toolsUsed: toolDeclaration.trim(), confirmed: true },
    });
    if (saveAttempt(nextAttempt)) {
      window.scrollTo({ top: 0, behavior: 'auto' });
      focusAfterRender('exam-title');
    }
  }

  function updateAnswer(questionId: string, value: string) {
    if (!attempt) return;
    saveAttempt(setAssessmentAnswer(attempt, questionId, value));
  }

  function updateTools(toolsUsed: string, confirmed: boolean) {
    if (!attempt) return;
    saveAttempt(updateAssessmentAttempt(attempt, {
      toolDeclaration: { toolsUsed, confirmed },
    }));
  }

  function submitAttempt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!attempt) return;
    if (!attempt.toolDeclaration.toolsUsed.trim() || !attempt.toolDeclaration.confirmed) {
      setLocalError('Confirmez la déclaration des outils avant de soumettre cette tentative.');
      document.getElementById('assessment-tool-confirmation')?.focus();
      return;
    }
    const submitted = submitAssessmentAttempt(store, activeAssessment, attempt);
    const result = writeCertificationAssessmentStore(submitted.store);
    commitOnStorageSuccess(result, submitted.store, (stored) => {
      setStore(stored);
      setAttempt(null);
    });
    if (!result.ok) {
      setLocalError("La soumission n'a pas pu être enregistrée localement. La tentative reste active.");
      return;
    }
    setLocalError('');
    window.scrollTo({ top: 0, behavior: 'auto' });
    focusAfterRender('assessment-result-title');
  }

  function resetAssessment() {
    const reset = persistAssessmentRecordReset(store, activeAssessment, availableCharter);
    commitOnStorageSuccess(reset.result, reset.next, (stored) => {
      setStore(stored);
      setAttempt(null);
      setCharterAccepted(false);
      setToolDeclaration('');
      setToolDeclarationConfirmed(false);
      setStartAttemptErrors({});
    });
    if (!reset.result.ok) {
      setLocalError("La remise à zéro n'a pas pu être enregistrée. Les données sont conservées.");
      return;
    }
    setLocalError('');
    focusAfterRender('start-assessment-title');
  }

  return (
    <div className="pb-20">
      <EvaluationHeader
        title={assessment.title}
        description={assessment.description}
        certificationSlug={certification.slug}
        version={assessment.version}
        active={Boolean(attempt)}
      />

      <div className="mx-auto max-w-[var(--content-max)] px-4 py-10 sm:px-6 lg:px-8">
        {localError && (
          <div role="alert" className="mb-7 flex items-start gap-3 rounded-xl border border-error bg-[color-mix(in_srgb,var(--error)_8%,transparent)] p-4 text-sm">
            <AlertCircle aria-hidden="true" className="mt-0.5 shrink-0 text-error" size={18} />
            <p className="text-pretty">{localError}</p>
          </div>
        )}

        {attempt ? (
          <div className="space-y-10">
            <ActiveAssessment
              assessment={assessment}
              attempt={attempt}
              examQuestionById={examQuestionById}
              onAnswer={updateAnswer}
              onToolsChange={updateTools}
              onSubmit={submitAttempt}
              onReset={() => setResetOpen(true)}
            />
            <HistoricalAssessmentHistory contexts={previousContexts} />
          </div>
        ) : (
          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 space-y-10">
              {latestSubmission && (
                <AssessmentResult assessment={assessment} submission={latestSubmission} />
              )}
              <CharterPanel charter={activeCharter} />
              <StartAttemptForm
                assessment={assessment}
                charter={activeCharter}
                accepted={charterAccepted}
                declaration={toolDeclaration}
                declarationConfirmed={toolDeclarationConfirmed}
                errors={startAttemptErrors}
                onAcceptedChange={(value) => {
                  setCharterAccepted(value);
                  setStartAttemptErrors((current) => ({ ...current, charter: value ? undefined : current.charter }));
                }}
                onDeclarationChange={(value) => {
                  setToolDeclaration(value);
                  setStartAttemptErrors((current) => ({ ...current, declaration: value.trim() ? undefined : current.declaration }));
                }}
                onDeclarationConfirmedChange={(value) => {
                  setToolDeclarationConfirmed(value);
                  setStartAttemptErrors((current) => ({ ...current, confirmation: value ? undefined : current.confirmation }));
                }}
                onSubmit={startAttempt}
              />
            </div>

            <aside className="space-y-6 lg:sticky lg:top-24">
              <AttemptHistory
                record={record}
                historyLimit={assessment.attemptPolicy.submittedHistoryLimit}
              />
              <HistoricalAssessmentHistory contexts={previousContexts} />
              {(record.history.length > 0 || record.bestResult) && (
                <button type="button" className="btn-ghost w-full" onClick={() => setResetOpen(true)}>
                  <RotateCcw aria-hidden="true" size={16} /> Effacer les essais
                </button>
              )}
            </aside>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={resetAssessment}
        title="Effacer les données de cette évaluation ?"
        body={`La tentative active, jusqu’à ${assessment.attemptPolicy.submittedHistoryLimit} résultat${assessment.attemptPolicy.submittedHistoryLimit > 1 ? 's' : ''} soumis et le meilleur résultat seront supprimés de cet appareil.`}
        confirmLabel="Effacer les données"
      />
    </div>
  );
}

function EvaluationHeader({
  title,
  description,
  certificationSlug,
  version,
  active,
}: {
  title: string;
  description: string;
  certificationSlug: string;
  version: string;
  active: boolean;
}) {
  return (
    <header className="border-b border-outline-variant bg-surface-container-low/35">
      <div className="mx-auto max-w-[var(--content-max)] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link to={`/certifications/${certificationSlug}`} className="btn-quiet -ml-3 mb-7">
          <ArrowLeft aria-hidden="true" size={15} /> Retour à la certification
        </Link>
        <div className="flex flex-wrap gap-2">
          <span className="chip"><ClipboardCheck aria-hidden="true" size={13} /> Évaluation locale</span>
          <span className="chip tabular-nums">Version {version}</span>
          {active && <span className="chip">Tentative en cours</span>}
        </div>
        <h1 className="mt-5 max-w-4xl font-headline text-display-md font-semibold leading-tight tracking-tight text-balance">
          {title}
        </h1>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-surface-variant text-pretty">{description}</p>
      </div>
    </header>
  );
}

function EvaluationUnavailable({
  certificationSlug,
  certificationTitle,
  reason,
}: {
  certificationSlug: string;
  certificationTitle: string;
  reason: 'unsupported-type' | 'unavailable';
}) {
  const description = reason === 'unsupported-type'
    ? 'Cette certification relève d’un dispositif professionnel supervisé. Aucune évaluation locale n’est ouverte dans cette version.'
    : 'Aucune définition d’évaluation publiée avec une charte active n’est associée à cette certification.';

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <Link to={`/certifications/${certificationSlug}`} className="btn-quiet -ml-3 mb-8">
        <ArrowLeft aria-hidden="true" size={15} /> Retour à la certification
      </Link>
      <section className="rounded-2xl border border-outline-variant bg-surface-container-low/35 p-6 sm:p-8" aria-labelledby="evaluation-unavailable-title">
        <p className="eyebrow">{certificationTitle}</p>
        <h1 id="evaluation-unavailable-title" className="mt-3 font-headline text-display-sm font-semibold tracking-tight">
          Évaluation indisponible
        </h1>
        <p className="mt-4 max-w-2xl leading-relaxed text-surface-variant text-pretty">{description}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-surface-variant text-pretty">
          Cette page ne délivre ni résultat certifiant ni titre professionnel.
        </p>
      </section>
    </div>
  );
}

function CharterPanel({ charter }: { charter: CandidateCharter }) {
  return (
    <section aria-labelledby="candidate-charter-title">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-outline-variant pb-5">
        <div>
          <p className="eyebrow">Charte du candidat</p>
          <h2 id="candidate-charter-title" className="mt-3 font-headline text-headline-lg font-semibold text-balance">
            {charter.title}
          </h2>
        </div>
        <span className="chip tabular-nums">Version {charter.version}</span>
      </div>
      <p className="mt-6 max-w-3xl leading-relaxed text-surface-variant text-pretty">{charter.introduction}</p>
      <ol className="mt-7 divide-y divide-outline-variant border-y border-outline-variant">
        {charter.principles.map((principle, index) => (
          <li key={principle.id} className="grid gap-2 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)]">
            <span className="font-mono text-xs text-surface-variant tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            <div className="min-w-0">
              <h3 className="font-medium">{principle.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-surface-variant text-pretty">{principle.statement}</p>
            </div>
          </li>
        ))}
      </ol>
      <details className="mt-6 rounded-xl border border-outline-variant bg-surface-container-low/30 p-5">
        <summary className="cursor-pointer font-medium">{charter.futureSessionAnnex.title} · non active</summary>
        <ul className="mt-4 space-y-2 text-sm text-surface-variant">
          {charter.futureSessionAnnex.provisions.map((provision) => <li key={provision}>{provision}</li>)}
        </ul>
      </details>
    </section>
  );
}

function StartAttemptForm({
  assessment,
  charter,
  accepted,
  declaration,
  declarationConfirmed,
  errors,
  onAcceptedChange,
  onDeclarationChange,
  onDeclarationConfirmedChange,
  onSubmit,
}: {
  assessment: CertificationAssessment;
  charter: CandidateCharter;
  accepted: boolean;
  declaration: string;
  declarationConfirmed: boolean;
  errors: StartAttemptErrors;
  onAcceptedChange: (value: boolean) => void;
  onDeclarationChange: (value: string) => void;
  onDeclarationConfirmedChange: (value: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const declarationDescriptionId = 'start-tool-declaration-description';
  const declarationErrorId = 'start-tool-declaration-error';
  const charterErrorId = 'start-charter-error';
  const confirmationErrorId = 'start-tool-confirmation-error';

  return (
    <section aria-labelledby="start-assessment-title" className="premium-card p-6 sm:p-8">
      <p className="eyebrow">Nouvelle tentative</p>
      <h2 id="start-assessment-title" tabIndex={-1} className="mt-3 font-headline text-headline-md font-semibold text-balance">
        Déclaration préalable
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-surface-variant text-pretty">
        Les tentatives sont illimitées. Aucun chronomètre ni verrouillage technique n'est appliqué.
      </p>
      <form noValidate className="mt-7 space-y-6" onSubmit={onSubmit}>
        <label className="block">
          <span className="text-sm font-medium">Outils utilisés ou prévus</span>
          <textarea
            value={declaration}
            onChange={(event) => onDeclarationChange(event.target.value)}
            rows={3}
            className={`${fieldClass} mt-2 resize-y`}
            placeholder={assessment.toolDeclaration.choices.join(', ')}
            aria-invalid={errors.declaration ? true : undefined}
            aria-describedby={`${declarationDescriptionId}${errors.declaration ? ` ${declarationErrorId}` : ''}`}
          />
          <span id={declarationDescriptionId} className="mt-2 block text-xs text-surface-variant text-pretty">{assessment.toolDeclaration.prompt}</span>
          {errors.declaration && <span id={declarationErrorId} className="mt-2 block text-xs text-error text-pretty">{errors.declaration}</span>}
        </label>

        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(event) => onAcceptedChange(event.target.checked)}
            className="mt-1 size-4 accent-[color:var(--primary)]"
            aria-invalid={errors.charter ? true : undefined}
            aria-describedby={errors.charter ? charterErrorId : undefined}
          />
          <span className="text-pretty">
            {charter.acceptanceStatement}
            {errors.charter && <span id={charterErrorId} className="mt-1 block text-xs text-error">{errors.charter}</span>}
          </span>
        </label>
        <label className="flex items-start gap-3 text-sm">
          <input
            type="checkbox"
            checked={declarationConfirmed}
            onChange={(event) => onDeclarationConfirmedChange(event.target.checked)}
            className="mt-1 size-4 accent-[color:var(--primary)]"
            aria-invalid={errors.confirmation ? true : undefined}
            aria-describedby={errors.confirmation ? confirmationErrorId : undefined}
          />
          <span className="text-pretty">
            Je confirme que cette déclaration est complète et sera enregistrée avec la tentative.
            {errors.confirmation && <span id={confirmationErrorId} className="mt-1 block text-xs text-error">{errors.confirmation}</span>}
          </span>
        </label>

        <button type="submit" className="btn-foil">
          Commencer l'évaluation <ClipboardCheck aria-hidden="true" size={16} />
        </button>
      </form>
    </section>
  );
}

function ActiveAssessment({
  assessment,
  attempt,
  examQuestionById,
  onAnswer,
  onToolsChange,
  onSubmit,
  onReset,
}: {
  assessment: CertificationAssessment;
  attempt: CertificationAssessmentAttempt;
  examQuestionById: Map<string, AssessmentQuestion>;
  onAnswer: (questionId: string, value: string) => void;
  onToolsChange: (toolsUsed: string, confirmed: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onReset: () => void;
}) {
  const numericQuestions = assessment.miniCases.flatMap((miniCase) => miniCase.questions);
  const allQuestionIds = [...attempt.questionOrder, ...numericQuestions.map((question) => question.id)];
  const answered = allQuestionIds.filter((questionId) => Boolean(attempt.answers[questionId]?.trim())).length;
  const percentage = Math.round((answered / allQuestionIds.length) * 100);
  const assessmentPoints = assessment.exam.points
    + assessment.miniCases.reduce((sum, miniCase) => sum + miniCase.points, 0);

  return (
    <form onSubmit={onSubmit} className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="min-w-0 space-y-14">
        <section aria-labelledby="exam-title">
          <p className="eyebrow">Examen · {assessment.exam.points} points</p>
          <h2 id="exam-title" tabIndex={-1} className="mt-3 font-headline text-headline-lg font-semibold text-balance">
            {assessment.exam.title}
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-surface-variant text-pretty">{assessment.exam.instructions}</p>
          <p className="mt-4 rounded-xl border border-outline-variant bg-surface-container-low/35 p-4 text-sm text-pretty">
            {assessment.resourcePolicy.exam}
          </p>

          <div className="mt-8 space-y-5">
            {attempt.questionOrder.map((questionId, index) => {
              const question = examQuestionById.get(questionId);
              if (!question) return null;
              return (
                <fieldset key={question.id} className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6">
                  <legend className="max-w-full px-2 font-medium leading-relaxed text-pretty">
                    <span className="mr-2 font-mono text-xs text-surface-variant tabular-nums">
                      {index + 1}/{assessment.exam.questionCount}
                    </span>
                    {question.prompt}
                    <span className="ml-2 text-xs text-surface-variant tabular-nums">{question.points} pt</span>
                  </legend>
                  <div className="mt-4 space-y-3">
                    {question.options.map((option) => (
                      <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-outline-variant px-4 py-3 text-sm hover:bg-surface-container-low">
                        <input
                          required
                          type="radio"
                          name={question.id}
                          value={option.id}
                          checked={attempt.answers[question.id] === option.id}
                          onChange={() => onAnswer(question.id, option.id)}
                          className="mt-0.5 size-4 shrink-0 accent-[color:var(--primary)]"
                        />
                        <span className="text-pretty">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              );
            })}
          </div>
        </section>

        {assessment.miniCases.map((miniCase, index) => (
          <MiniCaseForm
            key={miniCase.id}
            miniCase={miniCase}
            index={index}
            resourcePolicy={assessment.resourcePolicy.miniCases}
            answers={attempt.answers}
            onAnswer={onAnswer}
          />
        ))}

        <section aria-labelledby="tool-declaration-title" className="premium-card p-6 sm:p-8">
          <p className="eyebrow">Déclaration enregistrée</p>
          <h2 id="tool-declaration-title" className="mt-3 font-headline text-headline-md font-semibold text-balance">
            Outils utilisés
          </h2>
          <label className="mt-6 block">
            <span className="text-sm font-medium">Déclaration finale</span>
            <textarea
              required
              rows={3}
              value={attempt.toolDeclaration.toolsUsed}
              onChange={(event) => onToolsChange(event.target.value, false)}
              className={`${fieldClass} mt-2 resize-y`}
            />
          </label>
          <label className="mt-5 flex items-start gap-3 text-sm">
            <input
              id="assessment-tool-confirmation"
              required
              type="checkbox"
              checked={attempt.toolDeclaration.confirmed}
              onChange={(event) => onToolsChange(attempt.toolDeclaration.toolsUsed, event.target.checked)}
              className="mt-1 size-4 accent-[color:var(--primary)]"
            />
            <span className="text-pretty">Je confirme que la déclaration décrit les outils effectivement utilisés.</span>
          </label>
        </section>

        <div className="flex flex-col gap-3 border-t border-outline-variant pt-7 sm:flex-row sm:items-center sm:justify-between">
          <button type="button" className="btn-quiet" onClick={onReset}>
            <RotateCcw aria-hidden="true" size={15} /> Remettre à zéro
          </button>
          <button type="submit" className="btn-foil">
            Soumettre la tentative <ClipboardCheck aria-hidden="true" size={16} />
          </button>
        </div>
      </div>

      <aside className="space-y-6 lg:sticky lg:top-24">
        <div className="premium-card p-6">
          <p className="eyebrow">Progression</p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <strong className="font-headline text-headline-md tabular-nums">{answered}/{allQuestionIds.length}</strong>
            <span className="text-sm text-surface-variant tabular-nums">{percentage}%</span>
          </div>
          <ProgressBar value={percentage} className="mt-4" />
          <p className="mt-4 flex items-start gap-2 text-xs text-surface-variant text-pretty">
            <Save aria-hidden="true" className="mt-0.5 shrink-0" size={13} />
            Chaque réponse est enregistrée sur cet appareil.
          </p>
        </div>
        <div className="rounded-2xl border border-outline-variant p-5 text-sm text-surface-variant">
          <p className="font-medium text-foreground">Seuils cumulatifs</p>
          <ul className="mt-3 space-y-2 tabular-nums">
            <li>{assessment.passingRules.totalMin}/{assessmentPoints} au total</li>
            <li>{assessment.passingRules.examMin}/{assessment.exam.points} à l'examen</li>
            {assessment.miniCases.map((miniCase, index) => (
              <li key={miniCase.id}>
                {assessment.passingRules.caseMinEach}/{miniCase.points} au mini-cas {index + 1}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </form>
  );
}

function MiniCaseForm({
  miniCase,
  index,
  resourcePolicy,
  answers,
  onAnswer,
}: {
  miniCase: AssessmentMiniCase;
  index: number;
  resourcePolicy: string;
  answers: Record<string, string>;
  onAnswer: (questionId: string, value: string) => void;
}) {
  return (
    <section aria-labelledby={`${miniCase.id}-title`}>
      <p className="eyebrow">Mini-cas {index + 1} · {miniCase.points} points</p>
      <h2 id={`${miniCase.id}-title`} className="mt-3 font-headline text-headline-lg font-semibold text-balance">
        {miniCase.title}
      </h2>
      <p className="mt-4 whitespace-pre-line leading-relaxed text-surface-variant text-pretty">{miniCase.scenario}</p>
      <p className="mt-4 text-sm leading-relaxed text-surface-variant text-pretty">{miniCase.instructions}</p>
      <p className="mt-4 flex items-start gap-2 rounded-xl border border-outline-variant bg-surface-container-low/35 p-4 text-sm text-pretty">
        <BookOpenCheck aria-hidden="true" className="mt-0.5 shrink-0" size={16} /> {resourcePolicy}
      </p>
      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {miniCase.questions.map((question) => (
          <label key={question.id} className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
            <span className="block text-sm font-medium leading-relaxed text-pretty">{question.prompt}</span>
            <span className="mt-2 block text-xs text-surface-variant tabular-nums">{question.points} points · réponse en {question.unit}</span>
            <span className="mt-4 flex items-center gap-3">
              <input
                required
                type="text"
                name={question.id}
                inputMode="decimal"
                autoComplete="off"
                value={answers[question.id] ?? ''}
                onChange={(event) => onAnswer(question.id, event.target.value)}
                className={`${fieldClass} min-w-0 tabular-nums`}
              />
              <span className="shrink-0 text-sm text-surface-variant">{question.unit}</span>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

function AssessmentResult({
  assessment,
  submission,
}: {
  assessment: CertificationAssessment;
  submission: SubmittedCertificationAssessment;
}) {
  const { score } = submission;
  const questionById = new Map(assessment.exam.questions.map((question) => [question.id, question]));
  return (
    <section aria-labelledby="assessment-result-title">
      <div role="status" aria-live="polite" className="flex items-start gap-4 border-b border-outline-variant pb-6">
        {score.passed
          ? <CheckCircle2 aria-hidden="true" className="mt-1 shrink-0 text-success" size={26} />
          : <XCircle aria-hidden="true" className="mt-1 shrink-0 text-error" size={26} />}
        <div className="min-w-0">
          <p className="eyebrow">Résultat local</p>
          <h2 id="assessment-result-title" tabIndex={-1} className="mt-3 font-headline text-headline-lg font-semibold text-balance">
            {score.passed ? 'Évaluation réussie' : 'Seuils non atteints'} · <span className="tabular-nums">{score.totalScore}/{score.maxScore}</span>
          </h2>
          <p className="mt-2 text-sm text-surface-variant text-pretty">
            Ce résultat reste enregistré sur cet appareil. Il atteste uniquement la réussite de cette évaluation locale et ne constitue pas une certification professionnelle.
          </p>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ScoreCell
          label={`Total · seuil ${score.thresholds.total.minimum}`}
          value={`${score.totalScore}/${score.maxScore}`}
          passed={score.thresholds.total.passed}
        />
        <ScoreCell
          label={`Examen · seuil ${score.thresholds.exam.minimum}`}
          value={`${score.examScore}/${score.examMaxScore}`}
          passed={score.thresholds.exam.passed}
        />
        {score.miniCases.map((miniCase, index) => (
          <ScoreCell
            key={miniCase.caseId}
            label={`Mini-cas ${index + 1} · seuil ${score.thresholds.miniCase.minimumEach}`}
            value={`${miniCase.score}/${miniCase.maxScore}`}
            passed={miniCase.passedThreshold}
          />
        ))}
      </div>

      <div className="mt-8 space-y-3">
        <details className="rounded-xl border border-outline-variant p-5">
          <summary className="cursor-pointer font-medium">Corrigé de l'examen</summary>
          <ol className="mt-5 divide-y divide-outline-variant">
            {submission.questionOrder.map((questionId, index) => {
              const question = questionById.get(questionId);
              if (!question) return null;
              const selected = question.options.find((option) => option.id === submission.answers[question.id]);
              const correct = question.options.find((option) => option.id === question.correctOptionId);
              const isCorrect = selected?.id === correct?.id;
              return (
                <li key={question.id} className="py-5 first:pt-0 last:pb-0">
                  <p className="font-medium text-pretty"><span className="mr-2 font-mono text-xs text-surface-variant tabular-nums">{index + 1}</span>{question.prompt}</p>
                  <p className={`mt-2 text-sm ${isCorrect ? 'text-success' : 'text-error'}`}>
                    <strong>{isCorrect ? 'Correct.' : 'Incorrect.'}</strong>{' '}
                    Votre réponse : {selected?.label ?? 'Aucune réponse'}
                  </p>
                  {!isCorrect && <p className="mt-1 text-sm">Réponse attendue : {correct?.label}</p>}
                  <p className="mt-2 text-sm leading-relaxed text-surface-variant text-pretty">{question.explanation}</p>
                </li>
              );
            })}
          </ol>
        </details>

        {assessment.miniCases.map((miniCase) => (
          <CaseCorrection
            key={miniCase.id}
            miniCase={miniCase}
            submission={submission}
          />
        ))}
      </div>
    </section>
  );
}

function CaseCorrection({
  miniCase,
  submission,
}: {
  miniCase: AssessmentMiniCase;
  submission: SubmittedCertificationAssessment;
}) {
  const caseResult = submission.score.miniCases.find((candidate) => candidate.caseId === miniCase.id);
  return (
    <details className="rounded-xl border border-outline-variant p-5">
      <summary className="cursor-pointer font-medium">Corrigé · {miniCase.title}</summary>
      <div className="mt-5 divide-y divide-outline-variant">
        {miniCase.questions.map((question) => {
          const result = caseResult?.questions.find((candidate) => candidate.questionId === question.id);
          const correct = result?.correct ?? false;
          return (
            <div key={question.id} className="py-5 first:pt-0 last:pb-0">
              <p className="font-medium text-pretty">{question.prompt}</p>
              <p className={`mt-2 text-sm tabular-nums ${correct ? 'text-success' : 'text-error'}`}>
                <strong>{correct ? 'Correct.' : 'Incorrect.'}</strong>{' '}
                Votre réponse : {submission.answers[question.id] || 'Aucune'} {question.unit}
                {' '}· {result?.awardedPoints ?? 0}/{result?.maxPoints ?? question.points} points
              </p>
              <p className="mt-1 text-sm text-surface-variant tabular-nums">
                Valeur attendue : {question.expectedValue} {question.unit} · tolérance : {toleranceLabel(question)}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-surface-variant text-pretty">{question.correction}</p>
            </div>
          );
        })}
      </div>
    </details>
  );
}

function toleranceLabel(question: NumericAssessmentQuestion): string {
  return question.tolerance.mode === 'absolute'
    ? `± ${question.tolerance.value} ${question.unit}`
    : `± ${question.tolerance.value * 100} % de la réponse attendue`;
}

function ScoreCell({ label, value, passed }: { label: string; value: string; passed: boolean }) {
  return (
    <div className="rounded-xl border border-outline-variant p-4">
      <p className="text-xs text-surface-variant">{label}</p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <strong className="font-headline text-headline-sm tabular-nums">{value}</strong>
        <span className={passed ? 'text-success' : 'text-error'}>
          {passed ? <CheckCircle2 aria-label="Seuil atteint" size={17} /> : <XCircle aria-label="Seuil non atteint" size={17} />}
        </span>
      </div>
    </div>
  );
}

function AttemptHistory({
  record,
  historyLimit,
}: {
  record: CertificationAssessmentRecord;
  historyLimit: number;
}) {
  return (
    <section className="premium-card p-6" aria-labelledby="attempt-history-title">
      <p className="eyebrow flex items-center gap-2"><History aria-hidden="true" size={13} /> Historique</p>
      <h2 id="attempt-history-title" className="mt-3 font-headline text-headline-sm font-semibold text-balance">
        {historyLimit} dernier{historyLimit > 1 ? 's' : ''} essai{historyLimit > 1 ? 's' : ''}
      </h2>
      {record.history.length ? (
        <ol className="mt-5 divide-y divide-outline-variant">
          {record.history.map((submission) => (
            <li key={submission.id} className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="text-surface-variant">{formatDate(submission.submittedAt)}</span>
              <strong className="tabular-nums">{submission.score.totalScore}/{submission.score.maxScore}</strong>
            </li>
          ))}
        </ol>
      ) : (
        <p className="mt-4 text-sm text-surface-variant text-pretty">Aucun essai soumis sur cet appareil.</p>
      )}
      {record.bestResult && (
        <div className="mt-5 border-t border-outline-variant pt-5">
          <p className="flex items-center gap-2 text-xs text-surface-variant"><ShieldCheck aria-hidden="true" size={14} /> Meilleur résultat conservé</p>
          <p className="mt-2 font-headline text-headline-sm font-semibold tabular-nums">
            {record.bestResult.score.totalScore}/{record.bestResult.score.maxScore}
          </p>
        </div>
      )}
    </section>
  );
}

function HistoricalAssessmentHistory({ contexts }: { contexts: HistoricalAssessmentContext[] }) {
  if (!contexts.length) return null;

  return (
    <section className="premium-card p-6" aria-labelledby="previous-assessment-history-title">
      <p className="eyebrow flex items-center gap-2"><History aria-hidden="true" size={13} /> Versions antérieures</p>
      <h2 id="previous-assessment-history-title" className="mt-3 font-headline text-headline-sm font-semibold text-balance">
        Résultats conservés
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-surface-variant text-pretty">
        Ces résultats correspondent à des versions antérieures de l’évaluation ou de la charte. Ils restent consultables séparément du contexte actif.
      </p>
      <div className="mt-5 space-y-3">
        {contexts.map((context) => (
          <details
            key={`${context.assessmentVersion}:${context.charterId}:${context.charterVersion}`}
            className="rounded-xl border border-outline-variant p-4"
          >
            <summary className="cursor-pointer text-sm font-semibold">
              Évaluation {context.assessmentVersion} · charte {context.charterVersion}
            </summary>
            <p className="mt-2 text-xs text-surface-variant">
              {context.submissions.length} résultat{context.submissions.length > 1 ? 's' : ''} · meilleur score {context.bestResult.score.totalScore}/{context.bestResult.score.maxScore}
            </p>
            <ol className="mt-3 divide-y divide-outline-variant border-t border-outline-variant">
              {context.submissions.map((submission) => (
                <li key={submission.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                  <span className="text-surface-variant">{formatDate(submission.submittedAt)}</span>
                  <strong className="tabular-nums">{submission.score.totalScore}/{submission.score.maxScore}</strong>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>
    </section>
  );
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}
