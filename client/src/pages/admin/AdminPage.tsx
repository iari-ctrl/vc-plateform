import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Shield, BookMarked, Newspaper, FileText, BarChart3, Plus, Save, Trash2, X, Loader2 } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import { Fleuron } from '@/components/ornaments/Ornaments';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { usePageMeta } from '@/lib/seo';

type Tab = 'stats' | 'glossary' | 'blog' | 'cases';

export default function AdminPage() {
  usePageMeta('Administration', undefined, { noindex: true });
  const { isAuthed, isAdmin, apiUp, ready } = useAuth();
  const { openAuth } = useUI();
  const [tab, setTab] = useState<Tab>('stats');

  if (!ready) return null;

  if (!apiUp) {
    return <Gate title="Serveur requis" body="L’espace d’administration nécessite que le serveur API soit démarré (npm run dev:server). En mode invité hors-ligne, le contenu reste consultable mais non modifiable." />;
  }
  if (!isAuthed) {
    return (
      <Gate
        title="Espace réservé"
        body="Connectez-vous avec un compte administrateur pour gérer le contenu."
        action={<button onClick={() => openAuth('Connectez-vous en administrateur (admin@vcpx.io / admin1234).')} className="btn-foil">Se connecter</button>}
      />
    );
  }
  if (!isAdmin) {
    return <Gate title="Accès refusé" body="Votre compte n’a pas les droits d’administration. Connectez-vous avec le compte admin@vcpx.io." />;
  }

  const TABS: { id: Tab; label: string; icon: typeof Shield }[] = [
    { id: 'stats', label: 'Vue d’ensemble', icon: BarChart3 },
    { id: 'glossary', label: 'Dictionnaire', icon: BookMarked },
    { id: 'blog', label: 'Analyses', icon: Newspaper },
    { id: 'cases', label: 'Études de cas', icon: FileText },
  ];

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-xl bg-[color:var(--secondary)] text-[color:var(--on-secondary)]"><Shield size={18} /></span>
        <div>
          <h1 className="font-headline text-headline-lg font-semibold">Administration</h1>
          <p className="text-sm text-surface-variant">Créez et modifiez le contenu publié — les changements apparaissent immédiatement sur le site.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-outline-variant">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`-mb-px flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${tab === t.id ? 'border-[color:var(--primary)] text-foreground' : 'border-transparent text-surface-variant hover:text-foreground'}`}>
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === 'stats' && <StatsPanel />}
        {tab === 'glossary' && <GlossaryManager />}
        {tab === 'blog' && <BlogManager />}
        {tab === 'cases' && <CaseManager />}
      </div>
    </div>
  );
}

