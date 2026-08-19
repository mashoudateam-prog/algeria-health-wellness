import { FACILITIES } from "@/data/facilities";
import { GOAL_BY_ID } from "@/data/goals";
import type { Facility, FacilityMatch, JourneyBrief, MatchReason } from "@/types/domain";

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
}

export function matchFacilities(
  brief: JourneyBrief,
  options: MatchOptions = {},
): FacilityMatch[] {
  const { destinationSlug, limit = 6, requireGoalMatch = true } = options;

  const wantedKinds = new Set(
    brief.goals.flatMap((goalId) => GOAL_BY_ID.get(goalId)?.facilityKinds ?? []),
  );

  const results: FacilityMatch[] = [];

  for (const facility of FACILITIES) {
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
        label: "Correspond à votre objectif",
        detail: goal
          ? `${goal.label} — ${facility.specialties.slice(0, 3).join(", ")}`
          : facility.specialties.slice(0, 3).join(", "),
      });
    } else if (requireGoalMatch) {
      continue;
    }

    /* Localisation -------------------------------------------------- */
    const targetDestination = destinationSlug ?? brief.destinationSlug;
    if (targetDestination && facility.destinationSlug === targetDestination) {
      score += WEIGHTS.destination;
      reasons.push({
        label: "Sur place",
        detail: "Situé dans la destination retenue pour votre parcours, sans trajet interurbain.",
      });
    } else if (targetDestination) {
      continue;
    }

    /* Langues ------------------------------------------------------- */
    const sharedLanguages = brief.languages.filter((lang) => facility.languages.includes(lang));
    if (sharedLanguages.length > 0) {
      score += WEIGHTS.language;
      reasons.push({
        label: "Langue d'échange",
        detail: `Accueil déclaré en ${sharedLanguages.join(" et ")}.`,
      });
    }

    /* Patients internationaux --------------------------------------- */
    if (brief.origin === "etranger") {
      if (facility.internationalPatients) {
        score += WEIGHTS.international;
        const relevant = facility.services.filter((service) =>
          /navette|interpr|coordination|distance|planification/i.test(service),
        );
        reasons.push({
          label: "Habitué aux patients venant de l'étranger",
          detail:
            relevant.length > 0
              ? relevant.slice(0, 2).join(" · ")
              : "Prise en charge des séjours programmés depuis l'étranger.",
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
        label: "Cohérent avec votre niveau de confort",
        detail: ["", "Positionnement essentiel", "Positionnement confort", "Positionnement premium"][
          facility.priceTier
        ],
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
        label: "Informations vérifiées",
        detail: `${facility.verification.checks.slice(0, 3).join(", ")} — contrôlé le ${formatDate(
          facility.verification.checkedAt,
        )}.`,
      });
    } else {
      reasons.push({
        label: "Informations déclaratives",
        detail: "Fiche renseignée par l'établissement, pas encore contrôlée par la plateforme.",
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
        label: "Utile à votre phase de récupération",
        detail: "Peut s'intégrer après un acte, une fois le rythme validé par votre praticien.",
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

function formatDate(iso: string | null): string {
  if (!iso) return "date inconnue";
  const date = new Date(iso);
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}
