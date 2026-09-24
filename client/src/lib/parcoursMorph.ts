import { useCallback, useState } from 'react';
import { flushSync } from 'react-dom';
import { useNavigate } from 'react-router-dom';

/**
 * Carry a parcours seal from the surface that lists it into the page it opens.
 *
 * The application runs on `BrowserRouter`, so React Router's own `viewTransition`
 * option — which needs a data router — never fires here; the transition is
 * driven by hand. Two invariants make it work:
 *
 * 1. The outgoing seal must already be named when the old snapshot is taken,
 *    hence the synchronous commit *before* `startViewTransition`.
 * 2. Only the seal being activated may carry the name. The same
 *    `view-transition-name` twice in one document aborts the whole transition,
 *    which is why the catalogue names one card rather than all twenty-four.
 *
 * Without the API, or under a reduced-motion preference, this is an ordinary
 * navigation.
 */
export function useParcoursMorph() {
  const navigate = useNavigate();
  const [morphSlug, setMorphSlug] = useState<string | null>(null);

  /**
   * `to` permet à l'appelant de conserver ses paramètres de requête — l'index
   * y fait suivre le niveau d'approfondissement choisi. Sans lui, le chemin de
   * clic principal reconstruirait une URL nue et perdrait ce que le lien
   * annonçait.
   */
  const openParcours = useCallback((slug: string, to?: string) => {
    const href = to ?? `/parcours/${slug}`;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (reduced || typeof document.startViewTransition !== 'function') {
      navigate(href);
      return;
    }

    flushSync(() => setMorphSlug(slug));
    document.startViewTransition(() => {
      flushSync(() => navigate(href));
    });
  }, [navigate]);

  return { morphSlug, openParcours };
}

/** The shared name for a parcours seal, on both sides of the transition. */
export function parcoursSealName(slug: string) {
  return `parcours-seal-${slug}`;
}
