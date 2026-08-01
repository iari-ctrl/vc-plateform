import { describe, expect, it } from 'vitest';

import certificationsJson from '@data/certifications.json';
import coursesJson from '@data/courses.json';
import glossaryJson from '@data/glossary.json';
import lessonsJson from '@data/lessons.json';
import canonicalGlossaryJson from '@data/sources/canonical-glossary.json';

import type { Certification, ProfessionalCertification } from './certifications';
import type { Course, Lesson } from './types';

const courses = coursesJson as Course[];
const lessons = lessonsJson as Lesson[];
const certifications = certificationsJson as Certification[];
const glossary = glossaryJson as Array<{
  slug: string;
  term: string;
  short: string;
  definition: string;
  example?: string;
  aliases?: string[];
  relatedLessonIds?: string[];
}>;
const canonicalGlossary = canonicalGlossaryJson as Array<{
  slug: string;
  canonicalTerm: string;
  short?: string;
  definition?: string;
  example?: string;
  aliases?: string[];
  sourceStatus?: string;
  relatedLessonIds?: string[];
}>;

const READ_WORD_RE = /\p{L}+(?:['’.-]\p{L}+)*|\d+(?:[.,]\d+)*/gu;
const HTTPS_MARKDOWN_LINK_RE = /\[[^\]]+\]\(https:\/\/[^)]+\)/gu;
const HTTPS_MARKDOWN_URL_RE = /\[[^\]]+\]\((https:\/\/[^)]+)\)/u;
const DATED_REFERENCE_RE = /(?:19|20)\d{2}/u;

type MarkdownTable = {
  headers: string[];
  rows: string[][];
  text: string;
};

const TARGET_LESSONS = [
  {
    id: 'l-stage-seed-commercial',
    courseId: 'c-analyst-stage',
    order: 3,
    contexts: { fundStages: ['seed'] },
    prerequisiteLessonIds: ['l-traction-unit-economics'],
    assessmentId: 'analyst-stage-seed',
    sourceUrls: [
      'https://www.franceinvest.eu/wp-content/uploads/2022/02/France-Invest-Guide-du-capital-innovation-2019-1.pdf',
      'https://chartmogul.com/reports/saas-retention-the-new-normal/',
      'https://www.highalpha.com/saas-benchmarks/2024',
    ],
  },
  {
    id: 'l-stage-seed-financing',
    courseId: 'c-analyst-stage',
    order: 4,
    contexts: { fundStages: ['seed'] },
    prerequisiteLessonIds: ['lmv-pre-post-ownership'],
    assessmentId: 'analyst-stage-seed',
    sourceUrls: [
      'https://www.franceinvest.eu/wp-content/uploads/2022/02/France-Invest-Guide-du-capital-innovation-2019-1.pdf',
      'https://cdn.prod.website-files.com/666ae58ed4f8451dd6a96db4/667b2227977c529eb3f56f7e_galion-term-sheet-illustrated.pdf',
      'https://www.privateequityvaluation.com/Portals/0/Documents/Guidelines/IPEV%20Valuation%20Guidelines%20-%20December%202022.pdf',
    ],
  },
  {
    id: 'l-role-lead-dd',
    courseId: 'c-analyst-deal-role',
    order: 1,
    contexts: { dealRoles: ['lead'] },
    prerequisiteLessonIds: ['l-dd-process'],
    assessmentId: 'analyst-role-lead',
    sourceUrls: [
      'https://www.franceinvest.eu/wp-content/uploads/2021/12/France-Invest-Guide-du-capital-innovation-2019.pdf',
      'https://www.cfainstitute.org/standards/professionals/code-ethics-standards/standards-of-practice-v-a',
      'https://www.amf-france.org/fr/reglementation/regles-professionnelles-approuvees/reglement-de-deontologie-des-societes-de-gestion-de-portefeuille-intervenant-dans-le-capital',
    ],
  },
  {
    id: 'l-role-lead-closing',
    courseId: 'c-analyst-deal-role',
    order: 2,
    contexts: { dealRoles: ['lead'] },
    prerequisiteLessonIds: ['l-role-lead-dd'],
    assessmentId: 'analyst-role-lead',
    sourceUrls: [
      'https://www.franceinvest.eu/wp-content/uploads/2021/12/France-Invest-Guide-du-capital-innovation-2019.pdf',
      'https://www.amf-france.org/fr/reglementation/regles-professionnelles-approuvees/reglement-de-deontologie-des-societes-de-gestion-de-portefeuille-intervenant-dans-le-capital',
      'https://www.ukprivatecapital.co.uk/policy/industry-guidance-standardised-documents/model-documents-for-early-stage-investments.html',
    ],
  },
  {
    id: 'l-specialty-saas-metrics',
    courseId: 'c-analyst-specialties',
    order: 3,
    contexts: { sectors: ['saas'] },
    prerequisiteLessonIds: ['lmv-unit-economics'],
    assessmentId: 'analyst-specialty-saas',
    sourceUrls: [
      'https://chartmogul.com/saas-metrics/',
      'https://chartmogul.com/reports/saas-retention-report/',
      'https://www.paddle.com/resources/annual-recurring-revenue',
      'https://www.paddle.com/resources/payback-period',
    ],
  },
  {
    id: 'l-specialty-saas-gtm',
    courseId: 'c-analyst-specialties',
    order: 4,
    contexts: { sectors: ['saas'] },
    prerequisiteLessonIds: ['l-specialty-saas-metrics'],
    assessmentId: 'analyst-specialty-saas',
    sourceUrls: [
      'https://chartmogul.com/reports/saas-startups-become-what-they-hunt/',
      'https://www.highalpha.com/saas-benchmarks/2024',
      'https://www.geckoboard.com/resources/kpi-examples/lead-velocity-rate/',
      'https://www.paddle.com/resources/customer-acquisition-cost',
    ],
  },
] as const;

