import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Map, Library, BookA, FlaskConical, Newspaper, LayoutDashboard, NotebookPen, Microscope,
  Search, Sun, Moon, LogIn, LogOut, Shield, User, Menu, X, Ghost, ScrollText, Crosshair, type LucideIcon,
} from 'lucide-react';
import { Link, NavLink } from '@/i18n/routing';
import { useNavigate, isLinkActive } from '@/i18n/navigation';
import { LocaleSwitcher } from '@/i18n/LocaleSwitcher';
import { EN_ENABLED } from '@/i18n/config';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useUI } from '@/context/UIContext';
import { cn, initials } from '@/lib/utils';

type Item = { to: string; label: string; icon: LucideIcon };

const PRIMARY: Item[] = [
  { to: '/paths', label: 'Parcours', icon: Map },
  { to: '/bibliotheque', label: 'Bibliothèque', icon: Library },
  { to: '/glossary', label: 'Dictionnaire', icon: BookA },
  { to: '/simulators', label: 'Simulateurs', icon: FlaskConical },
  { to: '/anti-portfolio', label: 'Anti-portfolio', icon: Ghost },
  { to: '/memos', label: 'Memo library', icon: ScrollText },
  { to: '/ecosystemes', label: 'Écosystèmes', icon: Microscope },
  { to: '/blog', label: 'Analyses', icon: Newspaper },
];

const PERSONAL: Item[] = [
  { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/notes', label: 'Notes & favoris', icon: NotebookPen },
  { to: '/journal', label: 'Journal de décisions', icon: Crosshair },
];

/**
 * SideNav — the lateral navigation used on every page *except* the home/landing
 * page (which keeps the full TopBar header).
 *
 * Desktop (≥lg): the panel is hidden off-screen. Only a small VC Premium logo
 * handle stays pinned in the top-left gutter; hovering (or focusing) it slides
 * the full panel out from the edge as an overlay. The panel retracts as soon as
 * the pointer leaves it (or focus moves out). A thin `--sidebar-rail` gutter is
 * reserved in MainLayout so the handle never overlaps page content.
 * Mobile (<lg): a compact top bar with a slide-down drawer (no hover there).
 */
export function SideNav() {
  return (
    <>
      <DesktopRail />
      <MobileBar />
    </>
  );
}

// ── Desktop rail ──────────────────────────────────────────────────────────────
function DesktopRail() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Always-visible logo handle: hovering/focusing it reveals the panel.
          No onMouseLeave here — moving from the handle into the panel keeps it
          open; the panel itself owns the close-on-leave. z-50 keeps the logo
          clickable above the sliding panel. */}
      <div
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        className="fixed left-0 top-0 z-50 hidden h-[var(--topbar-h)] items-center justify-center lg:flex"
        style={{ width: 'var(--sidebar-rail)' }}
      >
        <Logo compact />
      </div>

      <aside
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        data-open={open}
        aria-hidden={!open}
        className={cn(
          'glass-rail fixed inset-y-0 left-0 z-40 hidden w-[var(--sidebar-w)] flex-col overflow-x-hidden border-r transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Navigation principale"
      >
        {/* Spacer that clears the floating logo handle above. */}
        <div className="h-[var(--topbar-h)] shrink-0" />

        <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 pb-4">
          <nav className="flex flex-col gap-1" aria-label="Sections">
            {PRIMARY.map((it) => (
              <RailLink key={it.to} item={it} expanded end={it.to === '/'} />
            ))}
          </nav>

          <div className="ornament-rule mx-1 my-2" />

          <nav className="flex flex-col gap-1" aria-label="Espace personnel">
            {PERSONAL.map((it) => (
              <RailLink key={it.to} item={it} expanded />
            ))}
          </nav>

          {/* Utilities pinned to the bottom */}
          <div className="mt-auto flex flex-col gap-1 pt-3">
            <div className="ornament-rule mx-1 mb-2" />
            <SearchButton expanded />
            <ThemeButton expanded />
            {EN_ENABLED && (
              <div className="flex items-center justify-between gap-2 px-3 py-1.5 animate-fade-in">
                <span className="whitespace-nowrap text-sm font-medium text-surface-variant">Langue</span>
                <LocaleSwitcher />
              </div>
            )}
            <AccountControl expanded />
          </div>
        </div>
      </aside>
    </>
  );
}

function RailLink({ item, expanded, end }: { item: Item; expanded: boolean; end?: boolean }) {
  const { icon: Icon, label, to } = item;
  const location = useLocation();
  const isActive = isLinkActive(to, location);
  return (
    <NavLink
      to={to}
      end={end}
      title={!expanded ? label : undefined}
      className={
        cn(
          'group relative flex items-center rounded-xl transition-colors duration-200',
          expanded ? 'gap-3 px-3 py-2.5' : 'justify-center p-3',
          isActive
            ? 'bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[color:var(--primary)]'
            : 'text-surface-variant hover:bg-surface-container-low hover:text-foreground',
        )
      }
    >
      {isActive && (
        <span aria-hidden className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[color:var(--primary)]" />
      )}
      <Icon size={19} className="shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
      {expanded && <span className="animate-fade-in whitespace-nowrap text-sm font-medium">{label}</span>}
    </NavLink>
  );
}

