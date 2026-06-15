import { readdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
// server/src/lib  ->  ../../../data  (repo root /data)
const DATA_DIR = resolve(here, '../../../data');

function load<T>(file: string): T {
  const raw = readFileSync(resolve(DATA_DIR, file), 'utf-8');
  return JSON.parse(raw) as T;
}

export interface RawPath {
  id: string; slug: string; order: number; title: string; subtitle: string;
  level: string; accent: string; kanji?: string; durationHours: number;
  summary: string; forWhom: string[]; outcomes: string[]; courseIds: string[];
}
export interface RawCourse {
  id: string; slug: string; pathId: string; order: number; title: string;
  subtitle: string; level: string; durationMin: number; summary: string;
  tags: string[]; lessonIds: string[];
}
export interface RawQuiz {
  question: string;
  options: { text: string; correct: boolean }[];
  explanation: string;
}
export interface RawLesson {
  id: string; slug: string; courseId: string; order: number; title: string;
  kicker: string; readMin: number; summary: string; body: string; bodyShort?: string;
  keyTakeaways: string[]; glossaryRefs: string[]; quiz?: RawQuiz[];
  furtherReading?: { label: string; kind: string; ref: string }[];
}
export interface RawGlossary {
  id: string; term: string; slug: string; aliases?: string[]; latin?: string; category: string;
  short: string; definition: string; example?: string; seeAlso: string[];
  relatedLessonIds: string[];
}
export interface RawCase {
  id: string; slug: string; title: string; subtitle: string; kind: string;
  company: string; year: number; readMin: number; summary: string;
  tags: string[]; glossaryRefs: string[];
  sections: { heading: string; body: string }[]; takeaways: string[];
}
export interface RawBlog {
  id: string; slug: string; title: string; subtitle: string; author: string;
  date: string; readMin: number; category: string; excerpt: string;
  tags: string[]; body: string;
}
export interface RawSimulator {
  id: string; slug: string; title: string; subtitle: string; category: string;
  accent: string; description: string; relatedLessonIds: string[]; glossaryRefs: string[];
}
export interface RawParcours {
  id: string; slug: string; family: string; roadmap: string; title: string;
  hook: string; kanji?: string; accent?: string; goal: string; forWhom: string[];
  perspective?: string; level: string; entryLevel: string;
  time: { coreHours: number; withBonusHours?: number; sessions?: number; cadence?: string };
  timeFit: string[]; gating?: string; recommendedForProfiles: string[];
  milestone?: unknown; steps: unknown[]; outcomes: string[];
}

function loadParcoursLessons(): RawLesson[] {
  const dir = resolve(DATA_DIR, 'parcours');
  return readdirSync(dir)
    .filter((file) => file.endsWith('.lessons.json'))
    .flatMap((file) => {
      const doc = JSON.parse(readFileSync(resolve(dir, file), 'utf-8')) as { lessons?: RawLesson[] } | RawLesson[];
      return Array.isArray(doc) ? doc : doc.lessons ?? [];
    });
}

export const content = {
  paths: () => load<RawPath[]>('paths.json'),
  parcours: () => load<RawParcours[]>('parcours.json'),
  courses: () => load<RawCourse[]>('courses.json'),
  lessons: () => load<RawLesson[]>('lessons.json'),
  parcoursLessons: () => loadParcoursLessons(),
  allLessons: () => [...load<RawLesson[]>('lessons.json'), ...loadParcoursLessons()],
  glossary: () => load<RawGlossary[]>('glossary.json'),
  caseStudies: () => load<RawCase[]>('caseStudies.json'),
  blog: () => load<RawBlog[]>('blog.json'),
  simulators: () => load<RawSimulator[]>('simulators.json'),
};

export function stripHtml(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/[#*_>[\]|]/g, ' ').replace(/\s+/g, ' ').trim();
}
