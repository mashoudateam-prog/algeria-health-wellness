/**
 * Modèle de domaine — Algeria Health & Wellness
 *
 * Règle transverse : tout objet issu d'un jeu de démonstration porte `demo: true`.
 * L'interface a l'obligation d'afficher un badge DÉMO pour ces objets, afin qu'aucun
 * établissement, praticien, prix ou disponibilité fictif ne puisse être pris pour réel.
 */

/* ------------------------------------------------------------------ */
/* Objectifs de santé                                                  */
/* ------------------------------------------------------------------ */

export type GoalId =
  | "soins"
  | "dentaire"
  | "esthetique"
  | "forme"
  | "detente"
  | "thermalisme"
  | "nutrition"
  | "prevention"
  | "mental"
  | "sport"
  | "avis"
  | "sejour";

export type GoalFamily = "medical" | "bien-etre" | "forme" | "service";

export interface HealthGoal {
  id: GoalId;
  label: string;
  short: string;
  emoji: string;
  family: GoalFamily;
  /** Termes déclencheurs pour la classification d'intention (minuscules, sans accent). */
  keywords: string[];
  /** Types d'établissements pertinents pour cet objectif. */
  facilityKinds: FacilityKind[];
  /** Un objectif médical impose le rappel « avis professionnel requis ». */
  requiresProfessional: boolean;
}

/* ------------------------------------------------------------------ */
/* Géographie et destinations                                          */
/* ------------------------------------------------------------------ */

export interface Wilaya {
  code: string;
  name: string;
  lon: number;
  lat: number;
  region: Region;
}

export type Region = "littoral" | "hauts-plateaux" | "sud" | "grand-sud";

export interface Photo {
  url: string;
  alt: string;
  credit: string;
  /** `demo` = photographie de placement, à remplacer par un visuel sous licence. */
  source: "demo" | "licencie";
}

export interface DestinationEditorial {
  offreMedicale: string;
  specialites: string[];
  bienEtre: string;
  hebergement: string;
  accessibilite: string;
  transport: string;
  gastronomie: string;
  recuperation: string;
  activites: string[];
  patrimoine: string;
}

export interface Destination {
  slug: string;
  name: string;
  wilayaCode: string;
  region: Region;
  /** Titre éditorial, ex. « Santé entre Méditerranée et patrimoine ». */
  tagline: string;
  intro: string;
  lon: number;
  lat: number;
  /** Objectifs pour lesquels la destination est particulièrement pertinente. */
  strengths: GoalId[];
  bestFor: string[];
  editorial: DestinationEditorial;
  photo: Photo;
}

/* ------------------------------------------------------------------ */
/* Établissements et professionnels                                    */
/* ------------------------------------------------------------------ */

export type FacilityKind =
  | "clinique"
  | "hopital"
  | "dentaire"
  | "reeducation"
  | "thermal"
  | "spa"
  | "forme"
  | "laboratoire"
  | "imagerie"
  | "nutrition"
  | "hebergement";

export type VerificationStatus = "verifie" | "en-cours" | "declaratif";

export interface Verification {
  status: VerificationStatus;
  /** ISO date de la dernière vérification, ou null si jamais vérifié. */
  checkedAt: string | null;
  /** Ce qui a été contrôlé. Jamais de certification inventée. */
  checks: string[];
}

export interface Facility {
  id: string;
  slug: string;
  name: string;
  kind: FacilityKind;
  destinationSlug: string;
  wilayaCode: string;
  summary: string;
  specialties: string[];
  languages: string[];
  /** Services d'accompagnement : navette, interprète, chambre accompagnant… */
  services: string[];
  accessibility: string[];
  internationalPatients: boolean;
  /** 1 = accessible, 2 = intermédiaire, 3 = premium. Indicatif, jamais un prix. */
  priceTier: 1 | 2 | 3;
  verification: Verification;
  demo: boolean;
  photo?: Photo;
}

export interface Professional {
  id: string;
  slug: string;
  name: string;
  specialty: string;
  facilityId: string;
  languages: string[];
  experienceYears: number;
  acceptsSecondOpinion: boolean;
  acceptsInternational: boolean;
  verification: Verification;
  demo: boolean;
}

/* ------------------------------------------------------------------ */
/* Séjours bien-être                                                   */
/* ------------------------------------------------------------------ */

