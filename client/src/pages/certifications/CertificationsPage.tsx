import { Link } from 'react-router-dom';
import { ArrowRight, Award, BookOpen, Landmark } from 'lucide-react';
import { CERTIFICATIONS, domainById } from '@/content/certifications';
import { Reveal } from '@/components/ui/primitives';
import { usePageMeta } from '@/lib/seo';

const CERTIFICATE_TYPE_LABEL = {
  knowledge: 'Certificat de savoirs',
  competence: 'Certificat pratique',
  professional: 'Certification pro',
} as const;

const AVAILABILITY_LABEL = {
  'in-construction': 'En construction',
  open: 'Ouverte',
  closed: 'Fermée',
} as const;

export default function CertificationsPage() {
  usePageMeta(
    'Certifications professionnelles',
    'Certifications internes évaluées de la plateforme, fondées sur des compétences démontrées et une validation experte.',
  );

  const published = CERTIFICATIONS.filter((certification) => certification.status === 'published');

  return (
    <div className="overflow-hidden">
      <section className="relative isolate border-b border-outline-variant bg-surface-container-low/30">
        <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <Reveal>
            <div className="max-w-3xl">
              <p className="eyebrow flex items-center gap-2"><Landmark aria-hidden="true" size={14} /> Certifications</p>
              <h1 className="mt-5 font-headline text-display-md font-semibold leading-[1.03] tracking-tight text-balance">
                Attester une compétence démontrée.
              </h1>
              <p className="mt-4 text-base text-surface-variant">Parcours, livrables, évaluation, jury.</p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-headline text-headline-lg font-semibold">Capital-risque</h2>
          <p className="font-mono text-xs uppercase tracking-wider text-surface-variant tabular-nums">{published.length} certification publiée</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {published.map((certification) => {
            const domain = domainById(certification.domainId);
            return (
              <Reveal key={certification.id}>
                <Link
                  to={`/certifications/${certification.slug}`}
                  className="premium-card premium-card-hover sheen-host group relative isolate flex min-h-[20rem] flex-col overflow-hidden p-7 sm:p-8"
                >
                  <div aria-hidden className="absolute -right-20 -top-20 -z-10 h-64 w-64 rounded-full border border-[color-mix(in_srgb,var(--primary)_20%,transparent)]" />
                  <div aria-hidden className="absolute -right-12 -top-12 -z-10 h-48 w-48 rounded-full border border-[color-mix(in_srgb,var(--primary)_30%,transparent)]" />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.18em] text-surface-variant">
                      <Award aria-hidden="true" size={14} className="text-[color:var(--primary)]" /> {CERTIFICATE_TYPE_LABEL[certification.certificateType]}
                    </span>
                    <span className="chip !border-[color-mix(in_srgb,var(--primary)_40%,transparent)] !text-[color:var(--on-primary-container)]">{AVAILABILITY_LABEL[certification.availability]}</span>
                  </div>
                  <div className="mt-9">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.2em] text-surface-variant">Domaine · {domain?.title}</p>
                    <h3 className="mt-4 max-w-xl font-headline text-display-sm font-semibold leading-[1.06] tracking-tight transition-colors group-hover:text-[color:var(--primary)]">
                      {certification.shortTitle}
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-surface-variant">{certification.summary}</p>
                  </div>
                  <div className="mt-auto flex flex-wrap items-end justify-between gap-5 pt-8">
                    <span className="inline-flex items-center gap-1.5 text-xs text-surface-variant"><BookOpen aria-hidden="true" size={14} /> {certification.coreRequirements.length} cours · options</span>
                    <span className="inline-flex items-center gap-2 font-medium text-[color:var(--on-primary-container)]">
                      Voir le parcours <ArrowRight aria-hidden="true" size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </div>
  );
}
