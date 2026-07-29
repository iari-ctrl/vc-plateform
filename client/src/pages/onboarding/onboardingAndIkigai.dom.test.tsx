// @vitest-environment jsdom
import '@/test/setupDom';

import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { renderAppAt } from '@/test/renderApp';

describe('Onboarding produit et cahier Ikigai', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('rend /onboarding comme une porte d’entrée courte vers les sections principales', async () => {
    renderAppAt('/onboarding');

    expect(await screen.findByRole('heading', { level: 1, name: /choisissez votre point de départ/i })).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /ouvrir l’intelligence vc/i })).toHaveAttribute('href', '/intelligence');
    expect(screen.getByRole('link', { name: /parcourir la formation/i })).toHaveAttribute('href', '/parcours');
    expect(screen.getByRole('link', { name: /ouvrir le workspace/i })).toHaveAttribute('href', '/dashboard');
    expect(screen.getByRole('link', { name: /ouvrir le cahier ikigai/i })).toHaveAttribute('href', '/ikigai');
    expect(screen.getByRole('link', { name: /voir la vue d’ensemble/i })).toHaveAttribute('href', '/home');

    expect(screen.queryByText(/cahier d’introspection · n° 01/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /commencer le test/i })).not.toBeInTheDocument();
  });

  it('conserve le cahier actuel sur /ikigai', async () => {
    renderAppAt('/ikigai');

    expect(await screen.findByRole('heading', { level: 1, name: /pourquoi le capital-risque vous attire-t-il vraiment/i })).toBeInTheDocument();
    expect(screen.getByText(/cahier d’introspection · n° 01/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /passer le test d’orientation/i })).toBeInTheDocument();
  });

  it('ouvre directement le test d’orientation sur /ikigai?test=1', async () => {
    renderAppAt('/ikigai?test=1');

    expect(await screen.findByText(/question 1 \/ 9/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /où en êtes-vous avec le capital-risque aujourd['’]hui/i })).toBeInTheDocument();
  });

  it('préserve les anciens favoris /onboarding?test=1 en les redirigeant vers le test Ikigai', async () => {
    renderAppAt('/onboarding?test=1&q=2');

    expect(await screen.findByText(/question 3 \/ 9/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /votre objectif principal pour les douze prochains mois/i })).toBeInTheDocument();
  });
});
