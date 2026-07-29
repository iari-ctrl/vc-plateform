# Mini-analyse de startup — plan d’implémentation

> **Pour Hermes :** exécuter ce plan après validation explicite, sans commit, push ni déploiement.

**Objectif :** remplacer le jalon non résolu « Écrire ta mini-analyse (gabarit + exemple) » de `/parcours/decrocher-un-stage-en-vc` par un livrable court, exportable, autoévalué et réutilisable.

**Approche :** utiliser l’architecture existante des livrables (`data/deliverables.json` et `/livrables/:slug`) plutôt que créer une nouvelle page. Le livrable guide une production d’une page fondée sur des sources publiques, renvoie au mémo public Shopify publié par Bessemer Venture Partners comme exemple sourcé et utilise le cycle local première version → autoévaluation → révision → achèvement.

**Amendement d’exécution :** après validation du plan, la condition utilisateur a exclu tout exemple inventé. Les références au modèle fictif `lea-deal-memo` sont donc remplacées par `memo-shopify-bessemer` et par la source externe `https://www.bvp.com/memos/shopify`, vérifiée par `curl`.

**Socle :** JSON éditorial, React/Vite existant, validation Zod, Vitest, prérendu strict.

## Analyse de l’existant

- `data/parcours.json` référence `todo-mini-analyse-gabarit` comme `milestone` avec le statut `a-produire`; aucun livrable ne porte encore cet identifiant.
- `resolveStep` sait déjà résoudre un `milestone` vers `/livrables/:slug`.
- `DeliverablePage` fournit déjà consigne, gabarit, modèle, export Markdown, autoévaluation et suivi local : aucune nouvelle interface n’est nécessaire.
- `memo-shopify-bessemer` fournit l’exemple sourcé retenu ; il renvoie au mémo public Shopify de Bessemer Venture Partners. Le document original fait foi et les extraits de la plateforme ne doivent pas servir de banque de chiffres.
- Le validateur impose actuellement à tout `activityKind: "capstone"` la structure particulière du jalon Venture Philanthropy (8 composants, 13 critères, 5 rôles). Cette règle doit être bornée à `vp-recommandation-soutien`; la mini-analyse est bien un jalon final, mais plus léger.
- L’étape préparatoire « Lire une startup en 4 piliers » couvre imparfaitement son libellé. Le présent lot ne restructure pas le parcours : le livrable renverra aux leçons complémentaires existantes.

## Périmètre et contenu cible

### 1. Publier le livrable

**Modifier :** `data/deliverables.json`

Ajouter `todo-mini-analyse-gabarit` avec :

- slug `mini-analyse-startup-candidature-vc`;
- titre sobre « Écrire une mini-analyse de startup »;
- `activityKind: "capstone"`, `estimatedWorkMinutes: 90`, `evaluation: ["auto"]`;
- consigne : choisir une société du portefeuille ou compatible avec la thèse du fonds, travailler uniquement sur des informations publiques, dater les données, distinguer faits, interprétations et informations manquantes, produire 350 à 500 mots hors sources;
- gabarit en six rubriques :
  1. Cadrage et adéquation au fonds;
  2. Thèse en une phrase;
  3. Faits déterminants;
  4. Interprétation et avantage possible;
  5. Risques et informations manquantes;
  6. Position et vérifications suivantes;
- cinq critères d’autoévaluation : adéquation au fonds, traçabilité des faits, solidité de la thèse, hiérarchisation des risques, concision de la note;
- quatre niveaux qualitatifs existants (`insuffisant`, `acceptable`, `solide`, `non-observable`), sans score agrégé;
- modèle `memo: memo-shopify-bessemer`, présenté comme exemple sourcé de structure et de densité, à consulter après une première version;
- leçons associées : `l-thesis-anatomy`, `l-team-market`, `lea-read-startup`, `lea-fund-research`;
- références glossaire strictement utiles, sans multiplication des renvois.

### 2. Résoudre le jalon dans le parcours

**Modifier :** `data/parcours.json`

- passer l’étape `todo-mini-analyse-gabarit` à `status: "existant"` et `keystone: true`;
- conserver le libellé demandé;
- ajouter `evaluation: ["auto"]` au jalon;
- aligner seulement les textes directement concernés (`hook`, `goal`, `milestone.description`) sur un registre institutionnel, en retirant « sortir de la pile » et « le différenciateur »;
- ne pas modifier les autres étapes ni produire le jalon « café-réseau ».

