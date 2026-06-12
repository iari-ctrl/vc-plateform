import { Link as RouterLink, useLocation } from 'react-router-dom';
import { storeLocale } from './config';
import { useLocale } from './useLocale';
import { swapLocalePath } from './navigation';
import { cn } from '@/lib/utils';

/**
 * FR / EN language selector. Each option is a real link to the same route in the
 * other language (keyboard-accessible and crawlable), computed by swapping the
 * locale segment of the current path. Clicking persists the explicit choice so
 * the next visit to `/` lands in the chosen language.
 *
 * Uses the raw router `Link` (not the locale-prefixing wrapper) because the
 * destination is an already-complete localized path.
 */
export function LocaleSwitcher({ className }: { className?: string }) {
  const active = useLocale();
  const { pathname, search, hash } = useLocation();

  const next = active === 'fr' ? 'en' : 'fr';
  const targetLabel = active === 'fr' ? 'Switch to English' : 'Passer en Français';

  return (
    <RouterLink
      to={`${swapLocalePath(pathname, next)}${search}${hash}`}
      hrefLang={next}
      lang={next}
      aria-label={targetLabel}
      onClick={() => storeLocale(next)}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full border border-outline-variant bg-surface-container-low p-0.5 hover:border-primary transition-all duration-200 cursor-pointer',
        className,
      )}
    >
      <span
        className={cn(
          'grid h-7 min-w-[2rem] place-items-center rounded-full px-2 text-xs font-semibold uppercase tracking-wide transition-all duration-200',
          active === 'fr'
            ? 'bg-surface-container text-foreground shadow-sm'
            : 'text-surface-variant',
        )}
      >
        FR
      </span>
      <span
        className={cn(
          'grid h-7 min-w-[2rem] place-items-center rounded-full px-2 text-xs font-semibold uppercase tracking-wide transition-all duration-200',
          active === 'en'
            ? 'bg-surface-container text-foreground shadow-sm'
            : 'text-surface-variant',
        )}
      >
        EN
      </span>
    </RouterLink>
  );
}
