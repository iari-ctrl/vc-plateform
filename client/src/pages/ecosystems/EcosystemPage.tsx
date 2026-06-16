import { useParams } from 'react-router-dom';
import { Link } from '@/i18n/routing';
import { ChevronRight, Clock, Compass, Crosshair, ExternalLink, Layers, Radar, Users } from 'lucide-react';
import {
  ecosystemBySlug, childEcosystems, ecosystemAncestors, rootEcosystems,
  CONVICTION_STRENGTH_META, SIGNAL_DIRECTION_META,
} from '@/content/ecosystems';
import { ECOSYSTEM_KIND_LABEL } from '@/content/labels';
import { ActiveProse } from '@/components/reading/ActiveProse';
import { BookmarkButton } from '@/components/ui/BookmarkButton';
import { EcosystemCard, GlossaryRefList } from '@/components/cards';
import { EcosystemFigureView } from '@/components/ecosystems/EcosystemFigures';
import { FleuronDivider } from '@/components/ornaments/Ornaments';
import { formatDateFr } from '@/lib/utils';
import { usePageMeta } from '@/lib/seo';
import NotFoundPage from '@/pages/system/NotFoundPage';

export default function EcosystemPage() {
  const { slug } = useParams();
  const dossier = slug ? ecosystemBySlug(slug) : undefined;
  usePageMeta(dossier ? `${dossier.name} — décorticage` : undefined, dossier?.summary, { type: 'article' });

  if (!dossier) return <NotFoundPage />;

  const ancestors = ecosystemAncestors(dossier);
  const children = childEcosystems(dossier.id);
  const convictions = dossier.convictions ?? [];
  const signals = dossier.signals ?? [];
  const players = dossier.players ?? [];
  const sources = dossier.sources ?? [];
  // "À décortiquer ensuite" only makes sense between top-level ecosystems;
  // inside a tree, the breadcrumb (up) and sub-dossiers (down) carry navigation.
  const related = dossier.parentId
    ? []
    : rootEcosystems()
        .filter((d) => d.id !== dossier.id && (d.kind === dossier.kind || d.tags.some((t) => dossier.tags.includes(t))))
        .slice(0, 2);
  const wasRevised = dossier.updatedAt !== dossier.createdAt;

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      {/* Breadcrumb — Écosystèmes › …ancêtres › dossier courant */}
      <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-surface-variant">
        <Link to="/ecosystemes" className="transition-colors hover:text-foreground">Écosystèmes</Link>
        {ancestors.map((a) => (
          <span key={a.id} className="flex items-center gap-x-1.5">
            <ChevronRight size={14} className="shrink-0 opacity-60" />
            <Link to={`/ecosystemes/${a.slug}`} className="transition-colors hover:text-foreground">{a.name}</Link>
          </span>
        ))}
        <ChevronRight size={14} className="shrink-0 opacity-60" />
        <span className="font-medium text-foreground">{dossier.name}</span>
      </nav>

      <header>
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="chip" style={{ color: dossier.accent }}>{ECOSYSTEM_KIND_LABEL[dossier.kind] ?? dossier.kind}</span>
            <span className="chip">{dossier.name}</span>
          </div>
          <BookmarkButton item={{ itemType: 'ecosystem', itemId: dossier.id, title: dossier.title, href: `/ecosystemes/${dossier.slug}` }} />
        </div>
        <h1 className="mt-4 font-headline text-display-sm font-semibold leading-[1.1] tracking-tight text-balance">{dossier.title}</h1>
        <p className="mt-3 font-headline text-headline-sm italic text-surface-variant">{dossier.subtitle}</p>
        <p className="mt-4 text-lg leading-relaxed text-surface-variant text-pretty">{dossier.summary}</p>
        <div className="mt-5 flex flex-wrap items-center gap-4 border-y border-outline-variant py-3 text-sm text-surface-variant">
          <span className="font-medium text-foreground">{dossier.author}</span>
          <span>{formatDateFr(dossier.createdAt)}</span>
          {wasRevised && <span>Révisé le {formatDateFr(dossier.updatedAt)}</span>}
          <span className="inline-flex items-center gap-1.5"><Clock size={14} /> {dossier.readMin} min</span>
        </div>
      </header>

      {/* La thèse — central, dated claim (root dossiers; optional on sub-dossiers) */}
      {dossier.these && (
        <section className="mt-8 rounded-2xl border-l-[3px] bg-surface-container-low/60 p-6 sm:p-7" style={{ borderLeftColor: dossier.accent }}>
          <p className="eyebrow mb-4 flex items-center gap-2" style={{ color: dossier.accent }}><Compass size={14} /> La thèse</p>
          <ActiveProse source={dossier.these} sourceType="ecosystem" sourceId={dossier.id} sourceTitle={dossier.title} />
        </section>
      )}

      {/* Les analyses, section par section */}
      {dossier.sections.map((s) => (
        <section key={s.heading} className="mt-12">
          <h2 className="mb-4 font-headline text-headline-md font-semibold leading-tight">{s.heading}</h2>
          <ActiveProse source={s.body} sourceType="ecosystem" sourceId={dossier.id} sourceTitle={dossier.title} />
          {s.figures?.map((fig, fi) => (
            <EcosystemFigureView key={fi} figure={fig} accent={dossier.accent} />
          ))}
        </section>
      ))}

      {/* Convictions — datées, falsifiables, avec degré d'assurance affiché */}
      {convictions.length > 0 && (
        <section className="mt-14">
          <FleuronDivider className="mb-8" />
          <p className="eyebrow mb-2 flex items-center gap-2"><Crosshair size={14} /> Convictions</p>
          <p className="mb-5 text-sm text-surface-variant">Des affirmations spécifiques, datées et falsifiables — avec leur degré d'assurance assumé. Le contraire d'une opinion : quelque chose qu'on pourra confronter à la réalité.</p>
          <div className="space-y-4">
            {convictions.map((c, i) => {
              const meta = CONVICTION_STRENGTH_META[c.strength];
              return (
                <div key={i} className="rounded-2xl border border-outline-variant p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="chip !py-0.5" style={{ color: meta.accent }}>{meta.label}</span>
                    {c.horizon && <span className="chip !py-0.5 font-mono">Horizon {c.horizon}</span>}
                  </div>
                  <p className="mt-3 text-[1.0625rem] font-medium leading-relaxed text-pretty">{c.statement}</p>
                  {c.rationale && (
                    <div className="mt-3 border-t border-dashed border-outline-variant pt-3 text-sm">
                      <ActiveProse source={c.rationale} sourceType="ecosystem" sourceId={dossier.id} sourceTitle={dossier.title} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Signaux — ce qui confirmera ou invalidera la thèse */}
      {signals.length > 0 && (
        <section className="mt-12">
          <p className="eyebrow mb-2 flex items-center gap-2"><Radar size={14} /> Ce que nous surveillons</p>
          <p className="mb-5 text-sm text-surface-variant">Les indicateurs concrets qui départageront les convictions ci-dessus — et la lecture qu'on en ferait.</p>
          <div className="overflow-hidden rounded-2xl border border-outline-variant">
            <dl className="divide-y divide-outline-variant">
              {signals.map((s, i) => {
                const meta = SIGNAL_DIRECTION_META[s.direction];
                return (
                  <div key={i} className="px-5 py-4">
                    <dt className="flex items-start justify-between gap-4">
                      <span className="font-medium leading-snug">{s.label}</span>
                      <span className="shrink-0 font-mono text-xs" style={{ color: meta.accent }} title={meta.label}>
                        {meta.glyph} {meta.label}
                      </span>
                    </dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-surface-variant">{s.note}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </section>
      )}

      {/* Acteurs structurants */}
      {players.length > 0 && (
        <section className="mt-12">
          <p className="eyebrow mb-5 flex items-center gap-2"><Users size={14} /> Les acteurs qui structurent le terrain</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {players.map((p) => (
              <div key={p.name} className="rounded-2xl border border-outline-variant p-5">
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-headline text-headline-sm font-semibold leading-tight">{p.name}</p>
                  <span className="chip !py-0.5">{p.role}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-surface-variant">{p.note}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Sous-dossiers — l'approfondissement, un cran plus bas dans l'arbre */}
      {children.length > 0 && (
        <section className="mt-14">
          <FleuronDivider className="mb-8" />
          <p className="eyebrow mb-2 flex items-center gap-2"><Layers size={14} /> Approfondir</p>
          <p className="mb-5 text-sm text-surface-variant">Les éléments qui méritaient leur propre analyse sont décortiqués dans les sous-dossiers ci-dessous.</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {children.map((c) => (
              <EcosystemCard key={c.id} dossier={c} childCount={childEcosystems(c.id).length} />
            ))}
          </div>
        </section>
      )}

      {dossier.tags.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {dossier.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
        </div>
      )}

      {/* Sources */}
      {sources.length > 0 && (
        <section className="mt-10">
          <p className="eyebrow mb-4">Sources</p>
          <ul className="space-y-2.5">
            {sources.map((s, i) => (
              <li key={i}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-start gap-2 text-sm leading-relaxed text-surface-variant transition-colors hover:text-[color:var(--primary)]">
                  <ExternalLink size={14} className="mt-0.5 shrink-0" />
                  <span className="underline decoration-outline-variant underline-offset-2 group-hover:decoration-current">{s.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {dossier.glossaryRefs.length > 0 && (
        <div className="mt-10">
          <GlossaryRefList slugs={dossier.glossaryRefs} title="Pour aller plus loin" />
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-14">
          <FleuronDivider className="mb-8" />
          <p className="eyebrow mb-5">À décortiquer ensuite</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((d) => <EcosystemCard key={d.id} dossier={d} childCount={childEcosystems(d.id).length} />)}
          </div>
        </section>
      )}
    </article>
  );
}
