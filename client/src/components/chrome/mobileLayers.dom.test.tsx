// @vitest-environment jsdom
import '@/test/setupDom';

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';

import { SideNav } from '@/components/chrome/SideNav';
import { TopBar } from '@/components/chrome/TopBar';
import { ThemeProvider } from '@/context/ThemeProvider';
import { UIProvider } from '@/context/UIProvider';
import { UserDataProvider } from '@/context/UserDataProvider';
import { renderWithRouter } from '@/test/renderApp';

function expectInertBackground(element: HTMLElement) {
  expect(element.closest('[inert]')).not.toBeNull();
}

function expectActiveBackground(element: HTMLElement) {
  expect(element.closest('[inert]')).toBeNull();
}

function Shell({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <UserDataProvider>
        <UIProvider>
          <div data-testid="route-background">
            {children}
            <main>
              <a href="/contenu">Lien de contenu</a>
            </main>
          </div>
        </UIProvider>
      </UserDataProvider>
    </ThemeProvider>
  );
}

const surfaces = [
  { label: 'TopBar mobile', ui: <TopBar />, dialogName: 'Navigation mobile' },
  { label: 'SideNav mobile', ui: <SideNav />, dialogName: 'Navigation mobile latérale' },
];

describe('tiroirs de navigation mobile', () => {
  it.each(surfaces)('$label consomme le contrat de couche commun', async ({ ui, dialogName }) => {
    const user = userEvent.setup();
    renderWithRouter(<Shell>{ui}</Shell>, '/home');

    const opener = screen.getByRole('button', { name: 'Menu' });
    await user.click(opener);

    const dialog = await screen.findByRole('dialog', { name: dialogName });
    expect(opener).toHaveAttribute('aria-controls', dialog.id);
    expect(opener).toHaveAttribute('aria-expanded', 'true');
    expect(dialog).toHaveFocus();
    expectInertBackground(screen.getByTestId('route-background'));
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await user.tab();
    const firstLink = within(dialog).getAllByRole('link')[0];
    expect(firstLink).toHaveFocus();
    await user.keyboard('{Shift>}{Tab}{/Shift}');
    const dialogLinks = within(dialog).getAllByRole('link');
    expect(dialogLinks[dialogLinks.length - 1]).toHaveFocus();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog', { name: dialogName })).not.toBeInTheDocument();
    });
    expect(opener).toHaveFocus();
    expectActiveBackground(screen.getByTestId('route-background'));
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });
});
