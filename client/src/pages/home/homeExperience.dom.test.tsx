// @vitest-environment jsdom
import '@/test/setupDom';

import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { renderAppAt } from '@/test/renderApp';

const HERO_COPY =
  "Une plateforme d'intelligence VC pour praticiens : dossiers d'écosystème, convictions datées, décisions instruites — et la formation qui les soutient.";
const HERO_INTENT_NOTE =
  "L'ikigai n'est pas un point fixe à atteindre. C'est un centre de gravité qui se déplace avec toi. Le capital-risque, par sa temporalité longue force précisément à se demander : où sera ce centre dans une décennie ?";
const BRIDGE_TITLE = 'Deux pôles pour apprendre et analyser.';

const rect = (left: number, top: number, right: number, bottom: number) =>
  ({
    left,
    top,
    right,
    bottom,
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
    toJSON: () => ({}),
  }) as DOMRect;

const HOME_HERO_SELECTOR = '#main > section:first-of-type';

const findHomeHero = async () => {
  await waitFor(() => {
    expect(document.querySelector(HOME_HERO_SELECTOR)).toBeInTheDocument();
  });
  return document.querySelector(HOME_HERO_SELECTOR) as HTMLElement;
};

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

describe('accueil — contrat éditorial et navigation', () => {
  it('réduit de 35 % les tailles de caractères propres à /home', async () => {
    renderAppAt('/home');

    const banner = await screen.findByRole('banner');
    expect(within(banner).getByRole('button', { name: 'Formation' })).toHaveClass(
      'text-[0.377rem]',
      'sm:text-[0.4875rem]',
    );
    expect(within(banner).getByRole('button', { name: 'Rechercher depuis Maison Sapience VC' })).toHaveClass(
      'text-[0.66625rem]',
      'sm:text-[0.86125rem]',
      'lg:text-[0.95875rem]',
    );

    const heading = await screen.findByRole('heading', {
      level: 1,
      name: 'Documenter le raisonnement. Affûter le jugement.',
    });
    expect(heading).toHaveClass('text-[1.7875rem]', 'sm:text-[2.99rem]', 'lg:text-[3.9rem]');
    expect(within(document.querySelector('main section') as HTMLElement).getByText(HERO_COPY)).toHaveClass(
      'text-[0.65rem]',
      'sm:text-[0.8125rem]',
    );

    expect(screen.queryByText((_, element) => element?.textContent === `« ${HERO_INTENT_NOTE} »`)).not.toBeInTheDocument();
    expect(screen.queryByText('Note d’intention')).not.toBeInTheDocument();
  });

  it('limite la barre supérieure aux deux pôles et au titre central', async () => {
    renderAppAt('/home');

    const banner = await screen.findByRole('banner');
    const controls = within(banner).getAllByRole('button');

    expect(controls).toHaveLength(3);
    expect(controls[0]).toHaveAccessibleName('Formation');
    expect(controls[1]).toHaveAccessibleName('Rechercher depuis Maison Sapience VC');
    expect(controls[2]).toHaveAccessibleName('Intelligence VC');
    expect(controls[0].firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(controls[0].lastElementChild).toHaveTextContent('Formation');
    expect(controls[2].firstElementChild).toHaveTextContent('Intelligence VC');
    expect(controls[2].lastElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(within(controls[1]).getByText('Sapience VC')).toHaveClass('font-semibold');
    expect(within(banner).queryByText('Workspace')).not.toBeInTheDocument();
    expect(within(banner).queryByRole('button', { name: /mode (clair|sombre)/i })).not.toBeInTheDocument();
  });

  it('retire les deux pôles du header sur petite largeur et les fixe au bas du viewport', async () => {
    vi.stubGlobal('matchMedia', compactHomeMatchMedia);
    renderAppAt('/home');

    const banner = await screen.findByRole('banner');
    const mobileNavigation = screen.getByRole('navigation', { name: 'Pôles de l’accueil' });
    const controls = within(mobileNavigation).getAllByRole('button');

    expect(within(banner).getAllByRole('button')).toHaveLength(1);
    expect(within(banner).getByRole('button', { name: 'Rechercher depuis Maison Sapience VC' })).toBeInTheDocument();
    expect(within(banner).queryByRole('button', { name: 'Formation' })).not.toBeInTheDocument();
    expect(within(banner).queryByRole('button', { name: 'Intelligence VC' })).not.toBeInTheDocument();
    expect(banner).not.toContainElement(mobileNavigation);
    expect(mobileNavigation).toHaveClass(
      'fixed',
      'inset-x-0',
      'bottom-0',
      'z-[75]',
      'grid',
      'grid-cols-2',
      'box-border',
      'h-[calc(var(--home-mobile-nav-h)+env(safe-area-inset-bottom))]',
    );
    expect(mobileNavigation).not.toHaveClass(
      'min-h-[calc(var(--home-mobile-nav-h)+env(safe-area-inset-bottom))]',
    );
    expect(mobileNavigation).not.toHaveClass('backdrop-blur-md');
    expect(screen.getByRole('main').parentElement).toHaveClass(
      'pb-[calc(var(--home-mobile-nav-h)+env(safe-area-inset-bottom))]',
      'md:pb-0',
    );
    expect(controls).toHaveLength(2);
    expect(controls[0]).toHaveAccessibleName('Formation');
    expect(controls[1]).toHaveAccessibleName('Intelligence VC');
    expect(controls[0].firstElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(controls[0].lastElementChild).toHaveTextContent('Formation');
    expect(controls[1].firstElementChild).toHaveTextContent('Intelligence VC');
    expect(controls[1].lastElementChild?.tagName.toLowerCase()).toBe('svg');
    expect(within(banner).getByRole('button', { name: 'Rechercher depuis Maison Sapience VC' })).toHaveClass(
      'h-full',
      'min-h-0',
      'md:h-auto',
      'md:min-h-11',
    );
    for (const control of controls) {
      expect(control).toHaveClass('h-full', 'min-h-0', 'md:h-auto', 'md:min-h-11');
      expect(control.closest('[data-home-menu]')).toHaveClass(
        'h-[calc(var(--home-mobile-nav-h)-1px)]',
      );
    }
  });

  it.each(['/home', '/home/'])(
    'conserve le chrome Maison Sapience VC après chargement direct de %s',
    async (path) => {
      renderAppAt(path);

      const banner = await screen.findByRole('banner');

      expect(within(banner).getByRole('button', { name: 'Rechercher depuis Maison Sapience VC' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Menu' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Ouvrir la navigation' })).not.toBeInTheDocument();
      expect(document.getElementById('desktop-nav')).not.toBeInTheDocument();
    },
  );

  it.each(['/home', '/home/'])(
    'conserve sur mobile le titre et les deux pôles de la home pour %s',
    async (path) => {
      vi.stubGlobal('matchMedia', compactHomeMatchMedia);
      renderAppAt(path);

      const banner = await screen.findByRole('banner');
      const mobileNavigation = screen.getByRole('navigation', { name: 'Pôles de l’accueil' });

      expect(within(banner).getByRole('button', { name: 'Rechercher depuis Maison Sapience VC' })).toBeInTheDocument();
      expect(within(mobileNavigation).getByRole('button', { name: 'Formation' })).toBeInTheDocument();
      expect(within(mobileNavigation).getByRole('button', { name: 'Intelligence VC' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Menu' })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Ouvrir la navigation' })).not.toBeInTheDocument();
      expect(document.getElementById('desktop-nav')).not.toBeInTheDocument();
    },
  );

  it('place la zone cliquable du thème au-dessus de la barre /home sur mobile', async () => {
    vi.stubGlobal('matchMedia', compactHomeMatchMedia);
    renderAppAt('/home');

    const banner = await screen.findByRole('banner');
    await screen.findByRole('heading', {
      level: 1,
      name: 'Documenter le raisonnement. Affûter le jugement.',
    });
    const themeToggle = screen.getByRole('button', { name: /Activer le mode (clair|sombre)/ });

    expect(banner).toHaveClass('z-[75]');
    expect(themeToggle).toHaveClass('z-[80]');
    expect(themeToggle).not.toHaveClass('z-[70]');
    expect(themeToggle).toHaveClass('md:z-[70]');
  });

  it('rend la barre /home transparente avec un cadre horizontal légèrement inset tant que le hero est visible', async () => {
    renderAppAt('/home');

    const banner = await screen.findByRole('banner');
    const hero = await findHomeHero();

    vi.spyOn(banner, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 1200, 54));
    vi.spyOn(hero, 'getBoundingClientRect').mockReturnValue(rect(0, -665, 1200, 55));
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(banner).toHaveClass(
        'bg-transparent',
        'after:inset-x-2.5',
        'after:h-px',
        'after:bg-[color-mix(in_srgb,var(--outline-variant)_70%,transparent)]',
      );
    });
    for (const className of [
      'border-b',
      'bg-[color-mix(in_srgb,var(--background)_72%,transparent)]',
      'backdrop-blur-md',
    ]) {
      expect(banner).not.toHaveClass(className);
    }
  });

  it('rend la barre /home opaque à la frontière du hero puis transparente au retour', async () => {
    renderAppAt('/home');

    const banner = await screen.findByRole('banner');
    const hero = await findHomeHero();
    let heroBottom = 55;

    vi.spyOn(banner, 'getBoundingClientRect').mockReturnValue(rect(0, 0, 1200, 54));
    vi.spyOn(hero, 'getBoundingClientRect').mockImplementation(() =>
      rect(0, heroBottom - 720, 1200, heroBottom),
    );
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(banner).toHaveClass('bg-transparent');
    });

    heroBottom = 54;
    fireEvent.resize(window);

    await waitFor(() => {
      expect(banner).toHaveClass(
        'bg-[color:var(--surface)]',
        'after:inset-x-2.5',
        'after:h-px',
        'after:bg-[color-mix(in_srgb,var(--outline-variant)_70%,transparent)]',
      );
    });
    for (const className of [
      'bg-transparent',
      'border-b',
      'backdrop-blur-md',
      'after:bg-transparent',
    ]) {
      expect(banner).not.toHaveClass(className);
    }

    heroBottom = 55;
    fireEvent.scroll(window);

    await waitFor(() => {
      expect(banner).toHaveClass('bg-transparent');
      expect(banner).not.toHaveClass('bg-[color:var(--surface)]');
    });
  });

  it('réduit la hauteur de la barre /home de 25 % et centre ses contrôles', async () => {
    renderAppAt('/home');

    const banner = await screen.findByRole('banner');
    const row = banner.firstElementChild as HTMLElement;
    const formation = within(banner).getByRole('button', { name: 'Formation' });
    const title = within(banner).getByRole('button', { name: 'Rechercher depuis Maison Sapience VC' });

    expect(row).toHaveClass('h-[var(--home-topbar-h)]', 'items-center');
    expect(formation).toHaveClass('flex', 'items-center');
    expect(title).toHaveClass('inline-flex', 'items-center', 'justify-center');
  });

  it('déploie le contenu propre de chaque pôle au survol et au focus', async () => {
    const user = userEvent.setup();
    renderAppAt('/home');

    const formation = await screen.findByRole('button', { name: 'Formation' });
    const intelligence = screen.getByRole('button', { name: 'Intelligence VC' });

    await user.hover(formation);
    const formationMenu = await screen.findByRole('navigation', { name: 'Menu Formation' });
    expect(within(formationMenu).getAllByRole('link').map((link) => link.textContent?.trim())).toEqual([
      '01Parcours',
      '02Certifications',
      '03Bibliothèque',
      '04Dictionnaire',
    ]);
    expect(formation).toHaveAttribute('aria-expanded', 'true');

    await user.hover(intelligence);
    await waitFor(() => {
      expect(screen.queryByRole('navigation', { name: 'Menu Formation' })).not.toBeInTheDocument();
    });
    const intelligenceMenu = screen.getByRole('navigation', { name: 'Menu Intelligence VC' });
    const intelligenceLinks = within(intelligenceMenu).getAllByRole('link');
    expect(intelligenceLinks.map((link) => link.textContent?.replace(/\s+/g, ' ').trim())).toEqual([
      'Vue d’ensemble 01',
      'Écosystèmes 02',
      'Convictions 03',
      'Décisions 04',
      'Simulateurs 05',
      'Méthode 06',
      'Analyses 07',
    ]);
    expect(intelligenceLinks[0]).toHaveClass('text-right', 'grid-cols-[minmax(0,1fr)_2.25rem]');
    expect(intelligence).toHaveAttribute('aria-expanded', 'true');

    await user.tab();
    expect(screen.getByRole('link', { name: 'Aller au contenu principal' })).toHaveFocus();
    await user.tab();
    expect(formation).toHaveFocus();
    expect(await screen.findByRole('navigation', { name: 'Menu Formation' })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: 'Menu Formation' })).not.toBeInTheDocument();
    expect(formation).toHaveFocus();
  });

  it('place les menus de pôles au-dessus des contrôles flottants de /home', async () => {
    const user = userEvent.setup();
    renderAppAt('/home');

    const banner = await screen.findByRole('banner');
    const themeToggle = screen.getByRole('button', { name: /Activer le mode (clair|sombre)/ });
    const formation = within(banner).getByRole('button', { name: 'Formation' });

    await user.hover(formation);
    const formationPanel = (await screen.findByRole('navigation', { name: 'Menu Formation' })).parentElement;

    expect(banner).toHaveClass('z-[75]');
    expect(themeToggle).toHaveClass('z-[80]', 'md:z-[70]');
    expect(themeToggle).not.toHaveClass('z-[70]');
    expect(formationPanel).toHaveClass('fixed', 'z-[85]');
    expect(formationPanel).not.toHaveClass('z-50');
  });

  it('ferme avec Escape un panneau ouvert au survol même si le focus est ailleurs', async () => {
    const user = userEvent.setup();
    renderAppAt('/home');

    const formation = await screen.findByRole('button', { name: 'Formation' });
    const title = screen.getByRole('button', { name: 'Rechercher depuis Maison Sapience VC' });
    title.focus();

    await user.hover(formation);
    expect(await screen.findByRole('navigation', { name: 'Menu Formation' })).toBeInTheDocument();
    expect(title).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: 'Menu Formation' })).not.toBeInTheDocument();
    expect(formation).toHaveFocus();
  });

  it('garde ouvert au clic souris un panneau déjà révélé au survol', async () => {
    const user = userEvent.setup();
    renderAppAt('/home');

    const formation = await screen.findByRole('button', { name: 'Formation' });
    await user.hover(formation);
    expect(await screen.findByRole('navigation', { name: 'Menu Formation' })).toBeInTheDocument();

    await user.click(formation);
    expect(screen.getByRole('navigation', { name: 'Menu Formation' })).toBeInTheDocument();
    expect(formation).toHaveAttribute('aria-expanded', 'true');
  });

  it('réactive l’ouverture au focus après une activation pointeur abandonnée hors du bouton', async () => {
    renderAppAt('/home');

    const formation = await screen.findByRole('button', { name: 'Formation' });
    const title = screen.getByRole('button', { name: 'Rechercher depuis Maison Sapience VC' });
    const main = screen.getByRole('main');

    fireEvent.pointerDown(formation, { pointerType: 'mouse', pointerId: 17 });
    formation.focus();
    expect(screen.queryByRole('navigation', { name: 'Menu Formation' })).not.toBeInTheDocument();

    fireEvent.pointerUp(main, { pointerType: 'mouse', pointerId: 17 });
    await new Promise((resolve) => setTimeout(resolve, 0));
    title.focus();
    formation.focus();

    expect(await screen.findByRole('navigation', { name: 'Menu Formation' })).toBeInTheDocument();
  });

  it('bascule les panneaux au clic pour les écrans tactiles', async () => {
    vi.stubGlobal('matchMedia', compactHomeMatchMedia);
    renderAppAt('/home');

    const formation = await screen.findByRole('button', { name: 'Formation' });
    expect(formation).toBe(
      within(screen.getByRole('navigation', { name: 'Pôles de l’accueil' })).getByRole('button', {
        name: 'Formation',
      }),
    );
    fireEvent.pointerLeave(formation.closest('[data-home-menu]') as HTMLElement, { pointerType: 'mouse' });
    fireEvent.pointerDown(formation, { pointerType: 'touch', pointerId: 21 });
    formation.focus();
    fireEvent.pointerUp(formation, { pointerType: 'touch', pointerId: 21 });
    fireEvent.click(formation);
    await new Promise((resolve) => setTimeout(resolve, 220));
    const formationPanel = screen.getByRole('navigation', { name: 'Menu Formation' }).parentElement;
    expect(formationPanel).toHaveClass(
      'fixed',
      'top-[var(--home-topbar-h)]',
      'bottom-[calc(var(--home-mobile-nav-h)+env(safe-area-inset-bottom))]',
    );

    fireEvent.pointerDown(formation, { pointerType: 'touch', pointerId: 22 });
    fireEvent.pointerUp(formation, { pointerType: 'touch', pointerId: 22 });
    fireEvent.click(formation);
    expect(screen.queryByRole('navigation', { name: 'Menu Formation' })).not.toBeInTheDocument();

    const intelligence = screen.getByRole('button', { name: 'Intelligence VC' });
    fireEvent.pointerDown(intelligence, { pointerType: 'touch', pointerId: 23 });
    intelligence.focus();
    fireEvent.pointerUp(intelligence, { pointerType: 'touch', pointerId: 23 });
    fireEvent.click(intelligence);
    expect(screen.queryByRole('navigation', { name: 'Menu Formation' })).not.toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Menu Intelligence VC' })).toBeInTheDocument();

    fireEvent.pointerDown(screen.getByRole('main'), { pointerType: 'touch' });
    expect(screen.queryByRole('navigation', { name: 'Menu Intelligence VC' })).not.toBeInTheDocument();
  });

  it('ouvre la recherche globale au survol du titre central', async () => {
    const user = userEvent.setup();
    renderAppAt('/home');

    const title = await screen.findByRole('button', { name: 'Rechercher depuis Maison Sapience VC' });
    await user.hover(title);

    expect(await screen.findByRole('dialog', { name: 'Recherche globale' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Recherche globale' })).toHaveFocus();

    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Recherche globale' })).not.toBeInTheDocument());

    await user.click(title);
    expect(await screen.findByRole('dialog', { name: 'Recherche globale' })).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Recherche globale' })).not.toBeInTheDocument());
    expect(title).toHaveFocus();
  });

  it('place la recherche ouverte depuis le titre sous la barre sans assombrir le reste de la page', async () => {
    const user = userEvent.setup();
    renderAppAt('/home');

    const title = await screen.findByRole('button', { name: 'Rechercher depuis Maison Sapience VC' });
    await user.hover(title);

    const dialog = await screen.findByRole('dialog', { name: 'Recherche globale' });
    const layerRoot = dialog.parentElement;
    const backdrop = layerRoot?.firstElementChild;

    expect(layerRoot).toHaveClass('top-[var(--home-topbar-h)]', 'pt-3');
    expect(backdrop).toHaveClass('top-[var(--home-topbar-h)]', 'bg-transparent', 'backdrop-blur-none');
    expect(backdrop).not.toHaveClass(
      'bg-[color-mix(in_srgb,var(--secondary)_30%,transparent)]',
      'backdrop-blur-sm',
      'opacity-40',
      'opacity-50',
      'opacity-60',
      'opacity-70',
      'opacity-80',
      'opacity-90',
    );
    expect(screen.queryByText('Tapez au moins deux caractères pour explorer toute la plateforme.')).not.toBeInTheDocument();
    expect(dialog).toHaveClass(
      'bg-[color-mix(in_srgb,var(--surface-container-lowest)_56%,transparent)]',
      'shadow-black/30',
      'ring-[color-mix(in_srgb,var(--surface-bright)_16%,transparent)]',
      'backdrop-blur-[34px]',
      'backdrop-saturate-[180%]',
    );
    expect(dialog).not.toHaveClass('bg-surface-container-lowest');

    const searchbox = screen.getByRole('searchbox', { name: 'Recherche globale' });
    expect(searchbox).toHaveClass('appearance-none', 'border-0', 'shadow-none', 'focus:ring-0');
  });

  it('garde la recherche home ouverte dans la zone titre-corridor-barre puis la retire dehors', async () => {
    const user = userEvent.setup();
    renderAppAt('/home');

    const title = await screen.findByRole('button', { name: 'Rechercher depuis Maison Sapience VC' });
    Object.defineProperty(title, 'getBoundingClientRect', {
      configurable: true,
      value: () => rect(515, 14, 765, 58),
    });
    await user.hover(title);
    const dialog = await screen.findByRole('dialog', { name: 'Recherche globale' });
    Object.defineProperty(dialog, 'getBoundingClientRect', {
      configurable: true,
      value: () => rect(368, 86, 912, 142),
    });

    fireEvent.mouseLeave(title, { clientX: 640, clientY: 62, relatedTarget: null });
    await new Promise((resolve) => setTimeout(resolve, 220));
    expect(screen.getByRole('dialog', { name: 'Recherche globale' })).toBeInTheDocument();

    fireEvent.pointerMove(document, { pointerType: 'mouse', clientX: 640, clientY: 78 });
    await new Promise((resolve) => setTimeout(resolve, 220));
    expect(screen.getByRole('dialog', { name: 'Recherche globale' })).toBeInTheDocument();

    fireEvent.pointerMove(document, { pointerType: 'mouse', clientX: 100, clientY: 300 });

    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Recherche globale' })).not.toBeInTheDocument());
  });

  it('réarme le survol lorsque le pointeur est sorti pendant que la recherche était ouverte', async () => {
    const user = userEvent.setup();
    renderAppAt('/home');

    const title = await screen.findByRole('button', { name: 'Rechercher depuis Maison Sapience VC' });
    await user.hover(title);
    expect(await screen.findByRole('dialog', { name: 'Recherche globale' })).toBeInTheDocument();

    await user.unhover(title);
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Recherche globale' })).not.toBeInTheDocument());

    await user.hover(title);
    expect(await screen.findByRole('dialog', { name: 'Recherche globale' })).toBeInTheDocument();
  });

  it('réarme le survol lorsque le pointeur se déplace dans la modale sans mouseleave du titre', async () => {
    const user = userEvent.setup();
    renderAppAt('/home');

    const title = await screen.findByRole('button', { name: 'Rechercher depuis Maison Sapience VC' });
    await user.hover(title);
    const searchbox = await screen.findByRole('searchbox', { name: 'Recherche globale' });

    fireEvent.pointerMove(searchbox, { pointerType: 'mouse', clientX: 900, clientY: 500 });
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('dialog', { name: 'Recherche globale' })).not.toBeInTheDocument());

    fireEvent.mouseEnter(title);
    expect(await screen.findByRole('dialog', { name: 'Recherche globale' })).toBeInTheDocument();
  });

  it('conserve la copie du hero et retire la note d’intention ikigai de l’accueil', async () => {
    renderAppAt('/home');

    expect(
      await screen.findByRole('heading', {
        level: 1,
        name: 'Documenter le raisonnement. Affûter le jugement.',
      }),
    ).toBeInTheDocument();
    const sections = document.querySelectorAll('main section');
    expect(within(sections[0] as HTMLElement).getByText(HERO_COPY)).toBeInTheDocument();
    const compass = screen.getByTestId('home-compass');
    expect(compass).toBeInTheDocument();
    expect(compass).not.toHaveAttribute('href');
    expect(screen.queryByRole('link', { name: 'Ouvrir le tableau de bord' })).not.toBeInTheDocument();
    expect(sections).toHaveLength(2);
    expect(within(sections[0] as HTMLElement).queryByText(HERO_INTENT_NOTE)).not.toBeInTheDocument();
    expect(screen.queryByText((_, element) => element?.textContent === `« ${HERO_INTENT_NOTE} »`)).not.toBeInTheDocument();
    expect(screen.queryByText('Note d’intention')).not.toBeInTheDocument();
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByRole('link', { name: 'Maison Sapience VC' })).toHaveAttribute('href', '/home');
    expect(within(footer).getByRole('link', { name: 'Formation' })).toHaveAttribute('href', '/parcours');
    expect(within(footer).getByRole('link', { name: 'Intelligence VC' })).toHaveAttribute('href', '/intelligence');
    expect(within(footer).queryByText('Workspace')).not.toBeInTheDocument();
    expect(within(footer).queryByText(/VC Premium Experience/)).not.toBeInTheDocument();
    expect(screen.queryByText('Choisir d’abord le terrain de travail.')).not.toBeInTheDocument();
    expect(screen.queryByText('Les analyses publiées récemment restent disponibles.')).not.toBeInTheDocument();
  });

  it('insère après le hero une section éditoriale reliant Formation et Intelligence VC', async () => {
    renderAppAt('/home');

    const sections = document.querySelectorAll('main section');
    const bridgeSection = sections[1] as HTMLElement;

    expect(bridgeSection).toHaveAccessibleName(BRIDGE_TITLE);
    expect(
      within(bridgeSection).getByRole('heading', {
        level: 2,
        name: BRIDGE_TITLE,
      }),
    ).toBeInTheDocument();
    expect(within(bridgeSection).getAllByRole('link', { name: 'Formation' })[0]).toHaveAttribute('href', '/parcours');
    expect(bridgeSection).toHaveTextContent('Maison Sapience VC');
    expect(within(bridgeSection).getAllByRole('link', { name: 'Intelligence VC' })[0]).toHaveAttribute('href', '/intelligence');
    expect(bridgeSection).toHaveTextContent('Parcours, certifications, bibliothèque et dictionnaire structurent l’apprentissage.');
    expect(bridgeSection).not.toHaveTextContent(HERO_COPY);
    expect(bridgeSection).toHaveTextContent('Analyses, dossiers, convictions et méthode structurent la lecture des marchés et des décisions.');
    expect(bridgeSection).not.toHaveTextContent('Workspace');

    const decorativeSvgs = bridgeSection.querySelectorAll('svg[data-home-bridge-svg]');
    expect(decorativeSvgs.length).toBeGreaterThanOrEqual(2);
    for (const svg of decorativeSvgs) {
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('focusable', 'false');
    }
    expect(bridgeSection.querySelectorAll('path[vector-effect="non-scaling-stroke"]')).toHaveLength(8);
    const markerFills = [...bridgeSection.querySelectorAll('rect')].map((rect) => rect.getAttribute('fill'));
    expect(markerFills.filter((fill) => fill === 'var(--primary)')).toHaveLength(4);
    expect(markerFills.filter((fill) => fill === 'var(--secondary)')).toHaveLength(4);
  });

  it('dessine sur desktop deux arches au profil mesuré sur la référence', async () => {
    renderAppAt('/home');

    const bridgeSection = document.querySelectorAll('main section')[1] as HTMLElement;
    const leftPath = bridgeSection.querySelector<SVGPathElement>('path[id*="desktop-left"]');
    const rightPath = bridgeSection.querySelector<SVGPathElement>('path[id*="desktop-right"]');
    const desktopSvg = leftPath?.closest('svg');

    expect(desktopSvg).toHaveAttribute('viewBox', '0 0 1000 171');
    expect(desktopSvg).toHaveClass('aspect-[5.85/1]');
    expect(leftPath).toHaveAttribute(
      'd',
      'M 8 168 C 33.30 74.81 127.09 0.40 274.00 0.40 C 420.91 0.40 517.31 74.81 540 168',
    );
    expect(rightPath).toHaveAttribute(
      'd',
      'M 992 168 C 969.31 74.81 872.91 0.40 726.00 0.40 C 579.09 0.40 485.30 74.81 460 168',
    );
  });

  it('forme sur mobile un ovale ouvert avec le même profil d’arche', async () => {
    renderAppAt('/home');

    const bridgeSection = document.querySelectorAll('main section')[1] as HTMLElement;
    const upperPaths = [...bridgeSection.querySelectorAll<SVGPathElement>('path[id*="mobile-left"]')];
    const lowerPaths = [...bridgeSection.querySelectorAll<SVGPathElement>('path[id*="mobile-right"]')];

    expect(upperPaths).toHaveLength(3);
    expect(lowerPaths).toHaveLength(3);
    for (const path of upperPaths) {
      expect(path).toHaveAttribute(
        'd',
        'M 8 300 C 54.79 127.64 228.28 -9.99 500.00 -9.99 C 771.72 -9.99 950.02 127.64 992 300',
      );
      expect(path.closest('svg')).toHaveAttribute('viewBox', '0 0 1000 318');
      expect(path.closest('svg')).toHaveClass('aspect-[3.15/1]');
    }
    for (const path of lowerPaths) {
      expect(path).toHaveAttribute(
        'd',
        'M 992 18 C 950.02 190.36 771.72 327.99 500.00 327.99 C 228.28 327.99 54.79 190.36 8 18',
      );
      expect(path.closest('svg')).toHaveAttribute('viewBox', '0 0 1000 318');
      expect(path.closest('svg')).toHaveClass('aspect-[3.15/1]');
    }

    expect(upperPaths.every((path) => path.closest('svg')?.classList.contains('mt-8'))).toBe(true);
    expect(lowerPaths.every((path) => path.closest('svg')?.classList.contains('mt-3'))).toBe(true);
    expect(upperPaths.at(-1)?.closest('svg')?.nextElementSibling).toHaveClass('mt-3');
    expect(lowerPaths.at(-1)?.closest('svg')?.nextElementSibling).toHaveClass('mt-7');
  });

  it('fait démarrer simultanément les marqueurs et les anime continuellement', async () => {
    renderAppAt('/home');

    await screen.findByRole('heading', {
      level: 2,
      name: BRIDGE_TITLE,
    });

    const bridgeSection = document.querySelectorAll('main section')[1] as HTMLElement;
    const motions = [...bridgeSection.querySelectorAll<SVGAnimateMotionElement>('animateMotion')];
    const motionPaths = motions.map((motion) => motion.querySelector('mpath')?.getAttribute('href') ?? '');

    expect(motions).toHaveLength(8);
    expect(bridgeSection.querySelectorAll('animateMotion[begin="1s"]')).toHaveLength(0);
    expect(bridgeSection.querySelectorAll('animateMotion[repeatCount="indefinite"]')).toHaveLength(8);
    expect(bridgeSection.querySelectorAll('animateTransform[repeatCount="indefinite"]')).toHaveLength(8);
    expect(bridgeSection.querySelectorAll('g[opacity="0"]')).toHaveLength(0);

    for (const motion of motions) {
      expect(motion).toHaveAttribute('begin', '0s');
      expect(motion).toHaveAttribute('repeatCount', 'indefinite');
      expect(motion).not.toHaveAttribute('fill', 'freeze');
    }

    expect(motionPaths.filter((href) => href.includes('desktop-left'))).toHaveLength(1);
    expect(motionPaths.filter((href) => href.includes('desktop-right'))).toHaveLength(1);
    expect(motionPaths.filter((href) => href.includes('mobile-left'))).toHaveLength(3);
    expect(motionPaths.filter((href) => href.includes('mobile-right'))).toHaveLength(3);
  });

  it('rend le schéma statique quand la réduction du mouvement est demandée', async () => {
    vi.stubGlobal('matchMedia', (query: string): MediaQueryList => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    renderAppAt('/home');

    const bridgeSection = document.querySelectorAll('main section')[1] as HTMLElement;
    expect(bridgeSection.querySelectorAll('animateMotion')).toHaveLength(0);
    expect(bridgeSection.querySelectorAll('animateTransform')).toHaveLength(0);
    expect(bridgeSection.querySelectorAll('[data-home-bridge-static-marker]')).toHaveLength(8);
    const staticMarkerFills = [...bridgeSection.querySelectorAll('[data-home-bridge-static-marker]')].map((rect) => rect.getAttribute('fill'));
    expect(staticMarkerFills.filter((fill) => fill === 'var(--primary)')).toHaveLength(4);
    expect(staticMarkerFills.filter((fill) => fill === 'var(--secondary)')).toHaveLength(4);
  });

  it('place le changement de mode en haut sur mobile et en bas à gauche sur desktop', async () => {
    renderAppAt('/home');

    await screen.findByRole('heading', {
      level: 1,
      name: 'Documenter le raisonnement. Affûter le jugement.',
    });
    const hero = document.querySelector('main section');
    const themeToggle = screen.getByRole('button', { name: /Activer le mode (clair|sombre)/ });

    expect(hero).not.toContainElement(themeToggle);
    expect(themeToggle).toHaveClass(
      'fixed',
      'top-0',
      'left-3',
      'h-11',
      'w-11',
      'opacity-60',
      'hover:opacity-100',
      'focus-visible:opacity-100',
      'md:left-7',
      'md:bottom-7',
      'md:top-auto',
    );
    expect(themeToggle).not.toHaveClass(
      'top-1',
      'top-[calc((var(--home-topbar-h)-2.75rem)/2)]',
      'border',
      'border-outline-variant',
      'bg-[color-mix(in_srgb,var(--surface)_66%,transparent)]',
      'backdrop-blur-md',
    );
    expect(themeToggle.firstElementChild).toHaveClass(
      'absolute',
      'left-1/2',
      'top-[calc(var(--home-topbar-h)/2)]',
      '-translate-x-1/2',
      '-translate-y-1/2',
      'md:top-1/2',
    );
    expect(themeToggle.firstElementChild).not.toHaveClass(
      'h-[min(2rem,var(--home-topbar-h))]',
      'w-[min(2rem,var(--home-topbar-h))]',
      'rounded-full',
      'border',
      'border-outline-variant',
      'bg-[color-mix(in_srgb,var(--surface)_66%,transparent)]',
      'backdrop-blur-md',
    );
    expect(themeToggle).not.toHaveClass('md:top-[calc(var(--home-topbar-h)+1rem)]');
    expect(themeToggle).not.toHaveClass('bottom-5', 'sm:bottom-7');
    expect(themeToggle).not.toHaveClass('absolute');
    expect(themeToggle).not.toHaveClass('mt-10');
    expect(themeToggle).not.toHaveClass('sm:mt-12');
  });

  it('conserve la boussole du hero sans action cachée vers le dashboard', async () => {
    renderAppAt('/home');

    await screen.findByRole('heading', { level: 1, name: 'Documenter le raisonnement. Affûter le jugement.' });
    const compass = screen.getByTestId('home-compass');
    expect(compass).toBeInTheDocument();
    expect(compass.querySelector('.home-hero-halo')).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Ouvrir le tableau de bord' })).not.toBeInTheDocument();
    expect(document.querySelector('a[href="/dashboard"]')).not.toBeInTheDocument();
  });
});
