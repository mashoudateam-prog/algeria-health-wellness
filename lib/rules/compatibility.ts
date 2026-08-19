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
}

const RULES: Array<{ id: string; evaluate: (ctx: RuleContext) => string | null }> = [
  {
    id: "tampon-arrivee",
    evaluate: ({ steps }) => {
      const firstCare = steps.find((s) => s.kind === "soin" || s.kind === "examen");
      if (!firstCare || firstCare.day > 1) return null;
      return "Aucun acte n'est programmé le jour de l'arrivée : le trajet et le décalage pèsent sur la journée. Le premier rendez-vous est placé au lendemain.";
    },
  },
  {
    id: "effort-apres-acte",
    evaluate: ({ steps }) => {
      const careDays = steps.filter((s) => s.kind === "soin").map((s) => s.day);
      if (careDays.length === 0) return null;
      const conflict = steps.some(
        (s) =>
          (s.intensity === "soutenue" || s.intensity === "moderee") &&
          careDays.some((day) => s.day > day && s.day - day < 2),
      );
      if (conflict) return null;
      return "Aucune activité soutenue n'est programmée dans les 48 heures suivant un acte. Ce délai est une précaution d'organisation : seul votre praticien peut le confirmer ou l'ajuster.";
    },
  },
  {
    id: "bain-chaud-apres-acte",
    evaluate: ({ brief, steps }) => {
      const hasCare = steps.some((s) => s.kind === "soin");
      const hasThermal = steps.some((s) => s.kind === "bien-etre");
      if (!hasCare || !hasThermal) return null;
      if (!brief.flags.needsProfessionalOpinion) return null;
      return "Bains chauds, hammam et spa ne sont programmés qu'en seconde partie de séjour. Leur accès après un acte doit être validé au préalable par le praticien qui vous a pris en charge.";
    },
  },
  {
    id: "depart-jour-acte",
    evaluate: ({ brief, steps }) => {
      const lastDay = brief.durationDays;
      const careOnLastDay = steps.some(
        (s) => s.day === lastDay && (s.kind === "soin" || s.kind === "examen"),
      );
      if (!careOnLastDay) return null;
      return "Un acte est positionné le jour du départ. Nous recommandons de décaler le retour d'au moins vingt-quatre heures.";
    },
  },
  {
    id: "sejour-court",
    evaluate: ({ brief }) => {
      const medicalGoals = brief.goals.filter((g) =>
        ["soins", "dentaire", "esthetique", "prevention"].includes(g),
      );
      if (medicalGoals.length < 2 || brief.durationDays >= 6) return null;
      return `Votre séjour de ${brief.durationDays} jours cumule plusieurs objectifs médicaux. C'est réalisable, mais serré : prévoyez soit une durée plus longue, soit un objectif prioritaire.`;
    },
  },
  {
    id: "chaleur-sud",
    evaluate: ({ brief, destination }) => {
      if (destination.region !== "sud" && destination.region !== "grand-sud") return null;
      const month = new Date().getMonth() + 1;
      const summer = month >= 6 && month <= 9;
      const hasEffort = brief.goals.some((g) => ["forme", "sport"].includes(g));
      if (!summer && !hasEffort) return null;
      return summer
        ? `${destination.name} se visite surtout d'octobre à avril. En été, les températures rendent tout effort déconseillé et les journées doivent rester à l'intérieur aux heures chaudes.`
        : `${destination.name} se prête aux séjours calmes. Pour un programme de remise en forme soutenu, une destination littorale offre de meilleures conditions.`;
    },
  },
  {
    id: "recuperation-declaree",
    evaluate: ({ brief }) => {
      if (!brief.flags.hasRecovery) return null;
      return "Vous avez indiqué une période de récupération. Le planning la respecte par défaut, mais son contenu et sa durée doivent être confirmés par le professionnel qui assure votre suivi.";
    },
  },
  {
    id: "trajets-longs",
    evaluate: ({ brief, steps }) => {
      if (!brief.flags.hasRecovery) return null;
      const hasExcursion = steps.some((s) => s.kind === "activite" && s.intensity !== "repos");
      if (!hasExcursion) return null;
      return "Les excursions retenues restent à proximité immédiate de votre hébergement. Les trajets longs sont écartés pendant la fenêtre de récupération.";
    },
  },
  {
    id: "famille",
    evaluate: ({ brief }) => {
      if (brief.travellers < 2) return null;
      return `Le parcours est construit pour ${brief.travellers} personnes avec un calendrier, un hébergement et des transports communs. Chaque voyageur conserve son propre suivi de santé, séparé des autres.`;
    },
  },
];

export function evaluateCompatibility(context: RuleContext): Caution[] {
  return RULES.map((rule) => {
    const message = rule.evaluate(context);
    return message ? { id: rule.id, message } : null;
  }).filter((caution): caution is Caution => caution !== null);
}
