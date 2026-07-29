// @vitest-environment jsdom
import '@/test/setupDom';

import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { renderAppAt } from '@/test/renderApp';

describe('CaseStudyPage — corrections commentées', () => {
  it('publie la correction commentée AltoSuite sans masquer le tableau numérique', async () => {
    renderAppAt('/cases/altosuite-sas-dossier-serie-a?parcours=p-serie-a&budget=medium');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: 'AltoSuite SAS : préparer une Série A' })).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { name: /Comparaison chiffrée des offres Série A/i })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /Cap table pédagogique fully diluted/i })).toBeInTheDocument();
    for (const rowName of [
      'Fondateurs',
      'Options attribuées',
      'Réserve non attribuée',
      'Investisseurs seed',
      'Instruments convertibles',
      'Primaire Série A préférentiel',
      'Secondaire Série A ordinaire',
      'Total',
    ]) {
      expect(screen.getAllByRole('row', { name: new RegExp(rowName, 'i') }).length).toBeGreaterThan(0);
    }
    expect(screen.getByRole('columnheader', { name: /Autres détenteurs modélisés/i })).toBeInTheDocument();
    expect(screen.queryByRole('columnheader', { name: /^Ordinaires$/i })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Accéder à la correction commentée/i })).toHaveAttribute(
      'href',
      '/cases/altosuite-sas-dossier-serie-a/correction?parcours=p-serie-a&budget=medium',
    );
    expect(screen.queryByText(/conclusions financières figurent uniquement/i)).not.toBeInTheDocument();
  });

  it('conserve la correction commentée quand elle existe pour un dossier apprenant', async () => {
    renderAppAt('/cases/insertion-3-regions');

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1, name: /Trait d’Union/i })).toBeInTheDocument();
    });

    expect(screen.getByRole('link', { name: /Accéder à la correction commentée/i })).toBeInTheDocument();
  });
});
