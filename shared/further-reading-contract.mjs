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

export function assertExactFurtherReadingTargetKinds(targetRecordsByKind) {
  const actualKeys = Object.entries(targetRecordsByKind ?? {})
    .filter(([, records]) => records !== undefined)
    .map(([kind]) => kind);
  const missing = INTERNAL_FURTHER_READING_KINDS.filter((kind) => targetRecordsByKind?.[kind] === undefined);
  const unexpected = actualKeys.filter((kind) => !INTERNAL_KIND_SET.has(kind));

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
    new Map((targetRecordsByKind[kind] ?? []).map((record) => [record.id, record])),
  ]));
}

export function resolveFurtherReadingTarget(registry, kind, ref) {
  if (!isInternalFurtherReadingKind(kind)) return undefined;
  return registry[kind]?.get(ref);
}

export function resolveInternalFurtherReadingHref(registry, kind, ref) {
  const target = resolveFurtherReadingTarget(registry, kind, ref);
  if (!target) return undefined;
  return `${ROUTE_PREFIX_BY_KIND[kind]}${target.slug}`;
}
