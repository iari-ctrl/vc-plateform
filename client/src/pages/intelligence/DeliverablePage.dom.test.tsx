// @vitest-environment jsdom
import '@/test/setupDom';

import { cleanup, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { learningWorkspace } from '@/lib/learningWorkspace';
import { renderAppAt } from '@/test/renderApp';

const DELIVERABLE_ID = 'todo-attentes-serie-a';

describe('DeliverablePage — complétion fail-closed Série A', () => {
  beforeEach(() => {
    localStorage.clear();
    learningWorkspace.reload();
  });

  afterEach(() => {
    localStorage.clear();
    learningWorkspace.reload();
  });

  it('désactive la déclaration finale tant que les preuves de production, revue et révision manquent', async () => {
    expect(learningWorkspace.advanceProduction(DELIVERABLE_ID, 'started')).toEqual({ ok: true });
    expect(learningWorkspace.advanceProduction(DELIVERABLE_ID, 'first-version-completed')).toEqual({ ok: true });
    expect(learningWorkspace.advanceProduction(DELIVERABLE_ID, 'reviewed')).toEqual({ ok: true });
    expect(learningWorkspace.advanceProduction(DELIVERABLE_ID, 'revised')).toEqual({ ok: true });

    renderAppAt('/livrables/dossier-preparation-serie-a?parcours=p-serie-a&budget=medium');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Dossier de préparation Série A/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/Éléments encore requis avant complétion/i)).toBeInTheDocument();
    expect(screen.getByText(/une note de travail ou l’emplacement du fichier/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Déclarer le jalon terminé/i })).toBeDisabled();
    expect(screen.getByRole('link', { name: /Choisir de révéler la correction/i })).toHaveAttribute(
      'href',
      '/cases/altosuite-sas-dossier-serie-a/correction?parcours=p-serie-a&budget=medium',
    );
  });

  it('filtre les composants et critères avancés du livrable en mode medium', async () => {
    renderAppAt('/livrables/dossier-preparation-serie-a?parcours=p-serie-a&budget=medium');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Dossier de préparation Série A/i })).toBeInTheDocument();
    });

    expect(screen.getAllByRole('heading', { name: /Processus et data room/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Maîtrise du processus et de la data room/i)).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Adaptation sectorielle/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Tour complexe/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Pertinence de l’adaptation sectorielle/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Décomposition d’un tour complexe/i)).not.toBeInTheDocument();
  });

  it('expose les approfondissements en mode high et les signale facultatifs en accès direct', async () => {
    renderAppAt('/livrables/dossier-preparation-serie-a?parcours=p-serie-a&budget=high');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Dossier de préparation Série A/i })).toBeInTheDocument();
    });
    expect(screen.getAllByRole('heading', { name: /Adaptation sectorielle/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole('heading', { name: /Tour complexe/i }).length).toBeGreaterThan(0);
    expect(screen.getByText(/Pertinence de l’adaptation sectorielle/i)).toBeInTheDocument();
    expect(screen.getByText(/Décomposition d’un tour complexe/i)).toBeInTheDocument();

    cleanup();
    renderAppAt('/livrables/dossier-preparation-serie-a');
    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Dossier de préparation Série A/i })).toBeInTheDocument();
    });
    expect(screen.getAllByText(/Facultatif en accès direct/i)).toHaveLength(2);
  });
});
