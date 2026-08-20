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
import { notices } from "./guardrails";
import { classifyIntent } from "./intent";
import { matchFacilities } from "./matching";
import { estimateQuote } from "./quote";
import { localizedDestination, localizedGoal, localizedHeritage } from "@/lib/i18n/content";
import { plannerText, type PlannerLocale, type PlannerText } from "./text";

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

interface CareShape {
  offset: number;
  kind: StepKind;
  intensity: Intensity;
}

/**
 * Structure des actes par objectif : quand, de quelle nature, à quelle
 * intensité. Les titres et consignes vivent dans `text.ts`, pour que la
 * même trame serve toutes les langues.
 */
const CARE_SHAPES: Partial<Record<GoalId, CareShape[]>> = {
  prevention: [
    { offset: 0, kind: "examen", intensity: "repos" },
    { offset: 2, kind: "soin", intensity: "repos" },
  ],
  soins: [
    { offset: 0, kind: "soin", intensity: "repos" },
    { offset: 1, kind: "examen", intensity: "repos" },
    { offset: 3, kind: "soin", intensity: "repos" },
  ],
  dentaire: [
    { offset: 0, kind: "soin", intensity: "repos" },
    { offset: 2, kind: "soin", intensity: "repos" },
    { offset: 4, kind: "soin", intensity: "repos" },
  ],
  esthetique: [
    { offset: 0, kind: "soin", intensity: "repos" },
    { offset: 2, kind: "soin", intensity: "repos" },
  ],
  avis: [
    { offset: 0, kind: "logistique", intensity: "repos" },
    { offset: 3, kind: "soin", intensity: "repos" },
  ],
};

/* ------------------------------------------------------------------ */
/* Construction du parcours                                            */
/* ------------------------------------------------------------------ */

