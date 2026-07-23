// Local search across the static content bundle. It references every collection,
// so it is intentionally kept in its own module and loaded lazily — eager callers
// (the command palette) `import()` it on first query, keeping the content
// collections out of the initial bundle.
import { LESSONS } from './lessons';
import { COURSES } from './courses';
import { GLOSSARY } from './glossary';
import { CASE_STUDIES } from './caseStudies';
import { DELIVERABLES } from './deliverables';
import { BLOG } from './blog';
import { PARCOURS } from './parcours';
import { SIMULATORS } from './simulators';
import { ANTI_PORTFOLIO } from './antiPortfolio';
import { MEMOS } from './memos';
import { ECOSYSTEMS } from './ecosystems';
import { CERTIFICATIONS } from './certifications';
import { CERTIFICATION_LEVELS } from './certificationLevels';
import type { SearchHitType } from './labels';

export interface SearchHit {
  type: SearchHitType;
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  href: string;
}

interface SearchCandidate {
  hit: SearchHit;
  aliases?: readonly string[];
  metadata?: readonly (string | undefined)[];
  boost?: number;
}

const PAGE_CANDIDATES: readonly SearchCandidate[] = [
  page('home', 'Accueil', '/home', 'Vue d’ensemble de la plateforme.', ['Home']),
  page('intelligence', 'Intelligence VC', '/intelligence', 'Analyses, convictions et outils de décision.', ['Intelligence']),
  page('ecosystemes', 'Écosystèmes', '/ecosystemes', 'Dossiers consacrés aux marchés, secteurs et géographies.'),
  page('convictions', 'Convictions', '/convictions', 'Convictions datées et signaux à surveiller.'),
  page('decisions', 'Décisions', '/decisions', 'Cas, mémos et analyses de décisions d’investissement.'),
  page('simulators', 'Simulateurs', '/simulators', 'Outils de calcul appliqués au capital-risque.', ['Simulations']),
  page('methode', 'Méthode', '/methode', 'Méthode d’analyse et principes éditoriaux.'),
  page('blog', 'Analyses', '/blog', 'Articles et notes de recherche.', ['Blog', 'Articles']),
  page('livrables', 'Livrables', '/livrables', 'Gabarits et exercices pratiques.'),
  page('anti-portfolio', 'Anti-portfolio', '/anti-portfolio', 'Décisions de refus étudiées rétrospectivement.'),
  page('memos', 'Mémos annotés', '/memos', 'Mémos d’investissement publics et commentés.', ['Memos', 'Investment memos']),
  page('formation', 'Formation', '/parcours', 'Parcours guidés pour apprendre le capital-risque.', [
    'Formations',
    'Parcours',
    'Apprentissage',
  ]),
  page('certifications', 'Certifications', '/certifications', 'Certificats de connaissances et certifications professionnelles de la plateforme.', [
    'Certification professionnelle',
    'Certificat',
  ]),
  page(
    'certification-levels',
    'Niveaux de certification',
    '/certifications/niveaux',
    'Vue d’ensemble des cinq niveaux, de VC Analyst à VC Principal.',
    ['Échelle de certification'],
    CERTIFICATION_LEVELS.flatMap((level) => [level.title, level.promise, level.audience]),
  ),
  page('bibliotheque', 'Bibliothèque', '/bibliotheque', 'Cours, leçons et ressources classés par thème.', [
    'Bibliotheque',
    'Cours',
    'Leçons',
  ]),
  page('dictionnaire', 'Dictionnaire', '/glossary', 'Définitions des concepts du capital-risque.', [
    'Glossaire',
    'Lexique',
  ]),
  page('workspace', 'Tableau de bord', '/dashboard', 'Progression et activité personnelle.', ['Workspace', 'Dashboard']),
  page('notes', 'Notes & favoris', '/notes', 'Notes personnelles et contenus enregistrés.', ['Favoris']),
  page('journal', 'Journal de décisions', '/journal', 'Prédictions et décisions à réévaluer.', ['Journal']),
];

function page(
  id: string,
  title: string,
  href: string,
  excerpt: string,
  aliases: readonly string[] = [],
  metadata: readonly string[] = [],
): SearchCandidate {
  return {
    hit: { type: 'page', id: `page-${id}`, slug: id, title, excerpt, href },
    aliases,
    metadata,
    boost: 20,
  };
}

const normalize = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');

/**
 * Match only at the beginning of a word. This keeps incremental queries useful
 * (`form` → `formation`) without treating `formation` as a match for
 * `information` or `transformation`.
 */
function fieldScore(value: string | undefined, query: string, weight: number) {
  if (!value) return 0;
  const normalizedValue = normalize(value);
  if (normalizedValue === query) return weight + 30;
  if (normalizedValue.startsWith(query)) return weight + 20;
  if (normalizedValue.includes(` ${query}`)) return weight + 10;
  return 0;
}

