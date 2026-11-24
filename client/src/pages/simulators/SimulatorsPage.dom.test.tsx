// @vitest-environment jsdom
import '@/test/setupDom';
import { fireEvent, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SIMULATORS } from '@/content/simulators';
import { PrePostSim } from '@/components/simulators/pre-post-money';
import { renderWithRouter } from '@/test/renderApp';
import SimulatorsPage from './SimulatorsPage';

describe('catalogue des simulateurs', () => {
  it('donne à chaque outil une seule destination dans une décision nommée', () => {
    renderWithRouter(<SimulatorsPage />);
    expect(screen.getByRole('heading', { name: 'Simulateurs', level: 1 })).toBeInTheDocument();
    const links = screen.getAllByRole('region').flatMap(region => within(region).getAllByRole('link'));
    expect(links.map(link => link.getAttribute('href')).sort()).toEqual(
      SIMULATORS.map(sim => `/simulators/${sim.slug}`).sort(),
    );
    const funding = screen.getByRole('region', { name: 'Préparer une levée' });
    expect(within(funding).getAllByRole('link')[0]).toHaveAccessibleName('Pre-money / Post-money');
  });

  it('recalcule la part du nouvel investisseur à la saisie des deux montants', () => {
    renderWithRouter(<PrePostSim accent="var(--primary)" />);
    const pre = screen.getByRole('spinbutton', { name: /valorisation.*avant le tour/i });
    const raise = screen.getByRole('spinbutton', { name: /montant levé/i });
    fireEvent.change(pre, { target: { value: '' } });
    expect(pre).toHaveAttribute('aria-invalid', 'true');
    expect(screen.queryByText('20 %')).not.toBeInTheDocument();
    fireEvent.change(pre, { target: { value: '6' } });
    fireEvent.change(raise, { target: { value: '4' } });
    expect(screen.getByText('40 %')).toBeInTheDocument();
    fireEvent.change(pre, { target: { value: '8' } });
    fireEvent.change(raise, { target: { value: '2' } });
    expect(screen.getByText('20 %')).toBeInTheDocument();
    expect(screen.getByText('10 M€')).toBeInTheDocument();
  });
});
