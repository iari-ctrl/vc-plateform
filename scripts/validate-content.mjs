#!/usr/bin/env node
/**
 * Content integrity check for the VC Premium JSON sources (`/data/*.json`,
 * `/data/blog/*.json`, and generated drop-in registries).
 *
 * Three layers of validation, from the inside out:
 *   1. SHAPE      — Zod schemas validate every JSON file's structure & types.
 *   2. REFERENCES — cross-file ids/slugs resolve (pathId, courseId, lessonIds,
 *                   relatedLessonIds, glossaryRefs, furtherReading.ref, ikigai
 *                   recommendedPathIds / profileIds …) and ids/slugs are unique.
 *   3. MARKERS    — every inline [[slug|label]] / {{slug|label}} resolves to a
 *                   glossary slug (the original check, preserved).
 *
 * Plus an explicit QUIZ rule: malformed quizzes are errors; lessons missing a
 * quiz are reported as warnings (a content gap, not a broken build).
 *
 * Run: `npm run validate:content`  — exits non-zero on any error.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { z } from 'zod';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'data');

/** Minimum quiz questions expected per lesson (missing quiz → warning). */
const MIN_QUIZ_QUESTIONS = 1;

// ── Tiny report harness ──────────────────────────────────────────────────────
// Three tiers: errors (always fatal), warnings (integrity gaps — fatal under
// --strict), and softWarnings (acknowledged content backlog, e.g. lessons still
// missing a quiz — reported but never fatal, even strict). The soft tier lets
// CI run --strict for zero-tolerance on integrity without blocking on content
// that is simply not written yet.
const errors = [];
const warnings = [];
const softWarnings = [];
const err = (msg) => errors.push(msg);
const warn = (msg) => warnings.push(msg);
const soft = (msg) => softWarnings.push(msg);

const readJson = (name) => {
  try {
    return JSON.parse(readFileSync(join(dataDir, name), 'utf8'));
  } catch (e) {
    err(`${name} — illisible ou JSON invalide : ${e.message}`);
    return undefined;
  }
};

const listJsonFiles = (name) => {
  try {
    return readdirSync(join(dataDir, name))
      .filter((file) => file.endsWith('.json'))
      .sort();
  } catch (e) {
    err(`${name}/ — dossier illisible : ${e.message}`);
    return [];
  }
};

/** Validate `value` against `schema`; push prefixed issues to errors. */
const check = (label, schema, value) => {
  if (value === undefined) return undefined;
  const res = schema.safeParse(value);
  if (!res.success) {
    for (const i of res.error.issues) {
      err(`${label} ${i.path.length ? `[${i.path.join('.')}]` : ''} — ${i.message}`);
    }
    return undefined;
  }
  return res.data;
};

/** Flag duplicate values of `key` across `rows`. */
const assertUnique = (label, rows, key) => {
  const seen = new Map();
  for (let idx = 0; idx < rows.length; idx++) {
    const v = rows[idx][key];
    if (seen.has(v)) err(`${label} — ${key} en double : "${v}" (positions ${seen.get(v)} et ${idx})`);
    else seen.set(v, idx);
  }
};

// ── Shared scalars ───────────────────────────────────────────────────────────
const nonEmpty = z.string().min(1);
const slug = z.string().regex(/^[a-z0-9-]+$/, 'doit être un slug en minuscules (a-z, 0-9, -)');
const level = z.enum(['debutant', 'intermediaire', 'avance', 'tous']);
const idList = z.array(z.string());

// ── Schemas ──────────────────────────────────────────────────────────────────
const pathSchema = z.object({
  id: nonEmpty,
  slug,
  order: z.number().int().nonnegative(),
  title: nonEmpty,
  subtitle: z.string(),
  level,
  accent: z.string(),
  kanji: z.string().optional(),
  durationHours: z.number().nonnegative(),
  summary: nonEmpty,
  forWhom: z.array(z.string()),
  outcomes: z.array(z.string()),
  courseIds: idList,
}).strict();

const courseSchema = z.object({
  id: nonEmpty,
  slug,
  pathId: nonEmpty,
  order: z.number().int().nonnegative(),
  title: nonEmpty,
  subtitle: z.string(),
  level,
  durationMin: z.number().nonnegative(),
  summary: nonEmpty,
  tags: z.array(z.string()),
  lessonIds: idList,
}).strict();

const quizQuestionSchema = z.object({
  question: nonEmpty,
  options: z.array(z.object({ text: nonEmpty, correct: z.boolean() })).min(2),
  explanation: nonEmpty,
}).strict();

