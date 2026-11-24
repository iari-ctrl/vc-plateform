// @vitest-environment jsdom
import '@/test/setupDom';

import { fireEvent, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { readFileSync } from 'node:fs';
import { Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DilutionSim } from '@/components/simulators/dilution';
import { InvestmentMemoSim } from '@/components/simulators/investment-memo';
import { OwnershipSim } from '@/components/simulators/ownership';
import { UserDataProvider } from '@/context/UserDataProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import SimulatorPage from '@/pages/simulators/SimulatorPage';
import { renderWithRouter } from '@/test/renderApp';

describe('simulateurs C4 — DOM', () => {
  afterEach(() => vi.restoreAllMocks());
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

  it('intègre les commandes réelles dans le moteur sans deuxième en-tête ni cadre', () => {
    renderWithRouter(<ThemeProvider><InvestmentMemoSim accent="#8A2B22" platformActions={<button type="button">Ressources liées</button>} /></ThemeProvider>);

    expect(screen.queryByRole('heading', { name: /rédiger la note/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/pour finaliser l’export/i)).not.toBeInTheDocument();
    const frame = screen.getByTitle("Simulateur de note d'investissement") as HTMLIFrameElement;
    expect(frame).toHaveAttribute('src', '/tools/simulateur-memo.html?embedded=1');
    expect(frame).toHaveAttribute('allow', 'clipboard-write');
    expect(frame).not.toHaveClass('h-[82svh]');
    expect(frame.parentElement).not.toHaveClass('rounded-2xl');
    const frameDocument = frame.contentDocument!;
    const html = frameDocument.createElement('html');
    html.innerHTML = '<body><div class="memo-app"><div id="memo-platform-actions"></div></div></body>';
    frameDocument.replaceChildren(html);
    fireEvent.load(frame);
    const embedded = within(frame.contentDocument!.body);
    expect(embedded.getByRole('button', { name: 'Ressources liées' })).toBeInTheDocument();
    expect(embedded.getByRole('link', { name: /pleine page/i })).toHaveAttribute('target', '_blank');
    expect(embedded.getByRole('link', { name: /pleine page/i }).getAttribute('href')).toMatch(/^\/tools\/simulateur-memo.html\?theme=(light|dark)$/);
  });

  it('révèle dans la page hôte le focus situé sous la fenêtre du simulateur', () => {
    vi.stubGlobal('innerHeight', 900);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { callback(0); return 1; });
    const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => {});
    renderWithRouter(<ThemeProvider><InvestmentMemoSim accent="#8A2B22" /></ThemeProvider>);
    const frame = screen.getByTitle("Simulateur de note d'investissement") as HTMLIFrameElement;
    const doc = frame.contentDocument!;
    const html = doc.createElement('html');
    html.innerHTML = '<body><div class="memo-app"><div id="memo-platform-actions"></div><button>Relecture</button></div></body>';
    doc.replaceChildren(html);
    Object.defineProperty(frame, 'clientHeight', { value: 1500 });
    vi.spyOn(frame, 'getBoundingClientRect').mockReturnValue({ top: 56 } as DOMRect);
    vi.spyOn(doc.querySelector('.memo-app')!, 'getBoundingClientRect').mockReturnValue({ height: 1500 } as DOMRect);
    const review = doc.querySelector('button')!;
    vi.spyOn(review, 'getBoundingClientRect').mockReturnValue({ top: 950, bottom: 994, height: 44 } as DOMRect);
    fireEvent.load(frame);
    review.focus();
    expect(scroll).toHaveBeenCalledWith({ top: 56 + 994 - 900 + 16, behavior: 'instant' });
  });

  it('révèle un champ masqué par les commandes persistantes sans déplacer leurs propres boutons', () => {
    vi.stubGlobal('innerHeight', 900);
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { callback(0); return 1; });
    const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => {});
    renderWithRouter(<ThemeProvider><InvestmentMemoSim accent="#8A2B22" /></ThemeProvider>);
    const frame = screen.getByTitle("Simulateur de note d'investissement") as HTMLIFrameElement;
    const doc = frame.contentDocument!;
    const html = doc.createElement('html');
    html.innerHTML = '<body><div class="memo-app"><header class="memo-header" style="position:sticky"><div id="memo-platform-actions"></div><button>Export PDF</button></header><nav class="memo-rail" style="position:sticky"></nav><input aria-label="Entreprise" /></div></body>';
    doc.replaceChildren(html);
    Object.defineProperty(frame, 'clientHeight', { value: 1500 });
    vi.spyOn(frame, 'getBoundingClientRect').mockReturnValue({ top: 0 } as DOMRect);
    vi.spyOn(doc.querySelector('.memo-app')!, 'getBoundingClientRect').mockReturnValue({ height: 1500 } as DOMRect);
    Object.defineProperty(doc.querySelector('.memo-header')!, 'offsetHeight', { value: 80 });
    Object.defineProperty(doc.querySelector('.memo-rail')!, 'offsetHeight', { value: 120 });
    const input = doc.querySelector('input')!;
    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue({ top: 100, bottom: 144, height: 44 } as DOMRect);
    fireEvent.load(frame);
    input.focus();
    expect(scroll).toHaveBeenLastCalledWith({ top: -116, behavior: 'instant' });
    scroll.mockClear();
    const action = doc.querySelector('button')!;
    vi.spyOn(action, 'getBoundingClientRect').mockReturnValue({ top: 20, bottom: 60, height: 40 } as DOMRect);
    action.focus();
    expect(scroll).not.toHaveBeenCalled();
  });

  it('synchronise le bandeau persistant avec le défilement hôte et le retire au démontage', () => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => { callback(0); return 1; });
    const { unmount } = renderWithRouter(<ThemeProvider><InvestmentMemoSim accent="#8A2B22" /></ThemeProvider>);
    const frame = screen.getByTitle("Simulateur de note d'investissement") as HTMLIFrameElement;
    const doc = frame.contentDocument!;
    const html = doc.createElement('html');
    html.innerHTML = '<body><div class="memo-app"><header class="memo-header"><div id="memo-platform-actions"></div></header></div></body>';
    doc.replaceChildren(html);
    let top = 0;
    vi.spyOn(frame, 'getBoundingClientRect').mockImplementation(() => ({ top } as DOMRect));
    fireEvent.load(frame);
    const root = doc.querySelector<HTMLElement>('.memo-app')!;
    expect(root.style.getPropertyValue('--memo-viewport-top')).toBe('0px');

    top = -250;
    fireEvent.scroll(window);
    expect(root.style.getPropertyValue('--memo-viewport-top')).toBe('250px');
    top = -450;
    fireEvent.scroll(window);
    expect(root.style.getPropertyValue('--memo-viewport-top')).toBe('450px');

    unmount();
    top = -650;
    fireEvent.scroll(window);
    expect(root.style.getPropertyValue('--memo-viewport-top')).toBe('450px');
  });

  it('laisse l’en-tête hôte se contracter à la largeur équivalente au zoom 200 %', () => {
    renderWithRouter(
      <ThemeProvider><UserDataProvider>
        <Routes>
          <Route path="/simulators/:slug" element={<SimulatorPage />} />
        </Routes>
      </UserDataProvider></ThemeProvider>,
      '/simulators/simulateur-note-investissement',
    );

    const heading = screen.getByRole('heading', { level: 1, name: 'Note d’investissement' });
    expect(heading).toHaveClass('break-words');
    expect(heading).toHaveClass('sr-only');
    expect(document.querySelector('[data-memo-workspace]')).toBeInTheDocument();
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
