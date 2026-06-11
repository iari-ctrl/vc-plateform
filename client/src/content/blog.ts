import blogJson from '@data/blog.json';
import type { BlogPost } from './types';

export const BLOG = blogJson as unknown as BlogPost[];

export const blogBySlug = (slug: string) => BLOG.find((b) => b.slug === slug);
