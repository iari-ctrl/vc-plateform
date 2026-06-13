import { useEffect, useMemo, useState } from 'react';
import {
  Check, X as XIcon, CircleSlash, Trash2, Plus, Link2, CalendarClock, AlarmClockCheck,
  Crosshair, Gauge, Search as SearchIcon,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useUserData } from '@/context/UserDataContext';
import { SectionHeading, EmptyState } from '@/components/ui/primitives';
import { GuestBanner } from '@/components/ui/GuestBanner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import {
  CONFIDENCE_MIN, CONFIDENCE_MAX, MIN_SAMPLE, OUTCOME_LABEL,
  calibrationBuckets, calibrationSummary, isDue, sortForDisplay,
} from '@/lib/decisionJournal';
import { cn, formatDateFr } from '@/lib/utils';
import { usePageMeta } from '@/lib/seo';
import type { DecisionCategory, DecisionJournalEntry, DecisionLink, DecisionOutcome } from '@/content/types';
import type { SearchHit } from '@/content/search';

const CATEGORIES: { id: DecisionCategory; label: string }[] = [
  { id: 'deal', label: 'Deal' },
  { id: 'marche', label: 'Marché' },
  { id: 'fonds', label: 'Fonds' },
  { id: 'these', label: 'Thèse' },
  { id: 'carriere', label: 'Carrière' },
  { id: 'autre', label: 'Autre' },
];

const CATEGORY_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.id, c.label]));

const LINK_TYPE_LABEL: Record<string, string> = {
  course: 'Cours',
  lesson: 'Leçon',
  glossary: 'Dictionnaire',
  case: 'Cas',
  blog: 'Analyse',
  path: 'Parcours',
  simulator: 'Simulateur',
  'anti-portfolio': 'Anti-portfolio',
  memo: 'Memo',
};

function confidenceLabel(c: number): string {
  if (c < 60) return 'À peine mieux qu’une pièce';
  if (c < 70) return 'Plutôt probable';
  if (c < 80) return 'Probable';
  if (c < 90) return 'Très probable';
  return 'Quasi certain';
}

/** yyyy-mm-dd for a date `months` months from now (date-input friendly). */
function dateInMonths(months: number): string {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().slice(0, 10);
}

const OUTCOME_META: Record<DecisionOutcome, { icon: typeof Check; color: string }> = {
  correct: { icon: Check, color: 'var(--success)' },
  incorrect: { icon: XIcon, color: 'var(--error)' },
  void: { icon: CircleSlash, color: 'var(--on-surface-variant)' },
};

