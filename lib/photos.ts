import { existsSync } from "node:fs";
import path from "node:path";
import { PHOTOS, type Photo, photoSrcSet, photoUrl } from "@/data/photos";

/**
 * Résolution des visuels, par ordre de priorité :
 *
 *   1. un fichier déposé dans `public/photos/<slug>.jpg` — vos propres images ;
 *   2. la photothèque vérifiée de `data/photos.ts` ;
 *   3. à défaut, une planche éditoriale composée en CSS.
 *
 * Déposer un fichier local suffit donc à remplacer une image, sans toucher au
 * code. C'est le chemin prévu pour vos photographies sous licence.
 */

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

const localCache = new Map<string, string | null>();

function resolveLocal(slug: string): string | null {
  const cached = localCache.get(slug);
  if (cached !== undefined) return cached;

  const directory = path.join(process.cwd(), "public", "photos");
  const found =
    EXTENSIONS.map((extension) => `${slug}${extension}`).find((filename) =>
      existsSync(path.join(directory, filename)),
    ) ?? null;

  const url = found ? `/photos/${found}` : null;
  localCache.set(slug, url);
  return url;
}

export interface ResolvedImage {
  src: string;
  srcSet?: string;
  alt: string;
  /** Ligne de crédit affichée sous l'image. Absente pour un fichier local. */
  credit?: { photographer: string; location: string; source: string; approximate: boolean };
}

export function resolveImage(slug: string, fallbackAlt: string): ResolvedImage | null {
  const local = resolveLocal(slug);
  if (local) return { src: local, alt: fallbackAlt };

  const photo: Photo | undefined = PHOTOS[slug];
  if (!photo) return null;

  return {
    src: photoUrl(photo, 1800),
    srcSet: photoSrcSet(photo),
    alt: photo.alt,
    credit: {
      photographer: photo.photographer,
      location: photo.location,
      source: photo.source,
      approximate: photo.approximate ?? false,
    },
  };
}
