import { describe, expect, it, vi } from 'vitest';

import { cacheBustedUrl, createRecoverableLazyLoader } from './lazyResource';

describe('createRecoverableLazyLoader', () => {
  it('réinitialise le cache après un rejet afin de permettre une reprise locale', async () => {
    const importer = vi
      .fn<(attempt: number) => Promise<string>>()
      .mockRejectedValueOnce(new Error('chunk indisponible'))
      .mockResolvedValueOnce('ressource chargée');
    const load = createRecoverableLazyLoader(importer);

    await expect(load()).rejects.toThrow('chunk indisponible');
    await expect(load()).resolves.toBe('ressource chargée');
    expect(importer).toHaveBeenCalledTimes(2);
    expect(importer).toHaveBeenNthCalledWith(1, 0);
    expect(importer).toHaveBeenNthCalledWith(2, 1);
  });

  it('partage la promesse tant qu’elle est en cours', async () => {
    let resolve!: (value: string) => void;
    const importer = vi.fn<(attempt: number) => Promise<string>>(() => new Promise((done) => { resolve = done; }));
    const load = createRecoverableLazyLoader(importer);

    const first = load();
    const second = load();
    resolve('ok');

    await expect(first).resolves.toBe('ok');
    await expect(second).resolves.toBe('ok');
    expect(importer).toHaveBeenCalledTimes(1);
  });

  it('ajoute un paramètre de reprise aux URLs déjà rejetées', () => {
    expect(cacheBustedUrl('/assets/resource.json', 0)).toBe('/assets/resource.json');
    expect(cacheBustedUrl('/assets/resource.json', 2)).toBe('/assets/resource.json?retry=2');
    expect(cacheBustedUrl('/assets/resource.json?direct', 3)).toBe('/assets/resource.json?direct&retry=3');
  });
});
