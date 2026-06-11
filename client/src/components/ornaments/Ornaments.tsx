import { cn } from '@/lib/utils';

/** Fleuron — the gilded ❦ mark used as a brand seal and divider accent. */
export function Fleuron({ className }: { className?: string }) {
  return (
    <span className={cn('select-none font-headline text-[color:var(--primary)]', className)} aria-hidden>
      ❦
    </span>
  );
}

/** A centered editorial divider with a fleuron. */
export function FleuronDivider({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center gap-4 py-2', className)} aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-outline-variant" />
      <Fleuron className="text-sm" />
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-outline-variant" />
    </div>
  );
}

export function GoldRule({ className }: { className?: string }) {
  return <div className={cn('ornament-rule', className)} aria-hidden />;
}

/** A circular wax-seal style badge bearing a kanji and tinted by an accent color. */
export function KanjiSeal({
  kanji,
  accent,
  size = 56,
  className,
}: {
  kanji: string;
  accent: string;
  size?: number;
  className?: string;
}) {
  return (
    <span
      className={cn('relative inline-flex shrink-0 items-center justify-center rounded-full font-headline', className)}
      style={{
        width: size,
        height: size,
        color: accent,
        background: `color-mix(in srgb, ${accent} 12%, transparent)`,
        border: `1px solid color-mix(in srgb, ${accent} 35%, transparent)`,
        fontSize: size * 0.42,
      }}
      aria-hidden
    >
      {kanji}
    </span>
  );
}
