import { Link } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { HOME_FORMATION, HOME_INTELLIGENCE } from '@/components/chrome/homeBar';
import { FleuronDivider } from '@/components/ornaments/Ornaments';
import { ExLibris } from '@/components/ornaments/Illustrations';
import { NAVIGATION_PILLARS } from '@/lib/navigation';
import { cn } from '@/lib/utils';

const FOOTER_SHELL = 'border-t border-outline-variant bg-surface-container-low';
const FOOTER_CONTAINER = 'mx-auto max-w-[var(--content-max)] px-4 sm:px-6 lg:px-8';

/** The home footer mirrors the two poles of the home bar — nothing else. */
export function HomeFooter() {
  return (
    <footer className={FOOTER_SHELL}>
      <div
        className={cn(
          FOOTER_CONTAINER,
          'flex flex-col gap-5 py-8 text-sm text-surface-variant lg:flex-row lg:items-center lg:justify-between',
        )}
      >
        <div>
          <Logo />
          <p className="mt-3 max-w-xl leading-relaxed">
            Accueil public centré sur deux entrées : apprendre avec la Formation, analyser avec Intelligence VC.
          </p>
        </div>
        <nav aria-label="Liens d’accueil" className="flex flex-wrap gap-3 sm:gap-4">
          {[HOME_FORMATION, HOME_INTELLIGENCE].map((pillar) => (
            <Link key={pillar.id} to={pillar.to} className="font-mono text-xs uppercase tracking-[0.22em] transition-colors hover:text-foreground">
              {pillar.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

export function Footer() {
  return (
    <footer className={cn('mt-24', FOOTER_SHELL)}>
      <div className={cn(FOOTER_CONTAINER, 'py-16')}>
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-4 text-sm leading-relaxed text-surface-variant">
              Transformer l’information VC en dossiers, convictions, décisions et apprentissages structurés — sans déplacer les contenus hors de leurs URLs canoniques.
            </p>
            <p className="mt-4 font-headline text-sm italic text-surface-variant">
              « L’ikigai n’est pas un point fixe à atteindre. C’est un centre de gravité qui se déplace avec toi. »
            </p>
            <ExLibris owner="L’explorateur" num="Tabula Ventura · MMXXVI" className="mt-6 max-w-[230px]" />
          </div>
          {NAVIGATION_PILLARS.map((pillar) => (
            <div key={pillar.id}>
              <p className="eyebrow mb-4">{pillar.label}</p>
              <ul className="space-y-2.5">
                {pillar.children.map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-sm text-surface-variant transition-colors hover:text-foreground">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <FleuronDivider className="my-10" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-surface-variant sm:flex-row">
          <p>© {new Date().getFullYear()} VC Premium Experience — une plateforme d’intelligence VC.</p>
          <p className="font-mono">Analyser, apprendre, décider.</p>
        </div>
      </div>
    </footer>
  );
}
