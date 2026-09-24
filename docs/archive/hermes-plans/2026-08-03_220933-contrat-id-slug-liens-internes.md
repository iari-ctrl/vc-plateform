> [!WARNING]
> **Archive non normative.** Ce document est conservé pour preuve historique datée. Il ne doit pas être utilisé comme plan actif, référentiel maintenu ou instruction courante ; vérifier l’état actuel dans `AGENTS.md`, `CLAUDE.md`, `PRODUCT.md`, `Suivis/ETAT.md`, les données et les documents maintenus concernés.

# Contrat ID/slug des liens internes — plan d’implémentation

> **For Hermes:** exécuter ce plan en TDD, avec un seul agent en écriture et une vérification finale sur état gelé.

**Objectif :** faire des IDs l’unique forme de référence interne, puis convertir chaque ID en slug uniquement lors de la construction du lien.

**Architecture :** centraliser les types de liens internes, leur couverture et leur résolution ID → cible dans un module ESM partagé par le validateur Node et le renderer React. Le validateur n’acceptera plus les slugs comme références ; le renderer ne fabriquera plus de route de repli à partir d’une référence inconnue.

**Stack :** ESM partagé, TypeScript, Zod, Vitest, `node:test`.

---

## Constat borné

- Le corpus courant contient 52 références internes : elles utilisent déjà toutes des IDs ; aucune migration de données n’est attendue sur ce snapshot.
- Trois liens de simulateurs sont aujourd’hui cassés parce que `id !== slug` : deux références `power-law` et une référence `pre-post-money`.
- Le validateur accepte actuellement ID ou slug pour `simulator`, `case` et `glossary`, tandis que le renderer applique des règles différentes selon le type.
- Le worktree contient des modifications préexistantes hors périmètre ; elles devront être préservées. Aucun commit, push ou déploiement.

## Plan

### 1. Écrire les preuves RED

**Tests :**
- Modifier `client/src/pages/learn/furtherReadingHref.test.ts` pour exiger notamment `power-law` → `/simulators/power-law-portfolio` et vérifier qu’un slug fourni comme `ref` n’est pas accepté comme référence interne.
- Modifier `scripts/validation-core.test.mjs` avec une fixture synthétique où `id !== slug` : l’ID doit être accepté, le slug et une valeur inconnue doivent être rejetés.
- Couvrir la liste complète des types internes afin qu’un type présent d’un seul côté fasse échouer le test.

**RED ciblé :**
```bash
npm run test --workspace client -- src/pages/learn/furtherReadingHref.test.ts
node --test scripts/validation-core.test.mjs
```

### 2. Créer le contrat partagé

**Créer :**
- `shared/further-reading-contract.mjs`
- `shared/further-reading-contract.d.mts`

Le contrat exposera :
- la liste canonique des types internes et la liste complète incluant `external` ;
- un registre qui exige une couverture exacte de tous les types internes ;
- une résolution exclusivement par `id` ;
- la construction des URL à partir du `slug` résolu, en conservant la forme actuelle du dictionnaire hors du P1 dédié.

Modifier `client/src/content/types.ts` pour dériver `FurtherReading.kind` de ce contrat au lieu de maintenir une union indépendante.

### 3. Brancher validateur et renderer sur le même contrat

**Validateur :**
- Extraire dans `scripts/validation-core.mjs` le contrôle pur des `furtherReading`.
- Dans `scripts/validate-content.mjs`, construire le registre depuis les collections canoniques, utiliser la liste partagée dans le schéma Zod et supprimer l’acceptation ID-ou-slug.

**Renderer :**
- Dans `client/src/pages/learn/furtherReadingHref.ts`, construire le même registre depuis les collections client.
- Résoudre chaque référence interne par ID, puis utiliser le slug de la cible.
- Retourner `undefined` pour une référence inconnue au lieu de produire une route probablement invalide.

Aucune édition de `data/generated/` et, sur l’état observé, aucune modification de `data/*.json`.

### 4. Vérifier sur un état gelé

```bash
npm run test --workspace client -- src/pages/learn/furtherReadingHref.test.ts
node --test scripts/validation-core.test.mjs
npm run validate:content:strict
npm run check
VITE_BASE_URL=/vc-plateform/ VITE_SITE_URL=https://iari-ctrl.github.io/vc-plateform npm run build
git diff --check
git status --short --branch
git diff --cached --name-only
```

Contrôle fonctionnel local : ouvrir les leçons concernées et vérifier que les liens aboutissent à `/simulators/power-law-portfolio` et `/simulators/valorisation-pre-post-money`, sans 404.

### 5. Clore la correction

Après toutes les preuves seulement :
- mettre à jour avec précaution `Suivis/ETAT.md` et `Suivis/JOURNAL.md`, sans écraser leurs modifications préexistantes ;
- consigner les résultats réellement obtenus et distinguer le RED initial du GREEN final ;
- ne pas traiter dans ce lot le P1 sur l’URL canonique du dictionnaire ni les autres constats de l’audit.

## Critères d’acceptation

- Toute référence interne valide est un ID.
- Toute URL rendue contient le slug canonique de la cible.
- Le cas réel `power-law` / `power-law-portfolio` est couvert.
- Un slug utilisé comme référence interne est rejeté par le validateur et non rendu par le client.
- Ajouter ou retirer un type interne exige de mettre à jour les deux consommateurs, faute de quoi les tests échouent.
- Les gates ciblées, `npm run check` et le build strict passent ; staging vide ; aucun changement hors périmètre attribué à cette correction.

## Exécution recommandée

- **Modèle :** GPT-5.5, effort `high` ; GPT-5.6 n’est pas nécessaire pour ce lot borné.
- **Parallélisation :** aucun writer parallèle. Les deux tests ciblés et les inspections finales purement read-only peuvent être parallélisés sur un snapshot gelé ; `npm run check`, le build et la mise à jour des suivis restent séquentiels.
