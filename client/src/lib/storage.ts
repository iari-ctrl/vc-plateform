/** Namespaced localStorage helpers for guest-mode persistence. */

const PREFIX = 'vcpx:';

export const storage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch {
      /* quota / unavailable — ignore */
    }
  },
  remove(key: string): void {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
  },
};

export const STORAGE_KEYS = {
  theme: 'theme',
  profile: 'profile',
  notes: 'notes',
  bookmarks: 'bookmarks',
  progress: 'progress',
  journal: 'decision-journal',
  highlights: 'highlights',
  onboardingSeen: 'onboarding-seen',
  // ── Ikigai "cahier d'introspection" ──
  ikigaiMode: 'ikigai-reading-mode',
  ikigaiAnswers: 'ikigai-cahier-answers',
  ikigaiArchetype: 'ikigai-archetype',
  ikigaiHistory: 'ikigai-history',
} as const;
