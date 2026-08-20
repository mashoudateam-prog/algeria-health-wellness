import type { GoalId, JourneyBrief, Quote, QuoteLine } from "@/types/domain";
import { notices } from "./guardrails";
import { plannerText, type PlannerLocale, type PlannerText } from "./text";

/**
 * Smart Quote — estimation transparente, jamais un prix.
 *
 * ⚠️ Les fourchettes ci-dessous sont des ORDRES DE GRANDEUR DE DÉMONSTRATION.
 * Elles ne proviennent d'aucun établissement réel et ne doivent pas être
 * présentées comme des tarifs. En production, chaque ligne doit être alimentée
 * par une grille fournie et datée par le partenaire, ou masquée.
 *
 * Le montant définitif reste toujours du ressort de l'établissement, après
 * évaluation. La plateforme n'affiche « prix confirmé » que lorsqu'un devis
 * professionnel signé est rattaché au dossier.
 */

interface Band {
  min: number;
  max: number;
}

/** Coût indicatif du volet soins, par objectif, pour un séjour type. */
const CARE_BANDS: Partial<Record<GoalId, Band>> = {
  prevention: { min: 18_000, max: 46_000 },
  soins: { min: 14_000, max: 62_000 },
  dentaire: { min: 26_000, max: 128_000 },
  esthetique: { min: 32_000, max: 155_000 },
  avis: { min: 12_000, max: 30_000 },
};

/** Coût indicatif par jour pour les volets non médicaux. */
const DAILY_BANDS: Partial<Record<GoalId, Band>> = {
  thermalisme: { min: 3_500, max: 9_000 },
  detente: { min: 4_000, max: 12_000 },
  forme: { min: 3_000, max: 8_500 },
  sport: { min: 4_500, max: 11_000 },
  nutrition: { min: 2_000, max: 5_000 },
  mental: { min: 2_500, max: 7_000 },
};

const LODGING_PER_NIGHT: Record<1 | 2 | 3, Band> = {
  1: { min: 6_000, max: 12_000 },
  2: { min: 13_000, max: 26_000 },
  3: { min: 27_000, max: 52_000 },
};

const CONCIERGE: Record<1 | 2 | 3, Band> = {
  1: { min: 0, max: 0 },
  2: { min: 9_000, max: 18_000 },
  3: { min: 24_000, max: 46_000 },
};

export function estimateQuote(brief: JourneyBrief, locale: PlannerLocale = "fr"): Quote {
  const tx = plannerText(locale).quote;
  const lines: QuoteLine[] = [];
  const { durationDays, travellers, budgetTier } = brief;
  const nights = Math.max(1, durationDays - 1);

  /* Soins et honoraires ------------------------------------------- */
  for (const goal of brief.goals) {
    const band = CARE_BANDS[goal];
    if (!band) continue;
    lines.push({
      label: careLabel(goal, tx),
      category: goal === "avis" ? "honoraires" : "soins",
      min: band.min,
      max: band.max,
      note: tx.careNote,
    });
  }

  /* Examens -------------------------------------------------------- */
  if (brief.goals.some((g) => ["prevention", "soins", "dentaire"].includes(g))) {
    lines.push({
      label: tx.exams,
      category: "examens",
      min: 8_000,
      max: 34_000,
      note: "Prescrits selon la consultation initiale, donc non garantis à ce stade.",
    });
  }

  /* Volets quotidiens ---------------------------------------------- */
  for (const goal of brief.goals) {
    const band = DAILY_BANDS[goal];
    if (!band) continue;
    // Les séances ne remplissent pas tous les jours du séjour.
    const activeDays = Math.max(2, Math.round(durationDays * 0.55));
    lines.push({
      label: tx.perDay(careLabel(goal, tx), activeDays),
      category: "options",
      min: band.min * activeDays,
      max: band.max * activeDays,
    });
  }

  /* Hébergement ----------------------------------------------------- */
  const lodging = LODGING_PER_NIGHT[budgetTier];
  const rooms = Math.ceil(travellers / 2);
  lines.push({
    label: tx.lodging(nights, rooms),
    category: "hebergement",
    min: lodging.min * nights * rooms,
    max: lodging.max * nights * rooms,
  });

  /* Transport -------------------------------------------------------- */
  lines.push({
    label: tx.transfers,
    category: "transport",
    min: 2_500 * durationDays,
    max: 6_000 * durationDays,
    note:
      brief.origin === "etranger"
        ? tx.flightNote
        : undefined,
  });

  /* Conciergerie ------------------------------------------------------ */
  const concierge = CONCIERGE[budgetTier];
  if (concierge.max > 0) {
    lines.push({
      label: tx.concierge,
      category: "conciergerie",
      min: concierge.min,
      max: concierge.max,
      note: tx.conciergeNote,
    });
  }

  const totalMin = lines.reduce((sum, line) => sum + line.min, 0);
  const totalMax = lines.reduce((sum, line) => sum + line.max, 0);

  return {
    currency: "DZD",
    lines,
    totalMin,
    totalMax,
    kind: "estimation",
    disclaimer: notices(locale).quote,
  };
}

function careLabel(goal: GoalId, tx: PlannerText["quote"]): string {
  return tx.care[goal] ?? tx.fallbackCare;
}

/** Formatage monétaire homogène dans toute l'application. */
export function formatDZD(amount: number): string {
  return new Intl.NumberFormat("fr-DZ", {
    style: "currency",
    currency: "DZD",
    maximumFractionDigits: 0,
  }).format(amount);
}
