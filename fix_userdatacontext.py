import re

with open('client/src/context/UserDataContext.tsx', 'r') as f:
    content = f.read()

# Remove imports
content = re.sub(r"import \{ api \} from '@/lib/api';\n", "", content)
content = re.sub(r"import \{ useAuth \} from './AuthContext';\n", "", content)

# Instead of patching, let's just rewrite the whole thing.
new_content = """import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { Bookmark, DecisionJournalEntry, DecisionOutcome, Note, ProgressEntry, UserProfile } from '@/content/types';

interface UserDataCtx {
  profile: UserProfile | null;
  notes: Note[];
  bookmarks: Bookmark[];
  progress: Record<string, ProgressEntry>;
  journal: DecisionJournalEntry[];
  loading: boolean;
  saveProfile: (p: UserProfile) => Promise<void>;
  clearProfile: () => Promise<void>;
  addNote: (n: Omit<Note, 'id' | 'createdAt'>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  isBookmarked: (itemType: string, itemId: string) => boolean;
  toggleBookmark: (b: Bookmark) => Promise<void>;
  setProgress: (p: ProgressEntry) => Promise<void>;
  getProgress: (lessonId: string) => ProgressEntry | undefined;
  addJournalEntry: (e: Omit<DecisionJournalEntry, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  resolveJournalEntry: (id: string, outcome: DecisionOutcome, resolutionNote?: string) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
}

const Ctx = createContext<UserDataCtx | null>(null);

const uid = () => typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `n_${Date.now()}_${Math.random().toString(36).slice(2)}`;

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [progress, setProgressState] = useState<Record<string, ProgressEntry>>({});
  const [journal, setJournal] = useState<DecisionJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLocal = useCallback(() => {
    setProfile(storage.get<UserProfile | null>(STORAGE_KEYS.profile, null));
    setNotes(storage.get<Note[]>(STORAGE_KEYS.notes, []));
    setBookmarks(storage.get<Bookmark[]>(STORAGE_KEYS.bookmarks, []));
    setProgressState(storage.get<Record<string, ProgressEntry>>(STORAGE_KEYS.progress, {}));
    setJournal(storage.get<DecisionJournalEntry[]>(STORAGE_KEYS.journal, []));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  const saveProfile = useCallback(async (p: UserProfile) => {
    setProfile(p);
    storage.set(STORAGE_KEYS.profile, p);
  }, []);

  const clearProfile = useCallback(async () => {
    setProfile(null);
    storage.remove(STORAGE_KEYS.profile);
  }, []);

  const addNote = useCallback(async (n: Omit<Note, 'id' | 'createdAt'>) => {
    const note: Note = { ...n, id: uid(), createdAt: new Date().toISOString() };
    setNotes((cur) => {
      const next = [note, ...cur];
      storage.set(STORAGE_KEYS.notes, next);
      return next;
    });
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setNotes((cur) => {
      const next = cur.filter((n) => n.id !== id);
      storage.set(STORAGE_KEYS.notes, next);
      return next;
    });
  }, []);

  const isBookmarked = useCallback((itemType: string, itemId: string) => bookmarks.some((b) => b.itemType === itemType && b.itemId === itemId), [bookmarks]);

  const toggleBookmark = useCallback(async (b: Bookmark) => {
    const exists = bookmarks.some((x) => x.itemType === b.itemType && x.itemId === b.itemId);
    if (exists) {
      setBookmarks((cur) => {
        const next = cur.filter((x) => !(x.itemType === b.itemType && x.itemId === b.itemId));
        storage.set(STORAGE_KEYS.bookmarks, next);
        return next;
      });
    } else {
      const entry: Bookmark = { ...b, createdAt: new Date().toISOString() };
      setBookmarks((cur) => {
        const next = [entry, ...cur];
        storage.set(STORAGE_KEYS.bookmarks, next);
        return next;
      });
    }
  }, [bookmarks]);

  const setProgress = useCallback(async (p: ProgressEntry) => {
    setProgressState((cur) => {
      const next = { ...cur, [p.lessonId]: p };
      storage.set(STORAGE_KEYS.progress, next);
      return next;
    });
  }, []);

  const getProgress = useCallback((lessonId: string) => progress[lessonId], [progress]);

  const addJournalEntry = useCallback(async (e: Omit<DecisionJournalEntry, 'id' | 'createdAt' | 'status'>) => {
    const entry: DecisionJournalEntry = { ...e, id: uid(), createdAt: new Date().toISOString(), status: 'open' };
    setJournal((cur) => {
      const next = [entry, ...cur];
      storage.set(STORAGE_KEYS.journal, next);
      return next;
    });
  }, []);

  const resolveJournalEntry = useCallback(async (id: string, outcome: DecisionOutcome, resolutionNote?: string) => {
    const resolvedAt = new Date().toISOString();
    setJournal((cur) => {
      const next = cur.map((e) => e.id === id ? { ...e, status: 'resolved' as const, outcome, resolutionNote, resolvedAt } : e);
      storage.set(STORAGE_KEYS.journal, next);
      return next;
    });
  }, []);

  const deleteJournalEntry = useCallback(async (id: string) => {
    setJournal((cur) => {
      const next = cur.filter((e) => e.id !== id);
      storage.set(STORAGE_KEYS.journal, next);
      return next;
    });
  }, []);

  const value = useMemo<UserDataCtx>(
    () => ({
      profile, notes, bookmarks, progress, journal, loading,
      saveProfile, clearProfile, addNote, deleteNote, isBookmarked, toggleBookmark, setProgress, getProgress,
      addJournalEntry, resolveJournalEntry, deleteJournalEntry,
    }),
    [profile, notes, bookmarks, progress, journal, loading, saveProfile, clearProfile, addNote, deleteNote, isBookmarked, toggleBookmark, setProgress, getProgress, addJournalEntry, resolveJournalEntry, deleteJournalEntry],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUserData() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useUserData must be used within UserDataProvider');
  return ctx;
}
"""

with open('client/src/context/UserDataContext.tsx', 'w') as f:
    f.write(new_content)