const COURSE_IDS = ['c-analyst-stage', 'c-analyst-deal-role', 'c-analyst-specialties'] as const;

function lessonById(id: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === id);
}

function courseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

function analystCertification(): ProfessionalCertification {
  const certification = certifications.find((candidate) => candidate.slug === 'analyste-en-capital-risque');
  expect(certification, 'certification VC Analyst absente').toBeDefined();
  expect(certification?.certificateType, 'VC Analyst doit rester une certification professionnelle').toBe('professional');
  return certification as ProfessionalCertification;
}

function wordCount(text: string): number {
  return text.match(READ_WORD_RE)?.length ?? 0;
}

function headingsFor(body: string): string[] {
  return Array.from(body.matchAll(/^##\s+(.+)$/gmu), (match) => match[1]?.trim() ?? '');
}

function referencesSection(body: string): string {
  const chunks = body.split('## Références');
  expect(chunks, 'une seule section Références est attendue').toHaveLength(2);
  return chunks[1] ?? '';
}

function sectionFor(body: string, heading: string): string {
  const headingMarker = `## ${heading}`;
  const startIndex = body.indexOf(headingMarker);
  expect(startIndex, `section absente : ${heading}`).not.toBe(-1);

  const sectionStart = startIndex + headingMarker.length;
  const rest = body.slice(sectionStart).replace(/^\n\n/u, '');
  const nextHeadingIndex = rest.search(/\n\n##\s+/u);
  return (nextHeadingIndex === -1 ? rest : rest.slice(0, nextHeadingIndex)).trim();
}

function splitMarkdownRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/u, '')
    .replace(/\|$/u, '')
    .split('|')
    .map((cell) => cell.trim());
}

function isMarkdownSeparator(line: string): boolean {
  const cells = splitMarkdownRow(line);
  return cells.length > 1 && cells.every((cell) => /^:?-{3,}:?$/u.test(cell));
}

function markdownTables(section: string): MarkdownTable[] {
  const lines = section.split('\n');
  const tables: MarkdownTable[] = [];

  for (let index = 0; index < lines.length - 1; index += 1) {
    const headerLine = lines[index] ?? '';
    const separatorLine = lines[index + 1] ?? '';
    if (!headerLine.trim().startsWith('|') || !isMarkdownSeparator(separatorLine)) continue;

    const rows: string[][] = [];
    let cursor = index + 2;
    while (cursor < lines.length && (lines[cursor] ?? '').trim().startsWith('|')) {
      rows.push(splitMarkdownRow(lines[cursor] ?? ''));
      cursor += 1;
    }

    tables.push({
      headers: splitMarkdownRow(headerLine),
      rows,
      text: lines.slice(index, cursor).join('\n'),
    });
    index = cursor;
  }

  return tables;
}

function lessonBody(id: string): string {
  const lesson = lessonById(id);
  expect(lesson, `leçon absente : ${id}`).toBeDefined();
  return lesson?.body ?? '';
}

function glossaryEntry(slug: string) {
  const entry = glossary.find((candidate) => candidate.slug === slug);
  expect(entry, `entrée de glossaire absente : ${slug}`).toBeDefined();
  return entry;
}

function canonicalGlossaryEntry(slug: string) {
  const entry = canonicalGlossary.find((candidate) => candidate.slug === slug);
  expect(entry, `entrée canonique absente : ${slug}`).toBeDefined();
  return entry;
}

describe('Analyst Seed × Lead × SaaS', () => {
  it('publie les six leçons contextuelles sans modifier leurs rattachements ni leurs contraintes pédagogiques', () => {
    const targetIds = TARGET_LESSONS.map((target) => target.id);
    const targetLessons = TARGET_LESSONS.map((target) => lessonById(target.id));

    expect(targetLessons.map((lesson) => lesson?.id)).toEqual(targetIds);

    for (const [index, target] of TARGET_LESSONS.entries()) {
      const lesson = targetLessons[index];
      expect(lesson, `leçon absente : ${target.id}`).toBeDefined();
      expect(lesson).toMatchObject({
        id: target.id,
        courseId: target.courseId,
        order: target.order,
        contexts: target.contexts,
        optional: true,
        prerequisiteLessonIds: [...target.prerequisiteLessonIds],
        assessmentId: target.assessmentId,
      });
    }

    const unpublished = targetLessons.flatMap((lesson) => (
      lesson?.status === 'published' ? [] : [`${lesson?.id ?? 'missing'}:${lesson?.status ?? 'missing'}`]
    ));
    expect(unpublished, 'les six fiches doivent être publiées').toEqual([]);

    for (const [index, target] of TARGET_LESSONS.entries()) {
      const lesson = targetLessons[index];
      expect(lesson?.glossaryRefs.length, `${target.id}: glossaryRefs`).toBeGreaterThan(0);
      expect(lesson?.keyTakeaways.length, `${target.id}: keyTakeaways min`).toBeGreaterThanOrEqual(3);
      expect(lesson?.keyTakeaways.length, `${target.id}: keyTakeaways max`).toBeLessThanOrEqual(5);
      expect(lesson?.quiz, `${target.id}: quiz`).toHaveLength(4);

      for (const question of lesson?.quiz ?? []) {
        expect(question.options, `${target.id}: trois choix`).toHaveLength(3);
        expect(question.options.filter((option) => option.correct), `${target.id}: réponse exacte unique`).toHaveLength(1);
        expect(question.explanation.trim().length, `${target.id}: explication`).toBeGreaterThan(0);
      }

      const body = lesson?.body ?? '';
      expect(body, `${target.id}: corps`).not.toContain('## À retenir');
      expect(headingsFor(body), `${target.id}: sections éditoriales`).toEqual([
        'Cadre',
        'Méthode',
        expect.stringMatching(/^(?:Exemple|Cas d[’']application)$/u),
        'Limites et points de contrôle',
        'Mise en application',
        'Références',
      ]);

      const instructionalBody = body.split('## Références')[0] ?? '';
      const instructionalWords = wordCount(instructionalBody);
      const totalWords = wordCount(body);
      const references = referencesSection(body);
      const sourceLinks = references.match(HTTPS_MARKDOWN_LINK_RE) ?? [];
      const sourceUrls = sourceLinks.map((link) => link.match(HTTPS_MARKDOWN_URL_RE)?.[1] ?? '');
      const referenceLines = references.split('\n').filter((line) => line.startsWith('- ['));

      expect(instructionalWords, `${target.id}: longueur pédagogique min`).toBeGreaterThanOrEqual(900);
      expect(instructionalWords, `${target.id}: longueur pédagogique max`).toBeLessThanOrEqual(1400);
      expect(lesson?.readMin, `${target.id}: readMin dérivé`).toBe(Math.ceil(totalWords / 180));
      expect(sourceLinks.length, `${target.id}: liens HTTPS`).toBeGreaterThanOrEqual(2);
      expect(sourceLinks.length, `${target.id}: liens HTTPS`).toBeLessThanOrEqual(4);
      expect(sourceUrls, `${target.id}: sources retenues`).toEqual([...target.sourceUrls]);
      expect(referenceLines, `${target.id}: références structurées`).toHaveLength(sourceLinks.length);
      for (const referenceLine of referenceLines) {
        expect(referenceLine, `${target.id}: référence datée`).toMatch(DATED_REFERENCE_RE);
      }
    }
  });

  it('dérive les durées des trois cours depuis leurs leçons canoniques', () => {
    const unpublished = TARGET_LESSONS.flatMap((target) => {
      const lesson = lessonById(target.id);
      return lesson?.status === 'published' ? [] : [`${target.id}:${lesson?.status ?? 'missing'}`];
    });
    expect(unpublished, 'précondition de publication des six fiches').toEqual([]);

    for (const courseId of COURSE_IDS) {
      const course = courseById(courseId);
      expect(course, `${courseId}: cours absent`).toBeDefined();
      expect(course?.durationSource, `${courseId}: durée dérivée`).toBe('lesson-read-minutes');
      expect(course?.durationMin, `${courseId}: somme des readMin`).toBe(
        (course?.lessonIds ?? []).reduce((sum, lessonId) => sum + (lessonById(lessonId)?.readMin ?? 0), 0),
      );
    }
  });

  it('relie la composition Seed–Lead–SaaS exactement aux six leçons contextuelles', () => {
    const analyst = analystCertification();
    const seed = analyst.axes.fundStage.options.find((option) => option.id === 'seed');
    const lead = analyst.axes.dealRole.options.find((option) => option.id === 'lead');
    const saas = analyst.axes.specialty.options.find((option) => option.id === 'saas');

    expect(seed?.requirement).toMatchObject({
      id: 'stage-seed',
      courseId: 'c-analyst-stage',
      assessmentVariantId: 'analyst-stage-seed',
      lessonIds: ['l-stage-seed-commercial', 'l-stage-seed-financing'],
    });
    expect(lead?.requirement).toMatchObject({
      id: 'role-lead',
      courseId: 'c-analyst-deal-role',
      assessmentVariantId: 'analyst-role-lead',
      lessonIds: ['l-role-lead-dd', 'l-role-lead-closing'],
    });
    expect(saas?.requirement).toMatchObject({
      id: 'specialty-saas',
      courseId: 'c-analyst-specialties',
      assessmentVariantId: 'analyst-specialty-saas',
      lessonIds: ['l-specialty-saas-metrics', 'l-specialty-saas-gtm'],
    });

    const contextualLessonIds = [
      ...(seed?.requirement.lessonIds ?? []),
      ...(lead?.requirement.lessonIds ?? []),
      ...(saas?.requirement.lessonIds ?? []),
    ];

    expect(contextualLessonIds).toEqual(TARGET_LESSONS.map((target) => target.id));
    expect(new Set(contextualLessonIds).size).toBe(6);
  });

  it('remplace les avertissements conditionnels par un statut fictif visible dans les six cas', () => {
    const fictitiousMarker = 'Cas fictif à visée exclusivement méthodologique. Les données sont inventées et ne constituent ni un benchmark ni une observation de marché.';

    for (const target of TARGET_LESSONS) {
      const body = lessonBody(target.id);
      expect(body, `${target.id}: statut fictif explicite`).toContain(fictitiousMarker);
      expect(body, `${target.id}: pas de formule conditionnelle`).not.toMatch(/Si l[’']exemple utilise des chiffres fictifs/u);
    }
  });

  it('publie les conventions runway, primaire/secondaire et option pool du cas Seed Financing', () => {
    const body = lessonBody('l-stage-seed-financing');

    expect(body).not.toMatch(/ajoute le primaire[^.]+soustrait le \[\[burn-rate\|burn\]\] mensuel/u);
    expect(body).toContain('runway mécanique = cash post-closing disponible / burn net mensuel');
    expect(body).toContain('350 k€ + 2,4 M€ = 2,75 M€');
    expect(body).toContain('2,75 M€ / 90 k€ = 30,555… mois');
    expect(body).toContain('30,6 mois');
    expect(body).toMatch(/snapshot de cash[^.]+2026-08-01/u);
    expect(body).toMatch(/burn net mensuel[^.]+signe négatif/u);
    expect(body).toMatch(/primaire[^.]+reçu/u);
    expect(body).toMatch(/frais[^.]+décaissements engagés/u);
    expect(body).toMatch(/arrondi[^.]+une décimale/u);
    expect(body).toMatch(/runway mécanique jusqu[’']à zéro/u);
    expect(body).toMatch(/runway jusqu[’']à un seuil de trésorerie/u);
    expect(body).toMatch(/fenêtre utile avant lancement du prochain tour/u);
    expect(body).toContain('post-money = pre-money + investissement primaire');
    expect(body).toContain('2,4 M€ / 10,0 M€ = 24 %');
    expect(body).toMatch(/secondaire[^.]+n[’']apporte pas de cash nouveau/u);
    expect(body).toMatch(/convention fully diluted/u);
    expect(body).toMatch(/pool[^.]+pre-money[^.]+post-money/u);
    expect(body).toMatch(/top-up[^.]+supporté/u);
    expect(body).toMatch(/pool attribué[^.]+réserve non attribuée/u);
    expect(body).toMatch(/cap table avant\/après/u);
    expect(body).toMatch(/Galion[^.]+Series A[^.]+pas une norme Seed/u);
    expect(body).toMatch(/IPEV[^.]+juste valeur[^.]+calibration/u);
  });

  it('rend le cas SaaS Metrics calculable depuis un pont agrégé et méthodologique pour logo churn et LTV', () => {
    const body = lessonBody('l-specialty-saas-metrics');
    const caseSection = sectionFor(body, "Cas d'application");
    const activitySection = sectionFor(body, 'Mise en application');
    const partASection = activitySection.split(/\n\n\*\*Partie B/u)[0] ?? '';
    const requestedCalculationSentence = partASection.match(/Recalcule [^.]+\./u)?.[0];
    const caseTables = markdownTables(caseSection);
    const bridgeTable = caseTables.find((table) => {
      const normalizedTable = [table.headers.join(' '), ...table.rows.map((row) => row.join(' '))].join(' ').toLowerCase();
      return ['t0', 'churn', 'contractions', 'expansions', 'nouveaux clients', 'réactivations'].every((needle) => normalizedTable.includes(needle));
    });
    const bridgeText = bridgeTable?.text ?? '';
    const bridgeRowsText = bridgeTable?.rows.map((row) => row.join(' ')).join('\n') ?? '';

    expect.soft(caseSection).toMatch(/pont agrégé de cohorte/u);
    expect.soft(bridgeTable, 'un tableau Markdown doit porter le pont agrégé de cohorte').toBeDefined();
    expect.soft(bridgeRowsText).toMatch(/période\s+T0[^\n]+T1/u);
    expect.soft(bridgeRowsText).toMatch(/devise\s+EUR/u);
    expect.soft(bridgeRowsText).toMatch(/date d[’']extraction\s+2026-08-01/u);
    expect.soft(bridgeRowsText).toMatch(/revenu récurrent de cohorte en T0\s+1 000 k€/u);
    expect.soft(bridgeRowsText).toMatch(/churn revenu\s+50 k€/u);
    expect.soft(bridgeRowsText).toMatch(/contractions\s+70 k€/u);
    expect.soft(bridgeRowsText).toMatch(/expansions\s+180 k€/u);
    expect.soft(bridgeRowsText).toMatch(/nouveaux clients[^\n]+90 k€[^\n]+exclu/iu);
    expect.soft(bridgeRowsText).toMatch(/réactivations[^\n]+20 k€[^\n]+traitées? séparément/iu);
    expect.soft(bridgeText).toMatch(/GRR[^\n]+NRR/u);
    expect.soft(caseSection).not.toMatch(/export mensuel fictif[^\n.]+client/u);

    expect.soft(body).toContain('1,2 M€ - 120 k€ = 1,08 M€');
    expect.soft(body).toContain('GRR = (revenu T0 - churn - contractions) / revenu T0');
    expect.soft(body).toContain('NRR = (revenu T0 - churn - contractions + expansions) / revenu T0');
    expect.soft(body).toContain('gross revenue loss rate = (50 k€ + 70 k€) / 1 000 k€ = 12 %');
    expect.soft(body).toContain('GRR = 88 %');
    expect.soft(body).toContain('NRR = 106 %');
    expect.soft(body).toContain('180 k€ de dépenses d’acquisition attribuables / 30 nouveaux clients = 6 000 € de CAC');
    expect.soft(body).toContain('marge brute mensuelle par client = 550 €');
    expect.soft(body).toContain('(6 000 € + 600 €) / 550 € = 12 mois');
    expect.soft(body).not.toMatch(/GRR = [^\n]+expansions/u);

    expect.soft(activitySection).toMatch(/Partie A[^\n]+calculs exécutables/u);
    expect.soft(requestedCalculationSentence, 'Partie A doit rester limitée aux six calculs autorisés').toBe(
      'Recalcule le gross revenue loss rate, la GRR, la NRR, le CAC, la marge brute mensuelle par client et le CAC payback.',
    );
    for (const metric of ['gross revenue loss rate', 'GRR', 'NRR', 'CAC', 'marge brute mensuelle', 'CAC payback']) {
      expect.soft(partASection, `Partie A doit demander ${metric}`).toContain(metric);
    }
    expect.soft(partASection).not.toMatch(/\bARR\b|logo\/customer churn|\bLTV\b/iu);
    expect.soft(activitySection).toMatch(/logo\/customer churn[^.]+non calculable[^.]+pont agrégé/iu);
    expect.soft(activitySection).toMatch(/LTV[^.]+non calculable[^.]+pont agrégé/iu);
    expect.soft(activitySection).toMatch(/n[’']invente[r]? aucune valeur|aucune valeur ne doit être inventée/iu);

    const requiredMissingFields = [
      /identifiant client stable/iu,
      /statut client en T0 et T1/iu,
      /MRR ou ARR en T0 et T1/iu,
      /date de début/iu,
      /date de churn éventuelle/iu,
      /contraction ou expansion/iu,
      /nouveau client/iu,
      /réactivation/iu,
      /nombre de logos en T0/iu,
      /nombre de logos perdus/iu,
      /période du churn/iu,
      /ARPA ou revenu mensuel par client/iu,
      /marge brute/iu,
      /hypothèse de durée de vie ou convention LTV/iu,
    ];
    for (const fieldPattern of requiredMissingFields) {
      expect.soft(activitySection, `champ manquant non nommé : ${fieldPattern.source}`).toMatch(fieldPattern);
    }
  });

  it('qualifie les preuves commerciales et les sources SaaS sans sur-attribution', () => {
    const commercial = lessonBody('l-stage-seed-commercial');
    const metrics = lessonBody('l-specialty-saas-metrics');

    expect(commercial).toMatch(/intérêt[^\n]+pilote[^\n]+devis[^\n]+facture[^\n]+revenu[^\n]+renouvellement/u);
    expect(commercial).toMatch(/grille pédagogique de diligence/u);
    expect(commercial).toMatch(/convention éditoriale locale/u);
    expect(commercial).not.toMatch(/France Invest[^.]+(?:impose|publie|définit)[^.]+pilote[^.]+devis[^.]+facture/u);
    expect(metrics).not.toContain('The SaaS Retention Report: The New Normal For SaaS, 2024](https://chartmogul.com/reports/saas-retention-the-new-normal/) — NRR, GRR');
    expect(metrics).toMatch(/formules NRR\/GRR[^.]+conventions opératoires locales/u);
    expect(metrics).toMatch(/ChartMogul[^.]+population privée[^.]+géographie non documentée/u);
    expect(metrics).toMatch(/High Alpha[^.]+rapport détaillé[^.]+formulaire/u);
    expect(metrics).toMatch(/ARR[^.]+revenu annuel récurrent vérifié[^.]+annualisation mécanique/u);
  });

  it('rend les exercices exécutables ou explicitement méthodologiques dans les six leçons', () => {
    expect(lessonBody('l-stage-seed-commercial')).toMatch(/quinze comptes[^\n]+C01[^\n]+C15/u);
    expect(lessonBody('l-stage-seed-financing')).toMatch(/scénario faible[^\n]+scénario central[^\n]+scénario élevé/u);
    expect(lessonBody('l-role-lead-dd')).toMatch(/matrice de diligence[^\n]+douze lignes/u);
    expect(lessonBody('l-role-lead-closing')).toMatch(/checklist de closing[^\n]+douze lignes/u);
    expect(sectionFor(lessonBody('l-specialty-saas-metrics'), 'Mise en application')).toMatch(/Partie A[^\n]+calculs exécutables[\s\S]+Partie B[^\n]+contrôle de données et méthode/u);
    expect(lessonBody('l-specialty-saas-gtm')).toMatch(/trente opportunités fictives[^\n]+O01[^\n]+O30/u);
  });

  it('corrige LVR/QLVR et les conversions du cas SaaS GTM', () => {
    const body = lessonBody('l-specialty-saas-gtm');
    const glossaryLvr = glossaryEntry('qualified-lead-velocity-rate');
    const canonicalLvr = canonicalGlossaryEntry('qualified-lead-velocity-rate');

    expect(body).toContain('Lead Velocity Rate (LVR)');
    expect(body).toContain('QLVR est seulement un alias local');
    expect(body).toContain('LVR = (leads qualifiés période courante - leads qualifiés période précédente) / leads qualifiés période précédente');
    expect(body).toMatch(/dénominateur nul/u);
    expect(body).toMatch(/absence de pouvoir prédictif garanti/u);
    expect(body).toMatch(/MQL → SQL = 18 \/ 24 = 75 %/u);
    expect(body).toMatch(/SQL → won = 9 \/ \(9 \+ 6\) = 60 %/u);
    expect(body).toMatch(/médiane du cycle[^.]+53 jours/u);
    expect(body).toMatch(/panier signé[^.]+20 k€/u);
    expect(body).toMatch(/opportunités ouvertes[^.]+exclues/u);
    expect(body).toMatch(/founder-led sales/u);

    expect(glossaryLvr?.slug).toBe('qualified-lead-velocity-rate');
    expect(glossaryLvr?.term).toBe('Lead Velocity Rate (LVR)');
    expect(glossaryLvr?.aliases).toContain('QLVR');
    expect(glossaryLvr?.definition).toContain('nom utilisé par Geckoboard');
    expect(glossaryLvr?.definition).toContain('dénominateur nul');
    expect(canonicalLvr?.canonicalTerm).toBe('Lead Velocity Rate (LVR)');
    expect(canonicalLvr?.aliases).toContain('Qualified Lead Velocity Rate');
  });

  it('ajoute GRR au glossaire canonique et publié avec une formule prudente', () => {
    const glossaryGrr = glossaryEntry('grr');
    const canonicalGrr = canonicalGlossaryEntry('grr');

    expect(glossaryGrr?.term).toBe('Gross Revenue Retention (GRR)');
    expect(glossaryGrr?.definition).toContain('(revenu T0 - churn - contractions) / revenu T0');
    expect(glossaryGrr?.definition).toContain('expansions exclues');
    expect(glossaryGrr?.relatedLessonIds).toContain('l-specialty-saas-metrics');
    expect(canonicalGrr?.canonicalTerm).toBe('Gross Revenue Retention (GRR)');
    expect(canonicalGrr?.aliases).toEqual(expect.arrayContaining(['GRR', 'gross revenue retention', 'rétention brute du revenu']));
  });

  it('distingue publication, modification, consultation et portée des références mutables', () => {
    const metrics = lessonBody('l-specialty-saas-metrics');
    const gtm = lessonBody('l-specialty-saas-gtm');

    expect(metrics).toMatch(/Paddle[^\n]+annual recurring revenue[^\n]+publication 2023-01-23[^\n]+consultation 2026-08-01/u);
    expect(metrics).toMatch(/Paddle[^\n]+payback[^\n]+publication 2022-02-01[^\n]+modification 2025[^\n]+consultation 2026-08-01/u);
    expect(gtm).toMatch(/Paddle[^\n]+Customer acquisition cost[^\n]+publication 2023-01-23[^\n]+consultation 2026-08-01/u);
    expect(gtm).toMatch(/Geckoboard[^\n]+aucune date de publication affichée[^\n]+consultation 2026-08-01/u);
    expect(gtm).toMatch(/Startups become what they hunt[^\n]+biais de sélection[^\n]+survivance/u);
    expect(gtm).toMatch(/High Alpha[^\n]+rapport détaillé[^\n]+formulaire/u);
  });
});
