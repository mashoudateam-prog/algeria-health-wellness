# ALGERIA HEALTH & WELLNESS
## Executive Summary — Fiche de présentation synthétique

**Axe candidaté : Axe 02 — Le Sur-Mesure** (personnalisation du parcours client, IA conversationnelle, systèmes de recommandation intelligents)
**Renfort : Axe 01 — Le Rêve** (immersion, 360°, contenu visuel)

| | |
|---|---|
| **Porteur** | Équipe Mashouda |
| **Contact** | mashouda.team@gmail.com |
| **Nature** | Plateforme web — prototype fonctionnel déployé |
| **Dépôt de code** | `github.com/mashoudateam-prog/algeria-health-wellness` |
| **Langues** | Français, Anglais, **Arabe** — dont le sens droite-à-gauche |
| **État** | 19 pages, 6 API, 56 tests automatisés, build de production validé |

---

## 1. Le problème

L'Algérie possède un patrimoine thermal exceptionnel — des sources chaudes fréquentées depuis l'Antiquité, dans les wilayas de Guelma, Khenchela, Aïn Defla et Tlemcen — et un cadre qui se prête au séjour de remise en forme. Ce patrimoine ne se transforme pas en séjours, pour trois raisons :

1. **L'offre est invisible et illisible.** Une station thermale algérienne n'a le plus souvent ni site, ni horaires publiés, ni description de ce qu'on peut y faire. Un visiteur qui cherche « cure thermale Algérie » ne trouve rien qui lui permette de décider.
2. **Personne n'organise le séjour comme un tout.** Une cure suppose un rythme : des jours de bains, des jours de repos, une progression. Une remise en forme suppose une évaluation de départ et une montée de charge. Aujourd'hui, le visiteur assemble lui-même, au hasard, et souvent renonce.
3. **La confusion entre détente et soin décrédibilise la filière.** Beaucoup d'offres promettent des vertus thérapeutiques invérifiables. Cette confusion fait fuir les visiteurs sérieux et expose les établissements.

## 2. La solution

**Algeria Health & Wellness est un système d'exploitation du séjour de remise en forme, de thermalisme et de bien-être.** Le visiteur n'entre pas par un catalogue mais par une phrase :

> *« Je viens de France pour 10 jours : je voudrais me remettre en forme, faire une cure thermale et me reposer. »*

En moins d'une seconde, la plateforme produit un parcours complet et **construit dans le bon ordre** : évaluation de condition physique à l'arrivée, montée progressive de la charge, séances thermales placées aux bons jours, journées de récupération intercalées, visites patrimoniales calibrées sur l'effort restant, hébergement, budget ventilé par poste, et un **programme écrit à poursuivre au retour**.

**Le « WOW moment » du produit — le Health Journey Builder — est démontrable en 30 secondes.**

### Ce qui distingue cette approche

| Approche habituelle | Algeria Health & Wellness |
|---|---|
| « Choisissez un établissement » | « Que souhaitez-vous améliorer ? » |
| Une liste de prestations juxtaposées | Une progression : évaluer, monter en charge, récupérer, repartir avec un plan |
| Une note globale, des étoiles | Trois à cinq raisons vérifiables par recommandation |
| « Nos eaux soignent » | Des lieux de détente et de récupération, sans revendication thérapeutique |
| Des données inventées quand elles manquent | Un champ vide et une mention explicite |
| Des visuels générés par IA | Des photographies réelles, chaque lieu vérifié individuellement |

## 3. Le cœur technique : personnalisation sans hallucination

Le pari du projet est explicite et il est l'inverse de la mode actuelle : **le parcours n'est pas généré par un modèle de langage, il est calculé par un moteur de règles.**

Le LLM sert à comprendre l'intention exprimée en langage naturel et à converser. Il ne décide jamais d'un enchaînement de séances. Cette séparation produit trois propriétés qu'un système « tout LLM » ne peut pas offrir :

- **Reproductibilité** — la même demande produit le même parcours. Un jury peut le vérifier.
- **Auditabilité** — chaque règle est écrite, versionnée et relisible dans le code (`lib/rules/compatibility.ts`). Aucune n'est produite par un modèle.
- **Sécurité** — le filtre de sortie bloque diagnostic, prescription, promesse de résultat et prix garanti, y compris sur les réponses du moteur de règles. *Une consigne se contourne ; un filtre de sortie, non.*

**Exemples de règles réellement appliquées :** une séance d'évaluation ouvre toujours le programme, avant toute montée en charge ; un jour de repos sépare deux séances encadrées ; aucun effort soutenu dans les 48 h suivant un acte médical si le séjour en comporte un ; les bains chauds sont repoussés en seconde partie de séjour et conditionnés à l'accord du praticien lorsqu'un acte est programmé ; Biskra et Ghardaïa sont déconseillées de juin à septembre, où la chaleur rend tout effort déconseillé.

