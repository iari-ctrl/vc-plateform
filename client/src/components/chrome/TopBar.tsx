import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, LayoutDashboard, NotebookPen, User, Shield, LogOut, Compass } from 'lucide-react';
import { Link, NavLink } from '@/i18n/routing';
import { useNavigate, isLinkActive } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/i18n/LocaleSwitcher';
import { EN_ENABLED } from '@/i18n/config';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import { initials } from '@/lib/utils';

const NAV = [
  { to: '/intelligence', label: 'Intelligence VC' },
  { to: '/paths', label: 'Formation' },
  { to: '/glossary', label: 'Dictionnaire' },
  { to: '/blog', label: 'Analyses' },
];

export function TopBar() {
  const { theme, toggle } = useTheme();
  const { isAuthed } = useAuth();
  const { openSearch, openAuth } = useUI();
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

          {EN_ENABLED && <LocaleSwitcher className="hidden sm:inline-flex" />}

          <button onClick={toggle} className="grid h-9 w-9 place-items-center rounded-full text-surface-variant transition-colors hover:bg-surface-container-low" aria-label={theme === 'dark' ? 'Activer le mode clair' : 'Activer le mode sombre'}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {isAuthed ? (
            <AccountMenu />
          ) : (
            <button onClick={() => openAuth()} className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-surface-variant transition-colors hover:text-foreground sm:block">
              Se connecter
            </button>
          )}

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
            {!isAuthed && (
              <button onClick={() => openAuth()} className="btn-ghost mt-1">
                Se connecter
              </button>
            )}

            {EN_ENABLED && (
              <div className="mt-3 flex items-center justify-between border-t border-outline-variant pt-4">
                <span className="text-sm font-medium text-surface-variant">Langue</span>
                <LocaleSwitcher />
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function AccountMenu() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const items = [
    { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { to: '/notes', label: 'Notes & favoris', icon: NotebookPen },
    { to: '/profile', label: 'Mon profil', icon: User },
    ...(isAdmin ? [{ to: '/admin', label: 'Administration', icon: Shield }] : []),
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="grid h-9 w-9 place-items-center rounded-full bg-[color:var(--secondary)] font-mono text-xs font-semibold text-[color:var(--on-secondary)]"
        aria-label="Mon compte"
        aria-expanded={open}
      >
        {initials(user?.name ?? 'VC')}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-editorial-lg animate-scale-in">
          <div className="border-b border-outline-variant px-4 py-3">
            <p className="truncate text-sm font-semibold">{user?.name}</p>
            <p className="truncate text-xs text-surface-variant">{user?.email}</p>
          </div>
          <div className="p-1.5">
            {items.map((it) => (
              <Link key={it.to} to={it.to} onClick={() => setOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-surface-container-low">
                <it.icon size={16} className="text-surface-variant" />
                {it.label}
              </Link>
            ))}
          </div>
          <div className="border-t border-outline-variant p-1.5">
            <button
              onClick={async () => {
                setOpen(false);
                await logout();
                navigate('/');
              }}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-error transition-colors hover:bg-surface-container-low"
            >
              <LogOut size={16} />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
