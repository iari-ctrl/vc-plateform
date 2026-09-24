# Maison Sapience VC

Plateforme française d'intelligence et de formation au capital-risque, en construction. L'accueil privilégie **Formation** et **Intelligence VC** ; l'espace personnel reste secondaire. Les surfaces présentes ne constituent pas un produit finalisé : voir l'[état courant](Suivis/ETAT.md) et le [contrat produit](PRODUCT.md).

L'application est une SPA statique React/TypeScript/Vite, sans backend applicatif ni compte distant. Les contenus éditoriaux sont versionnés en JSON ; les données utilisateur sont conservées dans le navigateur.

## Démarrage local

Prérequis déclaré : **Node.js ≥ 20** et npm. Depuis la racine du dépôt :

```bash
npm install
npm run dev
```

Vite utilise le port `5173`, ou un port libre suivant. Le hook `predev` exécute `build:memo` puis `split:content` : le démarrage régénère donc des fichiers dérivés. Ne pas les modifier à la main.

## Contrôles utiles

| Commande | Portée |
| --- | --- |
| `npm run check` | Générés glossaire/leçons, contenu strict, glossaire, TypeScript, lint et tests |
| `npm run check:generated` | Parité des quatre sorties glossaire/leçons, sans écriture |
| `npm run check:memo` | Parité des HTML du simulateur de note d'investissement, sans écriture |
| `npm run validate:content:strict` | Schémas et intégrité ; erreurs et warnings bloquants, sauf `softWarnings` reconnus |

Les scripts et dépendances font foi dans [`package.json`](package.json) et [`client/package.json`](client/package.json). Choisir des contrôles proportionnés au changement selon [`CLAUDE.md` §7](CLAUDE.md#7-validation-proportionnée).

## Documentation : lire selon la tâche

| Besoin | Référence maintenue |
| --- | --- |
| Contribuer avec un agent | [`AGENTS.md`](AGENTS.md), puis [`CLAUDE.md`](CLAUDE.md) |
| Comprendre le produit et la marque | [`PRODUCT.md`](PRODUCT.md) |
| Éditer du contenu, comprendre les données ou le build | [Architecture et édition](docs/ARCHITECTURE_EDITION.md) — accès par section |
| Concevoir ou modifier l'interface | [Design system](docs/DESIGN_SYSTEM.md) |
| Concevoir un parcours | [Guide des parcours](docs/parcours/README.md) |
| Comprendre la direction Intelligence VC | [Stratégie](docs/STRATEGIE-vc-intelligence.md) |
| Lire l'état vérifié, les risques et les priorités | [`Suivis/ETAT.md`](Suivis/ETAT.md) |
| Retrouver une livraison passée | [`Suivis/JOURNAL.md`](Suivis/JOURNAL.md) — entrées datées |

`docs/archive/` et `Suivis/AUDIT/` conservent l'historique, sans autorité normative. Les comportements implémentés se vérifient dans le code, les données et les scripts, pas dans les anciens comptes rendus.

## Construction et sauvegarde

`npm run build` régénère le simulateur de note, les splits et le sitemap, construit le client puis lance le prérendu **strict**. Il exige `VITE_SITE_URL`, une base `VITE_BASE_URL` cohérente et un navigateur Chromium utilisable. Les paramètres, effets d'écriture et exigences d'hébergement sont décrits dans le [manuel d'architecture, §6](docs/ARCHITECTURE_EDITION.md#workflow).

Le travail courant reste local-first. GitHub sert de sauvegarde ; le [workflow Pages](.github/workflows/deploy-pages.yml) est manuel. **Ni push ni déploiement sans demande explicite.** La [procédure de sauvegarde](Suivis/PROCEDURE_PUSH.md) ne vaut pas autorisation de remise en ligne.

## Limites à connaître

- Le stockage `localStorage` n'est ni une sauvegarde distante ni un espace confidentiel. Ne pas y déposer de secrets ou de données sensibles.
- Les routes, bundles et fichiers publics restent accessibles sans authentification ; `noindex` n'est pas un contrôle d'accès.
- Une application statique n'est pas nécessairement utilisable hors ligne : les ressources non chargées dépendent de l'hôte, sans garantie de service worker.
