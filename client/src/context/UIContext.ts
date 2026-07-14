import { createContext, useContext } from 'react';

export interface UIContextValue {
  openSearch: () => void;
}

export const UIContext = createContext<UIContextValue | null>(null);

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
}
