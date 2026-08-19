import type { Metadata } from "next";
import { JourneyBuilder } from "@/components/journey-builder";
import { DESTINATIONS } from "@/data/destinations";
import { GOALS } from "@/data/goals";
import type { GoalId } from "@/types/domain";

export const metadata: Metadata = {
  title: "Construire mon parcours",
  description:
    "Décrivez votre projet en une phrase : objectifs, destination, soins, professionnels, itinéraire et budget estimatif se construisent devant vous.",
};

const VALID_GOALS = new Set<string>(GOALS.map((goal) => goal.id));
const VALID_DESTINATIONS = new Set<string>(DESTINATIONS.map((entry) => entry.slug));

export default async function ParcoursPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;

  const rawText = typeof params.q === "string" ? params.q : "";
  const initialText = rawText.slice(0, 1_200);

  const rawGoals = typeof params.goals === "string" ? params.goals : "";
  const initialGoals = rawGoals
    .split(",")
    .map((entry) => entry.trim())
    .filter((entry) => VALID_GOALS.has(entry))
    .slice(0, 6) as GoalId[];

  // Une destination annoncée par la page d'univers doit être tenue : sans
  // elle, le planificateur peut en choisir une autre à score égal, et la
  // promesse faite juste avant le clic ne serait pas honorée.
  const rawDestination = typeof params.destination === "string" ? params.destination : "";
  const initialDestination = VALID_DESTINATIONS.has(rawDestination) ? rawDestination : "";

  return (
    <JourneyBuilder
      initialText={initialText}
      initialGoals={initialGoals}
      initialDestination={initialDestination}
    />
  );
}
