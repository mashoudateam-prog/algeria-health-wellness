import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Direction artistique — résolution des visuels.
 *
 * Le parti pris est explicite : plutôt que de remplir l'interface d'images
 * générées, la plateforme affiche par défaut des *planches éditoriales*
 * composées en CSS, clairement identifiées comme des emplacements réservés.
 *
 * Pour passer en photographie réelle, déposez un fichier dans
 * `public/photos/<slug>.jpg` (ou .jpeg / .png / .webp). Il est repris
 * automatiquement, sans modification de code.
 *
 * N'utilisez que des visuels dont vous détenez les droits, avec autorisation
 * des personnes représentées — voir la section Direction artistique du README.
 */

const EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

const cache = new Map<string, string | null>();

export function resolvePhoto(slug: string): string | null {
  const cached = cache.get(slug);
  if (cached !== undefined) return cached;

  const directory = path.join(process.cwd(), "public", "photos");
  const found =
    EXTENSIONS.map((extension) => `${slug}${extension}`).find((filename) =>
      existsSync(path.join(directory, filename)),
    ) ?? null;

  const url = found ? `/photos/${found}` : null;
  cache.set(slug, url);
  return url;
}