const furtherReadingSchema = z.object({
  label: nonEmpty,
  kind: z.string(),
  ref: nonEmpty,
}).strict();

const lessonSchema = z.object({
  id: nonEmpty,
  slug,
  courseId: nonEmpty,
  order: z.number().int().nonnegative(),
  title: nonEmpty,
  kicker: z.string(),
  readMin: z.number().nonnegative(),
  summary: nonEmpty,
  body: nonEmpty,
  bodyShort: nonEmpty.optional(),
  keyTakeaways: z.array(z.string()),
  glossaryRefs: idList,
  quiz: z.array(quizQuestionSchema).optional(),
  furtherReading: z.array(furtherReadingSchema).optional(),
}).strict();

const localizedText = z.union([nonEmpty, z.record(z.string(), z.string())]);
const parcoursFamily = z.enum(['decouvrir', 'entretien', 'levee', 'grade', 'maitriser', 'express']);
const parcoursRoadmap = z.enum(['now', 'next', 'later']);
const perspective = z.enum(['founder', 'investor', 'both']);
const gating = z.enum(['soft', 'lock']);
const timeBudget = z.enum(['low', 'medium', 'high']);
const stepType = z.enum(['coeur', 'bonus', 'pratique', 'respiration']);
const stepRefKind = z.enum(['lesson', 'course', 'case', 'simulator', 'glossary', 'milestone']);

const parcoursStepSchema = z.object({
  order: z.number().int().positive(),
  type: stepType,
  ref: z.object({ kind: stepRefKind, id: nonEmpty }).strict(),
  label: localizedText,
  status: z.enum(['existant', 'a-produire']),
  keystone: z.boolean().optional(),
  prereqNote: localizedText.optional(),
  note: z.string().optional(),
}).strict();

const parcoursSchema = z.object({
  id: nonEmpty,
  slug,
  family: parcoursFamily,
  roadmap: parcoursRoadmap,
  title: localizedText,
  hook: localizedText,
  kanji: z.string().optional(),
  accent: z.string().optional(),
  goal: localizedText,
  forWhom: z.array(localizedText),
  perspective: perspective.optional(),
  level,
  entryLevel: level,
  time: z.object({
    coreHours: z.number().nonnegative(),
    withBonusHours: z.number().nonnegative().optional(),
    sessions: z.number().int().positive().optional(),
    cadence: localizedText.optional(),
  }).strict(),
  timeFit: z.array(timeBudget),
  prerequisites: z.array(localizedText).optional(),
  gating: gating.optional(),
  recommendedForProfiles: idList,
  milestone: z.object({
    type: z.string(),
    label: localizedText,
    description: localizedText,
    evaluation: z.array(z.enum(['auto', 'peer'])).optional(),
    rubricId: z.string().optional(),
    modelAnswerId: z.string().optional(),
  }).strict().optional(),
  steps: z.array(parcoursStepSchema).min(1),
  outcomes: z.array(localizedText),
}).strict();

const parcoursLessonsDocSchema = z.object({
  _doc: z.string().optional(),
  register: z.string().optional(),
  parcoursId: nonEmpty,
  courseId: nonEmpty,
  lessons: z.array(lessonSchema),
}).strict();

const profileParcoursSchema = z.object({
  _doc: z.string().optional(),
  byProfile: z.record(z.string(), z.object({
    primary: nonEmpty,
    then: idList,
    express: z.string().optional(),
    note: z.string().optional(),
  }).strict()),
  byArchetype: z.record(z.string(), z.object({
    label: nonEmpty,
    bundle: idList,
  }).strict()),
  timeCalibration: z.record(timeBudget, z.object({
    show: z.array(stepType),
    cadence: nonEmpty,
  }).strict()),
}).strict();

const parcoursConfigSchema = z.object({
  _doc: z.string().optional(),
  i18n: z.object({
    defaultLocale: nonEmpty,
    locales: z.array(nonEmpty),
    overrideFiles: z.record(z.string(), nonEmpty),
    note: z.string().optional(),
  }).strict(),
  gating: z.object({
    default: gating,
    lockable: z.boolean(),
    note: z.string().optional(),
  }).strict(),
  milestoneEvaluation: z.object({
    default: z.array(z.enum(['auto', 'peer'])),
    withDeliverableDefault: z.array(z.enum(['auto', 'peer'])),
    note: z.string().optional(),
  }).strict(),
  perspective: z.object({
    default: perspective,
    note: z.string().optional(),
  }).strict(),
  naming: z.object({
    bibliotheque: nonEmpty,
    rayons: nonEmpty,
    parcours: nonEmpty,
    atomes: z.array(nonEmpty),
  }).strict(),
}).strict();

