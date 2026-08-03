// @vitest-environment jsdom

import '@/test/setupDom';

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GLOSSARY } from '@/content/glossary';
import { renderWithRouter } from '@/test/renderApp';
import GlossaryPage from './GlossaryPage';

const mocks = vi.hoisted(() => ({
  loadGlossaryDefs: vi.fn(),
}));

vi.mock('@/content/glossary', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/content/glossary')>();
  return { ...actual, loadGlossaryDefs: mocks.loadGlossaryDefs };
});

const term = GLOSSARY[0];
if (!term) throw new Error('Fixture de glossaire absente.');

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{`${location.pathname}${location.search}`}</output>;
}

function renderGlossaryPage(path = `/glossary?term=${term.slug}`) {
  return renderWithRouter(
    <Routes>
      <Route path="/glossary" element={<><GlossaryPage /><LocationProbe /></>} />
    </Routes>,
    path,
  );
}

describe('GlossaryPage lazy definitions recovery', () => {
  beforeEach(() => {
    mocks.loadGlossaryDefs.mockReset();
  });

  it('annonce un échec des définitions différées puis recharge la définition active', async () => {
    mocks.loadGlossaryDefs
      .mockRejectedValueOnce(new Error('définitions indisponibles'))
      .mockResolvedValueOnce({ [term.slug]: { definition: 'Définition récupérée après reprise.' } });

    renderGlossaryPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('Les définitions détaillées n’ont pas pu être chargées');
    await userEvent.click(screen.getByRole('button', { name: /réessayer/i }));

    expect(await screen.findByText('Définition récupérée après reprise.')).toBeVisible();
    expect(mocks.loadGlossaryDefs).toHaveBeenCalledTimes(2);
  });
});

