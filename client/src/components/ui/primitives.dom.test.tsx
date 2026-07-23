// @vitest-environment jsdom
import '@/test/setupDom';

import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Button, SectionHeading } from '@/components/ui/primitives';
import { renderWithRouter } from '@/test/renderApp';

describe('SectionHeading', () => {
  it('conserve h2 par défaut pour les sections internes', () => {
    renderWithRouter(<SectionHeading eyebrow="Section" title="Titre de section" />);

    expect(screen.getByRole('heading', { level: 2, name: 'Titre de section' })).toBeInTheDocument();
  });

  it('peut exposer un h1 pour le titre principal d’une route', () => {
    renderWithRouter(<SectionHeading as="h1" eyebrow="Route" title="Titre de route" />);

    expect(screen.getByRole('heading', { level: 1, name: 'Titre de route' })).toBeInTheDocument();
  });
});

describe('Button', () => {
  it('utilise type="button" par défaut pour éviter les soumissions implicites', () => {
    renderWithRouter(<Button>Action locale</Button>);

    expect(screen.getByRole('button', { name: 'Action locale' })).toHaveAttribute('type', 'button');
  });
});
