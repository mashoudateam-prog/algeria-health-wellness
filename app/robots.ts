import type { MetadataRoute } from "next";

/**
 * Indexation refusée par défaut.
 *
 * Le catalogue affiché contient des établissements et des praticiens fictifs.
 * Laisser un moteur de recherche indexer « Clinique Ryad, Alger » ferait
 * apparaître un établissement de santé inexistant dans des résultats de
 * recherche, sorti de son contexte et sans le badge DÉMO. Le risque est réel :
 * quelqu'un pourrait chercher à s'y rendre.
 *
 * L'indexation ne s'ouvre que par un geste explicite, une fois le catalogue
 * remplacé par des partenaires vérifiés :
 *
 *     NEXT_PUBLIC_ALLOW_INDEXING=true
 */
export default function robots(): MetadataRoute.Robots {
  const allowed = process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true";

  return allowed
    ? { rules: [{ userAgent: "*", allow: "/" }] }
    : { rules: [{ userAgent: "*", disallow: "/" }] };
}
