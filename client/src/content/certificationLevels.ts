import certificationLevelsJson from '@data/certificationLevels.json';
import type { CertificationLevelPromise } from './certificationTypes';

export const CERTIFICATION_LEVELS = certificationLevelsJson as unknown as CertificationLevelPromise[];

export const certificationLevelById = (id: string) =>
  CERTIFICATION_LEVELS.find((level) => level.id === id);

