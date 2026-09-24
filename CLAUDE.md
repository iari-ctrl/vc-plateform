# CLAUDE.md — contrat partagé du dépôt

Malgré son nom historique, ce fichier est le contrat détaillé pour tous les agents de code travaillant dans ce dépôt. `AGENTS.md` est le point d’entrée portable qui renvoie ici. Les hooks `.claude/` n’existent que pour Claude Code et ne remplacent jamais les contrôles manuels des autres agents.

## 1. Nature du projet

Plateforme statique française d’intelligence et de formation VC. Le contenu éditorial est le produit : parcours, cours, leçons, glossaire, cas, simulateurs, dossiers d’écosystème, mémos, anti-portfolio, convictions, livrables, carnet local et blog.

Monorepo npm en workspaces (`client`), ESM partout (`"type": "module"`), Node ≥ 20. L’application est une SPA React/Vite sans backend applicatif, API ni base de données serveur ; la persistance apprenant reste locale.

## 2. Commandes actuelles

```bash
npm install                         # dépendances racine et workspace client
npm run dev                         # Vite client (:5173), predev : build:memo puis split:content
npm run check                       # gate global : splits, contenu strict, glossaire, typecheck, lint, tests
npm run check:generated             # contrôle sans écriture des sorties split commitées
npm run build:memo                  # assemble les HTML du simulateur depuis nouveau simu/src/
npm run check:memo                  # compare ces HTML sans écriture ; distinct de check
npm run validate:content            # schémas, références, marqueurs ; erreurs fatales
npm run validate:content:strict     # warnings d’intégrité fatals, softWarnings reconnus non fatals
npm run validate:glossary           # glossaire publié
npm run aliases:merge               # replie les aliases approuvés du registre canonique
npm run split:content               # régénère les splits glossaire + leçons
npm run typecheck                   # TypeScript client
npm run lint                        # ESLint client + scripts/shared/hooks
npm run test                        # Vitest client + node --test scripts/shared
npm run build                       # exige VITE_SITE_URL ; prebuild memo/split/validate/sitemap ; postbuild prerender strict
npm run prerender:strict            # chemin de publication uniquement
npm run prerender:tolerant          # diagnostic local explicite seulement
```

`npm run dev` et `npm run build` lancent les générateurs `build:memo` et `split:content` via leurs pré-hooks ; ces commandes écrivent des artefacts dérivés et ne surveillent pas ensuite leurs sources. `check:generated` et `check:memo` comparent les sorties sans écriture ; `check:memo` n’est pas inclus dans `npm run check`. N’exécuter un build complet que lorsque la portée le justifie, avec `VITE_BASE_URL` et `VITE_SITE_URL` cohérents avec le contrat de déploiement.

## 3. Hiérarchie des autorités

Une information maintenue doit avoir un propriétaire unique. Quand code, données et documentation divergent, signaler la dérive au lieu de choisir silencieusement.

1. **Code, scripts, configuration et données sources** (`client/`, `data/`, `shared/`, `scripts/`, `package.json`) décrivent le comportement implémenté.
2. **`PRODUCT.md`** porte les principes produit : registre, intention, personnalité de marque, accessibilité.
3. **`docs/ARCHITECTURE_EDITION.md`** porte l’architecture éditoriale, le cycle de vie du contenu, les conventions d’ID/slug et la charte rédactionnelle détaillée (§4.0.c).
4. **Documents spécialisés maintenus** : `docs/DESIGN_SYSTEM.md`, `docs/STRATEGIE-vc-intelligence.md`, `docs/parcours/README.md`, `docs/certifications/ARCHITECTURE-CERTIFICATIONS.md`, `docs/certifications/REFERENTIEL-VC-ANALYST.md`, `docs/parcours/ANALYST-FOUNDATIONS.md`.
5. **`Suivis/ETAT.md`** est l’instantané courant remplaçable : compteurs, dernières vérifications, risques ouverts, priorités.
6. **`Suivis/JOURNAL.md`** est le journal daté append-only. Ne pas réécrire d’anciennes entrées.
7. **`Suivis/PROCEDURE_PUSH.md`** décrit le push de sauvegarde et les contrôles préalables.
8. **Archives** (`docs/archive/`, `Suivis/AUDIT/`) et plans locaux (`.hermes/plans/`) sont historiques ou préparatoires, jamais normatifs par eux-mêmes.

Ne faites pas dépendre une correction de mémoires locales non versionnées. Une mémoire peut rappeler une décision, mais l’autorité maintenue doit vivre dans le dépôt.

