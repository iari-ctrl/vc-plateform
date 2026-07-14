import { createContext, useContext } from 'react';
import type { Bookmark, DecisionJournalEntry, DecisionOutcome, Note, ProgressEntry, UserProfile } from '@/content/types';
import type { StorageResult } from '@/lib/storage';

export interface UserDataContextValue {
  profile: UserProfile | null;
  notes: Note[];
  bookmarks: Bookmark[];
  progress: Record<string, ProgressEntry>;
  journal: DecisionJournalEntry[];
  loading: boolean;
  saveProfile: (profile: UserProfile) => Promise<StorageResult>;
  clearProfile: () => Promise<StorageResult>;
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => Promise<StorageResult>;
  deleteNote: (id: string) => Promise<StorageResult>;
  isBookmarked: (itemType: string, itemId: string) => boolean;
  toggleBookmark: (bookmark: Bookmark) => Promise<StorageResult>;
  setProgress: (progress: ProgressEntry) => Promise<StorageResult>;
  getProgress: (lessonId: string) => ProgressEntry | undefined;
  addJournalEntry: (entry: Omit<DecisionJournalEntry, 'id' | 'createdAt' | 'status'>) => Promise<StorageResult>;
  resolveJournalEntry: (id: string, outcome: DecisionOutcome, resolutionNote?: string) => Promise<StorageResult>;
  deleteJournalEntry: (id: string) => Promise<StorageResult>;
}

export const UserDataContext = createContext<UserDataContextValue | null>(null);

export function useUserData() {
  const context = useContext(UserDataContext);
  if (!context) throw new Error('useUserData must be used within UserDataProvider');
  return context;
}
