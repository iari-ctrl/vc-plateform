// @vitest-environment jsdom
import '@/test/setupDom';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ViewportSwitcher } from '@/components/dev/ViewportSwitcher';

describe('ViewportSwitcher dev — superposition avec les couches produit', () => {
  it('laisse la barre responsive desktop derrière les menus et contrôles flottants du produit', () => {
    render(
      <ViewportSwitcher>
        <main>Produit</main>
      </ViewportSwitcher>,
    );

    const responsivePreview = screen.getByRole('group', { name: 'Aperçu responsive' });
    const styleSheet = document.querySelector('style')?.textContent ?? '';

    expect(responsivePreview).toHaveAttribute('data-device', 'desktop');
    expect(styleSheet).toContain('.vcvp-bar[data-device="desktop"]');
    expect(styleSheet).toContain('z-index: 65;');
    expect(styleSheet).toContain('.vcvp-bar:not([data-device="desktop"])');
    expect(styleSheet).toContain('z-index: 2147483000;');
  });
});
