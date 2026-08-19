import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Médias immersifs.
 *
 * Aucun manifeste à tenir à jour : on regarde ce qui existe sur le disque.
 * Déposez un fichier, il apparaît. Retirez-le, il disparaît.
 *
 *   public/immersive/<slug>-360.jpg      panorama équirectangulaire (2:1)
 *   public/immersive/<slug>.mp4          vidéo
 *   public/immersive/<slug>-poster.jpg   affiche de la vidéo
 *   public/immersive/<slug>.glb          modèle 3D (export NeRF, photogrammétrie)
 *
 * Comment produire ces fichiers, sans matériel professionnel :
 *   · panorama  → mode photosphère d'un téléphone Android, ou caméra 360 ;
 *   · modèle 3D → Luma AI ou Polycam, gratuits, capture au téléphone,
 *                 puis export au format .glb.
 */

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov"] as const;
const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"] as const;

export interface ImmersiveAssets {
  panorama: string | null;
  video: string | null;
  poster: string | null;
  model: string | null;
}

const cache = new Map<string, ImmersiveAssets>();

function findFile(directory: string, names: string[]): string | null {
  const found = names.find((name) => existsSync(path.join(directory, name)));
  return found ? `/immersive/${found}` : null;
}

export function resolveImmersive(slug: string): ImmersiveAssets {
  const cached = cache.get(slug);
  if (cached) return cached;

  const directory = path.join(process.cwd(), "public", "immersive");

  const assets: ImmersiveAssets = {
    panorama: findFile(directory, IMAGE_EXTENSIONS.map((ext) => `${slug}-360${ext}`)),
    video: findFile(directory, VIDEO_EXTENSIONS.map((ext) => `${slug}${ext}`)),
    poster: findFile(directory, IMAGE_EXTENSIONS.map((ext) => `${slug}-poster${ext}`)),
    model: findFile(directory, [`${slug}.glb`, `${slug}.gltf`]),
  };

  cache.set(slug, assets);
  return assets;
}

/** Vrai si au moins un média immersif existe pour ce slug. */
export function hasImmersive(slug: string): boolean {
  const assets = resolveImmersive(slug);
  return Boolean(assets.panorama || assets.video || assets.model);
}