export type Intensity = "repos" | "douce" | "moderee" | "soutenue";

export interface Retreat {
  slug: string;
  name: string;
  claim: string;
  days: number;
  destinationSlug: string;
  intensity: Intensity;
  goals: GoalId[];
  includes: string[];
  rhythm: string[];
  /** Fourchette indicative en DZD, jamais présentée comme un prix garanti. */
  estimateMin: number;
  estimateMax: number;
  demo: boolean;
}

/* ------------------------------------------------------------------ */
/* Health Journey                                                      */
/* ------------------------------------------------------------------ */

export type Origin = "algerie" | "etranger";

export interface JourneyBrief {
  rawText: string;
  goals: GoalId[];
  durationDays: number;
  travellers: number;
  origin: Origin;
  destinationSlug: string | null;
  budgetTier: 1 | 2 | 3;
  languages: string[];
  flags: {
    /** Un objectif médical est présent : un avis professionnel est nécessaire. */
    needsProfessionalOpinion: boolean;
    /** Formulation évoquant l'urgence : la plateforme redirige vers les secours. */
    mentionsUrgency: boolean;
    /** Une période de récupération est à respecter dans le planning. */
    hasRecovery: boolean;
  };
}

export type StepKind =
  | "soin"
  | "examen"
  | "recuperation"
  | "bien-etre"
  | "activite"
  | "nutrition"
  | "logistique"
  | "repos";

export interface JourneyStep {
  id: string;
  day: number;
  time: string;
  kind: StepKind;
  title: string;
  detail: string;
  facilityId?: string;
  intensity: Intensity;
}

export interface MatchReason {
  label: string;
  detail: string;
}

export interface FacilityMatch {
  facilityId: string;
  score: number;
  reasons: MatchReason[];
}

export interface QuoteLine {
  label: string;
  category: "soins" | "honoraires" | "examens" | "hebergement" | "transport" | "conciergerie" | "options";
  min: number;
  max: number;
  note?: string;
}

export interface Quote {
  currency: "DZD";
  lines: QuoteLine[];
  totalMin: number;
  totalMax: number;
  /** Toujours une estimation. « Prix garanti » est réservé à un devis professionnel signé. */
  kind: "estimation";
  disclaimer: string;
}

export type JourneyPhase = "discover" | "assess" | "plan" | "book" | "experience" | "follow-up";

export interface JourneyPlan {
  id: string;
  createdAt: string;
  brief: JourneyBrief;
  title: string;
  summary: string;
  destination: Destination;
  steps: JourneyStep[];
  matches: FacilityMatch[];
  quote: Quote;
  /** Points de vigilance issus de règles validées, pas d'une invention du modèle. */
  cautions: string[];
  nextActions: string[];
  disclaimer: string;
  /** Traçabilité : parcours produit par le moteur de règles ou par un LLM encadré. */
  generatedBy: "regles" | "llm";
}

/* ------------------------------------------------------------------ */
/* Health Passport et coffre documentaire                              */
/* ------------------------------------------------------------------ */

export type DocumentCategory =
  | "analyses"
  | "imagerie"
  | "ordonnances"
  | "comptes-rendus"
  | "factures"
  | "administratif";

export interface DocumentShare {
  id: string;
  recipient: string;
  recipientKind: "medecin" | "clinique" | "laboratoire";
  grantedAt: string;
  expiresAt: string;
  revokedAt: string | null;
}

export interface VaultDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  sizeKb: number;
  addedAt: string;
  /** Signalé par l'organiseur documentaire quand une pièce paraît incomplète. */
  needsAttention: string | null;
  shares: DocumentShare[];
  demo: boolean;
}

export type AuditAction =
  | "document.consulte"
  | "document.partage"
  | "document.revoque"
  | "document.ajoute"
  | "parcours.genere"
  | "concierge.message";

export interface AuditEntry {
  id: string;
  at: string;
  actor: string;
  action: AuditAction;
  target: string;
  detail: string;
}

/* ------------------------------------------------------------------ */
/* Conversation                                                        */
/* ------------------------------------------------------------------ */

export interface ConciergeMessage {
  role: "patient" | "concierge";
  content: string;
  /** Rappel affiché sous la réponse lorsque le sujet touche au médical. */
  notice?: string;
  suggestions?: string[];
}
