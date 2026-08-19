import { DESTINATIONS } from "@/data/destinations";
import { GOALS } from "@/data/goals";
import { WILAYAS } from "@/data/geo";
import type { GoalId, JourneyBrief, Origin } from "@/types/domain";
import { detectUrgency, normalize } from "./guardrails";

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
};

const FOREIGN_HINTS = [
  "france", "francais de france", "belgique", "suisse", "canada", "quebec",
  "espagne", "italie", "allemagne", "royaume uni", "angleterre", "maroc",
  "tunisie", "turquie", "emirats", "qatar", "arabie", "senegal", "mali",
  "etranger", "expatrie", "diaspora", "je viens de", "depuis la", "depuis le",
];

const RECOVERY_HINTS = [
  "apres mon operation", "apres l'operation", "post operatoire", "postoperatoire",
  "convalescence", "je me suis fait operer", "suite a une intervention",
  "apres une intervention", "recuperation", "recuperer", "je sors de",
  "cicatrisation", "reeducation",
];

const LANGUAGE_HINTS: Array<[RegExp, string]> = [
  [/\banglais\b/, "Anglais"],
  [/\barabe\b/, "Arabe"],
  [/\bfrancais\b/, "Français"],
  [/\bespagnol\b/, "Espagnol"],
  [/\bitalien\b/, "Italien"],
  [/\bkabyle\b/, "Kabyle"],
];

/* ------------------------------------------------------------------ */

/** Durée du séjour en jours. Retourne null si rien n'est exprimé. */
function readDuration(text: string): number | null {
  if (/\bweek[- ]?end\b/.test(text)) return 3;

  const explicitDays = text.match(/\b(\d{1,3})\s*(jours?|j)\b/);
  if (explicitDays) return clampDays(Number(explicitDays[1]));

  const wordDays = text.match(/\b([a-z]+)\s+jours?\b/);
  if (wordDays && NUMBER_WORDS[wordDays[1]]) return clampDays(NUMBER_WORDS[wordDays[1]]);

  const weeks = text.match(/\b(\d{1,2}|[a-z]+)\s*semaines?\b/);
  if (weeks) {
    const raw = Number(weeks[1]);
    const count = Number.isNaN(raw) ? NUMBER_WORDS[weeks[1]] : raw;
    if (count) return clampDays(count * 7);
  }

  const months = text.match(/\b(\d{1,2}|[a-z]+)\s*mois\b/);
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
  const explicit = text.match(/\b(?:nous sommes|a|à)\s+(\d{1,2})\b/);
  if (explicit) return Math.min(12, Math.max(1, Number(explicit[1])));

  const people = text.match(/\b(\d{1,2}|[a-z]+)\s*personnes?\b/);
  if (people) {
    const raw = Number(people[1]);
    const count = Number.isNaN(raw) ? NUMBER_WORDS[people[1]] : raw;
    if (count) return Math.min(12, count);
  }

  if (/\ben famille\b|\bmes enfants\b|\bnos enfants\b/.test(text)) return 3;
  if (/\bmon (conjoint|mari|epoux)\b|\bma (femme|conjointe|epouse)\b|\ba deux\b|\bà deux\b/.test(text)) return 2;
  if (/\bmes parents\b/.test(text)) return 3;
  if (/\bseule?\b/.test(text)) return 1;

  return null;
}

function readOrigin(text: string): Origin | null {
  if (/\bje (vis|habite|reside) (en|a|à) alger(ie)?\b|\bje suis en algerie\b/.test(text)) return "algerie";
  if (FOREIGN_HINTS.some((hint) => text.includes(hint))) return "etranger";
  if (/\bvenir en algerie\b|\bje viens en algerie\b/.test(text)) return "etranger";
  return null;
}

function readDestination(text: string): string | null {
  const direct = DESTINATIONS.find((d) => text.includes(normalize(d.name)));
  if (direct) return direct.slug;

  // Une wilaya citée rattache à la destination éditoriale la plus proche.
  const wilaya = WILAYAS.find((w) => w.name.length > 4 && text.includes(normalize(w.name)));
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
  if (/\b(premium|haut de gamme|luxe|luxueux|le meilleur|standing)\b/.test(text)) return 3;
  if (/\b(confortable|confort|correct|moyen)\b/.test(text)) return 2;
  return null;
}

function readLanguages(text: string): string[] {
  const found = LANGUAGE_HINTS.filter(([pattern]) => pattern.test(text)).map(([, label]) => label);
  return found.length > 0 ? found : ["Français"];
}

/** Score chaque objectif par nombre de termes déclencheurs présents. */
function readGoals(text: string): GoalId[] {
  const scores = GOALS.map((goal) => {
    let score = 0;
    for (const keyword of goal.keywords) {
      if (!text.includes(keyword)) continue;
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
export function classifyIntent(rawText: string): ClassifiedIntent {
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
      ? `Objectif principal : ${labelOf(goals[0])}`
      : `Objectifs : ${goals.map(labelOf).join(", ")}`,
  );

  if (duration) understood.push(`Durée du séjour : ${duration} jours`);
  else missing.push("Combien de jours souhaitez-vous rester ?");

  if (travellers && travellers > 1) understood.push(`Voyage à ${travellers} personnes`);
  if (origin) understood.push(origin === "etranger" ? "Arrivée depuis l'étranger" : "Vous êtes déjà en Algérie");
  else missing.push("Venez-vous de l'étranger ou êtes-vous déjà en Algérie ?");

  if (destinationSlug) {
    const name = DESTINATIONS.find((d) => d.slug === destinationSlug)?.name;
    if (name) understood.push(`Destination évoquée : ${name}`);
  } else {
    missing.push("Avez-vous une région de préférence ?");
  }

  if (hasRecovery) understood.push("Une période de récupération est à respecter");
  if (budgetTier) understood.push(`Niveau de confort : ${["", "essentiel", "confort", "premium"][budgetTier]}`);

  // Confiance : part des dimensions structurantes effectivement déduites.
  const signals = [duration, travellers, origin, destinationSlug, budgetTier];
  const resolved = signals.filter(Boolean).length;
  const confidence = Math.round(((resolved / signals.length) * 0.6 + 0.4) * 100) / 100;

  return { brief, understood, missing, confidence };
}

function labelOf(id: GoalId): string {
  return GOALS.find((g) => g.id === id)?.label ?? id;
}
