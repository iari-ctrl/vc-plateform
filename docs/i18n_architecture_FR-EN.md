# Architecture i18n (FR / EN) — VC Premium Platform

Statut : **Phase 1 implémentée, phases 2-5 à faire** · Périmètre : **FR (défaut) + EN** · Dernière mise à jour : 2026-06-11

Décision d'architecture (ADR) + plan de migration pour rendre la plateforme bilingue.
Principe directeur, comme pour le SEO : **acter l'architecture maintenant** (coût dans le
code, douloureux à rétrofitter) et **nourrir les traductions au fil de l'eau** (corpus EN
incrémental, fallback FR). Rien à déployer tant que le site n'est pas en ligne — l'émission
`hreflang` et le rendu prérendu restent couplés à la décision « rendu » (voir §5).

> État actuel : routing localisé `/fr` / `/en` en place côté client, contenu encore
> majoritairement FR dans `data/*.json` (357 termes de dictionnaire, 16 cours, 62 leçons
> canoniques, 4 cas, 4 articles, 8 simulateurs, ikigai), SPA React/Vite + Express/Prisma,
> `<html lang>` piloté par `LocaleBoundary`, `usePageMeta` côté client.

---

## 1. Décisions (ADR)

1. **Langues.** FR par défaut, EN secondaire. Pas de 3e langue prévue → structure simple,
   mais conçue pour qu'en ajouter une = un dossier + des traductions, sans refonte.
2. **URLs = sous-chemin** `/(fr|en)/...`. Le chemin est canonique. La racine `/` redirige une
   fois vers la langue préférée (cookie sinon `Accept-Language`, défaut `fr`). Pas de
   sous-domaine/domaine (éviterait un 2e déploiement à gérer).
3. **Slugs canoniques** — un slug = un concept, **identique FR/EN**
   (`/fr/glossary/carried-interest` ↔ `/en/glossary/carried-interest`). Conséquence clé :
   les marqueurs `[[slug|label]]` / `{{slug}}` (cf. `lib/markdown.tsx`) **fonctionnent sans
   changement** dans les deux langues — seul le `label` est traduit inline. Le `hreflang`
   devient mécanique.
4. **Contenu = un dossier par langue** : `data/fr/*.json`, `data/en/*.json`. Même schéma Zod,
   validé par langue. (Alternative écartée : maps `{fr, en}` par champ → schéma, validation et
   marqueurs alourdis.)
5. **UI ≠ contenu.** Le chrome (nav, boutons, libellés type « Voir aussi », « Définition
   détaillée ») passe par un dictionnaire maison léger typé `{ fr, en }`. Le
   contenu éditorial reste data-driven par langue. Ne jamais mélanger les deux couches.
6. **Base (Prisma).** Ajouter `locale` à chaque modèle de contenu ; remplacer `slug @unique`
   par `@@unique([slug, locale])` ; les routes `findUnique({ where: { slug } })` deviennent
   `findFirst` / clé composite + `locale`. Le seed itère par langue. `searchText` indexé par
   langue.
7. **Fallback EN→FR.** Si une entrée EN manque, afficher la version FR (jamais de page vide) ;
   bandeau « traduction à venir » optionnel.
8. **SEO/head par page** : `<html lang>` dynamique, `<link rel="alternate" hreflang>` (`fr`,
   `en`, `x-default`), `canonical`. Étend `usePageMeta`. *(émission différée — voir §5)*
9. **Préférence de langue** persistée (cookie/localStorage) + sélecteur visible. **Pas** de
   redirection auto par IP/Accept-Language qui bloquerait les crawlers.

## 2. Conséquences

- **+** Marqueurs glossaire et liens internes inchangés (slugs stables) → pas de remaillage.
- **+** `hreflang`/`canonical` triviaux à générer (même slug des deux côtés).
- **+** Ajout d'une langue = additif, pas structurel.
- **−** Double corpus à maintenir — atténué par l'incrémental + fallback FR.
- **−** Migration base (`locale` + clé composite) + reseed ; routes à adapter.
- **−** Le CMS admin doit porter la `locale` (sinon divergence base ↔ JSON, déjà un angle mort
  connu — cf. `Suivis/Bilan.md` §4 « Source de vérité contenu »).

## 3. Plan de migration séquencé *(aucun déploiement requis)*

- **Phase 0 — Décisions figées.** Ce document. *(à valider, voir §5)*
- **Phase 1 — Routing localisé.** Segment `:locale` (`/fr`, `/en`) dans `App.tsx`, garde de
  langue, redirection de la racine, `<html lang>` dynamique, sélecteur de langue dans `TopBar`
  et `SideNav`. **Implémenté 2026-06-09** (`client/src/i18n/`, `App.tsx`, wrappers de routing).
- **Phase 2 — i18n de l'UI.** Mettre en place le dictionnaire maison, externaliser les chaînes du chrome
  (`TopBar`, `SideNav`, `Footer`, libellés de `GlossaryPage`…). Incrémental, page par page.
- **Phase 3 — Contenu par langue.** Déplacer `data/*.json` → `data/fr/`, créer `data/en/`
  (au départ = copie FR servie en fallback) ; ajuster l'alias `@data` (`vite.config.ts`),
  `content/*.ts`, et `scripts/validate-content.mjs` pour **valider chaque dossier** (les
  marqueurs restent vérifiés contre le glossaire de la même langue).
- **Phase 4 — Base & API.** Prisma `locale` + `@@unique([slug, locale])` ; `seed.ts` itère
  les langues ; routes `content.ts` paramétrées par `locale` ; `searchText` par langue.
- **Phase 5 — SEO i18n.** `hreflang`/`canonical`/`lang` dans le head. **Différé** : couplé au
  choix de rendu (prerender/SSG) — à faire au pré-lancement, en même temps que sitemap/robots.
- **Phase 6 — Traductions EN.** Nourries au fil de l'eau : le **lexique d'abord** (beaucoup de
  termes VC sont déjà en anglais), puis leçons/blog/cas. Workflow : brouillon IA + relecture,
  fallback FR tant que c'est vide.

## 4. Impact fichier par fichier (repères)

| Zone | Fichiers | Nature |
|---|---|---|
| Routing / lang | `client/src/App.tsx`, `client/src/i18n/*`, layouts, `TopBar`, `SideNav` | segment `:locale`, garde, sélecteur — Phase 1 faite |
| Head / SEO | `client/src/lib/seo.ts` (`usePageMeta`) | `lang`, `hreflang`, `canonical` |
| Contenu | `data/fr/*`, `data/en/*`, `vite.config.ts` (`@data`), `client/src/content/*.ts` | dossiers par langue |
| Validation | `scripts/validate-content.mjs` | boucle par langue |
| Base | `server/prisma/schema.prisma`, `server/prisma/seed.ts`, `server/src/routes/content.ts`, `server/src/lib/content.ts` | `locale` + clé composite |
| Marqueurs | `client/src/lib/markdown.tsx` | **inchangé** (slugs canoniques) |

## 5. Décisions closes / décisions ouvertes

- **Slugs canoniques** : confirmé. Les marqueurs `[[..]]` / `{{..}}` restent stables FR/EN.
- **Lib i18n du chrome** : dictionnaire maison local typé `{ fr, en }` retenu pour la Phase 2.
- **Comportement de `/`** : redirection vers la langue préférée, avec persistance seulement au clic explicite du sélecteur.
- **CMS admin** : ouvert. Ajouter le champ `locale` à la création de contenu pour éviter la divergence.
- **Pré-lancement uniquement** : ouvert. Coupler l'émission `hreflang` au rendu prérendu/SSG retenu.
