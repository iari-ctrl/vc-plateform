import { Link } from '@/i18n/routing';
import { Logo } from '@/components/ui/Logo';
import { FleuronDivider } from '@/components/ornaments/Ornaments';
import { ExLibris } from '@/components/ornaments/Illustrations';

const COLUMNS = [
  {
    title: 'Intelligence VC',
    links: [
      { to: '/intelligence', label: 'Vue d’ensemble' },
      { to: '/ecosystemes', label: 'Écosystèmes' },
      { to: '/convictions', label: 'Convictions' },
      { to: '/decisions', label: 'Décisions' },
      { to: '/simulators', label: 'Simulateurs' },
      { to: '/methode', label: 'Méthode' },
      { to: '/blog', label: 'Analyses' },
    ],
  },
  {
    title: 'Formation',
    links: [
      { to: '/paths', label: 'Parcours' },
      { to: '/bibliotheque', label: 'Bibliothèque' },
      { to: '/glossary', label: 'Dictionnaire' },
    ],
  },
  {
    title: 'Workspace',
    links: [
      { to: '/dashboard', label: 'Tableau de bord' },
      { to: '/notes', label: 'Notes & favoris' },
      { to: '/journal', label: 'Journal de décisions' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-[var(--content-max)] px-4 py-16 sm:px-6 lg:px-8">
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
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-4">{col.title}</p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-sm text-surface-variant transition-colors hover:text-foreground">
                      {l.label}
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
