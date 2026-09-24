// @vitest-environment jsdom
import '@/test/setupDom';

import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { DilutionSim } from '@/components/simulators/dilution';
import { InvestmentMemoSim } from '@/components/simulators/investment-memo';
import { OwnershipSim } from '@/components/simulators/ownership';
import { UserDataProvider } from '@/context/UserDataProvider';
import SimulatorPage from '@/pages/simulators/SimulatorPage';
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

  it('place le simulateur de note avant tout préambule redondant', () => {
    renderWithRouter(<InvestmentMemoSim accent="#8A2B22" />);

    expect(screen.getByRole('heading', { name: /rédiger la note/i })).toBeInTheDocument();
    expect(screen.getByText(/saisie enregistrée localement.*export pdf/i)).toBeInTheDocument();
    expect(screen.queryByText(/structure contrainte/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/données locales/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/export navigateur/i)).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ouvrir en pleine page/i })).toHaveAttribute('href', '/tools/simulateur-memo.html');
    const frame = screen.getByTitle("Simulateur de note d'investissement");
    expect(frame).toHaveAttribute('src', '/tools/simulateur-memo.html');
    expect(frame).toHaveAttribute('allow', 'clipboard-write');
    expect(frame).toHaveClass('h-[82svh]', 'min-h-[42rem]', 'sm:h-[900px]');
    expect(frame.parentElement).not.toHaveClass('shadow-[0_18px_60px_color-mix(in_srgb,var(--foreground)_10%,transparent)]');
  });

  it('laisse l’en-tête hôte se contracter à la largeur équivalente au zoom 200 %', () => {
    renderWithRouter(
      <UserDataProvider>
        <Routes>
          <Route path="/simulators/:slug" element={<SimulatorPage />} />
        </Routes>
      </UserDataProvider>,
      '/simulators/simulateur-note-investissement',
    );

    const heading = screen.getByRole('heading', { level: 1, name: /simulateur de note d'investissement/i });
    expect(heading).toHaveClass('break-words');
    expect(heading.parentElement).toHaveClass('min-w-0');
    expect(heading.parentElement?.parentElement).toHaveClass('min-w-0');
  });

  it('relie les champs numériques du template servi à leurs explications locales', () => {
    const html = readFileSync('public/tools/simulateur-memo.html', 'utf8');
    const encoded = html.match(/<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/)?.[1];
    expect(encoded).toBeTruthy();
    // Structural contract only; the Node tests execute the embedded logic and
    // Chromium verifies the custom runtime's actual rendering and interactions.
    const doc = new DOMParser().parseFromString(JSON.parse(encoded!), 'text/html');
    for (const key of ['preMoney', 'amount', 'ticket', 'dilution', 'exitValue', 'fundSize']) {
      const input = doc.getElementById(`memo-${key}`);
      expect(input).not.toBeNull();
      expect(input?.getAttribute('aria-invalid')).toBe(`{{ numericHelp.${key}.invalid }}`);
      expect(input?.getAttribute('aria-describedby')).toBe(`memo-${key}-help`);
      expect(doc.getElementById(`memo-${key}-help`)?.textContent).toBe(`{{ numericHelp.${key}.message }}`);
    }
    expect(doc.querySelector('input[value="{{ c.ov }}"]')?.getAttribute('aria-label')).toBe('{{ c.label }}');
    expect(doc.querySelector('[data-memo-method]')).not.toBeNull();
  });
});