function Gate({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <Fleuron className="text-xl" />
      <h1 className="mt-4 font-headline text-headline-lg font-semibold">{title}</h1>
      <p className="mt-3 text-surface-variant">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

function StatsPanel() {
  const [stats, setStats] = useState<Record<string, number> | null>(null);
  useEffect(() => { api.get<Record<string, number>>('/admin/stats').then(setStats).catch(() => setStats(null)); }, []);
  const ITEMS = [
    { key: 'paths', label: 'Parcours' }, { key: 'courses', label: 'Cours' }, { key: 'lessons', label: 'Leçons' },
    { key: 'glossary', label: 'Termes' }, { key: 'cases', label: 'Études de cas' }, { key: 'blog', label: 'Analyses' },
    { key: 'simulators', label: 'Simulateurs' }, { key: 'users', label: 'Utilisateurs' }, { key: 'notes', label: 'Notes' },
  ];
  if (!stats) return <p className="text-sm text-surface-variant">Chargement…</p>;
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {ITEMS.map((it) => (
        <div key={it.key} className="premium-card p-6">
          <p className="font-headline text-display-sm font-semibold leading-none">{stats[it.key] ?? 0}</p>
          <p className="mt-2 text-sm text-surface-variant">{it.label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Generic helpers ──────────────────────────────────────────────────────────
function Input({ label, value, onChange, textarea, rows, mono }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean; rows?: number; mono?: boolean }) {
  const cls = `w-full rounded-xl border border-outline-variant bg-surface-container-low px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[color:var(--primary)] focus:bg-surface-container-lowest ${mono ? 'font-mono' : ''}`;
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-surface-variant">{label}</span>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows ?? 4} className={`${cls} resize-y`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
    </label>
  );
}

function useFlash() {
  const [msg, setMsg] = useState<string | null>(null);
  return { msg, flash: (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2500); } };
}

const splitLines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);
const splitCommas = (s: string) => s.split(',').map((x) => x.trim()).filter(Boolean);

// ── Glossary manager ─────────────────────────────────────────────────────────
interface GTerm { id: string; term: string; slug?: string; aliases?: string[]; latin?: string; category: string; short: string; definition: string; example?: string; seeAlso: string[]; relatedLessonIds: string[] }
const blankTerm: GTerm = { id: '', term: '', aliases: [], category: '', short: '', definition: '', example: '', seeAlso: [], relatedLessonIds: [] };

function GlossaryManager() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<GTerm[]>([]);
  const [editing, setEditing] = useState<GTerm | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { msg, flash } = useFlash();

  const load = () => api.get<GTerm[]>('/admin/glossary').then(setItems).catch(() => {});
  useEffect(() => { void load(); }, []);

  // Public pages read `/content/*` (not `/admin/*`); drop their cache so the
  // edit shows on the site without a reload.
  const refreshSite = () => void queryClient.invalidateQueries({ queryKey: ['api'] });

  async function save() {
    if (!editing) return;
    setBusy(true); setError(null);
    const payload = { ...editing };
    try {
      if (isNew) await api.post('/admin/glossary', payload);
      else await api.put(`/admin/glossary/${editing.id}`, payload);
      await load();
      refreshSite();
      setEditing(null);
      flash('Terme enregistré');
    } catch (e) { setError(e instanceof ApiError ? e.message : 'Erreur'); }
    finally { setBusy(false); }
  }

  async function remove(id: string) {
    await api.del(`/admin/glossary/${id}`).catch(() => {});
    await load();
    refreshSite();
    if (editing?.id === id) setEditing(null);
  }

  return (
    <ManagerLayout
      flash={msg}
      list={
        <ListPanel
          title={`Termes (${items.length})`}
          onNew={() => { setEditing({ ...blankTerm }); setIsNew(true); }}
          items={items.map((t) => ({ id: t.id, title: t.term, subtitle: t.category, onEdit: () => { setEditing(t); setIsNew(false); }, onDelete: () => remove(t.id) }))}
        />
      }
      editor={
        editing && (
          <Editor title={isNew ? 'Nouveau terme' : `Modifier · ${editing.term}`} onClose={() => setEditing(null)} onSave={save} busy={busy} error={error}>
            <Input label="Terme" value={editing.term} onChange={(v) => setEditing({ ...editing, term: v })} />
            <Input label="Catégorie" value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} />
            <Input label="Définition courte" value={editing.short} onChange={(v) => setEditing({ ...editing, short: v })} />
            <Input label="Définition complète" textarea rows={5} value={editing.definition} onChange={(v) => setEditing({ ...editing, definition: v })} />
            <Input label="Alias (séparés par des virgules)" value={(editing.aliases ?? []).join(', ')} onChange={(v) => setEditing({ ...editing, aliases: splitCommas(v) })} />
            <Input label="Exemple (optionnel)" textarea rows={2} value={editing.example ?? ''} onChange={(v) => setEditing({ ...editing, example: v })} />
            <Input label="Voir aussi (slugs séparés par des virgules)" mono value={editing.seeAlso.join(', ')} onChange={(v) => setEditing({ ...editing, seeAlso: splitCommas(v) })} />
            <Input label="Leçons liées (ids, virgules)" mono value={editing.relatedLessonIds.join(', ')} onChange={(v) => setEditing({ ...editing, relatedLessonIds: splitCommas(v) })} />
          </Editor>
        )
      }
    />
  );
}

// ── Blog manager ───────────────────────────────────────────────────────────────
interface BPost { id: string; title: string; slug?: string; subtitle: string; author: string; date: string; readMin: number; category: string; excerpt: string; tags: string[]; body: string }
const blankPost: BPost = { id: '', title: '', subtitle: '', author: 'L’équipe VC Premium', date: new Date().toISOString().slice(0, 10), readMin: 5, category: 'Réflexion', excerpt: '', tags: [], body: '' };

function BlogManager() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<BPost[]>([]);
  const [editing, setEditing] = useState<BPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { msg, flash } = useFlash();

  const load = () => api.get<BPost[]>('/admin/blog').then(setItems).catch(() => {});
  useEffect(() => { void load(); }, []);

  // Public pages read `/content/*` (not `/admin/*`); drop their cache so the
  // edit shows on the site (list + post detail) without a reload.
  const refreshSite = () => void queryClient.invalidateQueries({ queryKey: ['api'] });

  async function save() {
    if (!editing) return;
    setBusy(true); setError(null);
    try {
      const payload = { ...editing, readMin: Number(editing.readMin) || 5 };
      if (isNew) await api.post('/admin/blog', payload);
      else await api.put(`/admin/blog/${editing.id}`, payload);
      await load(); refreshSite(); setEditing(null); flash('Article enregistré');
    } catch (e) { setError(e instanceof ApiError ? e.message : 'Erreur'); }
    finally { setBusy(false); }
  }
  async function remove(id: string) { await api.del(`/admin/blog/${id}`).catch(() => {}); await load(); refreshSite(); if (editing?.id === id) setEditing(null); }

  return (
    <ManagerLayout
      flash={msg}
      list={<ListPanel title={`Analyses (${items.length})`} onNew={() => { setEditing({ ...blankPost }); setIsNew(true); }} items={items.map((p) => ({ id: p.id, title: p.title, subtitle: `${p.category} · ${p.date}`, onEdit: () => { setEditing(p); setIsNew(false); }, onDelete: () => remove(p.id) }))} />}
      editor={editing && (
        <Editor title={isNew ? 'Nouvel article' : `Modifier · ${editing.title}`} onClose={() => setEditing(null)} onSave={save} busy={busy} error={error}>
          <Input label="Titre" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Input label="Sous-titre" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Catégorie" value={editing.category} onChange={(v) => setEditing({ ...editing, category: v })} />
            <Input label="Date (AAAA-MM-JJ)" mono value={editing.date} onChange={(v) => setEditing({ ...editing, date: v })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Auteur" value={editing.author} onChange={(v) => setEditing({ ...editing, author: v })} />
            <Input label="Temps de lecture (min)" mono value={String(editing.readMin)} onChange={(v) => setEditing({ ...editing, readMin: Number(v) || 0 })} />
          </div>
          <Input label="Accroche" textarea rows={2} value={editing.excerpt} onChange={(v) => setEditing({ ...editing, excerpt: v })} />
          <Input label="Tags (virgules)" mono value={editing.tags.join(', ')} onChange={(v) => setEditing({ ...editing, tags: splitCommas(v) })} />
          <Input label="Corps (markdown : ## titre, **gras**, [[slug|terme]])" textarea rows={12} value={editing.body} onChange={(v) => setEditing({ ...editing, body: v })} />
        </Editor>
      )}
    />
  );
}

// ── Case manager ─────────────────────────────────────────────────────────────
interface CaseItem { id: string; slug: string; title: string; subtitle: string; kind: string; company: string; year: number; readMin: number; summary: string; tags: string[]; glossaryRefs: string[]; sections: { heading: string; body: string }[]; takeaways: string[] }

function CaseManager() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState<CaseItem[]>([]);
  const [editing, setEditing] = useState<CaseItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { msg, flash } = useFlash();

  const load = () => api.get<CaseItem[]>('/admin/case-studies').then(setItems).catch(() => {});
  useEffect(() => { void load(); }, []);

  async function save() {
    if (!editing) return;
    setBusy(true); setError(null);
    try {
      await api.put(`/admin/case-studies/${editing.id}`, { ...editing, year: Number(editing.year) || 2026, readMin: Number(editing.readMin) || 8 });
      await load();
      // Public detail page reads `/content/*`; drop its cache so the edit shows.
      void queryClient.invalidateQueries({ queryKey: ['api'] });
      setEditing(null); flash('Étude de cas enregistrée');
    } catch (e) { setError(e instanceof ApiError ? e.message : 'Erreur'); }
    finally { setBusy(false); }
  }

  return (
    <ManagerLayout
      flash={msg}
      list={<ListPanel title={`Études de cas (${items.length})`} items={items.map((c) => ({ id: c.id, title: c.title, subtitle: c.kind, onEdit: () => setEditing(c) }))} />}
      editor={editing && (
        <Editor title={`Modifier · ${editing.title}`} onClose={() => setEditing(null)} onSave={save} busy={busy} error={error}>
          <Input label="Titre" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Input label="Sous-titre" value={editing.subtitle} onChange={(v) => setEditing({ ...editing, subtitle: v })} />
          <Input label="Résumé" textarea rows={3} value={editing.summary} onChange={(v) => setEditing({ ...editing, summary: v })} />
          <div>
            <p className="mb-1.5 text-xs font-medium text-surface-variant">Sections</p>
            <div className="space-y-3">
              {editing.sections.map((s, i) => (
                <div key={i} className="rounded-xl border border-outline-variant p-3">
                  <div className="mb-2 flex items-center gap-2">
                    <input value={s.heading} onChange={(e) => { const sec = [...editing.sections]; sec[i] = { ...sec[i], heading: e.target.value }; setEditing({ ...editing, sections: sec }); }} className="w-full rounded-lg border border-outline-variant bg-surface-container-low px-2.5 py-1.5 text-sm font-medium outline-none" placeholder="Titre de section" />
                    <button onClick={() => setEditing({ ...editing, sections: editing.sections.filter((_, j) => j !== i) })} className="text-surface-variant hover:text-error"><Trash2 size={14} /></button>
                  </div>
                  <textarea value={s.body} onChange={(e) => { const sec = [...editing.sections]; sec[i] = { ...sec[i], body: e.target.value }; setEditing({ ...editing, sections: sec }); }} rows={3} className="w-full resize-y rounded-lg border border-outline-variant bg-surface-container-low px-2.5 py-1.5 text-sm outline-none" />
                </div>
              ))}
              <button onClick={() => setEditing({ ...editing, sections: [...editing.sections, { heading: '', body: '' }] })} className="btn-ghost w-full !py-2"><Plus size={15} /> Ajouter une section</button>
            </div>
          </div>
          <Input label="À retenir (une par ligne)" textarea rows={4} value={editing.takeaways.join('\n')} onChange={(v) => setEditing({ ...editing, takeaways: splitLines(v) })} />
        </Editor>
      )}
    />
  );
}

