import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { Search, Sun, Moon, Menu, X, Compass, ChevronDown } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import { Logo } from '@/components/ui/Logo';
import { useTheme } from '@/context/ThemeContext';
import { useUI } from '@/context/UIContext';
import { useHomeIntro } from '@/context/HomeIntroContext';
import { NAVIGATION_PILLARS, isNavigationPillarActive } from '@/lib/navigation';
import {
  HOME_BAR_CELL,
  HOME_BAR_PILLAR,
  HOME_BAR_ROW,
  HOME_BAR_SHELL,
  HOME_BAR_WORDMARK,
  HOME_BAR_WORDMARK_ACCENT,
  HOME_COMPACT_MEDIA_QUERY,
  HOME_FORMATION,
  HOME_INTELLIGENCE,
  HOME_MOBILE_NAV_SHELL,
} from '@/components/chrome/homeBar';
import { useLayerBehavior } from '@/components/ui/layerStack';
import { useMediaQuery } from '@/lib/usePrefersReducedMotion';
import { cn } from '@/lib/utils';

type HomeMenuId = typeof HOME_FORMATION.id | typeof HOME_INTELLIGENCE.id;

const pointInsideRect = (x: number, y: number, rect: DOMRect, margin = 0) =>
  x >= rect.left - margin && x <= rect.right + margin && y >= rect.top - margin && y <= rect.bottom + margin;

const hasUsableRect = (rect: DOMRect | undefined) => Boolean(rect && (rect.width > 0 || rect.height > 0));

export function TopBar() {
  const { pathname } = useLocation();
  return pathname === '/home' ? <HomeTopBar /> : <DefaultTopBar />;
}

