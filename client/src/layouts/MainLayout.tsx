import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from '@/components/chrome/TopBar';
import { SideNav } from '@/components/chrome/SideNav';
import { Footer, HomeFooter } from '@/components/chrome/Footer';
import { HomeIntroProvider } from '@/components/home/HomeIntro';
import { cn } from '@/lib/utils';

const normalizedPathname = (pathname: string) => pathname.replace(/\/+$/, '') || '/';

export function MainLayout() {
  const { pathname } = useLocation();
  const normalizedPath = normalizedPathname(pathname);
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);
  const previousPath = useRef(normalizedPath);

  useEffect(() => {
    const previous = previousPath.current;
    previousPath.current = normalizedPath;
    if (normalizedPath === '/simulators' && previous.startsWith('/simulators/') && mainRef.current) {
      const slug = previous.slice('/simulators/'.length);
      const main = mainRef.current;
      const restoreRow = () => {
        const row = document.getElementById(`simulateur-${slug}`);
        if (!row) return false;
        row.focus({ preventScroll: true });
        row.scrollIntoView({ block: 'nearest', behavior: 'instant' });
        return true;
      };
      if (restoreRow()) return;
      // A first visit from a deep link can arrive before the catalog chunk.
      main.focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
      const observer = new MutationObserver(() => {
        if (restoreRow() || main.querySelector('h1')) observer.disconnect();
      });
      observer.observe(main, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce || previous === '/simulators' ? 'instant' : 'smooth' });

    // Move focus to the main region on client navigation so keyboard and
    // screen-reader users land on the new page's content — SPA route changes
    // don't reset focus on their own. Skip the initial mount so the first load
    // isn't yanked away from the skip link / hero. `preventScroll` lets the
    // smooth scroll above own the viewport.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
  }, [normalizedPath]);

  // The splash portal is deliberately chrome-less. Home owns a focused,
  // three-pole top bar and a full-viewport hero; onboarding keeps the standard
  // top bar. Every other page uses the lateral, hover-expanding SideNav.
  const isSplash = normalizedPath === '/';
  const isHome = normalizedPath === '/home';
  const isOnboarding = normalizedPath === '/onboarding';
  const isMemoWorkspace = normalizedPath === '/simulators/simulateur-note-investissement';
  const hasTopBar = isHome || isOnboarding;
  const hasSideNav = !isSplash && !hasTopBar;

  return (
    // Sits above the shell so the post-splash entrance can suppress the home top
    // bar and delay the hero, then hand both back once it has docked.
    <HomeIntroProvider>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <a href="#main" className="skip-link">Aller au contenu principal</a>

        {isSplash ? null : hasTopBar ? <TopBar /> : <SideNav />}

        <div
          className={cn(
            'flex flex-1 flex-col',
            hasSideNav && 'lg:pl-[var(--sidebar-rail)]',
            isHome && 'pb-[calc(var(--home-mobile-nav-h)+env(safe-area-inset-bottom))] md:pb-0',
          )}
        >
          <main ref={mainRef} id="main" className={cn('flex-1 outline-none', hasSideNav && 'pt-14 lg:pt-0')} tabIndex={-1}>
            <Outlet />
          </main>
          {isSplash || isMemoWorkspace ? null : isHome ? <HomeFooter /> : <Footer />}
        </div>
      </div>
    </HomeIntroProvider>
  );
}
