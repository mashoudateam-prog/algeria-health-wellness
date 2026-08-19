# Algeria Health & Wellness

> Votre santé. Votre séjour. Votre parcours.

Plateforme d'organisation de séjours combinant **soins, bien-être, remise en forme,
récupération, thermalisme et découverte de l'Algérie**. L'utilisateur ne réserve pas un
rendez-vous : il décrit son projet en une phrase, et la plateforme le transforme en un
parcours jour par jour, avec des professionnels, un itinéraire et une estimation.

---

## Démarrage

```bash
npm install
npm run dev
```

L'application démarre sur **http://localhost:3230**.

**Aucune configuration n'est nécessaire.** Pas de base de données, pas de clé API, pas de
service externe : la plateforme fonctionne intégralement sur son moteur de règles
déterministe et sur les données de démonstration de `/data`.

| Commande            | Effet                                              |
| ------------------- | -------------------------------------------------- |
| `npm run dev`       | Serveur de développement (port 3230)               |
| `npm run build`     | Build de production                                |
| `npm start`         | Serveur de production                              |
| `npm run typecheck` | Vérification TypeScript stricte                    |
| `npm test`          | Tests du domaine (garde-fous, parcours, estimation) |

---

## Ce qui est construit

| Module                    | Route                     | État                                                |
| ------------------------- | ------------------------- | --------------------------------------------------- |
| Homepage éditoriale       | `/`                       | Sélecteur d'objectifs multiple, phases, destinations |
| **Health Journey Builder**| `/parcours`               | Phrase libre → parcours jour par jour, révélé par étapes |
| Algeria Health Map        | `/carte`                  | Carte SVG des 58 wilayas, filtres par type de structure |
| Health Destinations       | `/destinations`, `/[slug]`| 8 pages éditoriales complètes                       |
| Séjours bien-être         | `/sejours`                | 6 programmes, 3 à 10 jours                          |
| Annuaire                  | `/professionnels`         | Fiches avec statut de vérification explicite        |
| Espace patient            | `/espace`                 | Parcours en 6 phases, agenda, budget                |
| Health Passport           | `/espace/documents`       | Partage temporaire révocable + journal d'accès      |
| Concierge santé           | `/concierge`              | Conversationnel, avec bascule conseiller humain     |
| Centre de confiance       | `/confiance`              | Données, vérification, limites de l'IA              |
| **Fil d'actualité**       | `/actualites`             | Veille automatisée, validée avant publication        |
| Modération du fil         | `/admin/actualites`       | File d'attente, état des sources, décisions          |

---

## Architecture

```
app/            Routes (App Router) et routes API
components/     Composants d'interface
lib/
  ai/           Orchestrateur IA — un module par responsabilité
    guardrails  Garde-fous médicaux (filtre de sortie)
    intent      Classifieur d'intention
    planner     Construction du parcours
    matching    Smart Match explicable
    quote       Estimation budgétaire
    concierge   Assistant conversationnel
    provider    Adaptateur LLM, agnostique du fournisseur
  rules/        Règles de compatibilité séjour / santé
  security/     Validation, limitation de débit
data/           Données de référence et catalogue DÉMO
types/          Modèle de domaine
prisma/         Schéma de la cible de persistance
tests/          Tests du domaine
```

### La couche IA

L'orchestrateur est découpé en modules isolés, comme demandé au cahier des charges. Deux
choix méritent d'être explicités.

**1. Le moteur est déterministe par défaut.**
`IntentClassifier`, `JourneyPlanner`, `RecommendationEngine` et `SmartQuote` sont du code,
pas des appels de modèle. Un planning de séjour de santé doit être reproductible et
explicable ligne à ligne : la même demande produit toujours le même parcours, et chaque
recommandation affiche ses motifs. Un LLM peut enrichir la conversation ; il ne fabrique
pas la structure du parcours.

**2. Les garde-fous s'appliquent en sortie, pas seulement dans le prompt.**
`lib/ai/guardrails.ts` filtre **toute** réponse destinée à l'utilisateur — qu'elle vienne
du moteur de règles ou d'un modèle de langage. Diagnostic, prescription, posologie,
modification de traitement, promesse de résultat et « prix garanti » sont retirés du texte
et consignés. Une consigne d'entrée se contourne ; un filtre de sortie, non.