Pour un chantier Formation, lire les sections pertinentes du [manuel d’architecture](docs/ARCHITECTURE_EDITION.md#preparation-formation) et du [contrat Parcours](docs/parcours/README.md#preparation-formation), puis [l’état courant](Suivis/ETAT.md#consolidation-formation). Les plans décrivent les travaux proposés ; ils ne prouvent ni leur livraison ni la disponibilité d’une commande. Ne pas recopier leurs anciens compteurs comme état actuel ni charger tout le manuel ou tout le journal par défaut.

## 4. Architecture et données

- **Sources éditoriales.** Les collections structurées vivent dans `data/*.json`, `data/blog/*.json` et registres spécialisés. Les textes d’interface et consignes exécutables peuvent vivre dans `client/src`. Toujours modifier la source propriétaire, pas une projection rendue.
- **Générés.** Ne jamais éditer directement `data/generated/`. `scripts/split-glossary.mjs` et `scripts/split-lessons.mjs` produisent les quatre sorties commitées : `glossary.index/defs.json` et `lessons.index/bodies.json`. `npm run check:generated` vérifie leur fraîcheur sans écriture.
- **HTML du simulateur de note.** Éditer `nouveau simu/src/`, jamais les HTML assemblés. `scripts/build-investment-memo.mjs` définit les sorties de `npm run build:memo` ; `npm run check:memo` contrôle leur parité avec les sources sans les régénérer.
- **Glossaire.** Le registre durable est `data/sources/canonical-glossary.json`; le glossaire publié consommé par l’application est `data/glossary.json`. Une entrée publiée doit garder les deux couches alignées, puis passer validation et split.
- **Validation de contenu.** `scripts/validate-content.mjs` contrôle formes Zod, références inter-collections, IDs/slugs uniques, statuts, URL, marqueurs `[[slug|label]]` / `{{slug|label}}` et warnings d’intégrité. Les erreurs sont toujours fatales ; le strict rend les warnings fatals sauf softWarnings reconnus.
- **Publication éditoriale.** `shared/publication.mjs` exige `status: "published"` pour les collections qui lui sont raccordées. Les parcours et cours n’ont pas encore de statut éditorial propre ; `roadmap` et `steps[].status` ne le remplacent pas. Les métadonnées de leçons `upcoming` peuvent être visibles sans corps lisible. Ne pas confondre publication, disponibilité pédagogique, résolution, complétion et indexabilité.
- **Local-first.** Les données principales utilisent des contrats `vcpx:` versionnés dans `localStorage`, validés et migrés côté client. Le simulateur de note garde un format distinct ; `client/src/lib/localDataLifecycle.ts` couvre l’export, l’import et la purge, et `client/src/lib/localDataRecovery.ts` la copie de récupération dans IndexedDB, séparée des données actives. Ces stockages ne sont ni confidentiels ni synchronisés entre appareils : ne pas y placer d’identifiants, secrets, données personnelles confidentielles ou deal material non public.
- **Limite publique.** Sans authentification, toute route client, tout bundle, tout JSON importé et tout fichier de `client/public/` est accessible. `noindex` est une directive SEO, pas un contrôle d’accès.
- **Routes et SEO.** `shared/routes.mjs` centralise les familles exécutables, publiques, noindex et les hints de sitemap ; il doit rester pur, sans dépendance ni TypeScript. `client/src/App.tsx`, `scripts/collect-routes.mjs`, le sitemap et le prérendu strict doivent rester alignés.
- **Base et origine.** `shared/base-url.mjs` normalise `VITE_BASE_URL`. `VITE_SITE_URL` accepte une origine seule, à laquelle la base est ajoutée, ou une URL qui porte déjà cette même base ; un autre chemin est rejeté. Ne pas inventer de domaine de production. Ne pas ancrer à `/` des fichiers issus de `client/public/`.
- **Prérendu.** Le postbuild lance le prérendu strict. Échecs Chromium, routes, métadonnées, 404 ou écarts de compte sont bloquants. Le mode tolérant ne prouve jamais une publication.
- **Langue.** Produit français-only : routes canoniques non préfixées (`/home`, `/parcours/...`, `/blog/...`). Ne pas ajouter `/fr` ou `/en` sans décision produit et migration complète.
- **Aliases.** Vite/tsconfig : `@` → `client/src`, `@data` → `data`, `@shared` → `shared`.
- **Bundle.** Importer les collections par module spécifique plutôt que depuis le barrel quand le hot path ou un chunk partagé peut être alourdi. `HomePage` est lazy ; `searchLocal` reste lazy-only.

## 5. Ontologie produit

- **Path = Parcours** : trajectoire de formation ordonnée par objectif, composant librement des ressources existantes (`/parcours`, `/parcours/:slug`).
- **Cours** : conteneur réutilisable de leçons (`/courses/:slug`).
- **Leçon** : unité pédagogique autonome (`/lessons/:slug`) avec `courseId` valide et réciprocité dans `course.lessonIds`. Conclusions, mémos, blocs « À retenir » et chapitres non autonomes ne sont pas des leçons.
- **Bibliothèque** : inventaire filtrable des cours, leçons publiées et cas (`/bibliotheque`). Elle n’a pas de rayon ou shelf autonome. Les anciennes URL `/bibliotheque/:slug` sont des redirections non indexables.
- **Certification** : credential évalué (`KnowledgeCertification | ProfessionalCertification`). Un résultat local de connaissance ne délivre jamais le titre professionnel `VC Analyst`; la gouvernance professionnelle future vit dans les documents de certification.
- **Glossaire** : un titre canonique et des `aliases`, jamais une entrée distincte pour un alias.

Si une demande emploie un autre terme (« module », « chapitre », « enseignement »), inspecter les types et données avant de choisir le mapping. Demander seulement si plusieurs mappings changent réellement la portée.

## 6. Règles d’exécution

- Commencer les travaux non triviaux par le but, le périmètre, les fichiers possédés, dépendances, critères d’acceptation et exclusions. Pour un audit demandé en lecture seule, ne pas éditer.
- Vérifier `git status` au départ, avant écriture et avant clôture. Dans un worktree sale, hash ou relire les fichiers possédés avant d’écrire ; ne jamais attribuer le diff global à la session courante.
- Préserver les changements utilisateur. Ne pas utiliser `stash`, `reset`, `clean`, checkout destructif, staging, commit, push, workflow distant ou déploiement sans demande explicite.
- Inspecter le comportement depuis sa définition jusqu’aux consommateurs matériels. La recherche texte sert au triage, pas à la preuve d’exécution.
- Pour une modification de comportement, produire un cas RED reproductible, le plus petit GREEN, puis une non-régression. Garder le premier échec complet ; un GREEN ultérieur ne l’efface pas.
- Classer tout gate rouge avant de corriger : régression en périmètre, défaut préexistant, incohérence transverse, travail ultérieur ou problème d’environnement.
- Paralléliser seulement les lectures ou vérifications pures. Un seul agent écrit les fichiers qui portent un invariant partagé ; les revues parallèles doivent travailler sur un snapshot gelé.
- Les URLs et sources ne prouvent pas une affirmation par leur seule validité technique. Pour un contenu sourcé, vérifier proposition par proposition et ne jamais inventer source, licence, auteur, date ou statut.

## 7. Validation proportionnée

- Édition documentaire pure : vérifier les liens/chemins cités, les invariants textuels concernés et `git diff --check`. Pas de build applicatif sauf si des commandes exécutables, routes ou instructions de publication changent.
- JSON éditorial : valider la collection, régénérer les splits si les sources changent, puis `check:generated`.
- Changement transversal contenu/application : `npm run check`; ajouter un build canonique quand routes, bundling, sitemap, prérendu ou publication sont affectés.
- Changement code : tests ciblés les plus étroits, puis typecheck/lint selon la portée. Ajouter une recette navigateur pour toute modification visible de layout, interaction ou rendu.
- Build release-ready : `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build`, puis gate post-build adapté. Si le build réécrit sitemap/robots/générés, le contrôle non écrivant vient après.
- Consigner seulement les commandes réellement lancées avec leur résultat exact. Mettre à jour `Suivis/ETAT.md` et ajouter une entrée au `JOURNAL.md` uniquement pour une livraison durable ou une demande explicite.

## 8. Style éditorial opérationnel

La prose destinée au produit — analyses, dossiers, articles, leçons, glossaire, parcours, certifications, textes d’interface et documentation publiée — reste correcte, sobre, factuelle et institutionnelle. Le détail canonique est `docs/ARCHITECTURE_EDITION.md` §4.0.c ; `PRODUCT.md` porte les principes produit ; la compétence écosystèmes ajoute seulement des contraintes propres aux dossiers `/ecosystemes`.

Résumé opérationnel : aller directement à l’information ; soutenir les faits au niveau requis ; distinguer faits, interprétations, hypothèses et opinions ; bannir slogans, dramatisation, survente, superlatifs, urgence artificielle, métaphores vendeuses, tics LLM, paragraphes performatifs et assertions non sourcées. Les titres et légendes décrivent ce qui est montré ; ils ne vendent pas une thèse.

## 9. Publication et opérations distantes

Le travail courant est local-first. Le remote Git sert de sauvegarde du code. Le workflow GitHub Pages `.github/workflows/deploy-pages.yml` est manuel (`workflow_dispatch`), construit avec `VITE_BASE_URL=/<repo>/` et `VITE_SITE_URL=https://<owner>.github.io/<repo>`, puis déploie dans un job Pages séparé. Aucun domaine personnalisé ni `CNAME` n’est configuré. Ne déclencher ni push, ni workflow, ni déploiement sans demande explicite et plan de remise en ligne.
