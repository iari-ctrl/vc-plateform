import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Map, Library, BookA, FlaskConical, Newspaper, LayoutDashboard, NotebookPen, Microscope,
  Search, Sun, Moon, Menu, X, ScrollText, Crosshair, type LucideIcon,
  FileText, ChevronRight,
} from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/context/ThemeContext';
import { useUI } from '@/context/UIContext';
import { cn, initials } from '@/lib/utils';
const isLinkActive = (to: string, location: { pathname: string }) =>
  to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);


type Item = { to: string; label: string; icon: LucideIcon };
type NavGroup = { title: string; to: string; icon: LucideIcon; items: Item[] };

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'Intelligence VC',
    to: '/intelligence',
    icon: Microscope,
    items: [
      { to: '/ecosystemes', label: 'Écosystèmes', icon: Microscope },
      { to: '/convictions', label: 'Convictions', icon: Crosshair },
      { to: '/decisions', label: 'Décisions', icon: ScrollText },
      { to: '/simulators', label: 'Simulateurs', icon: FlaskConical },
      { to: '/methode', label: 'Méthode', icon: FileText },
      { to: '/blog', label: 'Analyses', icon: Newspaper },
    ],
  },
  {
    title: 'Formation',
    to: '/paths',
    icon: Map,
    items: [
      { to: '/paths', label: 'Parcours', icon: Map },
      { to: '/bibliotheque', label: 'Bibliothèque', icon: Library },
      { to: '/glossary', label: 'Dictionnaire', icon: BookA },
    ],
  },
  {
    title: 'Workspace',
    to: '/dashboard',
    icon: LayoutDashboard,
    items: [
      { to: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
      { to: '/notes', label: 'Notes & favoris', icon: NotebookPen },
      { to: '/journal', label: 'Journal de décisions', icon: Crosshair },
    ],
  },
];

/**
 * SideNav — the lateral navigation used on every page *except* the home/landing
 * page (which keeps the full TopBar header).
 *
 * Desktop (≥lg): the panel is parked off-screen and made `inert` while closed,
 * so its links leave the tab order *and* the accessibility tree (no focusable
 * content stranded in a hidden subtree). A small VC Premium logo plus a discreet
 * focusable "open navigation" handle stay pinned in the top-left gutter; hover,
 * click, or keyboard focus on that handle slides the full panel out as an
 * overlay (and clears `inert`, so focus can then move into it). The panel
 * retracts as soon as the pointer leaves it (or focus moves out). A thin
 * `--sidebar-rail` gutter is reserved in MainLayout so the handle never overlaps
 * page content.
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
      {/* Always-visible handle: hovering/focusing it reveals the panel. No
          onMouseLeave here — moving from the handle into the panel keeps it open;
          the panel itself owns the close-on-leave. z-50 keeps the handle above
          the sliding panel. */}
      <div
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        className="fixed left-0 top-0 z-50 hidden flex-col items-center lg:flex"
        style={{ width: 'var(--sidebar-rail)' }}
      >
        <div className="flex h-[var(--topbar-h)] items-center justify-center">
          <Logo compact />
        </div>

        {/* Discreet opening hint so the navigation isn't hidden behind the logo
            alone. A real focusable control: hover/click/keyboard-focus opens the
            panel. It fades out once open (kept focusable so a keyboard user who
            tabbed onto it lands here, opens the panel, then tabs straight into
            it) and is pointer-inert when open so it never intercepts panel
            clicks beneath it. */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir la navigation"
          aria-controls="desktop-nav"
          aria-expanded={open}
          title="Navigation"
          className={cn(
            'group flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-surface-variant transition-all duration-200 hover:bg-surface-container-low hover:text-foreground',
            open && 'pointer-events-none opacity-0',
          )}
        >
          <Menu size={18} className="shrink-0" strokeWidth={1.8} />
          <ChevronRight
            size={12}
            aria-hidden
            className="shrink-0 opacity-50 transition-transform group-hover:translate-x-0.5"
          />
        </button>
      </div>

      <aside
        id="desktop-nav"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}
        data-open={open}
        // When parked off-screen the panel must leave the tab order entirely:
        // `inert` removes its links from focus *and* from the accessibility tree
        // (it supersedes the old `aria-hidden`, which left focusable content in an
        // aria-hidden subtree — the anti-pattern). Focus can still *enter* via the
        // always-visible rail handle below, whose onFocus flips `open` first, so a
        // keyboard user reaches the panel before this attribute is reapplied.
        inert={!open}
        className={cn(
          'glass-rail fixed inset-y-0 left-0 z-40 hidden w-[var(--sidebar-w)] flex-col overflow-x-hidden border-r transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
        aria-label="Navigation principale"
      >
        {/* Spacer that clears the floating logo handle above. */}
        <div className="h-[var(--topbar-h)] shrink-0" />

        <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-3 pb-4">
          {NAV_GROUPS.map((group, index) => (
            <nav key={group.title} className="flex flex-col gap-1" aria-label={group.title}>
              {index > 0 && <div className="ornament-rule mx-1 my-2" />}
              <RailGroupHeader group={group} />
              {group.items.map((it) => (
                <RailLink key={it.to} item={it} expanded end={it.to === '/'} />
              ))}
            </nav>
          ))}

          {/* Utilities pinned to the bottom */}
          <div className="mt-auto flex flex-col gap-1 pt-3">
            <div className="ornament-rule mx-1 mb-2" />
            <SearchButton expanded />
            <ThemeButton expanded />
            
            
          </div>
        </div>
      </aside>
    </>
  );
}

function RailGroupHeader({ group }: { group: NavGroup }) {
  const location = useLocation();
  const active = isLinkActive(group.to, location);
  const Icon = group.icon;
  return (
    <Link
      to={group.to}
      className={cn(
        'mb-1 flex items-center gap-2 rounded-xl px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors',
        active ? 'text-[color:var(--primary)]' : 'text-surface-variant hover:text-foreground',
      )}
    >
      <Icon size={13} className="shrink-0" />
      <span className="truncate">{group.title}</span>
    </Link>
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

// ── Mobile bar + drawer ─────────────────────────────────────────────────────────
function MobileBar() {
  const { openSearch } = useUI();
  const { theme, toggle } = useTheme();
      const location = useLocation();
  const { pathname } = location;
    const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

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
            {NAV_GROUPS.map((group, groupIndex) => (
              <div key={group.title} className={groupIndex > 0 ? 'mt-3 border-t border-outline-variant pt-3' : undefined}>
                <Link to={group.to} className="mb-1 flex items-center gap-2 px-4 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-surface-variant">
                  <group.icon size={13} /> {group.title}
                </Link>
                {group.items.map((it) => {
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
              </div>
            ))}

            <div className="ornament-rule my-3" />

            

            
          </nav>
        </div>
      )}
    </>
  );
}
