// @vitest-environment jsdom

import '@/test/setupDom';

import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { UserDataProvider } from '@/context/UserDataProvider';
import { storage } from '@/lib/storage';
import { STORAGE_CONTRACTS } from '@/lib/storageDomains';
import { renderWithRouter } from '@/test/renderApp';
import DeliverablePage from '../intelligence/DeliverablePage';
import CourseDetailPage from './CourseDetailPage';
import LessonPage from './LessonPage';
import ParcoursDetailPage from './ParcoursDetailPage';

function renderRoute(path: string) {
  return renderWithRouter(
    <UserDataProvider>
      <Routes>
        <Route path="/parcours/:slug" element={<ParcoursDetailPage />} />
        <Route path="/courses/:slug" element={<CourseDetailPage />} />
        <Route path="/lessons/:slug" element={<LessonPage />} />
        <Route path="/livrables/:slug" element={<DeliverablePage />} />
      </Routes>
    </UserDataProvider>,
    path,
  );
}

describe('contexte de navigation du parcours entretien Analyst', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('transporte le parcours et le budget vers le cours agrégé et le jalon', () => {
    renderRoute('/parcours/reussir-l-entretien-analyst');

    expect(screen.getByRole('link', { name: /Réviser les mathématiques du VC/i })).toHaveAttribute(
      'href',
      '/courses/mathematiques-du-vc?parcours=p-entretien-analyst&budget=high',
    );
    for (const link of screen.getAllByRole('link', { name: /Produire et réviser le mock final|Ouvrir le jalon final/i })) {
      expect(link).toHaveAttribute('href', '/livrables/mock-entretien-analyst?parcours=p-entretien-analyst&budget=high');
    }
  });

  it('rend le jalon local, sûr et relié au parcours', () => {
    renderRoute('/livrables/mock-entretien-analyst?parcours=p-entretien-analyst&budget=high');

    const backLink = screen.getByRole('link', { name: /Réussir l['’]entretien Analyst/i });
    expect(backLink).toHaveAttribute('href', '/parcours/reussir-l-entretien-analyst?budget=high');

    const shopifySource = screen.getAllByRole('link', { name: /Shopify.*Bessemer/i })
      .find((link) => link.getAttribute('href') === 'https://www.bvp.com/memos/shopify');
    expect(shopifySource).toHaveAttribute('href', 'https://www.bvp.com/memos/shopify');
    expect(shopifySource).toHaveAttribute('target', '_blank');
    expect(shopifySource).toHaveAttribute('rel', 'noopener noreferrer');

    expect(screen.getByRole('link', { name: /Écrire un deal memo proportionné aux preuves/i })).toHaveAttribute(
      'href',
      '/lessons/le-deal-memo?parcours=p-entretien-analyst&budget=high',
    );
    expect(screen.getByRole('link', { name: /Conduire un mock complet et réviser la note/i })).toHaveAttribute(
      'href',
      '/lessons/le-mock-complet',
    );

    fireEvent.click(screen.getByRole('button', { name: /Commencer la production/i }));
    expect(screen.getAllByRole('textbox').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Exporter la fiche/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Déclarer la première version terminée/i })).toBeInTheDocument();
  });

  it('reprend sur une étape visible lorsque le budget medium masque les bonus', async () => {
    const completedLessonIds = [
      'lea-process',
      'lea-grille',
      'lea-market-sizing',
      'lea-read-startup',
      'lmv-market-sizing',
      'lmv-unit-economics',
      'lmv-cash-flow-scenarios',
      'lmv-pre-post-ownership',
      'lmv-dilution-cap-table',
      'lmv-valuation-economic-rights',
      'lmv-returns-waterfall',
      'lea-deal-memo',
      'lea-case-study',
      'lea-fund-research',
      'lea-pitch',
      'lea-fit',
    ];
    storage.setParsed(STORAGE_CONTRACTS.profile, { profileType: 'analyste', timeBudget: 'medium', scores: {} });
    storage.setParsed(STORAGE_CONTRACTS.progress, Object.fromEntries(completedLessonIds.map((lessonId) => [
      lessonId,
      { lessonId, status: 'done', percent: 100, pathId: 'p-entretien-analyst' },
    ])));

    renderRoute('/parcours/reussir-l-entretien-analyst');

    expect(await screen.findByRole('link', { name: /Reprendre où j’en étais/i })).toHaveAttribute(
      'href',
      '/livrables/mock-entretien-analyst?parcours=p-entretien-analyst&budget=medium',
    );
    expect(screen.getByText('10/11 · 91%')).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /Préparer tes questions au recruteur/i })).not.toBeInTheDocument();
  });

  it('conserve le contexte dans les liens du cours de mathématiques', () => {
    renderRoute('/courses/mathematiques-du-vc?parcours=p-entretien-analyst&budget=high');

    expect(screen.getByRole('link', { name: /Dimensionnement de marché : méthodes, sources et sensibilités/i })).toHaveAttribute(
      'href',
      '/lessons/market-sizing-tam-sam-som?parcours=p-entretien-analyst&budget=high',
    );
    expect(screen.getByRole('link', { name: /Commencer le cours/i })).toHaveAttribute(
      'href',
      '/lessons/market-sizing-tam-sam-som?parcours=p-entretien-analyst&budget=high',
    );
    const backLink = screen.getAllByRole('link', { name: /Réussir l['’]entretien Analyst/i })
      .find((link) => link.classList.contains('btn-quiet'));
    expect(backLink).toHaveAttribute('href', '/parcours/reussir-l-entretien-analyst?budget=high');
  });

  it('préserve la navigation canonique d’une leçon ouverte hors parcours', async () => {
    renderRoute('/lessons/lire-une-startup-unit-economics');

    const next = await screen.findByRole('link', { name: /Suivant.*Répondre aux questions techniques/i });
    expect(next).toHaveAttribute('href', '/lessons/les-questions-techniques');
  });

  it('sort du cours partagé et saute les bonus selon le budget transporté', async () => {
    const mathPage = renderRoute('/lessons/returns-moic-irr-dpi-tvpi-waterfall?parcours=p-entretien-analyst&budget=high');
    const afterMath = await screen.findByRole('link', { name: /Suivant.*Écrire une recommandation courte/i });
    expect(afterMath).toHaveAttribute('href', '/lessons/le-deal-memo?parcours=p-entretien-analyst&budget=high');
    mathPage.unmount();

    renderRoute('/lessons/le-fit-why-vc-why-fund-why-you?parcours=p-entretien-analyst&budget=medium');
    const afterFit = await screen.findByRole('link', { name: /Suivant.*Produire et réviser le mock final/i });
    expect(afterFit).toHaveAttribute('href', '/livrables/mock-entretien-analyst?parcours=p-entretien-analyst&budget=medium');
  });
});
