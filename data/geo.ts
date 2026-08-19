import type { Region, Wilaya } from "@/types/domain";

/**
 * Découpage administratif de l'Algérie : 58 wilayas.
 * Les coordonnées sont celles des chefs-lieux, arrondies — elles servent au
 * placement sur la carte, pas à de la navigation.
 */
export const WILAYAS: Wilaya[] = [
  { code: "01", name: "Adrar", lon: -0.29, lat: 27.87, region: "grand-sud" },
  { code: "02", name: "Chlef", lon: 1.33, lat: 36.17, region: "littoral" },
  { code: "03", name: "Laghouat", lon: 2.87, lat: 33.8, region: "sud" },
  { code: "04", name: "Oum El Bouaghi", lon: 7.11, lat: 35.87, region: "hauts-plateaux" },
  { code: "05", name: "Batna", lon: 6.17, lat: 35.56, region: "hauts-plateaux" },
  { code: "06", name: "Béjaïa", lon: 5.08, lat: 36.75, region: "littoral" },
  { code: "07", name: "Biskra", lon: 5.73, lat: 34.85, region: "sud" },
  { code: "08", name: "Béchar", lon: -2.22, lat: 31.62, region: "sud" },
  { code: "09", name: "Blida", lon: 2.83, lat: 36.47, region: "littoral" },
  { code: "10", name: "Bouira", lon: 3.9, lat: 36.37, region: "hauts-plateaux" },
  { code: "11", name: "Tamanrasset", lon: 5.53, lat: 22.79, region: "grand-sud" },
  { code: "12", name: "Tébessa", lon: 8.12, lat: 35.4, region: "hauts-plateaux" },
  { code: "13", name: "Tlemcen", lon: -1.32, lat: 34.88, region: "hauts-plateaux" },
  { code: "14", name: "Tiaret", lon: 1.32, lat: 35.37, region: "hauts-plateaux" },
  { code: "15", name: "Tizi Ouzou", lon: 4.05, lat: 36.72, region: "littoral" },
  { code: "16", name: "Alger", lon: 3.06, lat: 36.75, region: "littoral" },
  { code: "17", name: "Djelfa", lon: 3.26, lat: 34.67, region: "hauts-plateaux" },
  { code: "18", name: "Jijel", lon: 5.77, lat: 36.82, region: "littoral" },
  { code: "19", name: "Sétif", lon: 5.41, lat: 36.19, region: "hauts-plateaux" },
  { code: "20", name: "Saïda", lon: 0.15, lat: 34.83, region: "hauts-plateaux" },
  { code: "21", name: "Skikda", lon: 6.91, lat: 36.88, region: "littoral" },
  { code: "22", name: "Sidi Bel Abbès", lon: -0.63, lat: 35.19, region: "hauts-plateaux" },
  { code: "23", name: "Annaba", lon: 7.75, lat: 36.9, region: "littoral" },
  { code: "24", name: "Guelma", lon: 7.43, lat: 36.46, region: "hauts-plateaux" },
  { code: "25", name: "Constantine", lon: 6.61, lat: 36.36, region: "hauts-plateaux" },
  { code: "26", name: "Médéa", lon: 2.75, lat: 36.26, region: "hauts-plateaux" },
  { code: "27", name: "Mostaganem", lon: 0.09, lat: 35.93, region: "littoral" },
  { code: "28", name: "M'Sila", lon: 4.54, lat: 35.7, region: "hauts-plateaux" },
  { code: "29", name: "Mascara", lon: 0.14, lat: 35.4, region: "hauts-plateaux" },
  { code: "30", name: "Ouargla", lon: 5.32, lat: 31.95, region: "sud" },
  { code: "31", name: "Oran", lon: -0.64, lat: 35.7, region: "littoral" },
  { code: "32", name: "El Bayadh", lon: 1.02, lat: 33.68, region: "sud" },
  { code: "33", name: "Illizi", lon: 8.47, lat: 26.48, region: "grand-sud" },
  { code: "34", name: "Bordj Bou Arréridj", lon: 4.76, lat: 36.07, region: "hauts-plateaux" },
  { code: "35", name: "Boumerdès", lon: 3.48, lat: 36.77, region: "littoral" },
  { code: "36", name: "El Tarf", lon: 8.31, lat: 36.77, region: "littoral" },
  { code: "37", name: "Tindouf", lon: -8.15, lat: 27.67, region: "grand-sud" },
  { code: "38", name: "Tissemsilt", lon: 1.81, lat: 35.61, region: "hauts-plateaux" },
  { code: "39", name: "El Oued", lon: 6.87, lat: 33.37, region: "sud" },
  { code: "40", name: "Khenchela", lon: 7.14, lat: 35.44, region: "hauts-plateaux" },
  { code: "41", name: "Souk Ahras", lon: 7.95, lat: 36.29, region: "hauts-plateaux" },
  { code: "42", name: "Tipaza", lon: 2.45, lat: 36.59, region: "littoral" },
  { code: "43", name: "Mila", lon: 6.26, lat: 36.45, region: "hauts-plateaux" },
  { code: "44", name: "Aïn Defla", lon: 1.97, lat: 36.26, region: "hauts-plateaux" },
  { code: "45", name: "Naâma", lon: -0.31, lat: 33.27, region: "sud" },
  { code: "46", name: "Aïn Témouchent", lon: -1.14, lat: 35.3, region: "littoral" },
  { code: "47", name: "Ghardaïa", lon: 3.67, lat: 32.49, region: "sud" },
  { code: "48", name: "Relizane", lon: 0.56, lat: 35.74, region: "hauts-plateaux" },
  { code: "49", name: "Timimoun", lon: 0.24, lat: 29.26, region: "grand-sud" },
  { code: "50", name: "Bordj Badji Mokhtar", lon: 0.95, lat: 21.33, region: "grand-sud" },
  { code: "51", name: "Ouled Djellal", lon: 5.07, lat: 34.42, region: "sud" },
  { code: "52", name: "Béni Abbès", lon: -2.17, lat: 30.13, region: "grand-sud" },
  { code: "53", name: "In Salah", lon: 2.48, lat: 27.19, region: "grand-sud" },
  { code: "54", name: "In Guezzam", lon: 5.77, lat: 19.57, region: "grand-sud" },
  { code: "55", name: "Touggourt", lon: 6.06, lat: 33.11, region: "sud" },
  { code: "56", name: "Djanet", lon: 9.48, lat: 24.55, region: "grand-sud" },
  { code: "57", name: "El M'Ghair", lon: 5.92, lat: 33.95, region: "sud" },
  { code: "58", name: "El Meniaa", lon: 2.88, lat: 30.58, region: "sud" },
];

