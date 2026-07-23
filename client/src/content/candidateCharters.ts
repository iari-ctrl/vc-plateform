import candidateChartersJson from '@data/candidateCharters.json';
import type { CandidateCharter } from './certificationTypes';

export const CANDIDATE_CHARTERS = candidateChartersJson as unknown as CandidateCharter[];

export const candidateCharterByIdVersion = (id: string, version: string) =>
  CANDIDATE_CHARTERS.find((charter) => charter.id === id && charter.version === version);

