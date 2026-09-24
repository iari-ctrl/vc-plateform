import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

import { diagnoseFormation } from './formation-readiness.mjs';

const lesson = (id, extra = {}) => ({
  id, slug: `${id}-slug`, courseId: 'c-one', order: 1,
  status: 'published', readMin: 5, prerequisiteLessonIds: [], ...extra,
});
const step = (kind, id, extra = {}) => ({
  order: 1, type: 'coeur', status: 'existant', ref: { kind, id }, ...extra,
});
const path = (steps, extra = {}) => ({
  id: 'p-one', slug: 'path-one', roadmap: 'now',
  time: { coreHours: 1 }, steps, ...extra,
});
const corpus = (extra = {}) => ({
  parcours: [], courses: [], lessons: [], caseStudies: [],
  simulators: [], deliverables: [], glossary: [], diagnostics: [], ...extra,
});
const withCode = (report, code) => report.findings.filter((finding) => finding.code === code);

// Small fixtures deliberately do not encode the live inventory or July baseline.
test('an existing step with an unknown ID is an integrity finding, not a placeholder', () => {
  const report = diagnoseFormation(corpus({
    parcours: [path([step('lesson', 'missing')])],
  }));
  assert.equal(withCode(report, 'step-reference-missing').length, 1);
  assert.equal(withCode(report, 'step-reference-missing')[0].category, 'integrity');
  assert.equal(withCode(report, 'step-reference-missing')[0].refId, 'missing');
});

test('resolves every current kind by ID, including milestone precedence and glossary slugs', () => {
  const data = corpus({
    lessons: [lesson('one'), lesson('quiz'), lesson('same'), lesson('soon', { status: 'upcoming' })],
    courses: [{ id: 'c-one', slug: 'course-slug', lessonIds: ['one'] }],
    caseStudies: [{ id: 'case-id', slug: 'case-slug' }],
    simulators: [{ id: 'sim-id', slug: 'sim-slug' }],
    deliverables: [{ id: 'same', slug: 'deliverable-slug' }],
    glossary: [{ id: 'term-id', slug: 'term-slug' }],
    parcours: [path([
      step('lesson', 'one'), step('course', 'c-one', { order: 2 }),
      step('case', 'case-id', { order: 3 }), step('simulator', 'sim-id', { order: 4 }),
      step('deliverable', 'same', { order: 5 }), step('milestone', 'same', { order: 6 }),
      step('milestone', 'quiz', { order: 7 }), step('glossary', 'term-slug', { order: 8 }),
      step('lesson', 'soon', { order: 9 }), step('lesson', 'one-slug', { order: 10 }),
      step('milestone', 'todo-unknown', { order: 11, status: 'a-produire' }),
      step('lesson', 'todo-not-an-exemption', { order: 12, status: 'a-produire' }),
    ])],
  });
  const report = diagnoseFormation(data);
  assert.deepEqual(withCode(report, 'step-reference-missing').map((f) => f.refId), ['one-slug', 'todo-not-an-exemption']);
  assert.deepEqual(withCode(report, 'step-lesson-unpublished').map((f) => f.refId), ['soon']);
  const resolved = report.parcours[0].steps;
  assert.equal(resolved[5].resolvedKind, 'deliverable');
  assert.equal(resolved[6].resolvedKind, 'lesson');
  assert.equal(resolved[8].resolution, 'unpublished');
  assert.equal(resolved[10].resolution, 'placeholder');
  assert.equal(resolved[7].resolution, 'resolved');
});

test('future declarations are separate scenarios, never inferred from roadmap, prose or step status', () => {
  const data = corpus({ parcours: [path([
    step('milestone', 'todo-required', { status: 'a-produire' }),
    step('milestone', 'todo-bonus', { status: 'a-produire', type: 'bonus', order: 2 }),
  ], { goal: 'Produire un mémo', milestone: { type: 'deal-memo' } })] });
  const current = diagnoseFormation(data);
  assert.deepEqual(current.parcours[0].declaration, {
    availability: null, completionMode: null, entryPrerequisiteLessonIds: null,
  });
  assert.equal(withCode(current, 'path-metadata-unmodeled').length, 1);
  assert.equal(withCode(current, 'required-step-to-produce').length, 1);
  assert.equal(withCode(current, 'optional-step-to-produce').length, 1);
  assert.equal(withCode(current, 'executable-path-placeholder').length, 0);
  assert.equal(withCode(current, 'production-output-missing').length, 0);

  const report = diagnoseFormation(data, { declarations: { parcours: {
    'p-one': { availability: 'executable', completionMode: 'production', entryPrerequisiteLessonIds: [] },
  } } });
  assert.equal(withCode(report, 'executable-path-placeholder').length, 1);
  assert.equal(withCode(report, 'production-output-missing').length, 1);
  assert.equal(withCode(report, 'path-metadata-unmodeled').length, 0);
  assert.equal(withCode(diagnoseFormation(data, { declarations: { parcours: {
    'p-one': { completionMode: 'knowledge' },
  } } }), 'production-output-missing').length, 0);
});

