import { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing';
import { AlertTriangle, ArrowRight, Check, Save, Lock } from 'lucide-react';
import { IKIGAI, profileById } from '@/content';
import { t } from '@/content/parcours';
import type { IkigaiArchetype, IkigaiMode } from '@/content/types';
import { IkigaiText } from './IkigaiText';
import { StickyChapterHeader, StickySubsectionHeader } from './cahierUi';
import { KanjiSeal } from '@/components/ornaments/Ornaments';
import { Reveal } from '@/components/ui/primitives';
import { useUserData } from '@/context/UserDataContext';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import { useTheme } from '@/context/ThemeContext';
import { legibleAccent } from '@/lib/ikigaiColor';
import { archetypePaths } from '@/lib/ikigai';
import {
  NOTE_SOURCE,
  answerKey,
  getCahierAnswers,
  setCahierAnswers,
  type CahierAnswers,
} from '@/lib/ikigaiCahier';

const WARN = 'var(--error)';
const subsectionAnchorStyle = { scrollMarginTop: 'calc(var(--ikigai-subhead-top, 12rem) + 4rem)' };

// ── §02 — Dimensions ────────────────────────────────────────────────────────
export function DimensionsSection({
  mode,
  onMode,
  activeDim,
  onSelectDim,
}: {
  mode: IkigaiMode;
  onMode: (m: IkigaiMode) => void;
  activeDim: string | null;
  onSelectDim: (id: string) => void;
}) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <section id="ikigai-section-dimensions" className="scroll-mt-24 lg:scroll-mt-16">
      <StickyChapterHeader
        n="02"
        label="les quatre dimensions"
        mode={mode}
        onMode={onMode}
        title="Ce qu'une personne passionnée de capital-risque peut y placer."
        description="Survolez le diagramme plus haut pour naviguer — ou lisez les quatre dimensions dans l'ordre."
      />
      <div className="mt-8 divide-y divide-outline-variant lg:w-[52%]">
        {IKIGAI.dimensions.map((d, i) => {
          const items = mode === 'decouverte' ? d.itemsDecouverte ?? d.items : d.items;
          const active = activeDim === d.id;
          const accent = legibleAccent(d.accent, dark);
          return (
            <article
              key={d.id}
              id={`ikigai-dim-${d.id}`}
              className={`py-7 transition-opacity duration-500 ease-in-out ${activeDim && !active ? 'opacity-30' : 'opacity-100'} hover:opacity-100`}
              style={subsectionAnchorStyle}
            >
              <StickySubsectionHeader>
                <button
                  type="button"
                  onClick={() => onSelectDim(d.id)}
                  aria-pressed={active}
                  className="group flex w-full items-center gap-3 text-left"
                >
                  <div className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-xs" style={{ color: active ? accent : 'var(--primary)' }}>
                      {['I', 'II', 'III', 'IV'][i]}.
                    </span>
                    <h3 className="font-headline text-headline-md font-semibold transition-colors" style={active ? { color: accent } : undefined}>
                      {d.label}
                    </h3>
                    <span className="font-headline text-lg italic" style={{ color: accent }}>
                      {d.kanji}
                    </span>
                  </div>
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-surface-variant transition-colors group-hover:text-foreground"
                    style={active ? { color: accent } : undefined}
                  />
                </button>
              </StickySubsectionHeader>
              <Reveal className="mt-3">
                <ul className="max-w-2xl space-y-2.5">
                  {items.map((it, idx) => (
                    <li key={idx} className="flex gap-2.5 leading-relaxed text-surface-variant">
                      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: accent }} />
                      <span>
                        <IkigaiText text={it} mode={mode} />
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ── §03 — Intersections ─────────────────────────────────────────────────────
export function IntersectionsSection({
  mode,
  onMode,
  activeId,
}: {
  mode: IkigaiMode;
  onMode: (m: IkigaiMode) => void;
  activeId: string | null;
}) {
  return (
    <section id="ikigai-section-intersections" className="scroll-mt-24 lg:scroll-mt-16">
      <StickyChapterHeader
        n="03"
        label="les quatre demi-chemins"
        mode={mode}
        onMode={onMode}
        title="Quatre demi-chemins, et leur zone d'ombre."
        description="Chaque intersection est une combinaison séduisante mais incomplète : elle ressemble à l'ikigai vue de loin, et s'en éloigne dès qu'on la regarde de près."
      />
      <div className="mt-8 divide-y divide-outline-variant lg:w-[52%]">
        {IKIGAI.intersections.map((it, i) => {
          const example = mode === 'decouverte' ? it.exampleDecouverte ?? it.example : it.example;
          const active = activeId === it.id;
          return (
            <article
              key={it.id}
              id={`ikigai-inter-${it.id}`}
              className={`py-7 transition-opacity duration-500 ease-in-out ${activeId && !active ? 'opacity-30' : 'opacity-100'} hover:opacity-100`}
              style={subsectionAnchorStyle}
            >
              <StickySubsectionHeader>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-[color:var(--primary)]">{['I', 'II', 'III', 'IV'][i]}.</span>
                  <h3 className={`font-headline text-headline-md font-semibold transition-colors duration-500 ${active ? 'text-[color:var(--primary)]' : ''}`}>{it.label}</h3>
                  <span className={`font-headline text-sm italic transition-colors duration-500 ${active ? 'text-[color:var(--primary)]/80' : 'text-surface-variant'}`}>{it.subtitle}</span>
                </div>
                <p className={`eyebrow mt-1.5 !tracking-[0.16em] normal-case transition-colors duration-500 ${active ? 'text-[color:var(--primary)]/90' : 'text-surface-variant'}`}>{it.negative}</p>
              </StickySubsectionHeader>
              <Reveal className="mt-3">
                <p className="mt-3 max-w-2xl leading-relaxed">
                  <IkigaiText text={example} mode={mode} />
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm" style={{ color: WARN }}>
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" /> {it.warning}
                </p>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ── §03.b — Presque-ikigai ──────────────────────────────────────────────────
export function PresqueSection({
  mode,
  onMode,
  activeId,
}: {
  mode: IkigaiMode;
  onMode: (m: IkigaiMode) => void;
  activeId: string | null;
}) {
  return (
    <section id="ikigai-section-presque" className="scroll-mt-24 lg:scroll-mt-16">
      <StickyChapterHeader
        n="03.b"
        label="les quatre presque-ikigai"
        mode={mode}
        onMode={onMode}
        title="Le piège des trois-sur-quatre."
        description="Trois dimensions convergent — de l'extérieur, ça ressemble à une vie réussie. Mais une seule manque, et c'est précisément celle qu'on met le plus longtemps à nommer."
      />
      <div className="mt-8 divide-y divide-outline-variant lg:w-[52%]">
        {IKIGAI.presqueIkigai.map((p, i) => {
          const description = mode === 'decouverte' ? p.descriptionDecouverte ?? p.description : p.description;
          const trap = mode === 'decouverte' ? p.trapDecouverte ?? p.trap : p.trap;
          const active = activeId === p.id;
          return (
            <article
              key={p.id}
              id={`ikigai-presque-${p.id}`}
              className={`py-7 transition-opacity duration-500 ease-in-out ${activeId && !active ? 'opacity-30' : 'opacity-100'} hover:opacity-100`}
              style={subsectionAnchorStyle}
            >
              <StickySubsectionHeader>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="font-mono text-xs text-[color:var(--primary)]">{['I', 'II', 'III', 'IV'][i]}.</span>
                  <h3 className={`font-headline text-headline-md font-semibold transition-colors duration-500 ${active ? 'text-[color:var(--primary)]' : ''}`}>{p.name}</h3>
                  <span className={`font-headline text-sm italic transition-colors duration-500 ${active ? 'text-[color:var(--primary)]/80' : 'text-surface-variant'}`}>{p.formula}</span>
                </div>
                <p className={`eyebrow mt-1.5 !tracking-[0.16em] normal-case transition-colors duration-500 ${active ? 'text-[color:var(--primary)]/90' : 'text-surface-variant'}`}>manque : {p.missingDim}</p>
              </StickySubsectionHeader>
              <Reveal className="mt-3">
                <p className="mt-3 max-w-2xl leading-relaxed">
                  <IkigaiText text={description} mode={mode} />
                </p>
                <p className="mt-3 flex items-start gap-2 text-sm" style={{ color: WARN }}>
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  <span>
                    <IkigaiText text={trap} mode={mode} />
                  </span>
                </p>
              </Reveal>
            </article>
          );
        })}
      </div>
    </section>
  );
}

// ── §04 — Archétypes ──────────────────────────────────────────────────────────
export function ArchetypesSection({
  mode,
  onMode,
  chosen,
  onChoose,
}: {
  mode: IkigaiMode;
  onMode: (m: IkigaiMode) => void;
  chosen: string | null;
  onChoose: (id: string | null) => void;
}) {
  return (
    <section id="ikigai-section-archetypes" className="scroll-mt-24 lg:scroll-mt-16">
      <StickyChapterHeader
        n="04"
        label="trois archétypes au centre"
        mode={mode}
        onMode={onMode}
        title="Trois portraits possibles, au centre du diagramme."
        description="Ces archétypes ne sont pas étanches — une trajectoire réelle emprunte à deux d'entre eux. Choisissez celui qui vous parle pour le relier à vos profils et parcours recommandés."
      />
      <div className="mt-8 space-y-4">
        {IKIGAI.archetypes.map((a) => (
          <ArchetypeCard
            key={a.id}
            a={a}
            mode={mode}
            open={chosen === a.id}
            onToggle={() => onChoose(chosen === a.id ? null : a.id)}
          />
        ))}
      </div>
    </section>
  );
}

function ArchetypeCard({
  a,
  mode,
  open,
  onToggle,
}: {
  a: IkigaiArchetype;
  mode: IkigaiMode;
  open: boolean;
  onToggle: () => void;
}) {
  const positioning = mode === 'decouverte' ? a.positioningDecouverte : a.positioning;
  const day = mode === 'decouverte' ? a.dayDecouverte : a.day;
  const value = mode === 'decouverte' ? a.valueDecouverte : a.value;
  const signals = mode === 'decouverte' ? a.signalsDecouverte : a.signals;
  const relatedProfiles = a.profileIds.map((id) => profileById(id)).filter(Boolean);
  const paths = archetypePaths(a);

  return (
    <Reveal>
      <div
        className="premium-card overflow-hidden"
        style={open ? { borderColor: `color-mix(in srgb, ${a.accent} 50%, transparent)` } : undefined}
      >
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          className="flex w-full items-center gap-4 p-6 text-left"
        >
          <KanjiSeal kanji={a.kanji} accent={a.accent} size={52} />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[0.625rem] uppercase tracking-wider text-surface-variant">{a.tag}</p>
            <h3 className="font-headline text-headline-md font-semibold" style={{ color: a.accent }}>
              {a.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-surface-variant">
              <IkigaiText text={positioning} mode={mode} />
            </p>
          </div>
          <span className="shrink-0 self-start font-mono text-xs text-[color:var(--primary)]">{open ? '●' : '○'}</span>
        </button>

        {open && (
          <div className="animate-fade-in border-t border-outline-variant px-6 pb-6 pt-5">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="eyebrow mb-3">Une semaine type</p>
                <ul className="space-y-2.5">
                  {day.map((d, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed">
                      <span className="w-16 shrink-0 pt-0.5 font-mono text-[0.6875rem] text-surface-variant">{d.time}</span>
                      <span className="text-surface-variant">
                        <IkigaiText text={d.text} mode={mode} />
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow mb-3">Valeur créée</p>
                <p className="text-sm leading-relaxed text-surface-variant">
                  <IkigaiText text={value} mode={mode} />
                </p>
                {mode === 'avance' && (
                  <>
                    <p className="eyebrow mb-2.5 mt-6">Métriques de référence</p>
                    <div className="flex flex-wrap gap-2">
                      {a.metrics.map((m, i) => (
                        <span key={i} className="chip font-mono">
                          {m}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-outline-variant pt-5">
              <p className="eyebrow mb-3">Signaux — vous vous en rapprochez si…</p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {signals.map((s, i) => (
                  <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-surface-variant">
                    <span className="mt-0.5 font-headline italic" style={{ color: a.accent }}>
                      →
                    </span>
                    <span>
                      <IkigaiText text={s} mode={mode} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 grid gap-4 border-t border-outline-variant pt-5 sm:grid-cols-2">
              {relatedProfiles.length > 0 && (
                <div>
                  <p className="eyebrow mb-2.5">Profils d'apprentissage reliés</p>
                  <div className="flex flex-wrap gap-2">
                    {relatedProfiles.map((p) => (
                      <span key={p!.id} className="chip">
                        {p!.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {paths.length > 0 && (
                <div>
                  <p className="eyebrow mb-2.5">Parcours recommandés</p>
                  <div className="space-y-1.5">
                    {paths.map((p) => (
                      <Link
                        key={p!.id}
                        to={`/paths/${p!.slug}`}
                        className="flex items-center justify-between gap-2 rounded-lg border border-outline-variant px-3 py-2 text-sm transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container-low"
                      >
                        <span className="truncate">{t(p.title)}</span>
                        <ArrowRight size={14} className="shrink-0 text-surface-variant" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Reveal>
  );
}

// ── §05 — Cahier d'introspection (7 free-text questions) ──────────────────────
export function ReflectionSection({ mode, onMode }: { mode: IkigaiMode; onMode: (m: IkigaiMode) => void }) {
  const { addNote, deleteNote, notes } = useUserData();
  const { isAuthed, apiUp } = useAuth();
  const { openAuth } = useUI();

  const [answers, setAnswers] = useState<CahierAnswers>(() => getCahierAnswers());
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  // Draft autosave — local only, nothing is ever sent here.
  useEffect(() => {
    setCahierAnswers(answers);
  }, [answers]);

  // Switching reading mode shows a different (unsaved) answer set, so the
  // "Enregistré" confirmation no longer applies.
  useEffect(() => {
    setSavedAt(null);
  }, [mode]);

  const questions = mode === 'decouverte' ? IKIGAI.reflection.decouverte : IKIGAI.reflection.avance;
  const update = (n: string, v: string) => {
    // Any edit invalidates the previous save, so revert the button to its
    // "Enregistrer" state instead of leaving a stale "Enregistré".
    setSavedAt(null);
    setAnswers((cur) => ({ ...cur, [answerKey(mode, n)]: v }));
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
        for (const ex of existing) await deleteNote(ex.id);
        if (value) {
          await addNote({
            kind: 'note',
            body: value,
            sourceType: NOTE_SOURCE,
            sourceId,
            sourceTitle: `Cahier Ikigai · Question ${q.n}`,
          });
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
          {isAuthed
            ? 'Enregistrez vos réponses dans votre carnet pour les retrouver sur tous vos appareils.'
            : apiUp
              ? 'Vos brouillons sont déjà conservés localement. Enregistrez-les dans votre carnet pour les synchroniser après création d’un espace.'
              : 'Vos brouillons sont conservés localement sur cet appareil.'}
        </p>
        <div className="flex items-center gap-2">
          {!isAuthed && apiUp && (
            <button onClick={() => openAuth('Créez un espace pour synchroniser votre cahier Ikigai.')} className="btn-quiet">
              <Lock size={14} /> Créer un espace
            </button>
          )}
          <button onClick={saveToCarnet} disabled={busy} className="btn-foil !py-2.5 disabled:opacity-50">
            {savedAt ? <Check size={15} /> : <Save size={15} />}
            {savedAt ? 'Enregistré' : 'Enregistrer dans mon carnet'}
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Bref / Concise View Component ──────────────────────────────────────────
export function BrefIntrospectionView({
  activeId,
  onSelectId,
}: {
  activeId: string | null;
  onSelectId: (id: string | null) => void;
}) {
  return (
    <div className="space-y-10 lg:w-[52%] animate-fade-in">
      {/* Dimensions section */}
      <section className="space-y-4">
        <h3 className="font-headline text-headline-lg font-semibold border-b border-outline-variant pb-2">
          Les 4 Dimensions
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {IKIGAI.dimensions.map((d) => {
            const active = activeId === d.id;
            return (
              <button
                key={d.id}
                onClick={() => onSelectId(active ? null : d.id)}
                className={`premium-card p-4 text-left transition-all ${
                  active ? 'border-[color:var(--primary)] bg-surface-container-low' : 'hover:bg-surface-container-low/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-headline text-headline-sm font-semibold" style={{ color: d.accent }}>
                    {d.label}
                  </span>
                  <span className="font-headline text-lg italic" style={{ color: d.accent }}>{d.kanji}</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-surface-variant list-disc pl-4">
                  {d.itemsDecouverte?.slice(0, 3).map((it, i) => (
                    <li key={i}>{it}</li>
                  ))}
                </ul>
              </button>
            );
          })}
        </div>
      </section>

      {/* Intersections section */}
      <section className="space-y-4">
        <h3 className="font-headline text-headline-lg font-semibold border-b border-outline-variant pb-2">
          Les Intersections (Pièges)
        </h3>
        <div className="grid gap-3">
          {IKIGAI.intersections.map((it) => {
            const active = activeId === it.id;
            return (
              <button
                key={it.id}
                onClick={() => onSelectId(active ? null : it.id)}
                className={`premium-card p-4 text-left transition-all flex items-start gap-4 ${
                  active ? 'border-[color:var(--primary)] bg-surface-container-low' : 'hover:bg-surface-container-low/50'
                }`}
              >
                <span className="font-mono text-xs text-[color:var(--primary)] mt-1">▲</span>
                <div>
                  <h4 className="font-headline font-semibold text-[0.95rem]">{it.label} <span className="text-xs text-surface-variant font-normal">({it.subtitle})</span></h4>
                  <p className="text-xs text-surface-variant mt-1 italic">{it.negative}</p>
                  <p className="text-xs text-[color:var(--error)] mt-1 flex items-center gap-1.5"><AlertTriangle size={11} /> {it.warning}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Traps (Presque-ikigai) */}
      <section className="space-y-4">
        <h3 className="font-headline text-headline-lg font-semibold border-b border-outline-variant pb-2">
          Les Presque-Ikigai (3/4)
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {IKIGAI.presqueIkigai.map((p) => {
            const active = activeId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onSelectId(active ? null : p.id)}
                className={`premium-card p-4 text-left transition-all ${
                  active ? 'border-[color:var(--primary)] bg-surface-container-low' : 'hover:bg-surface-container-low/50'
                }`}
              >
                <h4 className="font-headline font-semibold text-[0.95rem] flex justify-between">
                  <span>{p.name}</span>
                  <span className="font-headline text-sm italic">{p.kanji}</span>
                </h4>
                <p className="text-[0.625rem] text-[color:var(--primary)] font-mono mt-1 uppercase tracking-wider">Manque : {p.missingDim}</p>
                <p className="text-xs text-surface-variant mt-2 line-clamp-3">{p.descriptionDecouverte ?? p.description}</p>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ── Interactive MCQ View Component ──────────────────────────────────────────
export interface ScenarioQuestion {
  id: string;
  dimensionId: string;
  q: string;
  hint: string;
  options: {
    text: string;
    explanation: string;
    profile: string;
  }[];
}

export const SCENARIOS: ScenarioQuestion[] = [
  {
    id: "sc-aime",
    dimensionId: "aime",
    q: "On vous propose de passer votre après-midi sur l'une des trois tâches suivantes. Laquelle choisissez-vous ?",
    hint: "Distingue votre intérêt pour le volume, l'analyse ou la rencontre humaine.",
    options: [
      {
        text: "Rencontrer un fondateur en pré-seed pour comprendre sa vision du marché et décortiquer sa thèse.",
        explanation: "Ce choix est typique de l'investisseur early-stage ou du mentor : vous privilégiez le contact humain et la confrontation d'idées brutes.",
        profile: "VC Early Stage / Mentor"
      },
      {
        text: "Auditer en profondeur les unit economics et le modèle de rétention d'une startup SaaS pendant 4 heures.",
        explanation: "Ce choix montre un profil d'analyse rigoureux et structuré : vous aimez le travail de due diligence et la validation par les chiffres.",
        profile: "Analyste / Auditeur"
      },
      {
        text: "Faire du sourcing à froid en épluchant 150 profils LinkedIn et newsletters sectorielles.",
        explanation: "Ce choix est typique du rôle d'exécution en fonds d'investissement (Analyst/Associate) : vous êtes orienté volume et rigueur dans le deal flow.",
        profile: "Analyste Deal Flow"
      }
    ]
  },
  {
    id: "sc-doue",
    dimensionId: "doue",
    q: "Quel est votre super-pouvoir ou votre posture naturelle dans une négociation serrée ?",
    hint: "Sépare l'approche financière, opérationnelle ou institutionnelle.",
    options: [
      {
        text: "Analyser et restructurer les clauses de liquidation préférentielle pour protéger les intérêts financiers.",
        explanation: "Vous êtes à l'aise avec la structuration financière et le compromis technique (typique des rôles de Principal / Partner en VC).",
        profile: "Investisseur VC / Deal Maker"
      },
      {
        text: "Trouver un compromis gagnant-gagnant pour préserver la relation de confiance avec le fondateur.",
        explanation: "Vous privilégiez l'accompagnement et la pérennité de la relation (typique de l'entrepreneur ou du mentor).",
        profile: "Entrepreneur / Mentor"
      },
      {
        text: "Rassurer les investisseurs et justifier que le deal respecte les contraintes institutionnelles.",
        explanation: "Vous excellez dans la communication de confiance et le respect des mandats (typique du responsable Relations Investisseurs).",
        profile: "Relations Investisseurs (IR)"
      }
    ]
  },
  {
    id: "sc-besoin",
    dimensionId: "besoin",
    q: "Selon vous, quelle est la faiblesse la plus critique de l'écosystème tech en France aujourd'hui ?",
    hint: "Permet de voir quel besoin macro-économique vous semble prioritaire.",
    options: [
      {
        text: "Le manque de fonds de capital-risque de taille massive (late-stage) pour éviter de dépendre des fonds US.",
        explanation: "Vous êtes sensible aux enjeux de souveraineté financière et d'attraction de capitaux LPs (sensibilité Relations Investisseurs / LPs).",
        profile: "Relations Investisseurs / LP Focus"
      },
      {
        text: "Le manque d'accompagnement post-investissement réellement utile aux fondateurs sur le go-to-market.",
        explanation: "Vous croyez que la valeur se crée dans l'exécution opérationnelle (sensibilité Opérateur / Startup Exec).",
        profile: "Startup Operator / Mentor"
      },
      {
        text: "La frilosité des investisseurs traditionnels sur l'amorçage technologique profond (deep tech / hardware).",
        explanation: "Vous croyez en la thèse d'investissement long terme et en la recherche de rupture (sensibilité Architecte de Thèse).",
        profile: "Architecte de Thèse (VC)"
      }
    ]
  },
  {
    id: "sc-remunere",
    dimensionId: "remunere",
    q: "Comment concevez-vous votre modèle de retour financier idéal à 10 ans ?",
    hint: "Distingue le carried interest, le salaire fixe avec bonus, ou les actions directes.",
    options: [
      {
        text: "Une part des profits importants (carried interest) indexée sur le succès exceptionnel d'un seul deal du fonds.",
        explanation: "Vous êtes parfaitement aligné avec la loi de puissance du capital-risque : vous acceptez le risque d'absence de gain pour maximiser l'upside (VC).",
        profile: "VC GP (Carried Interest)"
      },
      {
        text: "Un salaire fixe et des bonus de performance réguliers, basés sur le développement stable de la structure de gestion.",
        explanation: "Vous privilégiez la stabilité financière et la croissance structurée de l'organisation (typique des IR).",
        profile: "Relations Investisseurs / Management Fees"
      },
      {
        text: "De l'equity directe (capital) et des stock-options dans ma propre startup ou mes participations opérationnelles.",
        explanation: "Vous voulez être rémunéré pour votre création directe de valeur et votre travail quotidien (Entrepreneur / Opérateur).",
        profile: "Entrepreneur / Operator"
      }
    ]
  }
];

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
