import { safeEditorialUrl } from '../shared/editorial-url.mjs';

function recordId(record, index) {
  return record?.id ?? record?.slug ?? `#${index + 1}`;
}

export function collectPublicationErrors(records, { collection, statuses }) {
  const allowed = new Set(statuses);
  const errors = [];
  records.forEach((record, index) => {
    const id = recordId(record, index);
    if (typeof record?.status !== 'string' || !record.status) {
      errors.push(`${collection} ${id}: status is required.`);
    } else if (!allowed.has(record.status)) {
      errors.push(`${collection} ${id}: unsupported status "${record.status}".`);
    }
  });
  return errors;
}

export function findDuplicateErrors(records, { collection, key }) {
  const seen = new Set();
  const reported = new Set();
  const errors = [];
  for (const record of records) {
    const value = key(record);
    if (value == null || value === '') continue;
    if (seen.has(value) && !reported.has(value)) {
      errors.push(`${collection}: duplicate key "${value}".`);
      reported.add(value);
    }
    seen.add(value);
  }
  return errors;
}

const EDITORIAL_TONE_DENYLIST = [
  { pattern: /sans bullshit/iu, label: 'sans bullshit' },
  { pattern: /bingeables?/iu, label: 'bingeable' },
  { pattern: /(?:doivent|vont) mourir/iu, label: 'doivent/vont mourir' },
  { pattern: /erreurs? mortelles?/iu, label: 'erreur(s) mortelle(s)' },
  { pattern: /tuer (?:votre|une|la) levée/iu, label: 'tuer … levée' },
  { pattern: /secrets? pour/iu, label: 'secret(s) pour' },
];

export function findEditorialToneErrors(records, { collection, fields }) {
  const errors = [];
  records.forEach((record, index) => {
    const id = recordId(record, index);
    const stringFields = fields
      ? fields.flatMap((field) => (typeof record?.[field] === 'string' ? [[field, record[field]]] : []))
      : collectStringFields(record);
    for (const [field, value] of stringFields) {
      for (const { pattern, label } of EDITORIAL_TONE_DENYLIST) {
        if (pattern.test(value)) {
          errors.push(`${collection} ${id}.${field}: formulation éditoriale proscrite « ${label} ».`);
        }
      }
    }
  });
  return errors;
}

const MARKDOWN_LINK_PATTERN = /!?\[[^\]]*\]\(\s*(?:<([^>]+)>|([^\s)]+))/gu;

function collectStringFields(value, path = '', output = []) {
  if (typeof value === 'string') {
    output.push([path, value]);
    return output;
  }
  if (Array.isArray(value)) {
    value.forEach((entry, index) => collectStringFields(entry, `${path}[${index}]`, output));
    return output;
  }
  if (value && typeof value === 'object') {
    for (const [key, entry] of Object.entries(value)) {
      collectStringFields(entry, path ? `${path}.${key}` : key, output);
    }
  }
  return output;
}

export function findMarkdownLinkErrors(records, { collection, fields }) {
  const errors = [];
  records.forEach((record, index) => {
    const id = recordId(record, index);
    const stringFields = fields
      ? fields.flatMap((field) => (typeof record?.[field] === 'string' ? [[field, record[field]]] : []))
      : collectStringFields(record);
    for (const [field, value] of stringFields) {
      for (const match of value.matchAll(MARKDOWN_LINK_PATTERN)) {
        const destination = match[1] ?? match[2];
        if (!safeEditorialUrl(destination, { allowInternal: true, allowFragment: true })) {
          errors.push(`${collection} ${id}.${field}: lien éditorial non sûr « ${destination} ».`);
        }
      }
    }
  });
  return errors;
}

export function findReferenceErrors(records, { collection, refsFor, validIds, reference }) {
  const errors = [];
  records.forEach((record, index) => {
    const id = recordId(record, index);
    for (const ref of refsFor(record) ?? []) {
      if (!validIds.has(ref)) errors.push(`${collection} ${id}: unknown ${reference} "${ref}".`);
    }
  });
  return errors;
}

export function findCycleErrors(records, { collection, idOf, dependenciesOf }) {
  const graph = new Map(records.map((record) => [idOf(record), dependenciesOf(record) ?? []]));
  const state = new Map();
  const stack = [];
  const reported = new Set();
  const errors = [];

  function visit(id) {
    if (!graph.has(id)) return;
    if (state.get(id) === 'done') return;
    if (state.get(id) === 'visiting') return;

    state.set(id, 'visiting');
    stack.push(id);
    for (const dependency of graph.get(id)) {
      if (!graph.has(dependency)) continue;
      if (state.get(dependency) === 'visiting') {
        const start = stack.indexOf(dependency);
        const cycle = [...stack.slice(start), dependency];
        const members = [...new Set(cycle.slice(0, -1))].sort().join('|');
        if (!reported.has(members)) {
          errors.push(`${collection}: cycle detected (${cycle.join(' -> ')}).`);
          reported.add(members);
        }
      } else {
        visit(dependency);
      }
    }
    stack.pop();
    state.set(id, 'done');
  }

  for (const id of graph.keys()) visit(id);
  return errors;
}

export function shouldFailValidation({ errors, warnings, strict }) {
  return errors.length > 0 || (strict && warnings.length > 0);
}

export function validateAssessmentPublication(assessments) {
  return collectPublicationErrors(assessments, {
    collection: 'certificationAssessments',
    statuses: ['draft', 'published'],
  });
}

export function validateCanonicalGlossaryPublication(canonical, glossary) {
  const errors = [];
  const bySlug = new Map(canonical.map((entry) => [entry.slug, entry]));

  for (const entry of canonical) {
    if (entry.status === 'applied' && entry.sourceStatus === 'unsourced') {
      errors.push(`canonical glossary ${entry.slug}: applied entries cannot remain unsourced.`);
    }
    if (entry.sourceStatus === 'source-backed' && Array.isArray(entry.sourceUrls) && entry.sourceUrls.length === 0) {
      errors.push(`canonical glossary ${entry.slug}: declared sourceUrls must contain at least one HTTPS source URL.`);
    }
    for (const sourceUrl of entry.sourceUrls ?? []) {
      if (!safeEditorialUrl(sourceUrl)) {
        errors.push(`canonical glossary ${entry.slug}: source URL must use HTTPS (${sourceUrl}).`);
      }
    }
  }

  for (const entry of glossary) {
    const canonicalEntry = bySlug.get(entry.slug);
    if (!canonicalEntry) {
      errors.push(`published glossary ${entry.slug}: missing canonical entry.`);
      continue;
    }
    if (canonicalEntry.status !== 'applied') {
      errors.push(`published glossary ${entry.slug}: canonical status must be applied.`);
    }
  }

  return errors;
}
