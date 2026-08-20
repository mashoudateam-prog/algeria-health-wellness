import { NextResponse, type NextRequest } from "next/server";
import { authorizeAdmin } from "@/lib/news/admin-auth";
import { newsStore } from "@/lib/news/store";
import {
  ValidationError,
  callerKey,
  rateLimit,
  readJsonBody,
  readString,
  validationMessage,
} from "@/lib/security/request-guard";
import { apiErrors, requestLocale } from "@/lib/security/errors";
import type { NewsStatus } from "@/types/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DECISIONS: NewsStatus[] = ["publie", "rejete"];

/**
 * La comparaison du jeton est à temps constant, mais rien n'empêchait d'en
 * essayer des milliers. Le débit est donc borné avant même le contrôle du
 * jeton : un appelant non authentifié ne doit pas pouvoir marteler l'entrée.
 */
function throttle(request: NextRequest) {
  const limit = rateLimit(callerKey(request, "moderation"), { limit: 20, windowMs: 60_000 });
  if (limit.allowed) return null;
  return NextResponse.json(
    { error: apiErrors(requestLocale(request)).tooManyRequests },
    { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
  );
}

/** File d'attente : ce que l'agent propose, plus le compte rendu du dernier passage. */
export async function GET(request: NextRequest) {
  const throttled = throttle(request);
  if (throttled) return throttled;

  const auth = authorizeAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  const [proposes, publies, rejetes, dernierPassage] = await Promise.all([
    newsStore.list("propose"),
    newsStore.list("publie"),
    newsStore.list("rejete"),
    newsStore.lastRun(),
  ]);

  return NextResponse.json(
    { proposes, publies, rejetes, dernierPassage },
    { headers: { "Cache-Control": "no-store" } },
  );
}

/** Décision de modération : publier ou écarter. */
export async function POST(request: NextRequest) {
  const throttled = throttle(request);
  if (throttled) return throttled;

  const auth = authorizeAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const body = (await readJsonBody(request)) as Record<string, unknown>;
    const id = readString(body.id, "identifiant", { min: 3, max: 120 });
    const decision = readString(body.decision, "décision", { min: 5, max: 10 });

    if (!DECISIONS.includes(decision as NewsStatus)) {
      throw new ValidationError("unknownDecision");
    }

    const updated = await newsStore.setStatus(id, decision as NewsStatus);
    if (!updated) return NextResponse.json({ error: apiErrors(requestLocale(request)).notFound }, { status: 404 });

    return NextResponse.json({ ok: true, item: updated });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: validationMessage(error, apiErrors(requestLocale(request))) }, { status: 400 });
    }
    console.error("[actualites] modération en échec", error);
    return NextResponse.json({ error: apiErrors(requestLocale(request)).decisionFailed }, { status: 500 });
  }
}
