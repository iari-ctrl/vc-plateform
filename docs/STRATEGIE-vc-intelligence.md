# Stratégie VC Intelligence Platform

Document canonique fusionné — positionnement, architecture cible et roadmap

Projet : `vc-platform`  
Date de consolidation : 2026-06-11  
Dernière mise à jour : 2026-07-07 (architecture statique V1 FR ; routes/prérendu alignés ; compteurs de contenu vérifiés)
Sources fusionnées : `docs/Stratégie doc et ROADMAP` et `docs/AUDIT-vc-intelligence.md`  
Règle d'arbitrage : en cas de contradiction, le document **Stratégie** prime sur l'audit. L'audit reste une archive historique.

---

## 1. Résumé exécutif

Le projet ne doit pas être interprété comme une simple plateforme de formation VC qui essaierait de devenir plus premium. Le bon cadrage est différent : il s'agit d'une **VC Intelligence Platform** en construction, dont la couche formation a été développée en premier.

La couche formation n'est pas une erreur. Elle constitue un socle utile pour :

- aspirants VC ;
- juniors ;
- professionnels en repositionnement ;
- CVC ou profils corporate découvrant les logiques du venture ;
- utilisateurs qui ont besoin de structurer leurs bases avant d'accéder à des contenus plus professionnels.

Mais cette couche doit représenter **10 à 20 %** du produit final. Elle ne doit pas dominer l'identité produit.

Le cœur de la plateforme doit être la **VC Intelligence**, soit **80 à 90 %** de l'ambition finale :

- research notes ;
- thesis lab ;
- market and ecosystem atlas ;
- decision-grade case studies ;
- investor playbooks ;
- fund economics tools ;
- frameworks ;
- intelligence briefs ;
- workspace de réflexion et de production.

Positionnement cible :

> Une plateforme de VC Intelligence pour professionnels du capital-risque, enrichie par une couche de formation structurée pour accélérer la montée en compétence des aspirants, juniors et professionnels en repositionnement.

La priorité n'est pas d'ajouter des fonctionnalités au hasard. La priorité est de :

1. finaliser proprement la couche formation ;
2. repositionner l'interface autour de la VC Intelligence ;
3. construire progressivement les piliers professionnels ;
4. éviter de créer une plateforme large mais vide ;
5. sécuriser l'architecture technique avant d'étendre les collections de contenu.

---

## 2. État actuel corrigé

L'audit du 2026-06-10 a correctement identifié l'effet produit dominant de l'époque : l'expérience ressemblait encore trop à une plateforme de formation, parce que la couche VC Intelligence n'était pas encore assez visible. Certains constats techniques de l'audit sont désormais dépassés au 2026-07-07.

État vérifié du corpus :

| Élément | État actuel |
|---|---:|
| Rayons de Bibliothèque (`data/paths.json`) | 9 |
| Parcours (`data/parcours.json`) | 22 |
| Parcours `now / next / later` | 4 / 13 / 5 |
| Familles de parcours | 6 |
| Cours | 16 |
| Leçons canoniques (`data/lessons.json`) | 55 |
| Leçons drop-in (`data/parcours/*.lessons.json`) | 11 |
| Leçons servables au total | 66 |
| Études de cas | 6 |
| Livrables de parcours (`data/deliverables.json`) | 2 |
| Analyses / blog | 8 |
| Dossiers d'écosystème (`data/ecosystems.json`) | 31 (3 racines, 28 sous-dossiers) |
| Convictions dérivées des dossiers | 24 |
| Mémos annotés (`data/memos.json`) | 5 |
| Anti-portfolio (`data/antiPortfolio.json`) | 9 entrées + 5 motifs |
| Simulateurs | 9 |
| Termes de glossaire | 374 |
| Étapes de parcours | 150, dont 8 `a-produire` (2 milestones réalisés en livrables) |

Corrections par rapport à l'audit historique :

- **Git** : le dépôt est initialisé, `master` suit `origin/master`, une baseline existe. Le risque critique relevé par l'audit est résolu ; le risque restant est de maintenir une discipline de branches, commits et rollback.
- **Architecture statique V1 FR (2026-07-07)** : l'application n'a plus de backend applicatif, API, CMS, base SQLite/Prisma ni routes localisées `/fr` `/en`. Les JSON sources de `/data` sont la source de vérité, le client les bundle, et les données utilisateur restent dans `localStorage`.
- **Leçons drop-in** : 11 leçons réparties dans 3 registres `data/parcours/*.lessons.json` sont fusionnées avec les 55 leçons canoniques par `scripts/split-lessons.mjs`, puis servies via `data/generated/lessons.index.json` et `data/generated/lessons.bodies.json`. Le sujet restant est le **workflow d'authoring** : quand garder un registre drop-in, quand replier dans `data/lessons.json`, comment synchroniser les références.
- **Simulateurs** : le corpus actuel compte 9 simulateurs.
- **Familles de parcours** : les données actuelles exposent 6 familles (`decouvrir`, `entretien`, `levee`, `grade`, `maitriser`, `express`), le sur-mesure vivant dans `profileParcours.json`.
- **Couche VC Intelligence amorcée (2026-06-13)** : la couche d'**analyse signée** a commencé à se construire, ce qui nuance le diagnostic « apprentissage uniquement ». Le blog porte désormais 8 analyses (dont 4 « lectures obliques »), et surtout un **espace dédié « Décortiquer un écosystème »** (`/ecosystemes`, 100 % client, `data/ecosystems.json`) publie 31 dossiers vivants arborescents avec thèse falsifiable, convictions datées et figures natives — réalisation concrète du Pilier 5 (Atlas) et du format §10.9.
- **IA en 3 piliers livrée (2026-06-26)** : la navigation publique et la vitrine sont réorganisées autour d'**Intelligence VC**, **Formation** et **Workspace**. Cinq index publics ont été ajoutés sans déplacer les détails existants : `/intelligence`, `/convictions`, `/decisions`, `/methode`, `/livrables`. Le sitemap publie désormais les routes canoniques sans préfixe de langue.
- **SEO statique et routes (2026-07-07)** : `shared/routes.mjs` centralise les routes statiques, le `noindex` et l'image Open Graph par segment. `scripts/collect-routes.mjs` alimente à la fois le sitemap et le prérendu, ce qui évite la divergence entre URLs indexables et HTML statique généré.
- **Scrollytelling interactif amorcé** : `BlogPostPage` supporte déjà une vue `?view=scrolly` pour certains articles longs. Deux lectures obliques ont un composant dédié (`DebordScrollytelling`, `HirschmanScrollytelling`). Cette piste doit devenir un axe systématique des longs formats, avec exigence de design éditorial et de direction artistique.
- **Milestones de parcours réalisés en livrables (2026-06-15)** : les étapes `a-produire` où l'apprenant *produit* un artefact deviennent des pages `/livrables` (brief + gabarit + grille d'auto-évaluation + renvoi à un modèle existant), via `data/deliverables.json` et `client/src/pages/DeliverablePage.tsx`. Deux livrables early-stage (pre-seed/seed) sont en ligne et chacun amorce un pilier Intelligence par « double emploi » : la **simulation de comité (seed)** s'appuie sur le 1ᵉʳ Case décisionnel `cs-seed-ic` (Pilier 4, §10.4), et la **thèse propriétaire** prend pour modèle un dossier `/ecosystemes` existant (Thesis Lab de facto, §10.2). Reste 8 milestones `a-produire` ; le mémo deal seed est la prochaine cible early-stage, la Série A est hors priorité.

Lecture correcte de l'état actuel :

> La plateforme dispose maintenant d'une couche Intelligence navigable. La formation reste une rampe d'accès, mais elle ne porte plus seule la première impression produit.

Il ne faut donc pas supprimer la formation. Il faut :

- la finaliser ;
- la rendre cohérente ;
- la ranger dans une Library ;
- la taguer correctement ;
- la rendre secondaire dans la navigation ;
- l'utiliser comme socle de montée en compétence.

---

## 3. Vision produit

### 3.1 Vision cible

La plateforme doit devenir un environnement professionnel permettant de :

- comprendre les marchés ;
- analyser les écosystèmes ;
- construire des thèses d'investissement ;
- challenger des hypothèses ;
- étudier des cas d'investissement ;
- utiliser des outils de fund economics ;
- structurer des notes et mémos ;
- développer une pensée d'investisseur.

Promesse centrale :

> Transformer l'information VC en thèses, décisions, mémos et outils de réflexion.

### 3.2 Ce que le produit doit être

La plateforme doit être :

- une plateforme d'intelligence VC ;
- un espace de structuration de pensée ;
- un outil de montée en compétence accélérée ;
- une bibliothèque professionnelle ;
- un poste de travail intellectuel pour investisseurs ;
- une base de frameworks et de méthodes ;
- un environnement de recherche et de décision.

