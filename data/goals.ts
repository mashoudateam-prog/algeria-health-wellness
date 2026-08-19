import type { GoalId, HealthGoal } from "@/types/domain";

/**
 * Les douze objectifs d'entrée. Le produit ne commence jamais par
 * « choisissez une clinique » mais par « que souhaitez-vous améliorer ? ».
 *
 * `keywords` est écrit en minuscules sans accent : le classifieur d'intention
 * normalise le texte de l'utilisateur avant comparaison.
 */
export const GOALS: HealthGoal[] = [
  {
    id: "soins",
    label: "Me soigner",
    short: "Consultation, examens, prise en charge",
    emoji: "🩺",
    family: "medical",
    keywords: [
      "soigner", "soin", "medecin", "docteur", "consultation", "maladie", "traitement",
      "operation", "chirurgie", "intervention", "hopital", "clinique", "specialiste",
      "douleur", "mal", "symptome", "cardio", "coeur", "genou", "dos", "ophtalmo", "yeux",
    ],
    facilityKinds: ["clinique", "hopital", "laboratoire", "imagerie"],
    requiresProfessional: true,
  },
  {
    id: "dentaire",
    label: "Dentaire",
    short: "Soins, prothèses, esthétique du sourire",
    emoji: "🦷",
    family: "medical",
    keywords: [
      "dent", "dents", "dentaire", "dentiste", "implant", "couronne", "prothese",
      "orthodontie", "appareil dentaire", "blanchiment", "carie", "gencive", "facette",
    ],
    facilityKinds: ["dentaire", "clinique", "imagerie"],
    requiresProfessional: true,
  },
  {
    id: "esthetique",
    label: "Esthétique",
    short: "Dermatologie et médecine esthétique",
    emoji: "✨",
    family: "medical",
    keywords: [
      "esthetique", "esthetiques", "peau", "dermato", "dermatologie", "cheveux", "greffe",
      "laser", "rides", "silhouette", "cicatrice", "acne",
    ],
    facilityKinds: ["clinique", "spa"],
    requiresProfessional: true,
  },
  {
    id: "forme",
    label: "Me remettre en forme",
    short: "Reprise progressive et encadrée",
    emoji: "💪",
    family: "forme",
    keywords: [
      "forme", "remise en forme", "remettre en forme", "condition physique", "reprendre",
      "bouger", "muscler", "musculation", "tonus", "energie", "endurance", "sedentaire",
      "perdre du poids", "maigrir", "poids", "silhouette", "ventre",
    ],
    facilityKinds: ["forme", "reeducation", "nutrition"],
    requiresProfessional: false,
  },
  {
    id: "detente",
    label: "Me détendre",
    short: "Spa, repos, relâchement",
    emoji: "🧘",
    family: "bien-etre",
    keywords: [
      "detendre", "detente", "relaxer", "relaxation", "repos", "reposer", "spa", "massage",
      "calme", "souffler", "deconnecter", "pause", "coupure", "hammam",
    ],
    facilityKinds: ["spa", "thermal", "hebergement"],
    requiresProfessional: false,
  },
  {
    id: "thermalisme",
    label: "Thermalisme",
    short: "Stations thermales et cures de bien-être",
    emoji: "♨️",
    family: "bien-etre",
    keywords: ["thermal", "thermalisme", "thermale", "cure", "source chaude", "eaux", "station thermale"],
    facilityKinds: ["thermal", "spa"],
    requiresProfessional: false,
  },
  {
    id: "nutrition",
    label: "Nutrition",
    short: "Bilan et accompagnement alimentaire",
    emoji: "🥗",
    family: "forme",
    keywords: [
      "nutrition", "alimentation", "manger", "dietetique", "dieteticien", "nutritionniste",
      "regime", "equilibre alimentaire", "detox", "digestion",
    ],
    facilityKinds: ["nutrition", "clinique", "forme"],
    requiresProfessional: false,
  },
  {
    id: "prevention",
    label: "Prévention",
    short: "Bilan de santé complet",
    emoji: "❤️",
    family: "medical",
    keywords: [
      "prevention", "bilan", "check up", "checkup", "controle", "depistage", "analyses",
      "prise de sang", "verifier", "faire le point", "bilan general", "bilan complet",
    ],
    facilityKinds: ["clinique", "laboratoire", "imagerie"],
    requiresProfessional: true,
  },
  {
    id: "mental",
    label: "Bien-être mental",
    short: "Sommeil, charge mentale, sérénité",
    emoji: "🧠",
    family: "bien-etre",
    keywords: [
      "mental", "stress", "anxiete", "sommeil", "dormir", "insomnie", "burn out", "burnout",
      "fatigue", "epuise", "charge mentale", "serenite", "meditation", "respiration",
    ],
    facilityKinds: ["spa", "hebergement", "clinique"],
    requiresProfessional: false,
  },
  {
    id: "sport",
    label: "Sport & récupération",
    short: "Performance et retour à l'effort",
    emoji: "🏃",
    family: "forme",
    keywords: [
      "sport", "sportif", "performance", "recuperation", "recuperer", "kine",
      "kinesitherapie", "reeducation", "blessure", "entrainement", "athlete", "course",
      "preparation physique",
    ],
    facilityKinds: ["reeducation", "forme", "spa"],
    requiresProfessional: false,
  },
  {
    id: "avis",
    label: "Demander un avis",
    short: "Second avis sur un dossier existant",
    emoji: "👨‍⚕️",
    family: "service",
    keywords: [
      "avis", "second avis", "deuxieme avis", "second opinion", "relire", "dossier",
      "compte rendu", "resultat", "diagnostic pose", "confirmer",
    ],
    facilityKinds: ["clinique", "hopital"],
    requiresProfessional: true,
  },
  {
    id: "sejour",
    label: "Organiser un séjour santé",
    short: "Coordination complète du voyage",
    emoji: "✈️",
    family: "service",
    keywords: [
      "sejour", "voyage", "venir", "organiser", "planifier", "vacances", "semaine",
      "jours", "programme", "itineraire", "hebergement", "hotel", "transport", "vol",
    ],
    facilityKinds: ["hebergement", "spa", "clinique"],
    requiresProfessional: false,
  },
];

export const GOAL_BY_ID = new Map<GoalId, HealthGoal>(GOALS.map((g) => [g.id, g]));

export function goalLabel(id: GoalId): string {
  return GOAL_BY_ID.get(id)?.label ?? id;
}