export const WILAYA_BY_CODE = new Map(WILAYAS.map((w) => [w.code, w]));

export const REGION_LABEL: Record<Region, string> = {
  littoral: "Littoral méditerranéen",
  "hauts-plateaux": "Hauts plateaux",
  sud: "Sud et portes du Sahara",
  "grand-sud": "Grand Sud",
};

/* ------------------------------------------------------------------ */
/* Projection cartographique                                           */
/* ------------------------------------------------------------------ */

export const MAP_VIEWBOX = { width: 1000, height: 900 } as const;

const BOUNDS = { minLon: -9.2, maxLon: 12.4, minLat: 18.4, maxLat: 37.6 } as const;

/** Projection équirectangulaire simple, suffisante à cette échelle. */
export function project(lon: number, lat: number): { x: number; y: number } {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * MAP_VIEWBOX.width;
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * MAP_VIEWBOX.height;
  return { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
}

/**
 * Contour national simplifié (longitude, latitude), sens horaire depuis le
 * nord-ouest. Tracé stylisé destiné à la lecture, pas à la mesure.
 */
const OUTLINE: Array<[number, number]> = [
  // Littoral méditerranéen, ouest vers est
  [-2.21, 35.09], [-1.55, 35.48], [-0.95, 35.72], [-0.64, 35.85], [0.09, 36.02],
  [0.62, 36.13], [1.33, 36.53], [2.02, 36.63], [2.45, 36.66], [3.06, 36.85],
  [3.75, 36.9], [4.55, 36.79], [5.08, 36.83], [5.77, 36.9], [6.35, 36.95],
  [6.91, 37.06], [7.4, 37.05], [7.75, 36.97], [8.25, 36.94], [8.6, 36.85],
  // Frontière tunisienne, nord vers sud
  [8.45, 36.53], [8.2, 36.48], [8.28, 35.95], [8.3, 35.2], [8.05, 34.72],
  [7.72, 34.24], [7.5, 33.83], [8.11, 33.09], [9.05, 32.1], [9.52, 30.23],
  [9.85, 30.0],
  // Frontière libyenne
  [10.3, 29.06], [11.02, 27.02], [11.62, 24.9], [11.95, 23.52],
  // Frontière nigérienne
  [10.7, 22.92], [8.6, 21.6], [7.48, 20.87], [5.83, 19.5], [4.23, 19.1],
  [3.32, 18.98],
  // Frontière malienne
  [1.2, 20.05], [0.0, 21.02], [-1.3, 22.78], [-3.02, 23.9], [-4.82, 24.92],
  [-6.6, 25.0],
  // Frontière mauritanienne puis Sahara occidental
  [-8.68, 27.29], [-8.68, 27.66], [-8.68, 28.02],
  // Frontière marocaine, sud vers nord
  [-7.98, 28.72], [-7.62, 29.4], [-7.02, 29.9], [-6.0, 30.02], [-5.0, 30.52],
  [-4.02, 31.0], [-3.62, 31.7], [-3.02, 32.0], [-2.0, 32.12], [-1.2, 32.1],
  [-1.62, 33.0], [-1.5, 33.72], [-1.82, 34.42], [-1.7, 34.8],
];

/** Tracé SVG fermé du territoire, prêt pour l'attribut `d`. */
export const ALGERIA_PATH: string =
  OUTLINE.map(([lon, lat], index) => {
    const { x, y } = project(lon, lat);
    return `${index === 0 ? "M" : "L"}${x} ${y}`;
  }).join(" ") + " Z";

/** Repère graphique du littoral, tracé par-dessus le contour. */
export const COAST_PATH: string = OUTLINE.slice(0, 20)
  .map(([lon, lat], index) => {
    const { x, y } = project(lon, lat);
    return `${index === 0 ? "M" : "L"}${x} ${y}`;
  })
  .join(" ");
