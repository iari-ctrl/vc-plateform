import { Link } from 'react-router-dom';
import { Fleuron } from '@/components/ornaments/Ornaments';
import { cn } from '@/lib/utils';

export function Logo({ compact = false, className, to = '/home' }: { compact?: boolean; className?: string; to?: string }) {
  return (
    <Link to={to} className={cn('group inline-flex items-center gap-2.5', className)} aria-label="VC Premium Experience — accueil">
      <span className="grid h-9 w-9 place-items-center rounded-full border border-[color-mix(in_srgb,var(--primary)_40%,transparent)] bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] transition-colors group-hover:bg-[color-mix(in_srgb,var(--primary)_20%,transparent)]">
        <Fleuron className="text-base" />
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-headline text-[1.05rem] font-semibold tracking-tight">VC Premium</span>
          <span className="font-mono text-[0.5625rem] uppercase tracking-[0.34em] text-surface-variant">Experience</span>
        </span>
      )}
    </Link>
  );
}
