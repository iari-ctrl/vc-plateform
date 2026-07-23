export function cacheBustedUrl(url: string, attempt: number): string {
  if (attempt <= 0) return url;
  return `${url}${url.includes('?') ? '&' : '?'}retry=${attempt}`;
}

export async function fetchJsonResource<T>(url: string, attempt: number): Promise<T> {
  const response = await fetch(cacheBustedUrl(url, attempt), { credentials: 'same-origin' });
  if (!response.ok) {
    throw new Error(`Ressource indisponible (${response.status}).`);
  }
  return response.json() as Promise<T>;
}

export function createRecoverableLazyLoader<T>(importer: (attempt: number) => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | null = null;
  let attempt = 0;

  return () => {
    if (!promise) {
      promise = importer(attempt).catch((error: unknown) => {
        promise = null;
        attempt += 1;
        throw error;
      });
    }
    return promise;
  };
}
