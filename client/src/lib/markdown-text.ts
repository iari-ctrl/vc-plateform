/**
 * Plain-text excerpt from markdown/HTML — the single strip-markdown used by both
 * card previews and SEO metadata (`lib/seo.ts`). It resolves the `[[slug|label]]`
 * / `{{slug|label}}` glossary markers to their label, removes HTML tags and
 * markdown punctuation, collapses whitespace and (optionally) truncates.
 *
 * Intra-word hyphens are kept on purpose — `anti-portfolio` must not become
 * `antiportfolio`. Pass `Infinity` as `max` to disable truncation (SEO needs the
 * full title/description, then formats it itself).
 */
export function plainText(source: string | undefined, max = 180): string {
  const t = (source ?? '')
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1') // [[slug|label]] → label
    .replace(/\[\[([^\]]+)\]\]/g, '$1') //          [[label]]      → label
    .replace(/\{\{[^}|]+\|([^}]+)\}\}/g, '$1') //   {{slug|label}} → label
    .replace(/\{\{([^}]+)\}\}/g, '$1') //           {{label}}      → label
    .replace(/<[^>]*>/g, ' ') //                    strip HTML tags
    .replace(/[#*_`>[\]()|~{}]/g, ' ') //           markdown punctuation (keeps `-`)
    .replace(/\s+/g, ' ')
    .trim();
  return Number.isFinite(max) && t.length > max ? t.slice(0, max).trimEnd() + '…' : t;
}
