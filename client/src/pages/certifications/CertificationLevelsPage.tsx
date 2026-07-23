import { ArrowLeft, ArrowRight, Check, CircleDashed, Layers3 } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CERTIFICATION_LEVELS } from '@/content/certificationLevels';
import { certificationById } from '@/content/certifications';
import type { CertificationLevelPromise } from '@/content/certificationTypes';
import { usePageMeta } from '@/lib/seo';
import { cn } from '@/lib/utils';

const CATEGORY_LABEL: Record<CertificationLevelPromise['category'], string> = {
  knowledge: 'Certificat de connaissances',
  professional: 'Certification professionnelle',
};

const STATUS_LABEL: Record<CertificationLevelPromise['status'], string> = {
  available: 'Disponible',
  'in-construction': 'En construction',
  future: 'Cadre futur',
};

export default function CertificationLevelsPage() {
  usePageMeta(
    'Les cinq niveaux de certification',
    'Vue d’ensemble des niveaux VC Analyst, VC Associate Foundations, VC Associate, VC Senior Associate et VC Principal.',
  );

  const levels = [...CERTIFICATION_LEVELS].sort((a, b) => a.order - b.order);

  return (
    <div className="overflow-hidden">
      <header className="border-b border-outline-variant bg-surface-container-low/30">
        <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Link to="/certifications" className="btn-quiet mb-7 -ml-3">
            <ArrowLeft aria-hidden="true" size={15} /> Certifications
          </Link>
          <div className="max-w-3xl">
            <p className="eyebrow flex items-center gap-2">
              <Layers3 aria-hidden="true" size={14} /> Architecture des titres
            </p>
            <h1 className="mt-5 font-headline text-display-md font-semibold leading-[1.03] tracking-tight text-balance">
              Cinq niveaux, une progression de responsabilités
            </h1>
            <p className="mt-4 text-base leading-relaxed text-surface-variant text-pretty">
              Les niveaux distinguent l’acquisition du socle, la production d’analyses et l’autonomie croissante dans un fonds. Seuls les niveaux disposant d’un référentiel publié ouvrent une fiche détaillée.
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 max-w-2xl">
          <p className="eyebrow">Échelle de certification</p>
          <h2 className="mt-3 font-headline text-headline-lg font-semibold text-balance">Promesse de chaque niveau</h2>
          <p className="mt-3 text-sm leading-relaxed text-surface-variant text-pretty">
            Les statuts décrivent l’état réel du programme. Ils ne constituent ni une durée annoncée, ni un seuil d’évaluation, ni un engagement de cours pour les niveaux futurs.
          </p>
        </div>

        <ol className="border-y border-outline-variant">
          {levels.map((level) => (
            <LevelRow key={level.id} level={level} />
          ))}
        </ol>
      </div>
    </div>
  );
}

function LevelRow({ level }: { level: CertificationLevelPromise }) {
  const certification = level.certificationId ? certificationById(level.certificationId) : undefined;
  const detailHref = certification?.status === 'published' ? `/certifications/${certification.slug}` : undefined;

  return (
    <li className="grid gap-5 border-b border-outline-variant py-8 last:border-b-0 md:grid-cols-[4rem_minmax(0,0.72fr)_minmax(0,1.28fr)] md:gap-8 lg:py-10">
      <div className="flex items-center justify-between gap-4 md:block">
        <span className="font-mono text-sm text-surface-variant tabular-nums" aria-label={`Niveau ${level.order}`}>
          {String(level.order).padStart(2, '0')}
        </span>
        <LevelStatus status={level.status} className="md:hidden" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-surface-variant">{CATEGORY_LABEL[level.category]}</p>
        <h3 className="mt-2 font-headline text-headline-md font-semibold leading-tight text-balance">{level.title}</h3>
        <LevelStatus status={level.status} className="mt-4 hidden md:inline-flex" />
        <p className="mt-4 text-sm leading-relaxed text-surface-variant text-pretty">{level.audience}</p>
        {detailHref && (
          <Link to={detailHref} className="btn-quiet mt-5 -ml-4">
            Consulter la fiche <ArrowRight aria-hidden="true" size={14} />
          </Link>
        )}
      </div>

      <div className="min-w-0 md:border-l md:border-outline-variant md:pl-8">
        <p className="font-headline text-headline-sm font-semibold leading-snug text-balance">{level.promise}</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium text-surface-variant">Périmètre</p>
            <ul className="mt-3 space-y-2">
              {level.scope.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-pretty">
                  <Check aria-hidden="true" size={14} className="mt-1 shrink-0 text-success" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-medium text-surface-variant">Hors périmètre</p>
            <ul className="mt-3 space-y-2">
              {level.exclusions.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-surface-variant text-pretty">
                  <CircleDashed aria-hidden="true" size={14} className="mt-1 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

function LevelStatus({
  status,
  className,
}: {
  status: CertificationLevelPromise['status'];
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium',
        status === 'available' && 'border-[color-mix(in_srgb,var(--success)_45%,transparent)] text-success',
        status === 'in-construction' && 'border-[color-mix(in_srgb,var(--primary)_45%,transparent)] text-[color:var(--on-primary-container)]',
        status === 'future' && 'border-outline-variant text-surface-variant',
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
