/**
 * Photothèque — photographies réelles de l'Algérie.
 *
 * Chaque image a été vérifiée individuellement sur sa page d'origine : la
 * localisation déclarée par le photographe est reproduite ci-dessous et
 * AFFICHÉE sur le site. Un visiteur étranger doit pouvoir savoir où il regarde.
 *
 * Cette vérification n'est pas une précaution théorique : une image proposée
 * pour Ghardaïa s'est révélée être une vue de Fès, au Maroc. Elle a été écartée.
 *
 * Licence Unsplash : usage commercial autorisé, sans attribution obligatoire.
 * Nous créditons quand même les photographes — ce sont très majoritairement des
 * Algériens qui photographient leur pays, et c'est la moindre des choses.
 *
 * ⚠️ Pour remplacer une image : déposez simplement `public/photos/<slug>.jpg`.
 * Le fichier local est toujours prioritaire sur l'entrée distante ci-dessous.
 */

export interface Photo {
  /** Identifiant du fichier sur le CDN Unsplash. */
  id: string;
  alt: string;
  photographer: string;
  /** Localisation déclarée par le photographe, affichée telle quelle. */
  location: string;
  /** Page d'origine, pour retrouver la source et la licence. */
  source: string;
  /**
   * L'image illustre la région sans montrer exactement la ville concernée.
   * L'interface affiche alors la localisation réelle, sans ambiguïté.
   */
  approximate?: boolean;
}

export const PHOTOS: Record<string, Photo> = {
  "hero-algerie": {
    id: "photo-1685150351422-6aea639e39f5",
    alt: "Baie encerclée de montagnes sur le littoral de Béjaïa, en Algérie",
    photographer: "Ramzi Belaidi",
    location: "Béjaïa, Algérie",
    source: "https://unsplash.com/photos/RXbT4d5EBLk",
  },
  alger: {
    id: "photo-1642215104060-86e252b2cb69",
    alt: "Alger au coucher du soleil, la ville face à la Méditerranée",
    photographer: "abderrahmane chablaoui",
    location: "Alger, Algérie",
    source: "https://unsplash.com/photos/xyONOpOAmuo",
  },
  oran: {
    id: "photo-1723226268726-9b1b74e045eb",
    alt: "Oran et son port vus depuis les hauteurs",
    photographer: "Deeja",
    location: "Oran, Algérie",
    source: "https://unsplash.com/photos/XbkpV8dFXD8",
  },
  constantine: {
    id: "photo-1664403775784-8a0b32536a0c",
    alt: "Un pont de Constantine franchissant les gorges du Rhummel",
    photographer: "zenad nabil",
    location: "Constantine, Algérie",
    source: "https://unsplash.com/photos/fvqCkzsWv-4",
  },
  tlemcen: {
    id: "photo-1669097564242-3c6c75aea9a0",
    alt: "Le minaret de Mansourah, vestige de quarante mètres près de Tlemcen",
    photographer: "Halima Bouchouicha",
    location: "Mansourah, Tlemcen, Algérie",
    source: "https://unsplash.com/photos/ysL_MNXjJ_4",
  },
  bejaia: {
    id: "photo-1630838791030-dc18ef6c897c",
    alt: "Montagne verte plongeant dans la mer sur la corniche de Béjaïa",
    photographer: "Halima Bouchouicha",
    location: "Béjaïa, Algérie",
    source: "https://unsplash.com/photos/wQSxHQa6Tho",
  },
  annaba: {
    id: "photo-1750587695609-3050d7815f71",
    alt: "Plage d'Annaba par temps clair, la ville en arrière-plan",
    photographer: "Ondrej Bocek",
    location: "Annaba, Algérie",
    source: "https://unsplash.com/photos/BGoHdcpIXkI",
  },
  biskra: {
    id: "photo-1628491097588-638300689372",
    alt: "Palmeraie du Sahara algérien sous un ciel dégagé, à Taghit",
    photographer: "Halima Bouchouicha",
    // Taghit se trouve dans la wilaya de Béchar, pas à Biskra. L'image évoque
    // le Sud saharien et sa localisation réelle est affichée sous la photo.
    location: "Taghit, Algérie",
    source: "https://unsplash.com/photos/v9MYNk3HMeM",
    approximate: true,
  },
  ghardaia: {
    id: "photo-1660576168403-2208b482d6f5",
    alt: "Vue d'ensemble de Ghardaïa, dans la vallée du M'Zab",
    photographer: "Tarek Nacer",
    location: "Ghardaïa, Algérie",
    source: "https://unsplash.com/photos/P45yY76TKiw",
  },
  sahara: {
    id: "photo-1632257996200-cb89e88cac8d",
    alt: "Formations rocheuses du Tassili du Hoggar, dans le Sahara algérien",
    photographer: "Azzedine Rouichi",
    location: "Tassili du Hoggar, Algérie",
    source: "https://unsplash.com/photos/ySijdi3dK10",
  },
};

const CDN = "https://images.unsplash.com";

/** URL d'une image à une largeur donnée. Le CDN redimensionne à la volée. */
export function photoUrl(photo: Photo, width: number): string {
  return `${CDN}/${photo.id}?auto=format&fit=crop&q=72&w=${width}`;
}

/** Jeu de largeurs pour le `srcset` : le navigateur choisit la bonne. */
export const WIDTHS = [768, 1100, 1500, 2000, 2600] as const;

export function photoSrcSet(photo: Photo): string {
  return WIDTHS.map((width) => `${photoUrl(photo, width)} ${width}w`).join(", ");
}