### 3.3 Ce que le produit ne doit pas être

La plateforme ne doit pas devenir :

- un simple MOOC VC ;
- un blog startup ;
- une base de données faible ;
- un clone de PitchBook ;
- un clone de CB Insights sans data moat ;
- une plateforme founder/fundraising ;
- une collection de contenus débutants ;
- un dashboard artificiel avec des données inventées ;
- une interface premium mais creuse.

---

## 4. Positionnement stratégique

### 4.1 Positionnement recommandé

**VC Intelligence Platform**  
Une plateforme professionnelle pour analyser le venture capital, construire des thèses d'investissement, comprendre les dynamiques de marché et développer une expertise VC opérationnelle.

### 4.2 Formulation courte

> La plateforme qui aide à penser, analyser et décider comme un investisseur VC.

### 4.3 Formulation longue

> Une plateforme de VC Intelligence conçue pour les professionnels du capital-risque, CVC, analystes private markets et profils en montée en compétence, combinant research notes, thesis lab, atlas de marchés, cas décisionnels, outils de fund economics, frameworks et bibliothèque de formation structurée.

### 4.4 Répartition cible

| Couche | Poids cible | Rôle |
|---|---:|---|
| VC Intelligence | 80-90 % | Recherche, thèses, analyses, outils, cas, frameworks, workspace |
| Learning & Development | 10-20 % | Formation, orientation, progression, réassurance, montée en compétence |

Principe directeur :

> La formation est une rampe d'accès. La VC Intelligence est le cœur du produit.

---

## 5. Diagnostic

### 5.1 Signaux encore trop learning / founder / career

Les signaux qui donnent encore une impression trop formation :

- homepage trop orientée introspection ;
- CTA principal trop orienté onboarding ;
- parcours aspirants trop visibles ;
- contenus entretien/stage trop exposés ;
- contenus founder/fundraising trop présents ;
- section "Analyses" trop éditoriale, pas assez intelligence ;
- cas fictifs utiles pédagogiquement mais insuffisants comme preuve professionnelle ;
- simulateurs parfois présentés comme exercices plutôt que comme outils de décision ;
- dashboard encore trop progression-centric.

L'audit apportait un point utile : beaucoup de surfaces actuelles répondent encore à "comment apprendre le VC ?" plutôt qu'à "comment produire une décision ou une thèse VC exploitable ?".

### 5.2 Actifs forts à conserver

La plateforme possède déjà des actifs solides :

- profondeur du glossaire ;
- simulateurs fund economics ;
- architecture JSON ;
- validation de contenu ;
- contenu sur thèses, term sheets, dilution, fund returns ;
- cas pratiques ;
- système de notes/bookmarks ;
- structure de parcours ;
- potentiel de Library professionnelle ;
- esthétique éditoriale premium ;
- mécanisme de liens internes via glossaire, `relatedLessonIds`, `furtherReading` et routes de contenu.

Ces actifs doivent être conservés, mais repositionnés.

### 5.3 Diagnostic final

Le problème n'est pas la matière. Le problème est la **hiérarchie produit**.

Aujourd'hui, la formation occupe le premier plan. Demain, elle doit être une couche de développement dans une plateforme dont les surfaces principales sont :

- Intelligence ;
- Thesis Lab ;
- Atlas ;
- Cases ;
- Tools ;
- Workspace.

---

## 6. Benchmarks stratégiques

### 6.1 PitchBook

Rôle : référence private markets data terminal.

À retenir :

- structuration de données ;
- fiches entreprises ;
- fiches investisseurs ;
- deals ;
- fonds ;
- LPs ;
- comparables ;
- workflows de diligence.

Application au projet :

- copier la rigueur de structuration ;
- copier la hiérarchisation professionnelle ;
- ne pas prétendre à l'exhaustivité ;
- ne pas inventer de données ;
- ne pas créer un faux terminal financier.

### 6.2 CB Insights

Rôle : référence intelligence, signaux, monitoring, research et market maps.

À retenir :

- briefings actionnables ;
- signaux faibles ;
- research orientée décision ;
- monitoring de marchés ;
- market maps ;
- synthèse actionnable.

Application au projet :

- reprendre la logique "what matters / why now / investor implications" ;
- éviter la sur-promesse prédictive ;
- ne pas dépendre de flux massifs non maintenus.

### 6.3 Dealroom

Rôle : référence pour les écosystèmes startups, scaleups, investisseurs, géographies et verticales.

À retenir :

- atlas d'écosystèmes ;
- cartographie géographique ;
- verticales ;
- capital flows ;
- investor mapping ;
- benchmarks villes/pays.

Application au projet :

- Dealroom est la référence principale pour le futur Atlas ;
- copier la logique d'écosystème et de segmentation ;
- éviter l'atlas vide, décoratif ou faussement exhaustif.

### 6.4 Carta

Rôle : référence pour fund performance, equity, dilution, ownership, benchmarks de fonds.

À retenir :

- IRR ;
- TVPI ;
- DPI ;
- fund performance ;
- dilution ;
- ownership ;
- benchmarks de vintage.

Application au projet :

- Carta est une référence directe pour la partie Tools / Fund Economics ;
- copier la pédagogie des métriques et la clarté des visualisations ;
- lier chaque métrique à une décision ;
- ne jamais publier de comparaison non sourcée.

### 6.5 Autres références

Bessemer, a16z, First Round, Data-Driven VC, Sacra et The Information Pro apportent des repères complémentaires :

- Bessemer : thèses sectorielles et benchmarks ;
- a16z : vision marché et puissance narrative ;
- First Round : playbooks opérationnels ;
- Data-Driven VC : stack VC, data, AI et operating system ;
- Sacra : private company research ;
- The Information Pro : modèle média premium + data + tools.

La plateforme doit combiner profondeur intellectuelle, research exploitable, frameworks, outils, workspace et formation secondaire.

### 6.6 Interactive journalism / scrollytelling

Rôle : référence de benchmark pour les longs formats interactifs, la narration visuelle et le design d'information. Le dépôt [`wbkd/awesome-interactive-journalism`](https://github.com/wbkd/awesome-interactive-journalism) répertorie des exemples exigeants de data journalism, storytelling interactif, visualisations, formats immersifs et enquêtes visuelles.

À retenir :

- design éditorial fort ;
- usage inventif des technologies web ;
- nouvelles formes de storytelling ou de visualisation ;
- recherche de données ou investigation solide ;
- engagement actif du lecteur ;
- fonctionnement robuste sur tous les devices.

Application au projet :

- utiliser ce dépôt comme **swipe file qualitatif** avant chaque scrollytelling stratégique ;
- sélectionner 3 références par projet : une pour la structure narrative, une pour l'interaction/data, une pour la direction artistique ;
- traduire ces inspirations dans le langage VC : flux de capitaux, chaînes de valeur, bascules de marché, dynamique concurrentielle, thèse/falsification, scénarios investisseur ;
- ne pas copier les formats tels quels : chaque long format doit trouver une grammaire visuelle propre au sujet ;
- faire du design une exigence de compréhension, pas une couche décorative.

---

## 7. Architecture cible

### 7.1 Navigation recommandée

1. Intelligence
2. Thesis Lab
3. Atlas
4. Cases
5. Tools
6. Library
7. Glossary
8. Workspace

Principe : learning is inside the platform, not the platform.

### 7.2 Rôle de chaque section

**Intelligence**  
Surface principale de recherche et d'analyse.

Contenus :

- research notes ;
- sector notes ;
- market briefs ;
- trend analysis ;
- capital flow notes ;
- risk notes ;
- counter-thesis notes ;
- intelligence briefs à terme.

**Thesis Lab**  
Cœur différenciant de la plateforme.

Contenus :

- thèses d'investissement ;
- contre-thèses ;
- stress tests ;
- falsification criteria ;
- why now analysis ;
- venture-scale assessment ;
- liens vers tools, cases, glossary.

**Atlas**  
Cartographie analytique des marchés et écosystèmes.

Contenus :

- vertical maps ;
- ecosystem pages ;
- geography pages ;
- market maturity notes ;
- investor landscape ;
- regulation and exit context.

**Cases**  
Cas d'investissement orientés décision.

Contenus :

- cas réels sourcés ;
- cas stylisés explicitement signalés ;
- investment committee simulations ;
- follow-on cases ;
- reserve allocation cases ;
- CVC cases.

**Tools**  
Outils professionnels.

Contenus :

- simulateurs ;
- calculators ;
- templates ;
- fund economics tools ;
- ownership tools ;
- dilution tools ;
- reserve tools.

**Library**  
Couche formation et développement.

Contenus :

- parcours ;
- leçons ;
- playbooks ;
- fondamentaux ;
- career content ;
- founder-facing content secondaire ;
- guides structurants.

