import antiPortfolioJson from '@data/antiPortfolio.json';
import type { AntiPortfolioEntry, AntiPortfolioPattern } from './types';

const data = antiPortfolioJson as unknown as {
  patterns: AntiPortfolioPattern[];
  entries: AntiPortfolioEntry[];
};

export const ANTI_PORTFOLIO_PATTERNS = data.patterns;
export const ANTI_PORTFOLIO = data.entries;

export const antiPortfolioBySlug = (slug: string) => ANTI_PORTFOLIO.find((e) => e.slug === slug);
export const antiPortfolioById = (id: string) => ANTI_PORTFOLIO.find((e) => e.id === id);
export const antiPortfolioPatternById = (id: string) =>
  ANTI_PORTFOLIO_PATTERNS.find((p) => p.id === id);
