import type { Locale } from "@/lib/i18n/config";

/**
 * Messages d'erreur des API, dans la langue du visiteur.
 *
 * Ces phrases sont affichées telles quelles par le constructeur de parcours et
 * par le concierge : les laisser en français revenait à interrompre en
 * français un visiteur qui lisait le site en anglais depuis dix minutes.
 *
 * Le repli est le français, comme partout ailleurs.
 */

export interface ApiErrors {
  /** Corps de requête illisible ou mal formé. */
  unreadableBody: string;
  fieldMissing: (field: string) => string;
  fieldInvalid: (field: string) => string;
  fieldTooShort: (field: string) => string;
  fieldTooLong: (field: string) => string;
  valueNotAllowed: (field: string) => string;

  tooManyJourneys: string;
  tooManyMessages: string;
  tooManySubmissions: string;
  tooManyRequests: string;
  tooManyCollections: string;

  journeyFailed: string;
  conciergeFailed: string;
  submissionFailed: string;
  decisionFailed: string;
  collectionFailed: string;
  notFound: string;

  goalOrProjectRequired: string;

  linkScheme: string;
  unknownWilaya: string;
  unknownCategory: string;
  badDateFormat: string;
  duplicateLink: string;
  unknownDecision: string;

  badCredentials: string;
  accountExists: string;
  accountFailed: string;
}

const FR: ApiErrors = {
  unreadableBody: "Corps de requête illisible.",
  fieldMissing: (field) => `Champ « ${field} » manquant.`,
  fieldInvalid: (field) => `Champ « ${field} » invalide.`,
  fieldTooShort: (field) => `Champ « ${field} » trop court.`,
  fieldTooLong: (field) => `Champ « ${field} » trop long.`,
  valueNotAllowed: (field) => `Valeur non reconnue dans « ${field} ».`,

  tooManyJourneys: "Trop de demandes successives. Réessayez dans un instant.",
  tooManyMessages: "Trop de messages en peu de temps. Reprenez dans un instant.",
  tooManySubmissions: "Trop de soumissions successives. Réessayez plus tard.",
  tooManyRequests: "Trop de requêtes. Réessayez dans un instant.",
  tooManyCollections: "Trop de passages demandés. Réessayez dans un instant.",

  journeyFailed: "Le parcours n'a pas pu être construit. Réessayez.",
  conciergeFailed: "Le concierge n'a pas pu répondre. Réessayez, ou demandez un conseiller.",
  submissionFailed: "La soumission n'a pas pu être enregistrée.",
  decisionFailed: "La décision n'a pas pu être enregistrée.",
  collectionFailed: "La collecte a échoué.",
  notFound: "Élément introuvable.",

  goalOrProjectRequired: "Indiquez au moins un objectif ou décrivez votre projet.",

  linkScheme: "Le lien doit commencer par http:// ou https://",
  unknownWilaya: "Wilaya inconnue.",
  unknownCategory: "Catégorie non reconnue.",
  badDateFormat: "La date doit être au format AAAA-MM-JJ.",
  duplicateLink: "Ce lien a déjà été soumis.",
  unknownDecision: "Décision non reconnue.",

  badCredentials: "Adresse ou mot de passe incorrect.",
  accountExists: "Un compte existe déjà pour cette adresse.",
  accountFailed: "L'opération sur le compte a échoué. Réessayez.",
};

const EN: ApiErrors = {
  unreadableBody: "Request body could not be read.",
  fieldMissing: (field) => `Field “${field}” is missing.`,
  fieldInvalid: (field) => `Field “${field}” is invalid.`,
  fieldTooShort: (field) => `Field “${field}” is too short.`,
  fieldTooLong: (field) => `Field “${field}” is too long.`,
  valueNotAllowed: (field) => `Unrecognised value in “${field}”.`,

  tooManyJourneys: "Too many requests in a row. Try again in a moment.",
  tooManyMessages: "Too many messages in a short time. Pick up again in a moment.",
  tooManySubmissions: "Too many submissions in a row. Try again later.",
  tooManyRequests: "Too many requests. Try again in a moment.",
  tooManyCollections: "Too many collection runs requested. Try again in a moment.",

  journeyFailed: "The journey could not be built. Please try again.",
  conciergeFailed: "The concierge could not answer. Try again, or ask for an adviser.",
  submissionFailed: "The submission could not be recorded.",
  decisionFailed: "The decision could not be recorded.",
  collectionFailed: "The collection run failed.",
  notFound: "Item not found.",

  goalOrProjectRequired: "Give at least one goal, or describe your plan.",

  linkScheme: "The link must start with http:// or https://",
  unknownWilaya: "Unknown wilaya.",
  unknownCategory: "Unrecognised category.",
  badDateFormat: "The date must be in YYYY-MM-DD format.",
  duplicateLink: "This link has already been submitted.",
  unknownDecision: "Unrecognised decision.",

  badCredentials: "Incorrect email address or password.",
  accountExists: "An account already exists for this address.",
  accountFailed: "The account operation failed. Please try again.",
};

const TABLE: Partial<Record<Locale, ApiErrors>> = { fr: FR, en: EN };

export function apiErrors(locale: Locale = "fr"): ApiErrors {
  return TABLE[locale] ?? FR;
}

/**
 * Langue d'une requête d'API.
 *
 * `/api` est hors du matcher du middleware : l'en-tête `x-locale` n'y arrive
 * pas. La langue est donc lue du corps quand la route en reçoit un, et de
 * `Accept-Language` sinon — pour qu'une erreur de validation, qui survient
 * avant toute lecture du corps, soit malgré tout dans la bonne langue.
 */
export function requestLocale(request: { headers: { get(name: string): string | null } }): Locale {
  const accept = request.headers.get("accept-language") ?? "";
  return /\ben\b/i.test(accept.split(",")[0] ?? "") ? "en" : "fr";
}
