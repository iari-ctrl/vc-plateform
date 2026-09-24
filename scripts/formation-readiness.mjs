#!/usr/bin/env node
// F0/S0: diagnostic only; no content migration or public selector changes.
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { isPublishedContent } from '../shared/publication.mjs';

const COLLECTIONS = {
  lesson: 'lessons', course: 'courses', case: 'caseStudies',
  simulator: 'simulators', deliverable: 'deliverables', glossary: 'glossary',
};
const isOptional = (step) => step.type === 'bonus' || step.type === 'respiration';

// Only validate the shape needed for deterministic analysis. The exhaustive
// editorial schemas remain owned by validate:content:strict.
function assertAnalyzable(corpus) {
  for (const collection of ['parcours', ...Object.values(COLLECTIONS), 'diagnostics']) {
    const records = corpus?.[collection];
    if (!Array.isArray(records)) throw new TypeError(`${collection} : tableau attendu`);
    const ids = new Set();
    for (const record of records) {
      if (!record || typeof record.id !== 'string' || !record.id) throw new TypeError(`${collection} : identifiant absent ou invalide`);
      if (ids.has(record.id)) throw new TypeError(`${collection} : identifiant ambigu ${record.id}`);
      ids.add(record.id);
    }
  }
  for (const path of corpus.parcours) {
    if (!Array.isArray(path.steps) || !path.time) throw new TypeError(`parcours/${path.id} : steps/time invalides`);
    for (const step of path.steps) {
      if (!Number.isFinite(step?.order)) throw new TypeError(`parcours/${path.id} : order invalide`);
      if (!['coeur', 'pratique', 'bonus', 'respiration'].includes(step.type)) throw new TypeError(`parcours/${path.id} : type invalide`);
      if (!['existant', 'a-produire'].includes(step.status) || typeof step.ref?.id !== 'string'
        || ![...Object.keys(COLLECTIONS), 'milestone'].includes(step.ref.kind)) {
        throw new TypeError(`parcours/${path.id} : status/ref invalides`);
      }
    }
  }
  for (const course of corpus.courses) {
    if (!Array.isArray(course.lessonIds)) throw new TypeError(`courses/${course.id} : lessonIds invalides`);
  }
  for (const lesson of corpus.lessons) {
    if (lesson.prerequisiteLessonIds !== undefined && !Array.isArray(lesson.prerequisiteLessonIds)) {
      throw new TypeError(`lessons/${lesson.id} : prerequisiteLessonIds invalides`);
    }
  }
}

// Mirrors resolveStep and publishedLessonsForCourse, without importing the SPA
// or its generated JSON. Reference presence and readable resolution stay distinct.
function resolveReference(step, corpus) {
  const { kind, id } = step.ref;
  let resolvedKind = kind;
  let resource;
  if (kind === 'milestone') {
    resource = corpus.deliverables.find((item) => item.id === id);
    resolvedKind = resource ? 'deliverable' : 'lesson';
    resource ??= corpus.lessons.find((item) => item.id === id);
  } else {
    resource = (corpus[COLLECTIONS[kind]] ?? []).find((item) => (
      item.id === id || kind === 'glossary' && item.slug === id
    ));
  }
  const resolution = !resource
    ? kind === 'milestone' && step.status === 'a-produire' ? 'placeholder' : 'missing'
    : resolvedKind === 'lesson' && !isPublishedContent(resource) ? 'unpublished' : 'resolved';
  return { resource, resolvedKind: resource ? resolvedKind : null, resolution };
}

function publicationFindings(corpus, declarations, findings) {
  for (const [collection, records] of Object.entries(corpus)) {
    if (collection !== 'lessons') {
      const ids = records.filter((record) => !record.status).map((record) => record.id);
      if (ids.length) findings.push({
        category: 'metadata', code: 'publication-unmodeled', collection, ids,
        message: 'État éditorial non modélisé dans cette collection ; exposition actuelle distincte de publication explicite.',
      });
    }
    for (const record of records) {
      if (collection === 'lessons' && !['published', 'upcoming'].includes(record.status)) {
        findings.push({ category: 'integrity', code: 'lesson-publication-invalid', collection, id: record.id,
          message: 'Une leçon doit porter un état published ou upcoming explicite.' });
      }
      if (declarations[collection]?.[record.id]?.public === true && !record.status) {
        findings.push({ category: 'integrity', code: 'public-state-missing', collection, id: record.id,
          message: 'Scénario : ressource déclarée publique sans état éditorial explicite.' });
      }
    }
  }
}