**Glossary**  
Infrastructure de référence, connectée à tous les contenus.

**Workspace**  
Espace de travail personnel.

Contenus :

- notes ;
- bookmarks ;
- thesis drafts ;
- saved research ;
- saved frameworks ;
- reading trails ;
- memo drafts à terme.

### 7.3 Hiérarchie produit

L'audit proposait Workspace en premier dans la hiérarchie d'usage pour les utilisateurs de retour. La stratégie tranche la navigation publique dans l'ordre suivant :

1. Intelligence ;
2. Thesis Lab ;
3. Atlas ;
4. Cases ;
5. Tools ;
6. Library ;
7. Glossary ;
8. Workspace.

Nuance conservée : Workspace doit devenir le hub de retour des utilisateurs engagés, mais pas nécessairement la première surface de découverte publique.

---

## 8. Taxonomie de contenu

### 8.1 Métadonnées recommandées

Ajouter ou formaliser les champs suivants.

**contentKind**

- `fundamental` ;
- `playbook` ;
- `research-note` ;
- `sector-note` ;
- `thesis` ;
- `atlas` ;
- `case` ;
- `framework` ;
- `tool` ;
- `reference`.

**audience**

- `investor` ;
- `aspiring-investor` ;
- `junior-investor` ;
- `cvc` ;
- `founder-facing` ;
- `all`.

**rigor**

- `intro` ;
- `practitioner` ;
- `desk-reference`.

**status**

- `draft` ;
- `review` ;
- `published` ;
- `archived` ;
- `needs-update`.

**evidenceLevel**

- `conceptual` ;
- `analytical` ;
- `sourced` ;
- `decision-grade` ;
- `maintained-intelligence`.

**maintenanceClass**

- `evergreen` ;
- `perishable`.

**visibility**

- `public` ;
- `gated` ;
- `internal`.

### 8.2 Objectif

Cette taxonomie permet de :

- conserver la formation sans qu'elle domine ;
- séparer les contenus aspirants, professionnels et founder-facing ;
- filtrer les contenus par audience ;
- éviter les suppressions brutales ;
- préparer la recherche interne ;
- préparer le Workspace ;
- améliorer la crédibilité éditoriale ;
- structurer les futures collections.
- distinguer les contenus durables des contenus périssables ;
- trancher clairement ce qui sert la réputation publique et ce qui peut devenir gated plus tard.

### 8.3 Gouvernance

Aucun nouveau contenu professionnel ne doit être publié sans :

- audience ;
- contentKind ;
- rigor ;
- status ;
- evidenceLevel ;
- maintenanceClass ;
- visibility ;
- date de publication ;
- date de mise à jour ;
- reviewDate pour tout contenu `perishable` ;
- liens vers glossary ;
- liens vers contenus connexes.

---

## 9. Stratégie éditoriale

### 9.1 Principe éditorial

La plateforme doit passer d'une logique :

> apprendre le VC

à une logique :

> produire un raisonnement VC exploitable.

### 9.2 Système de preuve

Chaque contenu VC Intelligence doit indiquer :

- sources ;
- hypothèses ;
- limites ;
- implications investisseur ;
- signaux à surveiller ;
- contre-arguments ;
- degré de confiance ;
- date de mise à jour.

### 9.3 Ton éditorial

Le ton doit être :

- professionnel ;
- analytique ;
- précis ;
- structuré ;
- sobre ;
- non promotionnel ;
- non scolaire ;
- non startup-bullshit.

