import { useState } from 'react';
import { rootEcosystems, childEcosystems } from '@/content/ecosystems';
import { ECOSYSTEM_KIND_LABEL } from '@/content/labels';
import { EcosystemCard } from '@/components/cards';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';

export default function EcosystemsPage() {
  usePageMeta(
    'Décortiquer un écosystème',
    'Géographies, secteurs, thèses transverses : pour chaque écosystème, un dossier vivant — une thèse assumée, des convictions datées et falsifiables, et les signaux qui les départageront.',
  );
  const [kind, setKind] = useState('all');

  // Only top-level dossiers are listed; their deep-dives live one level down.
  const sorted = rootEcosystems();
  const kinds = [...new Set(sorted.map((d) => d.kind))];
  const visible = kind === 'all' ? sorted : sorted.filter((d) => d.kind === kind);
  // The featured hero only makes sense on the unfiltered view.
  const featured = kind === 'all' ? visible[0] : undefined;
  const rest = kind === 'all' ? visible.slice(1) : visible;

  return (
    <div className="mx-auto max-w-[var(--content-max)] px-4 py-14 sm:px-6 lg:px-8">
      <Reveal>
        <SectionHeading
          eyebrow="Décortiquer un écosystème"
          title="Lire un terrain comme un investisseur"
          description="Chaque dossier est un document vivant, signé et daté : une thèse assumée, des analyses structurées, des convictions falsifiables avec leur degré d'assurance, et les signaux concrets qui les confirmeront — ou les invalideront."
        />
      </Reveal>

      <Reveal className="mt-8">
        <div className="flex flex-wrap gap-2">
          {[{ id: 'all', label: 'Tous' }, ...kinds.map((k) => ({ id: k, label: ECOSYSTEM_KIND_LABEL[k] ?? k }))].map((f) => (
            <button
              key={f.id}
              onClick={() => setKind(f.id)}
              aria-pressed={kind === f.id}
              className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors ${kind === f.id ? 'border-[color:var(--primary)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-foreground' : 'border-outline-variant text-surface-variant hover:text-foreground'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Reveal>

      {featured && (
        <Reveal className="mt-8">
          <EcosystemCard dossier={featured} childCount={childEcosystems(featured.id).length} featured />
        </Reveal>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {rest.map((dossier, i) => (
          <Reveal key={dossier.id} delay={(i % 2) * 70}>
            <EcosystemCard dossier={dossier} childCount={childEcosystems(dossier.id).length} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
