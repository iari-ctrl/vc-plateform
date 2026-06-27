import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { UserDataProvider } from '@/context/UserDataContext';
import { UIProvider } from '@/context/UIContext';
import { ViewportSwitcher } from '@/components/dev/ViewportSwitcher';
import './styles/global.css';

// Content is bundled and overlaid with the API copy, so it rarely changes
// mid-session: a generous staleTime avoids redundant refetches and we don't
// refetch on window focus. AuthProvider lives inside the provider so it can
// clear the cache on logout.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Vite injects the deploy base (e.g. `/vc-plateform/` on GitHub Pages, `/` in
// dev). React Router wants it without the trailing slash; keep `/` for root.
const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ViewportSwitcher>
      <BrowserRouter basename={routerBasename}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <UserDataProvider>
                <UIProvider>
                  <App />
                </UIProvider>
              </UserDataProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </ViewportSwitcher>
  </StrictMode>,
);
