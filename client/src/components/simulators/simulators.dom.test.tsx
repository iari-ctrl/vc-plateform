// @vitest-environment jsdom
import '@/test/setupDom';

import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { DilutionSim } from '@/components/simulators/dilution';
import { OwnershipSim } from '@/components/simulators/ownership';
import { renderWithRouter } from '@/test/renderApp';

describe('simulateurs C4 — DOM', () => {
  it('rend le tableau de dilution comme une table nommée et localement défilable', () => {
    renderWithRouter(<DilutionSim accent="var(--primary)" />);

    const table = screen.getByRole('table', { name: /séquence de dilution/i });
    expect(table.closest('[data-scroll-region="simulator-table"]')).toHaveClass('overflow-x-auto');
    expect(within(table).getByRole('columnheader', { name: /tour/i })).toHaveAttribute('scope', 'col');
    expect(within(table).getByRole('rowheader', { name: /seed/i })).toHaveAttribute('scope', 'row');
  });

  it('rend la cap table avec un total en en-tête de ligne et une ligne d’édition repliable', async () => {
    const user = userEvent.setup();
    renderWithRouter(<OwnershipSim accent="var(--primary)" />);

    const table = screen.getByRole('table', { name: /capitalisation par détenteur/i });
    expect(table.closest('[data-scroll-region="simulator-table"]')).toHaveClass('overflow-x-auto');
    expect(within(table).getByRole('rowheader', { name: /total/i })).toHaveAttribute('scope', 'row');

    const holderName = screen.getByRole('textbox', { name: /nom du détenteur fondateurs/i });
    await user.clear(holderName);
    await user.type(holderName, 'Fondateurs avec un intitulé volontairement long');

    expect(holderName.closest('[data-ownership-row]')).toHaveClass('grid');
    expect(screen.getByRole('spinbutton', { name: /actions de fondateurs avec un intitulé volontairement long/i })).toBeInTheDocument();
  });
});
