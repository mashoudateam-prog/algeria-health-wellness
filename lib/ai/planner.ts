import { DESTINATIONS, DESTINATION_BY_SLUG } from "@/data/destinations";
import { FACILITY_BY_ID } from "@/data/facilities";
import { heritageNear } from "@/data/heritage";
import { GOAL_BY_ID } from "@/data/goals";
import { evaluateCompatibility } from "@/lib/rules/compatibility";
import type {
  Destination,
  GoalId,
  Intensity,
  JourneyBrief,
  JourneyPlan,
  JourneyStep,
  StepKind,
} from "@/types/domain";
import { MEDICAL_DISCLAIMER } from "./guardrails";
import { classifyIntent } from "./intent";
import { matchFacilities } from "./matching";
import { estimateQuote } from "./quote";

/**
 * JourneyPlanner — construit un parcours jour par jour à partir d'une intention.
 *
 * Entièrement déterministe. C'est volontaire : un planning de séjour de santé
 * doit être reproductible, auditable et explicable ligne à ligne. Un LLM peut
 * reformuler la présentation d'un parcours, il ne fabrique pas sa structure.
 */

const TIMES = ["08:30", "10:30", "14:00", "16:30", "18:30"];

/* ------------------------------------------------------------------ */
/* Ordonnanceur                                                        */
/* ------------------------------------------------------------------ */

class Scheduler {
  private readonly used = new Map<number, Set<string>>();
  private readonly totalDays: number;
  readonly careDays = new Set<number>();
  readonly steps: JourneyStep[] = [];
  private counter = 0;

  constructor(totalDays: number) {
    this.totalDays = totalDays;
  }

  /** Réserve un créneau. Retourne false si la journée est pleine. */
  place(input: {
    day: number;
    kind: StepKind;
    title: string;
    detail: string;
    intensity: Intensity;
    facilityId?: string;
    preferAfternoon?: boolean;
  }): boolean {
    const day = Math.min(this.totalDays, Math.max(1, input.day));
    const taken = this.used.get(day) ?? new Set<string>();

    const order = input.preferAfternoon ? [2, 3, 4, 1, 0] : [0, 1, 2, 3, 4];
    const slot = order.map((i) => TIMES[i]).find((time) => !taken.has(time));
    if (!slot) return false;

    taken.add(slot);
    this.used.set(day, taken);
    if (input.kind === "soin") this.careDays.add(day);

    this.steps.push({
      id: `step-${++this.counter}`,
      day,
      time: slot,
      kind: input.kind,
      title: input.title,
      detail: input.detail,
      intensity: input.intensity,
      facilityId: input.facilityId,
    });
    return true;
  }

  load(day: number): number {
    return this.used.get(day)?.size ?? 0;
  }

  /** Vrai si un acte a eu lieu dans les `window` jours précédant `day`. */
  withinCareWindow(day: number, window = 2): boolean {
    for (const careDay of this.careDays) {
      if (day > careDay && day - careDay < window) return true;
    }
    return false;
  }

