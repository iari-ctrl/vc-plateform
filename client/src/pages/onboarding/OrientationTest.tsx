import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { IKIGAI } from '@/content';
import { useNavigate } from 'react-router-dom';
import { ProgressBar } from '@/components/ui/primitives';
import { useUserData } from '@/context/UserDataContext';
import { computeProfile, suggestedArchetype, type OnboardingAnswer } from '@/lib/ikigai';
import { archiveProfile } from '@/lib/ikigaiCahier';

// ── Orientation test (scored MCQ → learning profile) ─────────────────────────
export function OrientationTest({
  onBack,
  chosenArchetype,
  onSuggestArchetype,
}: {
  onBack: () => void;
  chosenArchetype: string | null;
  onSuggestArchetype: (id: string | null) => void;
}) {
  const navigate = useNavigate();
  const { profile: savedProfile, saveProfile } = useUserData();
  const [params, setParams] = useSearchParams();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const questions = IKIGAI.questions;
  const last = questions.length - 1;
  const step = Math.min(Math.max(Number.parseInt(params.get('q') ?? '0', 10) || 0, 0), last);
  const q = questions[step];

  const goToStep = (n: number) =>
    setParams((p) => {
      p.set('q', String(Math.min(Math.max(n, 0), last)));
      return p;
    });

  // Record the answer only — advancing is now an explicit action (Suivant /
  // Voir mon résultat), so a mis-tap no longer skips a question.
  function choose(optionIndex: number) {
    setAnswers((cur) => ({ ...cur, [q.n]: optionIndex }));
  }

  function finish(finalAnswers: Record<string, number>) {
    const list: OnboardingAnswer[] = Object.entries(finalAnswers).map(([questionN, optionIndex]) => ({ questionN, optionIndex }));
    const result = computeProfile(list);
    if (!result) return;
    // Keep the previous result as history before overwriting it.
    archiveProfile(savedProfile);
    void saveProfile({ profileType: result.top.id, timeBudget: result.timeBudget, scores: result.scores });
    // If the cahier doesn't have a chosen archetype yet, suggest one from the profile.
    if (!chosenArchetype) {
      const suggestion = suggestedArchetype(result.top.id);
      if (suggestion) onSuggestArchetype(suggestion.id);
    }
    navigate('/profile-result', { state: { profileId: result.top.id, scores: result.scores, timeBudget: result.timeBudget } });
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-xs text-surface-variant">
          <span className="font-mono">Question {step + 1} / {questions.length}</span>
          <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
        </div>
        <ProgressBar value={((step + (answers[q.n] != null ? 1 : 0)) / questions.length) * 100} />
      </div>

      <div key={q.n} className="animate-fade-up">
        <p className="eyebrow mb-2">{q.hint}</p>
        <h2 className="font-headline text-headline-lg font-semibold leading-tight text-balance">{q.q}</h2>

        <div className="mt-7 space-y-3">
          {q.options.map((opt, i) => {
            const selected = answers[q.n] === i;
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                className={`flex w-full items-center gap-4 rounded-xl border px-5 py-4 text-left transition-all ${
                  selected
                    ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
                    : 'border-outline-variant hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low'
                }`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-xs ${selected ? 'border-[color:var(--primary)] text-[color:var(--primary)]' : 'border-outline-variant text-surface-variant'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-[0.95rem] leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button onClick={() => (step === 0 ? onBack() : goToStep(step - 1))} className="btn-quiet">
          <ArrowLeft size={15} /> {step === 0 ? 'Retour au cahier' : 'Précédent'}
        </button>
        {answers[q.n] != null &&
          (step < last ? (
            <button onClick={() => goToStep(step + 1)} className="btn-ghost">
              Suivant <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={() => finish(answers)} className="btn-foil">
              Voir mon résultat <ArrowRight size={15} />
            </button>
          ))}
      </div>
    </div>
  );
}
