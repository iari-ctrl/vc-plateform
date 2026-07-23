import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { normalizeBaseUrl } from '@shared/base-url.mjs';
import App from './App';
import { ThemeProvider } from '@/context/ThemeProvider';
import { UIProvider } from '@/context/UIProvider';
import { UserDataProvider } from '@/context/UserDataProvider';
import { ViewportSwitcher } from '@/components/dev/ViewportSwitcher';
import './styles/global.css';

// Vite and React Router consume the exact same canonical deployment base.
const baseUrl = normalizeBaseUrl(import.meta.env.BASE_URL);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ViewportSwitcher>
      <BrowserRouter basename={baseUrl}>
        <ThemeProvider>
          <UserDataProvider>
            <UIProvider>
              <App />
            </UIProvider>
          </UserDataProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ViewportSwitcher>
  </StrictMode>,
);
