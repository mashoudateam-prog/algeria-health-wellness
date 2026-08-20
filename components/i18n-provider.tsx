"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";
import { fr, type Dictionary } from "@/lib/i18n/dictionaries/fr";

/**
 * Langue côté client.
 *
 * Les composants serveur lisent l'en-tête posé par le middleware ; les
 * composants client, eux, ne voient pas les en-têtes. La mise en page racine
 * leur transmet donc la langue par ce contexte.
 *
 * Les deux dictionnaires sont embarqués : ils pèsent quelques kilo-octets, et
 * les charger à la demande imposerait un état de chargement pour du texte
 * statique — ce serait payer cher une économie minuscule.
 */

const DICTIONARIES: Record<Locale, Dictionary> = { fr, en, ar };

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function I18nProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useTranslation(): { locale: Locale; t: Dictionary } {
  const locale = useLocale();
  return { locale, t: DICTIONARIES[locale] };
}

/** Remplace les marqueurs `{clé}` d'une chaîne traduite. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    key in values ? String(values[key]) : match,
  );
}
