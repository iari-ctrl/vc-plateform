import ikigaiJson from '@data/ikigai.json';
import type { IkigaiData } from './types';

export const IKIGAI = ikigaiJson as unknown as IkigaiData;

export const profileById = (id: string) => IKIGAI.profiles.find((p) => p.id === id);