test('a resolved output is a required existing milestone or capstone, not an entry diagnostic', () => {
  const data = corpus({
    lessons: [lesson('quiz')],
    deliverables: [{ id: 'final', slug: 'final', activityKind: 'capstone' }],
    diagnostics: [{ id: 'entry' }],
    parcours: [path([step('milestone', 'quiz')], { entryDiagnosticId: 'entry' })],
  });
  const declarations = { parcours: { 'p-one': { completionMode: 'production' } } };
  const quizReport = diagnoseFormation(data, { declarations });
  assert.equal(quizReport.parcours[0].outputs[0].kind, 'lesson');
  assert.equal(withCode(quizReport, 'production-output-missing').length, 1);
  data.parcours[0].steps = [step('deliverable', 'final')];
  assert.equal(withCode(diagnoseFormation(data, { declarations }), 'production-output-missing').length, 0);
  for (const extra of [{ type: 'bonus' }, { status: 'a-produire' }]) {
    data.parcours[0].steps = [step('milestone', 'final', extra)];
    assert.deepEqual(diagnoseFormation(data).parcours[0].outputs, []);
  }
  data.parcours[0].steps = [];
  assert.deepEqual(diagnoseFormation(data).parcours[0].outputs, []);
});

test('publication gaps and empty or partial courses do not become missing references', () => {
  const data = corpus({
    courses: [
      { id: 'empty', slug: 'empty', lessonIds: [] },
      { id: 'partial', slug: 'partial', lessonIds: ['one', 'soon'] },
    ],
    lessons: [lesson('one', { courseId: 'partial' }), lesson('soon', { courseId: 'partial', status: 'upcoming' })],
    parcours: [path([step('course', 'empty'), step('course', 'partial', { order: 2 })])],
  });
  const report = diagnoseFormation(data, { declarations: { courses: {
    empty: { availability: 'available', public: true },
    partial: { availability: 'available' },
  } } });
  assert.deepEqual(report.courses.map((course) => course.coverage), ['empty', 'partial']);
  assert.equal(withCode(report, 'step-reference-missing').length, 0);
  assert.equal(withCode(report, 'available-course-empty').length, 1);
  assert.equal(withCode(report, 'available-course-partial').length, 1);
  assert.equal(withCode(report, 'public-state-missing').length, 1);
  assert.equal(withCode(report, 'publication-unmodeled').some((f) => f.collection === 'courses'), true);
  data.lessons[0].status = undefined;
  assert.equal(withCode(diagnoseFormation(data), 'lesson-publication-invalid').length, 1);
});

test('prerequisites follow sorted published course consumption, not lessonIds or source order', () => {
  const data = corpus({
    lessons: [
      lesson('after', { order: 3 }),
      lesson('first', { order: 1, prerequisiteLessonIds: ['after', 'outside', 'gone', 'soon'] }),
      lesson('second', { order: 2, prerequisiteLessonIds: ['first'] }),
      lesson('outside', { courseId: 'other' }),
      lesson('soon', { courseId: 'other', status: 'upcoming' }),
      lesson('quiz', { courseId: 'other', prerequisiteLessonIds: ['second'] }),
    ],
    courses: [{ id: 'c-one', lessonIds: ['after', 'second', 'first'] }],
    parcours: [path([
      step('milestone', 'quiz', { order: 3 }),
      step('lesson', 'first', { order: 2 }),
      step('course', 'c-one', { order: 1 }),
    ], { prerequisites: ['outside'] })],
  });
  const report = diagnoseFormation(data);
  const gaps = withCode(report, 'prerequisite-gap');
  assert.equal(gaps.length, 4);
  assert.deepEqual(gaps.map((gap) => [gap.prerequisiteId, gap.scopes.complete]), [
    ['after', 'later'], ['outside', 'absent'], ['gone', 'missing-reference'], ['soon', 'unpublished'],
  ]);
  assert.deepEqual(report.parcours[0].lessonSequence.map((item) => item.lessonId), ['first', 'second', 'after', 'first', 'quiz']);
  const declared = diagnoseFormation(data, { declarations: { parcours: {
    'p-one': { entryPrerequisiteLessonIds: ['outside', 'gone', 'soon'] },
  } } });
  assert.equal(withCode(declared, 'prerequisite-gap').some((gap) => gap.prerequisiteId === 'outside'), false);
  assert.equal(withCode(declared, 'entry-prerequisite-invalid').length, 2);
});

