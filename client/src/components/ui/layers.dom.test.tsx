// @vitest-environment jsdom
import '@/test/setupDom';

import { useState } from 'react';
import axe from 'axe-core';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { Modal } from '@/components/ui/Modal';
import { renderWithRouter } from '@/test/renderApp';

function expectInertBackground(element: HTMLElement) {
  expect(element.closest('[inert]')).not.toBeNull();
}

function expectActiveBackground(element: HTMLElement) {
  expect(element.closest('[inert]')).toBeNull();
}

function NestedLayersHarness() {
  const [outerOpen, setOuterOpen] = useState(false);
  const [innerOpen, setInnerOpen] = useState(false);

  return (
    <div data-testid="app-background">
      <button type="button" onClick={() => setOuterOpen(true)}>Ouvrir la première couche</button>
      <a href="/fond">Lien de fond</a>

      <Modal open={outerOpen} onClose={() => setOuterOpen(false)} labelledBy="outer-title">
        <div className="p-6">
          <h2 id="outer-title">Première couche</h2>
          <button type="button" onClick={() => setInnerOpen(true)}>Ouvrir la confirmation</button>
          <button type="button">Dernière action extérieure</button>
        </div>
      </Modal>

      <ConfirmDialog
        open={innerOpen}
        onClose={() => setInnerOpen(false)}
        onConfirm={vi.fn()}
        title="Confirmer l’action"
        body="Cette confirmation doit rester au-dessus de la première couche."
        confirmLabel="Confirmer"
      />
    </div>
  );
}

function PaletteHarness() {
  const [open, setOpen] = useState(false);
  return (
    <div data-testid="palette-background">
      <button type="button" onClick={() => setOpen(true)}>Ouvrir la recherche</button>
      <a href="/fond">Lien de fond</a>
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </div>
  );
}

function DuplicateConfirmHarness() {
  return (
    <>
      <ConfirmDialog
        open
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Première confirmation"
        body="Premier texte descriptif."
      />
      <ConfirmDialog
        open
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Seconde confirmation"
        body="Second texte descriptif."
      />
    </>
  );
}

describe('contrat commun des couches', () => {
  it('garde inertie et verrou de scroll jusqu’à la fermeture de la dernière couche imbriquée', async () => {
    const user = userEvent.setup();
    renderWithRouter(<NestedLayersHarness />);

    const opener = screen.getByRole('button', { name: 'Ouvrir la première couche' });
    await user.click(opener);

    const outerDialog = await screen.findByRole('dialog', { name: 'Première couche' });
    expect(outerDialog).toHaveFocus();
    expectInertBackground(screen.getByTestId('app-background'));
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await user.tab();
    expect(screen.getByRole('button', { name: 'Fermer' })).toHaveFocus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(screen.getByRole('button', { name: 'Dernière action extérieure' })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Ouvrir la confirmation' }));
    const innerDialog = await screen.findByRole('dialog', { name: 'Confirmer l’action' });
    expect(innerDialog).toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'Confirmer l’action' })).not.toBeInTheDocument();
    expect(screen.getByRole('dialog', { name: 'Première couche' })).toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: 'hidden' });
    expectInertBackground(screen.getByTestId('app-background'));
    expect(screen.getByRole('button', { name: 'Ouvrir la confirmation' })).toHaveFocus();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('dialog', { name: 'Première couche' })).not.toBeInTheDocument();
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
    expectActiveBackground(screen.getByTestId('app-background'));
    expect(opener).toHaveFocus();
  });

  it('expose des identifiants accessibles uniques pour plusieurs confirmations montées', () => {
    renderWithRouter(<DuplicateConfirmHarness />);

    const ids = Array.from(document.querySelectorAll<HTMLElement>('[id]')).map((element) => element.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('applique le même contrat observable à la palette de commandes', async () => {
    const user = userEvent.setup();
    const { container } = renderWithRouter(<PaletteHarness />);

    const opener = screen.getByRole('button', { name: 'Ouvrir la recherche' });
    await user.click(opener);

    const dialog = await screen.findByRole('dialog', { name: 'Recherche globale' });
    const searchbox = screen.getByRole('searchbox', { name: 'Recherche globale' });
    expect(dialog).toBeInTheDocument();
    expect(searchbox).toHaveFocus();
    expectInertBackground(screen.getByTestId('palette-background'));
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await user.tab();
    expect(searchbox).toHaveFocus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    expect(searchbox).toHaveFocus();

    const results = await axe.run(container, {
      runOnly: ['wcag2a', 'wcag2aa'],
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results.violations).toEqual([]);

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: 'Recherche globale' })).not.toBeInTheDocument();
    });
    expect(opener).toHaveFocus();
    expectActiveBackground(screen.getByTestId('palette-background'));
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });
});
