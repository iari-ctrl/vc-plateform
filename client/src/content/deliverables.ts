import deliverablesJson from '@data/deliverables.json';
import type { Deliverable } from './types';

export const DELIVERABLES = deliverablesJson as unknown as Deliverable[];

export const deliverableBySlug = (slug: string) => DELIVERABLES.find((d) => d.slug === slug);
export const deliverableById = (id: string) => DELIVERABLES.find((d) => d.id === id);