**Le vocabulaire relève de la même exigence.** Nous ne parlons jamais de « detox », terme sans définition médicale établie, et aucune eau thermale n'est présentée comme le traitement d'une maladie : les stations sont décrites comme des lieux de détente et de récupération. Cette retenue n'est pas de la prudence juridique — c'est ce qui rend la filière crédible face à la Tunisie et au Maroc.

## 4. L'immersion en renfort

L'immersion sert le parcours, elle ne le remplace pas. Chaque destination et chaque site patrimonial dispose d'un emplacement immersif qui affiche le meilleur média disponible : panorama 360° navigable, vidéo, ou modèle 3D. Le visualiseur panoramique est écrit en WebGL natif, sans bibliothèque tierce : il fonctionne sous une politique de sécurité stricte, ne charge aucun script externe et ne trace personne.

**C'est l'outil qui manque le plus à la filière thermale :** on ne choisit pas une station qu'on ne peut pas voir. Un panorama de bassin, de hammam ou de palmeraie fait davantage pour la décision qu'une page de texte.

## 5. Souveraineté et éthique des données

- **Aucun traceur tiers, aucune clé d'API cartographique.** La carte santé de l'Algérie est un SVG vectoriel construit à partir des coordonnées réelles des chefs-lieux. La position du visiteur n'est jamais collectée.
- **Architecture agnostique du fournisseur d'IA.** L'interface `LlmProvider` permet de basculer d'un fournisseur à l'autre — ou vers un modèle hébergé en Algérie — sans toucher au produit. **Sans aucune clé API, la plateforme fonctionne intégralement** sur son moteur déterministe, avec les mêmes garde-fous.
- **Health Passport.** Un partage de document est nominatif, limité dans le temps, révocable en un geste, et journalisé.
- **Catalogue de démonstration explicitement marqué.** Les établissements présentés sont fictifs et signalés comme tels sur chaque fiche. Le site est en `noindex` par défaut pour qu'aucune fiche fictive ne soit indexée.

## 6. Impact attendu sur le tourisme algérien

1. **Rendre le patrimoine thermal réservable.** Des sources fréquentées depuis l'époque romaine sont aujourd'hui absentes de toute offre structurée. Les faire entrer dans un parcours calculé, c'est les faire exister commercialement.
2. **Étaler la saison.** Biskra et Ghardaïa se visitent d'octobre à avril, la côte de mai à septembre : le moteur oriente vers la bonne saison et déporte la fréquentation hors des pics.
3. **Diffuser la valeur hors du littoral.** Les stations thermales sont dans les terres — Guelma, Khenchela, Aïn Defla. Un séjour construit autour d'une cure irrigue des territoires que le tourisme balnéaire ignore.
4. **Allonger la durée moyenne de séjour.** Une cure ou un programme de remise en forme dure 7 à 14 jours, contre 3 à 5 pour un séjour d'agrément — avec des postes de dépense plus élevés.
5. **Structurer une offre professionnelle.** Le référentiel de vérification — identité juridique, adresse, encadrement déclaré, date de contrôle — crée un standard de transparence que les stations ont intérêt à atteindre.
6. **Adresser la diaspora.** Plusieurs millions de personnes d'origine algérienne à l'étranger constituent le marché d'amorçage naturel : elles connaissent le pays et cherchent déjà où passer trois semaines utiles.

## 7. État d'avancement

**Ce qui fonctionne aujourd'hui, en production :**

- Health Journey Builder complet (compréhension du langage naturel, planification, recommandation, estimation)
- Moteur de progression physique : évaluation, reprise douce, renforcement, séance longue, bilan et plan écrit
- Concierge conversationnel avec garde-fous en sortie et détection d'urgence
- 8 destinations, 12 sites patrimoniaux, 6 types de séjours, 22 fiches de démonstration — stations thermales, spas, centres de remise en forme, salles de sport
- Carte santé vectorielle filtrable, fil d'actualité alimenté par un agent de veille avec modération humaine obligatoire, Health Passport avec partage temporaire et journal d'accès
- Trois langues, dont l'arabe et son sens droite-à-gauche — le parcours généré, les justifications, les mentions réglementaires et la compréhension du langage naturel suivent la langue du visiteur
- Comptes et rôles : visiteur, partenaire, modérateur, administrateur. Mot de passe dérivé par scrypt, session en cookie `httpOnly` dont seule l'empreinte est conservée
- Persistance PostgreSQL optionnelle : avec une base, les décisions de modération survivent au redéploiement et le dédoublonnage est arbitré par deux index uniques
- 56 tests automatisés, dont 10 sur les garde-fous et 12 exécutés contre un vrai moteur PostgreSQL

**Prochains jalons :** relecture de l'arabe par un locuteur natif, intégration des six langues restantes, captation des panoramas des stations, conventionnement des premières stations thermales réelles.

---

*Les établissements présentés dans le prototype proviennent d'un catalogue de démonstration : ils sont fictifs et signalés comme tels. Les montants affichés sont des ordres de grandeur destinés à la démonstration et ne constituent pas des tarifs.*
