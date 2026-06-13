import ecosystemsJson from '@data/ecosystems.json';
import type { ConvictionStrength, EcosystemDossier, SignalDirection } from './types';

export const ECOSYSTEMS = ecosystemsJson as unknown as EcosystemDossier[];

export const ecosystemBySlug = (slug: string) => ECOSYSTEMS.find((e) => e.slug === slug);
export const ecosystemById = (id: string) => ECOSYSTEMS.find((e) => e.id === id);

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
