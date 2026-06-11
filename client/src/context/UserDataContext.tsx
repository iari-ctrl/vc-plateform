import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { api } from '@/lib/api';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import { useAuth } from './AuthContext';
import type { Bookmark, Note, ProgressEntry, UserProfile } from '@/content/types';

interface UserDataCtx {
  profile: UserProfile | null;
  notes: Note[];
  bookmarks: Bookmark[];
  progress: Record<string, ProgressEntry>;
  loading: boolean;
  saveProfile: (p: UserProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
  addNote: (n: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  isBookmarked: (itemType: string, itemId: string) => boolean;
  toggleBookmark: (b: Bookmark) => Promise<void>;
  setProgress: (p: ProgressEntry) => Promise<void>;
  getProgress: (lessonId: string) => ProgressEntry | undefined;
}

const Ctx = createContext<UserDataCtx | null>(null);

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `n_${Date.now()}_${Math.random().toString(36).slice(2)}`;

export function UserDataProvider({ children }: { children: ReactNode }) {
  const { user, ready, apiUp } = useAuth();
  const authed = !!user && apiUp;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [progress, setProgressState] = useState<Record<string, ProgressEntry>>({});
  const [loading, setLoading] = useState(true);
  const prevUserId = useRef<string | null>(null);

  // ── Local persistence (guest mode) ────────────────────────────────────────
  const persistLocal = useCallback((p: typeof profile, n: Note[], b: Bookmark[], pr: Record<string, ProgressEntry>) => {
    storage.set(STORAGE_KEYS.profile, p);
    storage.set(STORAGE_KEYS.notes, n);
    storage.set(STORAGE_KEYS.bookmarks, b);
    storage.set(STORAGE_KEYS.progress, pr);
  }, []);

  const loadLocal = useCallback(() => {
    setProfile(storage.get<UserProfile | null>(STORAGE_KEYS.profile, null));
    setNotes(storage.get<Note[]>(STORAGE_KEYS.notes, []));
    setBookmarks(storage.get<Bookmark[]>(STORAGE_KEYS.bookmarks, []));
    setProgressState(storage.get<Record<string, ProgressEntry>>(STORAGE_KEYS.progress, {}));
  }, []);

  // ── Load on auth change ────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    let active = true;

    (async () => {
      setLoading(true);

      if (authed) {
        // Migrate guest data on first login, then load server state.
        const becameAuthed = prevUserId.current === null && !!user;
        if (becameAuthed) await migrateGuestData();

        try {
          const [srvProfile, srvNotes, srvBookmarks, srvProgress] = await Promise.all([
            api.get<UserProfile | null>('/me/profile'),
            api.get<Note[]>('/me/notes'),
            api.get<Bookmark[]>('/me/bookmarks'),
            api.get<ProgressEntry[]>('/me/progress'),
          ]);
          if (!active) return;
          setProfile(srvProfile);
          setNotes(srvNotes);
          setBookmarks(srvBookmarks);
          setProgressState(Object.fromEntries(srvProgress.map((p) => [p.lessonId, p])));
        } catch {
          if (active) loadLocal();
        }
      } else {
        loadLocal();
      }

      if (active) setLoading(false);
      prevUserId.current = user?.id ?? null;
    })();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, ready, user?.id]);

  async function migrateGuestData() {
    const localNotes = storage.get<Note[]>(STORAGE_KEYS.notes, []);
    const localBookmarks = storage.get<Bookmark[]>(STORAGE_KEYS.bookmarks, []);
    const localProgress = storage.get<Record<string, ProgressEntry>>(STORAGE_KEYS.progress, {});
    const localProfile = storage.get<UserProfile | null>(STORAGE_KEYS.profile, null);
    try {
      await Promise.all([
        ...localNotes.map((n) => api.post('/me/notes', n).catch(() => null)),
        ...localBookmarks.map((b) => api.post('/me/bookmarks', b).catch(() => null)),
        ...Object.values(localProgress).map((p) => api.put('/me/progress', p).catch(() => null)),
        localProfile ? api.put('/me/profile', localProfile).catch(() => null) : Promise.resolve(),
      ]);
      // Clear local copies now that they live on the server.
      storage.remove(STORAGE_KEYS.notes);
      storage.remove(STORAGE_KEYS.bookmarks);
      storage.remove(STORAGE_KEYS.progress);
    } catch {
      /* best-effort */
    }
  }