function HomeTopBar() {
  const { openSearch, closeSearch, searchOpen } = useUI();
  const { pathname } = useLocation();
  // While the entrance curtain plays, its own copy of this bar owns the screen.
  // This one stays mounted (and queryable) but out of sight, then fades in as
  // the curtain leaves.
  const { phase: introPhase } = useHomeIntro();
  const compactNavigation = useMediaQuery(HOME_COMPACT_MEDIA_QUERY);
  const [openMenu, setOpenMenu] = useState<HomeMenuId | null>(null);
  const [pastHero, setPastHero] = useState(false);
  const [searchHoverArmed, setSearchHoverArmed] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const mobileNavigationRef = useRef<HTMLElement>(null);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const searchOpenRef = useRef(searchOpen);
  const searchPointerInsideRef = useRef(false);
  const searchLastPointerRef = useRef<{ x: number; y: number } | null>(null);
  const searchRearmFrameRef = useRef<number | null>(null);
  const searchCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  searchOpenRef.current = searchOpen;

  useEffect(() => {
    const updateSurface = () => {
      const hero = document.querySelector<HTMLElement>('#main > section:first-of-type');
      const heroBounds = hero?.getBoundingClientRect();

      if (!hasUsableRect(heroBounds)) {
        setPastHero(false);
        return;
      }

      const headerHeight = headerRef.current?.getBoundingClientRect().height ?? 0;
      setPastHero((heroBounds as DOMRect).bottom <= headerHeight);
    };

    updateSurface();
    window.addEventListener('scroll', updateSurface, { passive: true });
    window.addEventListener('resize', updateSurface);

    return () => {
      window.removeEventListener('scroll', updateSurface);
      window.removeEventListener('resize', updateSurface);
    };
  }, []);

  const cancelScheduledSearchClose = useCallback(() => {
    if (searchCloseTimerRef.current === null) return;
    clearTimeout(searchCloseTimerRef.current);
    searchCloseTimerRef.current = null;
  }, []);

  const isPointInSearchHoverZone = useCallback((x: number, y: number, target?: EventTarget | null) => {
    const trigger = searchTriggerRef.current;
    const surface = document.querySelector<HTMLElement>('[data-home-search-surface="true"]');
    const targetNode = target instanceof Node ? target : null;

    if (targetNode && (trigger?.contains(targetNode) || surface?.contains(targetNode))) return true;

    const triggerBounds = trigger?.getBoundingClientRect();
    const surfaceBounds = surface?.getBoundingClientRect();

    if (hasUsableRect(triggerBounds) && pointInsideRect(x, y, triggerBounds as DOMRect, 10)) return true;
    if (hasUsableRect(surfaceBounds) && pointInsideRect(x, y, surfaceBounds as DOMRect, 10)) return true;

    if (hasUsableRect(triggerBounds) && hasUsableRect(surfaceBounds)) {
      const left = Math.min((triggerBounds as DOMRect).left, (surfaceBounds as DOMRect).left) - 24;
      const right = Math.max((triggerBounds as DOMRect).right, (surfaceBounds as DOMRect).right) + 24;
      const top = Math.min((triggerBounds as DOMRect).top, (surfaceBounds as DOMRect).top) - 8;
      const bottom = Math.max((triggerBounds as DOMRect).bottom, (surfaceBounds as DOMRect).bottom) + 8;
      return x >= left && x <= right && y >= top && y <= bottom;
    }

    return false;
  }, []);

  const scheduleSearchCloseIfOutside = useCallback((x: number, y: number, target?: EventTarget | null) => {
    searchLastPointerRef.current = { x, y };

    if (isPointInSearchHoverZone(x, y, target)) {
      searchPointerInsideRef.current = true;
      cancelScheduledSearchClose();
      return;
    }

    searchPointerInsideRef.current = false;
    cancelScheduledSearchClose();
    searchCloseTimerRef.current = setTimeout(() => {
      searchCloseTimerRef.current = null;
      const point = searchLastPointerRef.current;
      const targetAtPoint = point && typeof document.elementFromPoint === 'function'
        ? document.elementFromPoint(point.x, point.y)
        : null;
      if (searchOpenRef.current && (!point || !isPointInSearchHoverZone(point.x, point.y, targetAtPoint))) {
        closeSearch();
      }
    }, 180);
  }, [cancelScheduledSearchClose, closeSearch, isPointInSearchHoverZone]);

  useEffect(() => setOpenMenu(null), [compactNavigation, pathname]);

  useEffect(() => {
    if (searchOpen) return;

    const point = searchLastPointerRef.current;
    const targetAtPoint = point && typeof document.elementFromPoint === 'function'
      ? document.elementFromPoint(point.x, point.y)
      : null;
    const pointerStillInSearchZone = point ? isPointInSearchHoverZone(point.x, point.y, targetAtPoint) : false;
    searchPointerInsideRef.current = pointerStillInSearchZone;

    if (!pointerStillInSearchZone) setSearchHoverArmed(true);
  }, [isPointInSearchHoverZone, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const trackPointerPosition = (event: PointerEvent) => {
      scheduleSearchCloseIfOutside(event.clientX, event.clientY, event.target);
    };

    document.addEventListener('pointermove', trackPointerPosition, true);
    return () => document.removeEventListener('pointermove', trackPointerPosition, true);
  }, [scheduleSearchCloseIfOutside, searchOpen]);

  useEffect(() => {
    if (!openMenu) return undefined;

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!headerRef.current?.contains(target) && !mobileNavigationRef.current?.contains(target)) setOpenMenu(null);
    };

    document.addEventListener('pointerdown', closeOnOutsidePointer, true);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer, true);
  }, [openMenu]);

  const revealSearch = () => {
    cancelScheduledSearchClose();
    setOpenMenu(null);
    setSearchHoverArmed(false);
    openSearch();
  };

  const revealSearchFromHover = (event: React.MouseEvent<HTMLButtonElement>) => {
    searchLastPointerRef.current = { x: event.clientX, y: event.clientY };
    searchPointerInsideRef.current = true;
    if (!searchHoverArmed) return;
    revealSearch();
  };

  const rearmSearchAfterPointerLeaves = (event: React.MouseEvent<HTMLButtonElement>) => {
    scheduleSearchCloseIfOutside(event.clientX, event.clientY, event.relatedTarget);
    if (searchRearmFrameRef.current !== null) cancelAnimationFrame(searchRearmFrameRef.current);
    searchRearmFrameRef.current = requestAnimationFrame(() => {
      searchRearmFrameRef.current = null;
      if (!searchOpenRef.current) setSearchHoverArmed(true);
    });
  };

  useEffect(
    () => () => {
      if (searchRearmFrameRef.current !== null) cancelAnimationFrame(searchRearmFrameRef.current);
      if (searchCloseTimerRef.current !== null) clearTimeout(searchCloseTimerRef.current);
    },
    [],
  );

  const formationMenu = (
    <HomePillarMenu
      pillar={HOME_FORMATION}
      side="left"
      placement={compactNavigation ? 'viewport-bottom' : 'header'}
      open={openMenu === HOME_FORMATION.id}
      onOpen={() => setOpenMenu(HOME_FORMATION.id)}
      onClose={() => setOpenMenu((current) => (current === HOME_FORMATION.id ? null : current))}
      onToggle={() => setOpenMenu((current) => (current === HOME_FORMATION.id ? null : HOME_FORMATION.id))}
    />
  );

  const intelligenceMenu = (
    <HomePillarMenu
      pillar={HOME_INTELLIGENCE}
      side="right"
      placement={compactNavigation ? 'viewport-bottom' : 'header'}
      open={openMenu === HOME_INTELLIGENCE.id}
      onOpen={() => setOpenMenu(HOME_INTELLIGENCE.id)}
      onClose={() => setOpenMenu((current) => (current === HOME_INTELLIGENCE.id ? null : current))}
      onToggle={() => setOpenMenu((current) => (current === HOME_INTELLIGENCE.id ? null : HOME_INTELLIGENCE.id))}
    />
  );

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          'fixed inset-x-0 top-0 z-[75]',
          HOME_BAR_SHELL,
          pastHero && 'border-b border-outline-variant bg-[color:var(--surface)] backdrop-blur-md after:bg-transparent',
          introPhase === 'running' && 'home-topbar-suppressed',
          introPhase === 'handover' && 'home-topbar-arriving',
        )}
      >
        <div className={cn(HOME_BAR_ROW, compactNavigation && 'flex justify-center px-14')}>
          {!compactNavigation && formationMenu}

          <button
            ref={searchTriggerRef}
            type="button"
            onMouseEnter={revealSearchFromHover}
            onMouseLeave={rearmSearchAfterPointerLeaves}
            onClick={revealSearch}
            aria-label="Rechercher depuis Maison Sapience VC"
            className={cn(
              'group',
              HOME_BAR_WORDMARK,
              'transition-colors hover:text-[color:var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--primary)]',
            )}
          >
            <span className="whitespace-nowrap">
              Maison <span className={HOME_BAR_WORDMARK_ACCENT}>Sapience VC</span>
            </span>
            <span aria-hidden className="absolute inset-x-2 -bottom-0.5 h-px origin-center scale-x-0 bg-[color:var(--primary)] transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
          </button>

          {!compactNavigation && intelligenceMenu}
        </div>
      </header>

      {compactNavigation && (
        <nav ref={mobileNavigationRef} aria-label="Pôles de l’accueil" className={HOME_MOBILE_NAV_SHELL}>
          {formationMenu}
          {intelligenceMenu}
        </nav>
      )}
    </>
  );
}

