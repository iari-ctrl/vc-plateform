import { useEffect, useId, useRef, useState } from 'react';
import { Check, X, HelpCircle } from 'lucide-react';
import type { QuizQuestion } from '@/content/types';

function optionMarker(index: number) {
  return String.fromCharCode(65 + index);
}

export function QuizBlock({ quiz }: { quiz: QuizQuestion[] }) {
  const baseId = useId();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const focusAfterChoiceRef = useRef(false);
  const questionTitleRef = useRef<HTMLHeadingElement | null>(null);
  const scoreRef = useRef<HTMLParagraphElement | null>(null);

  useEffect(() => {
    setAnswers({});
    setCurrentIndex(0);
    setCompleted(false);
    focusAfterChoiceRef.current = false;
  }, [quiz]);

  useEffect(() => {
    if (!focusAfterChoiceRef.current) return;
    const target = completed ? scoreRef.current : questionTitleRef.current;
    target?.focus();
    focusAfterChoiceRef.current = false;
  }, [completed, currentIndex]);

  if (quiz.length === 0) return null;

  const activeIndex = Math.min(currentIndex, quiz.length - 1);
  const activeQuestion = quiz[activeIndex];
  const answeredCount = Object.keys(answers).length;
  const progressValue = completed ? 100 : Math.round((answeredCount / quiz.length) * 100);
  const correctCount = quiz.reduce((acc, question, questionIndex) => {
    const chosen = answers[questionIndex];
    return acc + (chosen != null && question.options[chosen]?.correct ? 1 : 0);
  }, 0);

  const titleId = `${baseId}-title`;
  const progressId = `${baseId}-progress`;
  const questionTitleId = `${baseId}-${activeIndex}-question`;

  function choose(optionIndex: number) {
    setAnswers((currentAnswers) => ({ ...currentAnswers, [activeIndex]: optionIndex }));
    focusAfterChoiceRef.current = true;

    if (activeIndex >= quiz.length - 1) {
      setCompleted(true);
      return;
    }

    setCurrentIndex(activeIndex + 1);
  }

  return (
    <section aria-labelledby={titleId} className="rounded-2xl border border-outline-variant bg-surface-container-low p-6 sm:p-8">
      <div className="mb-5 flex items-start gap-2.5">
        <HelpCircle size={18} aria-hidden className="mt-1 text-[color:var(--primary)]" />
        <div className="min-w-0 flex-1">
          <h3 id={titleId} className="font-headline text-headline-sm font-semibold">Vérifiez votre compréhension</h3>
          <p id={progressId} className="mt-1 text-sm text-surface-variant">
            {completed ? 'Quiz terminé' : `Question ${activeIndex + 1} / ${quiz.length}`}
          </p>
          <div
            role="progressbar"
            aria-label="Progression du quiz"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progressValue}
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-container"
          >
            <div className="h-full rounded-full bg-[color:var(--primary)] transition-[width] duration-300" style={{ width: `${progressValue}%` }} />
          </div>
        </div>
      </div>

      {!completed ? (
        <div role="group" aria-labelledby={questionTitleId} aria-describedby={progressId} className="animate-fade-in">
          <h4
            id={questionTitleId}
            ref={questionTitleRef}
            tabIndex={-1}
            className="font-medium outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
          >
            {activeQuestion.question}
          </h4>
          <div className="mt-4 grid gap-2.5">
            {activeQuestion.options.map((option, optionIndex) => (
              <button
                key={optionIndex}
                type="button"
                onClick={() => choose(optionIndex)}
                className="group flex w-full items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-left text-sm transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
              >
                <span aria-hidden className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-outline-variant text-[0.625rem] text-surface-variant transition-colors group-hover:border-[color:var(--primary)] group-hover:text-[color:var(--primary)]">
                  {optionMarker(optionIndex)}
                </span>
                <span>{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <p
            ref={scoreRef}
            role="status"
            tabIndex={-1}
            aria-live="polite"
            aria-label="Score du quiz"
            className="rounded-xl border border-outline-variant bg-surface-container px-4 py-3 font-headline text-headline-sm outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-surface-container-low"
          >
            {correctCount} / {quiz.length}{' '}
            <span className="text-base font-body text-surface-variant">
              — {correctCount === quiz.length ? 'toutes les réponses sont correctes.' : 'consultez le corrigé si nécessaire.'}
            </span>
          </p>
          <details className="mt-4 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm">
            <summary className="cursor-pointer font-medium text-foreground">Voir le corrigé détaillé</summary>
            <ol className="mt-4 space-y-4">
              {quiz.map((question, questionIndex) => {
                const chosen = answers[questionIndex];
                const chosenOption = chosen != null ? question.options[chosen] : undefined;
                const isCorrect = chosenOption?.correct === true;

                return (
                  <li key={questionIndex} className="min-w-0 rounded-xl bg-surface-container px-4 py-3">
                    <p className="font-medium text-foreground">Question {questionIndex + 1}. {question.question}</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-surface-variant">
                      {isCorrect ? <Check size={14} aria-hidden className="text-success" /> : <X size={14} aria-hidden className="text-error" />}
                      <span className="font-semibold text-foreground">{isCorrect ? 'Réponse correcte.' : 'Réponse incorrecte.'}</span>
                      <span>{chosenOption ? chosenOption.text : 'Aucune réponse enregistrée.'}</span>
                    </p>
                    <p className="mt-2 text-sm text-surface-variant">{question.explanation}</p>
                  </li>
                );
              })}
            </ol>
          </details>
        </div>
      )}
    </section>
  );
}
