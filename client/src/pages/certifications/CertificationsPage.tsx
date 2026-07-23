import { ArrowRight, Award, BookOpen, Landmark, Layers3, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

import { CERTIFICATIONS, DOMAINS, domainById } from '@/content/certifications';
import type { Certification } from '@/content/certificationTypes';
import { usePageMeta } from '@/lib/seo';

const CERTIFICATE_TYPE_LABEL: Record<Certification['certificateType'], string> = {
  knowledge: 'Certificat de connaissances',
  professional: 'Certification professionnelle',
};

const AVAILABILITY_LABEL: Record<Certification['availability'], string> = {
  'in-construction': 'En construction',
  open: 'Disponible',
  closed: 'Fermée',
};

export default function CertificationsPage() {
  usePageMeta(
    'Certifications',
    'Programmes de certification publiés, avec leurs compétences visées, leur préparation et leurs modalités d’évaluation.',
  );

  const published = CERTIFICATIONS.filter((certification) => certification.status === 'published');
  const publishedByDomain = DOMAINS.map((domain) => ({
    domain,
    certifications: published.filter((certification) => certification.domainId === domain.id),
  })).filter(({ certifications }) => certifications.length > 0);

  return (
    <div className="overflow-hidden">
      <header className="border-b border-outline-variant bg-surface-container-low/30">
        <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="eyebrow flex items-center gap-2">
                <Landmark aria-hidden="true" size={14} /> Certifications
              </p>
              <h1 className="mt-5 font-headline text-display-md font-semibold leading-[1.03] tracking-tight text-balance">
                Évaluer des connaissances et des pratiques professionnelles
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-surface-variant text-pretty">
                Chaque programme précise les compétences visées, les contenus de préparation, les modalités d’évaluation et la portée du résultat obtenu.
              </p>
            </div>
            <Link to="/certifications/niveaux" className="btn-ghost shrink-0">
              <Layers3 aria-hidden="true" size={15} /> Voir les niveaux VC Analyst
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="space-y-14">
          {publishedByDomain.map(({ domain, certifications }) => (
            <section key={domain.id} aria-labelledby={`${domain.id}-certifications-title`}>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-outline-variant pb-6">
                <div className="max-w-3xl">
                  <p className="eyebrow">Programmes publiés</p>
                  <h2
                    id={`${domain.id}-certifications-title`}
                    className="mt-3 font-headline text-headline-lg font-semibold text-balance"
                  >
                    {domain.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-surface-variant text-pretty">{domain.description}</p>
                </div>
                <p className="font-mono text-xs uppercase text-surface-variant tabular-nums">
                  {certifications.length} {certifications.length > 1 ? 'fiches' : 'fiche'}
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {certifications.map((certification) => (
                  <CertificationCard key={certification.id} certification={certification} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function CertificationCard({ certification }: { certification: Certification }) {
  const domain = domainById(certification.domainId);
  const requirements = certification.certificateType === 'knowledge'
    ? certification.coreRequirements
    : certification.recommendedPreparation;
  const lessonCount = new Set(requirements.flatMap((requirement) => requirement.lessonIds)).size;
  const programLabel = certification.certificateType === 'knowledge'
    ? `${requirements.length} blocs · ${lessonCount} leçons`
    : `${requirements.length} blocs recommandés · ${lessonCount} leçons`;

  return (
    <Link
      to={`/certifications/${certification.slug}`}
      className="premium-card premium-card-hover group flex min-h-[21rem] flex-col p-7 sm:p-8"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-surface-variant">
          <Award aria-hidden="true" size={14} className="text-[color:var(--primary)]" />
          {CERTIFICATE_TYPE_LABEL[certification.certificateType]}
        </span>
        <span className="chip">{AVAILABILITY_LABEL[certification.availability]}</span>
      </div>

      <div className="mt-9">
        <p className="text-xs font-medium text-surface-variant">{domain?.title}</p>
        <h3 className="mt-3 max-w-xl font-headline text-display-sm font-semibold leading-[1.06] tracking-tight text-balance">
          {certification.shortTitle}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-surface-variant text-pretty">{certification.summary}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-end justify-between gap-5 border-t border-outline-variant pt-7">
        <div className="space-y-2 text-xs text-surface-variant">
          <span className="flex items-center gap-2">
            <BookOpen aria-hidden="true" size={14} /> {programLabel}
          </span>
          <span className="flex items-center gap-2">
            <Scale aria-hidden="true" size={14} />
            {certification.certificateType === 'knowledge' ? 'Évaluation locale' : 'Évaluation professionnelle'}
          </span>
        </div>
        <span className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--on-primary-container)]">
          Consulter la fiche
          <ArrowRight aria-hidden="true" size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