const parcoursOverrideSchema = z.object({
  _doc: z.string().optional(),
  locale: nonEmpty,
  overrides: z.record(z.string(), z.record(z.string(), z.unknown())),
}).strict();

const glossarySchema = z.object({
  id: nonEmpty,
  term: nonEmpty,
  slug,
  aliases: z.array(nonEmpty).optional(),
  latin: z.string().optional(),
  category: z.string(),
  short: z.string(),
  definition: nonEmpty,
  example: z.string().optional(),
  link: z.string().optional(),
  seeAlso: idList,
  relatedLessonIds: idList,
}).strict();

const caseStudySchema = z.object({
  id: nonEmpty,
  slug,
  title: nonEmpty,
  subtitle: z.string(),
  kind: z.string(),
  company: z.string(),
  year: z.number().int(),
  readMin: z.number().nonnegative(),
  summary: nonEmpty,
  tags: z.array(z.string()),
  glossaryRefs: idList,
  sections: z.array(z.object({ heading: nonEmpty, body: nonEmpty })).min(1),
  takeaways: z.array(z.string()),
}).strict();

// A « livrable » is the hands-on end of a parcours milestone: a brief + a
// template + a self-assessment rubric + a pointer to an existing intelligence
// artifact used as the worked model.
const deliverableSchema = z.object({
  id: nonEmpty,
  slug,
  title: nonEmpty,
  kicker: z.string().optional(),
  readMin: z.number().nonnegative(),
  summary: nonEmpty,
  brief: nonEmpty,
  template: z.array(z.object({ heading: nonEmpty, prompt: nonEmpty }).strict()).min(1),
  rubric: z.array(z.object({ criterion: nonEmpty, check: nonEmpty }).strict()).min(1),
  model: z.object({
    kind: z.enum(['ecosystem', 'case', 'memo', 'lesson']),
    id: nonEmpty,
    note: z.string(),
  }).strict().optional(),
  relatedLessonIds: idList.optional(),
  glossaryRefs: idList.optional(),
  tags: z.array(z.string()).optional(),
}).strict();

const blogSchema = z.object({
  id: nonEmpty,
  slug,
  title: nonEmpty,
  subtitle: z.string(),
  author: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'date attendue au format ISO (YYYY-MM-DD)'),
  readMin: z.number().nonnegative(),
  category: z.string(),
  excerpt: z.string(),
  tags: z.array(z.string()),
  body: nonEmpty,
  books: z.array(z.object({
    title: nonEmpty,
    author: nonEmpty,
    year: z.number().int().optional(),
  }).strict()).optional(),
  glossaryRefs: idList.optional(),
}).strict();

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}/, 'date attendue au format ISO (YYYY-MM-DD)');

// Figures attachées aux sections d'un dossier — graphiques de données ou schémas
// conceptuels, rendus en SVG. Union discriminée par `kind` (cf. EcosystemFigure).
const figureRating = z.enum(['none', 'low', 'mid', 'high']);
const ecosystemFigure = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('bars'),
    title: nonEmpty,
    caption: z.string().optional(),
    unit: z.string().optional(),
    source: z.string().optional(),
    bars: z.array(z.object({
      label: nonEmpty,
      value: z.number(),
      valueLabel: z.string().optional(),
      highlight: z.boolean().optional(),
    }).strict()).min(1),
  }).strict(),
  z.object({
    kind: z.literal('line'),
    title: nonEmpty,
    caption: z.string().optional(),
    unit: z.string().optional(),
    source: z.string().optional(),
    points: z.array(z.object({
      x: nonEmpty,
      y: z.number(),
      annotation: z.string().optional(),
    }).strict()).min(2),
  }).strict(),
  z.object({
    kind: z.literal('matrix'),
    title: nonEmpty,
    caption: z.string().optional(),
    source: z.string().optional(),
    columns: z.array(nonEmpty).min(2),
    rows: z.array(z.object({
      label: nonEmpty,
      cells: z.array(z.object({ rating: figureRating, note: z.string().optional() }).strict()).min(1),
    }).strict()).min(1),
  }).strict(),
  z.object({
    kind: z.literal('quadrant'),
    title: nonEmpty,
    caption: z.string().optional(),
    source: z.string().optional(),
    xAxis: z.tuple([nonEmpty, nonEmpty]),
    yAxis: z.tuple([nonEmpty, nonEmpty]),
    items: z.array(z.object({
      label: nonEmpty,
      x: z.number(),
      y: z.number(),
      highlight: z.boolean().optional(),
    }).strict()).min(1),
  }).strict(),
  z.object({
    kind: z.literal('taxonomy'),
    title: nonEmpty,
    caption: z.string().optional(),
    source: z.string().optional(),
    root: nonEmpty,
    branches: z.array(z.object({
      label: nonEmpty,
      note: z.string().optional(),
      items: z.array(nonEmpty),
      highlight: z.boolean().optional(),
    }).strict()).min(1),
  }).strict(),
]);

