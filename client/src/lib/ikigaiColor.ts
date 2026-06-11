/**
 * Ikigai dimension accents are authored as fixed brand hexes (orange, teal,
 * navy, plum). On a dark surface the very dark navy of « ce dont l'écosystème a
 * besoin » (#1E2D38) all but vanishes — invisible as a circle fill, a kanji or a
 * title. These helpers lift only the too-dark accents toward a light slate so
 * every dimension stays legible, while lighter accents keep their hue untouched
 * and light mode is unaffected.
 */

/** sRGB-weighted relative luminance (0–1) of a `#rrggbb` colour. */
export function relLuminance(hex: string): number {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return 0.5;
  const n = parseInt(m[1], 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/** A theme-legible version of a dimension accent (a CSS colour string). */
export function legibleAccent(hex: string, dark: boolean): string {
  if (dark && relLuminance(hex) < 0.22) {
    return `color-mix(in srgb, ${hex} 40%, #AEB8C2)`;
  }
  return hex;
}
