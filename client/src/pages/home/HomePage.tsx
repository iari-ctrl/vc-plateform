import { Link } from '@/i18n/routing';
import { ArrowRight, Compass, BookOpen, Sparkles, Lock, Unlock, Play } from 'lucide-react';
import { PARCOURS } from '@/content/parcours';
import { SIMULATORS } from '@/content/simulators';
import { BLOG } from '@/content/blog';
import { BlogCard, SimulatorCard } from '@/components/cards';
import { SectionHeading, Reveal } from '@/components/ui/primitives';
import { Fleuron, FleuronDivider } from '@/components/ornaments/Ornaments';
import { CompassRose, Constellation, InkStamp, WaxSeal, DropCap, NightSkyBackdrop } from '@/components/ornaments/Illustrations';
import { usePageMeta } from '@/lib/seo';
import { useResumeLesson } from '@/hooks/useResumeLesson';

const STEPS = [
  { n: '01', icon: Compass, title: 'Comprendre qui vous êtes', text: 'Un onboarding introspectif inspiré de l’ikigai : pourquoi le capital-risque, et où se situe votre centre de gravité.' },
  { n: '02', icon: Sparkles, title: 'Tester votre alignement', text: 'Sept questions révèlent votre profil d’apprentissage — du débutant curieux au principal en devenir.' },
  { n: '03', icon: BookOpen, title: 'Apprendre selon votre niveau', text: 'Un parcours personnalisé, mais jamais enfermant : vous explorez librement, à votre rythme.' },
];

/** A few parcours seals drifting at the hero margins — the constellation made tangible. */
function DriftingSeals() {
  const seals = [
    { p: PARCOURS.find((x) => x.id === 'p-decouvrir-vc'), cls: 'left-[5%] top-[18%]', size: 56, delay: '0s', anim: 'animate-float' },
    { p: PARCOURS.find((x) => x.id === 'p-penser-gp'), cls: 'right-[7%] top-[14%]', size: 64, delay: '1.2s', anim: 'animate-float-slow' },
    { p: PARCOURS.find((x) => x.id === 'p-meilleur-analyst'), cls: 'left-[11%] bottom-[16%]', size: 50, delay: '0.6s', anim: 'animate-float-x' },
    { p: PARCOURS.find((x) => x.id === 'p-entretien-analyst'), cls: 'right-[10%] bottom-[20%]', size: 58, delay: '1.8s', anim: 'animate-float' },
    { p: PARCOURS.find((x) => x.id === 'p-term-sheet'), cls: 'right-[20%] top-[44%]', size: 44, delay: '2.4s', anim: 'animate-float-slow' },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 hidden lg:block" aria-hidden>
      {seals.map(
        (s, i) =>
          s.p && (
            <div key={i} className={`absolute ${s.cls} ${s.anim} opacity-80`} style={{ animationDelay: s.delay }}>
              <WaxSeal glyph={s.p.kanji ?? '◆'} accent={s.p.accent ?? 'var(--primary)'} size={s.size} />
            </div>
          ),
      )}
    </div>
  );
}

