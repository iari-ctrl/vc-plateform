// @vitest-environment jsdom
import '@/test/setupDom';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { learningWorkspace } from '@/lib/learningWorkspace';
import { renderAppAt } from '@/test/renderApp';

const DELIVERABLE_ID = 'todo-attentes-serie-a';
const CORRECTION_PATH = '/cases/altosuite-sas-dossier-serie-a/correction?parcours=p-serie-a&budget=medium';

describe('CaseCorrectionPage — AltoSuite Série A', () => {
  beforeEach(() => {
    localStorage.clear();
    learningWorkspace.reload();
  });

  afterEach(() => {
    localStorage.clear();
    learningWorkspace.reload();
  });

  it('bloque la correction tant qu’une première version du jalon final n’est pas déclarée', async () => {
    renderAppAt(CORRECTION_PATH);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Terminez une première version/i })).toBeInTheDocument();
    });

    expect(screen.queryByRole('button', { name: /Révéler la correction commentée/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ouvrir le jalon final/i })).toHaveAttribute(
      'href',
      '/livrables/dossier-preparation-serie-a?parcours=p-serie-a&budget=medium',
    );
  });

  it('révèle volontairement la correction après première version et conserve le contexte parcours', async () => {
    expect(learningWorkspace.advanceProduction(DELIVERABLE_ID, 'started')).toEqual({ ok: true });
    expect(learningWorkspace.advanceProduction(DELIVERABLE_ID, 'first-version-completed')).toEqual({ ok: true });

    renderAppAt(CORRECTION_PATH);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Révéler la correction commentée/i })).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: /Révéler la correction commentée/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Correction commentée : AltoSuite Série A/i })).toBeInTheDocument();
    });

    expect(screen.getByText(/Protocole de négociation et révision/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Réviser ma production/i })).toHaveAttribute(
      'href',
      '/livrables/dossier-preparation-serie-a?parcours=p-serie-a&budget=medium',
    );
    expect(screen.getByRole('link', { name: /Revoir le dossier apprenant/i })).toHaveAttribute(
      'href',
      '/cases/altosuite-sas-dossier-serie-a?parcours=p-serie-a&budget=medium',
    );
  });
});
