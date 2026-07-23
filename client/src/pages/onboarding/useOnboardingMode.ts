import { useEffect, useState } from 'react';
import type { OnboardingMode } from '@/content/types';
import { commitOnStorageSuccess, storage } from '@/lib/storage';
import { STORAGE_CONTRACTS } from '@/lib/storageDomains';

export function useOnboardingMode() {
  const [onboardingMode, setOnboardingModeState] = useState<OnboardingMode>(() => (
    storage.getParsed(STORAGE_CONTRACTS.onboardingMode)
  ));

  useEffect(() => {
    storage.migrate(STORAGE_CONTRACTS.onboardingMode);
  }, []);

  const setOnboardingMode = (m: OnboardingMode) => {
    const result = storage.setParsed(STORAGE_CONTRACTS.onboardingMode, m);
    return commitOnStorageSuccess(result, m, setOnboardingModeState);
  };

  return [onboardingMode, setOnboardingMode] as const;
}