export function buildJourneyFromBrief(
  brief: JourneyBrief,
  locale: PlannerLocale = "fr",
): JourneyPlan {
  const tx = plannerText(locale);
  // Le choix reste fait sur les données sources ; seul l'affichage est traduit.
  const destination = localizedDestination(pickDestination(brief), locale);
  const matches = matchFacilities(brief, { destinationSlug: destination.slug, limit: 6, locale });
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
    title: brief.origin === "etranger" ? tx.arrivalAbroad.title : tx.arrivalLocal.title,
    detail:
      brief.origin === "etranger" ? tx.arrivalAbroad.detail : tx.arrivalLocal.detail,
    intensity: "repos",
    facilityId: facilityFor(["hebergement"]),
  });

  if (total > 2) {
    scheduler.place({
      day: 1,
      kind: "repos",
      title: tx.eveningFree,
      detail: destination.editorial.recuperation.split(".")[0] + ".",
      intensity: "repos",
      preferAfternoon: true,
    });
  }

  /* --- Actes médicaux --------------------------------------------- */
  const medicalGoals = brief.goals.filter((goal) => CARE_SHAPES[goal]);
  let anchor = 2;

  for (const goal of medicalGoals) {
    const shapes = CARE_SHAPES[goal]!;
    const texts = tx.care[goal] ?? [];
    const kinds = GOAL_BY_ID.get(goal)?.facilityKinds ?? [];
    for (const [index, entry] of shapes.entries()) {
      const day = anchor + entry.offset;
      // Un acte ne se programme jamais le jour du départ.
      if (day >= total && total > 2) continue;
      scheduler.place({
        day,
        kind: entry.kind,
        title: texts[index]?.title ?? "",
        detail: texts[index]?.detail ?? "",
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
      title: tx.recoveryDay.title,
      detail: tx.recoveryDay.detail,
      intensity: "repos",
    });
  }

  /* --- Remise en forme et sport ------------------------------------ */
  if (brief.goals.some((g) => g === "forme" || g === "sport")) {
    const facilityId = facilityFor(["forme", "reeducation"]);
    const ramp = tx.fitness;

    let cursor = 2;
    for (const [index, session] of ramp.entries()) {
      const avoid = session.intensity !== "douce";
      // La dernière séance porte le bilan et le programme écrit à poursuivre
      // au retour : c'est le livrable du séjour. Si l'espacement habituel la
      // repousse au-delà du départ, on la rapproche plutôt que de la perdre.
      const last = index === ramp.length - 1;
      const from = last ? Math.min(cursor, lastLeisureDay) : cursor;
      const day = scheduler.findLightDay(from, { avoidCareWindow: avoid, maxDay: lastLeisureDay });
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
        title: index === 0 ? tx.wellnessFirst : tx.wellnessNext,
        detail: medicalGoals.length > 0 ? tx.wellnessWithCare : tx.wellnessAlone,
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
        title: tx.nutritionFirst.title,
        detail: tx.nutritionFirst.detail,
        intensity: "repos",
        facilityId,
      });
    }
    const follow = scheduler.findLightDay(Math.max(4, total - 2), { maxDay: lastLeisureDay });
    if (follow !== null && follow !== first) {
      scheduler.place({
        day: follow,
        kind: "nutrition",
        title: tx.nutritionFollow.title,
        detail: tx.nutritionFollow.detail,
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
        title: tx.training.title,
        detail: tx.training.detail,
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

    const site = localizedHeritage(heritage[heritageIndex], locale);
    // Une journée entière de site lointain ne se glisse pas entre deux actes.
    if (site.hours > 6 && medicalGoals.length > 0) {
      heritageIndex++;
      continue;
    }

    const distance = site.distanceKm > 0 ? tx.heritageDistance(site.distanceKm) : "";
    const unesco =
      site.kind === "unesco" && site.inscribedIn ? tx.heritageUnesco(site.inscribedIn) : "";

    scheduler.place({
      day,
      kind: "activite",
      title: site.name,
      detail: `${unesco}${site.summary.split(".")[0]}. ${distance}${tx.heritageHours(site.hours)}`,
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
      title: tx.departure.title,
      detail: tx.departure.detail,
      intensity: "repos",
    });
  }

  /* --- Assemblage ----------------------------------------------------- */
  const steps = scheduler.steps.sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  const cautions = evaluateCompatibility({ brief, destination, steps }, locale);
  const quote = estimateQuote(brief, locale);

  return {
    id: `journey-${Date.now().toString(36)}`,
    createdAt: new Date().toISOString(),
    brief,
    title: buildTitle(brief, destination, tx, locale),
    summary: buildSummary(brief, destination, steps, tx, locale),
    destination,
    steps,
    matches,
    quote,
    cautions: cautions.map((caution) => caution.message),
    nextActions: buildNextActions(brief, tx),
    disclaimer: notices(locale).medical,
    generatedBy: "regles",
  };
}

export function buildJourney(rawText: string, locale: PlannerLocale = "fr"): JourneyPlan {
  return buildJourneyFromBrief(classifyIntent(rawText, locale).brief, locale);
}

/* ------------------------------------------------------------------ */

function buildTitle(
  brief: JourneyBrief,
  destination: Destination,
  tx: PlannerText,
  locale: PlannerLocale,
): string {
  const goal = GOAL_BY_ID.get(brief.goals[0]);
  const label = goal ? localizedGoal(goal, locale).label.toLowerCase() : "";
  // « Me remettre en forme » se lit mal après un tiret : on retire l'amorce.
  const cleaned = label.replace(/^me /, "").replace(/^demander un /, "") || tx.fallbackGoal;
  return tx.title(brief.durationDays, destination.name, cleaned);
}

function buildSummary(
  brief: JourneyBrief,
  destination: Destination,
  steps: JourneyStep[],
  tx: PlannerText,
  locale: PlannerLocale,
): string {
  const careCount = steps.filter((s) => s.kind === "soin" || s.kind === "examen").length;
  const restCount = steps.filter((s) => s.kind === "recuperation" || s.kind === "repos").length;
  const goals = brief.goals.map((id) => {
    const goal = GOAL_BY_ID.get(id);
    return goal ? localizedGoal(goal, locale).label.toLowerCase() : id;
  });

  const goalsText =
    goals.length === 1
      ? goals[0]
      : `${goals.slice(0, -1).join(", ")} ${tx.and} ${goals[goals.length - 1]}`;

  const parts = [tx.summaryLead(brief.durationDays, destination.name, goalsText)];
  parts.push(careCount > 0 ? tx.summaryCare(careCount, restCount) : tx.summaryNoCare);
  if (brief.travellers > 1) parts.push(tx.summaryTravellers(brief.travellers));

  return parts.join(" ");
}

function buildNextActions(brief: JourneyBrief, tx: PlannerText): string[] {
  const actions: string[] = [];

  if (brief.flags.needsProfessionalOpinion) actions.push(tx.nextActions.professional);
  actions.push(tx.nextActions.passport);
  if (brief.origin === "etranger") actions.push(tx.nextActions.documents);
  actions.push(tx.nextActions.estimate);
  actions.push(tx.nextActions.adviser);

  return actions;
}

/** Libellé de catégorie dans la langue du visiteur. */
export function stepKindLabel(kind: StepKind, locale: PlannerLocale = "fr"): string {
  return plannerText(locale).stepKinds[kind];
}

