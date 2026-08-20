/**
 * Internationalisation — configuration.
 *
 * Trois langues, et pas neuf : traduire automatiquement des contenus de santé
 * fabriquerait une responsabilité juridique — un avertissement médical mal
 * traduit est pire qu'un avertissement absent.
 *
 * ⚠️ Chaque langue ajoutée ici doit être relue par quelqu'un qui la parle,
 * les mentions réglementaires en premier. L'arabe livré ici attend cette
 * relecture : il est complet et fonctionnel, il n'est pas encore validé.
 *
 * L'arabe amène le sens droite-à-gauche. La mise en page y était préparée —
 * grille et `gap` plutôt que marges dirigées — et les quelques propriétés
 * physiques restantes sont devenues logiques.
 *
 * Couverture de l'arabe, dite sans détour : interface, parcours généré,
 * garde-fous, objectifs, univers, noms et résumés de sites, noms et accroches
 * de destination. Retombent sur le français : le corps éditorial des huit
 * fiches destination, les vingt-deux fiches d'établissement, les programmes de
 * séjour et le compte de démonstration. C'est le repli prévu par
 * l'architecture, et il est préférable à de la prose de santé non relue.
 */

export const LOCALES = ["fr", "en", "ar"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_LABEL: Record<Locale, string> = {
  fr: "Français",
  en: "English",
  ar: "العربية",
};

/** Étiquette courte du sélecteur de langue. */
export const LOCALE_SHORT: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
  ar: "ع",
};

/** Balise de langue HTML, pour `lang` et pour les moteurs de recherche. */
export const LOCALE_TAG: Record<Locale, string> = {
  fr: "fr-DZ",
  en: "en",
  ar: "ar-DZ",
};

/** Sens d'écriture, posé sur l'élément racine. */
export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  fr: "ltr",
  en: "ltr",
  ar: "rtl",
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Préfixe d'URL d'une langue. Le français vit à la racine — c'est la langue
 * d'origine du site et celle de la majorité de ses visiteurs actuels.
 */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/** Construit un lien vers le même chemin dans une autre langue. */
export function localizePath(path: string, locale: Locale): string {
  const bare = stripLocale(path);
  const prefix = localePrefix(locale);
  if (!prefix) return bare || "/";
  return `${prefix}${bare === "/" ? "" : bare}`;
}

/** Retire un éventuel préfixe de langue d'un chemin. */
export function stripLocale(path: string): string {
  for (const locale of LOCALES) {
    if (locale === DEFAULT_LOCALE) continue;
    if (path === `/${locale}`) return "/";
    if (path.startsWith(`/${locale}/`)) return path.slice(locale.length + 1);
  }
  return path;
}
