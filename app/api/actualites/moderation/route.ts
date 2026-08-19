import { NextResponse, type NextRequest } from "next/server";
import { authorizeAdmin } from "@/lib/news/admin-auth";
import { newsStore } from "@/lib/news/store";
import {
  ValidationError,
  readJsonBody,
  readString,
} from "@/lib/security/request-guard";
import type { NewsStatus } from "@/types/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DECISIONS: NewsStatus[] = ["publie", "rejete"];

/** File d'attente : ce que l'agent propose, plus le compte rendu du dernier passage. */
export async function GET(request: NextRequest) {
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
  const auth = authorizeAdmin(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });

  try {
    const body = (await readJsonBody(request)) as Record<string, unknown>;
    const id = readString(body.id, "identifiant", { min: 3, max: 120 });
    const decision = readString(body.decision, "décision", { min: 5, max: 10 });

    if (!DECISIONS.includes(decision as NewsStatus)) {
      throw new ValidationError("Décision non reconnue.");
    }

    const updated = await newsStore.setStatus(id, decision as NewsStatus);
    if (!updated) return NextResponse.json({ error: "Élément introuvable." }, { status: 404 });

    return NextResponse.json({ ok: true, item: updated });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[actualites] modération en échec", error);
    return NextResponse.json({ error: "La décision n'a pas pu être enregistrée." }, { status: 500 });
  }
}