function courseCoverage(corpus, declarations, findings) {
  return corpus.courses.map((course) => {
    const children = corpus.lessons.filter((item) => item.courseId === course.id);
    const published = children.filter(isPublishedContent);
    const missing = course.lessonIds.filter((id) => !corpus.lessons.some((item) => item.id === id));
    const inconsistent = [...new Set([
      ...course.lessonIds.filter((id) => !children.some((item) => item.id === id)),
      ...children.filter((item) => !course.lessonIds.includes(item.id)).map((item) => item.id),
    ])];
    for (const refId of inconsistent) findings.push({
      category: 'integrity', code: 'course-reference-inconsistent', collection: 'courses', id: course.id, refKind: 'lesson', refId,
      message: 'Référence de leçon absente ou réciprocité courseId/lessonIds incohérente.',
    });
    const coverage = !published.length ? 'empty'
      : published.length < children.length || inconsistent.length ? 'partial' : 'published';
    if (coverage !== 'published') {
      findings.push({ category: 'decision', code: `course-${coverage}`, collection: 'courses', id: course.id,
        message: coverage === 'empty' ? 'Aucune leçon publiée accessible.' : 'Leçons partiellement publiées ou références absentes.' });
      if (declarations.courses?.[course.id]?.availability === 'available') {
        findings.push({ category: 'integrity', code: `available-course-${coverage}`, collection: 'courses', id: course.id,
          message: 'Scénario : disponibilité déclarée incompatible avec la couverture des leçons.' });
      }
    }
    // Inventory keeps source order; consumedLessons separately applies lesson.order.
    return { id: course.id, coverage, publishedLessonIds: published.map((item) => item.id),
      unpublishedLessonIds: children.filter((item) => !isPublishedContent(item)).map((item) => item.id),
      missingLessonIds: missing, inconsistentLessonIds: inconsistent };
  });
}

function consumedLessons(steps, corpus) {
  return steps.flatMap((step) => {
    if (step.resolution !== 'resolved') return [];
    const lessons = step.resolvedKind === 'course'
      ? corpus.lessons.filter((lesson) => lesson.courseId === step.ref.id && isPublishedContent(lesson))
        .sort((a, b) => a.order - b.order)
      : step.resolvedKind === 'lesson' ? corpus.lessons.filter((lesson) => lesson.id === step.ref.id) : [];
    return lessons.map((lesson) => ({ lessonId: lesson.id, order: step.order, optional: step.optional }));
  });
}

// One gap per (path, consumed lesson, prerequisite), first consumption per scope.
// Complete and required-only sequences are separate: optional work is not an
// implicit entry requirement. Textual prerequisites never satisfy a stable ID.
function checkPrerequisites(id, sequence, declaration, corpus, findings) {
  const lessons = new Map(corpus.lessons.map((lesson) => [lesson.id, lesson]));
  const entry = new Set();
  for (const prerequisiteId of declaration.entryPrerequisiteLessonIds ?? []) {
    if (isPublishedContent(lessons.get(prerequisiteId))) entry.add(prerequisiteId);
    else findings.push({ category: 'integrity', code: 'entry-prerequisite-invalid', collection: 'parcours', id,
      prerequisiteId, message: 'Scénario : prérequis d’entrée absent ou non publié.' });
  }
  const gaps = new Map();
  for (const [scope, items] of [['complete', sequence], ['required', sequence.filter((item) => !item.optional)]]) {
    const consumed = new Set();
    for (const [index, item] of items.entries()) {
      if (consumed.has(item.lessonId)) continue;
      for (const prerequisiteId of lessons.get(item.lessonId).prerequisiteLessonIds ?? []) {
        if (entry.has(prerequisiteId) || consumed.has(prerequisiteId)) continue;
        const prerequisite = lessons.get(prerequisiteId);
        const reason = !prerequisite ? 'missing-reference'
          : !isPublishedContent(prerequisite) ? 'unpublished'
            : prerequisiteId === item.lessonId ? 'self'
              : items.slice(index + 1).some((next) => next.lessonId === prerequisiteId) ? 'later'
                : scope === 'required' && sequence.some((next) => next.lessonId === prerequisiteId) ? 'optional-only' : 'absent';
        const key = JSON.stringify([item.lessonId, prerequisiteId]);
        const gap = gaps.get(key) ?? { lessonId: item.lessonId, prerequisiteId, scopes: {} };
        gap.scopes[scope] = reason;
        gaps.set(key, gap);
      }
      consumed.add(item.lessonId);
    }
  }
  for (const gap of gaps.values()) findings.push({
    category: Object.values(gap.scopes).includes('missing-reference') ? 'integrity' : 'decision',
    code: 'prerequisite-gap', collection: 'parcours', id, ...gap,
    message: 'Prérequis non rencontré avant consommation ; réordonner, déclarer à l’entrée ou revoir la dépendance après arbitrage.',
  });
}

