import { normalize } from "@/lib/ai/guardrails";
import { query, transaction } from "@/lib/db/client";
import type { NewsCategory, NewsItem, NewsOrigin, NewsStatus } from "@/types/news";
import { canonicalUrl } from "./pipeline";
import type { CollectionRun, NewsStore } from "./store";

/**
 * Entrepôt du fil, adossé à PostgreSQL.
 *
 * Même contrat que l'implémentation en mémoire, à une différence près qui
 * compte : le dédoublonnage est appliqué par la base, via deux index uniques.
 * Deux passages de veille simultanés ne peuvent donc pas insérer le même
 * article — ce qu'un contrôle applicatif seul ne garantissait pas.
 */

interface Ligne extends Record<string, unknown> {
  id: string;
  title: string;
  summary: string;
  category: string;
  status: string;
  origin: string;
  source_name: string;
  source_url: string;
  location_label: string;
  wilaya_code: string | null;
  starts_on: Date | null;
  ends_on: Date | null;
  relevance: number;
  notes: string[];
  demo: boolean;
  collected_at: Date;
}

function versItem(ligne: Ligne): NewsItem {
  return {
    id: ligne.id,
    title: ligne.title,
    summary: ligne.summary,
    category: ligne.category as NewsCategory,
    status: ligne.status as NewsStatus,
    origin: ligne.origin as NewsOrigin,
    sourceName: ligne.source_name,
    sourceUrl: ligne.source_url,
    locationLabel: ligne.location_label,
    wilayaCode: ligne.wilaya_code,
    startsOn: ligne.starts_on ? isoJour(ligne.starts_on) : null,
    endsOn: ligne.ends_on ? isoJour(ligne.ends_on) : null,
    relevance: ligne.relevance,
    notes: ligne.notes ?? [],
    demo: ligne.demo,
    collectedAt: ligne.collected_at.toISOString(),
  };
}

/** Une date de calendrier, sans heure : le fuseau du serveur ne doit pas la décaler. */
function isoJour(valeur: Date): string {
  return valeur.toISOString().slice(0, 10);
}

const COLONNES = `id, title, summary, category, status, origin, source_name, source_url,
  location_label, wilaya_code, starts_on, ends_on, relevance, notes, demo, collected_at`;

export class PostgresNewsStore implements NewsStore {
  async list(status?: NewsStatus): Promise<NewsItem[]> {
    const lignes = status
      ? await query<Ligne>(
          `SELECT ${COLONNES} FROM news_items WHERE status = $1
           ORDER BY relevance DESC, collected_at DESC`,
          [status],
        )
      : await query<Ligne>(
          `SELECT ${COLONNES} FROM news_items ORDER BY relevance DESC, collected_at DESC`,
        );
    return lignes.map(versItem);
  }

  async add(incoming: NewsItem[]): Promise<{ added: number; skipped: number }> {
    if (incoming.length === 0) return { added: 0, skipped: 0 };

    return transaction(async (client) => {
      let added = 0;
      let skipped = 0;

      for (const item of incoming) {
        // ON CONFLICT DO NOTHING sur les deux index uniques : la base tranche,
        // et le nombre de lignes renvoyées dit si l'insertion a eu lieu.
        const resultat = await client.query(
          `INSERT INTO news_items (
             ${COLONNES}, canonical_url, title_key
           ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)
           ON CONFLICT DO NOTHING
           RETURNING id`,
          [
            item.id,
            item.title,
            item.summary,
            item.category,
            item.status,
            item.origin,
            item.sourceName,
            item.sourceUrl,
            item.locationLabel,
            item.wilayaCode,
            item.startsOn,
            item.endsOn,
            item.relevance,
            JSON.stringify(item.notes ?? []),
            item.demo,
            item.collectedAt,
            canonicalUrl(item.sourceUrl),
            normalize(item.title),
          ],
        );

        if (resultat.rowCount && resultat.rowCount > 0) added += 1;
        else skipped += 1;
      }

      return { added, skipped };
    });
  }

  async setStatus(id: string, status: NewsStatus): Promise<NewsItem | null> {
    const lignes = await query<Ligne>(
      `UPDATE news_items SET status = $2 WHERE id = $1 RETURNING ${COLONNES}`,
      [id, status],
    );
    return lignes[0] ? versItem(lignes[0]) : null;
  }

  async knownUrls(): Promise<Set<string>> {
    const lignes = await query<{ canonical_url: string }>(`SELECT canonical_url FROM news_items`);
    return new Set(lignes.map((l) => l.canonical_url));
  }

  async knownTitles(): Promise<Set<string>> {
    const lignes = await query<{ title_key: string }>(`SELECT title_key FROM news_items`);
    return new Set(lignes.map((l) => l.title_key));
  }

  async lastRun(): Promise<CollectionRun | null> {
    const lignes = await query<{ payload: CollectionRun }>(
      `SELECT payload FROM collection_runs ORDER BY ran_at DESC LIMIT 1`,
    );
    return lignes[0]?.payload ?? null;
  }

  async recordRun(run: CollectionRun): Promise<void> {
    await query(`INSERT INTO collection_runs (payload) VALUES ($1)`, [JSON.stringify(run)]);
    // On garde une fenêtre de traçabilité, pas un journal infini.
    await query(
      `DELETE FROM collection_runs WHERE id NOT IN (
         SELECT id FROM collection_runs ORDER BY ran_at DESC LIMIT 50
       )`,
    );
  }
}
