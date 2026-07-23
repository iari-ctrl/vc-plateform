import diagnosticsJson from '@data/diagnostics.json';
import type { Diagnostic } from './types';

export const DIAGNOSTICS = diagnosticsJson as unknown as Diagnostic[];

export const diagnosticById = (id: string) => DIAGNOSTICS.find((diagnostic) => diagnostic.id === id);
export const diagnosticBySlug = (slug: string) => DIAGNOSTICS.find((diagnostic) => diagnostic.slug === slug);