  /**
   * Première journée libre à partir de `from`, respectant la fenêtre post-acte.
   *
   * `maxDay` borne la recherche. Les activités de confort l'utilisent pour
   * s'arrêter la veille du départ : une séance de spa programmée le jour du
   * retour arrive après le transfert, donc trop tard pour être vécue.
   */
  findLightDay(
    from: number,
    options: { avoidCareWindow?: boolean; maxDay?: number } = {},
  ): number | null {
    const last = Math.min(options.maxDay ?? this.totalDays, this.totalDays);
    for (let day = from; day <= last; day++) {
      if (this.load(day) >= 3) continue;
      if (this.careDays.has(day)) continue;
      if (options.avoidCareWindow && this.withinCareWindow(day)) continue;
      return day;
    }
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Choix de la destination                                             */
/* ------------------------------------------------------------------ */

const AIRPORT_DESTINATIONS = new Set(["alger", "oran", "constantine", "annaba", "tlemcen"]);

function pickDestination(brief: JourneyBrief): Destination {
  if (brief.destinationSlug) {
    const chosen = DESTINATION_BY_SLUG.get(brief.destinationSlug);
    if (chosen) return chosen;
  }

  const scored = DESTINATIONS.map((destination) => {
    let score = 0;
    for (const goal of brief.goals) {
      if (destination.strengths.includes(goal)) score += 10;
    }
    // Une arrivée internationale privilégie une ville avec accès aérien direct.
    if (brief.origin === "etranger" && AIRPORT_DESTINATIONS.has(destination.slug)) score += 6;
    // Une récupération privilégie le calme aux hauts plateaux et au Sud.
    if (brief.flags.hasRecovery && destination.region !== "littoral") score += 3;
    // Un séjour court évite les longs trajets intérieurs.
    if (brief.durationDays <= 4 && AIRPORT_DESTINATIONS.has(destination.slug)) score += 4;
    return { destination, score };
  });

  scored.sort((a, b) => b.score - a.score || a.destination.name.localeCompare(b.destination.name));
  return scored[0].destination;
}

/* ------------------------------------------------------------------ */
/* Trames de soin par objectif                                         */
/* ------------------------------------------------------------------ */

interface CareTemplate {
  offset: number;
  kind: StepKind;
  title: string;
  detail: string;
  intensity: Intensity;
}

const CARE_TEMPLATES: Partial<Record<GoalId, CareTemplate[]>> = {
  prevention: [
    {
      offset: 0,
      kind: "examen",
      title: "Bilan de santé — prélèvements",
      detail: "Prélèvements à jeun en début de matinée, puis matinée libre. Comptez une heure sur place.",
      intensity: "repos",
    },
    {
      offset: 2,
      kind: "soin",
      title: "Restitution du bilan avec le médecin",
      detail:
        "Le médecin vous remet et commente vos résultats. Préparez vos questions en amont : le concierge peut vous aider à les formuler.",
      intensity: "repos",
    },
  ],
  soins: [
    {
      offset: 0,
      kind: "soin",
      title: "Consultation spécialisée",
      detail: "Premier échange avec le praticien. Apportez vos documents médicaux via votre Health Passport.",
      intensity: "repos",
    },
    {
      offset: 1,
      kind: "examen",
      title: "Examens complémentaires",
      detail: "Réalisés seulement s'ils sont prescrits lors de la consultation. Créneau réservé par précaution.",
      intensity: "repos",
    },
    {
      offset: 3,
      kind: "soin",
      title: "Consultation de synthèse",
      detail: "Reprise des résultats et définition de la suite avec le praticien.",
      intensity: "repos",
    },
  ],
  dentaire: [
    {
      offset: 0,
      kind: "soin",
      title: "Consultation dentaire et plan de traitement",
      detail: "Examen, radiographie si nécessaire, et devis écrit avant tout acte.",
      intensity: "repos",
    },
    {
      offset: 2,
      kind: "soin",
      title: "Première séance de soins",
      detail: "Séance principale du séjour. Prévoyez une fin de journée calme.",
      intensity: "repos",
    },
    {
      offset: 4,
      kind: "soin",
      title: "Seconde séance et contrôle",
      detail: "Finalisation et vérification. Un compte rendu vous est remis pour votre suivi au retour.",
      intensity: "repos",
    },
  ],
  esthetique: [
    {
      offset: 0,
      kind: "soin",
      title: "Consultation dermatologique",
      detail: "Évaluation, explication des options et délai de réflexion avant toute décision.",
      intensity: "repos",
    },
    {
      offset: 2,
      kind: "soin",
      title: "Séance programmée",
      detail: "Réalisée uniquement après accord écrit et délai de réflexion respecté.",
      intensity: "repos",
    },
  ],
  avis: [
    {
      offset: 0,
      kind: "logistique",
      title: "Dépôt du dossier pour second avis",
      detail: "Vérification des pièces avec le coordinateur, puis transmission au professionnel habilité.",
      intensity: "repos",
    },
    {
      offset: 3,
      kind: "soin",
      title: "Restitution du second avis",
      detail: "Entretien avec le professionnel et synthèse écrite remise à l'issue.",
      intensity: "repos",
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Construction du parcours                                            */
/* ------------------------------------------------------------------ */

export function buildJourneyFromBrief(brief: JourneyBrief): JourneyPlan {
  const destination = pickDestination(brief);
  const matches = matchFacilities(brief, { destinationSlug: destination.slug, limit: 6 });
  const total = brief.durationDays;
  // Le jour du départ est réservé au bilan et au transfert : aucune séance de
  // confort ne peut y être placée.
  const lastLeisureDay = Math.max(1, total - 1);
  const scheduler = new Scheduler(total);

  const facilityFor = (kinds: string[]): string | undefined =>
    matches.find((match) => {
      const facility = FACILITY_BY_ID.get(match.facilityId);
      return facility ? kinds.includes(facility.kind) : false;
    })?.facilityId;

  /* --- Arrivée ---------------------------------------------------- */
  scheduler.place({
    day: 1,
    kind: "logistique",
    title: brief.origin === "etranger" ? "Arrivée et transfert" : "Arrivée et installation",
    detail:
      brief.origin === "etranger"
        ? `Accueil à l'arrivée et transfert vers votre hébergement à ${destination.name}. Aucun rendez-vous n'est programmé ce jour.`
        : `Installation à ${destination.name} et prise de repères. Journée volontairement libre.`,
    intensity: "repos",
    facilityId: facilityFor(["hebergement"]),
  });

  if (total > 2) {
    scheduler.place({
      day: 1,
      kind: "repos",
      title: "Fin de journée libre",
      detail: destination.editorial.recuperation.split(".")[0] + ".",
      intensity: "repos",
      preferAfternoon: true,
    });
  }

  /* --- Actes médicaux --------------------------------------------- */
  const medicalGoals = brief.goals.filter((goal) => CARE_TEMPLATES[goal]);
  let anchor = 2;

  for (const goal of medicalGoals) {
    const template = CARE_TEMPLATES[goal]!;
    const kinds = GOAL_BY_ID.get(goal)?.facilityKinds ?? [];
    for (const entry of template) {
      const day = anchor + entry.offset;
      // Un acte ne se programme jamais le jour du départ.
      if (day >= total && total > 2) continue;
      scheduler.place({
        day,
        kind: entry.kind,
        title: entry.title,
        detail: entry.detail,
        intensity: entry.intensity,
        facilityId: facilityFor(kinds as string[]),
      });
    }
    anchor += 1;
  }

  /* --- Récupération après acte ------------------------------------ */
  for (const careDay of [...scheduler.careDays].sort((a, b) => a - b)) {
    const next = careDay + 1;
    if (next >= total) continue;
    if (scheduler.careDays.has(next)) continue;
    scheduler.place({
      day: next,
      kind: "recuperation",
      title: "Journée de récupération",
      detail:
        "Rythme volontairement allégé au lendemain d'un acte : marche courte, repos et hydratation. Ajustez selon les consignes de votre praticien.",
      intensity: "repos",
    });
  }

  /* --- Remise en forme et sport ------------------------------------ */
  if (brief.goals.some((g) => g === "forme" || g === "sport")) {
    const facilityId = facilityFor(["forme", "reeducation"]);
    const ramp: Array<{ title: string; detail: string; intensity: Intensity }> = [
      {
        title: "Évaluation de condition physique",
        detail: "Point de départ mesuré : mobilité, endurance, force. Sert de référence pour la progression du séjour.",
        intensity: "douce",
      },
      {
        title: "Séance encadrée — reprise douce",
        detail: "Mobilité et cardio léger, sans recherche de performance.",
        intensity: "douce",
      },
      {
        title: "Séance encadrée — renforcement",
        detail: "Montée progressive de la charge, adaptée à l'évaluation initiale.",
        intensity: "moderee",
      },
      {
        title: "Séance encadrée — séance longue",
        detail: "Séance la plus soutenue du séjour, placée après plusieurs jours d'adaptation.",
        intensity: "soutenue",
      },
      {
        title: "Séance bilan et plan de suite",
        detail: "Comparaison avec l'évaluation initiale et programme écrit à poursuivre au retour.",
        intensity: "douce",
      },
    ];

    let cursor = 2;
    for (const session of ramp) {
      const avoid = session.intensity !== "douce";
      const day = scheduler.findLightDay(cursor, { avoidCareWindow: avoid, maxDay: lastLeisureDay });
      if (day === null || day >= total) break;
      scheduler.place({
        day,
        kind: "activite",
        title: session.title,
        detail: session.detail,
        intensity: session.intensity,
        facilityId,
      });
      cursor = day + 2; // un jour de repos entre deux séances
    }
  }

  /* --- Bien-être, thermalisme, mental ------------------------------ */
  if (brief.goals.some((g) => ["detente", "thermalisme", "mental"].includes(g))) {
    const facilityId = facilityFor(["thermal", "spa"]);
    const start = medicalGoals.length > 0 ? Math.max(3, Math.floor(total / 2)) : 2;
    const sessions = Math.min(3, Math.max(1, Math.floor(total / 3)));

    let cursor = start;
    for (let index = 0; index < sessions; index++) {
      const day = scheduler.findLightDay(cursor, {
        avoidCareWindow: medicalGoals.length > 0,
        maxDay: lastLeisureDay,
      });
      if (day === null) break;
      scheduler.place({
        day,
        kind: "bien-etre",
        title: index === 0 ? "Séance thermale et détente" : "Récupération en spa",
        detail:
          medicalGoals.length > 0
            ? "Programmée en seconde partie de séjour. L'accès aux bains chauds après un acte doit être validé par votre praticien."
            : "Bains, chaleur sèche et temps de repos. Prévoyez de ne rien planifier après la séance.",
        intensity: "repos",
        facilityId,
        preferAfternoon: true,
      });
      cursor = day + 2;
    }
  }

  /* --- Nutrition ---------------------------------------------------- */
  if (brief.goals.includes("nutrition")) {
    const facilityId = facilityFor(["nutrition"]);
    const first = scheduler.findLightDay(2, { maxDay: lastLeisureDay });
    if (first !== null) {
      scheduler.place({
        day: first,
        kind: "nutrition",
        title: "Consultation nutrition",
        detail: "Bilan alimentaire et construction d'un plan réaliste, compatible avec la cuisine locale.",
        intensity: "repos",
        facilityId,
      });
    }
    const follow = scheduler.findLightDay(Math.max(4, total - 2), { maxDay: lastLeisureDay });
    if (follow !== null && follow !== first) {
      scheduler.place({
        day: follow,
        kind: "nutrition",
        title: "Point nutrition et plan de suite",
        detail: "Ajustement du plan et remise du document à poursuivre après le séjour.",
        intensity: "repos",
        facilityId,
      });
    }
  }

  /* --- Entraînement --------------------------------------------------- */
  // Distinct de la remise en forme : la personne a déjà un rythme et veut le
  // tenir. On vise donc la régularité, pas une progression encadrée.
  if (brief.goals.includes("entrainement")) {
    const facilityId = facilityFor(["salle", "forme"]);
    let cursor = 2;

    while (cursor <= lastLeisureDay) {
      const day = scheduler.findLightDay(cursor, {
        avoidCareWindow: medicalGoals.length > 0 || brief.flags.hasRecovery,
        maxDay: lastLeisureDay,
      });
      if (day === null) break;

      scheduler.place({
        day,
        kind: "activite",
        title: "Séance libre en salle",
        detail:
          "Accès à la salle sur votre créneau habituel. Signalez à l'avance si vous souhaitez un coach : cela conditionne les horaires disponibles.",
        intensity: "moderee",
        facilityId,
      });
      // Un jour sur deux : de quoi tenir son rythme sans saturer le séjour.
      cursor = day + 2;
    }
  }

  /* --- Découverte du patrimoine --------------------------------------- */
  // Des sites réels rattachés à la destination, et non une liste générique.
  // Pendant une récupération, marches soutenues et longs trajets sont écartés.
  const heritage = heritageNear(destination.slug).filter((site) => {
    if (!brief.flags.hasRecovery) return true;
    return site.effort !== "marche-soutenue" && site.distanceKm <= 80;
  });

  let heritageIndex = 0;
  for (let day = 2; day < total && heritageIndex < heritage.length; day++) {
    if (scheduler.load(day) >= 2) continue;
    if (scheduler.careDays.has(day)) continue;
    if (brief.flags.hasRecovery && scheduler.withinCareWindow(day)) continue;

    const site = heritage[heritageIndex];
    // Une journée entière de site lointain ne se glisse pas entre deux actes.
    if (site.hours > 6 && medicalGoals.length > 0) {
      heritageIndex++;
      continue;
    }

    const distance = site.distanceKm > 0 ? `À environ ${site.distanceKm} km. ` : "";
    const unesco = site.kind === "unesco" ? `Patrimoine mondial depuis ${site.inscribedIn}. ` : "";

    scheduler.place({
      day,
      kind: "activite",
      title: site.name,
      detail: `${unesco}${site.summary.split(".")[0]}. ${distance}Compter ${site.hours} h sur place.`,
      intensity: site.effort === "marche-soutenue" ? "moderee" : "douce",
      preferAfternoon: true,
    });
    heritageIndex++;
  }

  /* --- Départ -------------------------------------------------------- */
  if (total > 1) {
    scheduler.place({
      day: total,
      kind: "logistique",
      title: "Bilan de séjour et départ",
      detail:
        "Récupération des comptes rendus, point avec votre coordinateur et transfert. Votre suivi se poursuit dans votre espace après le retour.",
      intensity: "repos",
    });
  }

  /* --- Assemblage ----------------------------------------------------- */
  const steps = scheduler.steps.sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  const cautions = evaluateCompatibility({ brief, destination, steps });
  const quote = estimateQuote(brief);

  return {
    id: `journey-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    brief,
    title: buildTitle(brief, destination),
    summary: buildSummary(brief, destination, steps),
    destination,
    steps,
    matches,
    quote,
    cautions: cautions.map((caution) => caution.message),
    nextActions: buildNextActions(brief),
    disclaimer: MEDICAL_DISCLAIMER,
    generatedBy: "regles",
  };
}

export function buildJourney(rawText: string): JourneyPlan {
  return buildJourneyFromBrief(classifyIntent(rawText).brief);
}

/* ------------------------------------------------------------------ */

function buildTitle(brief: JourneyBrief, destination: Destination): string {
  const days = brief.durationDays;
  const primary = GOAL_BY_ID.get(brief.goals[0])?.label.toLowerCase() ?? "santé";
  const cleaned = primary.replace(/^me /, "").replace(/^demander un /, "");
  return `${days} jour${days > 1 ? "s" : ""} à ${destination.name} — ${cleaned}`;
}

function buildSummary(brief: JourneyBrief, destination: Destination, steps: JourneyStep[]): string {
  const careCount = steps.filter((s) => s.kind === "soin" || s.kind === "examen").length;
  const restCount = steps.filter((s) => s.kind === "recuperation" || s.kind === "repos").length;
  const goals = brief.goals.map((g) => GOAL_BY_ID.get(g)?.label.toLowerCase() ?? g);

  const goalsText =
    goals.length === 1
      ? goals[0]
      : `${goals.slice(0, -1).join(", ")} et ${goals[goals.length - 1]}`;

  const parts = [
    `Un parcours de ${brief.durationDays} jours à ${destination.name}, construit autour de ${goalsText}.`,
  ];

  if (careCount > 0) {
    parts.push(
      `${careCount} rendez-vous de soin ou d'examen, ${restCount} temps de repos identifiés, et des journées de découverte placées là où la charge le permet.`,
    );
  } else {
    parts.push(
      `Aucun acte médical programmé : le séjour est organisé autour du rythme, du repos et de l'activité douce.`,
    );
  }

  if (brief.travellers > 1) {
    parts.push(`Calendrier, hébergement et transports partagés pour ${brief.travellers} voyageurs.`);
  }

  return parts.join(" ");
}

function buildNextActions(brief: JourneyBrief): string[] {
  const actions: string[] = [];

  if (brief.flags.needsProfessionalOpinion) {
    actions.push("Faire valider les actes envisagés par un professionnel de santé habilité.");
  }
  actions.push("Compléter votre Health Passport pour que les praticiens disposent du contexte utile.");
  if (brief.origin === "etranger") {
    actions.push("Vérifier vos documents de voyage et la couverture d'assurance pour la durée du séjour.");
  }
  actions.push("Demander une estimation détaillée aux établissements retenus.");
  actions.push("Échanger avec un conseiller si un point reste flou — un humain reste joignable.");

  return actions;
}

export const STEP_KIND_LABEL: Record<StepKind, string> = {
  soin: "Soin",
  examen: "Examen",
  recuperation: "Récupération",
  "bien-etre": "Bien-être",
  activite: "Activité",
  nutrition: "Nutrition",
  logistique: "Logistique",
  repos: "Repos",
};