const ecosystemSchema = z.object({
  id: nonEmpty,
  slug,
  name: nonEmpty,
  title: nonEmpty,
  subtitle: z.string(),
  kind: z.enum(['geographie', 'secteur', 'these']),
  accent: z.string(),
  author: z.string(),
  createdAt: isoDate,
  updatedAt: isoDate,
  readMin: z.number().nonnegative(),
  summary: nonEmpty,
  tags: z.array(z.string()),
  // Hierarchy: `parentId` absent ⇒ dossier-racine ; `order` range les frères.
  parentId: z.string().optional(),
  order: z.number().int().optional(),
  // `these` requise sur une racine, facultative en sous-dossier (cf. refine ci-dessous).
  these: nonEmpty.optional(),
  sections: z.array(z.object({
    heading: nonEmpty,
    body: nonEmpty,
    figures: z.array(ecosystemFigure).optional(),
  }).strict()).min(1),
  convictions: z.array(z.object({
    statement: nonEmpty,
    horizon: z.string().optional(),
    strength: z.enum(['exploratoire', 'moyenne', 'forte']),
    rationale: z.string().optional(),
  }).strict()).optional(),
  signals: z.array(z.object({
    label: nonEmpty,
    direction: z.enum(['haussier', 'baissier', 'incertain']),
    note: z.string(),
  }).strict()).optional(),
  players: z.array(z.object({
    name: nonEmpty,
    role: z.string(),
    note: z.string(),
  }).strict()).optional(),
  glossaryRefs: idList,
  sources: z.array(z.object({ label: nonEmpty, url: nonEmpty }).strict()).optional(),
}).strict().refine((e) => e.parentId || (e.these && e.these.trim().length > 0), {
  message: 'un dossier-racine (sans parentId) doit porter une thèse (these)',
  path: ['these'],
});

const simulatorSchema = z.object({
  id: nonEmpty,
  slug,
  title: nonEmpty,
  subtitle: z.string(),
  category: z.string(),
  accent: z.string(),
  description: z.string(),
  relatedLessonIds: idList,
  glossaryRefs: idList,
}).strict();

// Ikigai — looser than the content collections, but still structurally checked.
const dayItem = z.object({ time: z.string(), text: z.string() });
const reflectionQ = z.object({ n: z.string(), q: nonEmpty, hint: z.string() });
const ikigaiSchema = z.object({
  dimensions: z.array(z.object({
    id: nonEmpty, label: nonEmpty, kanji: z.string(), accent: z.string(),
    itemsDecouverte: z.array(z.string()).optional(),
    items: z.array(z.string()),
  })).min(1),
  intersections: z.array(z.object({
    id: nonEmpty, label: nonEmpty, subtitle: z.string(), negative: z.string(),
    exampleDecouverte: z.string().optional(), example: z.string(), warning: z.string(),
  })),
  presqueIkigai: z.array(z.object({
    id: nonEmpty, name: nonEmpty, missingDim: z.string(), formula: z.string(), kanji: z.string(),
    descriptionDecouverte: z.string().optional(), description: z.string(),
    trapDecouverte: z.string().optional(), trap: z.string(),
  })),
  profiles: z.array(z.object({
    id: nonEmpty, name: nonEmpty, tag: z.string(), kanji: z.string(), accent: z.string(),
    description: z.string(), focus: z.array(z.string()),
    recommendedPathIds: idList, signals: z.array(z.string()),
  })).min(1),
  questions: z.array(z.object({
    n: z.string(), q: nonEmpty, hint: z.string(),
    options: z.array(z.object({ text: nonEmpty, points: z.record(z.string(), z.number()) })).min(2),
  })),
  archetypes: z.array(z.object({
    id: nonEmpty, name: nonEmpty, tag: z.string(), kanji: z.string(), accent: z.string(),
    positioningDecouverte: z.string(), positioning: z.string(),
    dayDecouverte: z.array(dayItem), day: z.array(dayItem),
    valueDecouverte: z.string(), value: z.string(),
    signalsDecouverte: z.array(z.string()), signals: z.array(z.string()),
    metrics: z.array(z.string()),
    profileIds: idList, recommendedPathIds: idList,
  })),
  reflection: z.object({
    decouverte: z.array(reflectionQ),
    avance: z.array(reflectionQ),
  }),
  myths: z.array(z.object({
    id: nonEmpty,
    title: nonEmpty,
    myth: nonEmpty,
    reality: nonEmpty,
    fundExample: z.string().optional(),
  })).optional(),
}).strict();

