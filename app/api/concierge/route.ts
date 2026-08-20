import { NextResponse, type NextRequest } from "next/server";
import { askConcierge } from "@/lib/ai/concierge";
import {
  ValidationError,
  callerKey,
  rateLimit,
  readJsonBody,
  readString,
  validationMessage,
} from "@/lib/security/request-guard";
import { apiErrors, requestLocale } from "@/lib/security/errors";
import { LOCALES, type Locale } from "@/lib/i18n/config";
import type { ConciergeMessage } from "@/types/domain";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_HISTORY = 10;

export async function POST(request: NextRequest) {
  let errors = apiErrors(requestLocale(request));

  const limit = rateLimit(callerKey(request, "concierge"), { limit: 20, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: errors.tooManyMessages },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const body = (await readJsonBody(request)) as Record<string, unknown>;
    const message = readString(body.message, "message", { min: 1, max: 1_500 });

    const history = parseHistory(body.history);
    // /api est hors du matcher du middleware : la langue arrive par le corps.
    const locale: Locale = LOCALES.includes(body.locale as Locale)
      ? (body.locale as Locale)
      : requestLocale(request);
    errors = apiErrors(locale);
    const reply = await askConcierge({ message, history, locale });

    return NextResponse.json({ reply }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: validationMessage(error, errors) }, { status: 400 });
    }
    console.error("[concierge] échec de réponse", error);
    return NextResponse.json(
      { error: errors.conciergeFailed },
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
