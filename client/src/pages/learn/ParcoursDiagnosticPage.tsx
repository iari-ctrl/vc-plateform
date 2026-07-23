import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Check, ClipboardCheck } from 'lucide-react';
import { deliverableById, diagnosticById, lessonById } from '@/content';
import { parcoursBySlug } from '@/content/parcours';
import type { DiagnosticResourceRef, DiagnosticResult } from '@/content/types';
import { learningWorkspace, useLearningWorkspace } from '@/lib/learningWorkspace';
import { useResourcePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';

const RESULT_LABEL: Record<DiagnosticResult, string> = {
  'a-revoir': 'À revoir',
  'acquis-a-confirmer': 'Acquis à confirmer',
  'point-maitrise': 'Point maîtrisé',
};

function resourceHref(ref: DiagnosticResourceRef): string | null {
  if (ref.kind === 'lesson') {
    const lesson = lessonById(ref.id);
    return lesson ? `/lessons/${lesson.slug}` : null;
  }
  if (ref.kind === 'deliverable') {
    const deliverable = deliverableById(ref.id);
    return deliverable ? `/livrables/${deliverable.slug}` : null;
  }
  return null;
}

export default function ParcoursDiagnosticPage() {
  const { slug } = useParams();
  const parcours = slug ? parcoursBySlug(slug) : undefined;
  const diagnostic = parcours?.entryDiagnosticId ? diagnosticById(parcours.entryDiagnosticId) : undefined;
  const workspace = useLearningWorkspace();
  const [announcement, setAnnouncement] = useState('');

  useResourcePageMeta(Boolean(parcours && diagnostic), diagnostic?.title, diagnostic?.summary, {
    noindex: true,
    canonical: false,
  });
  if (!parcours || !diagnostic) return <NotFoundPage />;

  const answers = workspace.diagnostics[diagnostic.id]?.answers ?? {};
  const complete = diagnostic.items.every((item) => Boolean(answers[item.id]));
  const diagnosticId = diagnostic.id;

  function choose(itemId: string, optionId: string) {
    const result = learningWorkspace.saveDiagnosticAnswer(diagnosticId, itemId, optionId);
    setAnnouncement(result.ok ? 'Réponse enregistrée sur cet appareil.' : 'La réponse n’a pas pu être enregistrée.');
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <Link to={`/parcours/${parcours.slug}`} className="btn-quiet mb-6 -ml-3">
        <ArrowLeft size={15} aria-hidden /> {parcours.title}
      </Link>

      <header className="border-b border-outline-variant pb-8">
        <p className="eyebrow flex items-center gap-2"><ClipboardCheck size={14} aria-hidden /> Diagnostic facultatif</p>
        <h1 className="mt-3 font-headline text-display-sm font-semibold leading-tight tracking-tight text-balance">{diagnostic.title}</h1>
        <p className="mt-4 max-w-2xl text-[1.0625rem] leading-relaxed text-surface-variant">{diagnostic.summary}</p>
        <p className="mt-4 rounded-xl border border-outline-variant bg-surface-container-low p-4 text-sm leading-relaxed text-surface-variant">
          Ce diagnostic est sans note et sans effet sur votre progression. Chaque réponse donne un repère et des ressources à consulter.
        </p>
      </header>

      <div className="mt-8 space-y-6">
        {diagnostic.items.map((item, index) => {
          const selectedId = answers[item.id];
          const selected = item.options.find((option) => option.id === selectedId);
          return (
            <fieldset key={item.id} className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-5 sm:p-6">
              <legend className="w-full px-1 font-headline text-headline-sm font-semibold">
                <span className="mr-2 font-mono text-xs text-surface-variant">{String(index + 1).padStart(2, '0')}</span>
                {item.topic}
              </legend>
              <p className="mt-3 text-sm leading-relaxed text-surface-variant">{item.prompt}</p>
              <div className="mt-4 space-y-2">
                {item.options.map((option) => (
                  <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-outline-variant px-4 py-3 text-sm transition-colors has-[:checked]:border-[color:var(--primary)] has-[:checked]:bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] focus-within:ring-2 focus-within:ring-[color:var(--primary)] focus-within:ring-offset-2">
                    <input
                      type="radio"
                      name={`diagnostic-${item.id}`}
                      value={option.id}
                      checked={selectedId === option.id}
                      onChange={() => choose(item.id, option.id)}
                      className="mt-0.5 accent-[color:var(--primary)]"
                    />
                    <span className="leading-relaxed">{option.label}</span>
                  </label>
                ))}
              </div>

              {selected && (
                <div className="mt-5 border-t border-outline-variant pt-4" role="status">
                  <p className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Check size={15} className="text-[color:var(--primary)]" aria-hidden /> {RESULT_LABEL[selected.result]}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-surface-variant">{selected.feedback}</p>
                  {item.resourceRefs.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs font-medium text-surface-variant">Ressources conseillées</p>
                      <ul className="mt-2 space-y-2">
                        {item.resourceRefs.map((ref) => {
                          const href = resourceHref(ref);
                          return href ? (
                            <li key={`${ref.kind}-${ref.id}`}>
                              <Link to={href} className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--primary)] underline decoration-dotted underline-offset-4">
                                <BookOpen size={14} aria-hidden /> {ref.label}
                              </Link>
                            </li>
                          ) : null;
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </fieldset>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite" aria-atomic="true">{announcement}</p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-outline-variant bg-surface-container-low p-5">
        <p className="text-sm text-surface-variant">
          {complete ? 'Vos 5 repères sont enregistrés sur cet appareil.' : 'Vous pouvez quitter ce diagnostic et y revenir plus tard.'}
        </p>
        <Link to={`/parcours/${parcours.slug}`} className="btn-foil">
          Revenir au parcours <ArrowRight size={15} aria-hidden />
        </Link>
      </div>
    </div>
  );
}
