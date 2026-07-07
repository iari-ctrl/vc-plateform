A. Résumé Exécutif
Le projet a un vrai potentiel: ce n’est pas un simple site de formation VC, mais une plateforme statique d’intelligence, lecture, outils et workspace. Le corpus est riche et validé: 22 parcours, 66 leçons servables, 374 termes, 31 dossiers d’écosystème, 9 simulateurs. L’expérience a déjà des signatures fortes: glossaire vivant, lecture active, scrollytelling, figures natives, carnet local. Le risque principal n’est pas le manque de matière, mais la cohérence production. ~~La documentation affirme un routage /fr /en, mais le code expose des routes non localisées dans [App.tsx (line 72)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/App.tsx:72).~~ ~~Le sitemap génère pourtant des URLs /fr et /en via [generate-sitemap.mjs (line 11)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/scripts/generate-sitemap.mjs:11), probablement non servies par l’app actuelle.~~ Le workflow de déploiement saute validation, lint, sitemap et prérendu racine dans [deploy-pages.yml (line 20)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/.github/workflows/deploy-pages.yml:20). npm run lint échoue: 14 erreurs, 28 warnings. Tests et validation contenu passent. Avant mise en ligne, il faut assainir ~~routes, SEO, docs~~ et CI.
B. Diagnostic Global
Fait observé: application React/Vite statique, contenu JSON bundlé, stockage localStorage, sans backend, cohérent avec [README.md (line 53)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/README.md:53). Positionnement implicite: “penser, analyser, décider comme un investisseur VC”. C’est crédible, mais encore concurrencé par un vocabulaire de parcours, test, profil et progression, visible sur [HomePage.tsx (line 82)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/pages/home/HomePage.tsx:82) et [ParcoursPage.tsx (line 231)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/pages/learn/ParcoursPage.tsx:231). Maturité produit: bonne base alpha avancée. Maturité production: insuffisante pour lancement public à cause ~~de l’i18n et du SEO~~ du déploiement.
C. Ce Qui Fonctionne Déjà
La hiérarchie stratégique est bien formulée: Intelligence VC, Formation, Workspace. [IntelligencePage.tsx (line 47)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/pages/intelligence/IntelligencePage.tsx:47) rend visible le corpus existant sans dupliquer les contenus.
La lecture active est un vrai différenciateur: sélection, citation, sauvegarde locale dans [ActiveProse.tsx (line 21)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/components/reading/ActiveProse.tsx:21).
Le glossaire inline est premium et utile, avec popovers et navigation dans [markdown.tsx (line 128)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/lib/markdown.tsx:128).
Les simulateurs, dossiers d’écosystème, mémos, anti-portfolio et scrollytelling créent une proposition plus forte qu’un catalogue de cours. Le split lessons et glossary est propre dans [lessons.ts (line 1)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/content/lessons.ts:1).
D. Ce Qui Affaiblit Le Projet
~~Critique: incohérence i18n. Les docs disent que la Phase 1 est implémentée dans [ARCHITECTURE_EDITION.md (line 162)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/docs/ARCHITECTURE_EDITION.md:162), mais aucun dossier client/src/i18n n’existe et [App.tsx (line 73)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/App.tsx:73) ne monte pas /:locale.~~
~~Critique: SEO contradictoire. [shared/routes.mjs (line 18)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/shared/routes.mjs:18) promet un noindex client automatique, mais [seo.ts (line 75)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/lib/seo.ts:75) ne l’applique pas depuis shared/routes.mjs.~~
~~Critique: le sitemap publie deux locales dans [generate-sitemap.mjs (line 83)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/scripts/generate-sitemap.mjs:83), alors que l’app actuelle semble non localisée.~~
Important: le design est distinctif, mais parfois trop chargé en cartes, sceaux, boussole, atlas et ornements. L’effet “atelier premium” fonctionne; l’effet “prototype très décoré” menace sur certaines surfaces.
Important: le wording professionnel est bon, mais l’orientation “test/profil/parcours” reste trop présente pour une cible investisseur senior.
E. Éléments À Supprimer Ou Nettoyer
~~Vérifier ou supprimer: client/src/pages/admin/, dossier vide observé, bruit de structure.~~
~~Vérifier ou nettoyer localement: client/dist/, build généré ignoré, utile en sortie mais à ne pas traiter comme source.~~
Vérifier l’environnement local: npm ls --depth=0 montre de nombreuses dépendances backend extraneous (express, prisma, @vcpx/server) dans node_modules, résidu post-migration.
~~Supprimer ou archiver proprement: anciens scripts fix*.py, fix*.cjs, prototypes/* apparaissent supprimés dans Git status. Bonne direction,~~ mais il faut finaliser le nettoyage Git.
~~Mettre à jour: [docs/i18n_architecture_FR-EN.md (line 13)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/docs/i18n_architecture_FR-EN.md:13) mentionne encore Express/Prisma et serveur.~~
Corriger: imports inutilisés et any dans [TopBar.tsx (line 1)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/components/chrome/TopBar.tsx:1), [SideNav.tsx (line 1)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/client/src/components/chrome/SideNav.tsx:1), pages de contenu et leçons.
F. Éléments À Modifier Ou Améliorer
~~Aligner décision i18n: soit rétablir /:locale et client/src/i18n, soit supprimer /fr /en des docs, sitemap, robots et prérendu.~~
Changer le workflow GitHub Pages pour lancer le build racine, pas seulement le workspace client. Sinon, pas de validation, pas de sitemap frais, pas de prérendu.
~~Brancher shared/routes.mjs dans seo.ts: noindex automatique, OG image par segment, canonical cohérent.~~
Faire passer npm run lint à zéro erreur avant lancement.
Réduire les CTA “test d’orientation” dans les zones professionnelles. Sur la home, garder “Intelligence VC” comme chemin dominant; placer le test comme aide secondaire.
Renforcer crédibilité éditoriale des dossiers: 24 dossiers silver-* sans sources explicites observées. Ne pas supprimer, mais exiger source, date, niveau de preuve.
Traiter les 8 jalons a-produire dans [data/parcours.json (line 209)](/Users/iar-witness/Documents/Projets/VC SITE/vc-platform/data/parcours.json:209), ou les masquer clairement côté UX.
G. Suggestions Pour Se Démarquer
Créer un “Thesis Radar”: convictions datées, horizon, niveau de preuve, signaux à surveiller, statut révisé.
Créer des “mémos décisionnels” exportables: thèse, risques, contre-thèse, test de falsification, prochaines preuves.
Transformer les dossiers d’écosystème en cartes conceptuelles filtrables par thèse, acteurs, signaux, métriques.
Ajouter une vue “Decision Lab”: cas, anti-portfolio, mémos et journal reliés autour d’un même biais ou type de décision.
Créer une signature éditoriale propriétaire: “preuve, risque, décision” comme structure récurrente des analyses.
H. Priorités D’Action
Immédiat: ~~corriger i18n/SEO/sitemap/prérendu~~ corriger le déploiement, faire passer lint, ~~nettoyer docs obsolètes~~.
Court terme: réduire la tension Formation vs Intelligence, masquer ou compléter les jalons a-produire, sourcer les dossiers faibles.
Amélioration premium: Thesis Radar, Decision Lab, meilleure cartographie des écosystèmes, export de mémos.
I. Questions De Cadrage Restantes
La cible prioritaire du lancement est-elle aspirants/juniors VC, analystes en poste, CVC, ou investisseurs seniors?
~~Le bilingue FR/EN est-il réellement requis au lancement, ou faut-il revenir à une V1 FR propre?~~
La plateforme doit-elle vendre une expertise éditoriale publique, ou devenir un outil personnel de travail et décision?
Contrôles effectués: validate:content OK, validate:content:strict OK, tests client OK 52/52, lint KO 14 erreurs. Référence externe utilisée pour l’audit UI/accessibilité: Vercel Web Interface Guidelines.
