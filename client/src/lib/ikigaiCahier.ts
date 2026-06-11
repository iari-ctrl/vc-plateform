/**
 * Local persistence for the Ikigai "cahier d'introspection".
 *
 * Everything here works in guest mode (localStorage) without ever touching the
 * network. Free-text answers are only *sent* anywhere on an explicit save
 * action (see `UserDataContext.addNote` usage in the cahier UI). The previous
 * orientation result is preserved as history when the test is re-taken.
 */
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { IkigaiMode, UserProfile } from '@/content/types';

export const NOTE_SOURCE = 'ikigai-cahier';

/** key = `${mode}-${questionN}` → free-text answer. */
export type CahierAnswers = Record<string, string>;

export interface IkigaiHistoryEntry {
  profileType: string;
  timeBudget?: string;
  scores?: Record<string, number>;
  archetype?: string;
  takenAt: string;
}

export const answerKey = (mode: IkigaiMode, n: string) => `${mode}-${n}`;

// ── Reading level (Découverte / Avancé) default ─────────────────────────────
export function getReadingMode(): IkigaiMode {
  return storage.get<IkigaiMode>(STORAGE_KEYS.ikigaiMode, 'decouverte');
}
export function setReadingMode(mode: IkigaiMode): void {
  storage.set(STORAGE_KEYS.ikigaiMode, mode);
}

// ── Cahier free-text answers ────────────────────────────────────────────────
export function getCahierAnswers(): CahierAnswers {
  return storage.get<CahierAnswers>(STORAGE_KEYS.ikigaiAnswers, {});
}
export function setCahierAnswers(answers: CahierAnswers): void {
  storage.set(STORAGE_KEYS.ikigaiAnswers, answers);
}
/** Number of non-empty answers across both reading modes. */
export function countAnswered(answers: CahierAnswers): number {
  return Object.values(answers).filter((v) => v.trim().length > 0).length;
}

// ── Chosen archetype ────────────────────────────────────────────────────────
export function getChosenArchetype(): string | null {
  return storage.get<string | null>(STORAGE_KEYS.ikigaiArchetype, null);
}
export function setChosenArchetype(id: string | null): void {
  if (id) storage.set(STORAGE_KEYS.ikigaiArchetype, id);
  else storage.remove(STORAGE_KEYS.ikigaiArchetype);
}

// ── Orientation history (kept on retake) ────────────────────────────────────
export function getHistory(): IkigaiHistoryEntry[] {
  return storage.get<IkigaiHistoryEntry[]>(STORAGE_KEYS.ikigaiHistory, []);
}
/** Archive the current saved profile before it is overwritten by a retake. */
export function archiveProfile(profile: UserProfile | null): void {
  if (!profile?.profileType) return;
  const entry: IkigaiHistoryEntry = {
    profileType: profile.profileType,
    timeBudget: profile.timeBudget,
    scores: profile.scores,
    archetype: getChosenArchetype() ?? undefined,
    takenAt: new Date().toISOString(),
  };
  const next = [entry, ...getHistory()].slice(0, 12);
  storage.set(STORAGE_KEYS.ikigaiHistory, next);
}