function candidateScore(candidate: SearchCandidate, query: string) {
  const titleScore = fieldScore(candidate.hit.title, query, 100);
  const aliasScore = Math.max(0, ...(candidate.aliases ?? []).map((alias) => fieldScore(alias, query, 90)));
  const metadataScore = Math.max(0, ...(candidate.metadata ?? []).map((value) => fieldScore(value, query, 60)));
  const score = Math.max(titleScore, aliasScore, metadataScore);
  return score > 0 ? score + (candidate.boost ?? 0) : 0;
}

export function searchLocal(query: string): SearchHit[] {
  const normalizedQuery = normalize(query);
  if (normalizedQuery.length < 2) return [];

  const candidates: SearchCandidate[] = [...PAGE_CANDIDATES];
  const add = (hit: SearchHit, aliases: readonly string[] = [], metadata: readonly (string | undefined)[] = []) => {
    candidates.push({ hit, aliases, metadata });
  };

  for (const course of COURSES)
    add(
      { type: 'course', id: course.id, slug: course.slug, title: course.title, excerpt: course.summary, href: `/courses/${course.slug}` },
      [],
      [course.subtitle, ...course.tags],
    );

  for (const lesson of LESSONS.filter((candidate) => candidate.status === 'published'))
    add(
      { type: 'lesson', id: lesson.id, slug: lesson.slug, title: lesson.title, excerpt: lesson.summary, href: `/lessons/${lesson.slug}` },
      [],
      [lesson.kicker],
    );

  for (const glossaryTerm of GLOSSARY)
    add(
      {
        type: 'glossary',
        id: glossaryTerm.id,
        slug: glossaryTerm.slug,
        title: glossaryTerm.term,
        excerpt: glossaryTerm.short,
        href: `/glossary?term=${glossaryTerm.slug}`,
      },
      glossaryTerm.aliases,
    );

  for (const caseStudy of CASE_STUDIES)
    add(
      {
        type: 'case',
        id: caseStudy.id,
        slug: caseStudy.slug,
        title: caseStudy.title,
        excerpt: caseStudy.summary,
        href: `/cases/${caseStudy.slug}`,
      },
      [caseStudy.company],
      [caseStudy.subtitle, ...caseStudy.tags],
    );

  for (const deliverable of DELIVERABLES)
    add(
      {
        type: 'deliverable',
        id: deliverable.id,
        slug: deliverable.slug,
        title: deliverable.title,
        excerpt: deliverable.summary,
        href: `/livrables/${deliverable.slug}`,
      },
      [],
      [deliverable.kicker, ...(deliverable.tags ?? [])],
    );

  for (const post of BLOG)
    add(
      { type: 'blog', id: post.id, slug: post.slug, title: post.title, excerpt: post.excerpt, href: `/blog/${post.slug}` },
      [],
      [post.subtitle, post.category, ...post.tags],
    );

  for (const parcours of PARCOURS)
    add(
      {
        type: 'path',
        id: parcours.id,
        slug: parcours.slug,
        title: parcours.title,
        excerpt: parcours.hook,
        href: `/parcours/${parcours.slug}`,
      },
      [parcours.slug.replace(/-/g, ' ')],
    );

  for (const simulator of SIMULATORS)
    add(
      {
        type: 'simulator',
        id: simulator.id,
        slug: simulator.slug,
        title: simulator.title,
        excerpt: simulator.subtitle,
        href: `/simulators/${simulator.slug}`,
      },
      [],
      [simulator.subtitle, simulator.category],
    );

  for (const entry of ANTI_PORTFOLIO)
    add(
      {
        type: 'anti-portfolio',
        id: entry.id,
        slug: entry.slug,
        title: entry.title,
        excerpt: entry.summary,
        href: `/anti-portfolio/${entry.slug}`,
      },
      [entry.company, ...entry.passes.flatMap((pass) => [pass.fund, pass.partner])].filter(
        (value): value is string => Boolean(value),
      ),
      [entry.subtitle, entry.sector],
    );

  for (const memo of MEMOS)
    add(
      { type: 'memo', id: memo.id, slug: memo.slug, title: memo.title, excerpt: memo.whyItMatters, href: `/memos/${memo.slug}` },
      [memo.company, memo.fund, memo.author],
      [memo.stage, ...memo.tags],
    );

  for (const ecosystem of ECOSYSTEMS)
    add(
      {
        type: 'ecosystem',
        id: ecosystem.id,
        slug: ecosystem.slug,
        title: ecosystem.title,
        excerpt: ecosystem.summary,
        href: `/ecosystemes/${ecosystem.slug}`,
      },
      [ecosystem.name],
      [ecosystem.subtitle, ...ecosystem.tags],
    );

  for (const certification of CERTIFICATIONS.filter((candidate) => candidate.status === 'published'))
    add(
      {
        type: 'certification',
        id: certification.id,
        slug: certification.slug,
        title: certification.title,
        excerpt: certification.summary,
        href: `/certifications/${certification.slug}`,
      },
      certification.targetRoles,
      [certification.shortTitle, ...certification.competencies],
    );

  return candidates
    .map((candidate, order) => ({ candidate, order, score: candidateScore(candidate, normalizedQuery) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.order - b.order)
    .slice(0, 40)
    .map(({ candidate }) => candidate.hit);
}
