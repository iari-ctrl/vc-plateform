import ecosystemsJson from '@data/ecosystems.json';
import type { ConvictionStrength, EcosystemDossier, SignalDirection } from './types';

export const ECOSYSTEMS = ecosystemsJson as unknown as EcosystemDossier[];

export const ecosystemBySlug = (slug: string) => ECOSYSTEMS.find((e) => e.slug === slug);
export const ecosystemById = (id: string) => ECOSYSTEMS.find((e) => e.id === id);

/** Sibling order: explicit `order` first, then most-recently-revised. */
const bySiblingOrder = (a: EcosystemDossier, b: EcosystemDossier) =>
  (a.order ?? 0) - (b.order ?? 0) || b.updatedAt.localeCompare(a.updatedAt);

/** Top-level dossiers (no parent) — what the index page lists. */
export const rootEcosystems = () => ECOSYSTEMS.filter((e) => !e.parentId).sort(bySiblingOrder);

/** Direct children of a dossier, in author order. */
export const childEcosystems = (parentId: string) =>
  ECOSYSTEMS.filter((e) => e.parentId === parentId).sort(bySiblingOrder);

/** Ancestors from root → immediate parent, for breadcrumbs. Cycle-safe. */
export const ecosystemAncestors = (dossier: EcosystemDossier): EcosystemDossier[] => {
  const chain: EcosystemDossier[] = [];
  const seen = new Set<string>([dossier.id]);
  let current = dossier.parentId ? ecosystemById(dossier.parentId) : undefined;
  while (current && !seen.has(current.id)) {
    chain.unshift(current);
    seen.add(current.id);
    current = current.parentId ? ecosystemById(current.parentId) : undefined;
  }
  return chain;
};

/** Display labels + accents for conviction strength (always shown, never implied). */
export const CONVICTION_STRENGTH_META: Record<ConvictionStrength, { label: string; accent: string }> = {
  exploratoire: { label: 'Exploratoire', accent: '#4C6B8A' },
  moyenne: { label: 'Conviction moyenne', accent: '#B0894A' },
  forte: { label: 'Conviction forte', accent: '#3E7C6A' },
};

/** Display labels + glyphs + accents for watched-signal directions. */
export const SIGNAL_DIRECTION_META: Record<SignalDirection, { label: string; glyph: string; accent: string }> = {
  haussier: { label: 'Haussier', glyph: '↗', accent: '#3E7C6A' },
  baissier: { label: 'Baissier', glyph: '↘', accent: '#B5544E' },
  incertain: { label: 'Incertain', glyph: '〜', accent: '#B0894A' },
};
