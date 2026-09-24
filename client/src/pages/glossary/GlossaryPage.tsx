import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, ChevronDown, ChevronUp, ExternalLink, Search, X } from 'lucide-react';
import { GLOSSARY, glossaryBySlug, loadGlossaryDefs } from '@/content/glossary';
import { publicLessonById } from '@/content/lessons';
import { Markdown } from '@/lib/markdown';
import { usePageMeta } from '@/lib/seo';
import { pluralize, safeHttpUrl, stripDiacritics } from '@/lib/utils';
import type { GlossaryDef, GlossaryIndexEntry, GlossaryTerm } from '@/content/types';
import { matchesGlossaryQuery } from './glossarySearch';

const ALPHABET = '0ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const DEFAULT_ANCHOR_OFFSET = 150;

const CATEGORY_COLORS: Record<string, string> = {
  Acteurs: '#4E6F7A',
  'Deal & Structuration': '#24657E',
  Fondations: '#785A00',
  'Fonds & VC': '#6B4E71',
  'Fund Economics': '#785A00',
  'Go-to-Market': '#9E4A63',
  Gouvernance: '#4E7A3E',
  Institutions: '#5B4D6C',
  Liquidité: '#A3552C',
  Métriques: '#7A5534',
  Outils: '#556B48',
  'Stades & Tours': '#8B5C4A',
  Stratégie: '#514F7A',
  Valorisation: '#6D5A2F',
  default: '#5B4D6C',
};

function categoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.default;
}

function initialFor(term: string) {
  const initial = stripDiacritics(term.trim().charAt(0)).toUpperCase();
  return /^[A-Z]$/.test(initial) ? initial : '0';
}

