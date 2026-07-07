import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, LayoutDashboard, NotebookPen, User, Shield, LogOut, Compass } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/context/ThemeContext';
import { useUI } from '@/context/UIContext';
import { initials } from '@/lib/utils';
const isLinkActive = (to: string, location: { pathname: string }) =>
  to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);


const NAV = [
  { to: '/intelligence', label: 'Intelligence VC' },
  { to: '/paths', label: 'Formation' },
  { to: '/glossary', label: 'Dictionnaire' },
  { to: '/blog', label: 'Analyses' },
];

export function TopBar() {
  const { theme, toggle } = useTheme();
    const { openSearch } = useUI();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-[var(--topbar-h)] max-w-[var(--content-max)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => {
            const isActive = isLinkActive(item.to, location);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={
                  `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-foreground' : 'text-surface-variant hover:text-foreground'
                  }`
                }
              >
                <span className="relative">
                  {item.label}
                  {isActive && <span className="absolute -bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[color:var(--primary)]" />}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <button
            onClick={openSearch}
            className="hidden items-center gap-2 rounded-full border border-outline-variant bg-surface-container-low px-3 py-1.5 text-sm text-surface-variant transition-colors hover:bg-surface-container md:flex"
            aria-label="Rechercher"
          >
            <Search size={15} />
            <span>Rechercher</span>
            <kbd className="ml-2 rounded border border-outline-variant px-1.5 font-mono text-[0.625rem]">⌘K</kbd>
          </button>
          <button onClick={openSearch} className="grid h-9 w-9 place-items-center rounded-full text-surface-variant hover:bg-surface-container-low md:hidden" aria-label="Rechercher">
            <Search size={17} />
          </button>

          

          <button onClick={toggle} className="grid h-9 w-9 place-items-center rounded-full text-surface-variant transition-colors hover:bg-surface-container-low" aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          

          <Link to="/onboarding" className="btn-foil hidden !px-4 !py-2 sm:inline-flex">
            <Compass size={15} />
            Test d’orientation
          </Link>

          <button onClick={() => setMobileOpen((v) => !v)} className="grid h-9 w-9 place-items-center rounded-full text-foreground lg:hidden" aria-label="Menu" aria-expanded={mobileOpen}>
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-outline-variant bg-surface lg:hidden animate-fade-in">
          <nav className="mx-auto flex max-w-[var(--content-max)] flex-col gap-1 px-4 py-4">
            {NAV.map((item) => {
              const isActive = isLinkActive(item.to, location);
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive ? 'bg-surface-container text-foreground' : 'text-surface-variant'
                  }`}
                >
                  {item.label}
                </NavLink>
              );
            })}
            <Link to="/dashboard" className="rounded-xl px-4 py-3 text-sm font-medium text-surface-variant">Mon tableau de bord</Link>
            <Link to="/onboarding" className="btn-foil mt-2">
              <Compass size={15} /> Test d’orientation
            </Link>
            

            
          </nav>
        </div>
      )}
    </header>
  );
}
