// Lessons authored *for* the Parcours layer (the new « découverte » / coach
// registers — see docs/parcours/*.md). They live in their own files under
// data/parcours/ with distinct ids (ld-* / lea-*) so they cohabit with — and
// never clobber — the serious library lessons (l-*) in data/lessons.json.
//
// These objects are drop-in `Lesson`s: `lessons.ts` concatenates them into the
// LESSONS collection so `lessonById`/`lessonBySlug` and the lesson reader resolve
// them transparently. The wrapper metadata (_doc, register, parcoursId, courseId)
// is ignored here — only the `lessons` array is consumed.
// Files 02 (lea-*) and 05 (lf-*) were folded into data/lessons.json (the
// canonical, server-indexed home — see scripts history) and their drop-in
// source files removed, so they are intentionally absent here to avoid the
// duplicate-id collision that double-loading caused.
import decouvrir from '@data/parcours/01-le-vc-sans-bullshit.lessons.json';
import leveeLp from '@data/parcours/03-lever-son-fonds-lp.lessons.json';
import leStandardFrancais from '@data/parcours/04-le-standard-francais.lessons.json';
import type { Lesson } from './types';

export const PARCOURS_LESSONS = [
  ...(decouvrir.lessons as unknown as Lesson[]),
  ...(leveeLp.lessons as unknown as Lesson[]),
  ...(leStandardFrancais.lessons as unknown as Lesson[]),
];
