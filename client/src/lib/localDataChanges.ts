/** Same-document lifecycle updates. Payloads come from a verified storage snapshot. */
type Snapshot = Record<string, string | null>;
const listeners = new Set<(snapshot: Snapshot) => void>();
export const localDataChanges = {
  subscribe(listener: (snapshot: Snapshot) => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  publish(snapshot: Snapshot) { listeners.forEach(listener => listener(snapshot)); },
};