export default function HomePage() {
  usePageMeta(undefined, 'Comprendre le capital-risque, tester son alignement avec le métier, puis apprendre selon son niveau. Une plateforme éditoriale d’introspection et d’apprentissage.');
  const resume = useResumeLesson();

  return (
    <>
      {/* ── Hero ── */}
      <section className="map-paper grain relative isolate overflow-hidden">
        {/* Dark mode: a real starry sky behind the drawn lines (light mode keeps the parchment). */}
        <NightSkyBackdrop variant="hero" />
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(62% 52% at 50% 0%, color-mix(in srgb, var(--primary) 13%, transparent) 0%, transparent 72%)',
          }}
        />
        <Constellation className="pointer-events-none absolute inset-x-0 top-0 h-72 w-full opacity-60 dark:opacity-40 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <DriftingSeals />

        <div className="mx-auto max-w-[var(--content-max)] px-4 pb-20 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <CompassRose size={88} className="mx-auto mb-7 drop-shadow-[0_6px_16px_color-mix(in_srgb,var(--primary)_30%,transparent)]" />
              <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-1.5 text-xs font-medium text-surface-variant">
                <Fleuron className="text-[0.7rem]" /> École privée · memo d’investissement · carnet de réflexion
              </span>
              <h1 className="mt-7 font-headline text-[2.6rem] font-semibold leading-[1.05] tracking-tight text-balance sm:text-[3.75rem]">
                Comprendre le capital-risque,
                <span className="block italic text-[color:var(--primary)]">
                  avec sérieux et <span className="ink-underline">ambition.</span>
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-surface-variant text-pretty">
                Ne commencez pas par un catalogue de cours. Commencez par vous demander pourquoi le venture vous attire — puis apprenez le métier selon votre niveau, à votre rythme.
              </p>
              <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to="/onboarding" className="btn-foil sheen-host w-full sm:w-auto">
                  Commencer l’introspection <ArrowRight size={16} />
                </Link>
                <Link to="/paths" className="btn-ghost w-full sm:w-auto">
                  Explorer la carte des parcours
                </Link>
              </div>
              <p className="mt-5 text-xs text-surface-variant">Aucun compte requis. Aucun chapitre verrouillé.</p>
              {resume && (
                <Link
                  to={`/lessons/${resume.slug}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-4 py-2 text-sm text-surface-variant transition-colors hover:border-[color:var(--primary)] hover:text-foreground"
                >
                  <Play size={13} className="shrink-0 text-[color:var(--primary)]" />
                  Reprendre : <span className="font-medium text-foreground">{resume.title}</span>
                </Link>
              )}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <figure className="relative mx-auto mt-16 max-w-2xl rounded-2xl border border-outline-variant bg-surface-container-low/60 px-8 py-10 text-center">
              <InkStamp className="absolute -right-3 -top-3 sm:right-4 sm:top-4" label="Accès libre" date="Aucun mur" rotate={-7} />
              <Fleuron className="text-lg" />
              <blockquote className="mt-4 font-headline text-xl font-medium leading-snug text-balance sm:text-2xl">
                « L’ikigai n’est pas un point fixe à atteindre. C’est un centre de gravité qui se déplace avec toi. Le capital-risque, par sa temporalité longue — dix ans par fonds — force précisément à se demander : où sera ce centre dans une décennie ? »
              </blockquote>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ── Three steps ── */}
      <section className="mx-auto max-w-[var(--content-max)] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 100}>
              <div className="premium-card sheen-host flex h-full flex-col p-7">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-[color:var(--primary)]">
                    <s.icon size={18} />
                  </span>
                  <span className="font-mono text-sm text-surface-variant">{s.n}</span>
                </div>
                <h3 className="mt-5 font-headline text-headline-sm font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-surface-variant">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Liberté responsable ── */}
      <section className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-outline-variant bg-[color:var(--secondary)] text-[color:var(--on-secondary)]">
            <Constellation className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-30" hue="var(--primary)" />
            <div className="relative grid gap-8 p-8 sm:p-12 md:grid-cols-2 md:items-center">
              <div>
                <p className="font-mono text-[0.6875rem] uppercase tracking-[0.3em] text-[color:var(--primary)]">Liberté responsable</p>
                <h2 className="mt-4 font-headline text-display-sm font-semibold leading-tight text-balance">
                  Jamais de mur d’authentification.
                </h2>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-[color-mix(in_srgb,var(--on-secondary)_80%,transparent)]">
                  Explorez les parcours, lisez les cours, utilisez le dictionnaire et les simulateurs sans créer de compte. Un compte ne sert qu’à vous suivre : progression, notes, citations et favoris, synchronisés entre vos appareils.
                </p>
                <Link to="/blog/pourquoi-nous-ne-bloquons-aucun-chapitre" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-[color:var(--primary)]">
                  Lire notre manifeste <ArrowRight size={15} />
                </Link>
              </div>
              <div className="grid gap-3">
                {[
                  { icon: Unlock, t: 'Navigation publique', d: 'Tout le contenu principal est accessible librement.' },
                  { icon: Compass, t: 'Recommandations, pas contraintes', d: 'La progression est un repère, jamais une condition.' },
                  { icon: Lock, t: 'Vos données vous appartiennent', d: 'En invité, vos préférences restent sur votre appareil.' },
                ].map((item) => (
                  <div key={item.t} className="flex items-start gap-3 rounded-xl bg-white/5 px-4 py-3.5">
                    <item.icon size={17} className="mt-0.5 shrink-0 text-[color:var(--primary)]" />
                    <div>
                      <p className="text-sm font-semibold">{item.t}</p>
                      <p className="text-xs text-[color-mix(in_srgb,var(--on-secondary)_70%,transparent)]">{item.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ── Simulators ── */}
      <section className="mx-auto max-w-[var(--content-max)] px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Apprendre en manipulant" title="Des simulateurs, pas des slides" description="Dilution, valorisation, waterfall, fund returns : touchez du doigt la mécanique financière du venture." />
            <Link to="/simulators" className="btn-quiet shrink-0">Tous les simulateurs <ArrowRight size={15} /></Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SIMULATORS.slice(0, 3).map((s, i) => (
            <Reveal key={s.id} delay={i * 80}>
              <SimulatorCard sim={s} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Analyses ── */}
      <section className="mx-auto max-w-[var(--content-max)] px-4 pb-8 sm:px-6 lg:px-8">
        <FleuronDivider className="mb-12" />
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Analyses & recherche" title="Penser le venture, pas seulement l’apprendre" />
            <Link to="/blog" className="btn-quiet shrink-0">Toutes les analyses <ArrowRight size={15} /></Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {BLOG.slice(0, 2).map((post, i) => (
            <Reveal key={post.id} delay={i * 80}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="mx-auto max-w-[var(--content-max)] px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--primary)_30%,transparent)] bg-[color-mix(in_srgb,var(--primary)_6%,transparent)] px-8 py-14 text-center">
            <div className="mx-auto flex max-w-2xl flex-col items-center">
              <DropCap letter="?" size={72} className="mb-2 animate-float-slow" />
              <h2 className="mt-2 font-headline text-display-sm font-semibold leading-tight text-balance">
                Où sera votre centre de gravité dans une décennie ?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-surface-variant">
                Sept questions pour commencer. Aucune obligation, aucune inscription.
              </p>
              <Link to="/onboarding" className="btn-foil sheen-host mt-8">
                Faire le test d’orientation <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
