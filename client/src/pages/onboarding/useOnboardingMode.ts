import { useState } from 'react';
import type { OnboardingMode } from '@/content/types';

const ONBOARDING_MODE_KEY = 'onboardingMode';

export function useOnboardingMode() {
  const [onboardingMode, setOnboardingModeState] = useState<OnboardingMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(ONBOARDING_MODE_KEY);
      if (saved === 'editorial' || saved === 'bref' || saved === 'interactif') {
        return saved as OnboardingMode;
      }
    }
    return 'editorial';
  });

  const setOnboardingMode = (m: OnboardingMode) => {
    setOnboardingModeState(m);
    if (typeof window !== 'undefined') {
      localStorage.setItem(ONBOARDING_MODE_KEY, m);
    }
  };

  return [onboardingMode, setOnboardingMode] as const;
}
