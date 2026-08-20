import type { GoalId } from "@/types/domain";

/**
 * Vocabulaire anglais du classifieur d'intention.
 *
 * Le moteur reste le même : ces termes viennent s'ajouter aux termes français
 * sur le même objectif, et sont normalisés de la même façon (minuscules, sans
 * accent). Un visiteur peut donc écrire sa phrase en anglais, en français, ou
 * mélanger les deux — cas fréquent dans la diaspora.
 *
 * Les termes courts et ambigus sont écartés volontairement : « care » seul
 * apparaît dans trop de phrases pour discriminer un objectif.
 */
/**
 * Exonymes et graphies sans accent.
 *
 * Un visiteur anglophone écrit « Algiers », pas « Alger », et tape rarement
 * les accents. La reconnaissance reste sur mot entier : ces alias passent par
 * le même test de bornes que les noms officiels.
 */
export const DESTINATION_ALIASES: Record<string, string[]> = {
  alger: ["algiers", "alger"],
  oran: ["oran"],
  constantine: ["constantine"],
  tlemcen: ["tlemcen"],
  bejaia: ["bejaia", "bougie"],
  annaba: ["annaba", "bone"],
  biskra: ["biskra"],
  ghardaia: ["ghardaia", "mzab", "m zab"],
};

export const EN_GOAL_KEYWORDS: Record<GoalId, string[]> = {
  soins: [
    "treatment", "surgery", "operation", "doctor", "physician", "consultation",
    "specialist", "hospital", "clinic", "illness", "pain", "symptom", "heart",
    "cardiac", "knee", "back pain", "eyes", "eyesight", "medical care",
  ],
  dentaire: [
    "dental", "dentist", "teeth", "tooth", "implant", "crown", "denture",
    "orthodontics", "braces", "whitening", "cavity", "gum", "veneer",
  ],
  esthetique: [
    "aesthetic", "cosmetic", "skin", "dermatology", "dermatologist", "hair",
    "hair transplant", "laser", "wrinkles", "scar", "acne",
  ],
  forme: [
    "get in shape", "back in shape", "fitness", "fit", "lose weight",
    "weight loss", "slim down", "stamina", "endurance", "energy", "sedentary",
    "move more", "tone up",
  ],
  detente: [
    "relax", "relaxation", "unwind", "rest", "spa", "massage", "quiet",
    "switch off", "disconnect", "break", "hammam", "chill",
  ],
  thermalisme: [
    "thermal", "thermal spa", "hot spring", "hot springs", "spa cure",
    "balneotherapy", "mineral water",
  ],
  nutrition: [
    "nutrition", "nutritionist", "diet", "dietician", "dietitian", "eating",
    "food plan", "detox", "digestion", "balanced diet",
  ],
  prevention: [
    "prevention", "check up", "checkup", "check-up", "screening",
    "blood test", "blood tests", "health check", "full assessment", "lab tests",
  ],
  mental: [
    "mental", "stress", "anxiety", "sleep", "insomnia", "burn out", "burnout",
    "exhausted", "exhaustion", "mental load", "meditation", "breathing",
    "peace of mind",
  ],
  sport: [
    "sport", "sports", "athlete", "performance", "recovery", "physio",
    "physiotherapy", "rehabilitation", "injury", "training camp", "running",
    "conditioning",
  ],
  entrainement: [
    "train", "training", "workout", "work out", "gym", "weights",
    "weight training", "bodybuilding", "crossfit", "dumbbell", "treadmill",
    "swimming pool", "swim", "swimming", "jogging", "run", "cycling", "bike",
    "yoga", "pilates", "boxing", "martial arts", "keep my routine",
    "keep training", "stay in shape", "coach", "strength and conditioning",
  ],
  avis: [
    "second opinion", "opinion", "review my file", "medical file", "report",
    "test results", "confirm a diagnosis", "diagnosis",
  ],
  sejour: [
    "stay", "trip", "travel", "visit", "holiday", "holidays", "vacation",
    "itinerary", "programme", "program", "accommodation", "hotel", "transport",
    "flight",
  ],
};
