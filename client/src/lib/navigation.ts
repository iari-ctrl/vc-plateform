import {
  BookA,
  Crosshair,
  FileText,
  FlaskConical,
  LayoutDashboard,
  Library,
  Map,
  Microscope,
  Newspaper,
  NotebookPen,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';

export type NavigationItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export type NavigationPillar = NavigationItem & {
  id: 'intelligence' | 'formation' | 'workspace';
  children: readonly NavigationItem[];
  /** Route roots that belong to the pillar, including non-index detail pages. */
  routes: readonly string[];
};

/**
 * The single navigation taxonomy shared by the top bar, side rail and footer.
 *
 * `children` are the destinations rendered in expanded navigation. `routes`
 * also includes detail-only sections so their parent pillar remains active.
 */
export const NAVIGATION_PILLARS = [
  {
    id: 'intelligence',
    to: '/intelligence',
    label: 'Intelligence VC',
    icon: Microscope,
    children: [
      { to: '/intelligence', label: 'Vue d’ensemble', icon: Microscope },
      { to: '/ecosystemes', label: 'Écosystèmes', icon: Microscope },
      { to: '/convictions', label: 'Convictions', icon: Crosshair },
      { to: '/decisions', label: 'Décisions', icon: ScrollText },
      { to: '/simulators', label: 'Simulateurs', icon: FlaskConical },
      { to: '/methode', label: 'Méthode', icon: FileText },
      { to: '/blog', label: 'Analyses', icon: Newspaper },
    ],
    routes: [
      '/intelligence',
      '/ecosystemes',
      '/convictions',
      '/decisions',
      '/simulators',
      '/methode',
      '/blog',
      '/cases',
      '/livrables',
      '/anti-portfolio',
      '/memos',
    ],
  },
  {
    id: 'formation',
    to: '/parcours',
    label: 'Formation',
    icon: Map,
    children: [
      { to: '/parcours', label: 'Parcours', icon: Map },
      { to: '/bibliotheque', label: 'Bibliothèque', icon: Library },
      { to: '/glossary', label: 'Dictionnaire', icon: BookA },
    ],
    routes: [
      '/parcours',
      '/courses',
      '/lessons',
      '/bibliotheque',
      '/glossary',
    ],
  },
  {
    id: 'workspace',
    to: '/dashboard',
    label: 'Workspace',
    icon: LayoutDashboard,
    children: [
      { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { to: '/notes', label: 'Notes & favoris', icon: NotebookPen },
      { to: '/journal', label: 'Journal de décisions', icon: Crosshair },
    ],
    routes: ['/dashboard', '/notes', '/journal', '/profile'],
  },
] as const satisfies readonly NavigationPillar[];

function normalizePath(path: string): string {
  const pathname = path.split(/[?#]/, 1)[0] || '/';
  const withLeadingSlash = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return withLeadingSlash === '/' ? '/' : withLeadingSlash.replace(/\/+$/, '');
}

/** Match one route root without false positives such as `/blogue` for `/blog`. */
export function isNavigationPathActive(pathname: string, route: string): boolean {
  const current = normalizePath(pathname);
  const target = normalizePath(route);
  return target === '/' ? current === '/' : current === target || current.startsWith(`${target}/`);
}

export function isNavigationItemActive(pathname: string, item: NavigationItem): boolean {
  return isNavigationPathActive(pathname, item.to);
}

export function isNavigationPillarActive(pathname: string, pillar: NavigationPillar): boolean {
  return pillar.routes.some((route) => isNavigationPathActive(pathname, route));
}

export function navigationPillarForPath(pathname: string): NavigationPillar | undefined {
  return NAVIGATION_PILLARS.find((pillar) => isNavigationPillarActive(pathname, pillar));
}