test('optional lessons cannot satisfy the required sequence and self-dependencies remain gaps', () => {
  const data = corpus({
    lessons: [lesson('a'), lesson('b', { prerequisiteLessonIds: ['a', 'b'] })],
    parcours: [path([
      step('lesson', 'a', { type: 'bonus' }),
      step('lesson', 'b', { order: 2 }), step('lesson', 'b', { order: 3 }),
    ])],
  });
  const gaps = withCode(diagnoseFormation(data), 'prerequisite-gap');
  assert.equal(gaps.length, 2);
  assert.deepEqual(gaps.find((gap) => gap.prerequisiteId === 'a').scopes, { required: 'optional-only' });
  assert.deepEqual(gaps.find((gap) => gap.prerequisiteId === 'b').scopes, { complete: 'self', required: 'self' });
  data.parcours[0].steps[0].type = 'coeur';
  assert.equal(withCode(diagnoseFormation(data), 'prerequisite-gap').length, 1);
});

test('derived duration coverage never turns unknown work into a measured zero', () => {
  const data = corpus({
    lessons: [lesson('one', { readMin: undefined })],
    simulators: [{ id: 'sim' }],
    caseStudies: [{ id: 'case', readMin: 8 }],
    deliverables: [{ id: 'final', readMin: 3, activityKind: 'capstone' }],
    parcours: [path([
      step('lesson', 'one'), step('simulator', 'sim', { order: 2 }),
      step('case', 'case', { order: 3, type: 'respiration' }),
      step('milestone', 'final', { order: 4 }),
    ], { time: { source: 'derived' } })],
  });
  const report = diagnoseFormation(data);
  assert.equal(report.parcours[0].time.coverage, 'incomplete');
  assert.deepEqual(withCode(report, 'duration-estimate-missing').map((f) => [f.refId, f.field]), [
    ['one', 'readMin'], ['sim', 'estimatedWorkMinutes'], ['case', 'estimatedWorkMinutes'], ['final', 'estimatedWorkMinutes'],
  ]);
  assert.equal(report.parcours[0].time.contributions.some((c) => c.minutes === 0), false);
  data.parcours[0].time = { coreHours: 1 };
  assert.equal(diagnoseFormation(data).parcours[0].time.coverage, 'not-audited');
  assert.equal(withCode(diagnoseFormation(data), 'duration-estimate-missing').length, 0);
});

test('duration coverage mirrors lesson deduplication, scoped practice, final and optional contributions', () => {
  const data = corpus({
    lessons: [
      lesson('one', { practice: { deliverableId: 'final', estimatedMinutes: 10 } }),
      lesson('outside', { practice: { deliverableId: 'other', estimatedMinutes: 90 } }),
    ],
    deliverables: [{ id: 'final', readMin: 3, estimatedWorkMinutes: 20, activityKind: 'capstone' }],
    caseStudies: [{ id: 'case', readMin: 8, estimatedWorkMinutes: 12 }],
    simulators: [{ id: 'sim', estimatedWorkMinutes: 15 }],
    parcours: [path([
      step('lesson', 'one', { type: 'bonus' }), step('lesson', 'one', { order: 2 }),
      step('lesson', 'outside', { order: 3 }), step('milestone', 'final', { order: 4 }),
      step('simulator', 'sim', { order: 5 }), step('case', 'case', { order: 6, type: 'respiration' }),
    ], { time: { source: 'derived' } })],
  });
  const { time } = diagnoseFormation(data).parcours[0];
  assert.equal(time.coverage, 'no-detected-gap');
  assert.deepEqual(time.contributions.filter((c) => c.refId === 'one').map((c) => [c.field, c.bucket, c.minutes]), [
    ['readMin', 'reading', 5], ['practice.estimatedMinutes', 'guidedPractice', 10],
  ]);
  assert.equal(time.contributions.find((c) => c.refId === 'outside' && c.field === 'practice.estimatedMinutes').bucket, 'outside-path');
  assert.equal(time.contributions.find((c) => c.refId === 'final').bucket, 'final');
  assert.equal(time.contributions.find((c) => c.refId === 'case').bucket, 'optional');
});

