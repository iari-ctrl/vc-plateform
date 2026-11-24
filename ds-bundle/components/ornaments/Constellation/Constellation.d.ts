import * as React from 'react';

/**
 * Constellation — from @vcpx/design-system@0.1.0.
 */
export interface ConstellationProps {
className?: string;
  hue?: string;
  /**
   * Omis, un champ de quatorze étoiles par défaut est rendu.
   *
   * Fourni, il doit compter AU MOINS QUATORZE entrées : la table des liens
   * est codée en dur sur quatorze indices et le composant lève au rendu
   * en deçà. Coordonnées dans un repère de 0 à 100, `r` = rayon.
   */
  stars?: { x: number; y: number; r: number }[];
}

export declare const Constellation: React.ComponentType<ConstellationProps>;