export default function DecisionJournalPage() {
  usePageMeta('Journal de décisions', 'Prédictions datées, niveau de confiance, date de revue : l’outil de calibration de votre jugement d’investisseur.');
  const { journal, addJournalEntry, resolveJournalEntry, deleteJournalEntry } = useUserData();

  const [filter, setFilter] = useState<'all' | 'due' | 'open' | 'resolved'>('all');
  const [pendingDelete, setPendingDelete] = useState<DecisionJournalEntry | null>(null);

  const now = useMemo(() => new Date(), []);
  const summary = useMemo(() => calibrationSummary(journal, now), [journal, now]);

  const FILTERS = [
    { id: 'all', label: 'Toutes', count: journal.length },
    { id: 'due', label: 'À réviser', count: summary.due },
    { id: 'open', label: 'Ouvertes', count: summary.open },
    { id: 'resolved', label: 'Résolues', count: summary.resolved },
  ] as const;

  const visible = useMemo(() => {
    const filtered = journal.filter((e) =>
      filter === 'all' ? true
        : filter === 'due' ? isDue(e, now)
        : e.status === filter,
    );
    return sortForDisplay(filtered, now);
  }, [journal, filter, now]);

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Workspace — l’outil de calibration"
        title="Journal de décisions"
        description="Écrivez ce que vous croyez avant de savoir si c’est vrai : une prédiction datée, un niveau de confiance, une date de revue. Puis confrontez. C’est le seul instrument qui mesure si votre jugement s’améliore — pas votre mémoire, qui réécrit tout."
      />

      <GuestBanner
        className="mt-8"
        message="Vous travaillez en mode invité — votre journal est conservé sur cet appareil. Créez un espace pour le retrouver partout."
        reason="Créez un espace pour synchroniser votre journal de décisions entre vos appareils."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Left — form + entries */}
        <div>
          <NewPredictionForm onSubmit={addJournalEntry} />

          <div className="mb-4 mt-8 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors',
                  filter === f.id
                    ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground'
                    : 'border-outline-variant text-surface-variant hover:text-foreground',
                )}
              >
                {f.label} <span className="font-mono opacity-70">{f.count}</span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState
              icon={<Crosshair size={26} />}
              title={journal.length === 0 ? 'Aucune prédiction pour l’instant' : 'Rien dans ce filtre'}
              description={journal.length === 0 ? 'Commencez par une affirmation falsifiable et datée : « D’ici 12 mois, X aura levé une série A. » Votre futur vous corrigera.' : undefined}
            />
          ) : (
            <ul className="space-y-4">
              {visible.map((e) => (
                <EntryCard key={e.id} entry={e} now={now} onResolve={resolveJournalEntry} onDelete={() => setPendingDelete(e)} />
              ))}
            </ul>
          )}
        </div>

        {/* Right — calibration */}
        <CalibrationPanel journal={journal} now={now} />
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => { if (pendingDelete) void deleteJournalEntry(pendingDelete.id); }}
        title="Supprimer cette prédiction ?"
        body={pendingDelete ? `« ${pendingDelete.statement.slice(0, 90)}${pendingDelete.statement.length > 90 ? '…' : ''} » — supprimer une prédiction qui vous gêne est exactement le biais que ce journal combat.` : undefined}
      />
    </div>
  );
}

// ── New prediction form ───────────────────────────────────────────────────────
function NewPredictionForm({ onSubmit }: { onSubmit: (e: Omit<DecisionJournalEntry, 'id' | 'createdAt' | 'status'>) => Promise<void> }) {
  const [statement, setStatement] = useState('');
  const [rationale, setRationale] = useState('');
  const [confidence, setConfidence] = useState(70);
  const [category, setCategory] = useState<DecisionCategory>('deal');
  const [reviewDate, setReviewDate] = useState(() => dateInMonths(6));
  const [links, setLinks] = useState<DecisionLink[]>([]);

  const canSubmit = statement.trim().length > 0 && !!reviewDate;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    void onSubmit({
      statement: statement.trim(),
      rationale: rationale.trim() || undefined,
      confidence,
      category,
      // Noon UTC: the calendar day survives every timezone.
      reviewAt: new Date(`${reviewDate}T12:00:00Z`).toISOString(),
      links,
    });
    setStatement('');
    setRationale('');
    setConfidence(70);
    setLinks([]);
    setReviewDate(dateInMonths(6));
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-outline-variant bg-surface-container-low p-5">
      <p className="eyebrow mb-3 flex items-center gap-2"><Crosshair size={13} /> Nouvelle prédiction</p>

      <textarea
        value={statement}
        onChange={(e) => setStatement(e.target.value)}
        placeholder="Une affirmation falsifiable et datée — « D’ici juin 2027, le marché secondaire européen aura doublé de volume. »"
        rows={2}
        aria-label="Prédiction"
        className="w-full resize-none rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors placeholder:text-surface-variant focus:border-[color:var(--primary)]"
      />

      <textarea
        value={rationale}
        onChange={(e) => setRationale(e.target.value)}
        placeholder="Sur quelles preuves ? Notez le raisonnement d’aujourd’hui — c’est lui que vous relirez."
        rows={2}
        aria-label="Raisonnement"
        className="mt-2 w-full resize-none rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm outline-none transition-colors placeholder:text-surface-variant focus:border-[color:var(--primary)]"
      />

      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {/* Confidence */}
        <label className="block">
          <span className="mb-1.5 flex items-center justify-between text-xs font-medium text-surface-variant">
            <span>Confiance</span>
            <span className="font-mono text-foreground">{confidence} %</span>
          </span>
          <input
            type="range"
            min={CONFIDENCE_MIN}
            max={CONFIDENCE_MAX}
            value={confidence}
            onChange={(e) => setConfidence(parseInt(e.target.value, 10))}
            className="w-full accent-[color:var(--primary)]"
          />
          <span className="mt-1 block text-[0.6875rem] text-surface-variant">{confidenceLabel(confidence)} — sous 50 %, affirmez l’inverse.</span>
        </label>

        {/* Review date */}
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-surface-variant">Date de revue</span>
          <input
            type="date"
            value={reviewDate}
            min={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setReviewDate(e.target.value)}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-2.5 text-sm outline-none transition-colors focus:border-[color:var(--primary)]"
          />
          <span className="mt-1.5 flex gap-1.5">
            {[['3 mois', 3], ['6 mois', 6], ['1 an', 12]].map(([label, m]) => (
              <button key={label as string} type="button" onClick={() => setReviewDate(dateInMonths(m as number))} className="rounded-full border border-outline-variant px-2.5 py-0.5 text-[0.6875rem] text-surface-variant transition-colors hover:border-[color:var(--primary)] hover:text-foreground">
                +{label}
              </button>
            ))}
          </span>
        </label>
      </div>

      {/* Category */}
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="mr-1 text-xs font-medium text-surface-variant">Domaine :</span>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCategory(c.id)}
            className={cn(
              'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
              category === c.id
                ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground'
                : 'border-outline-variant text-surface-variant hover:text-foreground',
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <LinkPicker links={links} onChange={setLinks} />

      <div className="mt-4 flex justify-end">
        <button type="submit" disabled={!canSubmit} className="btn-foil !py-2 disabled:opacity-40">
          <Plus size={15} /> Consigner la prédiction
        </button>
      </div>
    </form>
  );
}