Ce ton est formalisé en **charte de style rédactionnel non négociable**, applicable à toute rédaction du site (leçons, glossaire, analyses, dossiers d'écosystème, parcours, simulateurs). Source canonique : la section « Writing style (non-negotiable) » du skill `.claude/skills/ecosystemes/SKILL.md` et la mémoire `style-redaction-naturel` ; résumé opérationnel dans `docs/ARCHITECTURE_EDITION.md` §4.0.c. En clair : prose fluide à phrases de longueur variée, une idée par paragraphe, énoncer le fait puis sa conséquence et s'arrêter ; bannir énumérations mécaniques, punchlines de fin de paragraphe, gras à outrance, métaphores vendeuses, superlatifs et aphorismes de clôture.

### 9.4 Ce qui doit disparaître du premier niveau de lecture

À retirer de la vitrine principale :

- formulations trop débutantes ;
- titres trop rassurants ;
- vocabulaire d'école ;
- promesse de "découvrir le VC" comme angle principal ;
- contenus de stage/entretien trop visibles ;
- contenus founder/fundraising comme porte d'entrée.

Ils peuvent rester dans la Library, mais pas dans la vitrine.

### 9.5 Règle de preuve stricte

Ne jamais présenter une donnée inventée comme un fait. Si un cas est stylisé, il doit être signalé comme stylisé. Si une analyse est structurelle mais non maintenue comme un flux de marché, elle doit le dire.

### 9.6 Distribution owned

Angle mort actuel : la roadmap parle de partages qualifiés, de partenariats et de réputation, mais ne prévoit aucun mécanisme de distribution owned. Sans newsletter, capture email ou RSS, l'Intelligence risque de devenir un journal intime : utile mais invisible.

Décision :

- lancer une newsletter dès la Phase 4 ;
- chaque research note doit exister aussi comme email ;
- chaque page Intelligence doit proposer une capture email sobre ;
- prévoir un RSS pour les notes publiques ;
- traiter l'audience owned comme un actif de portefeuille et un canal de partenariats ;
- ne pas attendre d'avoir une plateforme complète : si le contenu existe déjà, le coût marginal de l'email est faible.

Règle :

> Une note Research publiée sans mécanisme de distribution est incomplète.

### 9.7 Cadence de maintenance

Angle mort actuel : l'audit signalait que l'intelligence périme, mais la stratégie ne le rendait pas opérationnel.

Décision :

- tout contenu doit être tagué `evergreen` ou `perishable` ;
- tout contenu `perishable` doit avoir une `reviewDate` ;
- le format maintenable en solo est un brief trimestriel par thème prioritaire, par exemple `European Seed — Q3 2026` ;
- engagement réaliste : 4 briefs maintenus par an, plutôt que des promesses de veille continue.

Règle :

> Mieux vaut un rythme trimestriel tenu qu'une section Intelligence ambitieuse et périmée.

### 9.8 Public-first vs gated

Angle mort actuel : le document parle de réputation, SEO et plateforme Intelligence, mais ne tranche pas entre public et gated. Ces objectifs peuvent entrer en tension.

Décision :

- stratégie **public-first** tant que l'objectif principal est la réputation ;
- Research, Thesis Lab pilotes, Cases stylisés, Tools de démonstration et Atlas MVP doivent être indexables et partageables ;
- le gated peut venir plus tard pour sauvegarde, Workspace, exports, templates avancés, séries complètes ou contenus partenaires ;
- ne pas enfermer les premiers contenus Intelligence avant d'avoir prouvé leur valeur publique.

Règle :

> Tant que le moat recherché est la crédibilité, la distribution publique prime sur la rétention gated.

### 9.9 Scrollytelling, design éditorial et mémorisation

Angle mort actuel : les articles longs et notes denses peuvent être excellents, mais rester difficiles à visualiser, parcourir et retenir. La plateforme ne doit pas seulement publier des textes longs ; elle doit aussi aider le lecteur à **voir** le raisonnement.

Décision :

- tout article long stratégique, research note dense, lecture oblique, cas majeur ou dossier à forte charge conceptuelle doit avoir un équivalent en **scrollytelling interactif** ;
- l'article linéaire reste la version canonique, lisible, indexable et citable ; le scrollytelling est la version de compréhension visuelle, de pédagogie active et de mémorisation ;
- le scrollytelling doit extraire la structure du raisonnement : progression logique, tensions, causalités, données clés, cartes mentales, matrices, timelines, bascules de thèse, points de falsification ;
- la dimension artistique et design est essentielle : direction artistique propre au sujet, composition éditoriale, typographie, rythme de scroll, micro-interactions, motion sobre, illustrations ou scènes visuelles quand elles clarifient vraiment l'idée ;
- chaque scrollytelling stratégique doit démarrer par un mini-benchmark d'inspiration, notamment à partir de `wbkd/awesome-interactive-journalism`, pour cadrer l'ambition narrative, interactive, visuelle et responsive ;
- les données et figures interactives doivent rester sourcées, sobres et explicites sur leurs limites ;
- l'expérience doit rester accessible, performante, responsive et utilisable sans effets gratuits.

Règle :

> Un long format Intelligence important sans équivalent scrollytelling est incomplet ; un scrollytelling sans exigence artistique et design est une simple mise en page animée, pas un produit de compréhension.

---

## 10. Piliers de contenu prioritaires

### 10.1 Pilier 1 — Research / Intelligence

Priorité : maximale.

Objectif : créer une vraie surface d'intelligence.

Formats :

- market structure note ;
- sector note ;
- capital flow analysis ;
- risk brief ;
- trend memo ;
- investment implication brief ;
- counter-thesis.

Premiers contenus recommandés :

1. European Seed Market Structure
2. AI Infrastructure: Where Venture-Scale Value May Accrue
3. DPI Pressure and the New Fundraising Reality
4. CVC Strategic Investing: Financial Return vs Strategic Optionality
5. Emerging Managers Europe: Fund I Construction and First Close Reality
6. Africa-Europe VC Corridor: Opportunity or Narrative?

Structure type :

1. Executive summary
2. Why it matters
3. Market structure
4. Key signals
5. Investor implications
6. Risks
7. Counter-arguments
8. Sources
9. Related thesis
10. Related tools
11. Related glossary

Chaque note Research publique doit produire quatre sorties :

- la page longue ;
- l'email newsletter ;
- un angle de partage court pour partenaires, experts ou communautés VC ;
- un équivalent scrollytelling interactif pour visualiser les données, la mécanique de raisonnement et les implications investisseur.

### 10.2 Pilier 2 — Thesis Lab

Priorité : maximale.

Objectif : créer le cœur différenciant.

Premières thèses recommandées :

1. AI Infrastructure Europe
2. Regulated Vertical SaaS
3. Climate Adaptation Infrastructure
4. Africa-Europe Fintech Rails
5. Defense, Security and Resilience Tech Europe

Structure type :

1. Thesis statement
2. Market context
3. Why now
4. Customer/problem shift
5. Value chain
6. Competitive landscape
7. Business model logic
8. Venture-scale potential
9. Key risks
10. Falsification criteria
11. What would change our mind
12. Related cases
13. Related tools
14. Related glossary terms

> **État d'implémentation (2026-06-15).** Le Thesis Lab existe déjà *de facto* sous la forme des dossiers `/ecosystemes` (§10.5 / §10.9) : thèse falsifiable, convictions datées avec degré d'assurance, signaux de réfutation et figures natives — la structure-type ci-dessus, au format long. Une première passerelle parcours → Thesis Lab est livrée : le livrable **« thèse propriétaire » (pre-seed/seed)** (`/livrables/these-proprietaire-pre-seed-seed`) fait écrire à l'apprenant une note de thèse + un plan de portefeuille, et prend pour modèle un dossier existant (*IA appliquée Europe*). **Reste à faire :** créer des dossiers-racines explicitement « thèse » sur les angles recommandés ci-dessus encore absents (AI Infrastructure, Climate Adaptation, Defense Tech…) et les relier aux Cases / Tools.

### 10.3 Pilier 3 — Tools / Fund Economics

Priorité : très élevée.

Objectif : repositionner les simulateurs comme outils professionnels.

Outils prioritaires :

1. Dilution simulator
2. Waterfall simulator
3. DPI / TVPI / MOIC simulator
4. Management fees simulator
5. Carry simulator
6. Reserve allocation model
7. Follow-on decision model
8. Ownership target model
9. Exit scenario model
10. Fund construction model
11. Secondaries / continuation fund calculator
12. BSA-AIR converter
13. France vs US term sheet comparator

Chaque outil doit inclure :

- cas d'usage professionnel ;
- explication des inputs ;
- explication des outputs ;
- limites du modèle ;
- lien vers contenus Library ;
- lien vers Research/Thesis/Cases ;
- possibilité de sauvegarde Workspace à terme.

Angle praticien à exploiter : les outils fund economics collent parfaitement aux besoins des emerging managers européens, notamment fund I construction, first close dynamics, GP commit, warehousing, reserves et continuation funds.

### 10.4 Pilier 4 — Cases

Priorité : élevée.

Objectif : transformer les cas pédagogiques en cas décisionnels.

Premiers cas recommandés :

1. Seed Investment Committee — stylized case
2. Series B Follow-on Decision — stylized case
3. Fund Reserve Allocation Case
4. CVC Strategic Investment Case
5. Public sourced case from a known startup/fund outcome
6. Anti-portfolio / pass analysis
7. Memo library annotée

Structure type :

1. Context
2. Investment question
3. Market timing
4. Deal dynamics
5. Key risks
6. Decision options
7. Decision taken
8. Outcome or stylized outcome
9. Pattern extracted
10. Lessons for investors
11. Related thesis
12. Related tool
13. Related glossary

Deux formats à forte valeur praticien :

- **Anti-portfolio / pass analysis** : analyser pourquoi un fonds a passé sur un futur winner, avec l'information disponible à l'époque et le signal raté. Sources publiques uniquement. Le format montre le jugement, pas seulement le résultat.
- **Memo library annotée** : partir de memos d'investissement publiés légalement par leurs auteurs, puis annoter ligne par ligne la logique décisionnelle, les hypothèses, les signaux forts/faibles et les angles morts.

> **État d'implémentation (2026-06-15).** Le premier cas décisionnel est livré — `cs-seed-ic`, **« Seed Investment Committee — stylized case »** (l'item 1 ci-dessus), structure §10.4 complète (contexte → question → timing → dynamique → risques → options → décision → outcome stylisé → pattern → leçons), un deal seed (« Volta ») qui divise le comité. Il sert de **modèle** au livrable **« simulation de comité (seed) »** (`/livrables/simulation-comite-investissement-seed`), où l'apprenant rédige son ordre du jour d'IC avant de le confronter au cas. **Reste à faire :** les cas suivants de la liste (Series B follow-on, fund reserve allocation, CVC), l'anti-portfolio (déjà amorcé sous `/anti-portfolio`) et la memo library annotée (`/memos`).

### 10.5 Pilier 5 — Atlas

Priorité : moyenne-haute, mais après Research et Thesis Lab.

Objectif : cartographier les marchés et écosystèmes de manière analytique.

Premières pages recommandées :

1. European Seed Market
2. France VC Ecosystem
3. Africa-Europe Venture Corridor
4. AI Infrastructure Europe
5. Climate Tech Europe
6. Fintech Emerging Markets

Structure type :

1. Overview
2. Market maturity
3. Capital flows
4. Key actors
5. Investor landscape
6. Talent/regulation context
7. Exit pathways
8. Risks
9. Investor implications
10. Related research
11. Related theses
12. Related cases

La spécificité française doit devenir un avantage, pas une note de bas de page. PitchBook, CB Insights et Carta sont largement US-centric ; leur angle mort porte sur les standards locaux, le droit français, les instruments type BSA-AIR, les pratiques de term sheet France vs US et les dynamiques Bpifrance/EIF/LPs publics.

