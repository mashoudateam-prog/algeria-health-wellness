import { NextResponse, type NextRequest } from "next/server";
import { WILAYA_BY_CODE } from "@/data/geo";
import { canonicalUrl } from "@/lib/news/pipeline";
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
import type { NewsCategory, NewsItem } from "@/types/news";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CATEGORIES: NewsCategory[] = [
  "evenement",
  "ouverture",
  "promotion",
  "festival",
  "gastronomie",
  "cure",
];

/** Fil public : uniquement ce qu'un humain a validé. */
export async function GET() {
  const items = await newsStore.list("publie");
  return NextResponse.json(
    { items },
    { headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=1800" } },
  );
}

/**
 * Soumission par un partenaire.
 *
 * Elle entre en file de modération comme n'importe quelle collecte : un
 * établissement ne publie pas directement sur la plateforme. C'est ce qui
 * empêche le fil de devenir un mur publicitaire.
 */
export async function POST(request: NextRequest) {
  // Le formulaire partenaire est public : ses erreurs suivent la langue lue.
  const errors = apiErrors(requestLocale(request));

  const limit = rateLimit(callerKey(request, "actualites-soumission"), {
    limit: 5,
    windowMs: 600_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: errors.tooManySubmissions },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const body = (await readJsonBody(request)) as Record<string, unknown>;

    const title = readString(body.title, "titre", { min: 8, max: 180 });
    const summary = readString(body.summary, "description", { min: 20, max: 600 });
    const sourceUrl = readString(body.sourceUrl, "lien", { min: 8, max: 500 });
    const sourceName = readString(body.sourceName, "organisation", { min: 2, max: 120 });
    const wilayaCode = readString(body.wilayaCode, "wilaya", { min: 2, max: 2 });
    const startsOn = readString(body.startsOn, "date", { max: 10, required: false });

    if (!/^https?:\/\//i.test(sourceUrl)) {
      throw new ValidationError("linkScheme");
    }

    const wilaya = WILAYA_BY_CODE.get(wilayaCode);
    if (!wilaya) throw new ValidationError("unknownWilaya");

    const rawCategory = readString(body.category, "catégorie", { min: 3, max: 20 });
    if (!CATEGORIES.includes(rawCategory as NewsCategory)) {
      throw new ValidationError("unknownCategory");
    }

    if (startsOn && !/^\d{4}-\d{2}-\d{2}$/.test(startsOn)) {
      throw new ValidationError("badDateFormat");
    }

    const known = await newsStore.knownUrls();
    if (known.has(canonicalUrl(sourceUrl))) {
      throw new ValidationError("duplicateLink");
    }

    const item: NewsItem = {
      id: `news-partenaire-${Date.now().toString(36)}`,
      title,
      summary,
      category: rawCategory as NewsCategory,
      wilayaCode,
      locationLabel: wilaya.name,
      startsOn: startsOn || null,
      endsOn: null,
      sourceUrl,
      sourceName,
      origin: "partenaire",
      collectedAt: new Date().toISOString(),
      status: "propose",
      relevance: 70,
      notes: ["Soumis par un partenaire — à vérifier avant publication"],
    };

    await newsStore.add([item]);

    return NextResponse.json(
      {
        ok: true,
        message:
          "Merci. Votre proposition est enregistrée et sera examinée avant publication.",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: validationMessage(error, errors) }, { status: 400 });
    }
    console.error("[actualites] soumission refusée", error);
    return NextResponse.json({ error: errors.submissionFailed }, { status: 500 });
  }
}
