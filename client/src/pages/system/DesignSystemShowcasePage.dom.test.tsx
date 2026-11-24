// @vitest-environment jsdom
import '@/test/setupDom';

import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/context/ThemeProvider';
import { renderWithRouter } from '@/test/renderApp';
import DesignSystemShowcasePage from './DesignSystemShowcasePage';

let previewStyles: HTMLStyleElement;

beforeEach(() => {
  localStorage.clear();
  previewStyles = document.createElement('style');
  // Deliberately different from the production palette: captions must follow CSS.
  previewStyles.textContent = ':root { --primary: #123456; } .dark { --primary: #abcdef; }';
  document.head.append(previewStyles);
});

afterEach(() => previewStyles.remove());

function renderCatalogue() {
  return renderWithRouter(<ThemeProvider><DesignSystemShowcasePage /></ThemeProvider>, '/design-system');
}

describe('Catalogue de design', () => {
  it('lit la couleur appliquée et actualise sa légende après un changement de thème', async () => {
    const user = userEvent.setup();
    renderCatalogue();
    expect(await screen.findByText('Valeur calculée (clair) : #123456')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Passer en mode sombre' }));
    expect(await screen.findByText('Valeur calculée (sombre) : #abcdef')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Passer en mode clair' }));
    expect(await screen.findByText('Valeur calculée (clair) : #123456')).toBeInTheDocument();
  });

  it('mesure la typographie rendue et la relit au redimensionnement', async () => {
    const user = userEvent.setup();
    previewStyles.textContent += '.text-display-md { font-size: 46px; line-height: 50.6px; letter-spacing: -0.92px; }';
    renderCatalogue();
    await user.click(screen.getByRole('button', { name: 'Typographie' }));
    expect(await screen.findByText('Taille : 46px · Interligne : 50.6px · Espacement : -0.92px')).toBeInTheDocument();
    previewStyles.textContent += '.text-display-md { font-size: 32px; line-height: 40px; letter-spacing: 0px; }';
    fireEvent(window, new Event('resize'));
    await waitFor(() => expect(screen.getByText('Taille : 32px · Interligne : 40px · Espacement : 0px')).toBeInTheDocument());
  });

  it('présente un vrai lien de carte et un chargement annoncé', async () => {
    const user = userEvent.setup();
    renderCatalogue();
    await user.click(screen.getByRole('button', { name: 'Cartes & Verre' }));
    expect(screen.getByRole('link', { name: /Carte avec lien/ })).toHaveAttribute('href', '/parcours');
    await user.click(screen.getByRole('button', { name: 'Primitives UI' }));
    expect(screen.getByRole('status')).toHaveTextContent('Chargement du catalogue…');
  });
});
