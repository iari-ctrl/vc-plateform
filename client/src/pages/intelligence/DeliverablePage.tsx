import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { publicAssetUrl } from '@shared/base-url.mjs';
import {
  ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Check, CheckCircle2, Clock,
  Download, FileCheck2, FileText, History, MessageSquareText, Sparkles, Target, Users,
} from 'lucide-react';
import { deliverableBySlug, caseById, ecosystemById, memoById, lessonById } from '@/content';
import {
  isDeliverableComponentOptionalInDirectAccess,
  selectDeliverableComponents,
  selectDeliverableCriteria,
  selectDeliverableTemplateSections,
} from '@/content/deliverables';
import { parcoursById, parcoursContextHref, parcoursNavigationForLesson } from '@/content/parcours';
import type { TimeBudget } from '@/content/parcoursTypes';
import type { Deliverable, DeliverableCriterion, DeliverableModelRef, DeliverableResource } from '@/content/types';
import { Markdown } from '@/lib/markdown';
import { downloadMarkdown } from '@/lib/downloads';
import { buildReviewMarkdown, buildWorksheetMarkdown } from '@/lib/learningExports';
import {
  learningWorkspace, productionStageAtLeast, useLearningWorkspace,
  type ProductionStage, type ReviewMode,
} from '@/lib/learningWorkspace';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { useUserData } from '@/context/UserDataContext';
import { useResourcePageMeta } from '@/lib/seo';
import { safeHttpUrl } from '@/lib/utils';
import NotFoundPage from '@/pages/system/NotFoundPage';

const STAGE_LABEL: Record<ProductionStage, string> = {
  started: 'Production commencée',
  'first-version-completed': 'Première version terminée',
  reviewed: 'Retour reçu ou autoévaluation effectuée',
  revised: 'Production révisée',
};

const REVIEW_MODE_LABEL: Record<ReviewMode, string> = {
  self: 'Autoévaluation',
  peer: 'Revue par un pair',
  practitioner: 'Revue par un praticien',
};

const DOWNLOAD_FORMATS = new Set(['xlsx', 'csv', 'pdf', 'docx']);
const RESOURCE_LINK_CLASS = 'flex h-full items-center justify-between gap-3 rounded-xl border border-outline-variant p-4 text-sm font-medium transition-colors hover:border-[color:var(--primary)] hover:bg-surface-container-low';

function DeliverableResourceLink({ resource }: { resource: DeliverableResource }) {
  const format = resource.format.toLowerCase();
  const content = (
    <>
      <span>{resource.label}</span>
      <span className="chip shrink-0">{resource.format}</span>
    </>
  );

  const isInternal = resource.href.startsWith('/') && !resource.href.startsWith('//');
  if (format === 'page' && isInternal) {
    return <Link to={resource.href} className={RESOURCE_LINK_CLASS}>{content}</Link>;
  }

  const isDownload = DOWNLOAD_FORMATS.has(format);
  const href = isInternal
    ? publicAssetUrl(resource.href, import.meta.env.BASE_URL)
    : safeHttpUrl(resource.href);
  if (!href) {
    return <span className={RESOURCE_LINK_CLASS} aria-disabled="true">{content}</span>;
  }

  return (
    <a
      href={href}
      download={isDownload || undefined}
      target={isInternal ? undefined : '_blank'}
      rel={isInternal ? undefined : 'noopener noreferrer'}
      className={RESOURCE_LINK_CLASS}
    >
      {content}
    </a>
  );
}

/** Resolve a legacy model exemplar to an in-app route and label. */
function resolveModel(model: DeliverableModelRef): { href: string; title: string; typeLabel: string } | null {
  switch (model.kind) {
    case 'case': {
      const caseStudy = caseById(model.id);
      return caseStudy ? { href: `/cases/${caseStudy.slug}`, title: caseStudy.title, typeLabel: 'Étude de cas' } : null;
    }
    case 'ecosystem': {
      const ecosystem = ecosystemById(model.id);
      return ecosystem ? { href: `/ecosystemes/${ecosystem.slug}`, title: ecosystem.title, typeLabel: 'Dossier écosystème' } : null;
    }
    case 'memo': {
      const memo = memoById(model.id);
      return memo ? { href: `/memos/${memo.slug}`, title: memo.title, typeLabel: 'Memo annoté' } : null;
    }
    case 'lesson': {
      const lesson = lessonById(model.id);
      return lesson ? { href: `/lessons/${lesson.slug}`, title: lesson.title, typeLabel: 'Leçon' } : null;
    }
    default:
      return null;
  }
}

