import simulatorsJson from '@data/simulators.json';
import type { Simulator } from './types';

export const SIMULATORS = simulatorsJson as unknown as Simulator[];

export const simulatorBySlug = (slug: string) => SIMULATORS.find((s) => s.slug === slug);
