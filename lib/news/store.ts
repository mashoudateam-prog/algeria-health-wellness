import type { NewsItem, NewsStatus } from "@/types/news";

/**
 * Entrepôt du fil d'actualité.
 *
 * Deux implémentations derrière un seul contrat.
 *
 * Avec `DATABASE_URL`, les décisions de modération survivent au déploiement
 * et le dédoublonnage est arbitré par la base. Sans elle, l'entrepôt vit en
 * mémoire du processus : la chaîne complète reste démontrable, mais rien ne
 * survit à un redémarrage — et la page de modération le dit.
 *
 * Le choix se fait au démarrage et ne se devine pas : `storageMode()` le
 * rend lisible depuis l'interface.
 */

export interface NewsStore {
  list(status?: NewsStatus): Promise<NewsItem[]>;
  add(items: NewsItem[]): Promise<{ added: number; skipped: number }>;
  setStatus(id: string, status: NewsStatus): Promise<NewsItem | null>;
  knownUrls(): Promise<Set<string>>;
  knownTitles(): Promise<Set<string>>;
  lastRun(): Promise<CollectionRun | null>;
  recordRun(run: CollectionRun): Promise<void>;
}

/** Compte rendu d'un passage de collecte, affiché à la modération. */
export interface CollectionRun {
  at: string;
  sources: Array<{ label: string; collected: number; error?: string }>;
  proposed: number;
  rejected: number;
  rejectionReasons: Record<string, number>;
}

import { canonicalUrl } from "./pipeline";
import { normalize } from "@/lib/ai/guardrails";
import { databaseConfigured } from "@/lib/db/client";
import { DEMO_NEWS } from "@/data/news-demo";

class MemoryStore implements NewsStore {
  private items: NewsItem[] = [...DEMO_NEWS];
  private run: CollectionRun | null = null;

  async list(status?: NewsStatus): Promise<NewsItem[]> {
    const rows = status ? this.items.filter((item) => item.status === status) : [...this.items];
    return rows.sort((a, b) => {
      // Les plus pertinents d'abord, puis les plus récents.
      if (b.relevance !== a.relevance) return b.relevance - a.relevance;
      return b.collectedAt.localeCompare(a.collectedAt);
    });
  }

  async add(incoming: NewsItem[]): Promise<{ added: number; skipped: number }> {
    const urls = await this.knownUrls();
    const titles = await this.knownTitles();

    let added = 0;
    let skipped = 0;

    for (const item of incoming) {
      const url = canonicalUrl(item.sourceUrl);
      const title = normalize(item.title);
      if (urls.has(url) || titles.has(title)) {
        skipped += 1;
        continue;
      }
      this.items.push(item);
      urls.add(url);
      titles.add(title);
      added += 1;
    }

    // Borne de sécurité : la mémoire d'un processus n'est pas une base.
    if (this.items.length > 500) this.items = this.items.slice(-500);

    return { added, skipped };
  }

  async setStatus(id: string, status: NewsStatus): Promise<NewsItem | null> {
    const item = this.items.find((entry) => entry.id === id);
    if (!item) return null;
    item.status = status;
    return item;
  }

  async knownUrls(): Promise<Set<string>> {
    return new Set(this.items.map((item) => canonicalUrl(item.sourceUrl)));
  }

  async knownTitles(): Promise<Set<string>> {
    return new Set(this.items.map((item) => normalize(item.title)));
  }

  async lastRun(): Promise<CollectionRun | null> {
    return this.run;
  }

  async recordRun(run: CollectionRun): Promise<void> {
    this.run = run;
  }
}

/** Ce sur quoi l'entrepôt repose réellement, pour l'afficher sans mentir. */
export type StorageMode = "postgres" | "memoire";

export function storageMode(): StorageMode {
  return databaseConfigured() ? "postgres" : "memoire";
}

/**
 * En développement, le rechargement à chaud réinstancie les modules : sans
 * cette accroche sur l'objet global, l'entrepôt en mémoire serait vidé à
 * chaque édition.
 */
const globalForStore = globalThis as unknown as { __newsStore?: NewsStore };

function createStore(): NewsStore {
  if (databaseConfigured()) {
    // Import différé : sans base, le pilote n'est jamais chargé.
    const { PostgresNewsStore } = require("./store-postgres") as typeof import("./store-postgres");
    return new PostgresNewsStore();
  }
  return new MemoryStore();
}

export const newsStore: NewsStore = globalForStore.__newsStore ?? createStore();
if (process.env.NODE_ENV !== "production") globalForStore.__newsStore = newsStore;
