import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

import { safeEditorialUrl } from '../shared/editorial-url.mjs';
import { isPublishedContent } from '../shared/publication.mjs';
import {
  collectPublicationErrors,
  findCycleErrors,
  findDuplicateErrors,
  findEditorialToneErrors,
  findMarkdownLinkErrors,
  findReferenceErrors,
  shouldFailValidation,
  validateAssessmentPublication,
  validateCanonicalGlossaryPublication,
} from './validation-core.mjs';

test('publication is fail-closed when status is absent or invalid', () => {
  const errors = collectPublicationErrors(
    [
      { id: 'missing' },
      { id: 'draft', status: 'draft' },
      { id: 'published', status: 'published' },
      { id: 'invalid', status: 'public' },
    ],
    { collection: 'lessons', statuses: ['draft', 'published', 'upcoming'] },
  );

  assert.deepEqual(errors, [
    'lessons missing: status is required.',
    'lessons invalid: unsupported status "public".',
  ]);
  assert.equal(isPublishedContent({ id: 'missing' }), false);
  assert.equal(isPublishedContent({ id: 'draft', status: 'draft' }), false);
  assert.equal(isPublishedContent({ id: 'published', status: 'published' }), true);
});

test('pure duplicate, reference and cycle checks report invalid fixtures', () => {
  assert.deepEqual(
    findDuplicateErrors(
      [{ id: 'one' }, { id: 'one' }],
      { collection: 'lessons', key: (entry) => entry.id },
    ),
    ['lessons: duplicate key "one".'],
  );

  assert.deepEqual(
    findReferenceErrors(
      [{ id: 'lesson-1', courseIds: ['course-1', 'missing-course'] }],
      {
        collection: 'lessons',
        refsFor: (entry) => entry.courseIds,
        validIds: new Set(['course-1']),
        reference: 'course',
      },
    ),
    ['lessons lesson-1: unknown course "missing-course".'],
  );

  assert.deepEqual(
    findCycleErrors(
      [
        { id: 'a', dependencies: ['b'] },
        { id: 'b', dependencies: ['a'] },
      ],
      {
        collection: 'lessons',
        idOf: (entry) => entry.id,
        dependenciesOf: (entry) => entry.dependencies,
      },
    ),
    ['lessons: cycle detected (a -> b -> a).'],
  );
});

test('strict mode promotes warnings to a failing validation result', () => {
  assert.equal(shouldFailValidation({ errors: [], warnings: ['warning'], strict: false }), false);
  assert.equal(shouldFailValidation({ errors: [], warnings: ['warning'], strict: true }), true);
  assert.equal(shouldFailValidation({ errors: ['error'], warnings: [], strict: false }), true);
});

test('editorial tone validation rejects the explicit S6 denylist', () => {
  assert.deepEqual(
    findEditorialToneErrors(
      [
        { id: 'course-1', title: 'Le VC sans bullshit', summary: 'Sept épisodes bingeables' },
        { id: 'course-2', title: 'Comprendre le capital-risque', summary: 'Un parcours introductif.' },
      ],
      { collection: 'courses', fields: ['title', 'summary'] },
    ),
    [
      'courses course-1.title: formulation éditoriale proscrite « sans bullshit ».',
      'courses course-1.summary: formulation éditoriale proscrite « bingeable ».',
    ],
  );

  assert.deepEqual(
    findEditorialToneErrors(
      [{ id: 'parcours-1', sequences: [{ label: '9 startups sur 10 vont mourir' }] }],
      { collection: 'parcours' },
    ),
    ['parcours parcours-1.sequences[0].label: formulation éditoriale proscrite « doivent/vont mourir ».'],
  );
});

test('editorial URL policy accepts HTTPS and only explicit internal exceptions', () => {
  assert.equal(safeEditorialUrl('https://example.com/source'), 'https://example.com/source');
  assert.equal(safeEditorialUrl('http://example.com/source'), undefined);
  assert.equal(safeEditorialUrl('mailto:editor@example.com'), undefined);
  assert.equal(safeEditorialUrl('javascript:alert(1)'), undefined);
  assert.equal(safeEditorialUrl('https://user:password@example.com/source'), undefined);
  assert.equal(safeEditorialUrl('https://example.com/white space'), undefined);
  assert.equal(safeEditorialUrl('https://example.com/line\nbreak'), undefined);
  assert.equal(safeEditorialUrl('https://example.com\\backslash'), undefined);
  assert.equal(safeEditorialUrl('/cases/example'), undefined);
  assert.equal(safeEditorialUrl('/cases/example', { allowInternal: true }), '/cases/example');
  assert.equal(safeEditorialUrl('#section', { allowFragment: true }), '#section');
  assert.equal(safeEditorialUrl('//example.com/source', { allowInternal: true }), undefined);
});

