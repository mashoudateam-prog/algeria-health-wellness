/**
 * Fil d'actualité — modèle de domaine.
 *
 * Règle fondatrice, identique au reste de la plateforme : rien n'est publié
 * sans source vérifiable, et rien n'est publié sans validation humaine.
 * L'agent PROPOSE, une personne DISPOSE.
 */

export type NewsCategory =
  | "evenement"
  | "ouverture"
  | "promotion"
  | "festival"
  | "gastronomie"
  | "cure";

export type NewsStatus = "propose" | "publie" | "rejete";

/** D'où vient l'information. Affiché au lecteur. */
export type NewsOrigin = "rss" | "recherche" | "partenaire";

/** Élément brut, tel que sorti d'un collecteur, avant toute interprétation. */
export interface RawItem {
  title: string;
  text: string;
  url: string;
  sourceName: string;
  origin: NewsOrigin;
  /** Date de publication déclarée par la source, si elle en donne une. */
  publishedAt?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  /** Code wilaya déduit, ou null si le lieu n'a pas pu être établi. */
  wilayaCode: string | null;
  locationLabel: string;
  /** Date de l'événement. Null pour une ouverture ou une information sans date. */
  startsOn: string | null;
  endsOn: string | null;
  /** Obligatoire. Un élément sans source vérifiable est rejeté d'office. */
  sourceUrl: string;
  sourceName: string;
  origin: NewsOrigin;
  collectedAt: string;
  status: NewsStatus;
  /** Score de pertinence calculé, de 0 à 100. Aide au tri de la modération. */
  relevance: number;
  /** Observations de la chaîne de traitement, lisibles par un modérateur. */
  notes: string[];
  demo?: boolean;
}

export const NEWS_CATEGORY_LABEL: Record<NewsCategory, string> = {
  evenement: "Événement",
  ouverture: "Nouvelle adresse",
  promotion: "Offre",
  festival: "Festival",
  gastronomie: "Gastronomie",
  cure: "Cure et thermalisme",
};

export const NEWS_ORIGIN_LABEL: Record<NewsOrigin, string> = {
  rss: "Presse",
  recherche: "Recherche web",
  partenaire: "Partenaire",
};

/** Résultat d'un passage de filtres déterministes. */
export interface GateResult {
  accepted: boolean;
  reasons: string[];
}
