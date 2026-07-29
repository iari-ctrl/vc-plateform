import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, Compass } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/context/ThemeContext';
import { useUI } from '@/context/UIContext';
import { NAVIGATION_PILLARS, isNavigationPillarActive } from '@/lib/navigation';
import { useLayerBehavior } from '@/components/ui/layerStack';

export function TopBar() {
  const { theme, toggle } = useTheme();
  const { openSearch } = useUI();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileDrawerId = useId();
  const mobileDrawerTitleId = useId();
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const { pathname } = location;

  const { layerProps } = useLayerBehavior({
    open: mobileOpen,
    onClose: () => setMobileOpen(false),
    layerRootRef: mobileDrawerRef,
  });

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="mx-auto flex h-[var(--topbar-h)] max-w-[var(--content-max)] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav className="ml-4 hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAVIGATION_PILLARS.map((pillar) => {
            const isActive = isNavigationPillarActive(pathname, pillar);
            return (
              <NavLink
                key={pillar.id}
                to={pillar.to}
                aria-current={isActive ? 'page' : undefined}
                className={
                  `rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'text-foreground' : 'text-surface-variant hover:text-foreground'
                  }`
                }
              >
                <span className="relative">
                  {pillar.label}
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

          <Link to="/ikigai" className="btn-foil hidden !px-4 !py-2 sm:inline-flex">
            <Compass size={15} />
            Cahier Ikigai
          </Link>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-full text-foreground lg:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            aria-controls={mobileDrawerId}
            aria-haspopup="dialog"
          >
            {mobileOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {mobileOpen && createPortal(
        <div
          ref={mobileDrawerRef}
          {...layerProps}
          id={mobileDrawerId}
          role="dialog"
          aria-modal="true"
          aria-labelledby={mobileDrawerTitleId}
          tabIndex={-1}
          className="fixed inset-x-0 bottom-0 top-[var(--topbar-h)] z-[55] overflow-y-auto border-t border-outline-variant bg-surface animate-fade-in outline-none motion-reduce:animate-none lg:hidden"
        >
          <h2 id={mobileDrawerTitleId} className="sr-only">Navigation mobile</h2>
          <nav className="mx-auto flex max-w-[var(--content-max)] flex-col gap-1 px-4 py-4">
            {NAVIGATION_PILLARS.map((pillar) => {
              const isActive = isNavigationPillarActive(pathname, pillar);
              return (
                <NavLink
                  key={pillar.id}
                  to={pillar.to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`rounded-xl px-4 py-3 text-sm font-medium ${
                    isActive ? 'bg-surface-container text-foreground' : 'text-surface-variant'
                  }`}
                >
                  {pillar.label}
                </NavLink>
              );
            })}
            <Link to="/ikigai" className="btn-foil mt-2">
              <Compass size={15} /> Cahier Ikigai
            </Link>
          </nav>
        </div>,
        document.body,
      )}
    </header>
  );
}
