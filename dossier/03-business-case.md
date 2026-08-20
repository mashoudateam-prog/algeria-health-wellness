# ALGERIA HEALTH & WELLNESS
## Business Case — Viabilité économique et impact sur le tourisme algérien

---

> **Note de méthode, à lire avant les chiffres.**
> Ce document distingue deux natures d'information, et nomme la source de tout le reste :
> - **[FAIT]** — vérifiable dans le prototype ou dans le code livré.
> - **[HYPOTHÈSE]** — paramètre de modèle, explicitement posé, que le lecteur peut contester et remplacer.
>
> Ce projet applique à son propre dossier la règle qu'il applique à sa plateforme : **on n'invente pas un chiffre parce qu'il manque.** Chaque donnée de marché ci-dessous porte le nom de qui l'a annoncée, dans quel cadre et à quelle date. Deux figures restent dérivées d'un calcul plutôt que citées : elles sont signalées comme telles.

---

## 1. Le marché

### 1.1 L'actif dormant

L'Algérie compte des sources thermales exploitées depuis l'Antiquité — Hammam Meskhoutine dans la wilaya de Guelma, Hammam Essalihine à Khenchela, Hammam Righa à Aïn Defla, Hammam Boughrara près de Tlemcen. Certaines comptent parmi les plus chaudes du bassin méditerranéen.

Le ministère du Tourisme et de l'Artisanat en a recensé **282**, dont 61 % au nord et 39 % au sud. **Trente-deux seulement sont exploitées en station**, avec trois centres de thalassothérapie et trente-quatre bains minéraux traditionnels ; cinquante-neuf projets sont agréés, dont vingt-quatre en construction.

**Un actif dormant se mesure à cet écart : 282 ressources recensées, 32 exploitées.** La ressource existe, la demande existe, l'interface manque.

### 1.2 Segments adressés

| Segment | Description | Panier attendu | Durée de séjour |
|---|---|---|---|
| **A — Diaspora** | Personnes d'origine algérienne résidant à l'étranger, cherchant un séjour utile de deux à trois semaines au pays | Moyen sur les prestations, faible sur l'hébergement | 10–21 jours |
| **B — Marché intérieur** | Résident algérien organisant une cure thermale ou un programme de remise en forme hors de sa wilaya | Moyen | 3–10 jours |
| **C — Voyageur international bien-être** | Ressortissant étranger comparant l'Algérie à la Tunisie, au Maroc ou à la Turquie pour une cure ou une retraite | Élevé sur tous les postes | 7–14 jours |
| **D — Voyageur d'agrément + entraînement** | Voyageur venu découvrir le pays et souhaitant maintenir sa pratique sportive | Faible sur les cures, moyen sur le reste | 7–14 jours |

**Séquence de conquête recommandée : A → B → D → C.** La diaspora est le marché d'amorçage naturel : elle connaît le pays, parle la langue, dispose du réseau familial qui résout la logistique, et cherche déjà comment occuper utilement trois semaines. Elle ne demande pas d'être convaincue de venir : elle demande à être organisée. Le segment C, le plus rémunérateur, exige une confiance qui ne s'obtient qu'après avoir constitué un socle d'établissements vérifiés — il vient en dernier.

### 1.3 Le marché, en chiffres

| Donnée | Valeur | Source |
|---|---|---|
| Touristes accueillis en Algérie en 2024 | **plus de 3,5 millions** | Nabil Mellouk, directeur central au ministère du Tourisme et de l'Artisanat, Chaîne 2, 10 février 2025 |
| dont ressortissants étrangers | **2,3 millions** | *idem* |
| dont diaspora algérienne | **1,2 million** | *idem* |
| Progression 2024 sur 2023 | **+10 %** | *idem* |
| Recettes touristiques 2023 | **1,6 milliard USD** | Mokhtar Didouche, ministre du Tourisme et de l'Artisanat, mai 2024 |
| Part du tourisme dans le PIB | **2 %**, objectif 5 % | *idem* |
| Objectif national à 2030 | **12 millions de touristes** | *idem* |
| Sources thermales recensées | **282** — 61 % nord, 39 % sud | Mokhtar Didouche, forum international du tourisme thermal, Sétif, 28 octobre 2023 |
| Stations thermales exploitées | **32** + 3 centres de thalassothérapie + 34 bains traditionnels | *idem* |
| Projets de station agréés | **59**, dont 24 en construction | *idem* |

