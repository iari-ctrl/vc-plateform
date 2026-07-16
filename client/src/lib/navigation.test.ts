import { describe, expect, it } from 'vitest';
import {
  NAVIGATION_PILLARS,
  isNavigationItemActive,
  isNavigationPathActive,
  isNavigationPillarActive,
  navigationPillarForPath,
} from './navigation';

describe('navigation taxonomy', () => {
  it('exposes exactly the three canonical pillars', () => {
    expect(NAVIGATION_PILLARS.map(({ id, label, to }) => ({ id, label, to }))).toEqual([
      { id: 'intelligence', label: 'Intelligence VC', to: '/intelligence' },
      { id: 'formation', label: 'Formation', to: '/parcours' },
      { id: 'workspace', label: 'Workspace', to: '/dashboard' },
    ]);
  });

  it('keeps every displayed destination inside its pillar route map', () => {
    for (const pillar of NAVIGATION_PILLARS) {
      expect(pillar.routes, pillar.id).toContain(pillar.to);
      for (const child of pillar.children) {
        expect(pillar.routes, `${pillar.id}:${child.to}`).toContain(child.to);
      }
    }
  });

  it('maps every Formation route to the Formation pillar', () => {
    const formation = NAVIGATION_PILLARS.find((pillar) => pillar.id === 'formation')!;
    expect(formation.routes).toEqual(expect.arrayContaining([
      '/parcours',
      '/certifications',
      '/courses',
      '/lessons',
      '/bibliotheque',
      '/glossary',
    ]));
    expect(formation.children).toEqual(expect.arrayContaining([
      expect.objectContaining({ to: '/certifications', label: 'Certifications' }),
    ]));
    expect(formation.routes).not.toContain('/paths');

    for (const pathname of [
      '/parcours',
      '/parcours/devenir-analyst',
      '/certifications',
      '/certifications/analyste-en-capital-risque',
      '/courses/fondamentaux',
      '/lessons/power-law',
      '/bibliotheque',
      '/glossary/carry',
    ]) {
      expect(isNavigationPillarActive(pathname, formation), pathname).toBe(true);
      expect(navigationPillarForPath(pathname)?.id, pathname).toBe('formation');
    }
    expect(navigationPillarForPath('/paths')).toBeUndefined();
  });

  it('keeps Intelligence and Workspace detail routes in their pillar', () => {
    const cases = [
      ['/memos/sequoia-youtube', 'intelligence'],
      ['/anti-portfolio/airbnb', 'intelligence'],
      ['/livrables/memo-seed', 'intelligence'],
      ['/ecosystemes/ia-appliquee', 'intelligence'],
      ['/dashboard', 'workspace'],
      ['/notes', 'workspace'],
      ['/journal', 'workspace'],
      ['/profile', 'workspace'],
    ] as const;

    for (const [pathname, pillarId] of cases) {
      expect(navigationPillarForPath(pathname)?.id, pathname).toBe(pillarId);
    }
  });
});

describe('active route matching', () => {
  it('matches a route root and its descendants on segment boundaries', () => {
    expect(isNavigationPathActive('/blog', '/blog')).toBe(true);
    expect(isNavigationPathActive('/blog/article', '/blog')).toBe(true);
    expect(isNavigationPathActive('/blog/', '/blog')).toBe(true);
    expect(isNavigationPathActive('/blogue', '/blog')).toBe(false);
  });

  it('keeps the splash route exact and outside every pillar', () => {
    expect(isNavigationPathActive('/', '/')).toBe(true);
    expect(isNavigationPathActive('/home', '/')).toBe(false);
    expect(navigationPillarForPath('/')).toBeUndefined();
    expect(navigationPillarForPath('/home')).toBeUndefined();
  });

  it('computes child activity independently from pillar activity', () => {
    const intelligence = NAVIGATION_PILLARS[0];
    const analyses = intelligence.children.find((item) => item.to === '/blog')!;

    expect(isNavigationItemActive('/blog/article', analyses)).toBe(true);
    expect(isNavigationItemActive('/memos/example', analyses)).toBe(false);
    expect(isNavigationPillarActive('/memos/example', intelligence)).toBe(true);
  });
});
