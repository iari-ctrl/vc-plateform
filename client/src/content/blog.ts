import type { BlogPost } from './types';

const blogModules = import.meta.glob<{ default: BlogPost }>('../../../data/blog/*.json', { eager: true });

export const BLOG = Object.values(blogModules)
  .map((module) => module.default)
  .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));

export const blogBySlug = (slug: string) => BLOG.find((b) => b.slug === slug);
