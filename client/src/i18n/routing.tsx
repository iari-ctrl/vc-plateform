import {
  Link as RouterLink,
  NavLink as RouterNavLink,
  type LinkProps,
  type NavLinkProps,
} from 'react-router-dom';
import { localizeTo } from './navigation';
import { useLocale } from './useLocale';

/** Drop-in for react-router's `Link` that auto-prefixes the active locale. */
export function Link({ to, ...rest }: LinkProps) {
  const locale = useLocale();
  return <RouterLink to={localizeTo(to, locale)} {...rest} />;
}

/** Drop-in for react-router's `NavLink` that auto-prefixes the active locale. */
export function NavLink({ to, ...rest }: NavLinkProps) {
  const locale = useLocale();
  return <RouterNavLink to={localizeTo(to, locale)} {...rest} />;
}