> **État d'implémentation (2026-06-13).** Une première brique de ce pilier est livrée sous la forme de l'espace **« Décortiquer un écosystème »** (`/ecosystemes`, 100 % client, `data/ecosystems.json` ; voir aussi §10.9). Plutôt que des fiches Atlas plates, les analyses sont des **dossiers vivants arborescents** (`parentId` + `order`) : un dossier-racine porte la thèse + les convictions datées + les signaux, et tout chapitre qui devient dense se ramifie en sous-dossiers (fil d'Ariane + section « Approfondir »). 31 dossiers au 2026-06-13, dont 3 racines — *France après l'hiver* (géographie), *IA appliquée Europe* (secteur), *Silver économie* (secteur, la plus profonde). La structure-type ci-dessus (overview → maturité → flux → acteurs → … → implications investisseur) sert de guide de rédaction, déclinée en sections + **figures natives** (bars / line / matrix / quadrant / taxonomy, rendues en SVG/HTML theme-aware sans asset ni lib de charting). **Reste à faire :** relier mutuellement l'Atlas `/paths` et les dossiers (renvois croisés), et étendre aux géographies du backlog (corridor Afrique-Europe, MENA, Asie du Sud-Est).

### 10.6 Pilier 6 — Library / Learning & Development

Priorité : à finaliser avant extension massive.

Objectif : fermer proprement la couche formation.

Actions :

- finaliser les parcours ;
- corriger les redondances ;
- taguer les contenus ;
- améliorer les titres trop débutants ;
- ranger career/founder-facing en secondaire ;
- clarifier les niveaux ;
- rendre les quiz moins centraux ;
- lier les contenus fondamentaux aux contenus intelligence.

La Library doit devenir :

> une base de montée en compétence, pas la vitrine principale.

### 10.7 Frameworks et playbooks

L'audit soulignait deux actifs à extraire progressivement :

- **Framework Library** : grilles et méthodes déjà présentes dans les leçons, par exemple grille de l'investisseur, trois risques, market sizing, due diligence prioritization.
- **Investor Playbooks** : séquences opérationnelles comme running DD, reserve allocation, follow-on decisions.

La stratégie ne les traite pas comme des piliers séparés prioritaires : ils doivent être intégrés à Library, Intelligence, Thesis Lab et Workspace selon leur usage.

### 10.8 Angles morts métier à exploiter

**Distribution**

La distribution est un actif produit, pas une tâche marketing secondaire. La newsletter doit naître avec les research notes : chaque note publiée devient un email. Le canal owned audience servira aussi de preuve de demande pour les partenariats.

**Maintenance**

L'intelligence périme. Les contenus `perishable` doivent être maintenus par review date. Cadence réaliste : un brief trimestriel par thème prioritaire, 4 briefs par an, plutôt qu'une fausse promesse de veille continue.

**Public-first**

Le contenu doit rester public-first tant que l'objectif est la réputation. Gater trop tôt affaiblirait SEO, partage qualifié et crédibilité. Le gated viendra plus tard pour Workspace, exports, templates avancés, sauvegarde et contenus partenaires.

**LP / emerging managers**

Le parcours `p-levee-fonds-lp` montre une niche stratégique sous-exploitée : emerging managers Europe. C'est une audience mal servie, potentiellement payante, et naturellement reliée aux tools fund economics. Contenus à prioriser : fund I construction, first close dynamics, GP commit, warehousing, anchor LP, reserves et continuation funds.

**Spécificité française**

La plateforme possède déjà des actifs français (`BSA-AIR`, standard français, term sheets localisées). Il faut exploiter cet angle, car les références US sont faibles sur le droit et les pratiques françaises. Outils défendables : BSA-AIR converter, France vs US term sheet comparator, lectures Bpifrance/EIF/LPs publics.

**Formats praticiens distinctifs**

À ajouter au backlog prioritaire :

- anti-portfolio / pass analysis ;
- memo library annotée ;
- secondaries / continuation fund calculator ;
- decision journal template dans Workspace.

### 10.9 Formats éditoriaux blog

Trois formats à ajouter au backlog éditorial du blog, en complément des piliers existants, plus un format transversal de mise en scène interactive.

**Scrollytelling interactif**

Chaque écrit long à forte valeur doit pouvoir exister en double lecture : article complet et scrollytelling. Le format ne doit pas résumer le texte en cartes décoratives ; il doit mettre en scène les concepts, rendre visibles les enchaînements causaux, faire manipuler les données quand c'est utile et installer une mémoire visuelle du raisonnement.

Exigence design :

- direction artistique spécifique au sujet, pas un template uniforme plaqué sur tous les articles ;
- design d'information rigoureux : hiérarchie, rythme, annotations, visualisations natives, états de lecture ;
- interaction utile : sticky panels, timelines, matrices, cartes, curseurs, comparaisons avant/après, révélations progressives ;
- motion sobre, au service de la compréhension, compatible avec `prefers-reduced-motion` ;
- continuité avec le design system premium, sans sacrifier la singularité artistique du récit.

Benchmark éditorial :

- consulter [`wbkd/awesome-interactive-journalism`](https://github.com/wbkd/awesome-interactive-journalism) comme bibliothèque d'exemples avant la conception ;
- identifier ce que chaque référence réussit : rythme narratif, manipulation de données, immersion, interaction, mémorisation ou tenue graphique ;
- transformer cette analyse en brief de design : intention, scènes clés, composants interactifs, données à révéler, contraintes responsive et règle de sobriété.

> **État d'implémentation.** Deux lectures obliques ont déjà une version scrollytelling dédiée : *La société du spectacle lève des fonds* (`DebordScrollytelling`) et *Exit, Voice, Loyalty : la grammaire des départs* (`HirschmanScrollytelling`), exposées depuis `BlogPostPage` via `?view=scrolly`. Reste à formaliser ce modèle pour les prochains longs formats et à éviter que chaque scrollytelling ne devienne un one-off impossible à maintenir.

**Décortiquer un écosystème**

Analyse longue d'un écosystème peu couvert en français : MENA, Afrique francophone, Asie du Sud-Est. Data-driven, sources publiques. Chaque analyse alimente la page Atlas correspondante (et inversement). L'angle différenciant est le vide éditorial francophone sur ces géographies, là où la couverture de la Silicon Valley est saturée.

> **État d'implémentation (2026-06-13).** Ce format est livré non pas comme une catégorie du blog mais comme un **espace autonome** : `/ecosystemes`, 100 % client (`data/ecosystems.json`, type `EcosystemDossier`, aucune table serveur). Les analyses sont des **dossiers vivants arborescents** (`parentId` + `order`, profondeur illimitée) — un dossier-racine porte une **thèse falsifiable**, des **convictions datées à degré d'assurance explicite** (exploratoire / moyenne / forte) et des **signaux directionnels** (haussier / baissier / incertain) ; un sous-dossier approfondit un point dense. Chaque section peut porter des **figures natives** (5 types : `bars`, `line`, `matrix`, `quadrant`, `taxonomy`) rendues en SVG/HTML theme-aware, **sans asset ni librairie de charting** — contrainte du renderer markdown maison. Validation Zod stricte (`validate:content` : parent existant, absence de cycle, racine ⇒ thèse, `glossaryRefs`/marqueurs résolus) et **skill d'authoring** dédié (`.claude/skills/ecosystemes/SKILL.md`, qui impose le grounding des chiffres par recherche web + sources institutionnelles). **31 dossiers** au lancement, mais le premier lot vise des terrains proches (*France après l'hiver*, *IA appliquée Europe*, *Silver économie*) plutôt que les géographies MENA / Afrique / Asie listées ci-dessus, qui restent au backlog. Lien Atlas ↔ dossiers : à câbler.

**Thèses prospectives datées**

Prédictions explicites avec échéance, revisitées publiquement à date fixe. Le format prolonge le Thesis Lab (falsification criteria, « what would change our mind ») et le Decision Journal : la crédibilité se construit par la relecture assumée, y compris des erreurs. Cadence : revisite annuelle systématique de chaque thèse publiée.

**Analyses de livres — « lectures obliques »**

Livres oubliés ou inattendus, pas nécessairement liés au VC ou à l'investissement, qui donnent une grille de perception plutôt qu'une méthode. Exemples de corpus : *Seeing Like a State*, *Flatland*, *The Elephant in the Brain*, *La Société du spectacle*, *Éloge de la fuite*, *L'Étranger*, *Peau noire, masques blancs*, *Exit, Voice, and Loyalty* (Hirschman), Girard, Mauss, La Boétie, Calvino.

Règles éditoriales :

- **exhaustivité oblique plutôt qu'une idée unique** (arbitrage tranché en juin 2026) : chaque article extrait *toutes* les idées du livre transposables au VC et à la détection de pépites (talents, founder-market fit), structurées en sections autonomes, plutôt qu'une seule idée en format court. La contrainte « 4-5 min / une idée » est abandonnée au profit d'une lecture longue minée en profondeur ;
- le pont inattendu vers la pratique VC est le payoff de chaque idée (ex. *Flatland* → cécité dimensionnelle → deals invisibles de l'anti-portfolio) ;
- structure type par idée : thèse du livre, où elle bouscule le consensus, application à un cas réel (case study, anti-portfolio), limites de la thèse ;
- variante « duel de livres » : deux ouvrages qui se contredisent sur la même question, arbitrage explicite (ex. *Talent* vs *Super Founders* sur la détection des fondateurs) — le schéma de données prévoit un tableau `books[]` par article pour porter ce cas ;
- chaque article se conclut par un renvoi explicite vers un terme du glossaire, une leçon ou un cas (`glossaryRefs[]`) — le blog est la couche réflexion libre qui alimente la couche structurée, pas un silo.

Fil rouge thématique prioritaire : founder-market fit et détection des profils brillants à fibre entrepreneuriale, sujet mal couvert en français et qui touche autant les investisseurs que les fondateurs.

> **État d'implémentation (2026-06-12, complété 2026-06-13).** Le format « Lecture oblique » est livré dans le blog : nouvelle catégorie filtrable sur `/blog`, métadonnées livre (`books[]`) et renvoi glossaire de fin d'article (`glossaryRefs[]`) ajoutés au type `BlogPost`, au schéma Zod du validateur et au rendu (`BlogCard`, `BlogPostPage`). **Trois articles complets publiés, formant triptyque et gabarit éditorial** : *Voir comme un État, investir comme un planificateur* (`bp-voir-comme-un-etat`, *Seeing Like a State* de James C. Scott — 10 idées transposées, ~16 min), *La société du spectacle lève des fonds* (`bp-societe-du-spectacle`, Debord — 11 idées, ~18 min, dont une taxonomie de 8 logiques de levée et les parallèles avec le cycle IA actuel) et *Exit, Voice, Loyalty : la grammaire des départs* (`bp-exit-voice-loyalty`, Hirschman — 9 idées, ~14 min : la gouvernance comme voice, les fondateurs comme exits créatifs, l'attrition comme diligence). Structure commune par idée : « thèse → transposition → à retenir », garde-fous, grille de questions finale, marqueurs `[[..]]` et renvois vers cas / anti-portfolio. Un article reste à l'état de **squelette structuré à rédiger sur ce modèle** : *Flatland → cécité dimensionnelle* (8 idées). Ajuster son `readMin` à la rédaction.

---

## 11. Parcours utilisateurs clés

### VC professional

Arrive sur une sector note partagée par un collègue → approfondit via les marqueurs de glossaire → pivote vers une thèse reliée dans Thesis Lab → ouvre un outil de fund economics pour tester la logique de portefeuille → sauvegarde un framework dans Workspace.

Point clé : cet utilisateur ne doit jamais être forcé de passer par onboarding ou quiz.

### CVC / corporate investor

Arrive avec une question de mandat : "devons-nous avoir une thèse sur X ?" → lit une page Atlas sur l'écosystème → consulte une thèse avec risques et exit logic → compare un cas similaire → exporte ou sauvegarde des notes pour un memo interne.

Besoin : crédibilité, sources, sobriété, pas de langage startup promotionnel.

### Serious VC enthusiast

Parcours préservé : orientation ikigai optionnelle → parcours Fundamentals → passage vers Research et Cases.

La différence cible : l'utilisateur ne termine pas dans un quiz ; il monte vers les surfaces professionnelles.

### Thesis-driven reader

Suit un domaine dans le temps → lit sector note, thèse, contre-thèse, cas de confirmation/falsification, simulateur de pression des hypothèses → maintient une thesis draft dans Workspace.

Ce parcours est l'identité produit à long terme.

---

## 12. Partenariats et collaborations

### 12.1 Position

Les partenariats sont utiles, mais pas immédiatement prioritaires.

Il faut d'abord construire un standard éditorial interne. Sans cela, les collaborations risquent d'ajouter du bruit ou de donner une impression opportuniste.

### 12.2 Quand lancer les partenariats

Ne pas lancer les partenariats avant d'avoir :

- 3 research notes solides ;
- 2 thesis lab complets ;
- 1 case decision-grade ;
- 1 page claire de contribution ;
- une charte éditoriale ;
- une proposition de valeur claire.

### 12.3 Partenaires pertinents

**VC funds**

- Utilité : cas anonymisés, interviews, frameworks, validation terrain, distribution.
- Risque : contenu promotionnel, biais, dépendance de marque.

**CVC / corporate innovation teams**

- Utilité : cas d'usage réels, thèses sectorielles, strategic investing frameworks.
- Risque : contenu trop corporate, cycles longs.

**Plateformes data / intelligence**

- Utilité : données, co-publications, crédibilité, sources.
- Risque : coût, accès restreint, dépendance.

**Experts indépendants**

- Utilité : deep dives, expert notes, thèses invitées, vertical expertise.
- Risque : qualité variable, manque d'homogénéité.

**Écoles / fellowships / programmes VC**

- Utilité : acquisition, crédibilité, terrain de test, couche Learning & Development.
- Risque : renforcer l'image formation au détriment de la VC Intelligence.

**Médias/newsletters VC**

- Utilité : distribution, co-publication, veille, audience qualifiée.
- Risque : dilution média, moindre profondeur produit.

### 12.4 Formats recommandés

- guest thesis ;
- expert commentary ;
- ecosystem briefing ;
- anonymized investment case ;
- co-authored research note ;
- interview structurée ;
- framework contribution ;
- benchmark commentary ;
- CVC playbook ;
- data-supported insight.

Règle stricte : aucune collaboration ne doit être publiée sans angle clair, standard éditorial, disclosure, sources, niveau de preuve et lien avec Research, Thesis, Cases ou Tools.

---

## 13. Risques techniques

### 13.1 Version control

État corrigé : Git est en place. Le risque critique relevé par l'audit historique est résolu.

Règle maintenue :

- vérifier `git status` avant chantier structurant ;
- travailler sur branche dédiée pour le repositionnement ;
- garder des commits propres ;
- documenter rollback et baseline.

### 13.2 Source de vérité JSON et fichiers générés

Risque : faible, mais réel si les fichiers générés sont modifiés à la main.

Avec la suppression du CMS, de l'API et de la base SQLite, la divergence entre éditions JSON et base de données n'existe plus. Les JSON sources de `/data` sont l'unique source de vérité éditoriale. Les fichiers de `data/generated/` sont des dérivés techniques, produits par `split:content`.

Règle immédiate :

- authoring des nouveaux contenus dans `/data` ;
- ne jamais éditer `data/generated/*` à la main ;
- relancer `npm run split:content` après modification des leçons ou du glossaire ;
- validation stricte ;
- aucune commande de seed/export CMS : le JSON source est édité directement ;
- documentation des sources de vérité.

Décision recommandée :

> JSON reste source de vérité. Toute réintroduction future d'un CMS ou d'un backend doit être une migration produit explicite, pas une extension opportuniste.

### 13.3 Leçons drop-in et pipeline d'authoring

État corrigé : les leçons drop-in sont chargées automatiquement, **sans import manuel**. Depuis le 2026-06-12, `client/src/content/parcoursLessons.ts` a été supprimé : `scripts/split-lessons.mjs` fait un glob sur `data/parcours/*.lessons.json` et les fusionne avec `data/lessons.json` dans l'index/bodies consommés par `content/lessons.ts`. Au 2026-07-07, 11 leçons drop-in issues de 3 registres portent le total servable à 66 leçons. Déposer un fichier JSON suffit donc à le servir après split. Le risque n'est plus une divergence structurelle, mais une gouvernance de contenu.

Risque restant :

- collision de `slug` (le split échoue désormais explicitement sur un slug dupliqué — à corriger avant build) ;
- incohérence entre `parcours.steps[]`, `course.lessonIds[]`, glossaire et `furtherReading` ;
- validation non relancée après ajout de contenu.

Règle :

- nouveau registre drop-in uniquement si son rôle est clair ;
- déposer le fichier dans `data/parcours/*.lessons.json` (auto-chargé par le split client, plus aucun import à ajouter) ;
- vérifier l'unicité des `slug` ;
- lancer `npm run split:content`, puis `npm run validate:content` ;
- replier dans `data/lessons.json` quand la leçon devient canonique.

### 13.4 Validation

Risque : élevé si les nouveaux piliers contournent le système existant.

Aucun nouveau fichier JSON ne doit être ajouté sans :

- schéma ;
- validation ;
- cross-references ;
- marker validation ;
- prebuild check.

Collections à prévoir :

- `theses.json` ;
- `atlas.json` ;
- `frameworks.json` ;
- `research.json` ou poursuite du refactor `data/blog/*.json` vers une couche Research ;
- cases enrichis ;
- tools metadata ;
- schémas complets pour `data/memos.json` et `data/antiPortfolio.json`, encore moins contrôlés que les autres collections.

### 13.5 Langue V1 FR

Risque : réintroduire une promesse de traduction non livrée.

Décision :

- V1 française propre ;
- routes non localisées (`/`, `/home`, `/blog/...`) ;
- aucun sitemap localisé, aucune balise d'alternance EN ;
- ne pas rouvrir le multilingue sans décision produit, budget éditorial et migration explicites.

### 13.6 Search / Command Palette

Risque : invisibilité des nouveaux contenus.

Chaque nouvelle collection doit être intégrée à :

- recherche client ;
- Command Palette ;
- related content ;
- `shared/routes.mjs` pour `noindex` et Open Graph si nécessaire ;
- `scripts/collect-routes.mjs` pour sitemap et prérendu ;
- sitemap/SEO.

### 13.7 Routes et legacy IA

Risque : liens cassés et confusion navigation.

Actions :

- conserver les routes publiques non localisées comme canon (`/blog/...`, `/paths/...`, `/ecosystemes/...`) ;
- ajouter des redirects explicites seulement pour les routes legacy utiles ;
- ne pas réintroduire de routage `/fr` ou `/en` sans migration dédiée ;
- mise à jour SideNav ;
- mise à jour SEO ;
- mise à jour Command Palette ;
- mise à jour breadcrumbs.

### 13.8 SEO / CSR + prérendu statique

Risque : faible découvrabilité des contenus Intelligence si le prérendu ou les URLs canoniques dérivent.

Décision :

- rester en SPA React/Vite avec prérendu statique des routes publiques au build ;
- ne pas migrer vers SSR/SSG complet immédiatement ;
- garder `scripts/collect-routes.mjs` comme source commune du sitemap et du prérendu ;
- soigner meta titles/descriptions ;
- définir `VITE_SITE_URL` en publication pour `canonical` et `og:url` ;
- valider les cartes Open Graph sur le domaine réel.

### 13.9 Données et fausse intelligence

Risque : crédibilité.

Interdiction :

- dashboards factices ;
- données inventées ;
- market maps non maintenues ;
- claims non sourcés.

Règle :

> Mieux vaut une analyse structurelle solide qu'un faux terminal data.

---

## 14. Roadmap d'implémentation

### Phase 0 — Sécurisation technique

Objectif : stabiliser le projet avant transformation.

État : largement avancé au 2026-07-07. Git est en place ; validation contenu, validation stricte, validation glossaire, lint, TypeScript, tests client et génération de sitemap cadrent la base de publication en local. Le projet est désormais statique : plus de seed DB, plus de serveur applicatif, plus d'export CMS. Le risque technique principal n'est plus la divergence JSON/CMS, mais un déploiement incomplet si la publication GitHub Pages ne rejoue pas tous les garde-fous locaux.

Actions :

1. vérifier Git ;
2. créer branche repositioning ;
3. lancer `split:content`, `validate:content:strict`, `validate:glossary`, lint, TypeScript et tests client ;
4. lancer build racine + prérendu avant publication ;
5. documenter les erreurs ;
6. vérifier qu'aucun fichier `data/generated/*` n'a été modifié à la main ;
7. durcir le workflow GitHub Pages pour rejouer les garde-fous utiles ;
8. documenter rollback ;
9. établir checklist de release ;
10. documenter le mode public-first initial pour réputation et SEO.

Livrable : base de travail sécurisée.

### Phase 1 — Finalisation de la couche formation

Objectif : fermer proprement le socle Learning & Development.

Actions :

1. auditer tous les parcours ;
2. identifier contenus incomplets ;
3. corriger redondances ;
4. taguer audience ;
5. taguer rigor ;
6. taguer contentKind ;
7. ranger career content ;
8. ranger founder-facing content ;
9. améliorer titres trop débutants ;
10. vérifier quiz/progression ;
11. vérifier glossary markers ;
12. vérifier liens internes ;
13. clarifier workflow drop-in vs `data/lessons.json`.

Critère de succès :

> La formation devient un socle fiable, pas un chantier permanent.

### Phase 2 — Repositionnement visible

Objectif : faire comprendre immédiatement que le produit cible est une VC Intelligence Platform.

Actions :

1. réécrire homepage ;
2. modifier proposition de valeur ;
3. changer CTA principal ;
4. rendre ikigai optionnel ;
5. renommer Analyses en Intelligence ;
6. renommer Simulateurs en Tools ;
7. renommer Dashboard en Workspace ;
8. réordonner SideNav ;
9. créer pages placeholder propres pour Thesis Lab et Atlas ;
10. mettre à jour SEO/meta ;
11. mettre à jour README ;
12. vérifier routes et redirects.

Critère de succès :

> Un professionnel VC comprend en moins de 10 secondes que la plateforme ne se limite pas à la formation.

### Phase 3 — Taxonomie et content infrastructure

Objectif : rendre le corpus pilotable.

Actions :

1. ajouter `contentKind` ;
2. ajouter `audience` ;
3. ajouter `rigor` ;
4. ajouter `status` ;
5. ajouter `evidenceLevel` ;
6. ajouter `maintenanceClass` ;
7. ajouter `reviewDate` ;
8. ajouter `visibility` ;
9. adapter `validate-content` ;
10. adapter types ;
11. adapter loaders ;
12. ajouter filtres Library ;
13. préparer related content ;
14. préparer recherche ;
15. documenter taxonomie.

Critère de succès :

> Chaque contenu peut être filtré, relié et repositionné sans bricolage.

### Phase 4 — Intelligence MVP

Objectif : construire la première vraie surface VC Intelligence.

Actions :

1. créer template research note ;
2. transformer blog/analyses en Research ;
3. produire 3 notes solides ;
4. intégrer sources et limites ;
5. intégrer investor implications ;
6. créer index Intelligence ;
7. créer pages détail ;
8. relier aux tools/glossary/cases ;
9. intégrer recherche ;
10. mettre à jour navigation ;
11. lancer newsletter + capture email ;
12. publier chaque research note en page + email ;
13. produire au moins une version scrollytelling interactive avec direction artistique dédiée pour un long format stratégique ;
14. constituer un mini-benchmark d'inspiration pour cette version, à partir de références comme `wbkd/awesome-interactive-journalism` ;
15. ajouter RSS pour contenus publics ;
16. définir la première cadence de review trimestrielle.

Critère de succès :

> Au moins une note peut être partagée à un VC/CVC sans donner une impression scolaire, et au moins un long format peut être compris visuellement via un scrollytelling interactif de niveau éditorial premium.

### Phase 5 — Thesis Lab MVP

Objectif : créer le cœur différenciant.

Actions :

1. créer schema theses ;
2. créer template thesis ;
3. produire 2 thèses complètes ;
4. créer `/theses` index ;
5. créer pages détail ;
6. ajouter falsification criteria ;
7. relier research ;
8. relier tools ;
9. relier cases ;
10. relier glossary.

Critère de succès :

> Une thèse peut servir de base à une discussion d'investissement.

### Phase 6 — Tools repositioning

Objectif : rendre les simulateurs immédiatement professionnels.

Actions :

1. renommer Simulators en Tools ;
2. réécrire chaque description ;
3. ajouter use cases professionnels ;
4. ajouter limites ;
5. ajouter exemples ;
6. lier aux research notes ;
7. lier aux cases ;
8. lier aux thesis ;
9. préparer sauvegarde Workspace ;
10. créer Fund Economics Toolkit ;
11. prioriser secondaries / continuation fund calculator ;
12. prioriser BSA-AIR converter ;
13. prioriser France vs US term sheet comparator.

Critère de succès :

> Les outils ne ressemblent plus à des exercices, mais à des supports de décision.

### Phase 7 — Cases decision-grade

Objectif : renforcer la crédibilité et l'apprentissage par décision.

Actions :

1. créer template case ;
2. requalifier cas fictifs en stylized ;
3. créer un cas sourcé ;
4. créer `/cases` index ;
5. ajouter decision options ;
6. ajouter pattern extracted ;
7. ajouter investor implications ;
8. relier aux thèses ;
9. relier aux tools ;
10. relier au glossary ;
11. créer un format anti-portfolio / pass analysis ;
12. créer une memo library annotée à partir de memos publiés.

Critère de succès :

> Les cas servent à penser une décision, pas seulement à apprendre un concept.

### Phase 8 — Atlas MVP

Objectif : structurer les marchés et écosystèmes.

Actions :

1. créer schema atlas ;
2. créer template atlas ;
3. produire 2 à 3 pages ;
4. éviter toute prétention exhaustive ;
5. relier aux research notes ;
6. relier aux theses ;
7. relier aux cases ;
8. intégrer recherche ;
9. intégrer navigation ;
10. préparer future expansion.

Critère de succès :

> L'Atlas apporte une lecture structurelle du marché, pas une carte décorative.

### Phase 9 — Workspace artifact-first

Objectif : transformer le dashboard en espace de production.

Actions :

1. renommer Dashboard en Workspace ;
2. réduire logique progression ;
3. afficher saved research ;
4. afficher saved theses ;
5. afficher notes ;
6. afficher bookmarks ;
7. afficher reading trails ;
8. afficher saved tools ;
9. préparer thesis drafts ;
10. préparer memo drafts ;
11. ajouter decision journal : prédictions datées, confidence, review date, calibration.

Critère de succès :

> L'utilisateur revient pour poursuivre un raisonnement, pas seulement terminer une leçon.

### Phase 10 — Partenariats pilotes

Objectif : ajouter crédibilité et distribution.

Actions :

1. créer page Partner / Contribute ;
2. créer charte éditoriale ;
3. identifier 10 partenaires cibles ;
4. prioriser VC/CVC/experts ;
5. proposer formats précis ;
6. obtenir une contribution thesis ;
7. obtenir une interview structurée ;
8. obtenir un cas anonymisé ;
9. publier sous contrôle éditorial ;
10. mesurer retours.

Critère de succès :

> Les partenaires renforcent l'intelligence, pas la décoration de marque.

---

## 15. Ordre d'exécution recommandé

Ordre strict :

1. Sécuriser Git / validation / build
2. Finaliser la couche formation
3. Repositionner homepage + navigation
4. Ajouter taxonomie
5. Relancer Intelligence / Research
6. Lancer newsletter / distribution owned
7. Lancer Thesis Lab
8. Repositionner Tools
9. Améliorer Cases
10. Lancer Atlas
11. Transformer Workspace
12. Lancer partenariats
13. Étendre progressivement

Pourquoi cet ordre :

- la formation doit être fermée avant que le projet ne s'éparpille ;
- la navigation doit annoncer la vision avant que tous les piliers ne soient complets ;
- la taxonomie doit précéder l'expansion ;
- la distribution doit naître avec Research, sinon les KPI de partage n'ont pas de mécanisme ;
- Research et Thesis Lab doivent venir avant Atlas ;
- Tools doivent être repositionnés tôt car ils sont déjà forts ;
- les partenariats doivent attendre un minimum de preuve éditoriale.

---

## 16. MVP recommandé

### 16.1 MVP produit

Le MVP ne doit pas être une plateforme complète.

Il doit contenir :

- homepage repositionnée ;
- navigation VC Intelligence ;
- Library propre ;
- 3 research notes ;
- 1 à 2 scrollytellings interactifs pour les longs formats prioritaires ;
- newsletter + capture email + RSS ;
- 2 thesis lab ;
- 5 tools repositionnés, plus backlog prioritaire secondaries / BSA-AIR / term sheet France vs US ;
- 1 case decision-grade ;
- glossary connecté ;
- workspace minimal ;
- décision public-first documentée.

### 16.2 MVP éditorial

**Research**

1. European Seed Market Structure
2. AI Infrastructure VC Thesis
3. DPI Pressure and Fundraising Reality
4. Emerging Managers Europe: Fund I Construction and First Close Reality

**Scrollytelling**

1. Une version interactive d'une research note prioritaire, par exemple European Seed Market Structure.
2. Une version interactive d'une lecture oblique ou d'un dossier conceptuel déjà long, avec direction artistique spécifique au sujet.
3. Un mini-benchmark documenté pour chaque version, incluant références de narration interactive, d'information design et de tenue artistique.

**Thesis Lab**

1. AI Infrastructure Europe
2. Regulated Vertical SaaS

**Cases**

1. Seed Investment Committee — stylized
2. Follow-on Decision — stylized or sourced
3. Anti-portfolio / pass analysis
4. Memo library annotée

**Tools**

1. Dilution
2. Waterfall
3. DPI/TVPI/MOIC
4. Management Fees
5. Reserve Allocation
6. Secondaries / continuation fund calculator
7. BSA-AIR converter
8. France vs US term sheet comparator

### 16.3 MVP technique

- validation active ;
- schémas propres ;
- champs maintenanceClass / reviewDate / visibility ;
- routing propre ;
- search minimum ;
- SEO correct ;
- newsletter/capture email/RSS minimum ;
- support maintenable des vues scrollytelling (`?view=scrolly`, composants lazy, motion accessible) ;
- aucun backend/CMS réintroduit sans migration dédiée ;
- aucune donnée factice ;
- pas de migration SSR/SSG complète tant que le CSR + prérendu statique suffit.

---

## 17. KPI de succès

**Produit**

- consultation Research ;
- consultation Thesis Lab ;
- consultation des vues scrollytelling ;
- usage Tools ;
- sauvegardes Workspace ;
- inscriptions newsletter ;
- taux d'ouverture / clic email ;
- taux de retour ;
- recherches internes ;
- clics related content ;
- profondeur de lecture / complétion des scrollytellings ;
- notes créées.

**Éditorial**

- nombre de contenus decision-grade ;
- nombre de contenus sourcés ;
- nombre de thèses complètes ;
- nombre de cas exploitables ;
- part des longs formats stratégiques couverts par un scrollytelling ;
- qualité de design éditorial des expériences interactives ;
- ratio VC Intelligence vs Learning ;
- contenus à mettre à jour ;
- contenus founder/career dépriorisés ;
- contenus `perishable` avec reviewDate respectée ;
- briefs trimestriels publiés ;
- contenus publics partagés.

**Technique**

- validation prebuild ;
- erreurs cross-ref ;
- stabilité build ;
- performance et accessibilité des scrollytellings ;
- couverture search ;
- routes redirigées ;
- absence de divergence critique ;
- temps de maintenance contenu ;
- RSS ou équivalent public disponible ;
- capture email fonctionnelle ;
- champs maintenance / visibility validés.

**Marché**

- retours VC/CVC ;
- partages qualifiés ;
- croissance audience owned ;
- contributions experts ;
- demandes de partenariat ;
- inscriptions professionnelles ;
- utilisateurs revenant sur Workspace.

---

## 18. Ce qu'il ne faut pas faire

Ne pas :

- ouvrir tous les piliers trop vite ;
- lancer un Atlas vide ;
- créer de faux dashboards ;
- inventer des données ;
- copier PitchBook ;
- copier CB Insights sans data moat ;
- supprimer brutalement la formation ;
- laisser la formation dominer la homepage ;
- lancer les partenariats avant la preuve éditoriale ;
- viser des partages qualifiés sans newsletter, email capture ou RSS ;
- publier des contenus périssables sans reviewDate ;
- gater les premiers contenus si l'objectif principal reste la réputation ;
- remplacer le CSR + prérendu statique par une migration SSR/SSG complète maintenant ;
- réintroduire un CMS, une API ou une base sans décision produit et migration dédiée ;
- promettre ou réintroduire le multilingue sans migration dédiée ;
- ajouter de l'IA sans cas d'usage clair ;
- transformer la plateforme en blog ;
- produire six rubriques minces au lieu de deux piliers forts.

---

## 19. Hypothèses faibles à surveiller

Ces points viennent de l'audit et doivent rester visibles, car ils limitent les risques d'emballement.

1. **Les professionnels VC veulent-ils des parcours ?** Non prouvé. Ils peuvent surtout vouloir Research + Tools + Cases. La stratégie répond en demotant la Library, pas en pariant toute l'expérience dessus.
2. **L'intelligence est-elle crédible avec un corpus statique ?** Partiellement. Les frameworks et thèses vieillissent mieux que les sector notes. Sans cadence de mise à jour, la section Intelligence peut devenir stale.
3. **L'ikigai survit-il au repositionnement ?** Oui comme différenciant pour amateurs sérieux et profils en développement, non comme front door obligatoire pour visiteurs professionnels.
4. **Capacité éditoriale.** Le plus grand danger est de livrer cinq piliers faibles au lieu de deux piliers forts. Si la capacité est contrainte : Research + Thesis Lab d'abord.
5. **Cas fictifs.** Ils sont utiles pédagogiquement, mais insuffisants comme intelligence. Il faut des cas sourcés ou des cas stylisés explicitement signalés.

---

## 20. Fichiers et dossiers probablement affectés

**Content**

- `data/parcours.json`
- `data/lessons.json`
- `data/parcours/*.lessons.json`
- `data/blog/*.json`
- `data/caseStudies.json`
- `data/deliverables.json`
- `data/ecosystems.json`
- `data/memos.json`
- `data/antiPortfolio.json`
- `data/simulators.json`
- `data/generated/*` (généré par `split:content`, à ne pas éditer directement)
- futurs `data/theses.json`, `data/atlas.json`, `data/frameworks.json`

**Validation**

- `scripts/validate-content.mjs`
- `scripts/split-lessons.mjs`
- `scripts/split-glossary.mjs`
- `scripts/collect-routes.mjs`
- `scripts/generate-sitemap.mjs`
- `scripts/prerender.mjs`

**Client**

- `client/src/components/chrome/SideNav.tsx`
- `client/src/pages/HomePage.tsx`
- `client/src/App.tsx`
- `client/src/content/*`
- `client/src/content/search.ts`
- `client/src/pages/blog/BlogPostPage.tsx`
- `client/src/pages/blog/*Scrollytelling.tsx`
- composants de visualisation / design d'information à factoriser si le format se répète
- `client/src/pages/*`
- `client/src/pages/DashboardPage.tsx`
- `client/src/lib/seo.ts`
- recherche / Command Palette si présente dans le code courant

**Docs**

- `README.md`
- `Suivis/*`
- guides éditoriaux dans `docs/`

---

## 21. Décision stratégique finale

La plateforme doit assumer une architecture duale.

### Learning & Development Layer — 10 à 20 %

Rôle :

- socle ;
- progression ;
- formation ;
- orientation ;
- réassurance ;
- montée en compétence.

Statut :

- à finaliser ;
- à ranger ;
- à rendre secondaire ;
- à connecter aux contenus professionnels.

### VC Intelligence Layer — 80 à 90 %

Rôle :

- recherche ;
- thèses ;
- analyses ;
- cas ;
- outils ;
- frameworks ;
- workspace ;
- décisions.

Statut :

- à construire ;
- à mettre en avant ;
- à rendre crédible ;
- à maintenir.

Conclusion :

> La bonne trajectoire n'est pas de transformer une formation VC en produit plus premium. La bonne trajectoire est de construire une VC Intelligence Platform dont la formation est un socle d'entrée, mais dont la valeur principale vient de la capacité à aider les utilisateurs à produire un raisonnement d'investisseur.

Promesse finale :

> Une plateforme pour apprendre les bases du venture quand c'est nécessaire, mais surtout pour analyser les marchés, construire des thèses, modéliser des décisions et penser comme un investisseur professionnel.
