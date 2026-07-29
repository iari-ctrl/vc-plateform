// @vitest-environment jsdom
import '@/test/setupDom';

import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import {
  DimensionsSection,
  IntersectionsSection,
  PresqueSection,
} from '@/components/ikigai/CahierSections';
import { ThemeProvider } from '@/context/ThemeProvider';

function renderEditorialFragments() {
  render(
    <ThemeProvider>
      <DimensionsSection
        mode="decouverte"
        onMode={vi.fn()}
        activeDim={null}
        onSelectDim={vi.fn()}
      />
      <IntersectionsSection mode="decouverte" onMode={vi.fn()} activeId={null} />
      <PresqueSection mode="decouverte" onMode={vi.fn()} activeId={null} />
    </ThemeProvider>,
  );
}

describe('Cahier Ikigai — mise en page éditoriale', () => {
  it('utilise toute la largeur disponible pour les développements des fragments', () => {
    renderEditorialFragments();

    for (const title of [
      "Ce qu'une personne passionnée de capital-risque peut y placer.",
      "Quatre demi-chemins, et leur zone d'ombre.",
      'Le piège des trois-sur-quatre.',
    ]) {
      const section = screen.getByRole('heading', { level: 2, name: title }).closest('section');
      const developments = section?.querySelector('.divide-y');

      expect(developments).toHaveClass('w-full');
      expect(developments).not.toHaveClass('lg:w-[52%]');
    }
  });

  it('présente les sous-titres sans cadre en conservant leur taille typographique', () => {
    renderEditorialFragments();

    const subtitle = screen.getByRole('heading', {
      level: 3,
      name: "Ce que j'aime explorer",
    });
    const stickyWrapper = subtitle.closest('button')?.parentElement;

    expect(subtitle).toHaveClass('font-headline', 'text-headline-md');
    expect(stickyWrapper).toHaveClass('sticky', 'py-2');
    expect(stickyWrapper).not.toHaveClass(
      'rounded-lg',
      'border',
      'shadow-editorial-xs',
      'px-2.5',
      'sm:px-3',
    );
  });
});