// Coverage audit of learningTime.ts, not a replacement calculation. Keep absent
// estimates null, expose ignored activities, and do not certify the workload.
function durationCoverage(parcours, steps, sequence, corpus, courses, findings) {
  if (parcours.time.source !== 'derived') return { source: 'declared', coverage: 'not-audited', contributions: [] };
  const contributions = [];
  const gaps = [];
  const gap = (code, step, message, extra = {}, category = 'integrity') => gaps.push({
    category, code, collection: 'parcours', id: parcours.id,
    refKind: step.ref.kind, refId: step.ref.id, order: step.order, message, ...extra,
  });
  const add = (step, field, minutes, bucket) => {
    const known = Number.isFinite(minutes) && minutes >= 0;
    contributions.push({ refKind: step.ref.kind, refId: step.ref.id, field, bucket, minutes: known ? minutes : null });
    if (!known && bucket !== 'outside-path') gap('duration-estimate-missing', step,
      'Estimation absente ou invalide ; le zéro utilisé par le calcul ne prouve pas une charge nulle.', { field }, 'metadata');
  };
  const requiredIds = new Set(sequence.filter((item) => !item.optional).map((item) => item.lessonId));
  const deliverableIds = new Set(steps.filter((step) => ['deliverable', 'milestone'].includes(step.ref.kind)).map((step) => step.ref.id));
  for (const id of new Set(sequence.map((item) => item.lessonId))) {
    const lesson = corpus.lessons.find((item) => item.id === id);
    const optional = !requiredIds.has(id);
    const step = { ref: { kind: 'lesson', id }, order: sequence.find((item) => item.lessonId === id).order };
    add(step, 'readMin', lesson.readMin, optional ? 'optional' : 'reading');
    if (lesson.practice) add(step, 'practice.estimatedMinutes', lesson.practice.estimatedMinutes,
      optional ? 'optional' : deliverableIds.has(lesson.practice.deliverableId) ? 'guidedPractice' : 'outside-path');
  }
  const seen = new Set();
  // Unlike navigation, learningTime.ts uses source-array order for deliverable
  // first-occurrence deduplication. Preserve it to expose, not repair, that rule.
  for (const sourceStep of parcours.steps) {
    const step = { ...sourceStep, optional: isOptional(sourceStep), ...resolveReference(sourceStep, corpus) };
    if (step.resolution !== 'resolved' || step.status === 'a-produire') {
      gap('duration-step-unresolved', step, 'Charge non qualifiable pour cette étape non résolue ou à produire.');
      continue;
    }
    if (step.resolvedKind === 'course') {
      if (courses.find((course) => course.id === step.ref.id).coverage !== 'published') {
        gap('duration-course-incomplete', step, 'Le calcul ne couvre que les leçons publiées de ce cours incomplet.');
      }
      continue;
    }
    if (step.resolvedKind === 'lesson') continue;
    const { resource } = resolveReference(step, corpus);
    const key = `${step.resolvedKind}:${step.ref.id}`;
    if (seen.has(key)) {
      if (step.resolvedKind === 'deliverable') continue;
      gap('duration-contribution-repeated', step, 'Le calcul actuel additionne cette activité à chaque occurrence.');
    }
    seen.add(key);
    if (step.resolvedKind === 'case' || step.resolvedKind === 'simulator') {
      const bucket = step.optional ? 'optional' : 'consolidation';
      if (step.resolvedKind === 'case') add(step, 'readMin', resource.readMin, bucket);
      add(step, 'estimatedWorkMinutes', resource.estimatedWorkMinutes, bucket);
    } else if (step.resolvedKind === 'deliverable') {
      const bucket = step.type === 'bonus' ? 'optional'
        : resource.activityKind === 'cumulative-exercise' ? 'consolidation'
          : resource.activityKind === 'capstone' || step.ref.kind === 'milestone' ? 'final' : 'ignored';
      add(step, 'readMin', resource.readMin, bucket === 'consolidation' ? 'reading' : bucket);
      add(step, 'estimatedWorkMinutes', resource.estimatedWorkMinutes, bucket);
      if (bucket === 'ignored') gap('duration-contribution-ignored', step,
        'Activité résolue mais ignorée par les branches actuelles de learningTime.ts.');
      const required = steps.some((item) => item.resolvedKind === 'deliverable' && item.ref.id === step.ref.id && !item.optional);
      if (bucket !== 'ignored' && (bucket === 'optional') === required) {
        gap('duration-optional-misclassified', step,
          'La première occurrence ou le type respiration classe cette charge dans le mauvais périmètre requis/facultatif.');
      }
    } else {
      gap('duration-contribution-unmodeled', step, 'Aucune contribution temporelle modélisée pour ce type de ressource.', {}, 'metadata');
    }
  }
  findings.push(...gaps);
  return { source: 'derived', coverage: gaps.length ? 'incomplete' : 'no-detected-gap', contributions };
}