// ── Layout pieces ──────────────────────────────────────────────────────────────
function ManagerLayout({ list, editor, flash }: { list: React.ReactNode; editor: React.ReactNode; flash: string | null }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
      {list}
      <div>{editor ?? <div className="flex h-full min-h-[20rem] items-center justify-center rounded-2xl border border-dashed border-outline-variant text-sm text-surface-variant">Sélectionnez un élément à modifier, ou créez-en un.</div>}</div>
      <div role="status" aria-live="polite" className="sr-only">{flash}</div>
      {flash && <div className="fixed bottom-6 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-[color:var(--secondary)] px-4 py-2.5 text-sm text-[color:var(--on-secondary)] shadow-editorial-lg animate-fade-up">{flash}</div>}
    </div>
  );
}

function ListPanel({ title, items, onNew }: { title: string; onNew?: () => void; items: { id: string; title: string; subtitle: string; onEdit: () => void; onDelete?: () => void }[] }) {
  const [pendingDelete, setPendingDelete] = useState<{ title: string; onDelete: () => void } | null>(null);
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="eyebrow">{title}</p>
        {onNew && <button onClick={onNew} className="btn-ghost !py-1.5 !px-3 text-xs"><Plus size={14} /> Nouveau</button>}
      </div>
      <div className="max-h-[60vh] space-y-1.5 overflow-y-auto pr-1">
        {items.map((it) => (
          <div key={it.id} className="group flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3">
            <button onClick={it.onEdit} className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-medium">{it.title}</span>
              <span className="block truncate text-xs text-surface-variant">{it.subtitle}</span>
            </button>
            {it.onDelete && (
              <button
                onClick={() => setPendingDelete({ title: it.title, onDelete: it.onDelete! })}
                aria-label={`Supprimer ${it.title}`}
                className="rounded text-surface-variant opacity-0 transition-opacity hover:text-error focus-visible:opacity-100 group-hover:opacity-100"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        onClose={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete?.onDelete()}
        title="Supprimer cet élément ?"
        body={pendingDelete ? `« ${pendingDelete.title} » sera définitivement retiré du contenu publié.` : undefined}
      />
    </div>
  );
}

function Editor({ title, children, onClose, onSave, busy, error }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void; busy: boolean; error: string | null }) {
  return (
    <div className="rounded-2xl border border-outline-variant bg-surface-container-lowest p-6">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-headline text-headline-sm font-semibold">{title}</h3>
        <button onClick={onClose} className="text-surface-variant hover:text-foreground"><X size={18} /></button>
      </div>
      <div className="space-y-4">{children}</div>
      {error && <p className="mt-4 text-sm text-error">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button onClick={onClose} className="btn-quiet">Annuler</button>
        <button onClick={onSave} disabled={busy} className="btn-foil !py-2.5">{busy ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Enregistrer</button>
      </div>
    </div>
  );
}
