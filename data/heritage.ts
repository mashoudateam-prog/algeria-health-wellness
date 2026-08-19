import type { Region } from "@/types/domain";

/**
 * Patrimoine algérien.
 *
 * Les sept premiers sites sont inscrits au patrimoine mondial de l'UNESCO :
 * ce sont des faits vérifiables, avec leur année d'inscription. Les suivants
 * sont des lieux majeurs largement documentés, signalés comme tels.
 *
 * Aucun horaire, aucun tarif, aucune durée de visite officielle n'est indiqué :
 * ces informations changent et nous ne les avons pas à jour. Les durées données
 * sont des estimations de confort, présentées comme telles.
 */

export type HeritageKind = "unesco" | "site-majeur";

/** Effort demandé par la visite — c'est ce qui permet de la placer dans un parcours. */
export type HeritageEffort = "contemplatif" | "marche-douce" | "marche-soutenue";

export interface HeritageSite {
  slug: string;
  name: string;
  kind: HeritageKind;
  /** Année d'inscription au patrimoine mondial, pour les sites UNESCO. */
  inscribedIn?: number;
  wilayaCode: string;
  wilayaName: string;
  region: Region;
  /** Destination santé la plus proche, pour rattacher le site à un séjour. */
  nearestDestination: string;
  /** Distance routière approximative depuis cette destination, en kilomètres. */
  distanceKm: number;
  summary: string;
  /** Ce qu'on y voit concrètement. */
  highlights: string[];
  effort: HeritageEffort;
  /** Durée de visite confortable, en heures. Estimation, pas une règle. */
  hours: number;
  /** Saison la plus agréable, quand le climat pèse vraiment. */
  bestSeason?: string;
}