/** Second character of the term, normalized like {@link initialFor} (non-letters → '0'). */
function secondInitialFor(term: string) {
  const second = stripDiacritics(term.trim().charAt(1)).toUpperCase();
  return /^[A-Z]$/.test(second) ? second : '0';
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Placeholder shown in the expanded detail while the definitions chunk loads. */
function DefinitionSkeleton() {
  return (
    <div className="mb-5 space-y-2.5">
      <span className="sr-only">Chargement de la définition…</span>
      {['100%', '94%', '97%', '72%'].map((w, i) => (
        <div key={i} className="h-3.5 animate-pulse rounded bg-surface-container-high" style={{ width: w }} aria-hidden />
      ))}
    </div>
  );
}

export default function GlossaryPage() {
  const [params, setParams] = useSearchParams();
  const { slug: slugParam } = useParams();
  // Deep-link by query (`?term=`) or path (`/glossary/:slug`); query wins so an
  // in-page toggle overrides the URL the page was opened with.
  const activeSlug = params.get('term') ?? slugParam ?? null;
  const activeTerm = activeSlug ? glossaryBySlug(activeSlug) : undefined;
  usePageMeta(
    activeTerm ? `${activeTerm.term} · Dictionnaire du capital-risque` : 'Dictionnaire du capital-risque',
    activeTerm?.short ?? 'Les termes du venture, définis avec clarté : définitions, exemples et liens vers les cours associés.'
  );

  const terms: GlossaryIndexEntry[] = GLOSSARY;
  const [defs, setDefs] = useState<Record<string, GlossaryDef> | null>(null);
  const [defsStatus, setDefsStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [defsAttempt, setDefsAttempt] = useState(0);
  const [activeCategory, setActiveCategory] = useState('Tous');
  const [query, setQuery] = useState('');
  const [activeLetter, setActiveLetter] = useState('A');
  const [activeSecondLetter, setActiveSecondLetter] = useState('');
  const [isLetterFilterActive, setIsLetterFilterActive] = useState(true);
  const [anchorOffset, setAnchorOffset] = useState(DEFAULT_ANCHOR_OFFSET);
  const [expandedSlugs, setExpandedSlugs] = useState<Set<string>>(new Set());
  const stickyRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const alphabetScrollerRef = useRef<HTMLDivElement>(null);
  const alphabetButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const scrollSpyFrame = useRef<number | null>(null);
  const queryFilterContextRef = useRef<{
    activeLetter: string;
    activeSecondLetter: string;
    isLetterFilterActive: boolean;
  } | null>(null);

  const shouldLoadDefinitions = Boolean(activeTerm) || expandedSlugs.size > 0;

  // Heavy definitions load only when a detail view is actually requested, so a
  // simple glossary visit keeps the definitions resource out of the first pass.
  useEffect(() => {
    if (!shouldLoadDefinitions || defs) return undefined;

    let active = true;
    setDefsStatus('loading');
    void loadGlossaryDefs()
      .then((nextDefs) => {
        if (!active) return;
        setDefs(nextDefs);
        setDefsStatus('done');
      })
      .catch(() => {
        if (!active) return;
        setDefsStatus('error');
      });
    return () => {
      active = false;
    };
  }, [defs, defsAttempt, shouldLoadDefinitions]);

  const fullTerms = useMemo<GlossaryTerm[]>(
    () =>
      terms.map((term) => {
        const lazyDef = defs?.[term.slug];
        return {
          ...term,
          definition: lazyDef?.definition ?? '',
          example: lazyDef?.example,
        };
      }),
    [terms, defs],
  );

  const sortedTerms = useMemo(
    () => [...fullTerms].sort((a, b) => a.term.localeCompare(b.term, 'fr', { sensitivity: 'base' })),
    [fullTerms],
  );

  const categories = useMemo(() => {
    return Array.from(new Set(sortedTerms.map((t) => t.category))).sort((a, b) => a.localeCompare(b, 'fr'));
  }, [sortedTerms]);

  const filteredTerms = useMemo(() => {
    return sortedTerms
      .filter((t) => activeCategory === 'Tous' || t.category === activeCategory)
      .filter((t) => matchesGlossaryQuery(t, query));
  }, [sortedTerms, activeCategory, query]);

  const availableLetters = useMemo(() => {
    return Array.from(new Set(filteredTerms.map((term) => initialFor(term.term)))).sort((a, b) => ALPHABET.indexOf(a) - ALPHABET.indexOf(b));
  }, [filteredTerms]);
  const availableInitials = useMemo(() => new Set(availableLetters), [availableLetters]);
  // Terms under the active first letter — the scope the second-letter filter refines.
  const letterTerms = useMemo(
    () => (isLetterFilterActive ? filteredTerms.filter((term) => initialFor(term.term) === activeLetter) : []),
    [filteredTerms, activeLetter, isLetterFilterActive],
  );
  const availableSecondLetters = useMemo(
    () =>
      Array.from(new Set(letterTerms.map((term) => secondInitialFor(term.term)))).sort(
        (a, b) => ALPHABET.indexOf(a) - ALPHABET.indexOf(b),
      ),
    [letterTerms],
  );
  const visibleTerms = useMemo(
    () =>
      isLetterFilterActive
        ? letterTerms.filter((term) => !activeSecondLetter || secondInitialFor(term.term) === activeSecondLetter)
        : filteredTerms,
    [letterTerms, filteredTerms, activeSecondLetter, isLetterFilterActive],
  );
  const anchorStyle = { '--glossary-anchor-offset': `${anchorOffset}px` } as CSSProperties;

  const updateAnchorOffset = useCallback(() => {
    const stickyHeight = stickyRef.current?.getBoundingClientRect().height ?? DEFAULT_ANCHOR_OFFSET;
    const mobileTopBar = window.matchMedia('(min-width: 1024px)').matches ? 0 : 56;
    setAnchorOffset(Math.ceil(stickyHeight + mobileTopBar + 18));
  }, []);

  useEffect(() => {
    updateAnchorOffset();
    window.addEventListener('resize', updateAnchorOffset);

    const sticky = stickyRef.current;
    if (!sticky || typeof window.ResizeObserver === 'undefined') {
      return () => window.removeEventListener('resize', updateAnchorOffset);
    }

    const observer = new window.ResizeObserver(updateAnchorOffset);
    observer.observe(sticky);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateAnchorOffset);
    };
  }, [updateAnchorOffset]);

  // Drop the refinement when a query, category or letter change empties its bucket.
  useEffect(() => {
    if (activeSecondLetter && !availableSecondLetters.includes(activeSecondLetter)) setActiveSecondLetter('');
  }, [availableSecondLetters, activeSecondLetter]);

  useEffect(() => {
    setActiveLetter((current) => {
      if (current && availableInitials.has(current)) return current;
      if (availableInitials.has('A')) return 'A';
      return availableLetters[0] ?? '';
    });
  }, [availableInitials, availableLetters]);

  useEffect(() => {
    if (!activeLetter) return;
    const scroller = alphabetScrollerRef.current;
    const button = alphabetButtonRefs.current[activeLetter];
    if (!scroller || !button) return;

    const centeredLeft = button.offsetLeft - (scroller.clientWidth - button.offsetWidth) / 2;
    scroller.scrollTo({
      left: Math.max(0, centeredLeft),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }, [activeLetter]);

  useEffect(() => {
    if (isLetterFilterActive || visibleTerms.length === 0) return;

    const updateLetterFromScroll = () => {
      scrollSpyFrame.current = null;
      const articles = Array.from(document.querySelectorAll<HTMLElement>('[data-glossary-initial]'));
      if (articles.length === 0) return;

      const readingLine = anchorOffset + 16;
      let current = articles[0]?.dataset.glossaryInitial ?? activeLetter;

      for (const article of articles) {
        if (article.getBoundingClientRect().top <= readingLine) {
          current = article.dataset.glossaryInitial ?? current;
        } else {
          break;
        }
      }

      if (current && current !== activeLetter) setActiveLetter(current);
    };

    const scheduleUpdate = () => {
      if (scrollSpyFrame.current !== null) return;
      scrollSpyFrame.current = window.requestAnimationFrame(updateLetterFromScroll);
    };

    scheduleUpdate();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (scrollSpyFrame.current !== null) {
        window.cancelAnimationFrame(scrollSpyFrame.current);
        scrollSpyFrame.current = null;
      }
    };
  }, [activeLetter, anchorOffset, isLetterFilterActive, visibleTerms.length]);

  useEffect(() => {
    const target = activeSlug ? fullTerms.find((t) => t.slug === activeSlug) : undefined;
    if (!activeSlug || !target) return;
    setExpandedSlugs((current) => new Set(current).add(activeSlug));
    setActiveLetter(initialFor(target.term));
    setActiveSecondLetter('');
    setIsLetterFilterActive(true);

    const id = window.setTimeout(() => {
      document.getElementById(`term-${activeSlug}`)?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start',
      });
    }, 80);

    return () => window.clearTimeout(id);
  }, [activeSlug, fullTerms]);

  function toggleTerm(term: GlossaryTerm) {
    const isExpanded = expandedSlugs.has(term.slug);
    const nextSlugs = new Set(expandedSlugs);
    const nextParams = new URLSearchParams(params);

    if (isExpanded) {
      nextSlugs.delete(term.slug);
      if (activeSlug === term.slug) nextParams.delete('term');
    } else {
      nextSlugs.add(term.slug);
      nextParams.set('term', term.slug);
    }

    setExpandedSlugs(nextSlugs);
    setParams(nextParams, { replace: true });
  }

  function invalidateQueryContext() {
    queryFilterContextRef.current = null;
  }

  function jumpToLetter(letter: string) {
    invalidateQueryContext();
    setActiveLetter(letter);
    setActiveSecondLetter('');
    setIsLetterFilterActive(true);
    document.getElementById('glossary-results')?.scrollIntoView({
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      block: 'start',
    });
  }

  function selectCategory(category: string) {
    invalidateQueryContext();
    setActiveCategory(category);
    setIsLetterFilterActive(false);
  }

  function updateQuery(nextQuery: string) {
    const hadQuery = Boolean(query.trim());
    const hasQuery = Boolean(nextQuery.trim());

    if (!hadQuery && hasQuery) {
      queryFilterContextRef.current = { activeLetter, activeSecondLetter, isLetterFilterActive };
      setIsLetterFilterActive(false);
    } else if (hadQuery && !hasQuery) {
      const previousContext = queryFilterContextRef.current;
      queryFilterContextRef.current = null;
      if (previousContext) {
        setActiveLetter(previousContext.activeLetter);
        setActiveSecondLetter(previousContext.activeSecondLetter);
        setIsLetterFilterActive(previousContext.isLetterFilterActive);
      }
    }

    setQuery(nextQuery);
  }

  function revealSlug(slug: string) {
    const related = glossaryBySlug(slug);
    invalidateQueryContext();
    setQuery('');
    setActiveCategory('Tous');
    if (related) {
      setActiveLetter(initialFor(related.term));
      setActiveSecondLetter('');
      setIsLetterFilterActive(true);
    }
    setExpandedSlugs((current) => new Set(current).add(slug));
  }

  return (
    <div className="pb-20" style={anchorStyle}>
      <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 sm:py-12 lg:py-16">
        <div className="mb-6 flex items-center justify-center gap-4 sm:mb-10">
          <div className="hidden h-px flex-1 bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] sm:block" />
          <span className="whitespace-nowrap font-headline text-[0.5625rem] uppercase tracking-[0.28em] text-[color-mix(in_srgb,var(--primary)_72%,transparent)] italic sm:text-[0.625rem] sm:tracking-[0.45em]">
            Lexicon · Editio Princeps · MMXXVI
          </span>
          <div className="hidden h-px flex-1 bg-[color-mix(in_srgb,var(--primary)_20%,transparent)] sm:block" />
        </div>

        <header className="mb-10 grid grid-cols-12 items-end gap-6 sm:mb-14 lg:mb-16 lg:gap-8">
          <div className="col-span-12 lg:col-span-9">
            <p className="mb-4 font-mono text-[0.625rem] font-semibold uppercase tracking-[0.3em] text-[color:var(--secondary)] dark:text-surface-variant sm:mb-5">
              Glossaire · {fullTerms.length} entrées
            </p>
            <h1 className="font-headline text-5xl leading-[0.95] text-foreground sm:text-6xl md:text-[5.5rem]">
              <span className="font-normal italic">Lexique</span> du{' '}
              <span className="underline-flourish text-[color:var(--primary)]">capital-risque.</span>
            </h1>
            <p className="mt-5 max-w-2xl font-body text-[1.0625rem] leading-relaxed text-surface-variant/90 sm:mt-8 sm:text-xl">
              Le venture parle une langue spécifique. La voici, définie sans jargon gratuit, avec les liens utiles pour revenir aux cours qui l’expliquent.
            </p>
          </div>
          <aside className="col-span-12 hidden flex-col items-end gap-4 lg:col-span-3 lg:flex">
            <div className="text-right font-headline italic text-surface-variant">
              <p className="text-sm">« Verba volant,</p>
              <p className="pl-6 text-sm">scripta manent. »</p>
            </div>
          </aside>
        </header>

        {defsStatus === 'error' && (
          <div role="alert" className="mb-8 rounded-2xl border border-outline-variant bg-surface-container-low p-5 text-sm text-surface-variant">
            <p className="font-medium text-foreground">Les définitions détaillées n’ont pas pu être chargées.</p>
            <p className="mt-1">Le glossaire reste consultable ; relancez le chargement pour afficher les définitions complètes.</p>
            <button type="button" onClick={() => setDefsAttempt((attempt) => attempt + 1)} className="btn-ghost mt-4">
              Réessayer
            </button>
          </div>
        )}

        <div
          ref={stickyRef}
          className="sticky top-14 z-30 -mx-5 mb-8 rounded-none border-y border-[color-mix(in_srgb,var(--outline)_18%,transparent)] bg-[color-mix(in_srgb,var(--surface)_92%,transparent)] px-5 py-2.5 shadow-editorial-sm backdrop-blur-xl sm:-mx-4 sm:mb-12 sm:rounded-xl sm:px-4 sm:py-3 lg:-mx-2 lg:top-0 lg:px-5"
        >
          <section className="border-b border-[color-mix(in_srgb,var(--outline)_12%,transparent)] pb-3" aria-label="Navigation alphabétique">
            <div ref={alphabetScrollerRef} className="-mx-1 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex min-w-max items-center gap-1.5 lg:justify-center">
                {ALPHABET.map((letter) => {
                  const hasLetter = availableInitials.has(letter);
                  const isActive = activeLetter === letter && hasLetter;
                  return (
                    <button
                      key={letter}
                      ref={(node) => {
                        alphabetButtonRefs.current[letter] = node;
                      }}
                      type="button"
                      onClick={() => jumpToLetter(letter)}
                      disabled={!hasLetter}
                      aria-current={isActive ? 'true' : undefined}
                      className={`relative flex h-11 min-w-11 items-center justify-center rounded-full border px-2 font-headline text-xl leading-none transition-all lg:h-9 lg:min-w-9 ${
                        isActive
                          ? 'border-[color-mix(in_srgb,var(--primary)_42%,transparent)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[color:var(--primary)] shadow-editorial-xs'
                          : hasLetter
                            ? 'cursor-pointer border-transparent text-surface-variant hover:border-[color-mix(in_srgb,var(--primary)_24%,transparent)] hover:bg-surface-container-low hover:text-[color:var(--primary)]'
                            : 'pointer-events-none border-transparent text-surface-variant/20'
                      }`}
                    >
                      {letter}
                      {isActive && <span className="absolute bottom-1 left-1/2 h-0.5 w-3 -translate-x-1/2 rounded-full bg-[color:var(--primary)]" aria-hidden />}
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="pt-3" aria-label="Filtres du dictionnaire">
            <div className="grid grid-cols-[minmax(0,1fr)_8.75rem] gap-2 lg:flex lg:items-center lg:gap-3">
              <div className="hidden min-w-0 flex-1 items-center gap-3 lg:flex" role="group" aria-label="Domaines">
                <p className="shrink-0 font-headline text-[0.625rem] uppercase tracking-[0.35em] text-[color-mix(in_srgb,var(--primary)_72%,transparent)] italic">
                  Domaines
                </p>
                <div className="min-w-0 flex-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <div className="flex w-max items-center gap-2">
                    <button
                      type="button"
                      onClick={() => selectCategory('Tous')}
                      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-headline text-sm italic transition-colors ${
                        activeCategory === 'Tous'
                          ? 'border-[color:var(--primary)] bg-[color:var(--primary)] text-primary-foreground'
                          : 'border-[color-mix(in_srgb,var(--outline)_18%,transparent)] bg-[color-mix(in_srgb,var(--surface)_44%,transparent)] hover:bg-surface-container-low'
                      }`}
                    >
                      Tous
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => selectCategory(category)}
                        className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 font-headline text-sm italic transition-colors ${
                          activeCategory === category
                            ? 'border-[color-mix(in_srgb,var(--primary)_44%,transparent)] bg-surface-container'
                            : 'border-[color-mix(in_srgb,var(--outline)_18%,transparent)] bg-[color-mix(in_srgb,var(--surface)_44%,transparent)] hover:bg-surface-container-low'
                        }`}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: categoryColor(category) }} />
                        {category}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="relative min-w-0 lg:w-72 lg:shrink-0">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-variant" aria-hidden />
                <input
                  ref={searchInputRef}
                  id="glossary-search"
                  name="glossary-search"
                  aria-label="Rechercher dans le lexique"
                  type="search"
                  placeholder="Rechercher"
                  value={query}
                  onChange={(event) => updateQuery(event.target.value)}
                  className={`h-11 w-full rounded-full border border-[color-mix(in_srgb,var(--outline)_18%,transparent)] bg-[color-mix(in_srgb,var(--surface-container-lowest)_72%,transparent)] py-0 pl-9 font-headline text-sm italic outline-none transition-colors placeholder:text-surface-variant focus:border-[color-mix(in_srgb,var(--primary)_55%,transparent)] lg:h-[2.375rem] lg:py-2 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none ${
                    query ? 'pr-11' : 'pr-3'
                  }`}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      updateQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center rounded-full text-surface-variant transition-colors hover:bg-surface-container hover:text-foreground lg:h-[2.375rem] lg:w-10"
                    aria-label="Effacer la recherche"
                  >
                    <X className="h-4 w-4" aria-hidden />
                  </button>
                )}
              </div>
              <label className="relative block lg:hidden">
                <span className="sr-only">Filtrer par domaine</span>
                <select
                  id="glossary-category"
                  name="glossary-category"
                  aria-label="Filtrer par domaine"
                  value={activeCategory}
                  onChange={(event) => selectCategory(event.target.value)}
                  className="h-11 w-full appearance-none truncate rounded-full border border-[color-mix(in_srgb,var(--outline)_18%,transparent)] bg-[color-mix(in_srgb,var(--surface-container-lowest)_72%,transparent)] pl-3 pr-8 font-headline text-sm italic text-foreground outline-none transition-colors focus:border-[color-mix(in_srgb,var(--primary)_55%,transparent)]"
                >
                  <option value="Tous">Tous domaines</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-variant" aria-hidden />
              </label>
            </div>
          </section>
        </div>

        <section id="glossary-results" className="mb-20 scroll-mt-[var(--glossary-anchor-offset)]">
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true" aria-label="Résultats du dictionnaire">
            {pluralize(visibleTerms.length, 'résultat')} dans le dictionnaire.
          </p>
          {filteredTerms.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-headline text-2xl italic text-surface-variant">Aucune entrée trouvée.</p>
            </div>
          ) : (
            <div className="mb-12">
              <div className="mb-6 flex flex-wrap items-baseline gap-x-6 gap-y-3 border-b border-[color-mix(in_srgb,var(--outline)_12%,transparent)] pb-3">
                <span className="font-headline text-6xl leading-none text-[color:var(--primary)]">
                  {!isLetterFilterActive
                    ? 'Tous'
                    : activeSecondLetter && activeSecondLetter !== '0'
                      ? `${activeLetter}${activeSecondLetter.toLowerCase()}`
                      : activeLetter}
                </span>
                <span className="font-headline text-[0.625rem] uppercase tracking-[0.45em] text-[color-mix(in_srgb,var(--primary)_72%,transparent)] italic">
                  {pluralize(visibleTerms.length, 'entrée')}
                </span>
                {isLetterFilterActive && availableSecondLetters.length > 1 && (
                  <div
                    className="hidden min-w-0 flex-1 items-center justify-end gap-3 self-center lg:flex"
                    role="group"
                    aria-label="Filtrer par deuxième lettre"
                  >
                    <span className="shrink-0 font-headline text-[0.625rem] uppercase tracking-[0.35em] text-[color-mix(in_srgb,var(--primary)_72%,transparent)] italic">
                      2ᵉ lettre
                    </span>
                    <div className="-mx-1 overflow-x-auto px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                      <div className="flex min-w-max items-center gap-1">
                        {availableSecondLetters.map((letter) => {
                          const isActive = activeSecondLetter === letter;
                          return (
                            <button
                              key={letter}
                              type="button"
                              onClick={() => setActiveSecondLetter(isActive ? '' : letter)}
                              aria-pressed={isActive}
                              className={`flex h-7 min-w-7 items-center justify-center rounded-full border px-1.5 font-headline text-sm leading-none transition-all ${
                                isActive
                                  ? 'border-[color-mix(in_srgb,var(--primary)_42%,transparent)] bg-[color-mix(in_srgb,var(--primary)_12%,transparent)] text-[color:var(--primary)] shadow-editorial-xs'
                                  : 'cursor-pointer border-transparent text-surface-variant hover:border-[color-mix(in_srgb,var(--primary)_24%,transparent)] hover:bg-surface-container-low hover:text-[color:var(--primary)]'
                              }`}
                            >
                              {letter}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {visibleTerms.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="font-headline text-2xl italic text-surface-variant">Aucune entrée pour cette lettre.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {visibleTerms.map((term) => {
                    const isExpanded = expandedSlugs.has(term.slug);
                    const color = categoryColor(term.category);
                    const detailsId = `definition-${term.slug}`;

                    return (
                      <article
                        key={term.id}
                        id={`term-${term.slug}`}
                        data-glossary-initial={initialFor(term.term)}
                        className={`scroll-mt-[var(--glossary-anchor-offset)] -mx-5 border-b border-[color-mix(in_srgb,var(--outline)_12%,transparent)] px-5 py-5 transition-colors sm:-mx-4 sm:rounded-lg sm:px-4 sm:py-6 ${
                          isExpanded ? 'bg-surface-container-low' : 'hover:bg-surface-container-low/70'
                        }`}
                      >
                        <button
                          type="button"
                          className="grid w-full cursor-pointer grid-cols-[2.75rem_minmax(0,1fr)] items-start gap-x-3 gap-y-3 text-left md:grid-cols-12 md:gap-6"
                          onClick={() => toggleTerm(term)}
                          aria-expanded={isExpanded}
                          aria-controls={isExpanded ? detailsId : undefined}
                        >
                          <div className="col-start-2 row-start-1 min-w-0 md:col-span-4 md:col-start-auto md:row-start-auto">
                            <span className="block font-headline text-[1.375rem] leading-tight md:text-2xl">{term.term}</span>
                            {term.latin && <span className="mt-1 block font-headline text-sm italic text-surface-variant">{term.latin}</span>}
                            <span className="mt-1.5 block font-mono text-[0.625rem] uppercase tracking-[0.18em] md:mt-2 md:text-[0.5625rem] md:tracking-[0.25em]" style={{ color }}>
                              {term.category}
                            </span>
                          </div>
                          <p className="col-start-2 row-start-2 text-base leading-relaxed text-foreground/85 md:col-span-7 md:col-start-auto md:row-start-auto md:text-[0.95rem]">
                            {term.short}
                          </p>
                          <div data-glossary-disclosure className="col-start-1 row-start-1 flex justify-start md:col-span-1 md:col-start-auto md:row-start-auto md:justify-end">
                            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--outline)_12%,transparent)] transition-colors hover:border-[color:var(--primary)] hover:bg-[color:var(--primary)] hover:text-primary-foreground md:h-9 md:w-9" aria-hidden>
                              {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            </span>
                          </div>
                        </button>

                        {isExpanded && (
                          <div id={detailsId} className="mt-4 grid grid-cols-12 gap-5 border-t border-[color-mix(in_srgb,var(--outline)_12%,transparent)] pt-5 md:mt-6 md:gap-6 md:border-t-0 md:pt-0">
                            <div className="col-span-12 md:col-span-8">
                              <p className="mb-2 font-headline text-[0.625rem] uppercase tracking-[0.45em] text-[color-mix(in_srgb,var(--primary)_72%,transparent)] italic">
                                Définition détaillée
                              </p>
                              {term.definition || defs ? (
                                <Markdown
                                  source={term.definition}
                                  glossaryPreview
                                  className="mb-5 text-base leading-relaxed text-surface-variant md:text-sm [&>p]:mb-3 [&>p:last-child]:mb-0 [&_ol]:mb-5 [&_ul]:mb-5"
                                />
                              ) : (
                                <DefinitionSkeleton />
                              )}

                              {term.aliases && term.aliases.length > 0 && (
                                <div className="mt-5">
                                  <p className="mb-2 font-headline text-[0.625rem] uppercase tracking-[0.45em] text-[color-mix(in_srgb,var(--primary)_72%,transparent)] italic">
                                    Alias
                                  </p>
                                  <ul className="flex flex-wrap gap-2">
                                    {term.aliases.map((alias) => (
                                      <li
                                        key={alias}
                                        className="max-w-full rounded-full border border-outline-variant bg-surface-container/55 px-3 py-1 font-mono text-[0.68rem] leading-relaxed text-surface-variant"
                                      >
                                        {alias}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {term.example && (
                                <>
                                  <p className="mb-2 mt-6 font-headline text-[0.625rem] uppercase tracking-[0.45em] text-[color-mix(in_srgb,var(--primary)_72%,transparent)] italic">
                                    Exemple
                                  </p>
                                  <pre className="whitespace-pre-wrap rounded-md bg-surface-container/70 p-4 font-mono text-sm leading-relaxed text-surface-variant md:text-xs">
                                    {term.example}
                                  </pre>
                                </>
                              )}

                              {safeHttpUrl(term.link) && (
                                <a
                                  href={safeHttpUrl(term.link)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-outline-variant px-4 py-2 text-sm font-medium transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:text-[color:var(--primary)]"
                                >
                                  Site officiel <ExternalLink size={14} />
                                </a>
                              )}
                            </div>

                            <aside className="col-span-12 md:col-span-4">
                              {term.seeAlso.length > 0 && (
                                <>
                                  <p className="mb-2 font-headline text-[0.625rem] uppercase tracking-[0.45em] text-[color-mix(in_srgb,var(--primary)_72%,transparent)] italic">
                                    Voir aussi
                                  </p>
                                  <ul className="space-y-2">
                                    {term.seeAlso.map((slug) => {
                                      const related = glossaryBySlug(slug);
                                      return (
                                        <li key={slug} className="font-headline text-base italic">
                                          <Link
                                            to={`/glossary?term=${slug}`}
                                            onClick={() => revealSlug(slug)}
                                            className="border-b border-dotted border-[color-mix(in_srgb,var(--primary)_40%,transparent)] pb-0.5 text-[color-mix(in_srgb,var(--primary)_84%,var(--on-surface))] transition-colors hover:text-[color:var(--primary)]"
                                          >
                                            {related?.term ?? slug.replace(/-/g, ' ')}
                                          </Link>
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </>
                              )}

                              {term.relatedLessonIds.length > 0 && (
                                <div className="mt-6">
                                  <p className="mb-2 font-headline text-[0.625rem] uppercase tracking-[0.45em] text-[color-mix(in_srgb,var(--primary)_72%,transparent)] italic">
                                    Approfondir
                                  </p>
                                  <div className="space-y-2">
                                    {term.relatedLessonIds.map((id) => {
                                      const lesson = publicLessonById(id);
                                      if (!lesson) return null;
                                      return (
                                        <Link
                                          key={id}
                                          to={`/lessons/${lesson.slug}`}
                                          className="flex items-center justify-between gap-3 rounded-xl border border-outline-variant px-4 py-2.5 text-sm transition-colors hover:border-[color-mix(in_srgb,var(--primary)_50%,transparent)] hover:bg-surface-container"
                                        >
                                          <span>{lesson.title}</span>
                                          <ArrowRight size={15} className="shrink-0 text-surface-variant" />
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                            </aside>
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>

        <section className="my-20 grid gap-12 rounded-2xl border border-[color-mix(in_srgb,var(--outline)_12%,transparent)] bg-surface-container-low p-8 sm:p-10 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <p className="mb-3 font-headline text-[0.625rem] uppercase tracking-[0.45em] text-[color-mix(in_srgb,var(--primary)_72%,transparent)] italic">
              À propos du lexique
            </p>
            <h2 className="font-headline text-3xl leading-tight">
              Pourquoi <span className="italic text-[color:var(--primary)]">les mots</span> comptent ?
            </h2>
          </aside>
          <div className="relative lg:col-span-8">
            <BookOpen className="absolute -left-4 -top-4 h-12 w-12 -rotate-12 text-[color-mix(in_srgb,var(--primary)_10%,transparent)]" aria-hidden />
            <p className="font-headline text-xl leading-relaxed text-foreground/85">
              <span className="float-left pr-3 pt-2 font-headline text-6xl font-medium leading-[0.85] text-[color:var(--primary)] italic">
                L
              </span>
              e capital-risque n’est pas seulement une affaire de chiffres. C’est aussi une grammaire de contrats, de droits, de préférences et de scénarios de sortie.
            </p>
            <p className="mt-4 font-headline text-xl leading-relaxed text-foreground/85">
              Nommer précisément une clause, une métrique ou un acteur permet de lire plus vite, négocier plus juste, et comprendre ce qui se joue vraiment derrière une term sheet.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