**Deux figures dérivées, signalées comme telles.** La dépense moyenne 2023 s'obtient en divisant les recettes par les visiteurs : **485 USD par visiteur**. C'est une moyenne nationale, tirée vers le bas par les séjours courts et les visites familiales — un séjour de cure de sept à quatorze jours se situe structurellement au-dessus, et c'est précisément l'écart que ce projet cherche à capter. La seconde figure dérivée est le seuil de rentabilité du §4.4, calculé à partir des hypothèses du modèle.

> **Pourquoi la Tunisie est le bon comparable — et ce que la comparaison démontre.**
>
> La Tunisie est la **deuxième destination mondiale de thalassothérapie, après la France**. Elle exploite **60 centres de thalassothérapie** qui ont accueilli **170 000 curistes en 2024**, **63 stations thermales traditionnelles** et 390 centres d'hydrothérapie ; la France y représente 40 % des arrivées *(Office national du thermalisme et de l'hydrothérapie, juin 2025)*.
>
> Mettez les deux pays côte à côte : l'Algérie a recensé **282 sources thermales** et en exploite **32** ; la Tunisie en exploite **63** et y a ajouté **60 centres de thalassothérapie** là où l'Algérie en compte **3**.
>
> **L'écart ne vient pas de la ressource — l'Algérie en a davantage. Il vient de l'organisation, de la lisibilité de l'offre et de la confiance.** C'est exactement ce que cette plateforme produit. **Ce qui manque à l'Algérie est logiciel, pas géologique.**

---

## 2. Modèle de revenus

Quatre sources, volontairement ordonnées de la moins à la plus intrusive pour la confiance du visiteur.

### 2.1 Abonnement partenaire *(source principale)*

Les établissements payent pour être référencés, vérifiés et recommandables.

| Palier | Cible | Contenu | Tarif mensuel `[HYPOTHÈSE]` |
|---|---|---|---|
| **Vérifié** | Salle de sport, spa indépendant, maison d'hôtes | Fiche vérifiée, présence dans les recommandations | 8 000 DZD |
| **Professionnel** | Station thermale, centre de remise en forme, centre de rééducation | + statistiques de consultation, gestion des créneaux, mise en avant patrimoniale | 25 000 DZD |
| **Partenaire** | Groupe hôtelier, réseau de stations | + intégration multi-sites, API de disponibilités, accompagnement dédié | 60 000 DZD |

**Principe non négociable, et il est aussi un argument commercial :** l'abonnement achète la **visibilité vérifiée**, jamais le **classement**. Le moteur de recommandation ne pondère pas le montant payé. Un jury — comme un visiteur — peut vérifier ce point dans le code (`lib/ai/matching.ts`) : aucun champ de facturation n'entre dans le calcul du score. **C'est ce qui rend la plateforme crédible, et donc ce qui la rend durable.**

### 2.2 Commission de coordination

Pourcentage appliqué aux prestations **effectivement réservées via la plateforme** — cures, séances encadrées, hébergement, transferts.

- Taux `[HYPOTHÈSE]` : **8 %** sur l'hébergement, les cures et les services d'accompagnement.
- **Aucune commission sur un acte médical.** Commissionner un soin crée une incitation à en prescrire davantage. La ligne est tracée ici, et elle est structurelle, pas cosmétique.

### 2.3 Conciergerie premium

Accompagnement humain nommé pour les séjours longs : programme sur mesure, coordination station thermale et centre de remise en forme, famille accompagnante.

- Forfait `[HYPOTHÈSE]` : **15 000 DZD** par séjour, ou **45 000 DZD** pour un accompagnement complet de 10 jours et plus.

### 2.4 Licence institutionnelle

Mise à disposition du moteur — planification, vérification, carte santé — à un office du tourisme, une wilaya thermale ou un groupe hôtelier, en marque blanche.

- Licence annuelle `[HYPOTHÈSE]` : **à partir de 1 200 000 DZD**.
- **C'est la source la plus stratégique** : elle transforme un produit grand public en infrastructure publique, et aligne les intérêts de la plateforme avec ceux de la filière.

---

## 3. Structure de coûts

### 3.1 Coûts d'exploitation, en rythme annuel