export const HERITAGE_SITES: HeritageSite[] = [
  {
    slug: "casbah-alger",
    name: "Casbah d'Alger",
    kind: "unesco",
    inscribedIn: 1992,
    wilayaCode: "16",
    wilayaName: "Alger",
    region: "littoral",
    nearestDestination: "alger",
    distanceKm: 0,
    summary:
      "La médina ottomane d'Alger, bâtie en amphithéâtre au-dessus de la baie. Un enchevêtrement de ruelles, de passages couverts et de maisons à patio, encore habité.",
    highlights: [
      "Palais et maisons à patio de l'époque ottomane",
      "Ruelles en escalier ouvrant sur la baie",
      "Mosquée Ketchaoua",
      "Vie de quartier, loin de toute mise en scène",
    ],
    effort: "marche-soutenue",
    hours: 3,
  },
  {
    slug: "tipasa",
    name: "Tipasa",
    kind: "unesco",
    inscribedIn: 1982,
    wilayaCode: "42",
    wilayaName: "Tipaza",
    region: "littoral",
    nearestDestination: "alger",
    distanceKm: 70,
    summary:
      "Un site antique posé directement sur la Méditerranée, où se superposent vestiges puniques, romains et paléochrétiens, face à la mer.",
    highlights: [
      "Basiliques et thermes romains en bord de mer",
      "Théâtre antique",
      "Nécropole paléochrétienne",
      "Tombeau de la Chrétienne, à proximité",
    ],
    effort: "marche-douce",
    hours: 3,
    bestSeason: "Avril à juin, septembre à octobre",
  },
  {
    slug: "djemila",
    name: "Djémila",
    kind: "unesco",
    inscribedIn: 1982,
    wilayaCode: "19",
    wilayaName: "Sétif",
    region: "hauts-plateaux",
    nearestDestination: "constantine",
    distanceKm: 120,
    summary:
      "L'antique Cuicul, ville romaine de montagne à 900 mètres d'altitude, remarquable pour son adaptation au relief plutôt qu'au plan orthogonal habituel.",
    highlights: [
      "Forum et arc de Caracalla",
      "Théâtre adossé à la pente",
      "Mosaïques du musée de site",
      "Quartier chrétien et baptistère",
    ],
    effort: "marche-douce",
    hours: 3,
    bestSeason: "Printemps et automne — l'été y est très chaud",
  },
  {
    slug: "timgad",
    name: "Timgad",
    kind: "unesco",
    inscribedIn: 1982,
    wilayaCode: "05",
    wilayaName: "Batna",
    region: "hauts-plateaux",
    nearestDestination: "constantine",
    distanceKm: 160,
    summary:
      "Colonie militaire fondée par Trajan vers l'an 100, souvent citée comme l'exemple le plus complet d'urbanisme romain en damier conservé.",
    highlights: [
      "Plan en damier lisible d'un seul regard",
      "Arc de Trajan",
      "Bibliothèque publique antique",
      "Thermes et théâtre de 3 500 places",
    ],
    effort: "marche-soutenue",
    hours: 4,
    bestSeason: "Printemps et automne — peu d'ombre sur le site",
  },
  {
    slug: "vallee-mzab",
    name: "Vallée du M'Zab",
    kind: "unesco",
    inscribedIn: 1982,
    wilayaCode: "47",
    wilayaName: "Ghardaïa",
    region: "sud",
    nearestDestination: "ghardaia",
    distanceKm: 0,
    summary:
      "Cinq cités fortifiées construites à partir du XIᵉ siècle dans une vallée du Sahara. Un ensemble souvent cité comme modèle d'architecture adaptée au désert.",
    highlights: [
      "Les cinq ksour étagés de la vallée",
      "Beni Isguen et son architecture",
      "Palmeraies et système d'irrigation traditionnel",
      "Marché de Ghardaïa",
    ],
    effort: "marche-douce",
    hours: 4,
    bestSeason: "Octobre à avril",
  },
  {
    slug: "tassili-najjer",
    name: "Tassili n'Ajjer",
    kind: "unesco",
    inscribedIn: 1982,
    wilayaCode: "33",
    wilayaName: "Illizi",
    region: "grand-sud",
    nearestDestination: "ghardaia",
    distanceKm: 1200,
    summary:
      "Un plateau de grès du Sahara central, réputé pour ses milliers de peintures et gravures rupestres et pour ses forêts de pierre. Site à la fois culturel et naturel.",
    highlights: [
      "Art rupestre couvrant plusieurs millénaires",
      "Formations de grès sculptées par l'érosion",
      "Cyprès du Tassili, parmi les arbres les plus âgés du monde",
      "Ciels nocturnes d'une rare pureté",
    ],
    effort: "marche-soutenue",
    hours: 48,
    bestSeason: "Novembre à mars — expédition organisée obligatoire",
  },
  {
    slug: "qalaa-beni-hammad",
    name: "Qal'a des Beni Hammad",
    kind: "unesco",
    inscribedIn: 1980,
    wilayaCode: "28",
    wilayaName: "M'Sila",
    region: "hauts-plateaux",
    nearestDestination: "constantine",
    distanceKm: 200,
    summary:
      "Première capitale des Hammadides, fondée en 1007 puis abandonnée. Ses ruines, à mille mètres d'altitude, conservent le plus grand minaret d'Algérie.",
    highlights: [
      "Minaret de la grande mosquée, 25 mètres",
      "Vestiges du palais et des bassins",
      "Site de montagne peu fréquenté",
    ],
    effort: "marche-douce",
    hours: 3,
    bestSeason: "Printemps et automne",
  },

  /* ---------------------- Sites majeurs, hors UNESCO ---------------------- */
  {
    slug: "mansourah-tlemcen",
    name: "Mansourah",
    kind: "site-majeur",
    wilayaCode: "13",
    wilayaName: "Tlemcen",
    region: "hauts-plateaux",
    nearestDestination: "tlemcen",
    distanceKm: 3,
    summary:
      "Les vestiges d'une ville de siège du XIVᵉ siècle, dominés par un minaret de quarante mètres dont une face s'est effondrée, laissant la structure ouverte.",
    highlights: [
      "Minaret de 40 mètres, ouvert sur sa coupe",
      "Enceinte de la ville de siège",
      "Proximité immédiate de Tlemcen",
    ],
    effort: "marche-douce",
    hours: 2,
  },
  {
    slug: "hippone-annaba",
    name: "Hippone",
    kind: "site-majeur",
    wilayaCode: "23",
    wilayaName: "Annaba",
    region: "littoral",
    nearestDestination: "annaba",
    distanceKm: 3,
    summary:
      "La cité antique où vécut Augustin, aujourd'hui site archéologique au pied de la basilique qui porte son nom, avec vue sur le golfe.",
    highlights: [
      "Forum et villas romaines",
      "Basilique Saint-Augustin en surplomb",
      "Musée de site",
    ],
    effort: "marche-douce",
    hours: 2,
  },
  {
    slug: "gorges-ghoufi",
    name: "Balcons de Ghoufi",
    kind: "site-majeur",
    wilayaCode: "07",
    wilayaName: "Biskra",
    region: "sud",
    nearestDestination: "biskra",
    distanceKm: 80,
    summary:
      "Un canyon des Aurès où l'habitat troglodytique s'accroche à la paroi, au-dessus d'une palmeraie encaissée.",
    highlights: [
      "Habitations creusées dans la falaise",
      "Palmeraie au fond du canyon",
      "Belvédères aménagés",
    ],
    effort: "marche-soutenue",
    hours: 3,
    bestSeason: "Octobre à avril",
  },
  {
    slug: "gouraya-bejaia",
    name: "Parc national de Gouraya",
    kind: "site-majeur",
    wilayaCode: "06",
    wilayaName: "Béjaïa",
    region: "littoral",
    nearestDestination: "bejaia",
    distanceKm: 5,
    summary:
      "Un massif boisé qui tombe dans la Méditerranée, avec ses criques, son cap et son fort en surplomb de la baie.",
    highlights: [
      "Cap Carbon et son phare",
      "Fort de Gouraya, en belvédère",
      "Criques de la Corniche",
    ],
    effort: "marche-soutenue",
    hours: 4,
  },
  {
    slug: "santa-cruz-oran",
    name: "Fort de Santa Cruz",
    kind: "site-majeur",
    wilayaCode: "31",
    wilayaName: "Oran",
    region: "littoral",
    nearestDestination: "oran",
    distanceKm: 6,
    summary:
      "Une forteresse espagnole du XVIᵉ siècle perchée sur le mont Murdjadjo, d'où l'on embrasse tout le golfe d'Oran.",
    highlights: [
      "Panorama sur la baie et la ville",
      "Chapelle de Santa Cruz",
      "Accès par route ou par sentier",
    ],
    effort: "marche-douce",
    hours: 2,
  },
];

export const HERITAGE_BY_SLUG = new Map(HERITAGE_SITES.map((site) => [site.slug, site]));

/** Sites rattachés à une destination, du plus proche au plus lointain. */
export function heritageNear(destinationSlug: string, maxKm = 250): HeritageSite[] {
  return HERITAGE_SITES.filter(
    (site) => site.nearestDestination === destinationSlug && site.distanceKm <= maxKm,
  ).sort((a, b) => a.distanceKm - b.distanceKm);
}

export const HERITAGE_EFFORT_LABEL: Record<HeritageEffort, string> = {
  contemplatif: "Sans effort",
  "marche-douce": "Marche douce",
  "marche-soutenue": "Marche soutenue",
};
