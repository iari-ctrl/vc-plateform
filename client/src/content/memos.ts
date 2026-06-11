import memosJson from '@data/memos.json';
import type { InvestmentMemo, MemoAnnotationTag } from './types';

export const MEMOS = memosJson as unknown as InvestmentMemo[];

export const memoBySlug = (slug: string) => MEMOS.find((m) => m.slug === slug);
export const memoById = (id: string) => MEMOS.find((m) => m.id === id);

/** Display labels + accents for annotation tags (decision-logic moves). */
export const MEMO_TAG_META: Record<MemoAnnotationTag, { label: string; accent: string }> = {
  these: { label: 'Thèse', accent: '#5A4FA0' },
  marche: { label: 'Marché', accent: '#267A8C' },
  traction: { label: 'Traction', accent: '#3E7C6A' },
  equipe: { label: 'Équipe', accent: '#B0894A' },
  risque: { label: 'Risque', accent: '#B5544E' },
  deal: { label: 'Deal', accent: '#9A6A3C' },
  concurrence: { label: 'Concurrence', accent: '#4C6B8A' },
  verdict: { label: 'Verdict', accent: '#7C4680' },
};