// ── Link picker (attach any platform content) ────────────────────────────────
function LinkPicker({ links, onChange }: { links: DecisionLink[]; onChange: (l: DecisionLink[]) => void }) {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);

  useEffect(() => {
    let active = true;
    const q = query.trim();
    if (q.length < 2) {
      setHits([]);
      return;
    }
    // Lazy: the offline search index references every collection.
    void import('@/content/search').then(({ searchLocal }) => {
      if (active) setHits(searchLocal(q).slice(0, 6));
    });
    return () => {
      active = false;
    };
  }, [query]);

  function add(hit: SearchHit) {
    if (!links.some((l) => l.type === hit.type && l.id === hit.id)) {
      onChange([...links, { type: hit.type, id: hit.id, title: hit.title, href: hit.href }]);
    }
    setQuery('');
    setHits([]);
  }

  return (
    <div className="mt-4">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-surface-variant">
        <Link2 size={12} /> Relier à un contenu — leçon, memo, anti-portfolio, simulateur…
      </span>
      <div className="relative">
        <SearchIcon size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-variant" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un contenu à relier…"
          aria-label="Relier à un contenu"
          className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest py-2.5 pl-9 pr-4 text-sm outline-none transition-colors placeholder:text-surface-variant focus:border-[color:var(--primary)]"
        />
        {hits.length > 0 && (
          <ul className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest shadow-editorial-lg">
            {hits.map((h) => (
              <li key={`${h.type}-${h.id}`}>
                <button type="button" onClick={() => add(h)} className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-surface-container-low">
                  <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-wider text-surface-variant">{LINK_TYPE_LABEL[h.type] ?? h.type}</span>
                  <span className="min-w-0 flex-1 truncate">{h.title}</span>
                  <Plus size={13} className="shrink-0 text-surface-variant" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {links.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {links.map((l) => (
            <li key={`${l.type}-${l.id}`} className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-container-lowest px-3 py-1 text-xs">
              <span className="font-mono text-[0.5625rem] uppercase tracking-wider text-surface-variant">{LINK_TYPE_LABEL[l.type] ?? l.type}</span>
              <span className="max-w-[16rem] truncate">{l.title}</span>
              <button type="button" onClick={() => onChange(links.filter((x) => !(x.type === l.type && x.id === l.id)))} aria-label={`Retirer ${l.title}`} className="text-surface-variant transition-colors hover:text-error">
                <XIcon size={12} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ── Entry card ────────────────────────────────────────────────────────────────
function EntryCard({
  entry, now, onResolve, onDelete,
}: {
  entry: DecisionJournalEntry;
  now: Date;
  onResolve: (id: string, outcome: DecisionOutcome, note?: string) => Promise<void>;
  onDelete: () => void;
}) {
  const [pendingOutcome, setPendingOutcome] = useState<DecisionOutcome | null>(null);
  const [note, setNote] = useState('');
  const due = isDue(entry, now);

  function confirmResolve() {
    if (!pendingOutcome) return;
    void onResolve(entry.id, pendingOutcome, note.trim() || undefined);
    setPendingOutcome(null);
    setNote('');
  }

  return (
    <li className={cn('group rounded-2xl border bg-surface-container-lowest p-5', due ? 'border-[color-mix(in_srgb,var(--primary)_45%,transparent)]' : 'border-outline-variant')}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-surface-variant">{CATEGORY_LABEL[entry.category] ?? entry.category}</span>
        <span className="rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] px-2.5 py-0.5 font-mono text-[0.6875rem] font-semibold text-[color:var(--primary)]">{entry.confidence} %</span>
        <span className="text-[0.625rem] text-surface-variant">posée le {formatDateFr(entry.createdAt)}</span>
        <button onClick={onDelete} className="ml-auto rounded text-surface-variant opacity-0 transition-opacity hover:text-error focus-visible:opacity-100 group-hover:opacity-100" aria-label="Supprimer cette prédiction">
          <Trash2 size={15} />
        </button>
      </div>

      <p className="mt-3 font-medium leading-relaxed">{entry.statement}</p>
      {entry.rationale && <p className="mt-1.5 text-sm leading-relaxed text-surface-variant">{entry.rationale}</p>}

      {entry.links.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {entry.links.map((l) => (
            <li key={`${l.type}-${l.id}`}>
              <Link to={l.href} className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant px-3 py-1 text-xs text-surface-variant transition-colors hover:border-[color:var(--primary)] hover:text-foreground">
                <Link2 size={11} />
                <span className="max-w-[14rem] truncate">{l.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Footer: review state / resolution */}
      {entry.status === 'open' ? (
        <div className="mt-4 border-t border-outline-variant pt-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn('inline-flex items-center gap-1.5 text-xs', due ? 'font-medium text-[color:var(--primary)]' : 'text-surface-variant')}>
              {due ? <AlarmClockCheck size={13} /> : <CalendarClock size={13} />}
              {due ? `À réviser — échéance dépassée le ${formatDateFr(entry.reviewAt)}` : `Revue prévue le ${formatDateFr(entry.reviewAt)}`}
            </span>
            <span className="ml-auto flex gap-1.5">
              <button onClick={() => setPendingOutcome('correct')} className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--success)_45%,transparent)] px-2.5 py-1 text-[0.6875rem] font-medium text-[color:var(--success)] transition-colors hover:bg-[color-mix(in_srgb,var(--success)_10%,transparent)]">
                <Check size={12} /> Réalisée
              </button>
              <button onClick={() => setPendingOutcome('incorrect')} className="inline-flex items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--error)_45%,transparent)] px-2.5 py-1 text-[0.6875rem] font-medium text-[color:var(--error)] transition-colors hover:bg-[color-mix(in_srgb,var(--error)_10%,transparent)]">
                <XIcon size={12} /> Ratée
              </button>
              <button onClick={() => setPendingOutcome('void')} className="inline-flex items-center gap-1 rounded-full border border-outline-variant px-2.5 py-1 text-[0.6875rem] font-medium text-surface-variant transition-colors hover:bg-surface-container-low">
                <CircleSlash size={12} /> Invérifiable
              </button>
            </span>
          </div>

          {pendingOutcome && (
            <div className="mt-3 rounded-xl border border-outline-variant bg-surface-container-low p-3.5">
              <p className="text-xs font-medium">
                Marquer « {OUTCOME_LABEL[pendingOutcome]} »{pendingOutcome !== 'void' && ` — vous annonciez ${entry.confidence} %.`}
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="La leçon : qu’est-ce que vous aviez vu — ou refusé de voir ?"
                rows={2}
                aria-label="Leçon retenue"
                className="mt-2 w-full resize-none rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm outline-none transition-colors placeholder:text-surface-variant focus:border-[color:var(--primary)]"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button onClick={() => { setPendingOutcome(null); setNote(''); }} className="btn-quiet !py-1.5 text-xs">Annuler</button>
                <button onClick={confirmResolve} className="btn-foil !py-1.5 text-xs">Confirmer</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <ResolvedFooter entry={entry} />
      )}
    </li>
  );
}

function ResolvedFooter({ entry }: { entry: DecisionJournalEntry }) {
  const outcome = entry.outcome ?? 'void';
  const meta = OUTCOME_META[outcome];
  const Icon = meta.icon;
  return (
    <div className="mt-4 border-t border-outline-variant pt-3.5">
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium" style={{ color: meta.color, background: `color-mix(in srgb, ${meta.color} 10%, transparent)` }}>
          <Icon size={12} /> {OUTCOME_LABEL[outcome]}
        </span>
        {outcome !== 'void' && (
          <span className="text-surface-variant">annoncé {entry.confidence} % · tranché le {formatDateFr(entry.resolvedAt ?? entry.reviewAt)}</span>
        )}
      </div>
      {entry.resolutionNote && <p className="mt-2 border-l-2 border-[color-mix(in_srgb,var(--primary)_40%,transparent)] pl-3 text-sm italic leading-relaxed text-surface-variant">{entry.resolutionNote}</p>}
    </div>
  );
}

// ── Calibration panel ─────────────────────────────────────────────────────────
function CalibrationPanel({ journal, now }: { journal: DecisionJournalEntry[]; now: Date }) {
  const s = useMemo(() => calibrationSummary(journal, now), [journal, now]);
  const buckets = useMemo(() => calibrationBuckets(journal), [journal]);

  const verdictMeta = {
    insufficient: { label: 'Verdict en attente', color: 'var(--on-surface-variant)' },
    calibrated: { label: 'Bien calibré', color: 'var(--success)' },
    overconfident: { label: 'Surconfiance', color: 'var(--error)' },
    underconfident: { label: 'Sous-confiance', color: 'var(--tertiary)' },
  }[s.verdict];

  return (
    <div className="space-y-5 lg:sticky lg:top-20 lg:self-start">
      <div className="rounded-2xl border border-outline-variant bg-surface-container-low/50 p-6">
        <p className="eyebrow mb-4 flex items-center gap-2"><Gauge size={13} /> Votre calibration</p>

        <div className="grid grid-cols-2 gap-3">
          <PanelStat label="Ouvertes" value={s.open} />
          <PanelStat label="À réviser" value={s.due} highlight={s.due > 0} />
          <PanelStat label="Résolues" value={s.resolved} />
          <PanelStat label="Réussite" value={s.hitRate !== null ? `${Math.round(s.hitRate)} %` : '—'} />
        </div>

        {/* Verdict */}
        <div className="mt-5 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold" style={{ color: verdictMeta.color, background: `color-mix(in srgb, ${verdictMeta.color} 10%, transparent)` }}>
            {verdictMeta.label}
          </span>
          <p className="mt-2 text-xs leading-relaxed text-surface-variant">
            {s.verdict === 'insufficient' && (
              <>Encore {Math.max(0, MIN_SAMPLE - s.scored)} prédiction{MIN_SAMPLE - s.scored > 1 ? 's' : ''} résolue{MIN_SAMPLE - s.scored > 1 ? 's' : ''} avant un premier verdict ({MIN_SAMPLE} minimum). Une prédiction isolée ne prouve rien — c’est la distribution qui parle.</>
            )}
            {s.verdict === 'calibrated' && <>Confiance annoncée {Math.round(s.meanConfidence!)} % · réalité {Math.round(s.hitRate!)} %. Quand vous annoncez 70 %, ça arrive ~70 % du temps : c’est exactement l’objectif.</>}
            {s.verdict === 'overconfident' && <>Vous annoncez en moyenne {Math.round(s.meanConfidence!)} % mais la réalité vous donne raison {Math.round(s.hitRate!)} % du temps. Écart : +{Math.round(s.gap!)} pts. Le biais classique de l’investisseur — exigez plus de preuves avant de monter en confiance.</>}
            {s.verdict === 'underconfident' && <>La réalité vous donne raison {Math.round(s.hitRate!)} % du temps alors que vous n’annoncez que {Math.round(s.meanConfidence!)} %. Vous voyez juste plus souvent que vous ne l’assumez — c’est aussi une erreur de calibration.</>}
          </p>
        </div>

        {/* Brier */}
        <div className="mt-3 flex items-baseline justify-between rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
          <div>
            <p className="text-[0.625rem] uppercase tracking-wider text-surface-variant">Score de Brier</p>
            <p className="mt-0.5 text-[0.625rem] text-surface-variant">0 = oracle · 0,25 = pile ou face</p>
          </div>
          <p className="font-headline text-headline-md font-semibold">{s.brier !== null ? s.brier.toFixed(3).replace('.', ',') : '—'}</p>
        </div>

        {/* Calibration curve, bucketed */}
        <div className="mt-5">
          <p className="mb-3 text-[0.625rem] uppercase tracking-wider text-surface-variant">Annoncé vs observé</p>
          <ul className="space-y-3">
            {buckets.map((b) => (
              <li key={b.label}>
                <div className="flex items-baseline justify-between text-[0.6875rem]">
                  <span className="font-mono text-surface-variant">{b.label}</span>
                  <span className="text-surface-variant">
                    {b.count > 0 ? <>{b.hits}/{b.count} réalisée{b.hits > 1 ? 's' : ''} · <span className="font-mono">{Math.round(b.observed!)} %</span></> : '—'}
                  </span>
                </div>
                <div className="mt-1 space-y-1">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full rounded-full bg-[color-mix(in_srgb,var(--on-surface-variant)_45%,transparent)]" style={{ width: `${b.announced ?? 0}%` }} />
                  </div>
                  <div className="h-1 w-full overflow-hidden rounded-full bg-surface-container-high">
                    <div className="h-full rounded-full bg-[color:var(--primary)]" style={{ width: `${b.observed ?? 0}%` }} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-2 flex items-center gap-3 text-[0.625rem] text-surface-variant">
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-1 w-4 rounded-full bg-[color-mix(in_srgb,var(--on-surface-variant)_45%,transparent)]" /> annoncé</span>
            <span className="inline-flex items-center gap-1.5"><span className="inline-block h-1 w-4 rounded-full bg-[color:var(--primary)]" /> observé</span>
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-outline-variant p-5 text-xs leading-relaxed text-surface-variant">
        <p className="font-medium text-foreground">Pourquoi ce journal ?</p>
        <p className="mt-1.5">Les meilleurs investisseurs ne se souviennent pas mieux — ils écrivent avant. L’<Link to="/anti-portfolio" className="font-medium text-[color:var(--primary)]">anti-portfolio</Link> montre ce que coûte une mauvaise calibration ; les <Link to="/memos" className="font-medium text-[color:var(--primary)]">memos annotés</Link> montrent des prédictions datées rédigées par les meilleurs fonds. Ici, vous faites le même exercice sur vos propres croyances.</p>
      </div>
    </div>
  );
}

function PanelStat({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={cn('rounded-xl border p-3.5', highlight ? 'border-[color-mix(in_srgb,var(--primary)_45%,transparent)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)]' : 'border-outline-variant bg-surface-container-lowest')}>
      <p className="text-[0.625rem] uppercase tracking-wider text-surface-variant">{label}</p>
      <p className={cn('mt-1 font-headline text-headline-md font-semibold leading-none', highlight && 'text-[color:var(--primary)]')}>{value}</p>
    </div>
  );
}