// ── Load + shape-validate ────────────────────────────────────────────────────
const paths = check('paths.json', z.array(pathSchema), readJson('paths.json')) ?? [];
const parcours = check('parcours.json', z.array(parcoursSchema), readJson('parcours.json')) ?? [];
const profileParcours = check('profileParcours.json', profileParcoursSchema, readJson('profileParcours.json'));
const parcoursConfig = check('parcoursConfig.json', parcoursConfigSchema, readJson('parcoursConfig.json'));
const parcoursEn = check('parcours.en.json', parcoursOverrideSchema, readJson('parcours.en.json'));
const courses = check('courses.json', z.array(courseSchema), readJson('courses.json')) ?? [];
const lessons = check('lessons.json', z.array(lessonSchema), readJson('lessons.json')) ?? [];
const glossary = check('glossary.json', z.array(glossarySchema), readJson('glossary.json')) ?? [];
const cases = check('caseStudies.json', z.array(caseStudySchema), readJson('caseStudies.json')) ?? [];
const deliverables = check('deliverables.json', z.array(deliverableSchema), readJson('deliverables.json')) ?? [];
const blogFiles = listJsonFiles('blog');
const blogDocs = blogFiles.flatMap((file) => {
  const doc = readJson(`blog/${file}`);
  return doc === undefined ? [] : [{ file, doc }];
});
const blog = check('blog/*.json', z.array(blogSchema), blogDocs.map(({ doc }) => doc)) ?? [];
const ecosystems = check('ecosystems.json', z.array(ecosystemSchema), readJson('ecosystems.json')) ?? [];
const simulators = check('simulators.json', z.array(simulatorSchema), readJson('simulators.json')) ?? [];
const ikigai = check('ikigai.json', ikigaiSchema, readJson('ikigai.json'));

const parcoursLessonDocs = [];
try {
  for (const file of readdirSync(join(dataDir, 'parcours')).filter((f) => f.endsWith('.lessons.json')).sort()) {
    const doc = check(`parcours/${file}`, parcoursLessonsDocSchema, readJson(`parcours/${file}`));
    if (doc) parcoursLessonDocs.push({ file, ...doc });
  }
} catch (e) {
  err(`parcours/*.lessons.json — dossier illisible : ${e.message}`);
}
const parcoursLessons = parcoursLessonDocs.flatMap((doc) => doc.lessons);
const allLessons = [...lessons, ...parcoursLessons];

// ── Uniqueness ───────────────────────────────────────────────────────────────
assertUnique('paths.json', paths, 'id');
assertUnique('paths.json', paths, 'slug');
assertUnique('parcours.json', parcours, 'id');
assertUnique('parcours.json', parcours, 'slug');
assertUnique('courses.json', courses, 'id');
assertUnique('courses.json', courses, 'slug');
assertUnique('lessons.json', lessons, 'id');
assertUnique('lessons.json', lessons, 'slug');
assertUnique('parcours/*.lessons.json', parcoursLessons, 'id');
assertUnique('parcours/*.lessons.json', parcoursLessons, 'slug');
assertUnique('all lessons', allLessons, 'id');
assertUnique('all lessons', allLessons, 'slug');
assertUnique('glossary.json', glossary, 'id');
assertUnique('glossary.json', glossary, 'slug');
assertUnique('caseStudies.json', cases, 'id');
assertUnique('caseStudies.json', cases, 'slug');
assertUnique('deliverables.json', deliverables, 'id');
assertUnique('deliverables.json', deliverables, 'slug');
assertUnique('blog/*.json', blog, 'id');
assertUnique('blog/*.json', blog, 'slug');
assertUnique('ecosystems.json', ecosystems, 'id');
assertUnique('ecosystems.json', ecosystems, 'slug');
assertUnique('simulators.json', simulators, 'id');
assertUnique('simulators.json', simulators, 'slug');

