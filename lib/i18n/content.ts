import {
  AR_DESTINATIONS,
  AR_GOALS,
  AR_HERITAGE,
  AR_HERITAGE_SUMMARIES,
  AR_TERMS,
  AR_UNIVERSE_TEXTS,
} from "@/data/i18n/ar-content";
import { EN_DESTINATIONS, EN_GOALS, EN_HERITAGE, EN_UNIVERSES } from "@/data/i18n/en-content";
import { EN_DEMO_APPOINTMENTS, EN_DEMO_DOCUMENTS, EN_DEMO_JOURNEY } from "@/data/i18n/en-demo";
import {
  EN_ACTORS,
  EN_ATTENTION,
  EN_AUDIT,
  EN_NEWS,
  EN_TARGETS,
} from "@/data/i18n/en-demo-content";
import { EN_EDITORIAL } from "@/data/i18n/en-editorial";
import { EN_FACILITIES } from "@/data/i18n/en-facilities";
import { EN_RETREATS } from "@/data/i18n/en-retreats";
import type {
  Destination,
  Facility,
  GoalId,
  HealthGoal,
  Professional,
  Retreat,
} from "@/types/domain";
import type { HeritageSite } from "@/data/heritage";
import type { Universe } from "@/data/universes";
import type { Locale } from "./config";

/**
 * Contenu éditorial traduit.
 *
 * Chaque accesseur retourne l'objet français enrichi de sa traduction quand
 * elle existe. Une entrée manquante retombe donc sur le français, jamais sur
 * du vide : une page à moitié traduite reste lisible, une page vide non.
 *
 * Le repli est silencieux côté visiteur mais visible en développement, où la
 * console signale ce qui manque.
 */