Les règles de compatibilité séjour / santé (`lib/rules/compatibility.ts`) sont écrites,
versionnées et relues à la main. Ce sont des règles de **planification** — prévoir un
tampon après un acte, écarter un effort soutenu pendant 48 h — qui renvoient
systématiquement la décision au praticien. Aucune n'est produite par un modèle.

### Fournisseur LLM

L'interface `LlmProvider` (`lib/ai/provider.ts`) est agnostique. Sans clé, la plateforme
fonctionne entièrement en mode règles. Avec `ANTHROPIC_API_KEY`, le concierge bascule sur
le SDK officiel Anthropic (`claude-opus-5` par défaut). Ajouter un autre fournisseur
consiste à écrire un second adaptateur : aucun autre module ne change.

Voir `.env.example`.

---

## Données réelles et données de démonstration

Cette distinction est appliquée dans le code, pas seulement documentée.

**Réel et vérifiable :** les 58 wilayas et leurs coordonnées, la géographie, les contenus
éditoriaux des destinations (patrimoine, climat, accessibilité, gastronomie), les numéros
d'urgence.

**Fictif et signalé :** tous les établissements, praticiens, tarifs, disponibilités et
avis. Chaque objet porte `demo: true` et l'interface affiche un badge **DÉMO**. Aucun
établissement réel n'est nommé, aucune certification n'est inventée.

Les fourchettes budgétaires sont des **ordres de grandeur de démonstration**. Elles ne
proviennent d'aucun établissement et ne constituent jamais un devis.

Pour passer en production : remplacer `data/facilities.ts` par un dépôt alimenté par des
partenaires contractualisés, et brancher `prisma/schema.prisma`.

---

## Direction artistique

Le parti pris est explicite : **aucune image générée**. Plutôt que de remplir l'interface
de visuels artificiels, la plateforme affiche par défaut des *planches éditoriales*
composées en CSS — dégradés de sable et de vert profond, grain, numéro de planche,
typographie éditoriale — clairement identifiées comme des emplacements réservés.

Pour basculer sur de la photographie réelle, déposez un fichier :

```
public/photos/alger.jpg          → page et carte d'Alger
public/photos/hero-algerie.jpg   → visuel principal de la homepage
public/photos/<slug>.jpg         → toute destination, par son slug
```

Extensions acceptées : `.jpg`, `.jpeg`, `.png`, `.webp`. La reprise est automatique,
sans modification de code (`lib/photos.ts`).

N'utilisez que des visuels dont vous détenez les droits, avec autorisation des personnes
représentées. Photographie documentaire, lumière naturelle, architecture réelle.

### Palette et typographie

| Rôle              | Valeur                        |
| ----------------- | ----------------------------- |
| Fond              | Ivoire `#f7f4ee`              |
| Surface douce     | Sable `#f1ece2`               |
| Primaire          | Vert profond `#17382f`        |
| Secondaire        | Bleu méditerranéen `#2f5f73`  |
| Accent            | Terracotta `#9a6845`          |
| Texte             | `#16251f`                     |

Titres en **Fraunces** (serif éditorial), interface en **Inter**. Transitions de 150 à
320 ms, apparition au défilement de 14 px, `prefers-reduced-motion` respecté partout.

---

## Le fil d'actualité

Un agent parcourt chaque jour cinq flux de presse algériens, une recherche web
ciblée et les soumissions de partenaires, puis **propose**. Il ne publie jamais.

```
flux RSS + recherche web + formulaire partenaire
        ↓
filtres déterministes  →  écarté si : pas de source vérifiable · hors périmètre
                          santé/bien-être · doublon · pertinence insuffisante
        ↓
file de modération  →  une personne relit et décide
        ↓
fil public, chaque élément portant sa source
```

Sur une plateforme de santé, publier automatiquement « nouveau centre ouvert à
Tipaza » à partir d'un article mal lu coûte plus cher que ne rien publier. Le
point de contrôle humain n'est donc pas une étape provisoire : c'est le cœur
du dispositif.

