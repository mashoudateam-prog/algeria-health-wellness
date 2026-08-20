import { DESTINATIONS } from "@/data/destinations";
import { GOALS } from "@/data/goals";
import { WILAYAS } from "@/data/geo";
import { localizedGoal } from "@/lib/i18n/content";
import type { GoalId, JourneyBrief, Origin } from "@/types/domain";
import { DESTINATION_ALIASES, EN_GOAL_KEYWORDS } from "@/data/i18n/en-keywords";
import { detectUrgency, normalize } from "./guardrails";
import { plannerText, type PlannerLocale } from "./text";

/**
 * IntentClassifier — transforme une phrase libre en intention structurée.
 *
 * Module déterministe : mêmes entrées, mêmes sorties, aucun appel réseau.
 * Il sert de socle au parcours et de repli lorsqu'aucun fournisseur LLM n'est
 * configuré. Un LLM peut l'enrichir mais jamais le remplacer : c'est ici que
 * sont fixées les bornes de ce que la plateforme croit avoir compris.
 */

export interface ClassifiedIntent {
  brief: JourneyBrief;
  /** Ce que la plateforme affirme avoir compris, montré tel quel à l'utilisateur. */
  understood: string[];
  /** Ce qu'elle n'a pas déduit et qu'elle demandera. */
  missing: string[];
  confidence: number;
}

const NUMBER_WORDS: Record<string, number> = {
  un: 1, une: 1, deux: 2, trois: 3, quatre: 4, cinq: 5, six: 6, sept: 7,
  huit: 8, neuf: 9, dix: 10, onze: 11, douze: 12, treize: 13, quatorze: 14,
  quinze: 15, vingt: 20, trente: 30,
  // Anglais : « a week », « ten days », « two of us ». « six » est commun
  // aux deux langues et n'est donc pas répété.
  a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13,
  fourteen: 14, fifteen: 15, twenty: 20, thirty: 30,
};

const FOREIGN_HINTS = [
  "france", "francais de france", "belgique", "suisse", "canada", "quebec",
  "espagne", "italie", "allemagne", "royaume uni", "angleterre", "maroc",
  "tunisie", "turquie", "emirats", "qatar", "arabie", "senegal", "mali",
  "etranger", "expatrie", "diaspora", "je viens de", "depuis la", "depuis le",
  // Anglais
  "belgium", "switzerland", "spain", "italy", "germany", "united kingdom",
  "england", "scotland", "ireland", "netherlands", "sweden", "norway",
  "morocco", "tunisia", "turkey", "emirates", "saudi", "japan", "china",
  "korea", "united states", "usa", "abroad", "overseas", "expat",
  "i am coming from", "i'm coming from", "coming from", "travelling from",
  "traveling from", "fly from", "flying from", "come to algeria",
  "coming to algeria", "visit algeria",
];

const RECOVERY_HINTS = [
  "apres mon operation", "apres l'operation", "post operatoire", "postoperatoire",
  "convalescence", "je me suis fait operer", "suite a une intervention",
  "apres une intervention", "recuperation", "recuperer", "je sors de",
  "cicatrisation", "reeducation",
  // Anglais
  "after my operation", "after surgery", "after my surgery", "post operative",
  "postoperative", "post-operative", "recovering", "recovery period",
  "convalescence", "i had surgery", "following a procedure", "healing",
  "rehabilitation",
];

const LANGUAGE_HINTS: Array<[RegExp, string]> = [
  [/\banglais\b|\benglish\b/, "Anglais"],
  [/\barabe\b|\barabic\b/, "Arabe"],
  [/\bfrancais\b|\bfrench\b/, "Français"],
  [/\bespagnol\b|\bspanish\b/, "Espagnol"],
  [/\bitalien\b|\bitalian\b/, "Italien"],
  [/\bkabyle\b/, "Kabyle"],
];

/* ------------------------------------------------------------------ */

/** Durée du séjour en jours. Retourne null si rien n'est exprimé. */
function readDuration(text: string): number | null {
  if (/\bweek[- ]?end\b/.test(text)) return 3;
  if (/\bfortnight\b/.test(text)) return 14;

  const explicitDays = text.match(/\b(\d{1,3})\s*(jours?|days?|j)\b/);
  if (explicitDays) return clampDays(Number(explicitDays[1]));

  const wordDays = text.match(/\b([a-z]+)\s+(?:jours?|days?)\b/);
  if (wordDays && NUMBER_WORDS[wordDays[1]]) return clampDays(NUMBER_WORDS[wordDays[1]]);

  const weeks = text.match(/\b(\d{1,2}|[a-z]+)\s*(?:semaines?|weeks?)\b/);
  if (weeks) {
    const raw = Number(weeks[1]);
    const count = Number.isNaN(raw) ? NUMBER_WORDS[weeks[1]] : raw;
    if (count) return clampDays(count * 7);
  }

  const months = text.match(/\b(\d{1,2}|[a-z]+)\s*(?:mois|months?)\b/);
  if (months) {
    const raw = Number(months[1]);
    const count = Number.isNaN(raw) ? (NUMBER_WORDS[months[1]] ?? 1) : raw;
    return clampDays(count * 30);
  }

  return null;
}

