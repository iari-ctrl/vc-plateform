/** Plain-text excerpt from markdown (for cards / previews). */
export function plainText(source: string, max = 180): string {
  const t = source
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/\{\{[^}|]+\|([^}]+)\}\}/g, '$1')
    .replace(/\{\{([^}]+)\}\}/g, '$1')
    .replace(/[#*_>-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > max ? t.slice(0, max).trimEnd() + '…' : t;
}