**Les réseaux sociaux ne sont pas surveillés.** Leurs conditions interdisent
l'extraction automatisée, leurs API ne permettent pas la découverte, et
republier des publications pose un problème de droits. Le formulaire partenaire
remplit ce rôle avec des informations exactes à la source.

**Rendement réel à connaître** : sur une collecte de 74 articles de presse, zéro
a passé les filtres. C'est le comportement attendu — les flux suivis sont
généralistes et parlent rarement de tourisme de santé. Le formulaire partenaire
et la recherche web portent l'essentiel du volume.

| Variable | Effet |
| --- | --- |
| `ADMIN_TOKEN` | Protège la modération. **Sans lui, l'administration est refusée en production.** |
| `CRON_SECRET` | Signature des appels de la tâche planifiée Vercel |
| `BRAVE_SEARCH_API_KEY` | Active le collecteur de recherche web (inactif sans clé) |

La collecte quotidienne est déclarée dans `vercel.json` (6 h UTC). Les décisions
de modération vivent en mémoire du processus : **elles ne survivront pas au
prochain déploiement** tant que PostgreSQL n'est pas branché.

---

## Sécurité

Ce qui est en place :

- validation de type **et** de taille sur toute entrée des routes API ;
- limitation de débit par appelant (`/api/parcours` 30/min, `/api/concierge` 20/min) ;
- corps de requête borné avant parsing ;
- historique de conversation retaillé et re-typé côté serveur, jamais fait confiance ;
- messages d'erreur qui ne révèlent aucun état interne ;
- détection d'urgence prioritaire sur toute autre réponse ;
- aucun traceur, aucune police externe au runtime, aucun fournisseur de cartographie.

Ce qui reste à faire avant une mise en production réelle — c'est important et ce n'est pas
un détail :

- **authentification et RBAC** : l'espace patient est un compte de démonstration ;
- **chiffrement au repos** des documents et contrôle d'accès appliqué **côté serveur** ;
- **journal d'audit inaltérable** (append-only) ;
- **limitation de débit partagée** : le compteur actuel vit en mémoire du processus et ne
  tient pas sur plusieurs instances ;
- **gestion du consentement** conforme aux juridictions réellement ciblées ;
- 2FA pour les rôles à privilèges, gestion des secrets, revue de sécurité complète.

Les données de santé sont particulièrement sensibles : le schéma Prisma isole les
documents, impose une échéance à tout partage et prévoit une table d'audit, mais
l'implémentation de ces garanties reste à faire.

---

## Tests

```bash
npm test
```

17 tests couvrent ce qui doit tenir en toutes circonstances :

- les garde-fous bloquent diagnostic, prescription, posologie, promesse de résultat et
  prix garanti — tout en laissant passer une réponse d'organisation légitime ;
- la détection d'urgence repère les formulations à risque et renvoie vers les secours ;
- le parcours reste dans les bornes du séjour, ne programme aucun acte le jour de
  l'arrivée, place le départ en dernier et n'insère aucun effort soutenu dans les 48 h
  suivant un acte ;
- chaque recommandation affiche entre 1 et 5 motifs vérifiables ;
- le total de l'estimation correspond à la somme de ses lignes et n'est jamais présenté
  comme un prix.

---

## Feuille de route

**Fait** — homepage, Journey Builder, carte, destinations, séjours, annuaire, espace
patient, coffre documentaire, concierge, centre de confiance, garde-fous, tests.

**Suite immédiate** — authentification, persistance PostgreSQL via Prisma, Second Opinion,
Smart Quote raccordé aux établissements, Family Journey, suivi post-séjour.

**Ensuite** — dashboards clinique / professionnel / conciergerie, back-office, analytics,
marketplace, paiement.

---

## Avertissement

Les informations produites par cette plateforme sont **indicatives et ne constituent pas
un diagnostic médical**. Seul un professionnel de santé habilité peut évaluer une
situation. En cas d'urgence en Algérie : **Protection civile 14, SAMU 115**.
