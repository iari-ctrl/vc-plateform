import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from '@/components/chrome/TopBar';
import { SideNav } from '@/components/chrome/SideNav';
import { Footer } from '@/components/chrome/Footer';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

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
  }, [pathname]);

  // The splash portal is deliberately chrome-less. The editorial home keeps the
  // full header; every other page uses the lateral, hover-expanding SideNav.
  const isSplash = pathname === '/' || pathname === '';
  const isHome = pathname === `/home`;
  const hasSideNav = !isSplash && !isHome;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a href="#main" className="skip-link">Aller au contenu principal</a>

      {isSplash ? null : isHome ? <TopBar /> : <SideNav />}

      <div className={cn('flex flex-1 flex-col', hasSideNav && 'lg:pl-[var(--sidebar-rail)]')}>
        <main ref={mainRef} id="main" className={cn('flex-1 outline-none', hasSideNav && 'pt-14 lg:pt-0')} tabIndex={-1}>
          <Outlet />
        </main>
        {!isSplash && <Footer />}
      </div>
    </div>
  );
}