test('duration detects ignored worksheets, repeated cases and unresolved or partial activities', () => {
  const data = corpus({
    lessons: [lesson('one'), lesson('soon', { status: 'upcoming', order: 2 })],
    courses: [{ id: 'c-one', lessonIds: ['one', 'soon'] }],
    caseStudies: [{ id: 'case', readMin: 3, estimatedWorkMinutes: 8 }],
    deliverables: [{ id: 'sheet', activityKind: 'worksheet', readMin: 4, estimatedWorkMinutes: 30 }],
    parcours: [path([
      step('course', 'c-one'), step('deliverable', 'sheet', { order: 2 }),
      step('case', 'case', { order: 3 }), step('case', 'case', { order: 4 }),
      step('milestone', 'todo', { order: 5, status: 'a-produire' }),
    ], { time: { source: 'derived' } })],
  });
  const report = diagnoseFormation(data);
  assert.equal(withCode(report, 'duration-contribution-ignored').length, 1);
  assert.equal(withCode(report, 'duration-contribution-repeated').length, 1);
  assert.equal(withCode(report, 'duration-course-incomplete').length, 1);
  assert.equal(withCode(report, 'duration-step-unresolved').length, 1);
  assert.equal(report.parcours[0].time.coverage, 'incomplete');
});

function fixtureDirectory(t, data) {
  const dir = mkdtempSync(join(tmpdir(), 'formation-readiness-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  for (const [name, records] of Object.entries(data)) writeFileSync(join(dir, `${name}.json`), JSON.stringify(records));
  mkdirSync(join(dir, 'parcours'));
  return dir;
}

function fingerprint(dir) {
  return readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).flatMap((entry) => {
    const target = join(dir, entry.name);
    return entry.isDirectory() ? fingerprint(target)
      : [[target, createHash('sha256').update(readFileSync(target)).digest('hex')]];
  });
}

const runCli = (...args) => spawnSync(process.execPath, [
  fileURLToPath(new URL('./formation-readiness.mjs', import.meta.url)), ...args,
], { encoding: 'utf8', cwd: tmpdir(), timeout: 10000 });

test('CLI reads sorted canonical drop-ins without generated files, is deterministic and never writes', (t) => {
  const dir = fixtureDirectory(t, corpus({
    parcours: [path([step('lesson', 'drop-a'), step('milestone', 'todo', { order: 2, status: 'a-produire' })])],
  }));
  writeFileSync(join(dir, 'parcours', 'b.lessons.json'), JSON.stringify({ lessons: [lesson('drop-b')] }));
  writeFileSync(join(dir, 'parcours', 'a.lessons.json'), JSON.stringify({ lessons: [lesson('drop-a')] }));
  const before = fingerprint(dir);
  const json = runCli('--data-dir', dir, '--json');
  assert.equal(json.status, 0, json.stderr);
  assert.match(json.stdout, /"mode": "diagnostic"/);
  const report = JSON.parse(json.stdout);
  assert.equal(report.inventory.lessons, 2);
  assert.equal(report.summary.requiredPlaceholders, 1);
  assert.equal(report.summary.missingStepReferences, 0);
  assert.equal(runCli('--data-dir', dir, '--json').stdout, json.stdout);
  const human = runCli('--data-dir', dir);
  assert.equal(human.status, 0, human.stderr);
  assert.match(human.stdout, /Formation — diagnostic non bloquant/);
  assert.match(human.stdout, /Métadonnées/);
  assert.match(human.stdout, /Arbitrages/);
  assert.match(human.stdout, /todo/);
  assert.deepEqual(fingerprint(dir), before);
});

test('CLI fails on unusable input and invalid arguments, never reports a fabricated empty inventory', (t) => {
  const dir = fixtureDirectory(t, corpus());
  writeFileSync(join(dir, 'parcours', 'broken.lessons.json'), JSON.stringify({ lessons: {} }));
  const broken = runCli('--data-dir', dir, '--json');
  assert.equal(broken.status, 1);
  assert.equal(broken.stdout, '');
  assert.match(broken.stderr, /broken.lessons.json/);
  rmSync(join(dir, 'parcours', 'broken.lessons.json'));
  writeFileSync(join(dir, 'lessons.json'), '{');
  assert.equal(runCli('--data-dir', dir).status, 1);
  assert.equal(runCli('--data-dir', join(dir, 'absent')).status, 1);
  for (const args of [['--strict'], ['--data-dir'], ['--json', '--write'], ['--data-dir', '--json']]) {
    assert.equal(runCli(...args).status, 2);
  }
  assert.equal(runCli('--help').status, 0);
  assert.match(runCli('--help').stdout, /--json/);
});

test('pure reports leave frozen inputs unchanged and derive every summary count from the fixture', () => {
  const data = corpus({ parcours: [path([step('milestone', 'todo', { status: 'a-produire' })])] });
  const freeze = (value) => {
    if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); }
    return value;
  };
  const before = JSON.stringify(data);
  const report = diagnoseFormation(freeze(data));
  assert.equal(JSON.stringify(data), before);
  assert.equal(report.inventory.parcours, data.parcours.length);
  assert.equal(report.summary.requiredPlaceholders, withCode(report, 'required-step-to-produce').length);
  assert.equal(report.summary.pathsWithoutOutput, report.parcours.filter((p) => !p.outputs.length).length);
  assert.deepEqual(diagnoseFormation(data), report);
});