function HomePillarMenu({
  pillar,
  side,
  placement,
  open,
  onOpen,
  onClose,
  onToggle,
}: {
  pillar: typeof HOME_FORMATION | typeof HOME_INTELLIGENCE;
  side: 'left' | 'right';
  placement: 'header' | 'viewport-bottom';
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}) {
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerActivationRef = useRef<{ pointerId: number; pointerType: string } | null>(null);
  const pointerReleaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const restoringFocusRef = useRef(false);

  const cancelScheduledClose = () => {
    if (closeTimerRef.current === null) return;
    clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  };

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    const clearAfterPointerRelease = (event: PointerEvent) => {
      if (pointerActivationRef.current?.pointerId !== event.pointerId) return;
      if (pointerReleaseTimerRef.current !== null) clearTimeout(pointerReleaseTimerRef.current);
      pointerReleaseTimerRef.current = setTimeout(() => {
        if (pointerActivationRef.current?.pointerId === event.pointerId) {
          pointerActivationRef.current = null;
        }
        pointerReleaseTimerRef.current = null;
      }, 0);
    };

    document.addEventListener('pointerup', clearAfterPointerRelease, true);
    return () => {
      document.removeEventListener('pointerup', clearAfterPointerRelease, true);
      if (pointerReleaseTimerRef.current !== null) clearTimeout(pointerReleaseTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      onClose();
      restoringFocusRef.current = true;
      triggerRef.current?.focus();
      restoringFocusRef.current = false;
    };

    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [onClose, open]);

  const openFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    cancelScheduledClose();
    onOpen();
  };

  const closeAfterPointerGrace = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return;
    cancelScheduledClose();
    closeTimerRef.current = setTimeout(onClose, 180);
  };

  const openFromFocus = () => {
    if (pointerActivationRef.current !== null || restoringFocusRef.current) return;
    cancelScheduledClose();
    onOpen();
  };

  const activateFromClick = () => {
    const pointerType = pointerActivationRef.current?.pointerType ?? null;
    pointerActivationRef.current = null;
    if (pointerReleaseTimerRef.current !== null) {
      clearTimeout(pointerReleaseTimerRef.current);
      pointerReleaseTimerRef.current = null;
    }
    cancelScheduledClose();
    if (pointerType === 'touch') onToggle();
    else onOpen();
  };

  const closeIfFocusLeaves = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) onClose();
  };

  const isIntelligenceHomeMenu = pillar.id === HOME_INTELLIGENCE.id;
  const isViewportBottom = placement === 'viewport-bottom';

  return (
    <div
      data-home-menu={pillar.id}
      className={cn(
        isViewportBottom
          ? 'flex h-[calc(var(--home-mobile-nav-h)-1px)] items-center px-4'
          : HOME_BAR_CELL,
        side === 'left' && isViewportBottom && 'border-r border-outline-variant',
        side === 'right' && 'justify-end',
      )}
      onPointerEnter={openFromPointer}
      onPointerLeave={closeAfterPointerGrace}
      onFocusCapture={openFromFocus}
      onBlurCapture={closeIfFocusLeaves}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onPointerDown={(event) => {
          pointerActivationRef.current = {
            pointerId: event.pointerId,
            pointerType: event.pointerType,
          };
        }}
        onPointerCancel={(event) => {
          if (pointerActivationRef.current?.pointerId === event.pointerId) {
            pointerActivationRef.current = null;
          }
        }}
        onClick={activateFromClick}
        className={cn(
          'group',
          HOME_BAR_PILLAR,
          'transition-colors hover:text-[color:var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--primary)]',
          isViewportBottom && 'h-full w-full text-[0.4875rem] tracking-[0.2em]',
          isViewportBottom && side === 'left' && 'justify-start',
          isViewportBottom && side === 'right' && 'justify-end',
          side === 'right' && 'text-right',
        )}
      >
        <span className="whitespace-nowrap">{pillar.label}</span>
        <ChevronDown
          size={14}
          strokeWidth={1.6}
          aria-hidden
          className={cn('shrink-0 transition-transform duration-300 motion-reduce:transition-none', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div
          id={panelId}
          className={cn(
            'fixed top-[var(--home-topbar-h)] z-[85] w-screen overflow-y-auto border-outline-variant bg-surface px-5 py-8 text-foreground shadow-2xl animate-fade-in motion-reduce:animate-none sm:px-8 sm:py-10',
            isViewportBottom
              ? 'bottom-[calc(var(--home-mobile-nav-h)+env(safe-area-inset-bottom))]'
              : 'h-[calc(100dvh-var(--home-topbar-h))] md:w-1/2',
            side === 'left' ? 'left-0 border-r' : 'right-0 border-l',
          )}
        >
          <nav
            aria-label={`Menu ${pillar.label}`}
            className={cn('flex min-h-full flex-col justify-between gap-12', isIntelligenceHomeMenu && 'items-end text-right')}
          >
            <ol className={cn('space-y-5 sm:space-y-7', isIntelligenceHomeMenu && 'w-full')}>
              {pillar.children.map((item, index) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onClose}
                    className={cn(
                      'group/link grid items-start gap-2 font-headline text-[0.975rem] leading-none tracking-tight transition-colors hover:text-[color:var(--primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--primary)] sm:text-[1.4625rem]',
                      isIntelligenceHomeMenu
                        ? 'grid-cols-[minmax(0,1fr)_2.25rem] text-right sm:grid-cols-[minmax(0,1fr)_3rem]'
                        : 'grid-cols-[2.25rem_minmax(0,1fr)] sm:grid-cols-[3rem_minmax(0,1fr)]',
                    )}
                  >
                    {isIntelligenceHomeMenu ? (
                      <>
                        <span className="transition-transform duration-300 group-hover/link:-translate-x-2 motion-reduce:transition-none">
                          {item.label}{' '}
                        </span>
                        <span aria-hidden className="pt-1 font-mono text-[0.403rem] tracking-[0.16em] text-surface-variant sm:text-[0.4875rem]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden className="pt-1 font-mono text-[0.403rem] tracking-[0.16em] text-surface-variant sm:text-[0.4875rem]">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="transition-transform duration-300 group-hover/link:translate-x-2 motion-reduce:transition-none">
                          {item.label}
                        </span>
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ol>

            <p className={cn('border-t border-outline-variant pt-5 font-mono text-[0.403rem] uppercase tracking-[0.22em] text-surface-variant', isIntelligenceHomeMenu && 'text-right')}>
              {pillar.label} · navigation de la plateforme
            </p>
          </nav>
        </div>
      )}
    </div>
  );
}

function DefaultTopBar() {
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
