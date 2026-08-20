import { FACILITIES } from "@/data/facilities";
import { GOAL_BY_ID } from "@/data/goals";
import { LOCALE_TAG } from "@/lib/i18n/config";
import { localizedFacility, localizedGoal, localizedTerms } from "@/lib/i18n/content";
import type { Facility, FacilityMatch, JourneyBrief, MatchReason } from "@/types/domain";
import { plannerText, type PlannerLocale } from "./text";

/**
 * Smart Match — moteur de recommandation explicable.
 *
 * Règle de conception : aucun score n'est affiché sans les raisons qui le
 * produisent. L'utilisateur ne lit pas « 4,8 étoiles » mais « pourquoi cette
 * option vous est proposée », en trois à cinq motifs vérifiables.
 *
 * Le score ne mesure pas une qualité de soin — la plateforme n'a pas qualité à
 * l'évaluer — mais l'adéquation entre un profil déclaré et un projet déclaré.
 */

const WEIGHTS = {
  goalKind: 34,
  destination: 22,
  language: 12,
  international: 10,
  budget: 9,
  verification: 8,
  accessibility: 5,
} as const;

export interface MatchOptions {
  /** Restreint aux établissements d'une destination. */
  destinationSlug?: string;
  limit?: number;
  /** Exige au moins une correspondance avec un objectif du brief. */
  requireGoalMatch?: boolean;
  /** Langue des justifications affichées. */
  locale?: PlannerLocale;
}

export function matchFacilities(
  brief: JourneyBrief,
  options: MatchOptions = {},
): FacilityMatch[] {
  const { destinationSlug, limit = 6, requireGoalMatch = true, locale = "fr" } = options;
  const tx = plannerText(locale).match;

  const wantedKinds = new Set(
    brief.goals.flatMap((goalId) => GOAL_BY_ID.get(goalId)?.facilityKinds ?? []),
  );

  const results: FacilityMatch[] = [];

  for (const facility of FACILITIES) {
    const shown = localizedFacility(facility, locale);
    const reasons: MatchReason[] = [];
    let score = 0;

    /* Adéquation à l'objectif -------------------------------------- */
    const kindMatches = wantedKinds.has(facility.kind);
    if (kindMatches) {
      score += WEIGHTS.goalKind;
      const goal = brief.goals
        .map((id) => GOAL_BY_ID.get(id))
        .find((g) => g?.facilityKinds.includes(facility.kind));
      reasons.push({
        label: tx.goal,
        detail: goal
          ? `${localizedGoal(goal, locale).label} — ${shown.specialties.slice(0, 3).join(", ")}`
          : shown.specialties.slice(0, 3).join(", "),
      });
    } else if (requireGoalMatch) {
      continue;
    }

    /* Localisation -------------------------------------------------- */
    const targetDestination = destinationSlug ?? brief.destinationSlug;
    if (targetDestination && facility.destinationSlug === targetDestination) {
      score += WEIGHTS.destination;
      reasons.push({
        label: tx.onSite,
        detail: tx.onSiteDetail,
      });
    } else if (targetDestination) {
      continue;
    }

    /* Langues ------------------------------------------------------- */
    const sharedLanguages = brief.languages.filter((lang) => facility.languages.includes(lang));
    if (sharedLanguages.length > 0) {
      score += WEIGHTS.language;
      reasons.push({
        label: tx.language,
        detail: tx.languageDetail(joinList(localizedTerms(sharedLanguages, locale), locale)),
      });
    }

    /* Patients internationaux --------------------------------------- */
    if (brief.origin === "etranger") {
      if (facility.internationalPatients) {
        score += WEIGHTS.international;
        // Le filtre reconnaît des mots français : il s'applique à la source,
        // et l'index retenu sert ensuite à lire la version traduite.
        const relevant = facility.services
          .map((service, index) => ({ service, index }))
          .filter(({ service }) => /navette|interpr|coordination|distance|planification/i.test(service))
          .map(({ index }) => shown.services[index] ?? facility.services[index]);
        reasons.push({
          label: tx.international,
          detail:
            relevant.length > 0
              ? relevant.slice(0, 2).join(" · ")
              : tx.internationalDetail,
        });
      } else {
        score -= 14;
      }
    }

    /* Budget --------------------------------------------------------- */
    const gap = Math.abs(facility.priceTier - brief.budgetTier);
    if (gap === 0) {
      score += WEIGHTS.budget;
      reasons.push({
        label: tx.budget,
        detail: tx.budgetTiers[facility.priceTier],
      });
    } else if (gap === 1) {
      score += 4;
    } else {
      score -= 6;
    }

    /* Vérification ---------------------------------------------------- */
    if (facility.verification.status === "verifie") {
      score += WEIGHTS.verification;
      reasons.push({
        label: tx.verified,
        detail: tx.verifiedDetail(
          shown.verification.checks.slice(0, 3).join(", "),
          formatDate(facility.verification.checkedAt, locale, tx.unknownDate),
        ),
      });
    } else {
      reasons.push({
        label: tx.declared,
        detail: tx.declaredDetail,
      });
    }

    /* Accessibilité ---------------------------------------------------- */
    if (facility.accessibility.some((item) => /fauteuil|plain-pied|adapt/i.test(item))) {
      score += WEIGHTS.accessibility;
    }

    /* Récupération ----------------------------------------------------- */
    if (brief.flags.hasRecovery && /reeducation|spa|thermal|hebergement/.test(facility.kind)) {
      score += 8;
      reasons.push({
        label: tx.recovery,
        detail: tx.recoveryDetail,
      });
    }

    results.push({
      facilityId: facility.id,
      score: Math.max(0, Math.min(100, Math.round(score))),
      reasons: reasons.slice(0, 5),
    });
  }

  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}

/**
 * Recherche libre du catalogue, utilisée par l'annuaire.
 * Retourne les établissements bruts, sans score : une liste consultée n'est pas
 * une recommandation.
 */
export function filterFacilities(filters: {
  kind?: string;
  destinationSlug?: string;
  language?: string;
  query?: string;
}): Facility[] {
  const query = filters.query?.toLowerCase().trim();

  return FACILITIES.filter((facility) => {
    if (filters.kind && facility.kind !== filters.kind) return false;
    if (filters.destinationSlug && facility.destinationSlug !== filters.destinationSlug) return false;
    if (filters.language && !facility.languages.includes(filters.language)) return false;
    if (query) {
      const haystack = [facility.name, facility.summary, ...facility.specialties]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

function formatDate(iso: string | null, locale: PlannerLocale, unknown: string): string {
  if (!iso) return unknown;
  const date = new Date(iso);
  return date.toLocaleDateString(LOCALE_TAG[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** « a, b et c » en français, « a, b and c » en anglais. */
function joinList(items: string[], locale: PlannerLocale): string {
  if (items.length < 2) return items.join("");
  const last = items[items.length - 1];
  return `${items.slice(0, -1).join(", ")} ${plannerText(locale).and} ${last}`;
}
