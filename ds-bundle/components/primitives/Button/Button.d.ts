import * as React from 'react';

/**
 * Button — from @vcpx/design-system@0.1.0.
 * @replaces button
 */
export interface ButtonProps {
variant?: "foil" | "ghost" | "quiet";
  /** `"link"` rend un lien de routage avec `to`, ou un `<a>` avec `href`. Les props restantes ne sont alors PAS transmises. */
  as?: "button" | "link";
  to?: string;
  href?: string;
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  id?: string;
  style?: React.CSSProperties;
  "aria-label"?: string;
  "aria-disabled"?: boolean;
  "aria-pressed"?: boolean;
}

export declare const Button: React.ComponentType<ButtonProps>;
