import type { SearchHit } from './search';
import { createRecoverableLazyLoader } from './lazyResource';

type SearchModule = typeof import('./search');

const retrySearchModuleLoaders: Array<() => Promise<SearchModule>> = [
  () => import('./search'),
  ...Object.values(import.meta.glob<SearchModule>('./search.ts', { query: '?retry=1' })),
  ...Object.values(import.meta.glob<SearchModule>('./search.ts', { query: '?retry=2' })),
];

const loadSearchModule = createRecoverableLazyLoader((attempt) => {
  const loader = retrySearchModuleLoaders[Math.min(attempt, retrySearchModuleLoaders.length - 1)];
  return loader();
});

export async function loadSearchHits(query: string): Promise<SearchHit[]> {
  const { searchLocal } = await loadSearchModule();
  return searchLocal(query);
}
