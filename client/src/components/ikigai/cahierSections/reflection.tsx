import { useEffect, useState } from 'react';
import { Check, Save } from 'lucide-react';
import { IKIGAI } from '@/content';
import type { IkigaiMode } from '@/content/types';
import { useUserData } from '@/context/UserDataContext';
import {
  IKIGAI_STORAGE_LIMITS,
  NOTE_SOURCE,
  answerKey,
  getCahierAnswers,
  setCahierAnswers,
  type CahierAnswers,
} from '@/lib/ikigaiCahier';
import { commitOnStorageSuccess } from '@/lib/storage';
import { IkigaiText } from '../IkigaiText';
import { StickyChapterHeader } from '../cahierUi';

// ── §05 — Cahier d'introspection (7 free-text questions) ──────────────────────
export function ReflectionSection({ mode, onMode }: { mode: IkigaiMode; onMode: (m: IkigaiMode) => void }) {
  const { addNote, deleteNote, notes } = useUserData();

  const [answers, setAnswers] = useState<CahierAnswers>(() => getCahierAnswers());
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  // Switching reading mode shows a different (unsaved) answer set, so the
  // "Enregistré" confirmation no longer applies.
  useEffect(() => {
    setSavedAt(null);
  }, [mode]);

  const questions = mode === 'decouverte' ? IKIGAI.reflection.decouverte : IKIGAI.reflection.avance;
  const update = (n: string, v: string) => {
    const next = { ...answers, [answerKey(mode, n)]: v };
    const result = setCahierAnswers(next);
    commitOnStorageSuccess(result, next, (stored) => {
      setSavedAt(null);
      setAnswers(stored);
    });
  };

  // Explicit, deliberate save: sync this mode's answers into the notes system.
  async function saveToCarnet() {
    setBusy(true);
    try {
      for (const q of questions) {
        const sourceId = answerKey(mode, q.n);
        const value = (answers[sourceId] ?? '').trim();
        // Replace any previous note for this question to avoid duplicates.
        const existing = notes.filter((nt) => nt.sourceType === NOTE_SOURCE && nt.sourceId === sourceId);
        for (const ex of existing) {
          const result = await deleteNote(ex.id);
          if (!result.ok) return;
        }
        if (value) {
          const result = await addNote({
            kind: 'note',
            body: value,
            sourceType: NOTE_SOURCE,
            sourceId,
            sourceTitle: `Cahier Ikigai · Question ${q.n}`,
          });
          if (!result.ok) return;
        }
      }
      setSavedAt(Date.now());
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="ikigai-section-questions" className="scroll-mt-24 lg:scroll-mt-16">
      <StickyChapterHeader
        n="05"
        label="cahier d'introspection"
        mode={mode}
        onMode={onMode}
        title="Sept questions, à vous poser sincèrement."
        description={
          <>
            Prenez votre temps. Vos réponses restent <strong className="font-semibold text-foreground">sur cet appareil</strong> et
            ne sont envoyées nulle part tant que vous ne les enregistrez pas dans votre carnet. L'honnêteté compte plus que
            la brièveté.
          </>
        }
      />

      <div className="mt-8 space-y-4">
        {questions.map((q) => (
          <div key={q.n} className="premium-card p-6">
            <div className="flex items-start gap-4">
              <span className="shrink-0 font-headline text-2xl italic text-[color:var(--primary)]">{q.n}</span>
              <div className="flex-1">
                <p className="font-headline text-headline-sm font-medium leading-snug">
                  <IkigaiText text={q.q} mode={mode} />
                </p>
                <p className="mt-2 font-headline text-sm italic leading-relaxed text-surface-variant">
                  ⸺ <IkigaiText text={q.hint} mode={mode} />
                </p>
                <textarea
                  value={answers[answerKey(mode, q.n)] ?? ''}
                  onChange={(e) => update(q.n, e.target.value)}
                  placeholder="Vos notes…"
                  rows={3}
                  maxLength={IKIGAI_STORAGE_LIMITS.freeText}
                  aria-label={`Réponse à la question ${q.n}`}
                  className="mt-4 w-full resize-y rounded-xl border border-outline-variant bg-surface-container-low/60 p-3 text-sm outline-none transition-colors placeholder:italic placeholder:text-surface-variant focus:border-[color:var(--primary)]"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-outline-variant bg-surface-container-low/60 p-5 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-surface-variant">
          Vos brouillons sont conservés localement sur cet appareil.
        </p>
        <div className="flex items-center gap-2">
          <button onClick={saveToCarnet} disabled={busy} className="btn-foil !py-2.5 disabled:opacity-50">
            {savedAt ? <Check size={15} /> : <Save size={15} />}
            {savedAt ? 'Enregistré' : 'Enregistrer dans mon carnet'}
          </button>
        </div>
      </div>
    </section>
  );
}