function clampDays(days: number): number {
  return Math.min(60, Math.max(1, Math.round(days)));
}

/** Nombre de voyageurs. Une famille compte trois personnes par défaut. */
function readTravellers(text: string): number | null {
  const explicit = text.match(/\b(?:nous sommes|we are|a|à)\s+(\d{1,2})\b/);
  if (explicit) return Math.min(12, Math.max(1, Number(explicit[1])));

  const people = text.match(/\b(\d{1,2}|[a-z]+)\s*(?:personnes?|people|persons?|of us)\b/);
  if (people) {
    const raw = Number(people[1]);
    const count = Number.isNaN(raw) ? NUMBER_WORDS[people[1]] : raw;
    if (count) return Math.min(12, count);
  }

  if (/\ben famille\b|\bmes enfants\b|\bnos enfants\b/.test(text)) return 3;
  if (/\bwith my family\b|\bas a family\b|\bmy (?:kids|children)\b/.test(text)) return 3;
  if (/\bmon (conjoint|mari|epoux)\b|\bma (femme|conjointe|epouse)\b|\ba deux\b|\bà deux\b/.test(text)) return 2;
  if (/\bmy (?:wife|husband|partner|spouse)\b|\bthe two of us\b|\bas a couple\b/.test(text)) return 2;
  if (/\bmes parents\b|\bmy parents\b/.test(text)) return 3;
  if (/\bseule?\b|\bon my own\b|\bby myself\b|\balone\b|\bsolo\b/.test(text)) return 1;

  return null;
}

function readOrigin(text: string): Origin | null {
  if (/\bje (vis|habite|reside) (en|a|à) alger(ie)?\b|\bje suis en algerie\b/.test(text)) return "algerie";
  if (/\bi (?:live|am based|am) in algeria\b|\balready in algeria\b/.test(text)) return "algerie";
  if (FOREIGN_HINTS.some((hint) => text.includes(hint))) return "etranger";
  if (/\bvenir en algerie\b|\bje viens en algerie\b/.test(text)) return "etranger";
  return null;
}

/**
 * Un nom de ville ne se reconnaît qu'entier.
 *
 * Sans cette borne, « je viens en Algérie » désignait Alger, et « Espagne »
 * déclenchait un spa : le nom court se retrouve à l'intérieur du mot long.
 */
