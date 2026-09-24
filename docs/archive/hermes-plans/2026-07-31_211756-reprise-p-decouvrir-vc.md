> [!WARNING]
> **Archive non normative.** Ce document est conservé pour preuve historique datée. Il ne doit pas être utilisé comme plan actif, référentiel maintenu ou instruction courante ; vérifier l’état actuel dans `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `Suivis/ETAT.md`, les données et les documents maintenus concernés.

# Reprise de `p-decouvrir-vc` — Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Faire de `p-decouvrir-vc` une introduction fiable au capital-risque, sans changer les identités publiques des sept leçons existantes, avec une séquence cohérente, des sources vérifiées et un quiz final réellement accessible.

**Architecture:** Les sept leçons restent des drop-ins du registre `data/parcours/01-le-vc-sans-bullshit.lessons.json`, rattachées au cours existant `c-decouvrir-vc`. Les sources structurées utilisent `furtherReading.kind = "external"` et les affirmations factuelles sont attribuées au plus près dans la prose. Le quiz final est matérialisé par un huitième drop-in dans ce registre, résolu comme étape finale du parcours ; aucun nouveau cours n’est créé. Le cours contient parallèlement `lsv-vc-mise`, ajouté par un lot concurrent pour `p-semaine-vc` : cette leçon doit être préservée et comptée séparément.

**Tech Stack:** JSON éditorial canonique, React/TypeScript, Vitest/jsdom, scripts Node de validation/génération, Vite/prérendu strict.

---

## Périmètre et décisions déjà instruites

- Préserver les `id`, `slug` et routes des sept leçons existantes.
- Ordre cible : `ld-what-is-vc` → `ld-power-law` → `ld-money-flow` → `ld-stages` → `ld-vc-job` → `ld-roles` → `ld-fund-lifecycle` → cas Europe facultatif → quiz final.
- Ajouter `ld-decouvrir-vc-quiz` (`quiz-comprendre-le-capital-risque`) comme support technique du quiz cumulatif : le registre découverte porte alors huit drop-ins ; le cours partagé en porte actuellement neuf avec `lsv-vc-mise`. Le cas demeure une respiration du parcours et les neuf sessions de `p-decouvrir-vc` deviennent neuf étapes résolues.
- Ne pas substituer les modules longs `l-*` : ils servent de matière et de pistes de sources, mais les `ld-*` conservent leur fonction d’entrée courte.
- Ne pas réécrire `cs-europe-vs-valley` dans ce lot ; vérifier seulement que l’étape facultative reste résolue. Son audit éditorial demeure un lot distinct.
- Le worktree a continué d’évoluer pendant la planification. Un lot concurrent touche notamment `data/courses.json`, `data/parcours.json`, les deux générés de leçons, le sitemap, les tests d’inventaire, `ETAT.md` et `JOURNAL.md`, et crée `data/parcours/02-une-semaine-vc.lessons.json`. Attendre que ce lot soit gelé, reprendre un baseline juste avant le premier test RED et préserver chaque changement préexistant ; plusieurs fichiers sont partagés avec le présent plan.

## 1. Écrire le contrat RED et la matrice de preuves

**Créer :**
- `client/src/content/decouvrirVcParcours.test.ts`
- `client/src/pages/learn/decouvrirVcParcours.dom.test.tsx`

**Le contrat de contenu doit vérifier :**
- conservation des sept couples `id`/`slug` ;
- définition avant loi de puissance dans le cours et le parcours ;
- huit drop-ins publiés dans le registre découverte, ordres contigus à l’échelle de toutes les leçons rattachées à `c-decouvrir-vc`, réciprocité du cours et conservation de `lsv-vc-mise` ;
- au moins deux sources externes HTTPS, précises et qualifiées par leçon factuelle ;
- absence des chiffres et formulations signalés par la revue (tickets/valorisations normatifs, salaires, horaires, « 1 000/3–5 », tutoiement, slogans et métaphores) dans `body`, `summary`, acquis, quiz et explications ;
- questions à trois options, une seule bonne réponse, explication factuelle ;
- quiz final de huit questions couvrant les sept leçons et une lecture intégrée du flux LP → gestionnaire/fonds → société ;
- durée du cours dérivée de la somme des `readMin` et charge du parcours réconciliée ;
- étape finale résolue vers la nouvelle route de quiz et progression atteignant 100 % après sa lecture.

**Recherche en parallèle, lecture seule :**
1. définition + loi de puissance ;
2. flux LP/GP + cycle du fonds ;
3. stades de financement ;
4. travail du fonds + rôles et comité.

Chaque piste produit une matrice « proposition → source exacte → portée géographique/juridique → limite ». Réouvrir les documents eux-mêmes avant usage ; les références des modules `l-*` ne sont que des pistes. Sources prioritaires : EUR-Lex/EuVECA, France Invest, AMF, ILPA, Invest Europe, EIF, IPEV et travaux académiques NBER/JFE. Retirer une proposition si aucune source précise ne la soutient.

## 2. Réécrire les sept leçons et le quiz

**Modifier :** `data/parcours/01-le-vc-sans-bullshit.lessons.json`

- `ld-what-is-vc` : définition sobre, périmètre, fonds propres/quasi-fonds propres, société non cotée, incertitude et liquidité ; aucune analogie casino/banque simplificatrice.
- `ld-power-law` : concentration observée des rendements, limites des données et conséquence de portefeuille ; aucune règle « 9 sur 10 » ou causalité absolue.
- `ld-money-flow` : engagements, appels de capitaux, gestion, investissement puis distributions ; distinguer fonction économique et forme juridique ; retirer assurance-vie, « vrais propriétaires » et modèle 2/20 généralisé.
- `ld-stages` : stades comme vocabulaire variable de maturité, preuves, risques et usage des fonds ; aucun ticket, revenu ou niveau de valorisation présenté comme norme.
- `ld-vc-job` : origination, qualification, diligence, préparation de décision, exécution, suivi et levée ; retirer folklore, horaires et taux de conversion non étayés.
- `ld-roles` : Analyst, Associate, deal lead/Principal, Partner, comité et fonctions de contrôle ; responsabilités déterminées par l’organisation et les délégations, sans salaires ni carry normatifs.
- `ld-fund-lifecycle` : levée, closings, appels, période d’investissement, suivi, sorties, extensions/liquidation ; durées qualifiées comme contractuelles ou fréquentes seulement si la source le permet.
- `ld-decouvrir-vc-quiz` : bref rappel de consigne et huit questions cumulatives, sans nouveau contenu factuel non enseigné.

Conserver une forme courte d’onboarding : paragraphes argumentés, exemples uniquement méthodologiques et explicitement qualifiés, points clés sobres, une vérification locale par leçon. Calibrer `readMin` depuis le texte final plutôt que de remplir artificiellement la promesse horaire.

## 3. Recomposer cours, parcours et rendu du jalon

**Modifier :**
- `data/courses.json`
- `data/parcours.json`
- `client/src/content/lessons.test.ts` et `scripts/generated-content.test.mjs` pour les inventaires recalculés, sans écraser l’incrément concurrent
- `client/src/pages/learn/ParcoursDetailPage.tsx` seulement si nécessaire au jalon adossé à une leçon

Actions :
- réordonner les sept `ld-*` sans déplacer `lsv-vc-mise`, ajouter le quiz au prochain ordre contigu (actuellement 9), éviter un sous-titre fondé sur un nombre ambigu de leçons, puis utiliser `durationSource: "lesson-read-minutes"` avec le total réel du cours partagé ;
- réordonner les étapes, ajouter l’étape 9 `ref.kind = "milestone"` vers `ld-decouvrir-vc-quiz`, conserver le cas Europe en étape 8 facultative ;
- passer le temps du parcours à une source dérivée et aligner hook, cadence, objectifs et libellés sur le contenu réellement livré ;
- pour un milestone résolu vers une leçon, afficher un CTA « Ouvrir le quiz final » et un état fondé sur la progression de lecture, sans modifier le comportement des livrables existants.

Le test DOM couvre la page du parcours, le lien contextualisé vers le quiz, l’état non commencé/en cours/terminé et l’absence de régression des jalons-livrables.

## 4. Régénérer et vérifier

Ne jamais éditer `data/generated/` à la main.

```bash
npm run test --workspace client -- src/content/decouvrirVcParcours.test.ts src/pages/learn/decouvrirVcParcours.dom.test.tsx src/content/lessons.test.ts
npm run validate:content:strict
npm run split:content
npm run check:generated
npm run check
VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build
npm run check
git diff --check
```

Le build canonique précède le dernier `npm run check`, car il régénère le sitemap. Vérifier ensuite dans l’artefact : parcours desktop 1440×1000, mobile 390×844, première leçon, quiz final complet, liens de sources, progression finale, absence de débordement et console sans erreur. Nettoyer les données locales créées pour la recette.

## 5. Revue gelée et clôture

Sur un snapshot gelé, lancer deux revues indépendantes en lecture seule :

- conformité éditoriale et soutien proposition par proposition ;
- cohérence technique des identités, ordres, durées, progression, routes et artefacts générés.

Reproduire chaque constat retenu avant correction, puis rejouer les preuves affectées. Après le dernier gate seulement :

- mettre à jour les comptes et priorités vérifiés dans `Suivis/ETAT.md` en préservant ses modifications préexistantes ;
- ajouter une entrée matérielle à `Suivis/JOURNAL.md` avec les commandes réellement exécutées ;
- ne toucher à aucun `Correction.md` : ce fichier n’existe pas dans l’état inspecté ;
- ne faire ni commit, ni push, ni workflow distant, ni déploiement.

## Risques bornés

- Les sources américaines ne doivent pas devenir des normes France/Europe ; leur géographie sera visible dans le libellé et la prose.
- Les termes GP/LP décrivent des fonctions économiques mais pas une forme juridique universelle.
- L’ajout du quiz augmente d’une unité les inventaires observés au nouveau baseline ; tous les nombres seront recalculés après génération, jamais déduits de l’ancien 145/118 ni du lot concurrent 146/119.
- `c-decouvrir-vc` est désormais partagé avec le drop-in `lsv-vc-mise` de `p-semaine-vc`. Le lot doit préserver cette dépendance et vérifier séparément l’ordre du cours et l’ordre propre à `p-decouvrir-vc`, sans réécrire la leçon concurrente.
- Le cas Europe reste une dette éditoriale facultative explicitement hors lot ; il ne servira pas de source aux sept leçons.

## Exploitation recommandée

- **Écriture et intégration : GPT-5.5, effort xhigh** — suffisant pour ce lot borné et plus économique.
- **Parallélisation :** quatre recherches documentaires en lecture seule ; un seul agent rédacteur pour le JSON partagé.
- **Revue finale : GPT-5.6-sol** uniquement sur le snapshot gelé, pour la vérification croisée sources/contenu/intégration.
