export type InternalFurtherReadingKind = 'lesson' | 'simulator' | 'case' | 'glossary' | 'course' | 'deliverable';
export type FurtherReadingKind = InternalFurtherReadingKind | 'external';

export interface FurtherReadingTarget {
  id: string;
  slug: string;
}

export type FurtherReadingTargetRecordsByKind = Record<InternalFurtherReadingKind, readonly FurtherReadingTarget[]>;
export type FurtherReadingTargetRegistry = Record<InternalFurtherReadingKind, ReadonlyMap<string, FurtherReadingTarget>>;

export const INTERNAL_FURTHER_READING_KINDS: readonly InternalFurtherReadingKind[];
export const FURTHER_READING_KINDS: readonly FurtherReadingKind[];

export function isInternalFurtherReadingKind(kind: string): kind is InternalFurtherReadingKind;
export function createFurtherReadingTargetRegistry(
  targetRecordsByKind: FurtherReadingTargetRecordsByKind,
): FurtherReadingTargetRegistry;
export function resolveFurtherReadingTarget(
  registry: FurtherReadingTargetRegistry,
  kind: string,
  ref: string,
): FurtherReadingTarget | undefined;
export function resolveFurtherReadingHref(
  registry: FurtherReadingTargetRegistry,
  kind: string,
  ref: string,
): string | undefined;
