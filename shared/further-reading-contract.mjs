import { safeEditorialUrl } from './editorial-url.mjs';

export const INTERNAL_FURTHER_READING_KINDS = Object.freeze([
  'lesson',
  'simulator',
  'case',
  'glossary',
  'course',
  'deliverable',
]);

export const FURTHER_READING_KINDS = Object.freeze([
  ...INTERNAL_FURTHER_READING_KINDS,
  'external',
]);

const INTERNAL_KIND_SET = new Set(INTERNAL_FURTHER_READING_KINDS);

const ROUTE_PREFIX_BY_KIND = Object.freeze({
  lesson: '/lessons/',
  simulator: '/simulators/',
  case: '/cases/',
  glossary: '/glossary?term=',
  course: '/courses/',
  deliverable: '/livrables/',
});

export function isInternalFurtherReadingKind(kind) {
  return INTERNAL_KIND_SET.has(kind);
}

function assertExactFurtherReadingTargetKinds(targetRecordsByKind) {
  const missing = INTERNAL_FURTHER_READING_KINDS.filter((kind) => targetRecordsByKind?.[kind] === undefined);
  const unexpected = Object.keys(targetRecordsByKind ?? {}).filter((kind) => !INTERNAL_KIND_SET.has(kind));

  if (missing.length || unexpected.length) {
    throw new Error([
      'registre furtherReading incomplet',
      missing.length ? `manquant : ${missing.join(', ')}` : '',
      unexpected.length ? `inattendu : ${unexpected.join(', ')}` : '',
    ].filter(Boolean).join(' ; '));
  }
}

export function createFurtherReadingTargetRegistry(targetRecordsByKind) {
  assertExactFurtherReadingTargetKinds(targetRecordsByKind);

  return Object.fromEntries(INTERNAL_FURTHER_READING_KINDS.map((kind) => [
    kind,
    new Map(targetRecordsByKind[kind].map((record) => [record.id, record])),
  ]));
}

export function resolveFurtherReadingTarget(registry, kind, ref) {
  if (!isInternalFurtherReadingKind(kind)) return undefined;
  return registry[kind]?.get(ref);
}

/** Resolve any furtherReading kind — internal ids become public routes, external refs stay HTTPS-only. */
export function resolveFurtherReadingHref(registry, kind, ref) {
  if (kind === 'external') return safeEditorialUrl(ref);
  const target = resolveFurtherReadingTarget(registry, kind, ref);
  if (!target) return undefined;
  return `${ROUTE_PREFIX_BY_KIND[kind]}${target.slug}`;
}
