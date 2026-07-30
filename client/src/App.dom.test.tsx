// @vitest-environment jsdom
import '@/test/setupDom';

import axe from 'axe-core';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PageFallback } from '@/App';
import { renderAppAt, renderWithRouter } from '@/test/renderApp';

const sampledRoutes = [
  { path: '/certifications', marker: /Évaluer des connaissances et des pratiques professionnelles/i },
  { path: '/certifications/niveaux', marker: /Cinq niveaux, une progression de responsabilités/i },
  { path: '/parcours/venture-philanthropy-foundations/diagnostic', marker: /Diagnostic facultatif/i },
  { path: '/cases/insertion-3-regions/correction', marker: /Terminez une première version|Comparer vos arbitrages|Correction révélée/i },
];

describe('App DOM contract', () => {
  it("oriente la sortie du splash vers l'accueil home sans kanji décoratif", async () => {
    const { container } = renderAppAt('/');

    const enterLink = await screen.findByRole('link', { name: /accéder à l’accueil/i });
    expect(enterLink).toHaveAttribute('href', '/home');
    expect(container).not.toHaveTextContent(/[\u4E00-\u9FFF]/u);
  });

  it('rend une route avec nom accessible, interaction clavier et contrôle axe ciblé', async () => {
    const user = userEvent.setup();
    const { container } = renderAppAt('/search');

    const searchbox = await screen.findByRole('searchbox', { name: /rechercher sur la plateforme/i });
    await user.type(searchbox, 'capital{Enter}');

    await waitFor(() => {
      expect(searchbox).toHaveValue('capital');
    });
    expect(screen.getByRole('heading', { level: 1, name: /explorer toute la plateforme/i })).toBeInTheDocument();

    const results = await axe.run(container, {
      runOnly: ['wcag2a', 'wcag2aa'],
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });

  it.each(sampledRoutes)('rend un seul landmark main pour $path', async ({ path, marker }) => {
    const { container } = renderAppAt(path);

    await screen.findByText(marker);

    expect(container.querySelectorAll('main')).toHaveLength(1);
  });

  it('expose un libellé perceptible pendant le chargement lazy', () => {
    renderWithRouter(<PageFallback />);

    expect(screen.getByRole('status')).toHaveTextContent(/chargement/i);
  });
});
