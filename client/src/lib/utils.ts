import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateFr(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch {
    return iso;
  }
}

export function formatNumber(n: number, opts: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('fr-FR', opts).format(n);
}

/** Borne `n` dans l'intervalle [min, max]. */
export function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${formatNumber(n / 1_000_000, { maximumFractionDigits: 2 })} M€`;
  if (Math.abs(n) >= 1_000) return `${formatNumber(n / 1_000, { maximumFractionDigits: 1 })} k€`;
  return `${formatNumber(n, { maximumFractionDigits: 0 })} €`;
}

export function formatPercent(n: number, digits = 1): string {
  return `${formatNumber(n, { maximumFractionDigits: digits })} %`;
}

/** Formate un multiple VC (TVPI, DPI, préférence…) : `2,4×`. */
export function formatMultiple(n: number, digits = 2): string {
  return `${formatNumber(n, { maximumFractionDigits: digits })}×`;
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return `${n} ${n > 1 ? plural ?? `${singular}s` : singular}`;
}

export function readingTime(minutes: number): string {
  return `${minutes} min`;
}

export function initials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? '').join('');
}

/**
 * Returns the URL only if it uses a safe, user-navigable scheme (http/https/
 * mailto). Guards external-link fields (e.g. admin-entered glossary links) so a
 * `javascript:`/`data:` URI can never reach an href. Returns undefined when the
 * value is missing or unsafe — callers treat that as "no link".
 */
export function safeHttpUrl(url?: string | null): string | undefined {
  if (!url) return undefined;
  const trimmed = url.trim();
  const base = typeof window !== 'undefined' ? window.location.origin : undefined;
  try {
    const { protocol } = new URL(trimmed, base);
    if (protocol === 'http:' || protocol === 'https:' || protocol === 'mailto:') return trimmed;
  } catch {
    /* malformed URL — treat as unsafe */
  }
  return undefined;
}
