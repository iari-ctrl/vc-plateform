import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';

import App from '@/App';
import { ThemeProvider } from '@/context/ThemeProvider';
import { UIProvider } from '@/context/UIProvider';
import { UserDataProvider } from '@/context/UserDataProvider';

export function renderAppAt(path: string): ReturnType<typeof render> {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <UserDataProvider>
          <UIProvider>
            <App />
          </UIProvider>
        </UserDataProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

export function renderWithRouter(ui: ReactElement, path = '/'): ReturnType<typeof render> {
  return render(<MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>);
}
