import type { NewsItem, NewsStatus } from "@/types/news";

/**
 * Entrepôt du fil d'actualité.
 *
 * ⚠️ Implémentation en mémoire du processus. Elle suffit à faire fonctionner
 * et démontrer toute la chaîne, mais elle ne persiste pas : sur un hébergement
 * sans état, chaque instance a la sienne et un redémarrage remet le compteur à
 * zéro. Les décisions de modération ne survivront donc pas au déploiement
 * suivant tant que la base PostgreSQL n'est pas branchée.
 *
 * L'interface `NewsStore` existe précisément pour que ce remplacement ne
 * touche à rien d'autre : une implémentation Prisma, et le reste ne bouge pas.
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

/**
 * En développement, le rechargement à chaud réinstancie les modules : sans
 * cette accroche sur l'objet global, l'entrepôt serait vidé à chaque édition.
 */
const globalForStore = globalThis as unknown as { __newsStore?: NewsStore };

export const newsStore: NewsStore = globalForStore.__newsStore ?? new MemoryStore();
if (process.env.NODE_ENV !== "production") globalForStore.__newsStore = newsStore;