// ── Reference sets ───────────────────────────────────────────────────────────
const pathIds = new Set(paths.map((p) => p.id));
const parcoursIds = new Set(parcours.map((p) => p.id));
const parcoursSlugs = new Set(parcours.map((p) => p.slug));
const contentContainerIds = new Set([...pathIds, ...parcoursIds]);
const courseIds = new Set(courses.map((c) => c.id));
const lessonIds = new Set(allLessons.map((l) => l.id));
const glossarySlugs = new Set(glossary.map((g) => g.slug));
const glossaryIds = new Set(glossary.map((g) => g.id));
const caseRefs = new Set([...cases.map((c) => c.id), ...cases.map((c) => c.slug)]);
const simRefs = new Set([...simulators.map((s) => s.id), ...simulators.map((s) => s.slug)]);
const profileIds = new Set(ikigai ? ikigai.profiles.map((p) => p.id) : []);
const archetypeIds = new Set(ikigai ? ikigai.archetypes.map((a) => a.id) : []);

const isGlossary = (ref) => glossarySlugs.has(ref) || glossaryIds.has(ref);
const checkRefs = (label, refs, has, kind) => {
  for (const r of refs) if (!has(r)) err(`${label} — ${kind} introuvable : "${r}"`);
};

// ── Referential integrity ────────────────────────────────────────────────────
for (const p of paths) {
  checkRefs(`paths/${p.id}.courseIds`, p.courseIds, (r) => courseIds.has(r), 'cours');
}
for (const c of courses) {
  if (!contentContainerIds.has(c.pathId)) err(`courses/${c.id}.pathId — rayon/parcours introuvable : "${c.pathId}"`);
  checkRefs(`courses/${c.id}.lessonIds`, c.lessonIds, (r) => lessonIds.has(r), 'leçon');
}
for (const doc of parcoursLessonDocs) {
  if (!parcoursIds.has(doc.parcoursId)) err(`parcours/${doc.file}.parcoursId — parcours introuvable : "${doc.parcoursId}"`);
  if (!courseIds.has(doc.courseId)) err(`parcours/${doc.file}.courseId — cours introuvable : "${doc.courseId}"`);
  for (const l of doc.lessons) {
    if (l.courseId !== doc.courseId) err(`parcours/${doc.file}/${l.id}.courseId — attendu "${doc.courseId}", trouvé "${l.courseId}"`);
  }
}
for (const l of allLessons) {
  if (!courseIds.has(l.courseId)) err(`lessons/${l.id}.courseId — cours introuvable : "${l.courseId}"`);
  checkRefs(`lessons/${l.id}.glossaryRefs`, l.glossaryRefs, isGlossary, 'terme de glossaire');
  for (const fr of l.furtherReading ?? []) {
    const resolvers = {
      lesson: (r) => lessonIds.has(r),
      course: (r) => courseIds.has(r),
      simulator: (r) => simRefs.has(r),
      case: (r) => caseRefs.has(r),
      glossary: isGlossary,
    };
    const resolve = resolvers[fr.kind];
    if (!resolve) warn(`lessons/${l.id}.furtherReading — type inconnu "${fr.kind}" (réf "${fr.ref}" non vérifiée)`);
    else if (!resolve(fr.ref)) err(`lessons/${l.id}.furtherReading — ${fr.kind} introuvable : "${fr.ref}"`);
  }
}
for (const g of glossary) {
  checkRefs(`glossary/${g.slug}.relatedLessonIds`, g.relatedLessonIds, (r) => lessonIds.has(r), 'leçon');
  for (const s of g.seeAlso) if (!glossarySlugs.has(s)) warn(`glossary/${g.slug}.seeAlso — slug sans cible : "${s}"`);
}
for (const c of cases) {
  checkRefs(`caseStudies/${c.id}.glossaryRefs`, c.glossaryRefs, isGlossary, 'terme de glossaire');
}
for (const b of blog) {
  if (b.glossaryRefs) checkRefs(`blog/${b.id}.glossaryRefs`, b.glossaryRefs, isGlossary, 'terme de glossaire');
}
for (const { file, doc } of blogDocs) {
  if (typeof doc?.slug === 'string' && file !== `${doc.slug}.json`)
    err(`blog/${file} — le nom du fichier doit suivre le slug : "${doc.slug}.json"`);
}
const ecosystemIds = new Set(ecosystems.map((e) => e.id));
for (const e of ecosystems) {
  checkRefs(`ecosystems/${e.id}.glossaryRefs`, e.glossaryRefs, isGlossary, 'terme de glossaire');
  if (e.parentId !== undefined) {
    if (e.parentId === e.id) err(`ecosystems/${e.id}.parentId — un dossier ne peut pas être son propre parent`);
    else if (!ecosystemIds.has(e.parentId)) err(`ecosystems/${e.id}.parentId — dossier parent introuvable : "${e.parentId}"`);
  }
}
// Cycle detection — walk each chain up to the root; a revisited id means a loop.
for (const e of ecosystems) {
  const seen = new Set([e.id]);
  let cur = e.parentId ? ecosystems.find((x) => x.id === e.parentId) : undefined;
  while (cur) {
    if (seen.has(cur.id)) { err(`ecosystems/${e.id} — cycle de parenté détecté via "${cur.id}"`); break; }
    seen.add(cur.id);
    cur = cur.parentId ? ecosystems.find((x) => x.id === cur.parentId) : undefined;
  }
}
for (const s of simulators) {
  checkRefs(`simulators/${s.id}.relatedLessonIds`, s.relatedLessonIds, (r) => lessonIds.has(r), 'leçon');
  checkRefs(`simulators/${s.id}.glossaryRefs`, s.glossaryRefs, isGlossary, 'terme de glossaire');
}
// Livrables: relatedLessonIds, glossaryRefs and the model exemplar must resolve.
// `memos.json` is loaded only to resolve a `model.kind: "memo"` reference.
const memos = readJson('memos.json') ?? [];
const memoRefs = new Set((Array.isArray(memos) ? memos : []).flatMap((m) => [m.id, m.slug].filter(Boolean)));
const deliverableIds = new Set(deliverables.map((d) => d.id));
const modelResolvers = {
  ecosystem: (r) => ecosystemIds.has(r),
  case: (r) => caseRefs.has(r),
  memo: (r) => memoRefs.has(r),
  lesson: (r) => lessonIds.has(r),
};
for (const d of deliverables) {
  if (d.relatedLessonIds) checkRefs(`deliverables/${d.id}.relatedLessonIds`, d.relatedLessonIds, (r) => lessonIds.has(r), 'leçon');
  if (d.glossaryRefs) checkRefs(`deliverables/${d.id}.glossaryRefs`, d.glossaryRefs, isGlossary, 'terme de glossaire');
  if (d.model && !modelResolvers[d.model.kind](d.model.id))
    err(`deliverables/${d.id}.model — ${d.model.kind} introuvable : "${d.model.id}"`);
}
for (const p of parcours) {
  checkRefs(`parcours/${p.id}.recommendedForProfiles`, p.recommendedForProfiles, (r) => profileIds.has(r), 'profil');
  p.steps.forEach((step) => {
    const ref = step.ref.id;
    const label = `parcours/${p.id}.steps[${step.order}]`;
    const resolvers = {
      lesson: (r) => lessonIds.has(r),
      course: (r) => courseIds.has(r),
      case: (r) => caseRefs.has(r),
      simulator: (r) => simRefs.has(r),
      glossary: isGlossary,
      // Mirrors resolveStep (client/src/content/parcours.ts): a milestone resolves
      // to a livrable first, then falls back to a lesson (preserves `lea-mock`).
      milestone: (r) => deliverableIds.has(r) || lessonIds.has(r),
    };
    // `a-produire` milestones with no livrable/lesson yet are intentional placeholders.
    if (step.ref.kind === 'milestone' && step.status === 'a-produire' && !deliverableIds.has(ref) && !lessonIds.has(ref)) return;
    if (!resolvers[step.ref.kind](ref)) err(`${label}.ref — ${step.ref.kind} introuvable : "${ref}"`);
  });
}
if (profileParcours) {
  for (const [profileId, route] of Object.entries(profileParcours.byProfile)) {
    if (!profileIds.has(profileId)) err(`profileParcours.byProfile — profil introuvable : "${profileId}"`);
    checkRefs(`profileParcours.byProfile/${profileId}`, [route.primary, ...(route.then ?? []), route.express].filter(Boolean), (r) => parcoursIds.has(r), 'parcours');
  }
  for (const [archetypeId, route] of Object.entries(profileParcours.byArchetype)) {
    if (!archetypeIds.has(archetypeId)) err(`profileParcours.byArchetype — archétype introuvable : "${archetypeId}"`);
    checkRefs(`profileParcours.byArchetype/${archetypeId}.bundle`, route.bundle, (r) => parcoursIds.has(r), 'parcours');
  }
}
if (parcoursEn) {
  for (const id of Object.keys(parcoursEn.overrides)) {
    if (!parcoursIds.has(id)) err(`parcours.en.json.overrides — parcours introuvable : "${id}"`);
  }
}
if (ikigai) {
  for (const p of ikigai.profiles)
    checkRefs(`ikigai.profiles/${p.id}.recommendedPathIds`, p.recommendedPathIds, (r) => contentContainerIds.has(r), 'rayon/parcours');
  for (const a of ikigai.archetypes) {
    checkRefs(`ikigai.archetypes/${a.id}.profileIds`, a.profileIds, (r) => profileIds.has(r), 'profil');
    checkRefs(`ikigai.archetypes/${a.id}.recommendedPathIds`, a.recommendedPathIds, (r) => contentContainerIds.has(r), 'rayon/parcours');
  }
  ikigai.questions.forEach((q, qi) => {
    q.options.forEach((o, oi) => {
      for (const key of Object.keys(o.points))
        if (!profileIds.has(key)) err(`ikigai.questions[${qi}].options[${oi}].points — profil inconnu : "${key}"`);
    });
  });
}

