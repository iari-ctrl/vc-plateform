// @vitest-environment jsdom
import '@/test/setupDom';

import { Link, Route, Routes } from 'react-router-dom';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { HOME_BAR_WORDMARK_ACCENT, HOME_FORMATION, HOME_INTELLIGENCE } from '@/components/chrome/homeBar';
import { ThemeProvider } from '@/context/ThemeProvider';
import { UIProvider } from '@/context/UIProvider';
import { UserDataProvider } from '@/context/UserDataProvider';
import { MainLayout } from '@/layouts/MainLayout';
import { renderAppAt, renderWithRouter } from '@/test/renderApp';

const curtain = () => document.querySelector<HTMLElement>('.home-intro');

const compactHomeMatchMedia = (query: string): MediaQueryList => ({
  matches: query === '(max-width: 767px)',
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
});

function IntroRoutes() {
  return (
    <ThemeProvider>
      <UserDataProvider>
        <UIProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route
                path="ailleurs"
                element={
                  <div>
                    <h1>Ailleurs</h1>
                    <Link to="/home">Vers l’accueil</Link>
                  </div>
                }
              />
              <Route path="home" element={<h1>Accueil</h1>} />
            </Route>
          </Routes>
        </UIProvider>
      </UserDataProvider>
    </ThemeProvider>
  );
}

describe('entrée de l’accueil — le relais entre le portail et /home', () => {
  it('joue le rideau à l’arrivée sur /home et met la barre fixe en retrait', async () => {
    renderAppAt('/home');

    const banner = await screen.findByRole('banner');
    const overlay = curtain();

    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveAttribute('aria-hidden', 'true');
    expect(banner).toHaveClass('home-topbar-suppressed');
  });

  it('assemble un en-tête temporaire — marque, ligne et deux pôles — hors de l’arbre accessible', async () => {
    renderAppAt('/home');
    await screen.findByRole('banner');

    const overlay = curtain() as HTMLElement;

    expect(overlay.querySelector('.home-intro-veil')).toBeInTheDocument();
    expect(overlay.querySelector('.home-intro-rule')).toBeInTheDocument();
    expect(within(overlay).getByText('Sapience VC')).toBeInTheDocument();
    expect(within(overlay).getByText(HOME_FORMATION.label)).toBeInTheDocument();
    expect(within(overlay).getByText(HOME_INTELLIGENCE.label)).toBeInTheDocument();

    // Nothing inside the curtain is exposed: the real bar keeps the roles.
    expect(within(overlay).queryAllByRole('button')).toHaveLength(0);
    expect(screen.getAllByRole('button', { name: 'Formation' })).toHaveLength(1);
  });

  it('retire aussi les deux pôles du rideau temporaire sur petite largeur', async () => {
    vi.stubGlobal('matchMedia', compactHomeMatchMedia);
    renderAppAt('/home');
    await screen.findByRole('banner');

    const overlay = curtain() as HTMLElement;

    expect(within(overlay).getByText('Sapience VC')).toBeInTheDocument();
    expect(within(overlay).queryByText(HOME_FORMATION.label)).not.toBeInTheDocument();
    expect(within(overlay).queryByText(HOME_INTELLIGENCE.label)).not.toBeInTheDocument();
  });

  it('pose la marque du rideau et celle de la barre sur la même typographie, pour un relais sans saut', async () => {
    renderAppAt('/home');

    const banner = await screen.findByRole('banner');
    const real = within(banner).getByRole('button', { name: 'Rechercher depuis Maison Sapience VC' });
    const copy = (curtain() as HTMLElement).querySelector('.home-intro-wordmark') as HTMLElement;

    // Size, tracking and family at every breakpoint — ignoring the interaction
    // states only the real, clickable wordmark carries.
    const typography = (element: HTMLElement) =>
      [...element.classList].filter((token) => /^(sm:|md:|lg:)?(text-\[|tracking-\[|font-)/.test(token)).sort();

    expect(typography(copy)).toEqual(typography(real));
    // The wordmark is deliberately the largest thing on the bar.
    expect(typography(real)).toContain('lg:text-[0.95875rem]');
    expect(within(real).getByText('Sapience VC')).toHaveClass(HOME_BAR_WORDMARK_ACCENT);
    expect(within(copy).getByText('Sapience VC')).toHaveClass(HOME_BAR_WORDMARK_ACCENT);
  });

  it('reste silencieuse quand /home est rejointe depuis l’intérieur de l’application', async () => {
    const user = userEvent.setup();
    renderWithRouter(<IntroRoutes />, '/ailleurs');

    await screen.findByRole('heading', { level: 1, name: 'Ailleurs' });
    expect(curtain()).not.toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Vers l’accueil' }));

    await screen.findByRole('heading', { level: 1, name: 'Accueil' });
    expect(curtain()).not.toBeInTheDocument();
    expect(screen.getByRole('banner')).not.toHaveClass('home-topbar-suppressed');
  });
});
