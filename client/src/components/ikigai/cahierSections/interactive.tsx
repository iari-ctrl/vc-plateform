import { useEffect, useState } from 'react';
import { SCENARIOS } from './scenarios';

export function InteractifIntrospectionView({
  onSelectDimension,
}: {
  onSelectDimension: (id: string | null) => void;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [validatedSteps, setValidatedSteps] = useState<Record<number, boolean>>({});
  const q = SCENARIOS[activeStep];

  useEffect(() => {
    // Highlight the dimension corresponding to the active step
    onSelectDimension(SCENARIOS[activeStep].dimensionId);
  }, [activeStep, onSelectDimension]);

  const selectOption = (idx: number) => {
    if (!hasAnswered) {
      setAnswers((cur) => ({ ...cur, [activeStep]: idx }));
    }
  };

  const hasAnswered = validatedSteps[activeStep] === true;
  const hasSelected = answers[activeStep] !== undefined;

  return (
    <div className="space-y-6 lg:w-[52%] animate-fade-in">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between text-xs text-surface-variant font-mono">
          <span>Dilemme {activeStep + 1} / {SCENARIOS.length}</span>
          <span>{SCENARIOS[activeStep].dimensionId.toUpperCase()}</span>
        </div>
        <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
          <div
            className="h-full bg-[color:var(--primary)] transition-all duration-300"
            style={{ width: `${((activeStep + (hasAnswered ? 1 : 0)) / SCENARIOS.length) * 100}%` }}
          />
        </div>
      </div>

      <div key={activeStep} className="animate-fade-up">
        <p className="eyebrow mb-2">{q.hint}</p>
        <h3 className="font-headline text-headline-lg font-semibold leading-tight text-balance">
          {q.q}
        </h3>

        <div className="mt-6 space-y-3">
          {q.options.map((opt, i) => {
            const selected = answers[activeStep] === i;
            return (
              <button
                key={i}
                onClick={() => selectOption(i)}
                disabled={hasAnswered}
                className={`flex w-full items-start gap-4 rounded-xl border p-4 text-left transition-all ${
                  selected
                    ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)]'
                    : hasAnswered
                      ? 'border-outline-variant opacity-60'
                      : 'border-outline-variant hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low'
                }`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[0.65rem] mt-0.5 ${selected ? 'border-[color:var(--primary)] text-[color:var(--primary)]' : 'border-outline-variant text-surface-variant'}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm leading-snug">{opt.text}</span>
              </button>
            );
          })}
        </div>

        {!hasAnswered && hasSelected && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setValidatedSteps((v) => ({ ...v, [activeStep]: true }))}
              className="btn-quiet !py-2 !px-4"
            >
              Valider
            </button>
          </div>
        )}

        {hasAnswered && (
          <div className="mt-6 animate-fade-in rounded-xl border border-outline-variant bg-surface-container-low/60 p-4 space-y-2">
            <p className="text-xs font-mono uppercase tracking-wider text-[color:var(--primary)]">
              Analyse de choix : {q.options[answers[activeStep]].profile}
            </p>
            <p className="text-xs text-surface-variant leading-relaxed">
              {q.options[answers[activeStep]].explanation}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between border-t border-outline-variant pt-4">
        <button
          onClick={() => {
            if (activeStep > 0) {
              const prevStep = activeStep - 1;
              setActiveStep(prevStep);
              setValidatedSteps((v) => ({ ...v, [prevStep]: false }));
            }
          }}
          disabled={activeStep === 0}
          className="btn-quiet disabled:opacity-30"
        >
          Précédent
        </button>
        {hasAnswered && activeStep < SCENARIOS.length - 1 ? (
          <button onClick={() => setActiveStep(activeStep + 1)} className="btn-ghost">
            Suivant
          </button>
        ) : hasAnswered && activeStep === SCENARIOS.length - 1 ? (
          <div className="text-xs text-surface-variant self-center italic">
            Dilemmes terminés. Passez au test d'orientation ci-dessous pour finaliser votre profil.
          </div>
        ) : null}
      </div>
    </div>
  );
}
