import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import type { Bookmark, DecisionJournalEntry, DecisionOutcome, Note, ProgressEntry, UserProfile } from '@/content/types';
import { UserDataContext, type UserDataContextValue } from '@/context/UserDataContext';
import { commitOnStorageSuccess, STORAGE_PREFIX, storage, storageErrors, type StorageFailure } from '@/lib/storage';
import { STORAGE_CONTRACTS } from '@/lib/storageDomains';

const uid = () => typeof crypto !== 'undefined' && 'randomUUID' in crypto
  ? crypto.randomUUID()
  : `n_${Date.now()}_${Math.random().toString(36).slice(2)}`;

const STORAGE_ERROR_MESSAGE: Record<StorageFailure['reason'], string> = {
  quota: 'L’espace de stockage de cet appareil est plein. La dernière modification n’a pas été enregistrée.',
  unavailable: 'Le stockage local est indisponible. La dernière modification n’a pas été enregistrée.',
  serialization: 'Ces données n’ont pas pu être préparées pour l’enregistrement. La dernière modification n’a pas été enregistrée.',
  unreadable: 'Certaines données enregistrées sur cet appareil sont illisibles. Une valeur par défaut a été utilisée.',
  validation: 'Certaines données enregistrées sur cet appareil sont incompatibles. Elles ont été ignorées sans être supprimées.',
  version: 'Certaines données proviennent d’une version non prise en charge. Elles ont été conservées sans être chargées.',
  limit: 'La limite locale de taille ou de nombre d’éléments est atteinte. La dernière modification n’a pas été enregistrée.',
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
    setProfile(storage.getParsed(STORAGE_CONTRACTS.profile));
    const localNotes = storage.getParsed(STORAGE_CONTRACTS.notes);
    const localBookmarks = storage.getParsed(STORAGE_CONTRACTS.bookmarks);
    const localProgress = storage.getParsed(STORAGE_CONTRACTS.progress);
    const localJournal = storage.getParsed(STORAGE_CONTRACTS.journal);
    notesRef.current = localNotes;
    bookmarksRef.current = localBookmarks;
    progressRef.current = localProgress;
    journalRef.current = localJournal;
    setNotes(localNotes);
    setBookmarks(localBookmarks);
    setProgressState(localProgress);
    setJournal(localJournal);
    setLoading(false);

    storage.migrate(STORAGE_CONTRACTS.profile);
    storage.migrate(STORAGE_CONTRACTS.notes);
    storage.migrate(STORAGE_CONTRACTS.bookmarks);
    storage.migrate(STORAGE_CONTRACTS.progress);
    storage.migrate(STORAGE_CONTRACTS.journal);
  }, []);

  const reloadLocalData = useCallback(() => {
    loadLocal();
  }, [loadLocal]);

  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  useEffect(() => {
    function handleStorageEvent(event: StorageEvent) {
      switch (event.key) {
        case `${STORAGE_PREFIX}${STORAGE_CONTRACTS.profile.key}`:
          setProfile(storage.parseStored(STORAGE_CONTRACTS.profile, event.newValue));
          break;
        case `${STORAGE_PREFIX}${STORAGE_CONTRACTS.notes.key}`: {
          const next = storage.parseStored(STORAGE_CONTRACTS.notes, event.newValue);
          notesRef.current = next;
          setNotes(next);
          break;
        }
        case `${STORAGE_PREFIX}${STORAGE_CONTRACTS.bookmarks.key}`: {
          const next = storage.parseStored(STORAGE_CONTRACTS.bookmarks, event.newValue);
          bookmarksRef.current = next;
          setBookmarks(next);
          break;
        }
        case `${STORAGE_PREFIX}${STORAGE_CONTRACTS.progress.key}`: {
          const next = storage.parseStored(STORAGE_CONTRACTS.progress, event.newValue);
          progressRef.current = next;
          setProgressState(next);
          break;
        }
        case `${STORAGE_PREFIX}${STORAGE_CONTRACTS.journal.key}`: {
          const next = storage.parseStored(STORAGE_CONTRACTS.journal, event.newValue);
          journalRef.current = next;
          setJournal(next);
          break;
        }
        default:
          break;
      }
    }

    window.addEventListener('storage', handleStorageEvent);
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, []);

  const saveProfile = useCallback(async (nextProfile: UserProfile) => {
    const result = storage.setParsed(STORAGE_CONTRACTS.profile, nextProfile);
    return commitOnStorageSuccess(result, nextProfile, setProfile);
  }, []);

  const clearProfile = useCallback(async () => {
    const result = storage.remove(STORAGE_CONTRACTS.profile.key);
    return commitOnStorageSuccess(result, null, setProfile);
  }, []);

  const addNote = useCallback(async (newNote: Omit<Note, 'id' | 'createdAt'>) => {
    const note: Note = { ...newNote, id: uid(), createdAt: new Date().toISOString() };
    const next = [note, ...notesRef.current];
    const result = storage.setParsed(STORAGE_CONTRACTS.notes, next);
    return commitOnStorageSuccess(result, next, (stored) => {
      notesRef.current = stored;
      setNotes(stored);
    });
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    const next = notesRef.current.filter((note) => note.id !== id);
    const result = storage.setParsed(STORAGE_CONTRACTS.notes, next);
    return commitOnStorageSuccess(result, next, (stored) => {
      notesRef.current = stored;
      setNotes(stored);
    });
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
    const result = storage.setParsed(STORAGE_CONTRACTS.bookmarks, next);
    return commitOnStorageSuccess(result, next, (stored) => {
      bookmarksRef.current = stored;
      setBookmarks(stored);
    });
  }, []);

  const setProgress = useCallback(async (entry: ProgressEntry) => {
    const next = { ...progressRef.current, [entry.lessonId]: entry };
    const result = storage.setParsed(STORAGE_CONTRACTS.progress, next);
    return commitOnStorageSuccess(result, next, (stored) => {
      progressRef.current = stored;
      setProgressState(stored);
    });
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
    const result = storage.setParsed(STORAGE_CONTRACTS.journal, next);
    return commitOnStorageSuccess(result, next, (stored) => {
      journalRef.current = stored;
      setJournal(stored);
    });
  }, []);

  const resolveJournalEntry = useCallback(async (id: string, outcome: DecisionOutcome, resolutionNote?: string) => {
    const resolvedAt = new Date().toISOString();
    const next = journalRef.current.map((entry) => entry.id === id
      ? { ...entry, status: 'resolved' as const, outcome, resolutionNote, resolvedAt }
      : entry);
    const result = storage.setParsed(STORAGE_CONTRACTS.journal, next);
    return commitOnStorageSuccess(result, next, (stored) => {
      journalRef.current = stored;
      setJournal(stored);
    });
  }, []);

  const deleteJournalEntry = useCallback(async (id: string) => {
    const next = journalRef.current.filter((entry) => entry.id !== id);
    const result = storage.setParsed(STORAGE_CONTRACTS.journal, next);
    return commitOnStorageSuccess(result, next, (stored) => {
      journalRef.current = stored;
      setJournal(stored);
    });
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
      reloadLocalData,
      addJournalEntry,
      resolveJournalEntry,
      deleteJournalEntry,
    }),
    [profile, notes, bookmarks, progress, journal, loading, saveProfile, clearProfile, addNote, deleteNote, isBookmarked, toggleBookmark, setProgress, getProgress, reloadLocalData, addJournalEntry, resolveJournalEntry, deleteJournalEntry],
  );

  return (
    <UserDataContext.Provider value={value}>
      {children}
      <StorageErrorAlert />
    </UserDataContext.Provider>
  );
}
