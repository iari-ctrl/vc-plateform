Button from @vcpx/design-system. Use via `window.VCPX.Button` (bundle loaded from the root `_ds_bundle.js`). Wrap the tree in `<DSProvider>` (full provider chain in README.md — components read theme/i18n from that context).

Trois variantes, trois intentions, à ne pas interchanger : `foil` pour l'action principale d'une zone de décision (démarrer, valider, terminer), `ghost` pour une action secondaire qui doit rester visible, `quiet` pour la navigation discrète et les commandes légères.

Règles du design system :

- un seul bouton `foil` par zone de décision ;
- ne jamais utiliser `foil` pour un simple filtre — c'est `quiet` ;
- porter une icône lucide quand elle aide à comprendre l'action.

**Limite à connaître.** En mode lien (`as="link"` avec `to` ou `href`), les props restantes ne sont pas transmises à l'élément rendu. Dès qu'un attribut ARIA ou un gestionnaire est nécessaire sur un lien, écrire un `Link` ou un `<a>` explicite portant directement la classe `.btn-foil`, `.btn-ghost` ou `.btn-quiet`.

Pour un état indisponible, utiliser `disabled` sur le bouton natif. `aria-disabled` seul décrit l'état sans bloquer l'activation au clavier.

## Props

```ts
interface ButtonProps {
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
```
