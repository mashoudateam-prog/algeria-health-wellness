import { plannerText, type PlannerLocale, type PlannerText } from "@/lib/ai/text";
import type { Destination, JourneyBrief, JourneyStep } from "@/types/domain";

/**
 * Règles de compatibilité séjour / santé.
 *
 * Ce sont des règles de PLANIFICATION, pas des recommandations médicales.
 * Elles décrivent des précautions d'organisation par défaut — prévoir un
 * tampon, ne pas programmer un effort soutenu juste après un acte — et
 * renvoient systématiquement la décision au praticien.
 *
 * Aucune de ces règles n'est produite par un modèle de langage : elles sont
 * écrites, versionnées et relues ici. Le moteur IA peut les appliquer, jamais
 * en inventer de nouvelles.
 */

export interface Caution {
  id: string;
  message: string;
}

interface RuleContext {
  brief: JourneyBrief;
  destination: Destination;
  steps: JourneyStep[];
  /** Les phrases sont traduites, jamais réécrites par un modèle. */
  tx: PlannerText["cautions"];
}

const RULES: Array<{ id: string; evaluate: (ctx: RuleContext) => string | null }> = [
  {
    id: "tampon-arrivee",
    evaluate: ({ steps, tx }) => {
      const firstCare = steps.find((s) => s.kind === "soin" || s.kind === "examen");
      if (!firstCare || firstCare.day > 1) return null;
      return tx.arrivalBuffer;
    },
  },
  {
    id: "effort-apres-acte",
    evaluate: ({ steps, tx }) => {
      const careDays = steps.filter((s) => s.kind === "soin").map((s) => s.day);
      if (careDays.length === 0) return null;
      const conflict = steps.some(
        (s) =>
          (s.intensity === "soutenue" || s.intensity === "moderee") &&
          careDays.some((day) => s.day > day && s.day - day < 2),
      );
      if (conflict) return null;
      return tx.effortAfterCare;
    },
  },
  {
    id: "bain-chaud-apres-acte",
    evaluate: ({ brief, steps, tx }) => {
      const hasCare = steps.some((s) => s.kind === "soin");
      const hasThermal = steps.some((s) => s.kind === "bien-etre");
      if (!hasCare || !hasThermal) return null;
      if (!brief.flags.needsProfessionalOpinion) return null;
      return tx.hotBathAfterCare;
    },
  },
  {
    id: "depart-jour-acte",
    evaluate: ({ brief, steps, tx }) => {
      const lastDay = brief.durationDays;
      const careOnLastDay = steps.some(
        (s) => s.day === lastDay && (s.kind === "soin" || s.kind === "examen"),
      );
      if (!careOnLastDay) return null;
      return tx.careOnDepartureDay;
    },
  },
  {
    id: "sejour-court",
    evaluate: ({ brief, tx }) => {
      const medicalGoals = brief.goals.filter((g) =>
        ["soins", "dentaire", "esthetique", "prevention"].includes(g),
      );
      if (medicalGoals.length < 2 || brief.durationDays >= 6) return null;
      return tx.shortStay(brief.durationDays);
    },
  },
  {
    id: "chaleur-sud",
    evaluate: ({ brief, destination, tx }) => {
      if (destination.region !== "sud" && destination.region !== "grand-sud") return null;
      const month = new Date().getMonth() + 1;
      const summer = month >= 6 && month <= 9;
      const hasEffort = brief.goals.some((g) => ["forme", "sport"].includes(g));
      if (!summer && !hasEffort) return null;
      return summer ? tx.southSummer(destination.name) : tx.southEffort(destination.name);
    },
  },
  {
    id: "recuperation-declaree",
    evaluate: ({ brief, tx }) => {
      if (!brief.flags.hasRecovery) return null;
      return tx.recoveryDeclared;
    },
  },
  {
    id: "trajets-longs",
    evaluate: ({ brief, steps, tx }) => {
      if (!brief.flags.hasRecovery) return null;
      const hasExcursion = steps.some((s) => s.kind === "activite" && s.intensity !== "repos");
      if (!hasExcursion) return null;
      return tx.longTrips;
    },
  },
  {
    id: "famille",
    evaluate: ({ brief, tx }) => {
      if (brief.travellers < 2) return null;
      return tx.family(brief.travellers);
    },
  },
];

export function evaluateCompatibility(
  context: Omit<RuleContext, "tx">,
  locale: PlannerLocale = "fr",
): Caution[] {
  const full: RuleContext = { ...context, tx: plannerText(locale).cautions };
  return RULES.map((rule) => {
    const message = rule.evaluate(full);
    return message ? { id: rule.id, message } : null;
  }).filter((caution): caution is Caution => caution !== null);
}
