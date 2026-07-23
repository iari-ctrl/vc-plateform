/** Public collections are fail-closed: only an explicit published status is public. */
export function isPublishedContent(value) {
  return value?.status === 'published';
}