/**
 * `declarations` is a fixture-only scenario adapter, NOT new canonical fields.
 * S1 must decide the future schema. The CLI supplies no declarations; roadmap,
 * milestone prose, prerequisites prose and step.status cannot fill those gaps.
 */
export function diagnoseFormation(corpus, { declarations = {} } = {}) {
  assertAnalyzable(corpus);
  const findings = [];
  publicationFindings(corpus, declarations, findings);
  const courses = courseCoverage(corpus, declarations, findings);
  const paths = [];
  for (const parcours of corpus.parcours) {
    const declared = declarations.parcours?.[parcours.id] ?? {};
    const declaration = {
      availability: declared.availability ?? null,
      completionMode: declared.completionMode ?? null,
      entryPrerequisiteLessonIds: declared.entryPrerequisiteLessonIds ?? null,
    };
    const missingFields = Object.keys(declaration).filter((key) => declaration[key] === null);
    if (missingFields.length) findings.push({
      category: 'metadata', code: 'path-metadata-unmodeled', collection: 'parcours', id: parcours.id,
      fields: missingFields, message: 'Disponibilité, complétion ou prérequis d’entrée non modélisés ; décision S1 nécessaire.',
    });
    const steps = [...parcours.steps].sort((a, b) => a.order - b.order).map((step) => {
      const { resolvedKind, resolution } = resolveReference(step, corpus);
      const context = {
        collection: 'parcours', id: parcours.id, order: step.order,
        refKind: step.ref.kind, refId: step.ref.id,
      };
      if (resolution === 'missing' || resolution === 'unpublished') {
        findings.push(resolution === 'missing'
          ? { ...context, category: 'integrity', code: 'step-reference-missing', message: 'Référence absente des sources.' }
          : { ...context, category: 'decision', code: 'step-lesson-unpublished', message: 'Leçon présente, mais non publiée et non lisible.' });
      }
      if (step.status === 'a-produire') {
        findings.push({ ...context, category: 'decision',
          code: isOptional(step) ? 'optional-step-to-produce' : 'required-step-to-produce',
          message: 'Étape encore déclarée à produire ; production, retrait ou requalification à arbitrer.' });
        if (!isOptional(step) && declaration.availability === 'executable') {
          findings.push({ ...context, category: 'integrity', code: 'executable-path-placeholder',
            message: 'Scénario : parcours déclaré exécutable avec une étape requise à produire.' });
        }
      }
      return { ...step, ref: { ...step.ref }, optional: isOptional(step), resolvedKind, resolution };
    });
    const outputs = steps.filter((step) => (
      !step.optional && step.status === 'existant' && step.resolution === 'resolved'
      && (step.ref.kind === 'milestone' || step.ref.kind === 'deliverable'
        && corpus.deliverables.find((item) => item.id === step.ref.id)?.activityKind === 'capstone')
    )).map((step) => ({ order: step.order, kind: step.resolvedKind, id: step.ref.id }));
    if (declaration.completionMode === 'production' && !outputs.some((output) => output.kind === 'deliverable')) {
      findings.push({ category: 'integrity', code: 'production-output-missing', collection: 'parcours', id: parcours.id,
        message: 'Scénario : parcours de production sans sortie requise résolue vers un livrable.' });
    } else if (!outputs.length && declaration.completionMode === null) {
      findings.push({ category: 'decision', code: 'output-to-qualify', collection: 'parcours', id: parcours.id,
        message: 'Aucune sortie requise résolue ; qualifier la promesse sans imposer un livrable.' });
    }
    const lessonSequence = consumedLessons(steps, corpus);
    checkPrerequisites(parcours.id, lessonSequence, declaration, corpus, findings);
    const time = durationCoverage(parcours, steps, lessonSequence, corpus, courses, findings);
    paths.push({ id: parcours.id, declaration, steps, outputs, lessonSequence, time });
  }
  const count = (code) => findings.filter((finding) => finding.code === code).length;
  const prerequisites = findings.filter((finding) => finding.code === 'prerequisite-gap');
  return {
    version: 1, mode: 'diagnostic',
    definitions: {
      required: 'Étapes coeur et pratique ; bonus et respiration facultatifs, hors calibration par budget.',
      prerequisites: 'Leçons publiées, steps triés par order ; cours sélectionnés par courseId puis order. Un écart par parcours/leçon/prérequis à la première consommation, séquences complète et requise séparées.',
      outputs: 'Étapes requises existantes résolues : milestone vers livrable ou leçon, ou deliverable capstone. Ne prouve ni complétion ni exécutabilité ; diagnostic d’entrée exclu.',
      durations: 'Couverture des contributions de learningTime.ts, sans recalcul des totaux, calibration métier ni estimation inventée. Les durées déclarées restent à justifier.',
      declarations: 'Adaptateur de scénarios pour fixtures uniquement ; aucune déclaration fournie par la CLI, aucun futur champ canonique adopté.',
    },
    inventory: { ...Object.fromEntries(Object.entries(corpus).map(([key, records]) => [key, records.length])),
      publishedLessons: corpus.lessons.filter(isPublishedContent).length },
    summary: {
      missingStepReferences: count('step-reference-missing'),
      unpublishedLessonSteps: count('step-lesson-unpublished'),
      requiredPlaceholders: count('required-step-to-produce'), optionalPlaceholders: count('optional-step-to-produce'),
      pathsWithOutput: paths.filter((path) => path.outputs.length).length,
      pathsWithoutOutput: paths.filter((path) => !path.outputs.length).length,
      prerequisiteGaps: prerequisites.length,
      completeSequencePrerequisiteGaps: prerequisites.filter((gap) => gap.scopes.complete).length,
      requiredSequencePrerequisiteGaps: prerequisites.filter((gap) => gap.scopes.required).length,
      pathsWithPrerequisiteGaps: new Set(prerequisites.map((gap) => gap.id)).size,
      derivedPaths: paths.filter((path) => path.time.source === 'derived').length,
      declaredPaths: paths.filter((path) => path.time.source === 'declared').length,
      incompleteDerivedPaths: paths.filter((path) => path.time.coverage === 'incomplete').length,
      emptyCourses: courses.filter((course) => course.coverage === 'empty').length,
      partialCourses: courses.filter((course) => course.coverage === 'partial').length,
      findingsByCategory: Object.fromEntries(['integrity', 'metadata', 'decision'].map((category) => [
        category, findings.filter((finding) => finding.category === category).length,
      ])),
    },
    findings, parcours: paths, courses,
  };
}

