import { useId, useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import type { QuizQuestion } from '@/content/types';

export function QuizBlock({ quiz }: { quiz: QuizQuestion[] }) {
  const baseId = useId();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [validated, setValidated] = useState<Record<number, boolean>>({});

  const validatedCount = Object.keys(validated).filter((k) => validated[Number(k)]).length;
  const correctCount = quiz.reduce((acc, q, qi) => {
    const chosen = answers[qi];
    const isVal = validated[qi] === true;
    return acc + (isVal && chosen != null && q.options[chosen]?.correct ? 1 : 0);
  }, 0);

  return (
    <section className="rounded-2xl border border-outline-variant bg-surface-container-low p-6 sm:p-8">
      <div className="mb-6 flex items-center gap-2.5">
        <HelpCircle size={18} className="text-[color:var(--primary)]" />
        <h3 className="font-headline text-headline-sm font-semibold">Vérifiez votre compréhension</h3>
      </div>

      <div className="space-y-7">
        {quiz.map((q, qi) => {
          const questionId = `${baseId}-${qi}`;
          const legendId = `${questionId}-legend`;
          const resultId = `${questionId}-result`;
          const chosen = answers[qi];
          const answered = validated[qi] === true;
          const hasChosen = chosen != null;
          return (
            <fieldset key={qi} className="min-w-0">
              <legend id={legendId} className="font-medium">{q.question}</legend>
              <div role="radiogroup" aria-labelledby={legendId} aria-describedby={answered ? resultId : undefined} className="mt-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const state = !answered
                    ? (isChosen ? 'selected' : 'idle')
                    : (opt.correct ? 'correct' : isChosen ? 'wrong' : 'muted');
                  return (
                    <label
                      key={oi}
                      className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                        state === 'idle'
                          ? 'border-outline-variant hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-lowest'
                          : state === 'selected'
                            ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
                            : state === 'correct'
                              ? 'border-[color-mix(in_srgb,var(--success)_60%,transparent)] bg-[color-mix(in_srgb,var(--success)_10%,transparent)]'
                              : state === 'wrong'
                                ? 'border-[color-mix(in_srgb,var(--error)_60%,transparent)] bg-[color-mix(in_srgb,var(--error)_10%,transparent)]'
                                : 'border-outline-variant opacity-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={questionId}
                        value={oi}
                        checked={isChosen}
                        disabled={answered}
                        onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                        className="sr-only"
                      />
                      <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border text-[0.625rem] ${
                        state === 'correct'
                          ? 'border-success text-success'
                          : state === 'wrong'
                            ? 'border-error text-error'
                            : state === 'selected'
                              ? 'border-[color:var(--primary)] text-[color:var(--primary)]'
                              : 'border-outline-variant text-surface-variant'
                      }`}>
                        {state === 'correct' ? <Check size={12} /> : state === 'wrong' ? <X size={12} /> : String.fromCharCode(65 + oi)}
                      </span>
                      {opt.text}
                    </label>
                  );
                })}
              </div>
              {!answered && hasChosen && (
                <div className="mt-3">
                  <button
                    type="button"
                    aria-label="Valider la réponse"
                    onClick={() => setValidated((v) => ({ ...v, [qi]: true }))}
                    className="btn-quiet !py-2 !px-4"
                  >
                    Valider
                  </button>
                </div>
              )}
              {answered && (
                <p id={resultId} role="status" aria-live="polite" aria-label="Résultat de la question" className="mt-3 rounded-xl bg-surface-container px-4 py-3 text-sm text-surface-variant animate-fade-in">
                  <span className="font-semibold text-foreground">{q.options[chosen]?.correct ? 'Réponse correcte. ' : 'Réponse incorrecte. '}</span>
                  {q.explanation}
                </p>
              )}
            </fieldset>
          );
        })}
      </div>

      {validatedCount === quiz.length && (
        <p role="status" aria-live="polite" aria-label="Score du quiz" className="mt-6 border-t border-outline-variant pt-5 font-headline text-headline-sm">
          {correctCount} / {quiz.length} <span className="text-surface-variant text-base font-body">— {correctCount === quiz.length ? 'toutes les réponses sont correctes.' : 'consultez les explications associées aux réponses incorrectes.'}</span>
        </p>
      )}
    </section>
  );
}
