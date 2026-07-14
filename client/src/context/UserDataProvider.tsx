import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Bookmark, DecisionJournalEntry, DecisionOutcome, Note, ProgressEntry, UserProfile } from '@/content/types';
import { UserDataContext, type UserDataContextValue } from '@/context/UserDataContext';
import { storage, storageErrors, STORAGE_KEYS, type StorageFailure } from '@/lib/storage';

const uid = () => typeof crypto !== 'undefined' && 'randomUUID' in crypto
  ? crypto.randomUUID()
  : `n_${Date.now()}_${Math.random().toString(36).slice(2)}`;

const STORAGE_ERROR_MESSAGE: Record<StorageFailure['reason'], string> = {
  quota: 'L’espace de stockage de cet appareil est plein. La dernière modification n’a pas été enregistrée.',
  unavailable: 'Le stockage local est indisponible. La dernière modification n’a pas été enregistrée.',
  serialization: 'Ces données n’ont pas pu être préparées pour l’enregistrement. La dernière modification n’a pas été enregistrée.',
  unreadable: 'Certaines données enregistrées sur cet appareil sont illisibles. Une valeur par défaut a été utilisée.',
};

function StorageErrorAlert() {
  const error = useSyncExternalStore(storageErrors.subscribe, storageErrors.getSnapshot, storageErrors.getSnapshot);
  if (!error) return null;

  return (
    <div
      role="alert"
      aria-atomic="true"
      className="fixed inset-x-4 bottom-6 z-[90] mx-auto flex max-w-lg items-start gap-3 rounded-2xl border border-[color-mix(in_srgb,var(--error)_35%,transparent)] bg-surface-container-lowest p-4 text-sm shadow-editorial-lg"
    >
      <AlertTriangle size={18} className="mt-0.5 shrink-0 text-error" aria-hidden />
      <p className="min-w-0 flex-1 leading-relaxed">{STORAGE_ERROR_MESSAGE[error.reason]}</p>
      <button
        type="button"
        onClick={storageErrors.clear}
        aria-label="Fermer l’alerte de stockage"
        className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-surface-variant transition-colors hover:bg-surface-container hover:text-foreground"
      >
        <X size={15} aria-hidden />
      </button>
    </div>
  );
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [progress, setProgressState] = useState<Record<string, ProgressEntry>>({});
  const [journal, setJournal] = useState<DecisionJournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const notesRef = useRef(notes);
  const bookmarksRef = useRef(bookmarks);
  const progressRef = useRef(progress);
  const journalRef = useRef(journal);

  const loadLocal = useCallback(() => {
    setProfile(storage.get<UserProfile | null>(STORAGE_KEYS.profile, null));
    const localNotes = storage.get<Note[]>(STORAGE_KEYS.notes, []);
    const localBookmarks = storage.get<Bookmark[]>(STORAGE_KEYS.bookmarks, []);
    const localProgress = storage.get<Record<string, ProgressEntry>>(STORAGE_KEYS.progress, {});
    const localJournal = storage.get<DecisionJournalEntry[]>(STORAGE_KEYS.journal, []);
    notesRef.current = localNotes;
    bookmarksRef.current = localBookmarks;
    progressRef.current = localProgress;
    journalRef.current = localJournal;
    setNotes(localNotes);
    setBookmarks(localBookmarks);
    setProgressState(localProgress);
    setJournal(localJournal);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  const saveProfile = useCallback(async (nextProfile: UserProfile) => {
    const result = storage.set(STORAGE_KEYS.profile, nextProfile);
    if (result.ok) setProfile(nextProfile);
    return result;
  }, []);

  const clearProfile = useCallback(async () => {
    const result = storage.remove(STORAGE_KEYS.profile);
    if (result.ok) setProfile(null);
    return result;
  }, []);

  const addNote = useCallback(async (newNote: Omit<Note, 'id' | 'createdAt'>) => {
    const note: Note = { ...newNote, id: uid(), createdAt: new Date().toISOString() };
    const next = [note, ...notesRef.current];
    const result = storage.set(STORAGE_KEYS.notes, next);
    if (result.ok) {
      notesRef.current = next;
      setNotes(next);
    }
    return result;
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    const next = notesRef.current.filter((note) => note.id !== id);
    const result = storage.set(STORAGE_KEYS.notes, next);
    if (result.ok) {
      notesRef.current = next;
      setNotes(next);
    }
    return result;
  }, []);

  const isBookmarked = useCallback(
    (itemType: string, itemId: string) => bookmarks.some((bookmark) => bookmark.itemType === itemType && bookmark.itemId === itemId),
    [bookmarks],
  );

  const toggleBookmark = useCallback(async (bookmark: Bookmark) => {
    const exists = bookmarksRef.current.some((current) => current.itemType === bookmark.itemType && current.itemId === bookmark.itemId);
    const next = exists
      ? bookmarksRef.current.filter((item) => !(item.itemType === bookmark.itemType && item.itemId === bookmark.itemId))
      : [{ ...bookmark, createdAt: new Date().toISOString() }, ...bookmarksRef.current];
    const result = storage.set(STORAGE_KEYS.bookmarks, next);
    if (result.ok) {
      bookmarksRef.current = next;
      setBookmarks(next);
    }
    return result;
  }, []);

  const setProgress = useCallback(async (entry: ProgressEntry) => {
    const next = { ...progressRef.current, [entry.lessonId]: entry };
    const result = storage.set(STORAGE_KEYS.progress, next);
    if (result.ok) {
      progressRef.current = next;
      setProgressState(next);
    }
    return result;
  }, []);

  const getProgress = useCallback((lessonId: string) => progress[lessonId], [progress]);

  const addJournalEntry = useCallback(async (newEntry: Omit<DecisionJournalEntry, 'id' | 'createdAt' | 'status'>) => {
    const entry: DecisionJournalEntry = {
      ...newEntry,
      id: uid(),
      createdAt: new Date().toISOString(),
      status: 'open',
    };
    const next = [entry, ...journalRef.current];
    const result = storage.set(STORAGE_KEYS.journal, next);
    if (result.ok) {
      journalRef.current = next;
      setJournal(next);
    }
    return result;
  }, []);

  const resolveJournalEntry = useCallback(async (id: string, outcome: DecisionOutcome, resolutionNote?: string) => {
    const resolvedAt = new Date().toISOString();
    const next = journalRef.current.map((entry) => entry.id === id
      ? { ...entry, status: 'resolved' as const, outcome, resolutionNote, resolvedAt }
      : entry);
    const result = storage.set(STORAGE_KEYS.journal, next);
    if (result.ok) {
      journalRef.current = next;
      setJournal(next);
    }
    return result;
  }, []);

  const deleteJournalEntry = useCallback(async (id: string) => {
    const next = journalRef.current.filter((entry) => entry.id !== id);
    const result = storage.set(STORAGE_KEYS.journal, next);
    if (result.ok) {
      journalRef.current = next;
      setJournal(next);
    }
    return result;
  }, []);

  const value = useMemo<UserDataContextValue>(
    () => ({
      profile,
      notes,
      bookmarks,
      progress,
      journal,
      loading,
      saveProfile,
      clearProfile,
      addNote,
      deleteNote,
      isBookmarked,
      toggleBookmark,
      setProgress,
      getProgress,
      addJournalEntry,
      resolveJournalEntry,
      deleteJournalEntry,
    }),
    [profile, notes, bookmarks, progress, journal, loading, saveProfile, clearProfile, addNote, deleteNote, isBookmarked, toggleBookmark, setProgress, getProgress, addJournalEntry, resolveJournalEntry, deleteJournalEntry],
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
      <StorageErrorAlert />
    </UserDataContext.Provider>
  );
}
