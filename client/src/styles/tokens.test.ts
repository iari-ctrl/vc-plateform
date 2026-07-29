import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.replace('#', '');
  return [0, 2, 4].map((offset) => parseInt(normalized.slice(offset, offset + 2), 16) / 255) as [number, number, number];
}

function channelLuminance(value: number): number {
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

function contrast(foreground: string, background: string): number {
  const [lighter, darker] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (lighter + 0.05) / (darker + 0.05);
}

function parseVars(block: string): Record<string, string> {
  return Object.fromEntries(Array.from(block.matchAll(/--([a-z0-9-]+):\s*(#[0-9A-Fa-f]{6})/g)).map((match) => [match[1], match[2]]));
}

const css = readFileSync(resolve(__dirname, 'tokens.css'), 'utf8');
const rootVars = parseVars(css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? '');
const darkVars = { ...rootVars, ...parseVars(css.match(/\.dark\s*\{([\s\S]*?)\n\}/)?.[1] ?? '') };

describe('design tokens accessibility contrast', () => {
  it.each([
    ['light', rootVars],
    ['dark', darkVars],
  ] as const)('keeps text and semantic tokens readable in %s mode', (_mode, vars) => {
    const requiredPairs = [
      ['on-background', 'background'],
      ['on-surface', 'surface'],
      ['on-surface-variant', 'surface'],
      ['on-surface-variant', 'surface-container-low'],
      ['primary', 'surface'],
      ['primary', 'surface-container-low'],
      ['on-primary', 'primary'],
      ['success', 'surface'],
      ['error', 'surface'],
    ] as const;

    for (const [foreground, background] of requiredPairs) {
      expect(
        contrast(vars[foreground], vars[background]),
        `${foreground} ${vars[foreground]} on ${background} ${vars[background]}`,
      ).toBeGreaterThanOrEqual(4.5);
    }
  });
});
