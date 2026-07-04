import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider } from '@/context/ThemeContext';
import { UIProvider } from '@/context/UIContext';
import { ViewportSwitcher } from '@/components/dev/ViewportSwitcher';
import './styles/global.css';



import { UserDataProvider } from '@/context/UserDataContext';

// Vite injects the deploy base (e.g. `/vc-plateform/` on GitHub Pages, `/` in
// dev). React Router wants it without the trailing slash; keep `/` for root.
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ViewportSwitcher>
      <BrowserRouter basename={routerBasename}>
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
