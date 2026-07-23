// @vitest-environment jsdom

import '@/test/setupDom';

import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Route, Routes } from 'react-router-dom';
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

function renderGlossaryPage() {
  return renderWithRouter(
    <Routes>
      <Route path="/glossary" element={<GlossaryPage />} />
    </Routes>,
    `/glossary?term=${term.slug}`,
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