| Poste | Montant annuel `[HYPOTHÈSE]` | Commentaire |
|---|---|---|
| Hébergement et infrastructure | 180 000 DZD | Vercel + base de données managée. Le prototype tient dans les paliers gratuits. |
| Inférence IA | 240 000 DZD | **Poste maîtrisé par conception** — voir 3.2. |
| Vérification des établissements | 900 000 DZD | Poste humain, non compressible : c'est le produit. |
| Modération éditoriale du fil | 300 000 DZD | Environ 1 h/jour. |
| Développement et maintenance | 3 600 000 DZD | Deux profils techniques. |
| Commercial et partenariats | 1 800 000 DZD | Un profil, terrain. |
| Juridique, conformité, assurance | 400 000 DZD | Indispensable dès qu'on met en relation. |
| **Total** | **7 420 000 DZD** | ≈ 618 000 DZD/mois |

### 3.2 L'avantage économique de l'architecture déterministe

**[FAIT]** Le parcours n'est pas généré par un modèle de langage : il est calculé.

Conséquence directe et chiffrable : **la construction d'un parcours ne coûte rien en inférence.** Un concurrent qui génère chaque itinéraire par appel à un LLM paye à chaque requête, et son coût marginal croît linéairement avec le trafic. Ici, seul le concierge conversationnel consomme de l'inférence, et il retombe sur le moteur de règles en cas de panne ou d'absence de clé.

| | Architecture « tout LLM » | Cette architecture |
|---|---|---|
| Coût marginal d'un parcours | Un appel LLM facturé | **Zéro** |
| Coût à 100 000 parcours/mois | Croissant, linéaire | **Inchangé** |
| Reproductibilité du résultat | Non garantie | **Garantie** |
| Fonctionnement sans fournisseur d'IA | Impossible | **Complet** |
| Auditabilité par un tiers | Opaque | **Règles lisibles et versionnées** |

Ce n'est pas une optimisation technique. **C'est la raison pour laquelle le modèle économique tient à l'échelle**, et c'est vérifiable en coupant la clé d'API.

---

## 4. Trajectoire financière

### 4.1 Hypothèses d'adoption

| | Année 1 | Année 2 | Année 3 |
|---|---|---|---|
| Établissements partenaires `[HYPOTHÈSE]` | 40 | 150 | 400 |
| Répartition Vérifié / Pro / Partenaire | 30 / 9 / 1 | 105 / 38 / 7 | 260 / 115 / 25 |
| Parcours construits par mois `[HYPOTHÈSE]` | 800 | 4 000 | 12 000 |
| Taux de conversion en séjour réservé `[HYPOTHÈSE]` | 2 % | 3,5 % | 5 % |
| Séjours réservés par mois | 16 | 140 | 600 |
| Panier moyen coordonné `[HYPOTHÈSE]` | 180 000 DZD | 200 000 DZD | 220 000 DZD |
| Licences institutionnelles | 0 | 1 | 3 |

### 4.2 Revenus projetés, en DZD

| Source | Année 1 | Année 2 | Année 3 |
|---|---|---|---|
| Abonnements partenaires | 6 300 000 | 26 520 000 | 77 460 000 |
| Commission de coordination (8 %) | 2 764 800 | 26 880 000 | 126 720 000 |
| Conciergerie premium | 720 000 | 6 300 000 | 27 000 000 |
| Licence institutionnelle | 0 | 1 200 000 | 3 600 000 |
| **Total** | **9 784 800** | **60 900 000** | **234 780 000** |

### 4.3 Résultat

| | Année 1 | Année 2 | Année 3 |
|---|---|---|---|
| Revenus | 9 784 800 | 60 900 000 | 234 780 000 |
| Charges `[HYPOTHÈSE]` | 7 420 000 | 14 800 000 | 32 000 000 |
| **Résultat d'exploitation** | **+2 364 800** | **+46 100 000** | **+202 780 000** |

> **Lecture honnête de ce tableau.** L'équilibre dès l'année 1 tient à une structure d'équipe réduite et à un coût marginal quasi nul par parcours. Il repose entièrement sur l'hypothèse de 40 établissements partenaires payants la première année, alors que 25 suffisent à l'équilibre — **c'est le point de rupture du modèle**, et c'est là que le jury doit porter son attention. Le tableau de sensibilité ci-dessous le traite explicitement plutôt que de le masquer.

### 4.4 Sensibilité au nombre de partenaires — année 1

| Partenaires année 1 | Revenus abonnement | Résultat d'exploitation |
|---|---|---|
| 15 *(scénario prudent)* | 2 362 500 DZD | **−1 572 700 DZD** |
| 20 | 3 150 000 DZD | **−785 200 DZD** |
| **25 — seuil d'équilibre** | **3 937 500 DZD** | **≈ 0** |
| 40 *(scénario retenu)* | 6 300 000 DZD | **+2 364 800 DZD** |
| 60 *(scénario favorable)* | 9 450 000 DZD | **+5 514 800 DZD** |

