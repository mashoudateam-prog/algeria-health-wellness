/**
 * Sources de veille.
 *
 * Les flux ci-dessous ont été testés individuellement : chacun a répondu
 * en HTTP 200 avec des éléments exploitables au moment de l'intégration.
 * Plusieurs candidats notoires ont été écartés parce qu'ils ne servent
 * aucun flux (APS, El Watan, Liberté, Radio Algérie).
 *
 * Un flux peut disparaître du jour au lendemain : le collecteur enregistre
 * l'état de chaque source à chaque passage, et la page de modération le montre.
 * Vous saurez donc qu'une source est morte sans avoir à la surveiller.
 */

export interface FeedSource {
  id: string;
  label: string;
  url: string;
  /** Langue dominante, utile pour trier la file de modération. */
  lang: "fr" | "ar";
}

export const FEED_SOURCES: FeedSource[] = [
  { id: "algerie360", label: "Algérie 360", url: "https://www.algerie360.com/feed", lang: "fr" },
  { id: "algerie-eco", label: "Algérie Éco", url: "https://www.algerie-eco.com/feed", lang: "fr" },
  { id: "dia-algerie", label: "DIA Algérie", url: "https://dia-algerie.com/feed", lang: "fr" },
  { id: "elmoudjahid", label: "El Moudjahid", url: "https://www.elmoudjahid.dz/fr/feed", lang: "fr" },
  { id: "echorouk", label: "Echorouk Online", url: "https://www.echoroukonline.com/feed", lang: "ar" },
];

/**
 * Requêtes envoyées au moteur de recherche web, quand une clé est configurée.
 * Volontairement étroites : une requête trop large ramène toute l'actualité
 * nationale, que les filtres devront ensuite écarter à grands frais.
 */
export const SEARCH_QUERIES: string[] = [
  "nouveau centre de thalassothérapie Algérie",
  "ouverture station thermale Algérie",
  "festival gastronomie traditionnelle Algérie",
  "salon bien-être santé Algérie",
  "nouvelle clinique ouverture Algérie",
  "cure thermale saison Algérie",
];

/**
 * Vocabulaire de pertinence.
 *
 * Les flux suivis sont généralistes : sans ce filtre, la file de modération se
 * remplirait de politique et de football. Chaque terme porte un poids ; un
 * élément doit atteindre le seuil pour être seulement proposé.
 */
export const RELEVANCE_TERMS: Array<{ term: string; weight: number }> = [
  // Cœur du sujet — un seul de ces termes suffit presque
  { term: "thalasso", weight: 40 },
  { term: "therma", weight: 40 },
  { term: "hammam", weight: 25 },
  { term: "cure", weight: 22 },
  { term: "spa", weight: 25 },
  { term: "bien-etre", weight: 30 },
  { term: "bien etre", weight: 30 },
  { term: "remise en forme", weight: 30 },
  { term: "tourisme de sante", weight: 45 },
  { term: "tourisme medica", weight: 45 },

  // Santé et soins
  { term: "clinique", weight: 20 },
  { term: "sante", weight: 12 },
  { term: "medica", weight: 12 },
  { term: "hopita", weight: 12 },
  { term: "nutrition", weight: 20 },
  { term: "dietetique", weight: 22 },

  // Événements et gastronomie
  { term: "festival", weight: 18 },
  { term: "salon", weight: 15 },
  { term: "foire", weight: 15 },
  { term: "gastronomi", weight: 25 },
  { term: "culinaire", weight: 25 },
  { term: "patrimoine culinaire", weight: 32 },
  { term: "cuisine traditionnelle", weight: 32 },
  { term: "datte", weight: 15 },
  { term: "huile d'olive", weight: 18 },

  // Ouvertures et offres
  { term: "inauguration", weight: 22 },
  { term: "ouverture", weight: 14 },
  { term: "nouveau centre", weight: 25 },
  { term: "nouvelle structure", weight: 20 },
  { term: "promotion", weight: 10 },

  // Tourisme et hôtellerie
  { term: "tourisme", weight: 14 },
  { term: "hotel", weight: 10 },
  { term: "station balneaire", weight: 25 },
];

/** Un élément doit atteindre ce score pour entrer en file de modération. */
export const RELEVANCE_THRESHOLD = 30;

/**
 * Termes qui disqualifient immédiatement, quel que soit le score.
 * Les flux suivis couvrent toute l'actualité nationale : sans cette liste,
 * un article sur la « santé financière d'un club de football » passerait.
 */
export const EXCLUSION_TERMS: string[] = [
  "football",
  "match",
  "championnat",
  "mercato",
  "elections",
  "parlement",
  "ministre des affaires etrangeres",
  "guerre",
  "attentat",
  "proces",
  "condamne",
  "seisme",
  "accident",
  "deces",
  "bourse",
  "petrole",
  "gaz naturel",
];
