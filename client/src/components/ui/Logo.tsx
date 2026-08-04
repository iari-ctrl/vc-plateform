import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export function Logo({ compact = false, className, to = '/home' }: { compact?: boolean; className?: string; to?: string }) {
  return (
    <Link
      to={to}
      className={cn('group inline-flex items-center text-foreground', className)}
      aria-label={compact ? 'Maison Sapience VC — accueil' : 'Maison Sapience VC'}
    >
      <span
        className={cn(
          'font-headline font-medium uppercase leading-none tracking-[0.1em] transition-colors group-hover:text-[color:var(--primary)]',
          compact
            ? 'flex flex-col items-center text-center text-[0.43rem] tracking-[0.08em]'
            : 'inline-flex items-baseline gap-1 text-[0.86125rem] tracking-[0.2em] sm:text-[0.95875rem] sm:tracking-[0.24em]',
        )}
      >
        <span>Maison</span>
        <span className={cn('font-semibold', compact ? 'tracking-[0.1em]' : 'tracking-[0.22em] sm:tracking-[0.26em]')}>
          Sapience VC
        </span>
      </span>
    </Link>
  );
}
