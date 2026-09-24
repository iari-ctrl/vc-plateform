import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { safeEditorialUrl } from '@shared/editorial-url.mjs';

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

export function formatCurrency(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `${formatNumber(n / 1_000_000, { maximumFractionDigits: 2 })} M€`;
  if (Math.abs(n) >= 1_000) return `${formatNumber(n / 1_000, { maximumFractionDigits: 1 })} k€`;
  return `${formatNumber(n, { maximumFractionDigits: 0 })} €`;
}

export function formatPercent(n: number, digits = 1): string {
  return `${formatNumber(n, { maximumFractionDigits: digits })} %`;
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return `${n} ${n > 1 ? plural ?? `${singular}s` : singular}`;
}

/** Strip combining diacritical marks so « é » and « e » compare equal. */
export function stripDiacritics(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/** Return an HTTPS editorial URL, or undefined when it is missing or unsafe. */
export function safeHttpUrl(url?: string | null): string | undefined {
  return safeEditorialUrl(url);
}
