# ALGERIA HEALTH & WELLNESS
## Preuve de concept — Démonstration technique

---

## 1. Accès à la démonstration

| Élément | Accès |
|---|---|
| **Prototype en ligne** | *[URL de déploiement Vercel à insérer]* |
| **Dépôt de code** | `github.com/mashoudateam-prog/algeria-health-wellness` |
| **Vidéo de démonstration (2 min)** | *[lien à insérer — scénario détaillé au §5]* |
| **Exécution locale** | `npm install` puis `npm run dev` — port 3230. **Aucune clé API n'est nécessaire.** |

> **Point à souligner devant le jury :** la plateforme fonctionne intégralement **sans aucune clé d'API**. Sans fournisseur d'IA configuré, elle bascule sur son moteur de règles déterministe et produit exactement les mêmes parcours, avec les mêmes garde-fous. Le jury peut donc cloner le dépôt et tout vérifier lui-même, hors ligne.

---

## 2. Le parcours de démonstration en 90 secondes

**Étape 1 — L'entrée par l'intention.** La page d'accueil ne demande pas de choisir un établissement. Elle demande : *« Que souhaitez-vous améliorer ? »* Treize objectifs cumulables — dont thermalisme, remise en forme, détente, entraînement — ou une phrase libre.

**Étape 2 — La phrase.** Saisir dans le Journey Builder :

> *« Je viens de France pour 10 jours : je voudrais me remettre en forme, faire une cure thermale et me reposer. »*

**Étape 3 — Ce que la plateforme affirme avoir compris.** Avant tout résultat, elle affiche son interprétation et son niveau de certitude : *thermalisme, remise en forme, détente — 10 jours — arrivée depuis l'étranger*, et pose la question manquante : *« Avez-vous une région de préférence ? »* Le visiteur peut corriger et reconstruire.

**Étape 4 — Le parcours calculé.** La plateforme retient **Biskra** — la seule destination du catalogue qui cumule thermalisme, remise en forme et détente — et produit un itinéraire qui a un sens physiologique :