test('npm exposes the diagnostic separately from the check gate', () => {
  const { scripts } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  assert.equal(scripts['validate:formation'], 'node scripts/formation-readiness.mjs');
  assert.doesNotMatch(scripts.check, /validate:formation|formation-readiness/);
});

test('ambiguous IDs and malformed input cannot produce a successful diagnostic', (t) => {
  assert.throws(() => diagnoseFormation(corpus({ lessons: [lesson('same'), lesson('same')] })), /lessons.*same/);
  assert.throws(() => diagnoseFormation(corpus({ lessons: [null] })), /lessons/);
  assert.throws(() => diagnoseFormation(corpus({ parcours: [path([step('lesson', 'one', { order: NaN })])] })), /order/);
  assert.throws(() => diagnoseFormation(corpus({ parcours: [path([step('lesson', 'one', { type: 'unknown' })])] })), /type/);
  const dir = fixtureDirectory(t, corpus({ lessons: [lesson('same')] }));
  writeFileSync(join(dir, 'parcours', 'duplicate.lessons.json'), JSON.stringify({ lessons: [lesson('same')] }));
  const result = runCli('--data-dir', dir, '--json');
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
});

test('course reciprocal-reference gaps are integrity findings, not unpublished lessons', () => {
  const data = corpus({
    lessons: [lesson('inside'), lesson('foreign', { courseId: 'elsewhere' })],
    courses: [{ id: 'c-one', lessonIds: ['foreign', 'missing'] }],
  });
  const report = diagnoseFormation(data);
  assert.deepEqual(withCode(report, 'course-reference-inconsistent').map((f) => f.refId), ['foreign', 'missing', 'inside']);
  assert.equal(report.courses[0].coverage, 'partial');
});

test('CLI names inconsistent lesson references without an undefined kind and keeps findings non-blocking', (t) => {
  const dir = fixtureDirectory(t, corpus({ courses: [{ id: 'c-one', lessonIds: ['missing'] }] }));
  const human = runCli('--data-dir', dir);
  assert.equal(human.status, 0);
  assert.match(human.stdout, /\[course-reference-inconsistent\] courses\/c-one lesson:missing/);
  assert.doesNotMatch(human.stdout, /undefined/);
  const json = runCli('--data-dir', dir, '--json');
  assert.equal(json.status, 0);
  assert.equal(withCode(JSON.parse(json.stdout), 'course-reference-inconsistent')[0].refKind, 'lesson');
});

test('duration diagnoses first-occurrence and respiration misclassification without changing the owner', () => {
  const data = corpus({
    deliverables: [{ id: 'final', readMin: 4, estimatedWorkMinutes: 30, activityKind: 'capstone' }],
    parcours: [path([
      step('milestone', 'final', { type: 'bonus', order: 2 }),
      step('milestone', 'final', { order: 1 }),
    ], { time: { source: 'derived' } })],
  });
  const report = diagnoseFormation(data);
  assert.equal(withCode(report, 'duration-optional-misclassified').length, 1);
  assert.equal(report.parcours[0].time.contributions[0].bucket, 'optional');
  data.parcours[0].steps = [step('milestone', 'final', { type: 'respiration' })];
  assert.equal(withCode(diagnoseFormation(data), 'duration-optional-misclassified').length, 1);
});
