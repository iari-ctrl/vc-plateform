import { useState } from 'react';
import { storage, STORAGE_KEYS } from '@/lib/storage';
import type { OnboardingMode } from '@/content/types';

const MODES: OnboardingMode[] = ['editorial', 'bref', 'interactif'];

export function useOnboardingMode() {
  const [onboardingMode, setOnboardingModeState] = useState<OnboardingMode>(() => {
    const saved = storage.get<OnboardingMode>(STORAGE_KEYS.onboardingMode, 'editorial');
    return MODES.includes(saved) ? saved : 'editorial';
  });

  const setOnboardingMode = (m: OnboardingMode) => {
    setOnboardingModeState(m);
    storage.set(STORAGE_KEYS.onboardingMode, m);
  };

  return [onboardingMode, setOnboardingMode] as const;
}
