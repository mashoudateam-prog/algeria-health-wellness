# E-mail de soumission

> Trois versions. La première est celle à envoyer par défaut : un jury lit vite, et un e-mail court qui laisse le dossier faire le travail passe mieux qu'un argumentaire de deux pages. Les deux autres couvrent les cas où le contexte change.

---

## Version 1 — Soumission officielle *(recommandée)*

**Objet :** Candidature Axe 02 — Algeria Health & Wellness, plateforme de personnalisation du séjour thermal et de remise en forme

---

Madame, Monsieur,

Nous avons l'honneur de vous soumettre la candidature du projet **Algeria Health & Wellness** au titre de l'**Axe 02 — Le Sur-Mesure**, avec l'immersion en renfort au titre de l'Axe 01.

**Algeria Health & Wellness transforme une phrase en séjour.** Un voyageur écrit *« je viens de France pour 10 jours : je voudrais me remettre en forme, faire une cure thermale et me reposer »*, et la plateforme construit en moins d'une seconde un parcours complet : évaluation de condition physique à l'arrivée, montée progressive de la charge, séances thermales placées aux bons jours, journées de récupération intercalées, visites patrimoniales calibrées sur l'effort restant, hébergement, budget ventilé par poste, et un programme écrit à poursuivre au retour.

Trois éléments nous semblent mériter votre attention particulière :

**Le parcours n'est pas généré par une IA, il est calculé.** Le modèle de langage sert à comprendre l'intention et à converser ; il ne décide jamais d'un enchaînement de séances. Cette séparation rend le système reproductible, auditable et défendable dans un contexte médical — trois propriétés qu'une architecture « tout LLM » ne peut pas offrir.

**Aucune eau thermale n'est présentée comme un traitement.** Les stations sont décrites comme des lieux de détente et de récupération. Le filtre de sortie bloque diagnostic, prescription, promesse de résultat et prix garanti, sur chaque réponse et quelle que soit son origine. Cette retenue n'est pas juridique : c'est ce qui rend la filière crédible face à la Tunisie et au Maroc.

**Le prototype est fonctionnel et entièrement vérifiable.** Il fonctionne **sans aucune clé d'API** : le jury peut cloner le dépôt, lancer les 59 tests et construire ses propres parcours, hors ligne. Le site est disponible en français, en anglais et en arabe — y compris le parcours généré lui-même, ses justifications et ses mentions réglementaires. En arabe, la mise en page bascule de droite à gauche.

Vous trouverez ci-joint les trois pièces du dossier :

1. **Executive Summary** — fiche de présentation synthétique (3 pages)
2. **Preuve de concept** — démonstration technique, vidéo de 2 minutes, accès au prototype et au dépôt de code
3. **Business Case** — analyse de viabilité économique et impact sur le secteur touristique algérien

- **Prototype en ligne :** [URL]
- **Dépôt de code :** github.com/mashoudateam-prog/algeria-health-wellness
- **Vidéo de démonstration (2 min) :** [lien]

Nous nous tenons à votre disposition pour toute démonstration en direct ou tout complément d'information.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

**[Prénom NOM]**
Équipe Mashouda
mashouda.team@gmail.com
[téléphone]

---

## Version 2 — Envoi court *(si le formulaire de dépôt fait déjà le travail)*

**Objet :** Candidature Axe 02 — Algeria Health & Wellness

---

Madame, Monsieur,

Veuillez trouver ci-joint notre candidature au titre de l'**Axe 02 — Le Sur-Mesure**, pour le projet **Algeria Health & Wellness**, plateforme de construction personnalisée de séjours de remise en forme, de thermalisme et de bien-être en Algérie.

Le dossier comprend l'Executive Summary, la preuve de concept et le business case. Le prototype est fonctionnel et accessible à l'adresse [URL] ; le code est ouvert à l'examen du jury à l'adresse github.com/mashoudateam-prog/algeria-health-wellness.

Une particularité que nous souhaitons signaler : la plateforme fonctionne intégralement **sans clé d'API**, sur un moteur de règles déterministe. Le jury peut donc tout vérifier par lui-même, y compris hors ligne.

Nous restons à votre disposition pour une démonstration.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

**[Prénom NOM]**
Équipe Mashouda — mashouda.team@gmail.com

---

## Version 3 — Relance ou prise de contact préalable

**Objet :** Algeria Health & Wellness — démonstration disponible avant dépôt

---

Madame, Monsieur,

Dans la perspective du dépôt de notre candidature au titre de l'Axe 02, nous nous permettons de vous signaler que le prototype d'**Algeria Health & Wellness** est d'ores et déjà fonctionnel et consultable : [URL].

Une démonstration de trente secondes suffit à en saisir le principe — décrire un projet de séjour en une phrase, et voir le parcours se construire. Nous serions heureux de vous la présenter en direct, à votre convenance, avant ou après le dépôt du dossier.

Nous vous prions d'agréer, Madame, Monsieur, l'expression de nos salutations distinguées.

**[Prénom NOM]**
Équipe Mashouda — mashouda.team@gmail.com

---

## Avant d'envoyer — liste de contrôle

- [ ] L'URL de déploiement est renseignée et **testée depuis un autre appareil**, hors de votre réseau
- [ ] Le dépôt GitHub est accessible au jury *(s'il est privé, prévoir une invitation ou le passer en public)*
- [ ] La vidéo de 2 min est tournée, hébergée, et le lien est ouvert sans compte
- [ ] Les PDF ont été régénérés après la dernière modification des Markdown (`cd dossier && node build.cjs`)
- [ ] L'Executive Summary tient bien en **3 pages maximum** après conversion
- [ ] Les données de marché du Business Case ont été revérifiées à leur source (elles datent de février 2025 pour les arrivées, d'octobre 2023 pour le thermalisme)
- [ ] Le nom du destinataire, l'objet exact et les références de l'appel à candidatures sont conformes au règlement
- [ ] Vos nom, prénom et téléphone remplacent les crochets
- [ ] Le poids total des pièces jointes passe la limite de la messagerie du destinataire
