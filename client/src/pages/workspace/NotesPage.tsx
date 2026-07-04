import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Quote, Highlighter, StickyNote, Plus, Bookmark as BookmarkIcon } from 'lucide-react';
import { useUserData } from '@/context/UserDataContext';
import { SectionHeading, EmptyState } from '@/components/ui/primitives';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { IkigaiCahierSummary } from '@/components/ikigai/IkigaiCahierSummary';
import { formatDateFr } from '@/lib/utils';
import { usePageMeta } from '@/lib/seo';
import type { Note } from '@/content/types';

const KIND_META: Record<string, { label: string; icon: typeof Quote }> = {
  note: { label: 'Note', icon: StickyNote },
  quote: { label: 'Citation', icon: Quote },
  highlight: { label: 'Surlignage', icon: Highlighter },
};

const FILTERS = [
  { id: 'all', label: 'Tout' },
  { id: 'note', label: 'Notes' },
  { id: 'quote', label: 'Citations' },
  { id: 'highlight', label: 'Surlignages' },
];

export default function NotesPage() {
  usePageMeta('Notes & favoris', 'Votre carnet de citations, surlignages et notes, et vos contenus enregistrés.');
  const { notes, bookmarks, addNote, deleteNote, toggleBookmark } = useUserData();
  const [filter, setFilter] = useState('all');
  const [draft, setDraft] = useState('');
  const [pendingDelete, setPendingDelete] = useState<Note | null>(null);

  const visible = notes.filter((n) => filter === 'all' || n.kind === filter);
  const groups = useMemo(() => {
    const bySource = new Map<string, Note[]>();
    for (const note of visible) {
      const source = note.sourceTitle ?? 'Notes libres';
      bySource.set(source, [...(bySource.get(source) ?? []), note]);
    }
    return Array.from(bySource.entries()).map(([source, items]) => ({ source, items }));
  }, [visible]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim()) return;
    void addNote({ kind: 'note', body: draft.trim() });
    setDraft('');
  }

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <SectionHeading eyebrow="Le commonplace book" title="Notes & favoris" description="Vos citations, surlignages et réflexions, capturés au fil de la lecture. Le carnet de l’apprenant actif." />

      

      <IkigaiCahierSummary className="mt-8" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Notes */}
        <div>
          <form onSubmit={submit} className="mb-6 rounded-2xl border border-outline-variant bg-surface-container-low p-4">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Une réflexion, une idée à garder…"
              rows={3}
              name="note"
              aria-label="Nouvelle note"
              className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-surface-variant"
            />
            <div className="mt-2 flex justify-end">
              <button type="submit" disabled={!draft.trim()} className="btn-foil !py-2 disabled:opacity-40"><Plus size={15} /> Ajouter au carnet</button>
            </div>
          </form>

          <div className="mb-4 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button key={f.id} onClick={() => setFilter(f.id)} className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${filter === f.id ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground' : 'border-outline-variant text-surface-variant hover:text-foreground'}`}>
                {f.label}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <EmptyState icon={<StickyNote size={26} />} title="Votre carnet est vide" description="Surlignez un passage pendant une lecture, ou ajoutez une note libre ci-dessus." />
          ) : (
            <div className="space-y-6">
              {groups.map((group) => (
                <section key={group.source}>
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <h2 className="font-headline text-headline-sm font-semibold">{group.source}</h2>
                    <span className="font-mono text-xs text-surface-variant">{group.items.length}</span>
                  </div>
                  <ul className="space-y-3">
                    {group.items.map((n) => {
                      const Meta = KIND_META[n.kind] ?? KIND_META.note;
                      return (
                        <li key={n.id} className="group rounded-2xl border border-outline-variant bg-surface-container-lowest p-5">
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-[0.625rem] font-medium uppercase tracking-wider text-surface-variant">
                              <Meta.icon size={12} /> {Meta.label}
                            </span>
                            <button onClick={() => setPendingDelete(n)} className="rounded text-surface-variant opacity-0 transition-opacity hover:text-error focus-visible:opacity-100 group-hover:opacity-100" aria-label="Supprimer cette note">
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <p className={`mt-2 leading-relaxed ${n.kind === 'note' ? '' : 'font-headline italic'}`}>
                            {n.kind === 'note' ? n.body : `“${n.body}”`}
                          </p>
                          <p className="mt-2 text-[0.625rem] text-surface-variant">
                            {n.sourceTitle ? `Extrait de « ${n.sourceTitle} »` : 'Note libre'} · {formatDateFr(n.createdAt)}
                          </p>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>

        {/* Bookmarks */}
        <div>
          <p className="eyebrow mb-4 flex items-center gap-2"><BookmarkIcon size={13} /> Favoris ({bookmarks.length})</p>
          {bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-outline-variant p-8 text-center text-sm text-surface-variant">
              Aucun favori. Cliquez sur le marque-page d’un cours, d’une étude de cas ou d’un simulateur pour l’enregistrer.
            </div>
          ) : (
            <ul className="space-y-2">
              {bookmarks.map((b) => (
                <li key={`${b.itemType}-${b.itemId}`} className="group flex items-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3">
                  <span className="shrink-0 font-mono text-[0.5625rem] uppercase tracking-wider text-surface-variant">{b.itemType}</span>
                  <Link to={b.href} className="min-w-0 flex-1 truncate text-sm font-medium transition-colors hover:text-[color:var(--primary)]">{b.title}</Link>
                  <button onClick={() => toggleBookmark(b)} className="text-surface-variant opacity-0 transition-opacity hover:text-error group-hover:opacity-100" aria-label="Retirer">
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => { if (pendingDelete) void deleteNote(pendingDelete.id); }}
        title="Supprimer cette note ?"
        body={pendingDelete ? `« ${pendingDelete.body.slice(0, 90)}${pendingDelete.body.length > 90 ? '…' : ''} » — cette action est définitive.` : undefined}
      />
    </div>
  );
}
