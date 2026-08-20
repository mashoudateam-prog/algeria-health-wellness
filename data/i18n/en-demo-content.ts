/**
 * Contenus de démonstration traduits : fil d'actualité et journal du coffre.
 *
 * Ce sont des éléments fictifs, marqués comme tels. Un vrai élément de presse
 * garderait la langue de sa source — c'est d'ailleurs ce qui se produira en
 * production, où le fil relaiera des articles algériens en français ou en
 * arabe. Ici, la démonstration doit rester lisible dans les deux langues.
 */

export const EN_NEWS: Record<string, { title: string; summary: string; sourceName: string }> = {
  "demo-cure-hammam": {
    title: "Thermal season opens at the eastern stations",
    summary:
      "The region's thermal establishments reopen for the cool season, traditionally the busiest period for relaxation and recovery cures.",
    sourceName: "Demonstration item",
  },
  "demo-festival-datte": {
    title: "Deglet Nour date festival in the southern palm groves",
    summary:
      "Producers' markets, traditional cookery workshops and palm grove visits over three days, at harvest time.",
    sourceName: "Demonstration item",
  },
  "demo-ouverture-spa": {
    title: "A new fitness centre opens on the corniche",
    summary:
      "A pool, a supervised training floor and a recovery area, with slots reserved for gradual fitness stays.",
    sourceName: "Demonstration item",
  },
  "demo-salon-bien-etre": {
    title: "Wellbeing and preventive health fair",
    summary:
      "Three days bringing together health professionals, wellbeing practitioners and the public, with prevention workshops.",
    sourceName: "Demonstration item",
  },
};

/** Entrées du journal d'accès du coffre documentaire. */
export const EN_AUDIT: Record<string, string> = {
  "Accès du Centre dentaire Andalus révoqué avant échéance.":
    "Access for Centre dentaire Andalus revoked before its deadline.",
  "Consultation dans le cadre du partage en cours.": "Opened under the current share.",
  "Accès accordé à Dr A. Benali jusqu'au 30 septembre 2026.":
    "Access granted to Dr A. Benali until 30 September 2026.",
  "Document déposé dans la catégorie Administratif.":
    "Document filed under the Administrative category.",
  "Parcours construit à partir de votre description.":
    "Journey built from your description.",
};

/** Acteurs du journal : « Vous » et « Concierge » sont des rôles, pas des noms. */
export const EN_ACTORS: Record<string, string> = {
  Vous: "You",
  Concierge: "Concierge",
};

/** Cibles du journal qui ne sont pas des noms de fichier. */
export const EN_TARGETS: Record<string, string> = {
  "10 jours à Alger": "10 days in Algiers",
};

/** Signalements de forme sur un document. */
export const EN_ATTENTION: Record<string, string> = {
  "Cliché non daté — une date de réalisation faciliterait la lecture.":
    "Undated image — a date of capture would make it easier to read.",
};
