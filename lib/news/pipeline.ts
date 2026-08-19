import { WILAYAS } from "@/data/geo";
import {
  EXCLUSION_TERMS,
  RELEVANCE_TERMS,
  RELEVANCE_THRESHOLD,
} from "@/data/news-sources";
import { normalize } from "@/lib/ai/guardrails";
import type { GateResult, NewsCategory, NewsItem, RawItem } from "@/types/news";

/**
 * Chaîne de traitement d'un élément collecté.
 *
 *   pertinence → exclusions → catégorie → lieu → date → filtres → proposition
 *
 * Tout est déterministe. C'est délibéré : sur un fil qui parle d'établissements
 * de santé, on doit pouvoir expliquer pourquoi un élément a été retenu ou
 * écarté, et obtenir le même résultat demain. Un modèle de langage peut
 * ensuite reformuler un résumé, il ne décide jamais de l'admission.
 */

/* ------------------------------------------------------------------ */
/* Pertinence                                                          */
/* ------------------------------------------------------------------ */

/**
 * Appariement en DÉBUT DE MOT, jamais en sous-chaîne brute.
 *
 * La recherche en sous-chaîne produit des faux positifs absurdes : « Espagne »
 * contient « spa », « procureur » contient « cure ». Un titre sur des migrants
 * à Ceuta est ainsi entré en file de modération avec un score de 50.
 *
 * Le début de mot laisse en revanche passer les flexions, ce qu'on veut :
 * « cure » attrape « cures », « gastronomi » attrape « gastronomique ».
 */
const matcherCache = new Map<string, RegExp>();

function matcher(term: string): RegExp {
  const cached = matcherCache.get(term);
  if (cached) return cached;

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const built = new RegExp(`(?:^|[^a-z0-9])${escaped}`, "i");
  matcherCache.set(term, built);
  return built;
}

export function scoreRelevance(raw: RawItem): { score: number; matched: string[] } {
  // Le titre pèse double : un terme y est bien plus significatif que noyé
  // dans le corps d'un article.
  const title = normalize(raw.title);
  const body = normalize(`${raw.title} ${raw.text}`);

  let score = 0;
  const matched: string[] = [];

  for (const { term, weight } of RELEVANCE_TERMS) {
    const pattern = matcher(term);
    if (!pattern.test(body)) continue;
    score += pattern.test(title) ? weight * 2 : weight;
    matched.push(term);
  }

  return { score: Math.min(100, score), matched };
}

export function isExcluded(raw: RawItem): string | null {
  const text = normalize(`${raw.title} ${raw.text}`);
  return EXCLUSION_TERMS.find((term) => matcher(term).test(text)) ?? null;
}

/* ------------------------------------------------------------------ */
/* Catégorie                                                           */
/* ------------------------------------------------------------------ */

const CATEGORY_RULES: Array<{ category: NewsCategory; terms: string[] }> = [
  { category: "cure", terms: ["therma", "thalasso", "cure", "hammam", "eaux chaudes"] },
  { category: "festival", terms: ["festival", "fete de", "fete du", "celebration"] },
  { category: "gastronomie", terms: ["gastronomi", "culinaire", "cuisine", "datte", "huile d'olive", "patrimoine culinaire"] },
  { category: "ouverture", terms: ["inauguration", "inaugure", "ouverture", "nouveau centre", "nouvelle structure", "ouvre ses portes"] },
  { category: "promotion", terms: ["promotion", "reduction", "tarif preferentiel", "offre speciale"] },
  { category: "evenement", terms: ["salon", "foire", "journee", "colloque", "rencontre", "seminaire"] },
];

export function classify(raw: RawItem): NewsCategory {
  const text = normalize(`${raw.title} ${raw.text}`);
  for (const rule of CATEGORY_RULES) {
    if (rule.terms.some((term) => matcher(term).test(text))) return rule.category;
  }
  return "evenement";
}

/* ------------------------------------------------------------------ */
/* Lieu                                                                */
/* ------------------------------------------------------------------ */

/** Cherche une wilaya nommée dans le texte. Les noms courts sont ignorés. */
export function detectWilaya(raw: RawItem): { code: string | null; label: string } {
  const text = normalize(`${raw.title} ${raw.text}`);

  const found = WILAYAS.filter((wilaya) => wilaya.name.length >= 5).find((wilaya) =>
    text.includes(normalize(wilaya.name)),
  );

  if (found) return { code: found.code, label: found.name };
  return { code: null, label: "Lieu non précisé" };
}

/* ------------------------------------------------------------------ */
/* Dates                                                               */
/* ------------------------------------------------------------------ */

const MONTHS: Record<string, number> = {
  janvier: 0, fevrier: 1, mars: 2, avril: 3, mai: 4, juin: 5,
  juillet: 6, aout: 7, septembre: 8, octobre: 9, novembre: 10, decembre: 11,
};

/**
 * Repère une date d'événement en français : « le 12 octobre »,
 * « du 3 au 7 novembre ». Retourne null plutôt que de deviner.
 */