// ── Quiz rule ────────────────────────────────────────────────────────────────
const lessonsWithoutQuiz = [];
for (const l of allLessons) {
  const quiz = l.quiz ?? [];
  if (quiz.length < MIN_QUIZ_QUESTIONS) {
    lessonsWithoutQuiz.push(l.id);
    continue;
  }
  quiz.forEach((qq, qi) => {
    const correct = qq.options.filter((o) => o.correct).length;
    if (correct !== 1)
      err(`lessons/${l.id}.quiz[${qi}] — exactement 1 bonne réponse attendue, ${correct} trouvée(s).`);
  });
}
if (lessonsWithoutQuiz.length)
  soft(`${lessonsWithoutQuiz.length}/${allLessons.length} leçon(s) sans quiz : ${lessonsWithoutQuiz.join(', ')}`);

// ── Glossary markers ([[..]] / {{..}}) ──────────────────────────────────────
const MARKER = /(?:\[\[|\{\{)([^\]}|]+)(?:\|[^\]}]*)?(?:\]\]|\}\})/g;
const MARKER_FILES = [
  'ikigai.json',
  'lessons.json',
  ...blogFiles.map((file) => `blog/${file}`),
  'ecosystems.json',
  'caseStudies.json',
  'deliverables.json',
  'courses.json',
  'paths.json',
  'parcours.json',
  'parcours.en.json',
  'simulators.json',
  ...parcoursLessonDocs.map((doc) => `parcours/${doc.file}`),
];
let markerCount = 0;
for (const file of MARKER_FILES) {
  let raw;
  try {
    raw = readFileSync(join(dataDir, file), 'utf8');
  } catch {
    continue;
  }
  for (const m of raw.matchAll(MARKER)) {
    markerCount += 1;
    const s = m[1].trim();
    if (!glossarySlugs.has(s)) err(`${file} — marqueur vers un slug inexistant : [[${s}]]`);
  }
}