function criterionId(criterion: DeliverableCriterion, index: number): string {
  return criterion.id ?? `criterion-${index + 1}`;
}

export default function DeliverablePage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const deliverable = slug ? deliverableBySlug(slug) : undefined;
  const requestedParcours = parcoursById(searchParams.get('parcours') ?? '');
  const requestedBudget = searchParams.get('budget');
  const returnBudget = requestedParcours
    && (requestedBudget === 'low' || requestedBudget === 'medium' || requestedBudget === 'high')
    && requestedParcours.timeFit.includes(requestedBudget)
    ? requestedBudget
    : undefined;
  const returnParcours = deliverable && requestedParcours?.steps.some((step) => (
    (step.ref.kind === 'deliverable' || step.ref.kind === 'milestone') && step.ref.id === deliverable.id
  ))
    ? requestedParcours
    : undefined;
  const relatedLessonHref = (lessonId: string, lessonSlug: string) => {
    const canonicalHref = `/lessons/${lessonSlug}`;
    if (!returnParcours) return canonicalHref;
    const navigation = parcoursNavigationForLesson(lessonId, returnParcours.id, returnBudget);
    return navigation
      ? parcoursContextHref(canonicalHref, returnParcours.id, returnBudget)
      : canonicalHref;
  };
  useResourcePageMeta(Boolean(deliverable), deliverable?.title, deliverable?.summary, { type: 'article' });

  if (!deliverable) return <NotFoundPage />;

  const model = deliverable.model && !deliverable.correctionId ? resolveModel(deliverable.model) : null;
  const caseStudy = deliverable.caseStudyId ? caseById(deliverable.caseStudyId) : undefined;
  const caseStudyHref = caseStudy
    ? (returnParcours
      ? parcoursContextHref(`/cases/${caseStudy.slug}`, returnParcours.id, returnBudget)
      : `/cases/${caseStudy.slug}`)
    : undefined;
  const caseCorrectionHref = caseStudy
    ? (returnParcours
      ? parcoursContextHref(`/cases/${caseStudy.slug}/correction`, returnParcours.id, returnBudget)
      : `/cases/${caseStudy.slug}/correction`)
    : undefined;
  const relatedLessons = (deliverable.relatedLessonIds ?? [])
    .map((id) => lessonById(id))
    .filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));
  const hasWorkspace = Boolean(deliverable.activityKind);
  const selectedComponents = selectDeliverableComponents(deliverable, returnBudget);
  const selectedTemplateSections = selectDeliverableTemplateSections(deliverable, returnBudget);
  const selectedCriteria = selectDeliverableCriteria(deliverable, returnBudget);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <Link to={returnParcours ? `/parcours/${returnParcours.slug}${returnBudget ? `?budget=${returnBudget}` : ''}` : '/parcours'} className="btn-quiet mb-6 -ml-3"><ArrowLeft size={15} aria-hidden /> {returnParcours?.title ?? 'Parcours'}</Link>

      <header>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="chip">{deliverable.kicker ?? 'Livrable'}</span>
            <span className="inline-flex items-center gap-1 text-surface-variant"><BookOpen size={13} aria-hidden /> {deliverable.readMin} min de lecture</span>
            {deliverable.estimatedWorkMinutes && (
              <span className="inline-flex items-center gap-1 text-surface-variant"><Clock size={13} aria-hidden /> {deliverable.estimatedWorkMinutes} min de production estimée</span>
            )}
          </div>
          <BookmarkButton item={{ itemType: 'deliverable', itemId: deliverable.id, title: deliverable.title, href: `/livrables/${deliverable.slug}` }} />
        </div>
        <h1 className="mt-4 font-headline text-display-sm font-semibold leading-[1.1] tracking-tight text-balance">{deliverable.title}</h1>
        <p className="mt-4 text-lg leading-relaxed text-surface-variant text-pretty">{deliverable.summary}</p>
      </header>

      <section className="mt-8">
        <Markdown source={deliverable.brief} className="prose-editorial" />
      </section>

      {caseStudy && caseStudyHref && (
        <Link to={caseStudyHref} className="group mt-8 flex items-start gap-4 rounded-2xl border border-outline-variant p-5 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[color:var(--primary)]"><FileText size={16} aria-hidden /></span>
          <span className="min-w-0 flex-1">
            <span className="eyebrow">Dossier longitudinal</span>
            <span className="mt-1 block font-headline text-headline-sm font-medium">{caseStudy.title}</span>
            <span className="mt-1 block text-sm text-surface-variant">Reprendre les pièces et vos hypothèses avant de compléter cette production.</span>
          </span>
          <ArrowUpRight size={15} className="mt-1 shrink-0 text-surface-variant" aria-hidden />
        </Link>
      )}

      {selectedComponents.length > 0 && (
        <section className="mt-12" aria-labelledby="deliverable-components-title">
          <p className="eyebrow flex items-center gap-2"><FileCheck2 size={14} aria-hidden /> Production attendue</p>
          <h2 id="deliverable-components-title" className="mt-2 font-headline text-headline-lg font-semibold">Composants à réunir</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {selectedComponents.map((component) => (
              <div key={component.id} className="rounded-2xl border border-outline-variant bg-surface-container-low/40 p-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-headline text-headline-sm font-semibold">{component.title}</h3>
                  {isDeliverableComponentOptionalInDirectAccess(component, returnBudget) && (
                    <span className="chip">Facultatif en accès direct</span>
                  )}
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-surface-variant">
                  {component.requirements.map((requirement) => <li key={requirement} className="flex gap-2"><Check size={14} className="mt-0.5 shrink-0 text-[color:var(--primary)]" aria-hidden /><span>{requirement}</span></li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12" aria-labelledby="deliverable-template-title">
        <p className="eyebrow mb-5 flex items-center gap-2"><Target size={14} aria-hidden /> Fiche de travail</p>
        <h2 id="deliverable-template-title" className="sr-only">Gabarit du livrable</h2>
        <ol className="space-y-7">
          {selectedTemplateSections.map((section, index) => (
            <li key={section.heading}>
              <div className="flex items-center gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] font-mono text-[0.625rem] text-[color:var(--primary)]">{index + 1}</span>
                <h3 className="font-headline text-headline-sm font-semibold leading-tight">{section.heading}</h3>
              </div>
              <div className="mt-2 pl-9 text-[0.95rem] leading-relaxed text-surface-variant"><Markdown source={section.prompt} className="prose-editorial" /></div>
            </li>
          ))}
        </ol>
      </section>

      {hasWorkspace && <ProductionWorkspace deliverable={deliverable} criteria={selectedCriteria} budget={returnBudget} caseCorrectionHref={caseCorrectionHref} />}

      {selectedCriteria.length > 0 && (
        <RubricReference deliverable={deliverable} criteria={selectedCriteria} />
      )}

      {deliverable.roleCards && deliverable.roleCards.length > 0 && (
        <section className="mt-12" aria-labelledby="role-cards-title">
          <p className="eyebrow flex items-center gap-2"><Users size={14} aria-hidden /> Simulation du comité</p>
          <h2 id="role-cards-title" className="mt-2 font-headline text-headline-lg font-semibold">Cartes de rôle</h2>
          <div className="mt-5 space-y-3">
            {deliverable.roleCards.map((role) => (
              <details key={role.id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
                <summary className="cursor-pointer font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--primary)]">{role.title}</summary>
                <p className="mt-3 text-sm leading-relaxed text-surface-variant"><span className="font-medium text-foreground">Mandat :</span> {role.mandate}</p>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-surface-variant">
                  {role.questions.map((question) => <li key={question} className="flex gap-2"><span aria-hidden>•</span><span>{question}</span></li>)}
                </ul>
              </details>
            ))}
          </div>
        </section>
      )}

      {deliverable.resources && deliverable.resources.length > 0 && (
        <section className="mt-12" aria-labelledby="deliverable-resources-title">
          <p id="deliverable-resources-title" className="eyebrow mb-3">Ressources et modèles</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {deliverable.resources.map((resource) => (
              <li key={`${resource.href}-${resource.label}`}>
                <DeliverableResourceLink resource={resource} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {model && (
        <Link to={model.href} className="group mt-10 flex items-start gap-4 rounded-2xl border border-outline-variant p-5 transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low">
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[color:var(--primary)]"><Sparkles size={16} aria-hidden /></span>
          <span className="min-w-0">
            <span className="eyebrow flex items-center gap-1.5">Le modèle · {model.typeLabel} <ArrowUpRight size={13} aria-hidden /></span>
            <span className="mt-1 block font-headline text-headline-sm font-medium leading-snug">{model.title}</span>
            {deliverable.model?.note && <span className="mt-1.5 block text-sm leading-relaxed text-surface-variant">{deliverable.model.note}</span>}
          </span>
        </Link>
      )}

      {relatedLessons.length > 0 && (
        <section className="mt-12">
          <p className="eyebrow mb-3">Pour préparer ce livrable</p>
          <ul className="space-y-2">
            {relatedLessons.map((lesson) => (
              <li key={lesson.id}>
                <Link to={relatedLessonHref(lesson.id, lesson.slug)} className="inline-flex items-center gap-2 text-[0.95rem] font-medium text-foreground underline decoration-dotted decoration-primary/60 underline-offset-[3px] transition-colors hover:text-[color:var(--primary)]">
                  <BookOpen size={14} className="text-surface-variant" aria-hidden /> {lesson.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {deliverable.glossaryRefs && deliverable.glossaryRefs.length > 0 && <div className="mt-10"><GlossaryRefList slugs={deliverable.glossaryRefs} /></div>}
    </article>
  );
}

function ProductionWorkspace({
  deliverable,
  criteria,
  budget,
  caseCorrectionHref,
}: {
  deliverable: Deliverable;
  criteria: DeliverableCriterion[];
  budget?: TimeBudget;
  caseCorrectionHref?: string;
}) {
  const workspace = useLearningWorkspace();
  const { journal } = useUserData();
  const entry = workspace.productions[deliverable.id];
  const [note, setNote] = useState(entry?.note ?? '');
  const [externalFileProduced, setExternalFileProduced] = useState(entry?.externalFileProduced ?? false);
  const [changeLog, setChangeLog] = useState(entry?.changeLog ?? '');
  const [reviewMode, setReviewMode] = useState<ReviewMode>(entry?.reviewMode ?? 'self');
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    setNote(entry?.note ?? '');
    setExternalFileProduced(entry?.externalFileProduced ?? false);
    setChangeLog(entry?.changeLog ?? '');
    setReviewMode(entry?.reviewMode ?? 'self');
  }, [deliverable.id, entry?.note, entry?.externalFileProduced, entry?.changeLog, entry?.reviewMode]);

  const stage = entry?.stage;
  const firstVersionComplete = productionStageAtLeast(stage, 'first-version-completed');
  const reviewed = productionStageAtLeast(stage, 'reviewed');
  const revised = productionStageAtLeast(stage, 'revised');
  const linkedPredictions = useMemo(() => journal.filter((journalEntry) => (
    journalEntry.links.some((link) => link.type === 'deliverable' && link.id === deliverable.id)
  )).length, [deliverable.id, journal]);
  const availableReviewModes: ReviewMode[] = (deliverable.evaluation ?? ['auto']).map((mode) => mode === 'auto' ? 'self' : mode);
  const hasRubricRating = Boolean(entry?.rubricRatings && Object.keys(entry.rubricRatings).length > 0);
  const completionMissing = [
    entry?.note?.trim() ? null : 'une note de travail ou l’emplacement du fichier',
    entry?.externalFileProduced ? null : 'la confirmation qu’un fichier a été produit hors plateforme',
    entry?.reviewMode ? null : 'un mode de retour enregistré',
    hasRubricRating ? null : 'au moins une appréciation de la grille',
    entry?.changeLog?.trim() ? null : 'un journal des modifications après retour',
  ].filter((item): item is string => Boolean(item));
  const canDeclareComplete = completionMissing.length === 0;

  function announce(ok: boolean, success: string) {
    setAnnouncement(ok ? success : 'La modification n’a pas pu être enregistrée.');
  }

  function start() {
    const result = learningWorkspace.advanceProduction(deliverable.id, 'started');
    announce(result.ok, 'Production commencée.');
  }

  function saveWork() {
    const result = learningWorkspace.updateProduction(deliverable.id, { note, externalFileProduced });
    announce(result.ok, 'Note de travail enregistrée sur cet appareil.');
  }

  function advance(next: ProductionStage) {
    const patchResult = learningWorkspace.updateProduction(deliverable.id, { note, externalFileProduced, reviewMode, changeLog });
    if (!patchResult.ok) {
      announce(false, '');
      return;
    }
    const result = learningWorkspace.advanceProduction(deliverable.id, next);
    announce(result.ok, STAGE_LABEL[next]);
  }

  function rate(criterionIdValue: string, levelId: string) {
    const result = learningWorkspace.updateProduction(deliverable.id, { rubricRatings: { [criterionIdValue]: levelId } });
    announce(result.ok, 'Appréciation enregistrée.');
  }

  function saveChangeLog() {
    const result = learningWorkspace.updateProduction(deliverable.id, { changeLog });
    announce(result.ok, 'Journal des modifications enregistré.');
  }

  function declareComplete() {
    if (!canDeclareComplete) {
      setAnnouncement('Le jalon reste bloqué : production, revue, autoévaluation et révision doivent être observables.');
      return;
    }
    const result = learningWorkspace.declareComplete(deliverable.id);
    announce(result.ok, 'Jalon final déclaré terminé.');
  }

  return (
    <section className="mt-12 rounded-2xl border-2 border-[color-mix(in_srgb,var(--primary)_28%,transparent)] bg-[color-mix(in_srgb,var(--primary)_4%,transparent)] p-5 sm:p-7" aria-labelledby="production-workspace-title">
      <p className="eyebrow flex items-center gap-2"><FileCheck2 size={14} aria-hidden /> Espace de production local</p>
      <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="production-workspace-title" className="font-headline text-headline-lg font-semibold">Produire, recevoir un retour, réviser</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-variant">Votre note et vos états restent dans le stockage local de ce navigateur. N’y consignez aucune donnée personnelle ou confidentielle.</p>
        </div>
        <span className="chip">{entry ? STAGE_LABEL[entry.stage] : 'Non commencé'}</span>
      </div>

      <ol className="mt-6 grid gap-2 sm:grid-cols-4" aria-label="Étapes de production">
        {(['started', 'first-version-completed', 'reviewed', 'revised'] as ProductionStage[]).map((item, index) => {
          const reached = productionStageAtLeast(stage, item);
          const current = stage === item;
          return (
            <li key={item} aria-current={current ? 'step' : undefined} className={`rounded-xl border px-3 py-3 text-xs leading-relaxed ${reached ? 'border-[color-mix(in_srgb,var(--primary)_45%,transparent)] bg-surface-container-lowest text-foreground' : 'border-outline-variant text-surface-variant'}`}>
              <span className="mb-1 block font-mono text-[0.625rem]">{reached ? '✓' : index + 1}</span>
              {STAGE_LABEL[item]}
            </li>
          );
        })}
      </ol>

      {!entry ? (
        <button type="button" onClick={start} className="btn-foil mt-6">Commencer la production <ArrowRight size={15} aria-hidden /></button>
      ) : (
        <div className="mt-6 space-y-6">
          <div>
            <label htmlFor={`production-note-${deliverable.id}`} className="text-sm font-medium">Note de travail courte</label>
            <p id={`production-note-help-${deliverable.id}`} className="mt-1 text-xs text-surface-variant">Hypothèses, points à vérifier ou emplacement de votre fichier. 4 000 caractères maximum.</p>
            <textarea
              id={`production-note-${deliverable.id}`}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={4000}
              rows={5}
              aria-describedby={`production-note-help-${deliverable.id}`}
              className="mt-2 w-full resize-y rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm leading-relaxed outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_25%,transparent)]"
            />
            <label className="mt-3 flex items-start gap-3 text-sm">
              <input type="checkbox" checked={externalFileProduced} onChange={(event) => setExternalFileProduced(event.target.checked)} className="mt-0.5 accent-[color:var(--primary)]" />
              <span>J’ai produit ou mis à jour un fichier hors plateforme.</span>
            </label>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={saveWork} className="btn-ghost">Enregistrer la note</button>
              <button type="button" onClick={() => downloadMarkdown(`${deliverable.title} - fiche de travail`, buildWorksheetMarkdown(deliverable, note, externalFileProduced, budget))} className="btn-quiet"><Download size={15} aria-hidden /> Exporter la fiche</button>
            </div>
          </div>

          {stage === 'started' && (
            <div className="border-t border-outline-variant pt-5">
              <button type="button" onClick={() => advance('first-version-completed')} className="btn-foil">Déclarer la première version terminée <Check size={15} aria-hidden /></button>
              <p className="mt-2 text-xs text-surface-variant">Cette déclaration reste facultative. Elle autorise la révélation volontaire de la correction lorsqu’une correction est liée.</p>
            </div>
          )}

          {firstVersionComplete && criteria.length > 0 && (
            <fieldset className="border-t border-outline-variant pt-5">
              <legend className="font-headline text-headline-sm font-semibold">Appréciation critère par critère</legend>
              <p className="mt-1 text-sm text-surface-variant">Les niveaux ne sont pas agrégés en score.</p>
              {deliverable.rubricLevels && deliverable.rubricLevels.length > 0 && (
                <div className="mt-4 space-y-4">
                  {criteria.map((criterion, index) => {
                  const id = criterionId(criterion, index);
                  return (
                    <div key={id} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
                      <label htmlFor={`${deliverable.id}-${id}`} className="text-sm font-medium">{criterion.criterion}</label>
                      <select
                        id={`${deliverable.id}-${id}`}
                        value={entry.rubricRatings?.[id] ?? ''}
                        onChange={(event) => rate(id, event.target.value)}
                        className="mt-2 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm outline-none focus:border-[color:var(--primary)]"
                      >
                        <option value="">Choisir un niveau</option>
                        {(deliverable.rubricLevels ?? []).map((level) => <option key={level.id} value={level.id}>{level.label}</option>)}
                      </select>
                    </div>
                  );
                  })}
                </div>
              )}

              <div className="mt-5">
                <label htmlFor={`review-mode-${deliverable.id}`} className="text-sm font-medium">Mode de retour</label>
                <select id={`review-mode-${deliverable.id}`} value={reviewMode} onChange={(event) => setReviewMode(event.target.value as ReviewMode)} className="mt-2 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none focus:border-[color:var(--primary)] sm:max-w-sm">
                  {availableReviewModes.map((mode) => <option key={mode} value={mode}>{REVIEW_MODE_LABEL[mode]}</option>)}
                </select>
                {availableReviewModes.length > 1 && <p className="mt-2 text-xs text-surface-variant">La revue par un pair ou un praticien se déroule hors plateforme. Elle reste facultative et sans effet certificatif.</p>}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={() => downloadMarkdown(`${deliverable.title} - autoevaluation`, buildReviewMarkdown(deliverable, entry.rubricRatings ?? {}, 'self', budget))} className="btn-ghost"><Download size={15} aria-hidden /> Exporter l’autoévaluation</button>
                {availableReviewModes.length > 1 && <button type="button" onClick={() => downloadMarkdown(`${deliverable.title} - grille de revue externe`, buildReviewMarkdown(deliverable, entry.rubricRatings ?? {}, 'external', budget))} className="btn-ghost"><Download size={15} aria-hidden /> Exporter la grille externe</button>}
                {!reviewed && <button type="button" onClick={() => advance('reviewed')} className="btn-foil">Déclarer le retour effectué <MessageSquareText size={15} aria-hidden /></button>}
              </div>
            </fieldset>
          )}

          {reviewed && (
            <div className="border-t border-outline-variant pt-5">
              <label htmlFor={`change-log-${deliverable.id}`} className="flex items-center gap-2 text-sm font-medium"><History size={15} aria-hidden /> Journal des modifications</label>
              <p id={`change-log-help-${deliverable.id}`} className="mt-1 text-xs text-surface-variant">Consignez les décisions modifiées, les nouvelles preuves et les désaccords conservés.</p>
              <textarea id={`change-log-${deliverable.id}`} value={changeLog} onChange={(event) => setChangeLog(event.target.value)} rows={5} maxLength={5000} aria-describedby={`change-log-help-${deliverable.id}`} className="mt-2 w-full resize-y rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm leading-relaxed outline-none focus:border-[color:var(--primary)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--primary)_25%,transparent)]" />
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" onClick={saveChangeLog} className="btn-ghost">Enregistrer le journal</button>
                {!revised && <button type="button" onClick={() => advance('revised')} className="btn-foil">Déclarer la production révisée <Check size={15} aria-hidden /></button>}
              </div>
            </div>
          )}

          {firstVersionComplete && deliverable.correctionId && caseCorrectionHref && (
            <div className="border-t border-outline-variant pt-5">
              <Link to={caseCorrectionHref} className="btn-ghost">{entry.correctionRevealedAt ? 'Revoir la correction commentée' : 'Choisir de révéler la correction'} <ArrowRight size={15} aria-hidden /></Link>
            </div>
          )}

          {revised && deliverable.activityKind === 'capstone' && (
            <div className="rounded-xl border border-[color-mix(in_srgb,var(--primary)_35%,transparent)] bg-surface-container-lowest p-5">
              <p className="font-medium">Jalon final</p>
              <p className="mt-1 text-sm leading-relaxed text-surface-variant">La révision est enregistrée. Le jalon ne peut être déclaré terminé que si la production, la revue, l’autoévaluation et le journal de révision sont observables.</p>
              {completionMissing.length > 0 && (
                <div className="mt-4 rounded-lg border border-outline-variant bg-surface-container-low p-3 text-xs leading-relaxed text-surface-variant">
                  <p className="font-medium text-foreground">Éléments encore requis avant complétion :</p>
                  <ul className="mt-2 space-y-1">
                    {completionMissing.map((item) => <li key={item}>• {item}</li>)}
                  </ul>
                </div>
              )}
              {entry.declaredCompleteAt ? (
                <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--success)]"><CheckCircle2 size={16} aria-hidden /> Jalon déclaré terminé</p>
              ) : (
                <button type="button" onClick={declareComplete} disabled={!canDeclareComplete} aria-disabled={!canDeclareComplete} className="btn-foil mt-4 disabled:cursor-not-allowed disabled:opacity-60">Déclarer le jalon terminé <Check size={15} aria-hidden /></button>
              )}
            </div>
          )}

          {deliverable.journal && (
            <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-5">
              <p className="font-medium">Prédictions datées dans le journal de décision</p>
              <p className="mt-1 text-sm leading-relaxed text-surface-variant">
                Repère conseillé : {deliverable.journal.predictionMin} à {deliverable.journal.predictionMax} prédictions. {linkedPredictions} actuellement reliée{linkedPredictions > 1 ? 's' : ''} à ce livrable.
              </p>
              <Link to={`/journal?sourceType=deliverable&sourceId=${encodeURIComponent(deliverable.id)}`} className="btn-ghost mt-4">Ouvrir le journal prérempli <ArrowRight size={15} aria-hidden /></Link>
            </div>
          )}
        </div>
      )}

      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </section>
  );
}

function RubricReference({ deliverable, criteria }: { deliverable: Deliverable; criteria: DeliverableCriterion[] }) {
  return (
    <aside id="grille-revue" className="mt-12 scroll-mt-24 rounded-2xl border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6 sm:p-7" aria-labelledby="rubric-title">
      <p className="eyebrow flex items-center gap-2"><CheckCircle2 size={14} aria-hidden /> Grille de revue</p>
      <h2 id="rubric-title" className="mt-2 font-headline text-headline-lg font-semibold">Critères observables</h2>
      {deliverable.rubricLevels && deliverable.rubricLevels.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Niveaux de la grille">
          {deliverable.rubricLevels.map((level) => <li key={level.id} className="chip" title={level.description}>{level.label}</li>)}
        </ul>
      )}
      <div className="mt-6 space-y-4">
        {criteria.map((criterion, index) => (
          <details key={criterionId(criterion, index)} className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
            <summary className="cursor-pointer font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--primary)]">{criterion.criterion}</summary>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div><dt className="font-medium">Description observable</dt><dd className="mt-1 leading-relaxed text-surface-variant">{criterion.description ?? criterion.check}</dd></div>
              {criterion.expectedEvidence && <div><dt className="font-medium">Exemple de preuve attendue</dt><dd className="mt-1 leading-relaxed text-surface-variant">{criterion.expectedEvidence}</dd></div>}
              {criterion.commonError && <div><dt className="font-medium">Erreur fréquente</dt><dd className="mt-1 leading-relaxed text-surface-variant">{criterion.commonError}</dd></div>}
              {criterion.revisionQuestion && <div><dt className="font-medium">Question de révision</dt><dd className="mt-1 leading-relaxed text-surface-variant">{criterion.revisionQuestion}</dd></div>}
            </dl>
          </details>
        ))}
      </div>
    </aside>
  );
}