function mentions(text: string, name: string): boolean {
  const escaped = normalize(name).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:[^a-z0-9]|$)`, "i").test(text);
}

function readDestination(text: string): string | null {
  const direct = DESTINATIONS.find(
    (d) =>
      mentions(text, d.name) ||
      (DESTINATION_ALIASES[d.slug] ?? []).some((alias) => mentions(text, alias)),
  );
  if (direct) return direct.slug;

  // Une wilaya citée rattache à la destination éditoriale la plus proche.
  const wilaya = WILAYAS.find((w) => w.name.length > 4 && mentions(text, w.name));
  if (!wilaya) return null;

  let best: { slug: string; distance: number } | null = null;
  for (const destination of DESTINATIONS) {
    const distance = Math.hypot(destination.lon - wilaya.lon, destination.lat - wilaya.lat);
    if (!best || distance < best.distance) best = { slug: destination.slug, distance };
  }
  return best && best.distance < 3.5 ? best.slug : null;
}

function readBudget(text: string): 1 | 2 | 3 | null {
  if (/\b(petit budget|budget serre|economique|abordable|pas cher|le moins cher)\b/.test(text)) return 1;
  if (/\b(tight budget|small budget|low budget|cheap|affordable|inexpensive)\b/.test(text)) return 1;
  if (/\b(premium|haut de gamme|luxe|luxueux|le meilleur|standing)\b/.test(text)) return 3;
  if (/\b(luxury|luxurious|high end|top of the range|the very best|upscale)\b/.test(text)) return 3;
  if (/\b(confortable|confort|correct|moyen)\b/.test(text)) return 2;
  if (/\b(comfortable|comfort|mid range|reasonable)\b/.test(text)) return 2;
  return null;
}

function readLanguages(text: string): string[] {
  const found = LANGUAGE_HINTS.filter(([pattern]) => pattern.test(text)).map(([, label]) => label);
  return found.length > 0 ? found : ["Français"];
}

/**
 * Un terme déclencheur ne compte que s'il forme un mot.
 *
 * Sans cette borne, « cure thermale » déclenchait l'objectif « me soigner »,
 * parce que « thermale » contient « mal » — et le parcours se retrouvait
 * chargé de trois rendez-vous médicaux que personne n'avait demandés.
 *
 * Les flexions courantes restent admises : « dent » reconnaît « dents »,
 * « thermal » reconnaît « thermale ». Mais « dos » ne reconnaît plus
 * « dossier », ni « spa » l'anglais « spain ».
 */
function triggers(text: string, keyword: string): boolean {
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`(?:^|[^a-z0-9])${escaped}(?:es|s|e|x)?(?:[^a-z0-9]|$)`).test(text);
}

/** Score chaque objectif par nombre de termes déclencheurs présents. */
function readGoals(text: string): GoalId[] {
  const scores = GOALS.map((goal) => {
    let score = 0;
    // Les deux vocabulaires alimentent le même objectif : une phrase peut
    // mélanger les langues sans perdre en précision.
    const keywords = [...goal.keywords, ...(EN_GOAL_KEYWORDS[goal.id] ?? [])];
    for (const keyword of keywords) {
      if (!triggers(text, keyword)) continue;
      // Un terme long est plus discriminant qu'un terme court.
      score += keyword.length > 8 ? 2 : 1;
    }
    return { id: goal.id, score };
  }).filter((entry) => entry.score > 0);

  scores.sort((a, b) => b.score - a.score);

  // « Organiser un séjour » est un contenant, pas un objectif de santé :
  // on ne le garde que s'il est seul ou clairement dominant.
  const substantive = scores.filter((entry) => entry.id !== "sejour");
  const selected = (substantive.length > 0 ? substantive : scores).slice(0, 4).map((entry) => entry.id);

  return selected.length > 0 ? selected : ["prevention"];
}

/* ------------------------------------------------------------------ */

/** Point d'entrée du module. */
export function classifyIntent(
  rawText: string,
  locale: PlannerLocale = "fr",
): ClassifiedIntent {
  const tx = plannerText(locale).intent;
  const text = normalize(rawText);

  const goals = readGoals(text);
  const duration = readDuration(text);
  const travellers = readTravellers(text);
  const origin = readOrigin(text);
  const destinationSlug = readDestination(text);
  const budgetTier = readBudget(text);
  const languages = readLanguages(text);

  const hasRecovery = RECOVERY_HINTS.some((hint) => text.includes(hint));
  const needsProfessionalOpinion = goals.some(
    (id) => GOALS.find((g) => g.id === id)?.requiresProfessional ?? false,
  );
  const urgency = detectUrgency(rawText);

  const brief: JourneyBrief = {
    rawText: rawText.trim(),
    goals,
    durationDays: duration ?? 7,
    travellers: travellers ?? 1,
    origin: origin ?? "algerie",
    destinationSlug,
    budgetTier: budgetTier ?? 2,
    languages,
    flags: {
      needsProfessionalOpinion,
      mentionsUrgency: urgency.detected,
      hasRecovery,
    },
  };

  const understood: string[] = [];
  const missing: string[] = [];

  understood.push(
    goals.length === 1
      ? tx.singleGoal(labelOf(goals[0], locale))
      : tx.severalGoals(goals.map((id) => labelOf(id, locale)).join(", ")),
  );

  if (duration) understood.push(tx.duration(duration));
  else missing.push(tx.askDuration);

  if (travellers && travellers > 1) understood.push(tx.travellers(travellers));
  if (origin) understood.push(origin === "etranger" ? tx.fromAbroad : tx.inAlgeria);
  else missing.push(tx.askOrigin);

  if (destinationSlug) {
    const name = DESTINATIONS.find((d) => d.slug === destinationSlug)?.name;
    if (name) understood.push(tx.destination(name));
  } else {
    missing.push(tx.askRegion);
  }

  if (hasRecovery) understood.push(tx.recovery);
  if (budgetTier) understood.push(tx.comfort(tx.comfortLevels[budgetTier]));

  // Confiance : part des dimensions structurantes effectivement déduites.
  const signals = [duration, travellers, origin, destinationSlug, budgetTier];
  const resolved = signals.filter(Boolean).length;
  const confidence = Math.round(((resolved / signals.length) * 0.6 + 0.4) * 100) / 100;

  return { brief, understood, missing, confidence };
}

function labelOf(id: GoalId, locale: PlannerLocale): string {
  const goal = GOALS.find((g) => g.id === id);
  return goal ? localizedGoal(goal, locale).label : id;
}
