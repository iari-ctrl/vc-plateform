import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  /** When this value changes (e.g. the route pathname), the boundary resets so
   *  navigating to another route clears a previously caught error. */
  resetKey?: unknown;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Catches render-time errors in the page subtree so a crash shows a recoverable
 * message inside the app chrome instead of a blank white screen. Error
 * boundaries must be class components — there is no Hook equivalent.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface the error for debugging. A production deployment would forward
    // this to an error-tracking service (e.g. Sentry) instead of the console.
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.hasError && prev.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false });
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    if (this.props.fallback) return this.props.fallback;

    return (
      <div role="alert" className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
        <p className="eyebrow mb-3">Erreur inattendue</p>
        <h1 className="font-headline text-headline-lg font-semibold text-balance">
          Cette page n’a pas pu s’afficher.
        </h1>
        <p className="mt-3 text-sm text-surface-variant text-pretty">
          Un incident technique est survenu. Vous pouvez recharger la page ou revenir à l’accueil.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button onClick={() => window.location.reload()} className="btn-foil">
            Recharger la page
          </button>
          {/* Hard navigation (not a router Link): guaranteed to work even if the
              router tree is what failed. */}
          <a href="/" className="btn-ghost">Retour à l’accueil</a>
        </div>
      </div>
    );
  }
}