function RailButton({
  icon: Icon, label, expanded, onClick, kbd,
}: { icon: LucideIcon; label: string; expanded: boolean; onClick: () => void; kbd?: string }) {
  return (
    <button
      onClick={onClick}
      title={!expanded ? label : undefined}
      className={cn(
        'flex w-full items-center rounded-xl text-surface-variant transition-colors hover:bg-surface-container-low hover:text-foreground',
        expanded ? 'gap-3 px-3 py-2.5' : 'justify-center p-3',
      )}
    >
      <Icon size={19} className="shrink-0" strokeWidth={1.8} />
      {expanded && <span className="animate-fade-in whitespace-nowrap text-sm font-medium">{label}</span>}
      {expanded && kbd && (
        <kbd className="ml-auto rounded border border-outline-variant px-1.5 font-mono text-[0.625rem]">{kbd}</kbd>
      )}
    </button>
  );
}

function SearchButton({ expanded }: { expanded: boolean }) {
  const { openSearch } = useUI();
  return <RailButton icon={Search} label="Rechercher" expanded={expanded} onClick={openSearch} kbd="⌘K" />;
}

function ThemeButton({ expanded }: { expanded: boolean }) {
  const { theme, toggle } = useTheme();
  return (
    <RailButton
      icon={theme === 'dark' ? Sun : Moon}
      label={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
      expanded={expanded}
      onClick={toggle}
    />
  );
}

function AccountControl({ expanded }: { expanded: boolean }) {
  const { isAuthed, isAdmin, user, logout } = useAuth();
  const { openAuth } = useUI();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!isAuthed) {
    return <RailButton icon={LogIn} label="Se connecter" expanded={expanded} onClick={() => openAuth()} />;
  }

  const menu = [
    { to: '/profile', label: 'Mon profil', icon: User },
    ...(isAdmin ? [{ to: '/admin', label: 'Administration', icon: Shield }] : []),
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title={!expanded ? 'Mon compte' : undefined}
        aria-expanded={open}
        className={cn(
          'flex w-full items-center rounded-xl transition-colors hover:bg-surface-container-low',
          expanded ? 'gap-3 px-3 py-2.5' : 'justify-center p-2.5',
        )}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[color:var(--secondary)] font-mono text-[0.7rem] font-semibold text-[color:var(--on-secondary)]">
          {initials(user?.name ?? 'VC')}
        </span>
        {expanded && (
          <span className="min-w-0 flex-1 text-left">
            <span className="block truncate text-sm font-medium text-foreground">{user?.name}</span>
            <span className="block truncate text-[0.7rem] text-surface-variant">{user?.email}</span>
          </span>
        )}
      </button>
      {open && (
        <div className="absolute bottom-0 left-full z-50 ml-2 w-52 animate-scale-in overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-lowest shadow-editorial-lg">
          <div className="p-1.5">
            {menu.map((it) => (
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
              <LogOut size={16} /> Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Mobile bar + drawer ─────────────────────────────────────────────────────────
function MobileBar() {
  const { openSearch } = useUI();
  const { theme, toggle } = useTheme();
  const { isAuthed, isAdmin, user, logout } = useAuth();
  const { openAuth } = useUI();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const links = [...PRIMARY, ...PERSONAL];

  return (
    <>
      <header className="glass-nav fixed inset-x-0 top-0 z-40 flex h-14 items-center gap-2 px-4 lg:hidden">
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-full text-foreground"
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
        <Logo />
        <div className="ml-auto flex items-center gap-1">
          <button onClick={openSearch} className="grid h-9 w-9 place-items-center rounded-full text-surface-variant hover:bg-surface-container-low" aria-label="Rechercher">
            <Search size={17} />
          </button>
          <button onClick={toggle} className="grid h-9 w-9 place-items-center rounded-full text-surface-variant hover:bg-surface-container-low" aria-label="Changer de thème">
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-30 animate-fade-in overflow-y-auto border-t border-outline-variant bg-surface lg:hidden">
          <nav className="mx-auto flex max-w-[var(--content-max)] flex-col gap-1 px-4 py-4">
            {links.map((it) => {
              const isActive = isLinkActive(it.to, location);
              return (
                <NavLink
                  key={it.to}
                  to={it.to}
                  end={it.to === '/'}
                  className={
                    cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium',
                      isActive ? 'bg-surface-container text-foreground' : 'text-surface-variant',
                    )
                  }
                >
                  <it.icon size={18} className="shrink-0" /> {it.label}
                </NavLink>
              );
            })}

            <div className="ornament-rule my-3" />

            {isAuthed ? (
              <>
                <Link to="/profile" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-surface-variant">
                  <User size={18} /> Mon profil
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-surface-variant">
                    <Shield size={18} /> Administration
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await logout();
                    navigate('/');
                  }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-error"
                >
                  <LogOut size={18} /> Se déconnecter ({user?.name})
                </button>
              </>
            ) : (
              <button onClick={() => openAuth()} className="btn-ghost mt-1">
                <LogIn size={15} /> Se connecter
              </button>
            )}

            {EN_ENABLED && (
              <>
                <div className="ornament-rule my-3" />
                <div className="flex items-center justify-between px-1">
                  <span className="text-sm font-medium text-surface-variant">Langue</span>
                  <LocaleSwitcher />
                </div>
              </>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