### 3. Préserver les invariants de validation

**Modifier :** `scripts/validate-content.mjs`

- conserver une exigence générique d’autoévaluation pour tout `capstone`;
- borner les nombres exacts 8/13/4/5 au seul livrable `vp-recommandation-soutien`, déjà couvert par `client/src/content/venturePhilanthropyLearning.test.ts`;
- ne pas assouplir les schémas, références croisées ou contrôles éditoriaux.

### 4. Ajouter la non-régression ciblée

**Modifier :** `client/src/content/parcours.test.ts`

Vérifier que :

- le parcours `decrocher-un-stage-en-vc` contient un jalon existant et clé;
- `resolveStep` mène à `/livrables/mini-analyse-startup-candidature-vc`;
- le livrable est un `capstone` autoévalué de 90 minutes;
- les six rubriques, les cinq critères et le modèle `memo-shopify-bessemer` sont présents;
- le jalon Venture Philanthropy conserve son contrat actuel.

### 5. Vérifier puis clôturer

Exécuter sur un état figé :

1. `npm run test --workspace client -- src/content/parcours.test.ts src/content/venturePhilanthropyLearning.test.ts src/lib/learningExports.test.ts`
2. `npm run validate:content:strict`
3. `npm run check`
4. `VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build`
5. Recette Chromium desktop et mobile de `/parcours/decrocher-un-stage-en-vc` puis `/livrables/mini-analyse-startup-candidature-vc` : lien résolu, six rubriques, modèle, export Markdown, cycle local jusqu’à l’achèvement, absence d’erreur console et de débordement.
6. `git diff --check` et contrôle ciblé du diff; aucun changement dans `data/generated/`.

Après ces preuves seulement, intégrer sans écraser les modifications présentes :

- `Suivis/ETAT.md` : état livré, compteur réel des livrables et résultats réellement observés;
- `Suivis/JOURNAL.md` : entrée datée, commandes et recette réellement exécutées.

## Fichiers attendus

- `data/deliverables.json`
- `data/parcours.json`
- `scripts/validate-content.mjs`
- `client/src/content/parcours.test.ts`
- `client/src/lib/learningExports.test.ts`
- `client/public/sitemap.xml`
- `Suivis/ETAT.md`
- `Suivis/JOURNAL.md`

Aucun nouveau composant, type applicatif, artefact `data/generated/` ou dépendance.

## Risques et limites

- Le modèle Shopify–Bessemer est sourcé, mais il reste un exemple de structure et de densité : le livrable demande de ne pas reprendre ses chiffres hors contexte et de renvoyer au document original.
- Les données publiques ne permettent pas toujours une recommandation `invest/pass`; le gabarit doit autoriser « à approfondir » et rendre les inconnues explicites.
- Le worktree contient des modifications sans rapport, notamment dans les suivis et le validateur : relire le diff courant avant chaque patch et préserver ces travaux.
- La restructuration des étapes préparatoires et le jalon « café-réseau » restent hors périmètre.

## Prompt d’exécution après validation

> Exécute le plan `.hermes/plans/2026-07-23_231441-mini-analyse-stage-vc.md` dans le worktree courant. Commence par relire `git status` et les diffs des fichiers ciblés afin de préserver tous les changements existants. Implémente le livrable `todo-mini-analyse-gabarit` avec une prose française sobre, factuelle, institutionnelle et concise; n’invente aucune source ni donnée d’entreprise. Utilise `memo-shopify-bessemer` et `https://www.bvp.com/memos/shopify` comme exemple sourcé, sans créer de nouvelle interface ni de dépendance. Applique les tests et validations du plan, réalise la recette desktop/mobile et vérifie l’export ainsi que le cycle local complet. Mets ensuite à jour `Suivis/ETAT.md` et `Suivis/JOURNAL.md` uniquement avec les résultats effectivement obtenus. Ne modifie jamais `data/generated/`. Ne committe, ne pousse et ne déploie rien. Si une validation échoue, qualifie la cause et corrige uniquement les régressions du périmètre.

**Modèle conseillé :** GPT-5.5, effort `high`. **Parallélisation :** aucune écriture parallèle; la tâche partage deux JSON et le validateur. Les contrôles indépendants peuvent être lancés en parallèle une fois le diff figé.