export function detectEventDates(
  raw: RawItem,
  reference = new Date(),
): { startsOn: string | null; endsOn: string | null } {
  const text = normalize(`${raw.title} ${raw.text}`);
  const monthNames = Object.keys(MONTHS).join("|");

  const range = text.match(new RegExp(`du (\\d{1,2}) (?:au (\\d{1,2}) )?(${monthNames})`, "i"));
  if (range) {
    const month = MONTHS[range[3]];
    return {
      startsOn: buildDate(Number(range[1]), month, reference),
      endsOn: range[2] ? buildDate(Number(range[2]), month, reference) : null,
    };
  }

  const single = text.match(new RegExp(`(?:le )?(\\d{1,2}) (${monthNames})`, "i"));
  if (single) {
    return { startsOn: buildDate(Number(single[1]), MONTHS[single[2]], reference), endsOn: null };
  }

  return { startsOn: null, endsOn: null };
}

/** Le millésime est rarement écrit : on retient l'occurrence à venir. */
function buildDate(day: number, month: number, reference: Date): string | null {
  if (!Number.isFinite(day) || day < 1 || day > 31 || month === undefined) return null;

  let year = reference.getFullYear();
  let candidate = new Date(Date.UTC(year, month, day));
  if (candidate.getTime() < reference.getTime() - 86_400_000 * 7) {
    year += 1;
    candidate = new Date(Date.UTC(year, month, day));
  }
  if (candidate.getUTCDate() !== day) return null;
  return candidate.toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ */
/* Filtres d'admission                                                 */
/* ------------------------------------------------------------------ */

export interface GateContext {
  /** URL et titres déjà connus, pour écarter les doublons. */
  seenUrls: Set<string>;
  seenTitles: Set<string>;
}

export function evaluateGates(raw: RawItem, context: GateContext): GateResult {
  const reasons: string[] = [];

  // 1. Source vérifiable — condition non négociable.
  if (!raw.url || !/^https?:\/\//i.test(raw.url)) {
    reasons.push("aucune source vérifiable");
  }

  // 2. Titre exploitable.
  const title = raw.title?.trim() ?? "";
  if (title.length < 8) reasons.push("titre trop court");
  if (title.length > 220) reasons.push("titre anormalement long");

  // 3. Sujet hors périmètre.
  const excluded = isExcluded(raw);
  if (excluded) reasons.push(`sujet hors périmètre (« ${excluded} »)`);

  // 4. Pertinence insuffisante.
  const { score } = scoreRelevance(raw);
  if (score < RELEVANCE_THRESHOLD) {
    reasons.push(`pertinence insuffisante (${score}/${RELEVANCE_THRESHOLD})`);
  }

  // 5. Doublons.
  if (raw.url && context.seenUrls.has(canonicalUrl(raw.url))) reasons.push("déjà collecté");
  if (title && context.seenTitles.has(normalize(title))) reasons.push("titre déjà présent");

  return { accepted: reasons.length === 0, reasons };
}

/** Normalise une URL pour la comparaison : sans paramètres de suivi ni ancre. */
export function canonicalUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/$/, "").toLowerCase();
  } catch {
    return url.trim().toLowerCase();
  }
}

/* ------------------------------------------------------------------ */
/* Constitution de la proposition                                      */
/* ------------------------------------------------------------------ */

export function toNewsItem(raw: RawItem, reference = new Date()): NewsItem {
  const { score, matched } = scoreRelevance(raw);
  const category = classify(raw);
  const place = detectWilaya(raw);
  const dates = detectEventDates(raw, reference);

  const notes: string[] = [];
  if (matched.length > 0) notes.push(`Termes relevés : ${matched.slice(0, 5).join(", ")}`);
  if (!place.code) notes.push("Lieu non identifié — à préciser avant publication");
  if (!dates.startsOn && (category === "evenement" || category === "festival")) {
    notes.push("Date non identifiée — à préciser avant publication");
  }

  return {
    id: `news-${canonicalUrl(raw.url).slice(-40).replace(/[^a-z0-9]/gi, "").slice(-24)}-${score}`,
    title: raw.title.trim(),
    summary: summarize(raw.text || raw.title),
    category,
    wilayaCode: place.code,
    locationLabel: place.label,
    startsOn: dates.startsOn,
    endsOn: dates.endsOn,
    sourceUrl: raw.url,
    sourceName: raw.sourceName,
    origin: raw.origin,
    collectedAt: reference.toISOString(),
    // Une proposition, jamais une publication. La validation est humaine.
    status: "propose",
    relevance: score,
    notes,
  };
}

/**
 * Résumé court. On coupe le texte de la source au lieu de le réécrire :
 * reformuler automatiquement, c'est risquer d'inventer un détail que la
 * source ne contient pas.
 */
function summarize(text: string, maxLength = 240): string {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length <= maxLength) return trimmed;

  const cut = trimmed.slice(0, maxLength);
  const lastStop = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf(" "));
  return `${cut.slice(0, lastStop > 80 ? lastStop : maxLength).trim()}…`;
}