| Jour | Étape |
|---|---|
| J1 | Arrivée et transfert · fin de journée libre |
| J2 | **Évaluation de condition physique** · séance thermale et détente |
| J3 | Balcons de Ghoufi *(visite calibrée sur l'effort restant)* |
| J4 | Séance encadrée — reprise douce · récupération en spa |
| J6 | Séance encadrée — renforcement · récupération en spa |
| J8 | Séance encadrée — séance longue |
| J9 | **Séance bilan et plan de suite** |
| J10 | Bilan de séjour et départ |

**Ce tableau est la démonstration.** L'évaluation ouvre le séjour, la charge monte par paliers, un jour de repos sépare deux séances encadrées, la séance la plus soutenue arrive après six jours d'adaptation, et le séjour se termine par un **programme écrit à poursuivre au retour**. Aucune de ces décisions n'est prise par un modèle de langage : elles sont calculées.

**Étape 5 — Le résumé annonce ce qui n'est pas fait.** *« Aucun acte médical programmé : le séjour est organisé autour du rythme, du repos et de l'activité douce. »* La plateforme ne transforme pas une demande de bien-être en parcours médical.

**Étape 6 — La justification.** Chaque établissement proposé affiche trois à cinq raisons vérifiables : correspondance à l'objectif, présence dans la destination retenue, langue d'accueil déclarée, cohérence avec le niveau de confort, et ce qui a été vérifié — avec la date du contrôle.

**Étape 7 — Le budget.** Une estimation ventilée par poste : cure thermale, programme de remise en forme, spa et détente, hébergement, transferts, conciergerie. Jamais un prix.

**Étape 8 — La bascule linguistique.** Passer en anglais, puis en arabe : le parcours entier est reconstruit — titres d'étapes, justifications, libellés budgétaires, points de vigilance et mentions réglementaires comprises. En arabe, la page bascule en outre de droite à gauche. **Ce n'est pas une traduction d'interface : c'est le moteur qui produit dans la langue du visiteur.**

---

## 3. Technologies mobilisées

### 3.1 Intelligence artificielle

| Composant | Technologie | Rôle |
|---|---|---|
| **Classifieur d'intention** | Moteur déterministe TypeScript, bilingue FR/EN — `lib/ai/intent.ts` | Transforme une phrase libre en brief structuré : objectifs, durée, voyageurs, origine, destination, budget, langues. Reconnaissance par mot entier, flexions admises, exonymes gérés (*Algiers* → Alger). |
| **Planificateur de parcours** | Moteur de règles avec ordonnanceur — `lib/ai/planner.ts` | Calcule l'itinéraire : rampe de progression physique, placement des séances thermales, fenêtres de récupération, insertion patrimoniale sous contrainte d'effort et de temps. |
| **Moteur de recommandation explicable** | Scoring pondéré multicritère — `lib/ai/matching.ts` | Rapproche établissements et besoins. **Aucun score n'est affiché sans les raisons qui le produisent.** |
| **Règles de compatibilité séjour/santé** | Moteur de règles versionné — `lib/rules/compatibility.ts` | 9 règles de précaution d'organisation. Aucune n'est générée par un modèle : elles sont écrites, relues et testées. |
| **Estimation budgétaire** | Modèle par poste — `lib/ai/quote.ts` | Fourchettes ventilées, jamais présentées comme des prix. |
| **Garde-fous** | Filtre de sortie — `lib/ai/guardrails.ts` | 16 motifs interdits, détection de négation, détection d'urgence bilingue, mentions réglementaires. Appliqué **après** génération, sur tous les chemins. |
| **IA conversationnelle** | LLM encadré + repli déterministe — `lib/ai/concierge.ts` | Concierge de séjour. Chaîne non court-circuitable : urgence → génération → filtre de sortie → mention réglementaire. |
| **Couche fournisseur** | Interface `LlmProvider` agnostique, adaptateur Anthropic (`claude-opus-5`) — `lib/ai/provider.ts` | Permet de changer de fournisseur, ou de basculer vers un modèle souverain, sans toucher au produit. Optionnelle. |
| **Persistance** | PostgreSQL derrière un contrat, pilote chargé à la demande — `lib/db/client.ts` | Avec `DATABASE_URL`, les décisions survivent au redéploiement et deux index uniques arbitrent le dédoublonnage. Sans elle, tout fonctionne en mémoire. |
| **Comptes et rôles** | scrypt, session opaque en cookie `httpOnly` — `lib/auth/` | Quatre rôles en échelle. La politique de droits ne dépend ni des cookies ni de Next : elle est testable directement. |

**Choix architectural déterminant :** l'IA générative comprend et converse ; elle ne décide jamais d'un enchaînement de séances. C'est ce qui rend le système reproductible, auditable et défendable.

### 3.2 Immersion et contenu visuel

| Composant | Technologie | Rôle |
|---|---|---|
| **Visualiseur panoramique 360°** | WebGL natif, shaders GLSL écrits à la main — `components/panorama-viewer.tsx` | Projection équirectangulaire sur sphère, navigation à la souris et au doigt. **Aucune bibliothèque 3D tierce** : compatible avec une politique de sécurité stricte, aucun script externe. |
| **Emplacement immersif adaptatif** | `components/immersive-slot.tsx` | Choisit automatiquement le meilleur média disponible pour un lieu : panorama, vidéo, modèle 3D. Prêt pour l'ajout de captations NeRF et de modèles photogrammétriques. |
| **Lecteur vidéo intégré** | `components/video-frame.tsx` | Lecture sobre, sans traceur, avec pistes de sous-titres. |
| **Planches photographiques** | `components/photo-plate.tsx` | Composition éditoriale avec `srcset` calibré par taille de tuile. **Aucune image générée par IA** : chaque photographie a été vérifiée individuellement pour confirmer qu'elle représente bien le lieu annoncé. |
| **Carte santé vectorielle** | SVG construit à partir des coordonnées réelles des chefs-lieux — `components/algeria-map.tsx` | Filtrage par type de structure — station thermale, spa, centre de remise en forme, salle de sport. **Aucun fournisseur de tuiles, donc aucune clé d'API, aucun traceur, aucune fuite de position.** |

### 3.3 Agent de veille éditoriale

| Composant | Technologie | Rôle |
|---|---|---|
| **Collecteur multi-sources** | `lib/news/collect.ts` | Trois sources : flux RSS de presse algérienne, recherche web ciblée, soumissions de partenaires. |
| **Analyseur RSS/Atom** | Écrit sans dépendance — `lib/news/rss.ts` | Aucune bibliothèque tierce à maintenir ou à auditer. |
| **Filtres déterministes** | `lib/news/pipeline.ts` | Écarte ce qui n'a pas de source vérifiable, ce qui sort du périmètre bien-être, et les doublons (par URL et par titre). Correspondance par frontière de mot. |
| **Modération humaine obligatoire** | `app/admin/actualites` | L'agent **propose**, il ne publie jamais. Rien n'atteint le fil public sans une décision humaine. |
| **Déclenchement programmé** | Vercel Cron | Passage quotidien. |

Le fil couvre en priorité ce qui fait vivre la filière : ouvertures de centres, cures saisonnières, festivals et rendez-vous gastronomiques.

### 3.4 Socle applicatif

| Couche | Technologie |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Langage | TypeScript en mode strict |
| Style | Tailwind CSS v4 (`@theme`), design system maison |
| Animation | Framer Motion |
| Icônes | lucide-react |
| Internationalisation | Réécriture par middleware (`/en/*`, `/ar/*` → `/*` + en-tête `x-locale`) — **une seule arborescence de pages**, aucune duplication possible entre langues. Sens droite-à-gauche porté par des propriétés logiques |
| Typage des traductions | Le dictionnaire français est la source du type : une clé oubliée dans une autre langue est une **erreur de compilation**, pas une chaîne manquante découverte en production |
| Tests | Runner natif Node 24 avec dépouillement de types TypeScript — aucune chaîne d'outils de test à maintenir |
| Sécurité | En-têtes CSP stricts, `noindex` par défaut, limitation de débit par appelant, validation et re-typage de toutes les entrées d'API |
| Déploiement | Vercel |

---

## 4. Vérifiabilité — ce que le jury peut contrôler lui-même

```bash
npm install
npm run typecheck   # TypeScript strict — aucune erreur
npm test            # 56 tests, 56 passants
npm run build       # build de production validé
```

**Volumétrie :** 95 fichiers de code, ~19 700 lignes, 19 pages, 6 routes d'API.

**Répartition des 56 tests :**

| Domaine | Nombre | Exemples |
|---|---|---|
| Garde-fous médicaux | 10 | *bloque un diagnostic posé* · *bloque une promesse de résultat* · *une promesse au pluriel est bloquée comme au singulier* · *une mise en garde qui nie une promesse n'est pas censurée* |
| Concierge conversationnel | 7 | *l'urgence court-circuite toute autre réponse* · *le concierge répond sur le budget sans passage censuré* |
| Parcours et compréhension | 17 | *« cure thermale » ne déclenche pas d'acte médical* · *le séjour de remise en forme se termine par son plan de suite* · *le parcours généré suit la langue du visiteur* · *un nom de ville ne se reconnaît qu'entier* |
| Agent de veille | 10 | *une source non vérifiable est refusée* · *les doublons sont écartés* · *les dates françaises sont lues, et rien n'est deviné* |
| Persistance PostgreSQL | 6 | *le schéma se crée et un élément fait l'aller-retour* · *la base refuse le doublon, par URL comme par titre* — exécutés contre PGlite, PostgreSQL compilé en WebAssembly |
| Comptes et rôles | 6 | *le mot de passe n'est jamais stocké en clair* · *la même adresse ne peut pas servir deux fois* · *la hiérarchie des rôles est une échelle* |

**Deux tests qui méritent d'être montrés.**

*« Cure thermale ne déclenche pas d'acte médical »* — le mot « thermale » contient « mal ». Sans reconnaissance par frontière de mot, une demande de cure déclenchait l'objectif « me soigner » et le parcours se chargeait de trois rendez-vous médicaux que personne n'avait demandés. Le test vérifie désormais qu'une demande de bien-être produit **zéro** acte médical.

*« Le parcours généré suit la langue du visiteur »* — il construit le même parcours en français et en anglais, vérifie que la structure est identique jour par jour, puis balaie l'intégralité du texte anglais — titres, détails, points de vigilance, justifications, lignes budgétaires — à la recherche du moindre résidu français. Une seule fuite fait échouer le test.

---

## 5. Scénario de la vidéo de 2 minutes

| Temps | Séquence | Message porté |
|---|---|---|
| 0:00–0:12 | Page d'accueil, descente jusqu'à *« Que souhaitez-vous améliorer ? »* | On n'entre pas par un établissement, on entre par une intention. |
| 0:12–0:30 | Saisie de la phrase dans le Journey Builder, puis clic | Le WOW moment. Une phrase suffit. |
| 0:30–0:45 | Bandeau *« Ce que nous avons compris »* avec le niveau de certitude et la question manquante | La plateforme montre son raisonnement au lieu de l'affirmer. |
| 0:45–1:10 | Défilement de l'itinéraire : évaluation au J2, montée de charge, séances thermales, jours de repos intercalés, **bilan et plan de suite au J9** | Ce n'est pas une liste, c'est une progression calculée. |
| 1:10–1:22 | Arrêt sur une carte d'établissement : les raisons affichées, le badge de vérification et sa date | Aucune note globale. Des critères vérifiables. |
| 1:22–1:34 | Estimation ventilée : cure thermale, remise en forme, spa, hébergement | Une estimation, jamais un prix. |
| 1:34–1:45 | Bascule en anglais : le parcours se reconstruit en anglais | La personnalisation suit la langue, pas seulement l'interface. |
| 1:45–1:55 | Page patrimoine, panorama 360° manipulé à la souris | On ne choisit pas une station qu'on ne peut pas voir. |
| 1:55–2:00 | Centre de confiance : *« Ce que l'assistant ne fera jamais »* | La ligne rouge est écrite, testée, et affichée publiquement. |

**Recommandations de tournage :** capture d'écran sans voix off (sous-titres uniquement, pour rester audible dans les deux langues), curseur agrandi, aucune coupe pendant la génération du parcours — la vitesse réelle est un argument.

---

## 6. Limites assumées

Un dossier honnête énonce ce qui n'est pas fait :

- **Le catalogue d'établissements est fictif** et signalé comme tel sur chaque fiche. Aucun établissement réel n'est nommé tant que des partenaires vérifiés ne sont pas conventionnés.
- **Les montants sont des ordres de grandeur** destinés à la démonstration. En production, chaque ligne doit être alimentée par une grille fournie et datée par le partenaire, ou masquée.
- **La persistance est optionnelle.** Sans `DATABASE_URL`, le fil et les décisions vivent en mémoire du processus et ne survivent pas à un redéploiement — et la page de modération l'affiche. Avec une base, ils survivent.
- **L'espace personnel reste un compte de démonstration.** L'authentification existe et protège la modération ; elle n'est pas encore raccordée aux données de l'espace.
- **L'arabe attend une relecture par un locuteur natif**, les mentions réglementaires en premier. Le corps éditorial des fiches destination et d'établissement y retombe volontairement sur le français.
- **Les panoramas des stations thermales restent à capter.** Le dispositif immersif est en place et fonctionne ; il attend les prises de vue réelles.
- **Six des neuf langues annoncées restent à intégrer.** L'architecture est en place et typée pour les recevoir ; le français, l'anglais et l'arabe sont livrés.

Aucune de ces limites n'est masquée dans le produit : chacune est écrite à l'endroit où le visiteur pourrait s'y tromper.
