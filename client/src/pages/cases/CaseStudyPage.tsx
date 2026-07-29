import { useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, ChevronDown, Clock, Download, FileText, HelpCircle, Sparkles } from 'lucide-react';
import { publicAssetUrl } from '@shared/base-url.mjs';
import { caseBySlug } from '@/content';
import { DELIVERABLES } from '@/content/deliverables';
import { parcoursContextForStep, parcoursContextHref, parcoursForCase } from '@/content/parcours';
import { learningWorkspace, useLearningWorkspace, isLearningActivityComplete } from '@/lib/learningWorkspace';
import { parcoursStepNavigation } from '@/lib/parcoursProgress';
import type { CaseStudyNumericScenario, CaseStudyTable } from '@/content/types';
import { ActiveProse } from '@/components/reading/ActiveProse';
import { GlossaryRefList } from '@/components/cards';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { Markdown } from '@/lib/markdown';
import { downloadMarkdown } from '@/lib/downloads';
import {
  SERIE_A_WATERFALL_NOTES,
  buildSerieACapTableExportRows,
  buildSerieAOfferExportRows,
  buildSerieAOfferMarkdownTable,
  buildSerieAWaterfallExportRows,
} from '@/lib/serieA/altosuite';
import { useResourcePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';
import { CASE_KIND_LABEL } from '@/content/labels';

function DataTable({ table }: { table: CaseStudyTable }) {
  return (
    <div className="mt-5 overflow-x-auto rounded-xl border border-outline-variant">
      <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
        <caption className="border-b border-outline-variant bg-surface-container-low px-4 py-3 text-left font-medium text-foreground">
          {table.caption}
        </caption>
        <thead>
          <tr className="bg-surface-container-low/60">
            {table.columns.map((column) => (
              <th key={column} scope="col" className="border-b border-outline-variant px-4 py-3 text-xs font-semibold uppercase tracking-wide text-surface-variant">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b border-outline-variant/70 last:border-b-0">
              {row.map((cell, cellIndex) => cellIndex === 0 ? (
                <th key={cellIndex} scope="row" className="whitespace-nowrap px-4 py-3 font-medium text-foreground">
                  {cell ?? '—'}
                </th>
              ) : (
                <td key={cellIndex} className="whitespace-nowrap px-4 py-3 text-surface-variant">
                  {cell ?? '—'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.notes && table.notes.length > 0 && (
        <ul className="space-y-1 border-t border-outline-variant bg-surface-container-low/40 px-4 py-3 text-xs text-surface-variant">
          {table.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      )}
    </div>
  );
}

function amountM(value: number): string {
  return value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function shares(value: number): string {
  return Math.round(value).toLocaleString('fr-FR');
}

function NumericScenarioTable({ scenario }: { scenario: CaseStudyNumericScenario }) {
  const capTableRows = buildSerieACapTableExportRows(scenario);
  const rows = buildSerieAOfferExportRows(scenario);
  const waterfallRows = buildSerieAWaterfallExportRows(scenario);
  return (
    <section className="mt-12" aria-labelledby="numeric-scenario-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Contrat numérique</p>
          <h2 id="numeric-scenario-title" className="mt-2 font-headline text-headline-lg font-semibold">{scenario.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-variant">{scenario.summary}</p>
        </div>
        <button
          type="button"
          onClick={() => downloadMarkdown(`${scenario.title} AltoSuite`, buildSerieAOfferMarkdownTable(scenario))}
          className="btn-ghost"
        >
          <Download size={15} aria-hidden /> Exporter les tableaux
        </button>
      </div>
      <ul className="mt-4 space-y-1 rounded-xl border border-outline-variant bg-surface-container-low p-4 text-xs leading-relaxed text-surface-variant">
        {scenario.conventions.map((convention) => <li key={convention}>• {convention}</li>)}
      </ul>
      <h3 id="numeric-scenario-captable-title" className="mt-8 font-headline text-headline-sm font-semibold">Cap table pédagogique fully diluted</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-variant">
        Réconciliation pédagogique des actions avant et après tour. Elle distingue les lignes économiques utiles au cas, sans constituer une cap table juridique complète.
      </p>
      <div data-scroll-region="numeric-scenario-captable" className="mt-4 overflow-x-auto rounded-2xl border border-outline-variant">
        <table className="w-full min-w-[48rem] text-sm">
          <caption className="sr-only">Cap table pédagogique fully diluted</caption>
          <thead className="bg-surface-container text-left text-xs text-surface-variant">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">Offre</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Ligne</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Actions avant</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Actions après</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Part avant</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Part après</th>
            </tr>
          </thead>
          <tbody>
            {capTableRows.map((row, index) => (
              <tr
                key={`${row.offre}-${row.ligne}`}
                className={index > 0 && capTableRows[index - 1].offre !== row.offre
                  ? 'border-t-2 border-outline-variant'
                  : 'border-t border-outline-variant'}
              >
                <th scope="row" className="px-4 py-2.5 text-left font-medium">{row.offre} · {row.ligne}</th>
                <td className="px-4 py-2.5 text-surface-variant">{row.ligne}</td>
                <td className="px-4 py-2.5 font-mono">{shares(row.actionsBefore)}</td>
                <td className="px-4 py-2.5 font-mono">{shares(row.actionsAfter)}</td>
                <td className="px-4 py-2.5 font-mono">{row.partBeforePct.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %</td>
                <td className="px-4 py-2.5 font-mono">{row.partAfterPct.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div data-scroll-region="numeric-scenario-table" className="mt-5 overflow-x-auto rounded-2xl border border-outline-variant">
        <table className="w-full min-w-[54rem] text-sm">
          <caption className="sr-only">Comparaison exportable des offres Série A AltoSuite</caption>
          <thead className="bg-surface-container text-left text-xs text-surface-variant">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">Offre</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Primaire</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Secondaire</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Pre-money</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Post-money</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Pool</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Investisseur Série A</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Fondateurs</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.offre} className="border-t border-outline-variant">
                <th scope="row" className="px-4 py-2.5 text-left font-medium">{row.offre}</th>
                <td className="px-4 py-2.5">{row.primaireM} M€</td>
                <td className="px-4 py-2.5">{row.secondaireM} M€</td>
                <td className="px-4 py-2.5">{row.preMoneyM} M€</td>
                <td className="px-4 py-2.5">{row.postMoneyM} M€</td>
                <td className="px-4 py-2.5 text-surface-variant">{row.pool}</td>
                <td className="px-4 py-2.5 font-mono">{row.investisseurSerieAPct.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %</td>
                <td className="px-4 py-2.5 font-mono">{row.fondateursPct.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 id="numeric-scenario-waterfall-title" className="mt-8 font-headline text-headline-sm font-semibold">Répartition à la sortie</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-variant">
        Produit de cession réparti entre l’investisseur Série A et les autres détenteurs modélisés, selon que la préférence
        de liquidation est exercée ou convertie.
      </p>
      <div data-scroll-region="numeric-scenario-waterfall" className="mt-4 overflow-x-auto rounded-2xl border border-outline-variant">
        <table className="w-full min-w-[46rem] text-sm">
          <caption className="sr-only">Répartition du produit de cession par offre et par valeur de sortie</caption>
          <thead className="bg-surface-container text-left text-xs text-surface-variant">
            <tr>
              <th scope="col" className="px-4 py-2.5 font-medium">Offre</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Sortie</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Investisseur</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Autres détenteurs modélisés</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Part investisseur</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Multiple brut</th>
              <th scope="col" className="px-4 py-2.5 font-medium">Exercice</th>
            </tr>
          </thead>
          <tbody>
            {waterfallRows.map((row, index) => (
              <tr
                key={`${row.offre}-${row.sortieM}`}
                className={index > 0 && waterfallRows[index - 1].offre !== row.offre
                  ? 'border-t-2 border-outline-variant'
                  : 'border-t border-outline-variant'}
              >
                <th scope="row" className="px-4 py-2.5 text-left font-medium">{row.offre}</th>
                <td className="px-4 py-2.5">{row.sortieM} M€</td>
                <td className="px-4 py-2.5 font-mono">{amountM(row.investisseurM)} M€</td>
                <td className="px-4 py-2.5 font-mono">{amountM(row.autresDetenteursM)} M€</td>
                <td className="px-4 py-2.5 font-mono">{row.investisseurPct.toLocaleString('fr-FR', { maximumFractionDigits: 1 })} %</td>
                <td className="px-4 py-2.5 font-mono">{amountM(row.multipleBrut)}x</td>
                <td className="px-4 py-2.5 text-surface-variant">{row.exercice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-3 space-y-1 text-xs leading-relaxed text-surface-variant">
        {SERIE_A_WATERFALL_NOTES.map((note) => <li key={note}>• {note}</li>)}
      </ul>
    </section>
  );
}
export default function CaseStudyPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const cs = slug ? caseBySlug(slug) : undefined;
  const workspace = useLearningWorkspace();
  const [announcement, setAnnouncement] = useState('');
  const context = cs ? parcoursContextForStep('case', cs.id, searchParams.get('parcours'), searchParams.get('budget')) : null;
  const parcours = context?.parcours ?? (cs ? parcoursForCase(cs.id)[0] : undefined);
  useResourcePageMeta(Boolean(cs), cs?.title, cs?.summary, { type: 'article' });

  if (!cs) return <NotFoundPage />;

  const caseId = cs.id;
  const navigation = context ? parcoursStepNavigation(context.parcours, context.budget, 'case', caseId) : null;
  const completed = context ? isLearningActivityComplete(workspace, context.parcours.id, 'case', caseId) : false;
  const contextualHref = (href: string) => context ? parcoursContextHref(href, context.parcours.id, context.budget) : href;
  const parcoursHref = context ? `/parcours/${context.parcours.slug}?budget=${context.budget}` : (parcours ? `/parcours/${parcours.slug}` : '/bibliotheque');
  const correctionHref = contextualHref(`/cases/${cs.slug}/correction`);

  function completeActivity() {
    if (!context) return;
    const result = learningWorkspace.completeActivity(context.parcours.id, 'case', caseId);
    setAnnouncement(result.ok ? 'Activité effectuée.' : 'L’activité n’a pas pu être enregistrée.');
  }

  const markdown = cs.sections.map((section) => `## ${section.heading}\n\n${section.body}`).join('\n\n');
  const isLearnerDossier = cs.learningRole === 'learner-dossier';
  const hasCorrection = isLearnerDossier && DELIVERABLES.some(
    (candidate) => candidate.caseStudyId === cs.id && Boolean(candidate.correctionId),
  );

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <Link to={parcoursHref} className="btn-quiet mb-6 -ml-3">
        <ArrowLeft size={15} aria-hidden /> {parcours?.title ?? 'Études de cas'}
      </Link>

      <header className="max-w-3xl">
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="chip">{isLearnerDossier ? 'Dossier apprenant' : cs.learningRole === 'transfer' ? 'Cas de transfert' : CASE_KIND_LABEL[cs.kind] ?? cs.kind}</span>
            <span className="text-surface-variant">{cs.company} · {cs.year}</span>
          </div>
          <BookmarkButton item={{ itemType: 'case', itemId: cs.id, title: cs.title, href: `/cases/${cs.slug}` }} />
        </div>
        <h1 className="mt-4 font-headline text-display-sm font-semibold leading-[1.1] tracking-tight text-balance">{cs.title}</h1>
        <p className="mt-3 font-headline text-headline-sm italic text-surface-variant">{cs.subtitle}</p>
        <p className="mt-4 text-lg leading-relaxed text-surface-variant text-pretty">{cs.summary}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-y border-outline-variant py-3 text-sm text-surface-variant">
          <span className="inline-flex items-center gap-1.5"><Clock size={14} aria-hidden /> {cs.readMin} min de lecture</span>
          {cs.estimatedWorkMinutes && <span className="inline-flex items-center gap-1.5"><FileText size={14} aria-hidden /> {cs.estimatedWorkMinutes} min de pratique estimée</span>}
        </div>
      </header>

      {isLearnerDossier && (
        <aside className="mt-8 max-w-3xl rounded-2xl border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-5 text-sm leading-relaxed text-surface-variant">
          <p className="font-medium text-foreground">Données synthétiques pour l’instruction</p>
          <p className="mt-1">
            {hasCorrection
              ? 'Le dossier contient des éléments incomplets ou contradictoires. Consignez vos hypothèses, les informations à demander et les limites de votre conclusion avant d’ouvrir la correction commentée.'
              : 'Le dossier contient des éléments incomplets ou contradictoires. Consignez vos hypothèses, les informations à demander et les limites de votre conclusion dans le livrable associé.'}
          </p>
        </aside>
      )}

      {context && (
        <section className="mt-8 max-w-3xl rounded-2xl border border-outline-variant bg-surface-container-low/40 p-5" aria-labelledby="case-activity-title">
          <p className="eyebrow">Progression du parcours</p>
          <h2 id="case-activity-title" className="mt-2 font-headline text-headline-sm font-semibold">Instruction du cas</h2>
          <p className="mt-2 text-sm leading-relaxed text-surface-variant">Cette page ne valide rien à l’ouverture. Marquez l’activité effectuée après avoir exploité les pièces du dossier et consigné vos hypothèses.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {completed ? (
              <span className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--success)]"><CheckCircle2 size={16} aria-hidden /> Activité effectuée</span>
            ) : (
              <button type="button" onClick={completeActivity} className="btn-foil">Marquer cette activité effectuée <CheckCircle2 size={15} aria-hidden /></button>
            )}
          </div>
        </section>
      )}

      {markdown && (
        <div className="mt-8 max-w-2xl">
          <ActiveProse source={markdown} sourceType="case" sourceId={cs.id} sourceTitle={cs.title} />
        </div>
      )}

      {cs.downloads && cs.downloads.length > 0 && (
        <section className="mt-10" aria-labelledby="case-downloads-title">
          <p id="case-downloads-title" className="eyebrow mb-3 flex items-center gap-2"><Download size={14} aria-hidden /> Fichiers de travail</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {cs.downloads.map((download) => (
              <li key={download.href}>
                <a href={download.href.startsWith('/') && !download.href.startsWith('//') ? publicAssetUrl(download.href, import.meta.env.BASE_URL) : download.href} download className="group flex h-full items-start justify-between gap-4 rounded-xl border border-outline-variant p-4 transition-colors hover:border-[color:var(--primary)] hover:bg-surface-container-low">
                  <span>
                    <span className="block text-sm font-medium text-foreground">{download.label}</span>
                    {download.note && <span className="mt-1 block text-xs leading-relaxed text-surface-variant">{download.note}</span>}
                  </span>
                  <span className="chip shrink-0">{download.format ?? 'Fichier'}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {cs.documents && cs.documents.length > 0 && (
        <section className="mt-12" aria-labelledby="case-documents-title">
          <p className="eyebrow">Pièces du dossier</p>
          <h2 id="case-documents-title" className="mt-2 font-headline text-headline-lg font-semibold">Documents à instruire</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-surface-variant">Chaque pièce peut être ouverte indépendamment. Les tableaux conservent leurs en-têtes sur écran étroit grâce au défilement horizontal.</p>
          <div className="mt-5 space-y-3">
            {cs.documents.map((document, index) => (
              <details key={document.id} className="group rounded-2xl border border-outline-variant bg-surface-container-lowest open:border-[color-mix(in_srgb,var(--primary)_45%,transparent)]">
                <summary className="flex cursor-pointer list-none items-start gap-4 px-5 py-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--primary)] [&::-webkit-details-marker]:hidden">
                  <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-container font-mono text-[0.625rem] text-surface-variant">{String(index + 1).padStart(2, '0')}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-foreground">{document.title}</span>
                    {document.summary && <span className="mt-1 block text-sm leading-relaxed text-surface-variant">{document.summary}</span>}
                  </span>
                  <ChevronDown size={17} className="mt-1 shrink-0 text-surface-variant transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <div className="border-t border-outline-variant px-5 py-5">
                  {document.body && <Markdown source={document.body} className="prose-editorial" />}
                  {document.tables?.map((table) => <DataTable key={table.caption} table={table} />)}
                </div>
              </details>
            ))}
          </div>
        </section>
      )}

      {cs.numericScenario && <NumericScenarioTable scenario={cs.numericScenario} />}

      {cs.decisionQuestions && cs.decisionQuestions.length > 0 && (
        <section className="mt-12 rounded-2xl border border-outline-variant bg-surface-container-low p-6 sm:p-7" aria-labelledby="decision-questions-title">
          <p className="eyebrow flex items-center gap-2"><HelpCircle size={14} aria-hidden /> Questions d’instruction</p>
          <h2 id="decision-questions-title" className="mt-2 font-headline text-headline-md font-semibold">Points à traiter dans votre production</h2>
          <ol className="mt-4 space-y-3">
            {cs.decisionQuestions.map((question, index) => (
              <li key={question} className="flex items-start gap-3 text-sm leading-relaxed">
                <span className="font-mono text-xs text-[color:var(--primary)]">{index + 1}.</span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {!isLearnerDossier && cs.takeaways.length > 0 && (
        <aside className="mt-12 max-w-2xl rounded-2xl border border-[color-mix(in_srgb,var(--primary)_25%,transparent)] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] p-6 sm:p-7">
          <p className="eyebrow mb-4 flex items-center gap-2"><Sparkles size={14} aria-hidden /> Ce qu’il faut retenir</p>
          <ul className="space-y-3">
            {cs.takeaways.map((takeaway, index) => (
              <li key={takeaway} className="flex items-start gap-3 text-[0.95rem] font-medium">
                <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] font-mono text-[0.625rem] text-[color:var(--primary)]">{index + 1}</span>
                {takeaway}
              </li>
            ))}
          </ul>
        </aside>
      )}

      {navigation && (
        <nav className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2" aria-label="Navigation dans le parcours">
          {navigation.previous ? (
            <Link to={contextualHref(navigation.previous.href)} className="group flex min-w-0 items-center gap-3 rounded-xl border border-outline-variant px-4 py-3 transition-colors hover:bg-surface-container-low">
              <ArrowLeft size={16} className="shrink-0 text-surface-variant" aria-hidden />
              <span className="min-w-0"><span className="block text-[0.625rem] uppercase tracking-wider text-surface-variant">Précédent</span><span className="block truncate text-sm font-medium">{navigation.previous.title}</span></span>
            </Link>
          ) : <span />}
          {navigation.next && (
            <Link to={contextualHref(navigation.next.href)} className="group flex min-w-0 items-center justify-end gap-3 rounded-xl border border-outline-variant px-4 py-3 text-right transition-colors hover:bg-surface-container-low">
              <span className="min-w-0"><span className="block text-[0.625rem] uppercase tracking-wider text-surface-variant">Suivant</span><span className="block truncate text-sm font-medium">{navigation.next.title}</span></span>
              <ArrowRight size={16} className="shrink-0 text-surface-variant" aria-hidden />
            </Link>
          )}
        </nav>
      )}

      {(parcours || hasCorrection) && (
        <div className="mt-10 flex flex-wrap gap-3">
          {parcours && <Link to={parcoursHref} className="btn-foil">Poursuivre le parcours <ArrowRight size={15} aria-hidden /></Link>}
          {hasCorrection && <Link to={correctionHref} className="btn-ghost">Accéder à la correction commentée <BookOpen size={15} aria-hidden /></Link>}
        </div>
      )}

      <div className="mt-10 max-w-2xl">
        <GlossaryRefList slugs={cs.glossaryRefs} />
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>
    </article>
  );
}