// ── Report ───────────────────────────────────────────────────────────────────
console.log('Validation du contenu VC Premium');
console.log(`→ ${parcours.length} parcours · ${paths.length} rayon(s) hérités · ${courses.length} cours · ${allLessons.length} leçons · ${glossary.length} termes`);
console.log(`→ ${parcoursLessons.length} leçon(s) de parcours drop-in · ${parcoursLessonDocs.length} registre(s)`);
console.log(`→ ${cases.length} études de cas · ${deliverables.length} livrable(s) · ${blog.length} articles · ${ecosystems.length} dossier(s) d'écosystème · ${simulators.length} simulateurs`);
console.log(`→ ${markerCount} marqueur(s) [[..]] / {{..}} analysés`);

if (warnings.length) {
  console.warn(`\n⚠ ${warnings.length} avertissement(s) d'intégrité :`);
  for (const w of warnings) console.warn(`   · ${w}`);
}

if (softWarnings.length) {
  console.warn(`\n· ${softWarnings.length} lacune(s) de contenu (non bloquant, même en strict) :`);
  for (const w of softWarnings) console.warn(`   · ${w}`);
}

if (errors.length) {
  console.error(`\n✗ ${errors.length} erreur(s) :`);
  for (const e of errors) console.error(`   · ${e}`);
  console.error('\nCorrigez les erreurs ci-dessus (data/**/*.json) avant de continuer.');
  process.exit(1);
}

// Mode strict (CI) : les avertissements d'intégrité (seeAlso sans cible,
// furtherReading non résolu, …) deviennent bloquants. Les lacunes de contenu
// (softWarnings : leçons sans quiz) restent tolérées — c'est un backlog éditorial,
// pas un build cassé. Activé via `--strict` ou VALIDATE_STRICT=1.
const strict = process.argv.includes('--strict') || process.env.VALIDATE_STRICT === '1';
if (strict && warnings.length) {
  console.error(`\n✗ Mode strict : ${warnings.length} avertissement(s) d'intégrité traité(s) comme erreur(s).`);
  process.exit(1);
}

console.log(`\n✓ Contenu valide : structure, références et marqueurs cohérents.${strict ? ' (strict)' : ''}`);
