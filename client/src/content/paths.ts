import pathsJson from '@data/paths.json';
import type { Path } from './types';

export const PATHS = pathsJson as unknown as Path[];

export const pathBySlug = (slug: string) => PATHS.find((p) => p.slug === slug);
export const pathById = (id: string) => PATHS.find((p) => p.id === id);
