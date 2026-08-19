import { FEED_SOURCES, SEARCH_QUERIES } from "@/data/news-sources";
import type { NewsItem, RawItem } from "@/types/news";
import { evaluateGates, toNewsItem } from "./pipeline";
import { readFeed } from "./rss";
import { newsStore, type CollectionRun } from "./store";

/**
 * Agent de veille.
 *
 * Il ramasse, filtre et PROPOSE. Il ne publie jamais : tout ce qui sort d'ici
 * entre en file de modération avec le statut « proposé ». C'est la contrainte
 * qui rend l'automatisation acceptable sur une plateforme de santé — une
 * information fausse coûte infiniment plus cher qu'une information manquante.
 */

/* ------------------------------------------------------------------ */
/* Collecteur : recherche web                                          */
/* ------------------------------------------------------------------ */

interface BraveResult {
  title?: string;
  url?: string;
  description?: string;
  age?: string;
}

/**
 * Recherche web via l'API Brave. Inactif sans clé : la veille se limite alors
 * aux flux et aux soumissions de partenaires, sans rien casser.
 */
async function collectFromSearch(): Promise<{ items: RawItem[]; error?: string }> {
  const key = process.env.BRAVE_SEARCH_API_KEY;
  if (!key) return { items: [] };

  const items: RawItem[] = [];

  for (const query of SEARCH_QUERIES) {
    try {
      const url = new URL("https://api.search.brave.com/res/v1/web/search");
      url.searchParams.set("q", query);
      url.searchParams.set("count", "10");
      url.searchParams.set("country", "dz");
      url.searchParams.set("search_lang", "fr");
      // Ne remonter que ce qui est récent : une ouverture d'il y a trois ans
      // n'est pas une actualité.
      url.searchParams.set("freshness", "pm");

      const response = await fetch(url, {
        headers: { Accept: "application/json", "X-Subscription-Token": key },
        cache: "no-store",
      });

      if (!response.ok) continue;

      const payload = (await response.json()) as { web?: { results?: BraveResult[] } };
      for (const result of payload.web?.results ?? []) {
        if (!result.title || !result.url) continue;
        items.push({
          title: result.title,
          text: result.description ?? "",
          url: result.url,
          sourceName: hostOf(result.url),
          origin: "recherche",
          publishedAt: result.age,
        });
      }
    } catch {
      // Une requête qui échoue ne doit pas interrompre les autres.
    }
  }

  return { items };
}

function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "source web";
  }
}

/* ------------------------------------------------------------------ */
/* Orchestration                                                       */
/* ------------------------------------------------------------------ */

export interface CollectOutcome {
  run: CollectionRun;
  proposals: NewsItem[];
}

export async function runCollection(reference = new Date()): Promise<CollectOutcome> {
  const sources: CollectionRun["sources"] = [];
  const raw: RawItem[] = [];

  // 1. Flux de presse, en parallèle.
  const feeds = await Promise.all(
    FEED_SOURCES.map(async (source) => ({ source, result: await readFeed(source.url, source.label) })),
  );

  for (const { source, result } of feeds) {
    sources.push({ label: source.label, collected: result.items.length, error: result.error });
    raw.push(...result.items);
  }

  // 2. Recherche web, si une clé est configurée.
  const search = await collectFromSearch();
  if (process.env.BRAVE_SEARCH_API_KEY) {
    sources.push({ label: "Recherche web", collected: search.items.length, error: search.error });
    raw.push(...search.items);
  }

  // 3. Filtres déterministes, avec détection de doublons au fil de l'eau.
  const context = {
    seenUrls: await newsStore.knownUrls(),
    seenTitles: await newsStore.knownTitles(),
  };

  const proposals: NewsItem[] = [];
  const rejectionReasons: Record<string, number> = {};
  let rejected = 0;

  for (const item of raw) {
    const gate = evaluateGates(item, context);
    if (!gate.accepted) {
      rejected += 1;
      for (const reason of gate.reasons) {
        // Regrouper les motifs chiffrés sous une même étiquette lisible.
        const label = reason.replace(/\(\d+\/\d+\)/, "").trim();
        rejectionReasons[label] = (rejectionReasons[label] ?? 0) + 1;
      }
      continue;
    }

    const proposal = toNewsItem(item, reference);
    proposals.push(proposal);
    context.seenUrls.add(proposal.sourceUrl);
    context.seenTitles.add(proposal.title.toLowerCase());
  }

  const { added } = await newsStore.add(proposals);

  const run: CollectionRun = {
    at: reference.toISOString(),
    sources,
    proposed: added,
    rejected,
    rejectionReasons,
  };

  await newsStore.recordRun(run);
  return { run, proposals };
}