**Le seuil de rentabilité se situe à 25 établissements partenaires payants.** Ramené à huit destinations éditoriales, cela représente **3 établissements par destination** — un objectif commercial atteignable en douze mois par une personne dédiée au terrain.

---

## 5. Impact direct sur le secteur touristique algérien

### 5.1 Six mécanismes d'impact

**1. Rendre le patrimoine thermal réservable.** Sur 282 sources recensées, 32 sont exploitées en station — et presque aucune n'est décrite, datée ou réservable depuis l'étranger. Les faire entrer dans un parcours calculé, avec une description, une saison recommandée et un temps de trajet, c'est les faire exister commercialement. Les 59 projets agréés donnent la mesure de ce qui arrive : il leur faudra une vitrine. *Indicateur : nombre de stations thermales référencées et vérifiées.*

**2. Étalement saisonnier.** **[FAIT]** Le moteur applique une règle explicite : Biskra et Ghardaïa sont déconseillées de juin à septembre, la côte est privilégiée d'avril à juin. Un visiteur qui décrit un projet de remise en forme en août est réorienté vers le littoral ; un projet de cure en janvier l'est vers le Sud. **La saisonnalité n'est pas subie, elle est arbitrée par le produit.** *Indicateur : distribution mensuelle des séjours construits.*

**3. Diffusion territoriale hors du littoral.** Les stations thermales sont dans les terres — Guelma, Khenchela, Aïn Defla — et les oasis dans le Sud. Un séjour construit autour d'une cure irrigue des territoires que le tourisme balnéaire ignore. *Indicateur : part des séjours dont la destination principale est hors littoral.*

**4. Élévation du standard de transparence.** Le référentiel de vérification — identité juridique, adresse, encadrement déclaré, date du contrôle — est public. Un établissement qui veut être recommandé doit l'atteindre. **La plateforme ne se contente pas de trier l'offre existante : elle crée une incitation à la formaliser.** *Indicateur : nombre d'établissements passés de « déclaratif » à « vérifié ».*

**5. Valorisation du patrimoine par le temps disponible.** **[FAIT]** Un séjour de cure ou de remise en forme libère des journées entre deux séances. Le planificateur y insère des visites calibrées sur l'effort de marche et le temps disponible, en privilégiant les sept sites inscrits au patrimoine mondial. **Le patrimoine cesse d'être une option pour devenir une composante calculée du séjour.** *Indicateur : nombre de visites patrimoniales insérées par parcours.*

**6. Structuration d'une filière lisible depuis l'étranger.** **[FAIT]** Le parcours entier est produit en anglais — pas seulement l'interface : les justifications, le budget et les mentions réglementaires aussi. Un voyagiste ou un prescripteur étranger peut lire, comprendre et vérifier l'offre algérienne dans sa langue.

### 5.2 Effet d'entraînement sur les autres filières

Un séjour de dix jours mobilise : hébergement (9 nuits), restauration, transferts, encadrement sportif, guide patrimonial, artisanat, et parfois une famille accompagnante. **La cure est le déclencheur, pas la totalité de la dépense.** Le modèle de devis ventilé permet de mesurer précisément cette répartition — dans le prototype, les postes hébergement, transport et accompagnement représentent la part majoritaire de l'estimation sur un séjour de remise en forme.

### 5.3 Indicateurs de suivi proposés à l'autorité de tutelle

La plateforme peut restituer, sans jamais exposer de donnée personnelle :

| Indicateur | Intérêt pour la politique touristique |
|---|---|
| Volume de parcours construits, par mois et par pays d'origine | Mesure de l'intention, en amont de la réservation |
| Durée moyenne et panier moyen par segment | Suivi de la valeur par arrivée |
| Distribution mensuelle et territoriale des séjours | Pilotage de la saisonnalité et de la diffusion régionale |
| Objectifs les plus demandés (cure, remise en forme, repos, entraînement) | Orientation de l'investissement en équipement |
| Taux de conversion intention → séjour | Détection des points de friction de la filière |
| Progression du statut de vérification des établissements | Mesure de la formalisation du secteur |

**C'est un actif de politique publique autant qu'un produit commercial :** aucun outil ne mesure aujourd'hui l'intention touristique en amont de la réservation.

---

## 6. Risques et réponses