describe('GlossaryPage mobile controls', () => {
  beforeEach(() => {
    mocks.loadGlossaryDefs.mockReset();
    mocks.loadGlossaryDefs.mockResolvedValue({});
  });

  it('replaces the domain rail with a compact selector and keeps 44px alphabet targets', async () => {
    renderGlossaryPage();

    const domainSelect = screen.getByRole('combobox', { name: 'Filtrer par domaine' });
    expect(domainSelect.closest('label')).toHaveClass('lg:hidden');
    expect(domainSelect).toHaveAttribute('id', 'glossary-category');
    expect(domainSelect).toHaveAttribute('name', 'glossary-category');

    const desktopDomains = screen.getByRole('group', { name: 'Domaines' });
    expect(desktopDomains).toHaveClass('hidden', 'lg:flex');

    const alphabet = screen.getByRole('region', { name: 'Navigation alphabétique' });
    const letterA = within(alphabet).getByRole('button', { name: 'A' });
    expect(letterA).toHaveClass(
      'h-11',
      'min-w-11',
      'lg:h-9',
      'lg:min-w-9',
    );

    await userEvent.click(letterA);
    expect(await screen.findByRole('group', { name: 'Filtrer par deuxième lettre' })).toHaveClass('hidden', 'lg:flex');
  });

  it('uses a compact mobile intro without shrinking the desktop title', () => {
    renderGlossaryPage();

    const title = screen.getByRole('heading', { level: 1, name: 'Lexique du capital-risque.' });
    expect(title).toHaveClass('text-5xl', 'sm:text-6xl', 'md:text-[5.5rem]');
    expect(title).not.toHaveClass('text-7xl');
    expect(within(title).getByText('capital-risque.')).toHaveClass('underline-flourish');

    const header = title.closest('header');
    expect(header).toHaveClass('mb-10', 'sm:mb-14', 'lg:mb-16');
    expect(header?.parentElement).toHaveClass('px-5', 'py-8', 'sm:px-8', 'sm:py-12', 'lg:py-16');
  });

  it('renders terms without a repeated initial and places the mobile disclosure arrow before the word', () => {
    renderGlossaryPage();

    const termButton = document.querySelector<HTMLElement>('[data-glossary-initial] > button');
    expect(termButton).not.toBeNull();
    expect(termButton).toHaveClass(
      'grid-cols-[2.75rem_minmax(0,1fr)]',
      'gap-x-3',
      'gap-y-3',
      'md:grid-cols-12',
      'md:gap-6',
    );
    expect(termButton).not.toHaveClass('grid-cols-[minmax(0,1fr)_2.75rem]');
    expect(termButton).not.toHaveClass('grid-cols-[2.75rem_minmax(0,1fr)_2.75rem]');

    const article = termButton?.closest('article');
    const repeatedInitial = within(termButton!).queryByText(article?.dataset.glossaryInitial ?? '', {
      selector: '[aria-hidden="true"]',
    });
    expect(repeatedInitial).not.toBeInTheDocument();

    const termMeta = screen.getByText(term.term).parentElement;
    expect(termMeta).toHaveClass('col-start-2', 'row-start-1', 'md:col-span-4');
    expect(termMeta).not.toHaveClass('col-start-1');

    const termSummary = termButton?.querySelector('p');
    expect(termSummary).toHaveClass('col-start-2', 'row-start-2', 'md:col-span-7');
    expect(termSummary).not.toHaveClass('col-start-1');

    const disclosureControl = termButton?.querySelector<HTMLElement>('[data-glossary-disclosure]');
    expect(disclosureControl).toHaveClass('col-start-1', 'row-start-1', 'justify-start', 'md:col-span-1');
    expect(disclosureControl).not.toHaveClass('col-start-2', 'justify-end');

    expect(article).toHaveClass('-mx-5', 'px-5', 'py-5', 'sm:-mx-4', 'sm:rounded-lg');
    expect(article).not.toHaveClass('rounded-lg');
  });

  it('increases expanded copy on mobile without changing its desktop scale', async () => {
    mocks.loadGlossaryDefs.mockResolvedValue({
      [term.slug]: {
        definition: 'Définition typographique de contrôle.',
        example: 'Exemple typographique de contrôle.',
      },
    });
    renderGlossaryPage();

    const definitionText = await screen.findByText('Définition typographique de contrôle.');
    expect(definitionText.parentElement).toHaveClass('text-base', 'md:text-sm');

    const example = screen.getByText('Exemple typographique de contrôle.').closest('pre');
    expect(example).toHaveClass('text-sm', 'md:text-xs');
  });

  it('restores the filter context that preceded each search', async () => {
    renderGlossaryPage('/glossary');

    const search = screen.getByRole('searchbox', { name: 'Rechercher dans le lexique' });
    const clearSearch = () => screen.getByRole('button', { name: 'Effacer la recherche' });
    const status = screen.getByRole('status', { name: 'Résultats du dictionnaire' });
    const alphabet = screen.getByRole('region', { name: 'Navigation alphabétique' });

    expect(within(alphabet).getByRole('button', { name: 'A' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByText('a16z (Andreessen Horowitz)')).toBeVisible();

    const secondLetters = screen.getByRole('group', { name: 'Filtrer par deuxième lettre' });
    await userEvent.click(within(secondLetters).getByRole('button', { name: 'C' }));
    expect(within(secondLetters).getByRole('button', { name: 'C' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Accel')).toBeVisible();
    expect(screen.queryByText('Advisory board')).not.toBeInTheDocument();

    await userEvent.type(search, 'Baseball model');
    await waitFor(() => expect(status).toHaveTextContent('1 résultat'));
    await userEvent.click(screen.getByText('Baseball model').closest('button')!);
    expect(screen.getByTestId('location')).toHaveTextContent('/glossary?term=baseball-model');
    await userEvent.click(screen.getByText('Baseball model').closest('button')!);
    expect(screen.getByTestId('location')).toHaveTextContent('/glossary');
    await userEvent.click(clearSearch());

    await waitFor(() => expect(within(alphabet).getByRole('button', { name: 'A' })).toHaveAttribute('aria-current', 'true'));
    expect(within(screen.getByRole('group', { name: 'Filtrer par deuxième lettre' })).getByRole('button', { name: 'C' }))
      .toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByText('Accel')).toBeVisible();
    expect(screen.queryByText('Advisory board')).not.toBeInTheDocument();
    expect(screen.queryByText('Baseball model')).not.toBeInTheDocument();

    const domainSelect = screen.getByRole('combobox', { name: 'Filtrer par domaine' });
    await userEvent.selectOptions(domainSelect, 'Acteurs');
    await waitFor(() => expect(status).toHaveTextContent('27 résultats'));
    expect(screen.getByText('Accélérateur')).toBeVisible();
    expect(screen.queryByText('Accel')).not.toBeInTheDocument();

    await userEvent.selectOptions(domainSelect, 'Tous');
    await waitFor(() => expect(status).toHaveTextContent('420 résultats'));
    await userEvent.type(search, 'accelerateur');
    await waitFor(() => expect(status).toHaveTextContent('1 résultat'));
    await userEvent.click(clearSearch());

    await waitFor(() => expect(status).toHaveTextContent('420 résultats'));
    expect(screen.getByText('409A valuation')).toBeVisible();
  });

  it('keeps the active definition synchronized with the URL', async () => {
    renderGlossaryPage('/glossary');

    const alphabet = screen.getByRole('region', { name: 'Navigation alphabétique' });
    await userEvent.click(within(alphabet).getByRole('button', { name: 'B' }));

    const baseballButton = screen.getByText('Baseball model').closest('button');
    expect(baseballButton).not.toBeNull();
    await userEvent.click(baseballButton!);

    expect(screen.getByTestId('location')).toHaveTextContent('/glossary?term=baseball-model');
    expect(screen.getByText('Baseball model').closest('button')).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(screen.getByText('Baseball model').closest('button')!);
    expect(screen.getByTestId('location')).toHaveTextContent('/glossary');
    expect(screen.getByText('Baseball model').closest('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('announces filtered results and exposes a touch-sized search reset', async () => {
    renderGlossaryPage();

    const search = screen.getByRole('searchbox', { name: 'Rechercher dans le lexique' });
    expect(search).toHaveClass('pr-3');
    expect(search).not.toHaveClass('pr-11');
    expect(search).toHaveClass(
      '[&::-webkit-search-cancel-button]:appearance-none',
      '[&::-webkit-search-decoration]:appearance-none',
    );
    await userEvent.type(search, term.term);
    expect(search).toHaveClass('pr-11');

    const status = screen.getByRole('status', { name: 'Résultats du dictionnaire' });
    await waitFor(() => expect(status).toHaveTextContent('1 résultat'));

    const clearSearch = screen.getByRole('button', { name: 'Effacer la recherche' });
    expect(clearSearch).toHaveClass('h-11', 'w-11');
    await userEvent.click(clearSearch);

    expect(search).toHaveValue('');
    expect(search).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Effacer la recherche' })).not.toBeInTheDocument();
  });
});