function warnMissing(kind: string, key: string, locale: Locale): void {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[i18n] traduction ${locale} absente pour ${kind} « ${key} » — repli sur le français.`);
  }
}

export function localizedGoal(goal: HealthGoal, locale: Locale): HealthGoal {
  if (locale === "fr") return goal;
  const table = locale === "ar" ? AR_GOALS : EN_GOALS;
  const text = table[goal.id as GoalId];
  if (!text) {
    warnMissing("objectif", goal.id, locale);
    return goal;
  }
  return { ...goal, label: text.label, short: text.short };
}

export function localizedUniverse(universe: Universe, locale: Locale): Universe {
  if (locale === "fr") return universe;
  if (locale === "ar") {
    const text = AR_UNIVERSE_TEXTS[universe.slug];
    if (!text) {
      warnMissing("univers", universe.slug, locale);
      return universe;
    }
    return { ...universe, ...text };
  }
  const text = EN_UNIVERSES[universe.slug];
  if (!text) {
    warnMissing("univers", universe.slug, locale);
    return universe;
  }
  return { ...universe, ...text };
}

export function localizedHeritage(site: HeritageSite, locale: Locale): HeritageSite {
  if (locale === "fr") return site;
  // Le nom du site sert de titre d'étape, et son résumé de détail d'étape :
  // les deux se retrouvent dans le parcours généré.
  if (locale === "ar") {
    const nom = AR_HERITAGE[site.slug];
    if (!nom) {
      warnMissing("site", site.slug, locale);
      return site;
    }
    return { ...site, name: nom, summary: AR_HERITAGE_SUMMARIES[site.slug] ?? site.summary };
  }
  const text = EN_HERITAGE[site.slug];
  if (!text) {
    warnMissing("site", site.slug, locale);
    return site;
  }
  return {
    ...site,
    name: text.name,
    summary: text.summary,
    highlights: text.highlights,
    // Une saison non traduite vaut mieux qu'une saison absente.
    bestSeason: text.bestSeason ?? site.bestSeason,
  };
}

export function localizedDestination(destination: Destination, locale: Locale): Destination {
  if (locale === "fr") return destination;
  // En arabe, le nom et l'accroche suffisent : ce sont eux qui apparaissent
  // dans le titre du parcours et sur les cartes.
  if (locale === "ar") {
    const text = AR_DESTINATIONS[destination.slug];
    if (!text) {
      warnMissing("destination", destination.slug, locale);
      return destination;
    }
    return { ...destination, name: text.name, tagline: text.tagline };
  }
  const text = EN_DESTINATIONS[destination.slug];
  if (!text) {
    warnMissing("destination", destination.slug, locale);
    return destination;
  }
  return {
    ...destination,
    tagline: text.tagline,
    intro: text.intro,
    bestFor: text.bestFor,
    editorial: {
      ...destination.editorial,
      // Le corps éditorial peut manquer alors que l'accroche est traduite :
      // chaque champ retombe indépendamment sur le français.
      ...(EN_EDITORIAL[destination.slug] ?? {}),
      recuperation: text.recovery,
      specialites: text.specialties,
      activites: text.activities,
    },
  };
}

/**
 * Vocabulaire de vérification et de spécialité.
 *
 * Une table de correspondance exacte plutôt qu'un champ par établissement :
 * ces libellés sont réutilisés d'une fiche à l'autre, et une entrée absente
 * doit rester lisible en français plutôt que disparaître.
 */
const EN_TERMS: Record<string, string> = {
  // Points de vérification
  "Identité juridique": "Legal identity",
  Identité: "Identity",
  Adresse: "Address",
  "Spécialités déclarées": "Declared specialties",
  "Spécialité déclarée": "Declared specialty",
  "Langues d'accueil": "Languages spoken",
  "Équipe déclarée": "Declared team",
  "Encadrement déclaré": "Declared supervision",
  "Rattachement à l'établissement": "Attachment to the facility",
  "Informations déclarées par l'établissement, non encore contrôlées":
    "Information declared by the facility, not yet checked",

  // Spécialités de praticien
  "Médecine interne": "Internal medicine",
  Cardiologie: "Cardiology",
  "Chirurgie dentaire": "Dental surgery",
  "Chirurgie orthopédique": "Orthopaedic surgery",
  Kinésithérapie: "Physiotherapy",
  Neurologie: "Neurology",
  "Diététique et nutrition": "Dietetics and nutrition",
  "Préparation physique": "Physical preparation",
  Dermatologie: "Dermatology",

  // Langues d'accueil
  Arabe: "Arabic",
  Français: "French",
  Anglais: "English",
  Espagnol: "Spanish",
  Italien: "Italian",
  Kabyle: "Kabyle",
  Allemand: "German",
  Tamazight: "Tamazight",
};

function term(value: string, locale: Locale): string {
  if (locale === "fr") return value;
  const found = (locale === "ar" ? AR_TERMS : EN_TERMS)[value];
  if (!found) {
    warnMissing("terme", value, locale);
    return value;
  }
  return found;
}

/** Traduit une liste de termes du vocabulaire commun (langues, contrôles…). */
export function localizedTerms(values: string[], locale: Locale): string[] {
  return locale === "fr" ? values : values.map((value) => term(value, locale));
}

const terms = localizedTerms;

/**
 * Le nom reste tel quel : un établissement ne change pas d'enseigne selon la
 * langue du visiteur. Seul le texte descriptif est traduit.
 */
export function localizedFacility(facility: Facility, locale: Locale): Facility {
  if (locale !== "en") return facility;
  const verification = {
    ...facility.verification,
    checks: terms(facility.verification.checks, locale),
  };
  const text = EN_FACILITIES[facility.slug];
  if (!text) {
    warnMissing("établissement", facility.slug, locale);
    return { ...facility, verification, languages: terms(facility.languages, locale) };
  }
  return {
    ...facility,
    summary: text.summary,
    specialties: text.specialties,
    services: text.services,
    accessibility: text.accessibility,
    languages: terms(facility.languages, locale),
    verification,
  };
}

/**
 * Compte de démonstration.
 *
 * Le typage suit la donnée source plutôt que de la redéclarer : ce compte est
 * une vitrine, il changera, et une interface figée ici serait le premier
 * endroit à se désynchroniser.
 */
export function localizedDemoAccount<
  J extends { title: string; phases: ReadonlyArray<{ key: string; label: string }> },
  A extends { title: string; note: string },
>(account: { journey: J; appointments: readonly A[] }, locale: Locale): {
  journey: J;
  appointments: A[];
} {
  if (locale !== "en") return { journey: account.journey, appointments: [...account.appointments] };

  return {
    journey: {
      ...account.journey,
      title: EN_DEMO_JOURNEY.title,
      phases: account.journey.phases.map((phase) => ({
        ...phase,
        label: EN_DEMO_JOURNEY.phases[phase.key] ?? phase.label,
      })),
    },
    appointments: account.appointments.map((appointment) => {
      const text = EN_DEMO_APPOINTMENTS[appointment.title];
      if (!text) {
        warnMissing("rendez-vous", appointment.title, locale);
        return appointment;
      }
      return { ...appointment, title: text.title, note: text.note };
    }),
  };
}

/**
 * Élément du fil de démonstration.
 *
 * En production, un article de presse gardera la langue de sa source : cette
 * traduction ne concerne que les éléments fictifs livrés avec le prototype.
 */
export function localizedNewsItem<T extends { id: string; title: string; summary: string; sourceName: string }>(
  item: T,
  locale: Locale,
): T {
  if (locale !== "en") return item;
  const text = EN_NEWS[item.id];
  if (!text) return item; // Un vrai élément de presse reste dans sa langue.
  return { ...item, title: text.title, summary: text.summary, sourceName: text.sourceName };
}

/** Entrée du journal d'accès du coffre documentaire. */
export function localizedAuditEntry<T extends { actor: string; target: string; detail: string }>(
  entry: T,
  locale: Locale,
): T {
  if (locale !== "en") return entry;
  return {
    ...entry,
    actor: EN_ACTORS[entry.actor] ?? entry.actor,
    target: EN_TARGETS[entry.target] ?? localizedDocumentName(entry.target, locale),
    detail: EN_AUDIT[entry.detail] ?? entry.detail,
  };
}

/** Signalement de forme sur un document. */
export function localizedAttention(note: string | null, locale: Locale): string | null {
  if (!note || locale !== "en") return note;
  return EN_ATTENTION[note] ?? note;
}

/** Nom de fichier d'un document de démonstration. */
export function localizedDocumentName(name: string, locale: Locale): string {
  if (locale !== "en") return name;
  // Un nom de fichier déposé par l'utilisateur n'a pas à être traduit :
  // l'absence d'entrée est le cas normal, pas une traduction manquante.
  return EN_DEMO_DOCUMENTS[name] ?? name;
}

/** Le nom du séjour est déjà anglais : seul son contenu est traduit. */
export function localizedRetreat(retreat: Retreat, locale: Locale): Retreat {
  if (locale !== "en") return retreat;
  const text = EN_RETREATS[retreat.slug];
  if (!text) {
    warnMissing("séjour", retreat.slug, locale);
    return retreat;
  }
  return { ...retreat, claim: text.claim, includes: text.includes, rhythm: text.rhythm };
}

/** Le nom du praticien ne change pas ; sa spécialité et ses langues, si. */
export function localizedProfessional(professional: Professional, locale: Locale): Professional {
  if (locale !== "en") return professional;
  return {
    ...professional,
    specialty: term(professional.specialty, locale),
    languages: terms(professional.languages, locale),
    verification: {
      ...professional.verification,
      checks: terms(professional.verification.checks, locale),
    },
  };
}

/** Étiquette d'effort de visite, dans la langue courante. */
export function heritageEffortLabel(
  effort: HeritageSite["effort"],
  t: { heritage: { effortContemplative: string; effortGentle: string; effortDemanding: string } },
): string {
  switch (effort) {
    case "contemplatif":
      return t.heritage.effortContemplative;
    case "marche-douce":
      return t.heritage.effortGentle;
    case "marche-soutenue":
      return t.heritage.effortDemanding;
  }
}
