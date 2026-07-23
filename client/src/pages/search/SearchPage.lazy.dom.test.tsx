// @vitest-environment jsdom

import '@/test/setupDom';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { SearchHit } from '@/content/search';
import { renderWithRouter } from '@/test/renderApp';
import SearchPage from './SearchPage';

const mocks = vi.hoisted(() => ({
  searchLocal: vi.fn(),
  loadSearchHits: vi.fn(),
}));

vi.mock('@/content/search', () => ({
  searchLocal: mocks.searchLocal,
}));

vi.mock('@/content/searchLazy', () => ({
  loadSearchHits: mocks.loadSearchHits,
}));

const hit: SearchHit = {
  type: 'lesson',
  id: 'l-test',
  slug: 'test',
  title: 'Leçon récupérée',
  excerpt: 'Résultat chargé après reprise.',
  href: '/lessons/test',
};

function renderSearchPage() {
  return renderWithRouter(
    <Routes>
      <Route path="/search" element={<SearchPage />} />
    </Routes>,
    '/search?q=carry',
  );
}

describe('SearchPage lazy search recovery', () => {
  beforeEach(() => {
    mocks.searchLocal.mockReset();
    mocks.loadSearchHits.mockReset();
  });

  it('annonce un échec de recherche différée puis relance la recherche', async () => {
    mocks.searchLocal.mockImplementation(() => {
      throw new Error('index indisponible');
    });
    mocks.loadSearchHits
      .mockRejectedValueOnce(new Error('index indisponible'))
      .mockResolvedValueOnce([hit]);

    renderSearchPage();

    expect(await screen.findByRole('alert')).toHaveTextContent('La recherche n’a pas pu être chargée');
    await userEvent.click(screen.getByRole('button', { name: /réessayer/i }));

    expect(await screen.findByRole('link', { name: /Leçon récupérée/i })).toHaveAttribute('href', '/lessons/test');
    expect(mocks.loadSearchHits).toHaveBeenCalledTimes(2);
  });
});