function readArray(file, field) {
  const value = JSON.parse(readFileSync(file, 'utf8'));
  const records = field ? value?.[field] : value;
  if (!Array.isArray(records)) throw new TypeError(`${file}${field ? `.${field}` : ''} : tableau attendu`);
  return records;
}

function loadCorpus(dataDir) {
  const corpus = Object.fromEntries(['parcours', 'courses', 'lessons', 'caseStudies', 'simulators', 'deliverables', 'glossary', 'diagnostics']
    .map((collection) => [collection, readArray(join(dataDir, `${collection}.json`))]));
  for (const file of readdirSync(join(dataDir, 'parcours')).filter((file) => file.endsWith('.lessons.json')).sort()) {
    corpus.lessons.push(...readArray(join(dataDir, 'parcours', file), 'lessons'));
  }
  return corpus;
}

function humanReport(report) {
  const { inventory: i, summary: s } = report;
  const lines = [
    'Formation — diagnostic non bloquant (F0/S0)',
    `${i.parcours} parcours ; ${i.courses} cours ; ${i.lessons} leçons, dont ${i.publishedLessons} publiées.`,
    `Références absentes : ${s.missingStepReferences} ; étapes de leçons non publiées : ${s.unpublishedLessonSteps}.`,
    `À produire : ${s.requiredPlaceholders} requises, ${s.optionalPlaceholders} facultatives.`,
    `Sortie résolue : ${s.pathsWithOutput} parcours ; sans sortie résolue : ${s.pathsWithoutOutput} (à qualifier, pas une obligation de livrable).`,
    `Prérequis : ${s.prerequisiteGaps} écarts distincts dans ${s.pathsWithPrerequisiteGaps} parcours (${s.completeSequencePrerequisiteGaps} en séquence complète ; ${s.requiredSequencePrerequisiteGaps} en séquence requise).`,
    `Durées : ${s.derivedPaths} dérivées, dont ${s.incompleteDerivedPaths} à couverture incomplète ; ${s.declaredPaths} déclarées non auditées.`,
    `Cours : ${s.emptyCourses} sans leçon publiée ; ${s.partialCourses} partiellement publiés.`,
  ];
  for (const [category, label] of [['integrity', 'Constats d’intégrité'], ['metadata', 'Métadonnées non modélisées ou estimations absentes'], ['decision', 'Arbitrages pédagogiques ouverts']]) {
    lines.push(`\n${label} : ${s.findingsByCategory[category]}`);
    for (const finding of report.findings.filter((finding) => finding.category === category)) {
      const subject = `${finding.collection}${finding.id ? `/${finding.id}` : ''}`;
      const detail = finding.prerequisiteId ? ` ${finding.lessonId ?? 'entrée'} → ${finding.prerequisiteId} ${JSON.stringify(finding.scopes ?? {})}`
        : finding.refId ? ` ${finding.refKind}:${finding.refId}${finding.field ? `.${finding.field}` : ''}`
          : finding.ids ? ` (${finding.ids.length} ressources)` : '';
      lines.push(`- [${finding.code}] ${subject}${detail} — ${finding.message}`);
    }
  }
  lines.push('\nMéthode :', ...Object.values(report.definitions).map((definition) => `- ${definition}`),
    '\nExit 0 = diagnostic exécuté, pas Formation validée. Aucune écriture. --json fournit le rapport détaillé.');
  return `${lines.join('\n')}\n`;
}

function main(args) {
  let dataDir = fileURLToPath(new URL('../data/', import.meta.url));
  let json = false;
  let help = false;
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === '--json') json = true;
    else if (args[index] === '--help') help = true;
    else if (args[index] === '--data-dir' && args[index + 1] && !args[index + 1].startsWith('--')) dataDir = resolve(args[++index]);
    else {
      console.error(`formation-readiness : argument invalide ou valeur absente : ${args[index]}`);
      return 2;
    }
  }
  if (help) {
    console.log('Usage: node scripts/formation-readiness.mjs [--json] [--data-dir DIRECTORY]\nDiagnostic sans écriture. Exit 0 : rapport produit ; 1 : entrée inexploitable ; 2 : arguments invalides.');
    return 0;
  }
  try {
    const report = diagnoseFormation(loadCorpus(dataDir));
    process.stdout.write(json ? `${JSON.stringify(report, null, 2)}\n` : humanReport(report));
    return 0;
  } catch (error) {
    console.error(`formation-readiness : ${error.message}`);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
