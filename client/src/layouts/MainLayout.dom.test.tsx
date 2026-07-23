// @vitest-environment jsdom
import '@/test/setupDom';

import { Link, Route, Routes } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { ThemeProvider } from '@/context/ThemeProvider';
import { UIProvider } from '@/context/UIProvider';
import { UserDataProvider } from '@/context/UserDataProvider';
import { MainLayout } from '@/layouts/MainLayout';
import { renderWithRouter } from '@/test/renderApp';

function DemoPage({ title, to, label }: { title: string; to: string; label: string }) {
  return (
    <div className="p-6">
      <h1>{title}</h1>
      <Link to={to}>{label}</Link>
    </div>
  );
}

function DemoRoutes() {
  return (
    <ThemeProvider>
      <UserDataProvider>
        <UIProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route path="un" element={<DemoPage title="Page un" to="/deux" label="Aller à la page deux" />} />
              <Route path="deux" element={<DemoPage title="Page deux" to="/un" label="Retour page un" />} />
            </Route>
          </Routes>
        </UIProvider>
      </UserDataProvider>
    </ThemeProvider>
  );
}

describe('MainLayout', () => {
  it('ouvre la navigation latérale quand le pointeur atteint le bord gauche hors accueil', async () => {
    const user = userEvent.setup();
    renderWithRouter(<DemoRoutes />, '/un');

    const navigation = document.getElementById('desktop-nav');
    expect(navigation).toHaveAttribute('inert');

    await user.hover(screen.getByTestId('desktop-nav-edge-trigger'));

    expect(navigation).toHaveAttribute('data-open', 'true');
    expect(navigation).not.toHaveAttribute('inert');
  });

  it('déplace le focus vers le landmark principal après un changement de route', async () => {
    const user = userEvent.setup();
    renderWithRouter(<DemoRoutes />, '/un');

    await screen.findByRole('heading', { level: 1, name: 'Page un' });
    await user.click(screen.getByRole('link', { name: 'Aller à la page deux' }));
    await screen.findByRole('heading', { level: 1, name: 'Page deux' });

    await waitFor(() => {
      expect(screen.getByRole('main')).toHaveFocus();
    });
  });
});
