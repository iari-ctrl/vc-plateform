/** A recovery copy lives outside the localStorage quota, before any replacement.
 * This database contains only the latest pending operation, never active app data.
 */
const DATABASE = 'vc-platform-local-recovery';
const STORE = 'recovery';
async function database(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DATABASE, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => {
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Recovery database blocked'));
  });
}
async function access(mode: IDBTransactionMode, write?: string | null): Promise<string | null> {
  const db = await database();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const store = tx.objectStore(STORE);
      // Reserve in a single transaction so another tab cannot overwrite a pending copy.
      const request = store.get('pending');
      request.onsuccess = () => {
        if (write === null) store.delete('pending');
        else if (write !== undefined) {
          if (request.result !== undefined) tx.abort();
          else store.put(write, 'pending');
        }
      };
      tx.oncomplete = () => resolve(write === undefined && typeof request.result === 'string' ? request.result : null);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error('Recovery transaction aborted'));
    });
  } finally { db.close(); }
}
export const localDataRecovery = {
  read: () => access('readonly'),
  async save(text: string): Promise<void> {
    await access('readwrite', text);
    if (await access('readonly') !== text) throw new Error('Recovery verification failed');
  },
  async clear(): Promise<void> {
    await access('readwrite', null);
    if (await access('readonly') !== null) throw new Error('Recovery deletion verification failed');
  },
};
