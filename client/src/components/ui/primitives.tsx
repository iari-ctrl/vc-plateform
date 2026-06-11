import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { LEVEL_LABEL } from '@/content/labels';

// ── Button ──────────────────────────────────────────────────────────────────
type ButtonProps = {
  variant?: 'foil' | 'ghost' | 'quiet';
  as?: 'button' | 'link';
  to?: string;
  href?: string;
  className?: string;
  children: ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ variant = 'foil', as = 'button', to, href, className, children, ...rest }: ButtonProps) {
  const cls = cn(variant === 'foil' ? 'btn-foil' : variant === 'ghost' ? 'btn-ghost' : 'btn-quiet', className);
  if (as === 'link' && to) return <Link to={to} className={cls}>{children}</Link>;
  if (as === 'link' && href) return <a href={href} className={cls}>{children}</a>;
  return (
    <button className={cls} {...rest}>
      {children}
    </button>
  );
}

// ── Chip / Tag ────────────────────────────────────────────────────────────────
export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('chip', className)}>{children}</span>;
}

export function LevelBadge({ level, accent }: { level: string; accent?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.12em]"
      style={{
        color: accent ?? 'var(--on-surface-variant)',
        background: accent ? `color-mix(in srgb, ${accent} 12%, transparent)` : 'var(--surface-container)',
      }}
    >
      {LEVEL_LABEL[level] ?? level}
    </span>
  );
}

// ── Section heading (eyebrow + serif title) ──────────────────────────────────
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={cn(align === 'center' && 'text-center mx-auto max-w-2xl', className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 className="font-headline text-display-sm font-semibold tracking-tight text-balance">{title}</h2>
      {description && <p className="mt-3 text-[1.0625rem] leading-relaxed text-surface-variant text-pretty">{description}</p>}
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-outline-variant bg-surface-container-low/50 px-6 py-16 text-center">
      {icon && <div className="mb-4 text-surface-variant/70">{icon}</div>}
      <h3 className="font-headline text-headline-sm font-semibold">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-surface-variant">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ── Progress ───────────────────────────────────────────────────────────────────
export function ProgressBar({ value, accent = 'var(--primary)', className }: { value: number; accent?: string; className?: string }) {
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-surface-container-high', className)}>
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: accent }}
      />
    </div>
  );
}

export function ProgressRing({ value, size = 40, stroke = 3, accent = 'var(--primary)', label }: { value: number; size?: number; stroke?: number; accent?: string; label?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <span className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-container-high)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.16,1,0.3,1)' }}
        />
      </svg>
      {label && <span className="absolute font-mono text-[0.5625rem] font-semibold">{label}</span>}
    </span>
  );
}

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return (
    <span className={cn('inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent', className)} aria-hidden />
  );
}

// ── Page loader (full-section loading state) ────────────────────────────────────
export function PageLoader({ label = 'Chargement…' }: { label?: string }) {
  return (
    <div role="status" aria-live="polite" className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-surface-variant">
      <Spinner className="h-6 w-6 text-[color:var(--primary)]" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

// ── Reveal (scroll-in fade-up) ──────────────────────────────────────────────────
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn('transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform', shown ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4', className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