test('memo source URLs are schema-gated and sanitized again at render time', () => {
  const validatorSource = readFileSync(new URL('./validate-content.mjs', import.meta.url), 'utf8');
  const memoPageSource = readFileSync(new URL('../client/src/pages/intelligence/MemoPage.tsx', import.meta.url), 'utf8');

  assert.match(validatorSource, /sourceUrl:\s*httpsUrl/);
  assert.match(memoPageSource, /safeHttpUrl\(memo\.sourceUrl\)/);
});

test('markdown link validation rejects unsafe external protocols', () => {
  assert.deepEqual(
    findMarkdownLinkErrors(
      [{
        id: 'lesson-1',
        body: '[Source](http://example.com) [Interne](/cases/example) [Section](#section) [Sûre](https://example.com)',
      }],
      { collection: 'lessons', fields: ['body'] },
    ),
    ['lessons lesson-1.body: lien éditorial non sûr « http://example.com ».'],
  );
});

test('assessment definitions require an explicit publication status', () => {
  assert.deepEqual(
    validateAssessmentPublication([
      { id: 'missing' },
      { id: 'draft', status: 'draft' },
      { id: 'published', status: 'published' },
      { id: 'inactive', status: 'inactive' },
    ]),
    [
      'certificationAssessments missing: status is required.',
      'certificationAssessments inactive: unsupported status "inactive".',
    ],
  );
});

test('canonical glossary rejects applied unsourced rows and publication drift', () => {
  const errors = validateCanonicalGlossaryPublication(
    [
      { slug: 'unsourced', status: 'applied', sourceStatus: 'unsourced' },
      { slug: 'source-backed-without-url', status: 'applied', sourceStatus: 'source-backed', sourceUrls: [] },
      { slug: 'review', status: 'needs-review', sourceStatus: 'source-backed' },
      { slug: 'valid', status: 'applied', sourceStatus: 'source-backed', sourceUrls: ['https://example.com/valid'] },
    ],
    [
      { slug: 'review' },
      { slug: 'valid' },
      { slug: 'missing-register' },
    ],
  );

  assert.deepEqual(errors, [
    'canonical glossary unsourced: applied entries cannot remain unsourced.',
    'canonical glossary source-backed-without-url: declared sourceUrls must contain at least one HTTPS source URL.',
    'published glossary review: canonical status must be applied.',
    'published glossary missing-register: missing canonical entry.',
  ]);
});

test('audited glossary source decisions keep broad legal concepts distinct', () => {
  const canonical = JSON.parse(
    readFileSync(new URL('../data/sources/canonical-glossary.json', import.meta.url), 'utf8'),
  );
  const glossary = JSON.parse(readFileSync(new URL('../data/glossary.json', import.meta.url), 'utf8'));
  const canonicalBySlug = new Map(canonical.map((entry) => [entry.slug, entry]));
  const glossaryBySlug = new Map(glossary.map((entry) => [entry.slug, entry]));

  assert.deepEqual(canonicalBySlug.get('portfolio-approach')?.sourceUrls, [
    'https://ilpa.org/resources-tools/resource-library/due-diligence-questionnaire/',
  ]);
  assert.deepEqual(canonicalBySlug.get('audit-committee')?.sourceUrls, [
    'https://www.sec.gov/newsroom/speeches-statements/statement-role-audit-committees-financial-reporting',
    'https://www.sec.gov/rules-regulations/2003/04/standards-relating-listed-company-audit-committees',
  ]);

  for (const [slug, publishedSlug, incorrectAlias] of [
    ['dividend-rights', 'dividendes-cumulatifs', 'Dividend Rights'],
    ['voting-rights', 'protective-provisions', 'Voting Rights'],
    ['subscription-price', 'pre-money', 'Subscription Price'],
  ]) {
    assert.equal(canonicalBySlug.get(slug)?.status, 'needs-review');
    assert.equal(canonicalBySlug.get(slug)?.action, 'add');
    assert.equal(glossaryBySlug.get(publishedSlug)?.aliases?.includes(incorrectAlias), false);
  }
});
