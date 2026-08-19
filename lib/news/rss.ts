import type { RawItem } from "@/types/news";

/**
 * Lecteur RSS / Atom, sans dépendance.
 *
 * Une bibliothèque de parsing XML complète serait excessive ici : on lit des
 * flux publics dont on n'extrait que cinq champs. Le format est ancien et
 * stable, et un parseur ciblé se relit en une minute — ce qui compte quand
 * une source change de forme sans prévenir.
 *
 * Le contenu récupéré est du texte fourni par des tiers : il est nettoyé de
 * son balisage ici, et n'est jamais inséré en HTML brut côté interface.
 */

/** Extrait le contenu du premier élément `<tag>` trouvé dans un fragment. */
function tag(fragment: string, name: string): string {
  const match = fragment.match(
    new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"),
  );
  return match ? clean(match[1]) : "";
}

/** Atom place souvent l'adresse dans un attribut plutôt que dans le texte. */
function atomLink(fragment: string): string {
  const alternate = fragment.match(
    /<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i,
  );
  if (alternate) return clean(alternate[1]);

  const any = fragment.match(/<link[^>]*href=["']([^"']+)["']/i);
  return any ? clean(any[1]) : "";
}

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
  "&laquo;": "«",
  "&raquo;": "»",
  "&rsquo;": "’",
  "&eacute;": "é",
  "&egrave;": "è",
  "&agrave;": "à",
  "&ccedil;": "ç",
  "&ocirc;": "ô",
  "&hellip;": "…",
};

function clean(value: string): string {
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&[a-z]+;/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? " ")
    .replace(/\s+/g, " ")
    .trim();
}

export interface FeedResult {
  items: RawItem[];
  /** Renseigné quand la source n'a pas pu être lue. Remonté à la modération. */
  error?: string;
}

const MAX_ITEMS_PER_FEED = 30;
const TIMEOUT_MS = 12_000;

export async function readFeed(
  url: string,
  sourceName: string,
): Promise<FeedResult> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Se présenter honnêtement : un éditeur doit pouvoir nous identifier
        // dans ses journaux, et nous bloquer s'il le souhaite.
        "User-Agent": "AlgeriaHealthWellness/1.0 (veille editoriale; +https://algeria-health-wellness.vercel.app)",
        Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
      },
      cache: "no-store",
    }).finally(() => clearTimeout(timer));

    if (!response.ok) return { items: [], error: `HTTP ${response.status}` };

    const xml = await response.text();
    const blocks = [
      ...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi),
      ...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi),
    ];

    if (blocks.length === 0) return { items: [], error: "aucun élément lisible" };

    const items: RawItem[] = [];
    for (const block of blocks.slice(0, MAX_ITEMS_PER_FEED)) {
      const fragment = block[1];
      const title = tag(fragment, "title");
      const link = tag(fragment, "link") || atomLink(fragment);
      if (!title || !link) continue;

      items.push({
        title,
        text: tag(fragment, "description") || tag(fragment, "summary") || tag(fragment, "content"),
        url: link,
        sourceName,
        origin: "rss",
        publishedAt: tag(fragment, "pubDate") || tag(fragment, "updated") || tag(fragment, "published"),
      });
    }

    return { items };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "erreur inconnue";
    return { items: [], error: reason.includes("abort") ? "délai dépassé" : reason };
  }
}
