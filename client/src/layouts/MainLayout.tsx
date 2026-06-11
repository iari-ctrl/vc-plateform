import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TopBar } from '@/components/chrome/TopBar';
import { SideNav } from '@/components/chrome/SideNav';
import { Footer } from '@/components/chrome/Footer';
import { useLocale } from '@/i18n/useLocale';
import { cn } from '@/lib/utils';

export function MainLayout() {
  const { pathname } = useLocation();
  const locale = useLocale();

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  }, [pathname]);

  // The splash portal is deliberately chrome-less. The editorial home keeps the
  // full header; every other page uses the lateral, hover-expanding SideNav.
  // Paths are locale-prefixed (`/fr`, `/en`), so chrome decisions key off the
  // current locale home rather than a bare `/`.
  const home = `/${locale}`;
  const isSplash = pathname === home || pathname === `${home}/`;
  const isHome = pathname === `${home}/home`;
  const hasSideNav = !isSplash && !isHome;
  const hideFooter = isSplash || pathname.startsWith(`${home}/admin`);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <a href="#main" className="skip-link">Aller au contenu principal</a>

      {isSplash ? null : isHome ? <TopBar /> : <SideNav />}

      <div className={cn('flex flex-1 flex-col', hasSideNav && 'lg:pl-[var(--sidebar-rail)]')}>
        <main id="main" className={cn('flex-1', hasSideNav && 'pt-14 lg:pt-0')} tabIndex={-1}>
          <Outlet />
        </main>
        {!hideFooter && <Footer />}
      </div>
    </div>
  );
}
