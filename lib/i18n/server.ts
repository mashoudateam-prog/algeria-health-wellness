import { headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { ar } from "./dictionaries/ar";
import { en } from "./dictionaries/en";
import { fr, type Dictionary } from "./dictionaries/fr";

/**
 * Accès à la langue depuis un composant serveur.
 *
 * La langue vient de l'en-tête posé par le middleware, pas d'un segment
 * d'URL : les pages restent à un seul endroit dans l'arborescence, et il
 * devient impossible qu'une page existe dans une langue et pas dans l'autre.
 */

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, ar };

export async function getLocale(): Promise<Locale> {
  const store = await headers();
  const value = store.get("x-locale") ?? "";
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

export async function getDictionary(): Promise<Dictionary> {
  return DICTIONARIES[await getLocale()];
}

/** Langue et dictionnaire d'un coup — le besoin le plus fréquent. */
export async function getTranslation(): Promise<{ locale: Locale; t: Dictionary }> {
  const locale = await getLocale();
  return { locale, t: DICTIONARIES[locale] };
}

/** Chemin courant, préfixe de langue compris. Utile au sélecteur de langue. */
export async function getPathname(): Promise<string> {
  const store = await headers();
  return store.get("x-pathname") ?? "/";
}

export function dictionaryFor(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/**
 * Remplace les marqueurs `{clé}` d'une chaîne traduite.
 * Volontairement minimal : pas de pluriels ni de formats, on n'en a pas besoin.
 */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}
