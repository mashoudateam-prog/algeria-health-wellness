import { NextResponse, type NextRequest } from "next/server";
import { askConcierge } from "@/lib/ai/concierge";
import {
  ValidationError,
  callerKey,
  rateLimit,
  readJsonBody,
  readString,
} from "@/lib/security/request-guard";
import type { ConciergeMessage } from "@/types/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_HISTORY = 10;

export async function POST(request: NextRequest) {
  const limit = rateLimit(callerKey(request, "concierge"), { limit: 20, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Trop de messages en peu de temps. Reprenez dans un instant." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const body = (await readJsonBody(request)) as Record<string, unknown>;
    const message = readString(body.message, "message", { min: 1, max: 1_500 });

    const history = parseHistory(body.history);
    const reply = await askConcierge({ message, history });

    return NextResponse.json({ reply }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[concierge] échec de réponse", error);
    return NextResponse.json(
      { error: "Le concierge n'a pas pu répondre. Réessayez, ou demandez un conseiller." },
      { status: 500 },
    );
  }
}

/** L'historique vient du client : il est retaillé et re-typé, jamais fait confiance tel quel. */
function parseHistory(value: unknown): ConciergeMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-MAX_HISTORY)
    .map((entry): ConciergeMessage | null => {
      if (typeof entry !== "object" || entry === null) return null;
      const record = entry as Record<string, unknown>;
      const role = record.role === "concierge" ? "concierge" : "patient";
      const content = typeof record.content === "string" ? record.content.slice(0, 1_500) : "";
      return content ? { role, content } : null;
    })
    .filter((entry): entry is ConciergeMessage => entry !== null);
}