  // ── Actions ─────────────────────────────────────────────────────────────────
  const saveProfile = useCallback(
    async (p: UserProfile) => {
      setProfile(p);
      if (authed) await api.put('/me/profile', p).catch(() => null);
      else storage.set(STORAGE_KEYS.profile, p);
    },
    [authed],
  );

  const clearProfile = useCallback(async () => {
    setProfile(null);
    if (!authed) storage.remove(STORAGE_KEYS.profile);
  }, [authed]);

  const addNote = useCallback(
    async (n: Omit<Note, 'id' | 'createdAt'>) => {
      if (authed) {
        const created = await api.post<Note>('/me/notes', n);
        setNotes((cur) => [created, ...cur]);
      } else {
        const note: Note = { ...n, id: uid(), createdAt: new Date().toISOString() };
        setNotes((cur) => {
          const next = [note, ...cur];
          storage.set(STORAGE_KEYS.notes, next);
          return next;
        });
      }
    },
    [authed],
  );

  const deleteNote = useCallback(
    async (id: string) => {
      setNotes((cur) => {
        const next = cur.filter((n) => n.id !== id);
        if (!authed) storage.set(STORAGE_KEYS.notes, next);
        return next;
      });
      if (authed) await api.del(`/me/notes/${id}`).catch(() => null);
    },
    [authed],
  );

  const isBookmarked = useCallback(
    (itemType: string, itemId: string) => bookmarks.some((b) => b.itemType === itemType && b.itemId === itemId),
    [bookmarks],
  );

  const toggleBookmark = useCallback(
    async (b: Bookmark) => {
      const exists = bookmarks.some((x) => x.itemType === b.itemType && x.itemId === b.itemId);
      if (exists) {
        setBookmarks((cur) => {
          const next = cur.filter((x) => !(x.itemType === b.itemType && x.itemId === b.itemId));
          if (!authed) storage.set(STORAGE_KEYS.bookmarks, next);
          return next;
        });
        if (authed) await api.del(`/me/bookmarks/${b.itemType}/${b.itemId}`).catch(() => null);
      } else {
        const entry: Bookmark = { ...b, createdAt: new Date().toISOString() };
        setBookmarks((cur) => {
          const next = [entry, ...cur];
          if (!authed) storage.set(STORAGE_KEYS.bookmarks, next);
          return next;
        });
        if (authed) await api.post('/me/bookmarks', b).catch(() => null);
      }
    },
    [authed, bookmarks],
  );

  const setProgress = useCallback(
    async (p: ProgressEntry) => {
      setProgressState((cur) => {
        const next = { ...cur, [p.lessonId]: p };
        if (!authed) storage.set(STORAGE_KEYS.progress, next);
        return next;
      });
      if (authed) await api.put('/me/progress', p).catch(() => null);
    },
    [authed],
  );

  const getProgress = useCallback((lessonId: string) => progress[lessonId], [progress]);

  // Persist whole local snapshot when profile changes in guest mode (covers edge cases).
  useEffect(() => {
    if (!authed && ready && !loading) persistLocal(profile, notes, bookmarks, progress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const value = useMemo<UserDataCtx>(
    () => ({
      profile, notes, bookmarks, progress, loading,
      saveProfile, clearProfile, addNote, deleteNote, isBookmarked, toggleBookmark, setProgress, getProgress,
    }),
    [profile, notes, bookmarks, progress, loading, saveProfile, clearProfile, addNote, deleteNote, isBookmarked, toggleBookmark, setProgress, getProgress],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUserData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUserData must be used within UserDataProvider');
  return ctx;
}
