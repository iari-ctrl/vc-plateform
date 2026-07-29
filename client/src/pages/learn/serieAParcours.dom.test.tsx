// @vitest-environment jsdom

import '@/test/setupDom';

import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';

import { UserDataProvider } from '@/context/UserDataProvider';
import { learningWorkspace, learningActivityKey } from '@/lib/learningWorkspace';
import { renderWithRouter } from '@/test/renderApp';
import CaseStudyPage from '../cases/CaseStudyPage';
import DeliverablePage from '../intelligence/DeliverablePage';
import SimulatorPage from '../simulators/SimulatorPage';
import LessonPage from './LessonPage';
import ParcoursDetailPage from './ParcoursDetailPage';

function renderRoute(path: string) {
  return renderWithRouter(
    <UserDataProvider>
      <Routes>
        <Route path="/parcours/:slug" element={<ParcoursDetailPage />} />
        <Route path="/lessons/:slug" element={<LessonPage />} />
        <Route path="/cases/:slug" element={<CaseStudyPage />} />
        <Route path="/simulators/:slug" element={<SimulatorPage />} />
        <Route path="/livrables/:slug" element={<DeliverablePage />} />
      </Routes>
    </UserDataProvider>,
    path,
  );
}

describe('parcours Série A — navigation, progression et reprise', () => {
  beforeEach(() => {
    localStorage.clear();
    learningWorkspace.reload();
  });

  it('conserve parcours et budget depuis le cas AltoSuite et l’achève seulement sur action explicite', () => {
    renderRoute('/cases/altosuite-sas-dossier-serie-a?parcours=p-serie-a&budget=medium');

    expect(screen.getByRole('link', { name: /Préparer ma Série A/i })).toHaveAttribute(
      'href',
      '/parcours/preparer-ma-serie-a?budget=medium',
    );
    expect(screen.getByRole('link', { name: /Suivant.*Modéliser la transaction/i })).toHaveAttribute(
      'href',
      '/lessons/serie-a-modeliser-transaction-cap-table?parcours=p-serie-a&budget=medium',
    );
    expect(screen.getByRole('heading', { name: /Comparaison chiffrée des offres Série A/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Exporter les tableaux/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /Comparaison exportable des offres Série A AltoSuite/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /Répartition du produit de cession/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Répartition à la sortie/i })).toBeInTheDocument();
    expect(screen.getByText(/900 000 équivalents actions convertibles/i)).toBeInTheDocument();
    const activityKey = learningActivityKey('p-serie-a', 'case', 'cs-serie-a-alto-sas');
    expect(learningWorkspace.getSnapshot().activities[activityKey]).toBeUndefined();

    fireEvent.click(screen.getByRole('button', { name: /Marquer cette activité effectuée/i }));

    expect(screen.getAllByText(/Activité effectuée/i).length).toBeGreaterThan(0);
    expect(learningWorkspace.getSnapshot().activities[activityKey]?.completed).toBe(true);
  });

  it('distingue le temps de lecture recalibré et la production guidée', () => {
    renderRoute('/parcours/preparer-ma-serie-a?budget=medium');

    expect(screen.getByText(/18 min de lecture · 10 h 34 de production/i)).toBeInTheDocument();
    expect(screen.getByText('Lectures et consignes')).toBeInTheDocument();
    expect(screen.getAllByText('18 min').length).toBeGreaterThan(0);
    expect(screen.getByText('Contributions guidées')).toBeInTheDocument();
    expect(screen.getByText('7 h 16')).toBeInTheDocument();
    expect(screen.getByText(/Charge requise estimée, lecture comprise/i)).toHaveTextContent('10 h 52');
  });

  it('conserve le contexte dans les simulateurs et ignore un budget non supporté', () => {
    const contextualModelingHref = '/lessons/serie-a-modeliser-transaction-cap-table?parcours=p-serie-a&budget=medium';
    const contextual = renderRoute('/simulators/dilution?parcours=p-serie-a&budget=medium');

    expect(screen.getByRole('link', { name: /Préparer ma Série A/i })).toHaveAttribute(
      'href',
      '/parcours/preparer-ma-serie-a?budget=medium',
    );
    expect(screen.getByRole('link', { name: /Précédent.*Modéliser la transaction/i })).toHaveAttribute(
      'href',
      contextualModelingHref,
    );
    expect(screen.getByRole('link', { name: /Suivant.*Waterfall et préférence/i })).toHaveAttribute(
      'href',
      '/simulators/waterfall?parcours=p-serie-a&budget=medium',
    );
    expect(screen.getAllByRole('link', { name: /Modéliser la transaction et la cap table/i }).some((link) => (
      link.getAttribute('href') === contextualModelingHref
    ))).toBe(true);
    contextual.unmount();

    const waterfall = renderRoute('/simulators/waterfall?parcours=p-serie-a&budget=medium');
    expect(screen.getAllByRole('link', { name: /Modéliser la transaction et la cap table/i }).some((link) => (
      link.getAttribute('href') === contextualModelingHref
    ))).toBe(true);
    waterfall.unmount();

    renderRoute('/simulators/dilution?parcours=p-serie-a&budget=low');
    expect(screen.getByRole('link', { name: /Simulateurs/i })).toHaveAttribute('href', '/simulators');
    expect(screen.queryByRole('link', { name: /Préparer ma Série A/i })).not.toBeInTheDocument();
  });
});
