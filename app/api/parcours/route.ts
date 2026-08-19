import { NextResponse, type NextRequest } from "next/server";
import { DESTINATIONS } from "@/data/destinations";
import { GOALS } from "@/data/goals";
import { buildJourneyFromBrief } from "@/lib/ai/planner";
import { classifyIntent } from "@/lib/ai/intent";
import {
  ValidationError,
  callerKey,
  rateLimit,
  readEnumList,
  readInteger,
  readJsonBody,
  readString,
} from "@/lib/security/request-guard";
import type { GoalId, Origin } from "@/types/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GOAL_IDS = GOALS.map((goal) => goal.id) as readonly GoalId[];
const DESTINATION_SLUGS = DESTINATIONS.map((destination) => destination.slug);
const ORIGINS: readonly Origin[] = ["algerie", "etranger"];

export async function POST(request: NextRequest) {
  const limit = rateLimit(callerKey(request, "parcours"), { limit: 30, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Trop de demandes successives. Réessayez dans un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const body = (await readJsonBody(request)) as Record<string, unknown>;

    const text = readString(body.text, "text", { max: 1_200, required: false });
    const goals = readEnumList(body.goals, "goals", GOAL_IDS, 6);

    if (!text && goals.length === 0) {
      throw new ValidationError("Indiquez au moins un objectif ou décrivez votre projet.");
    }

    // Le classifieur pose la base ; les champs explicitement fournis par
    // l'interface la corrigent ensuite.
    const classified = classifyIntent(text || goals.map(labelOf).join(", "));
    const brief = { ...classified.brief };

    if (goals.length > 0) {
      brief.goals = goals;
      brief.flags.needsProfessionalOpinion = goals.some(
        (id) => GOALS.find((goal) => goal.id === id)?.requiresProfessional ?? false,
      );
    }

    brief.durationDays = readInteger(body.durationDays, "durationDays", {
      min: 1,
      max: 45,
      fallback: brief.durationDays,
    });
    brief.travellers = readInteger(body.travellers, "travellers", {
      min: 1,
      max: 10,
      fallback: brief.travellers,
    });
    brief.budgetTier = readInteger(body.budgetTier, "budgetTier", {
      min: 1,
      max: 3,
      fallback: brief.budgetTier,
    }) as 1 | 2 | 3;

    const origin = readEnumList(body.origin ? [body.origin] : [], "origin", ORIGINS, 1);
    if (origin.length === 1) brief.origin = origin[0];

    const destination = readEnumList(
      body.destinationSlug ? [body.destinationSlug] : [],
      "destinationSlug",
      DESTINATION_SLUGS,
      1,
    );
    if (destination.length === 1) brief.destinationSlug = destination[0];

    const plan = buildJourneyFromBrief(brief);

    return NextResponse.json(
      {
        plan,
        understood: classified.understood,
        missing: classified.missing,
        confidence: classified.confidence,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    // Aucun détail interne n'est renvoyé au client.
    console.error("[parcours] échec de génération", error);
    return NextResponse.json(
      { error: "Le parcours n'a pas pu être construit. Réessayez." },
      { status: 500 },
    );
  }
}

function labelOf(id: GoalId): string {
  return GOALS.find((goal) => goal.id === id)?.label ?? id;
}