| Risque | Gravité | Réponse structurelle |
|---|---|---|
| **Dérive vers l'allégation thérapeutique** | Critique | Aucune eau thermale n'est présentée comme le traitement d'une maladie. Le filtre de sortie bloque toute promesse de résultat, y compris sur les réponses du moteur de règles, et le mot « detox » est écarté du vocabulaire. Huit tests dédiés. |
| **Adoption trop lente par les établissements** | Élevée | Palier d'entrée à 8 000 DZD/mois. Seuil d'équilibre à 25 partenaires seulement. Le référencement vérifié a une valeur commerciale propre, indépendante du volume. |
| **Qualité des données partenaires** | Élevée | Trois statuts affichés — vérifié, en cours, déclaratif — avec la date du contrôle. **Un champ vide vaut mieux qu'une mention rassurante mais infondée.** |
| **État réel des infrastructures thermales** | Élevée | La vérification porte sur ce qui est constatable et daté. Une station dont l'état ne peut être confirmé reste « déclaratif », et c'est écrit sur sa fiche. |
| **Dépendance à un fournisseur d'IA** | Moyenne | **[FAIT]** Architecture agnostique ; fonctionnement intégral sans clé. Le risque est structurellement neutralisé, pas seulement anticipé. |
| **Souveraineté des données** | Élevée | Aucun traceur tiers, aucune clé cartographique, partage nominatif et journalisé. Hébergement souverain possible : la pile est portable. |
| **Concurrence régionale installée** | Moyenne | La différenciation n'est pas le prix mais la méthode : entrée par l'intention, progression calculée, recommandation explicable. Difficile à copier sans reconstruire le moteur. |
| **Saisonnalité extrême du Sud** | Faible | Traitée par une règle produit, pas par un avertissement. |

---

## 7. Ce qui est demandé

| Besoin | Montant `[HYPOTHÈSE]` | Affectation |
|---|---|---|
| Persistance, authentification, gestion des rôles | 1 200 000 DZD | Passage du prototype au service |
| Conventionnement des 40 premiers établissements | 2 400 000 DZD | Terrain, vérification, contractualisation — priorité aux stations thermales |
| Production immersive (panoramas 360° des stations) | 1 500 000 DZD | Huit destinations, douze sites patrimoniaux, bassins et hammams |
| Sept langues supplémentaires | 900 000 DZD | Espagnol, allemand, chinois, japonais, russe, arabe, coréen, italien |
| Conformité et assurance responsabilité | 600 000 DZD | Préalable à toute mise en relation réelle |
| **Total** | **6 600 000 DZD** | Horizon 12 mois |

**Contrepartie mesurable à douze mois :** un patrimoine thermal rendu visible et réservable, un référentiel public de vérification des établissements, et un instrument de mesure de l'intention touristique que l'Algérie ne possède pas aujourd'hui.

---

*Toutes les valeurs marquées `[HYPOTHÈSE]` sont des paramètres de modèle, posés pour être discutés et remplacés. Les éléments marqués `[FAIT]` sont vérifiables dans le prototype et dans le code livré. Les données de marché du §1 sont des déclarations officielles publiques, chacune attribuée à son auteur et à sa date — elles sont vérifiables, et elles doivent l'être.*

---

## Sources

- Tourisme algérien 2024 — Nabil Mellouk, directeur central au ministère du Tourisme et de l'Artisanat, radio Chaîne 2, 10 février 2025. [algerie-eco.com](https://algerie-eco.com/2025/02/12/algerie-23-millions-de-touristes-etrangers-en-2024/)
- Recettes touristiques et part du PIB — Mokhtar Didouche, ministre du Tourisme et de l'Artisanat, mai 2024. [french.news.cn](https://french.news.cn/20240522/e53ecf1ec88a4d8485a60b661679bbcd/c.html)
- Sources et stations thermales — Mokhtar Didouche, forum international sur le tourisme thermal, Sétif, 28 octobre 2023. [algerie-eco.com](https://www.algerie-eco.com/2023/10/28/lalgerie-compte-282-sources-thermales/)
- Thalassothérapie et thermalisme en Tunisie — Office national du thermalisme et de l'hydrothérapie (ONTH), juin 2025. [kapitalis.com](https://kapitalis.com/tunisie/2025/06/12/la-tunisie-2e-destination-mondiale-de-thalassotherapie-en-2024/)

*Les données algériennes proviennent de déclarations officielles relayées par la presse, non de publications statistiques de l'ONS. Si le règlement du concours exige une source institutionnelle primaire, ces mêmes chiffres sont à demander au ministère du Tourisme et de l'Artisanat, qui en est l'auteur.*
