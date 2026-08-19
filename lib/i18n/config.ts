/**
 * Internationalisation — configuration.
 *
 * Deux langues seulement pour l'instant, et c'est délibéré. Traduire
 * automatiquement des contenus de santé dans neuf langues fabriquerait une
 * responsabilité juridique : un avertissement médical mal traduit est pire
 * qu'un avertissement absent. Chaque langue ajoutée ici doit être relue par
 * quelqu'un qui la parle.
 *
 * L'arabe viendra ensuite : il demande en plus le sens droite-à-gauche, ce qui
 * touche toute la mise en page et ne s'improvise pas.
 */

export const LOCALES = ["fr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";

export const LOCALE_LABEL: Record<Locale, string> = {
  fr: "Français",
  en: "English",
};

/** Étiquette courte du sélecteur de langue. */
export const LOCALE_SHORT: Record<Locale, string> = {
  fr: "FR",
  en: "EN",
};

/** Balise de langue HTML, pour `lang` et pour les moteurs de recherche. */
export const LOCALE_TAG: Record<Locale, string> = {
  fr: "fr-DZ",
  en: "en",
};

/** Sens d'écriture. Prévu dès maintenant pour que l'arabe n'oblige pas à tout revoir. */
export const LOCALE_DIR: Record<Locale, "ltr" | "rtl"> = {
  fr: "ltr",
  en: "ltr",
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
