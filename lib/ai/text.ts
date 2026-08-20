import type { GoalId, StepKind } from "@/types/domain";
import type { Locale } from "@/lib/i18n/config";

/**
 * Textes produits par le moteur de parcours.
 *
 * Le planificateur fabrique des phrases — titres d'étapes, consignes, motifs de
 * recommandation, points de vigilance. Elles doivent suivre la langue du
 * visiteur, sinon un séjour construit en anglais s'affiche en français dès
 * qu'on regarde l'itinéraire.
 *
 * Le français reste la valeur par défaut : les tests du domaine s'appuient
 * dessus, et un appel qui ne précise rien doit continuer de fonctionner.
 */

/**
 * Le planificateur suit la langue du site. Le dictionnaire est partiel :
 * une langue ajoutée à l'interface avant que le parcours ne soit traduit
 * retombe sur le français plutôt que de casser la compilation.
 */
export type PlannerLocale = Locale;

interface CareStepText {
  title: string;
  detail: string;
}

export interface PlannerText {
  stepKinds: Record<StepKind, string>;

  arrivalAbroad: CareStepText;
  arrivalLocal: CareStepText;
  eveningFree: string;
  recoveryDay: CareStepText;
  departure: CareStepText;

  care: Partial<Record<GoalId, CareStepText[]>>;

  fitness: Array<CareStepText & { intensity: "douce" | "moderee" | "soutenue" }>;
  training: CareStepText;
  wellnessFirst: string;
  wellnessNext: string;
  wellnessWithCare: string;
  wellnessAlone: string;
  nutritionFirst: CareStepText;
  nutritionFollow: CareStepText;

  heritageUnesco: (year: number) => string;
  heritageDistance: (km: number) => string;
  heritageHours: (hours: number) => string;

  /** Conjonction d'énumération : « repos, dentaire et détente ». */
  and: string;
  /** Employé si l'objectif n'a pas de libellé — ne doit jamais rester vide. */
  fallbackGoal: string;

  /** Titre : « 7 jours à Alger — dentaire ». */
  title: (days: number, destination: string, goal: string) => string;
  summaryLead: (days: number, destination: string, goals: string) => string;
  summaryCare: (care: number, rest: number) => string;
  summaryNoCare: string;
  summaryTravellers: (count: number) => string;

  nextActions: {
    professional: string;
    passport: string;
    documents: string;
    estimate: string;
    adviser: string;
  };

  /**
   * Messages des règles de compatibilité.
   *
   * Ils sont traduits, jamais reformulés : ce sont les phrases qui portent la
   * précaution et renvoient la décision au praticien.
   */
  cautions: {
    arrivalBuffer: string;
    effortAfterCare: string;
    hotBathAfterCare: string;
    careOnDepartureDay: string;
    shortStay: (days: number) => string;
    southSummer: (destination: string) => string;
    southEffort: (destination: string) => string;
    recoveryDeclared: string;
    longTrips: string;
    family: (travellers: number) => string;
  };

  /** Libellés de l'estimation. Aucun n'annonce un prix : ce sont des postes. */
  quote: {
    care: Partial<Record<GoalId, string>>;
    fallbackCare: string;
    exams: string;
    perDay: (label: string, days: number) => string;
    lodging: (nights: number, rooms: number) => string;
    transfers: string;
    concierge: string;
    careNote: string;
    flightNote: string;
    conciergeNote: string;
  };

  /**
   * Ce que la plateforme affirme avoir compris, et ce qu'elle demande.
   * Ces phrases sont lues avant toute autre : c'est la preuve d'écoute.
   */
  intent: {
    singleGoal: (goal: string) => string;
    severalGoals: (goals: string) => string;
    duration: (days: number) => string;
    travellers: (count: number) => string;
    fromAbroad: string;
    inAlgeria: string;
    destination: (name: string) => string;
    recovery: string;
    comfort: (level: string) => string;
    comfortLevels: [string, string, string, string];
    askDuration: string;
    askOrigin: string;
    askRegion: string;
  };

  /** Justifications des recommandations d'établissement. */
  match: {
    goal: string;
    onSite: string;
    onSiteDetail: string;
    language: string;
    languageDetail: (languages: string) => string;
    international: string;
    internationalDetail: string;
    budget: string;
    /** Index 1 à 3 ; l'index 0 n'est jamais utilisé. */
    budgetTiers: [string, string, string, string];
    verified: string;
    verifiedDetail: (checks: string, date: string) => string;
    declared: string;
    declaredDetail: string;
    recovery: string;
    recoveryDetail: string;
    unknownDate: string;
  };
}

/* ------------------------------------------------------------------ */

const FR: PlannerText = {
  stepKinds: {
    soin: "Soin",
    examen: "Examen",
    recuperation: "Récupération",
    "bien-etre": "Bien-être",
    activite: "Activité",
    nutrition: "Nutrition",
    logistique: "Logistique",
    repos: "Repos",
  },

  arrivalAbroad: {
    title: "Arrivée et transfert",
    detail: "Accueil à l'arrivée et transfert vers votre hébergement. Aucun rendez-vous n'est programmé ce jour.",
  },
  arrivalLocal: {
    title: "Arrivée et installation",
    detail: "Installation et prise de repères. Journée volontairement libre.",
  },
  eveningFree: "Fin de journée libre",
  recoveryDay: {
    title: "Journée de récupération",
    detail:
      "Rythme volontairement allégé au lendemain d'un acte : marche courte, repos et hydratation. Ajustez selon les consignes de votre praticien.",
  },
  departure: {
    title: "Bilan de séjour et départ",
    detail:
      "Récupération des comptes rendus, point avec votre coordinateur et transfert. Votre suivi se poursuit dans votre espace après le retour.",
  },

  care: {
    prevention: [
      {
        title: "Bilan de santé — prélèvements",
        detail: "Prélèvements à jeun en début de matinée, puis matinée libre. Comptez une heure sur place.",
      },
      {
        title: "Restitution du bilan avec le médecin",
        detail:
          "Le médecin vous remet et commente vos résultats. Préparez vos questions en amont : le concierge peut vous aider à les formuler.",
      },
    ],
    soins: [
      {
        title: "Consultation spécialisée",
        detail: "Premier échange avec le praticien. Apportez vos documents médicaux via votre Health Passport.",
      },
      {
        title: "Examens complémentaires",
        detail: "Réalisés seulement s'ils sont prescrits lors de la consultation. Créneau réservé par précaution.",
      },
      {
        title: "Consultation de synthèse",
        detail: "Reprise des résultats et définition de la suite avec le praticien.",
      },
    ],
    dentaire: [
      {
        title: "Consultation dentaire et plan de traitement",
        detail: "Examen, radiographie si nécessaire, et devis écrit avant tout acte.",
      },
      {
        title: "Première séance de soins",
        detail: "Séance principale du séjour. Prévoyez une fin de journée calme.",
      },
      {
        title: "Seconde séance et contrôle",
        detail: "Finalisation et vérification. Un compte rendu vous est remis pour votre suivi au retour.",
      },
    ],
    esthetique: [
      {
        title: "Consultation dermatologique",
        detail: "Évaluation, explication des options et délai de réflexion avant toute décision.",
      },
      {
        title: "Séance programmée",
        detail: "Réalisée uniquement après accord écrit et délai de réflexion respecté.",
      },
    ],
    avis: [
      {
        title: "Dépôt du dossier pour second avis",
        detail: "Vérification des pièces avec le coordinateur, puis transmission au professionnel habilité.",
      },
      {
        title: "Restitution du second avis",
        detail: "Entretien avec le professionnel et synthèse écrite remise à l'issue.",
      },
    ],
  },

  fitness: [
    {
      title: "Évaluation de condition physique",
      detail: "Point de départ mesuré : mobilité, endurance, force. Sert de référence pour la progression du séjour.",
      intensity: "douce",
    },
    {
      title: "Séance encadrée — reprise douce",
      detail: "Mobilité et cardio léger, sans recherche de performance.",
      intensity: "douce",
    },
    {
      title: "Séance encadrée — renforcement",
      detail: "Montée progressive de la charge, adaptée à l'évaluation initiale.",
      intensity: "moderee",
    },
    {
      title: "Séance encadrée — séance longue",
      detail: "Séance la plus soutenue du séjour, placée après plusieurs jours d'adaptation.",
      intensity: "soutenue",
    },
    {
      title: "Séance bilan et plan de suite",
      detail: "Comparaison avec l'évaluation initiale et programme écrit à poursuivre au retour.",
      intensity: "douce",
    },
  ],
  training: {
    title: "Séance libre en salle",
    detail:
      "Accès à la salle sur votre créneau habituel. Signalez à l'avance si vous souhaitez un coach : cela conditionne les horaires disponibles.",
  },
  wellnessFirst: "Séance thermale et détente",
  wellnessNext: "Récupération en spa",
  wellnessWithCare:
    "Programmée en seconde partie de séjour. L'accès aux bains chauds après un acte doit être validé par votre praticien.",
  wellnessAlone: "Bains, chaleur sèche et temps de repos. Prévoyez de ne rien planifier après la séance.",
  nutritionFirst: {
    title: "Consultation nutrition",
    detail: "Bilan alimentaire et construction d'un plan réaliste, compatible avec la cuisine locale.",
  },
  nutritionFollow: {
    title: "Point nutrition et plan de suite",
    detail: "Ajustement du plan et remise du document à poursuivre après le séjour.",
  },

  heritageUnesco: (year) => `Patrimoine mondial depuis ${year}. `,
  heritageDistance: (km) => `À environ ${km} km. `,
  heritageHours: (hours) => `Compter ${hours} h sur place.`,

  and: "et",
  fallbackGoal: "santé",

  title: (days, destination, goal) =>
    `${days} jour${days > 1 ? "s" : ""} à ${destination} — ${goal}`,
  summaryLead: (days, destination, goals) =>
    `Un parcours de ${days} jours à ${destination}, construit autour de ${goals}.`,
  summaryCare: (care, rest) =>
    `${care} rendez-vous de soin ou d'examen, ${rest} temps de repos identifiés, et des journées de découverte placées là où la charge le permet.`,
  summaryNoCare:
    "Aucun acte médical programmé : le séjour est organisé autour du rythme, du repos et de l'activité douce.",
  summaryTravellers: (count) =>
    `Calendrier, hébergement et transports partagés pour ${count} voyageurs.`,

  nextActions: {
    professional: "Faire valider les actes envisagés par un professionnel de santé habilité.",
    passport: "Compléter votre Health Passport pour que les praticiens disposent du contexte utile.",
    documents: "Vérifier vos documents de voyage et la couverture d'assurance pour la durée du séjour.",
    estimate: "Demander une estimation détaillée aux établissements retenus.",
    adviser: "Échanger avec un conseiller si un point reste flou — un humain reste joignable.",
  },

  cautions: {
    arrivalBuffer:
      "Aucun acte n'est programmé le jour de l'arrivée : le trajet et le décalage pèsent sur la journée. Le premier rendez-vous est placé au lendemain.",
    effortAfterCare:
      "Aucune activité soutenue n'est programmée dans les 48 heures suivant un acte. Ce délai est une précaution d'organisation : seul votre praticien peut le confirmer ou l'ajuster.",
    hotBathAfterCare:
      "Bains chauds, hammam et spa ne sont programmés qu'en seconde partie de séjour. Leur accès après un acte doit être validé au préalable par le praticien qui vous a pris en charge.",
    careOnDepartureDay:
      "Un acte est positionné le jour du départ. Nous recommandons de décaler le retour d'au moins vingt-quatre heures.",
    shortStay: (days) =>
      `Votre séjour de ${days} jours cumule plusieurs objectifs médicaux. C'est réalisable, mais serré : prévoyez soit une durée plus longue, soit un objectif prioritaire.`,
    southSummer: (destination) =>
      `${destination} se visite surtout d'octobre à avril. En été, les températures rendent tout effort déconseillé et les journées doivent rester à l'intérieur aux heures chaudes.`,
    southEffort: (destination) =>
      `${destination} se prête aux séjours calmes. Pour un programme de remise en forme soutenu, une destination littorale offre de meilleures conditions.`,
    recoveryDeclared:
      "Vous avez indiqué une période de récupération. Le planning la respecte par défaut, mais son contenu et sa durée doivent être confirmés par le professionnel qui assure votre suivi.",
    longTrips:
      "Les excursions retenues restent à proximité immédiate de votre hébergement. Les trajets longs sont écartés pendant la fenêtre de récupération.",
    family: (travellers) =>
      `Le parcours est construit pour ${travellers} personnes avec un calendrier, un hébergement et des transports communs. Chaque voyageur conserve son propre suivi de santé, séparé des autres.`,
  },

  quote: {
    care: {
      prevention: "Bilan de santé",
      soins: "Consultations spécialisées",
      dentaire: "Soins dentaires",
      esthetique: "Médecine esthétique",
      avis: "Second avis sur dossier",
      thermalisme: "Cure thermale de détente",
      detente: "Spa et détente",
      forme: "Programme remise en forme",
      sport: "Récupération et kinésithérapie",
      nutrition: "Accompagnement nutritionnel",
      mental: "Bien-être mental",
    },
    fallbackCare: "Prestations de santé",
    exams: "Examens et imagerie",
    perDay: (label, days) => `${label} · ${days} jours`,
    lodging: (nights, rooms) =>
      `Hébergement · ${nights} nuits${rooms > 1 ? ` · ${rooms} chambres` : ""}`,
    transfers: "Transferts et déplacements locaux",
    concierge: "Conciergerie et coordination",
    careNote: "Fourchette large : le montant dépend du bilan initial et de l'acte retenu.",
    flightNote: "Hors billet d'avion international, qui reste à votre charge et hors plateforme.",
    conciergeNote: "Prise de rendez-vous, interprète, accompagnement pendant le séjour.",
  },

  intent: {
    singleGoal: (goal) => `Objectif principal : ${goal}`,
    severalGoals: (goals) => `Objectifs : ${goals}`,
    duration: (days) => `Durée du séjour : ${days} jours`,
    travellers: (count) => `Voyage à ${count} personnes`,
    fromAbroad: "Arrivée depuis l'étranger",
    inAlgeria: "Vous êtes déjà en Algérie",
    destination: (name) => `Destination évoquée : ${name}`,
    recovery: "Une période de récupération est à respecter",
    comfort: (level) => `Niveau de confort : ${level}`,
    comfortLevels: ["", "essentiel", "confort", "premium"],
    askDuration: "Combien de jours souhaitez-vous rester ?",
    askOrigin: "Venez-vous de l'étranger ou êtes-vous déjà en Algérie ?",
    askRegion: "Avez-vous une région de préférence ?",
  },

  match: {
    goal: "Correspond à votre objectif",
    onSite: "Sur place",
    onSiteDetail: "Situé dans la destination retenue pour votre parcours, sans trajet interurbain.",
    language: "Langue d'échange",
    languageDetail: (languages) => `Accueil déclaré en ${languages}.`,
    international: "Habitué aux patients venant de l'étranger",
    internationalDetail: "Prise en charge des séjours programmés depuis l'étranger.",
    budget: "Cohérent avec votre niveau de confort",
    budgetTiers: ["", "Positionnement essentiel", "Positionnement confort", "Positionnement premium"],
    verified: "Informations vérifiées",
    verifiedDetail: (checks, date) => `${checks} — contrôlé le ${date}.`,
    declared: "Informations déclaratives",
    declaredDetail: "Fiche renseignée par l'établissement, pas encore contrôlée par la plateforme.",
    recovery: "Utile à votre phase de récupération",
    recoveryDetail: "Peut s'intégrer après un acte, une fois le rythme validé par votre praticien.",
    unknownDate: "date inconnue",
  },
};

/* ------------------------------------------------------------------ */

const EN: PlannerText = {
  stepKinds: {
    soin: "Care",
    examen: "Test",
    recuperation: "Recovery",
    "bien-etre": "Wellbeing",
    activite: "Activity",
    nutrition: "Nutrition",
    logistique: "Logistics",
    repos: "Rest",
  },

  arrivalAbroad: {
    title: "Arrival and transfer",
    detail: "Met on arrival and taken to your accommodation. No appointments are scheduled today.",
  },
  arrivalLocal: {
    title: "Arrival and settling in",
    detail: "Settling in and finding your bearings. The day is deliberately left free.",
  },
  eveningFree: "Free end of day",
  recoveryDay: {
    title: "Recovery day",
    detail:
      "A deliberately light day after a procedure: a short walk, rest and fluids. Adjust according to your practitioner's instructions.",
  },
  departure: {
    title: "Closing review and departure",
    detail:
      "Collecting your reports, a final word with your coordinator, and the transfer. Your follow-up continues in your account after you get home.",
  },

  care: {
    prevention: [
      {
        title: "Health check — samples taken",
        detail: "Fasting samples first thing, then a free morning. Allow about an hour on site.",
      },
      {
        title: "Reviewing the results with the doctor",
        detail:
          "The doctor gives you your results and talks them through. Prepare your questions beforehand — the concierge can help you word them.",
      },
    ],
    soins: [
      {
        title: "Specialist consultation",
        detail: "A first conversation with the practitioner. Bring your medical documents via your Health Passport.",
      },
      {
        title: "Further tests",
        detail: "Carried out only if prescribed at the consultation. The slot is held as a precaution.",
      },
      {
        title: "Follow-up consultation",
        detail: "Going over the results and agreeing what comes next with the practitioner.",
      },
    ],
    dentaire: [
      {
        title: "Dental consultation and treatment plan",
        detail: "Examination, an X-ray if needed, and a written quote before any work begins.",
      },
      {
        title: "First treatment session",
        detail: "The main session of the stay. Plan a quiet end to the day.",
      },
      {
        title: "Second session and check",
        detail: "Finishing and checking the work. You are given a report for your follow-up at home.",
      },
    ],
    esthetique: [
      {
        title: "Dermatology consultation",
        detail: "Assessment, an explanation of the options, and time to think before any decision.",
      },
      {
        title: "Scheduled session",
        detail: "Carried out only after written consent and once the reflection period has passed.",
      },
    ],
    avis: [
      {
        title: "Submitting the file for a second opinion",
        detail: "Checking the documents with the coordinator, then sending them to a qualified professional.",
      },
      {
        title: "Receiving the second opinion",
        detail: "A conversation with the professional, and a written summary given to you afterwards.",
      },
    ],
  },

  fitness: [
    {
      title: "Fitness assessment",
      detail: "A measured starting point: mobility, endurance, strength. It sets the reference for the stay.",
      intensity: "douce",
    },
    {
      title: "Supervised session — easing back in",
      detail: "Mobility and light cardio, with no performance target.",
      intensity: "douce",
    },
    {
      title: "Supervised session — strengthening",
      detail: "A gradual increase in load, matched to the initial assessment.",
      intensity: "moderee",
    },
    {
      title: "Supervised session — long session",
      detail: "The most demanding session of the stay, placed after several days of adaptation.",
      intensity: "soutenue",
    },
    {
      title: "Closing session and plan to follow",
      detail: "Compared against the initial assessment, with a written programme to continue at home.",
      intensity: "douce",
    },
  ],
  training: {
    title: "Open gym session",
    detail:
      "Gym access at your usual time. Say in advance if you would like a coach — it determines which slots are available.",
  },
  wellnessFirst: "Thermal bathing and relaxation",
  wellnessNext: "Spa recovery",
  wellnessWithCare:
    "Scheduled in the second half of the stay. Access to hot baths after a procedure must be cleared by your practitioner.",
  wellnessAlone: "Baths, dry heat and time to rest. Plan nothing after the session.",
  nutritionFirst: {
    title: "Nutrition consultation",
    detail: "A dietary assessment and a realistic plan built around local cooking.",
  },
  nutritionFollow: {
    title: "Nutrition review and plan to follow",
    detail: "Adjusting the plan and handing over the document to continue after the stay.",
  },

  heritageUnesco: (year) => `World Heritage since ${year}. `,
  heritageDistance: (km) => `About ${km} km away. `,
  heritageHours: (hours) => `Allow ${hours} h on site.`,

  and: "and",
  fallbackGoal: "health",

  title: (days, destination, goal) => `${days} day${days > 1 ? "s" : ""} in ${destination} — ${goal}`,
  summaryLead: (days, destination, goals) =>
    `A ${days}-day journey in ${destination}, built around ${goals}.`,
  summaryCare: (care, rest) =>
    `${care} care or test appointments, ${rest} identified periods of rest, and days of discovery placed where the load allows.`,
  summaryNoCare:
    "No medical procedure is scheduled: the stay is organised around pace, rest and gentle activity.",
  summaryTravellers: (count) =>
    `Shared calendar, accommodation and transport for ${count} travellers.`,

  nextActions: {
    professional: "Have the procedures under consideration approved by a qualified health professional.",
    passport: "Complete your Health Passport so practitioners have the context they need.",
    documents: "Check your travel documents and insurance cover for the length of the stay.",
    estimate: "Ask the selected facilities for a detailed estimate.",
    adviser: "Speak to an adviser if anything remains unclear — a person is always reachable.",
  },

  cautions: {
    arrivalBuffer:
      "No procedure is scheduled on the day you arrive: the journey and the time difference already weigh on the day. The first appointment is placed the following day.",
    effortAfterCare:
      "No demanding activity is scheduled within the 48 hours following a procedure. This interval is an organisational precaution: only your practitioner can confirm or adjust it.",
    hotBathAfterCare:
      "Hot baths, hammam and spa are only scheduled in the second half of the stay. Access to them after a procedure must first be approved by the practitioner treating you.",
    careOnDepartureDay:
      "A procedure falls on the day of departure. We recommend moving your return back by at least twenty-four hours.",
    shortStay: (days) =>
      `Your ${days}-day stay combines several medical goals. It is feasible, but tight: allow either a longer stay or one priority goal.`,
    southSummer: (destination) =>
      `${destination} is best visited from October to April. In summer, temperatures make any exertion inadvisable and days should be spent indoors during the hottest hours.`,
    southEffort: (destination) =>
      `${destination} suits quiet stays. For a demanding fitness programme, a coastal destination offers better conditions.`,
    recoveryDeclared:
      "You indicated a recovery period. The schedule respects it by default, but its content and length must be confirmed by the professional following you.",
    longTrips:
      "The excursions selected stay in the immediate vicinity of your accommodation. Long journeys are ruled out during the recovery window.",
    family: (travellers) =>
      `The journey is built for ${travellers} people with a shared calendar, accommodation and transport. Each traveller keeps their own health records, separate from the others.`,
  },

  quote: {
    care: {
      prevention: "Health check",
      soins: "Specialist consultations",
      dentaire: "Dental care",
      esthetique: "Aesthetic medicine",
      avis: "Second opinion on file",
      thermalisme: "Thermal cure",
      detente: "Spa and relaxation",
      forme: "Fitness programme",
      sport: "Recovery and physiotherapy",
      nutrition: "Nutrition support",
      mental: "Mental wellbeing",
    },
    fallbackCare: "Health services",
    exams: "Tests and imaging",
    perDay: (label, days) => `${label} · ${days} days`,
    lodging: (nights, rooms) =>
      `Accommodation · ${nights} nights${rooms > 1 ? ` · ${rooms} rooms` : ""}`,
    transfers: "Transfers and local travel",
    concierge: "Concierge and coordination",
    careNote: "Wide range: the amount depends on the initial assessment and the procedure chosen.",
    flightNote:
      "International flights are not included; they remain your responsibility and sit outside the platform.",
    conciergeNote: "Booking appointments, interpreting, support during the stay.",
  },

  intent: {
    singleGoal: (goal) => `Main goal: ${goal}`,
    severalGoals: (goals) => `Goals: ${goals}`,
    duration: (days) => `Length of stay: ${days} days`,
    travellers: (count) => `Travelling as ${count} people`,
    fromAbroad: "Arriving from abroad",
    inAlgeria: "You are already in Algeria",
    destination: (name) => `Destination mentioned: ${name}`,
    recovery: "A recovery period has to be respected",
    comfort: (level) => `Comfort level: ${level}`,
    comfortLevels: ["", "essential", "comfort", "premium"],
    askDuration: "How many days would you like to stay?",
    askOrigin: "Are you coming from abroad, or are you already in Algeria?",
    askRegion: "Do you have a preferred region?",
  },

  match: {
    goal: "Matches your goal",
    onSite: "On site",
    onSiteDetail: "Located in the destination chosen for your journey, with no intercity travel.",
    language: "Shared language",
    languageDetail: (languages) => `Reception declared in ${languages}.`,
    international: "Used to patients travelling from abroad",
    internationalDetail: "Handles stays arranged from abroad.",
    budget: "In line with your comfort level",
    budgetTiers: ["", "Essential positioning", "Comfort positioning", "Premium positioning"],
    verified: "Verified information",
    verifiedDetail: (checks, date) => `${checks} — checked on ${date}.`,
    declared: "Self-declared information",
    declaredDetail: "Listing filled in by the facility, not yet checked by the platform.",
    recovery: "Useful during your recovery phase",
    recoveryDetail:
      "Can fit in after a procedure, once the pace has been approved by your practitioner.",
    unknownDate: "date unknown",
  },
};

/**
 * Texte arabe du moteur.
 *
 * ⚠️ EN ATTENTE DE RELECTURE PAR UN LOCUTEUR NATIF, comme le dictionnaire de
 * l'interface. Les précautions d'organisation et les mentions qui renvoient la
 * décision au praticien sont les phrases à relire en premier.
 */
const AR: PlannerText = {
  stepKinds: {
    soin: "علاج",
    examen: "فحص",
    recuperation: "استجمام",
    "bien-etre": "عافية",
    activite: "نشاط",
    nutrition: "تغذية",
    logistique: "تنظيم",
    repos: "راحة",
  },

  arrivalAbroad: {
    title: "الوصول والنقل",
    detail: "استقبال عند الوصول ونقل إلى مكان إقامتك. ولا يُبرمَج أيّ موعد في هذا اليوم.",
  },
  arrivalLocal: {
    title: "الوصول والاستقرار",
    detail: "الاستقرار وأخذ المعالم. يوم حرّ عمدًا.",
  },
  eveningFree: "نهاية يوم حرّة",
  recoveryDay: {
    title: "يوم استجمام",
    detail:
      "إيقاع مخفَّف عمدًا في اليوم التالي لإجراء: مشي قصير، وراحة، وترطيب. عدّله وفق تعليمات ممارسك.",
  },
  departure: {
    title: "حصيلة الإقامة والمغادرة",
    detail:
      "استلام التقارير، ونقطة مع منسّقك، ثم النقل. وتتواصل متابعتك في فضائك بعد العودة.",
  },

  care: {
    prevention: [
      {
        title: "فحص صحي — أخذ العيّنات",
        detail: "أخذ العيّنات على الريق في أوّل الصباح، ثم صبيحة حرّة. احسب ساعة في المكان.",
      },
      {
        title: "عرض نتائج الفحص مع الطبيب",
        detail:
          "يسلّمك الطبيب نتائجك ويعلّق عليها. هيّئ أسئلتك مسبقًا: يمكن للمرافق أن يساعدك على صياغتها.",
      },
    ],
    soins: [
      {
        title: "استشارة تخصّصية",
        detail: "لقاء أوّل مع الممارس. أحضر وثائقك الطبية عبر Health Passport.",
      },
      {
        title: "فحوص تكميلية",
        detail: "لا تُجرى إلّا إذا وُصفت أثناء الاستشارة. الموعد محجوز احتياطًا.",
      },
      {
        title: "استشارة تركيبية",
        detail: "استعراض النتائج وتحديد ما يلي مع الممارس.",
      },
    ],
    dentaire: [
      {
        title: "استشارة أسنان وخطّة علاج",
        detail: "فحص، وصورة إشعاعية عند الاقتضاء، وعرض أسعار مكتوب قبل أيّ إجراء.",
      },
      {
        title: "الحصّة العلاجية الأولى",
        detail: "الحصّة الرئيسية في الإقامة. اجعل نهاية اليوم هادئة.",
      },
      {
        title: "حصّة ثانية ومراقبة",
        detail: "الإنهاء والتحقّق. ويُسلَّم إليك تقرير لمتابعتك بعد العودة.",
      },
    ],
    esthetique: [
      {
        title: "استشارة جلدية",
        detail: "تقييم، وشرح للخيارات، ومهلة تفكير قبل أيّ قرار.",
      },
      {
        title: "حصّة مبرمَجة",
        detail: "لا تُجرى إلّا بعد موافقة مكتوبة واحترام مهلة التفكير.",
      },
    ],
    avis: [
      {
        title: "إيداع الملفّ لطلب رأي ثانٍ",
        detail: "التحقّق من الوثائق مع المنسّق، ثم إرسالها إلى المهني المؤهَّل.",
      },
      {
        title: "عرض الرأي الثاني",
        detail: "مقابلة مع المهني وملخّص مكتوب يُسلَّم في الختام.",
      },
    ],
  },

  fitness: [
    {
      title: "تقييم اللياقة البدنية",
      detail: "نقطة انطلاق مقيسة: الحركية، والتحمّل، والقوّة. وتصلح مرجعًا لتدرّج الإقامة.",
      intensity: "douce",
    },
    {
      title: "حصّة مؤطَّرة — استئناف هيّن",
      detail: "حركية وجهد قلبي خفيف، دون بحث عن أداء.",
      intensity: "douce",
    },
    {
      title: "حصّة مؤطَّرة — تقوية",
      detail: "رفع تدريجي للحمل، ملائم للتقييم الأوّلي.",
      intensity: "moderee",
    },
    {
      title: "حصّة مؤطَّرة — حصّة طويلة",
      detail: "أشدّ حصص الإقامة، موضوعة بعد عدّة أيام من التأقلم.",
      intensity: "soutenue",
    },
    {
      title: "حصّة حصيلة وبرنامج المتابعة",
      detail: "مقارنة بالتقييم الأوّلي وبرنامج مكتوب يُواصَل بعد العودة.",
      intensity: "douce",
    },
  ],
  training: {
    title: "حصّة حرّة في القاعة",
    detail:
      "دخول القاعة في موعدك المعتاد. أشِر مسبقًا إن رغبت في مدرّب: فذلك يحدّد الأوقات المتاحة.",
  },
  wellnessFirst: "حصّة حمّام معدني واسترخاء",
  wellnessNext: "استجمام في المنتجع",
  wellnessWithCare:
    "مبرمَجة في النصف الثاني من الإقامة. ودخول الحمّامات الساخنة بعد إجراء يقتضي موافقة ممارسك.",
  wellnessAlone: "حمّامات، وحرارة جافّة، وأوقات راحة. لا تبرمج شيئًا بعد الحصّة.",
  nutritionFirst: {
    title: "استشارة تغذية",
    detail: "تقييم غذائي وبناء خطّة واقعية، منسجمة مع المطبخ المحلّي.",
  },
  nutritionFollow: {
    title: "نقطة تغذية وبرنامج المتابعة",
    detail: "تعديل الخطّة وتسليم الوثيقة لمواصلتها بعد الإقامة.",
  },

  heritageUnesco: (year) => `تراث عالمي منذ ${year}. `,
  heritageDistance: (km) => `على نحو ${km} كلم. `,
  heritageHours: (hours) => `احسب ${hours} سا في الموقع.`,

  and: "و",
  fallbackGoal: "الصحة",

  title: (days, destination, goal) => `${days} أيام في ${destination} — ${goal}`,
  summaryLead: (days, destination, goals) =>
    `مسار من ${days} أيام في ${destination}، مبنيّ حول ${goals}.`,
  summaryCare: (care, rest) =>
    `${care} مواعيد علاج أو فحص، و${rest} أوقات راحة محدَّدة، وأيام اكتشاف موضوعة حيث يسمح الحمل بذلك.`,
  summaryNoCare:
    "لا إجراء طبيًا مبرمَجًا: الإقامة منظَّمة حول الإيقاع والراحة والنشاط الهيّن.",
  summaryTravellers: (count) =>
    `جدول وإقامة وتنقّلات مشتركة لـ${count} مسافرين.`,

  nextActions: {
    professional: "اعرض الإجراءات المزمعة على مهني صحّة مؤهَّل للمصادقة عليها.",
    passport: "أكمل Health Passport ليتوفّر للممارسين السياق المفيد.",
    documents: "تحقّق من وثائق سفرك ومن تغطية التأمين طيلة مدّة الإقامة.",
    estimate: "اطلب تقديرًا مفصَّلًا من المؤسسات المختارة.",
    adviser: "تحدّث إلى مستشار إن بقيت نقطة غامضة — يبقى إنسان في المتناول.",
  },

  cautions: {
    arrivalBuffer:
      "لا إجراء مبرمَجًا يوم الوصول: الرحلة وفارق التوقيت يثقلان اليوم. ويوضع الموعد الأول في الغد.",
    effortAfterCare:
      "لا نشاط شديدًا مبرمَجًا في الـ48 ساعة التالية لإجراء. وهذه المهلة احتياط تنظيمي: ولا يمكن تأكيدها أو تعديلها إلّا لممارسك.",
    hotBathAfterCare:
      "الحمّامات الساخنة والحمّام البخاري والمنتجع لا تُبرمَج إلّا في النصف الثاني من الإقامة. ودخولها بعد إجراء يقتضي موافقة مسبقة من الممارس الذي تكفّل بك.",
    careOnDepartureDay:
      "وقع إجراء في يوم المغادرة. ونوصي بتأخير العودة أربعًا وعشرين ساعة على الأقلّ.",
    shortStay: (days) =>
      `إقامتك من ${days} أيام تجمع عدّة أهداف طبية. وهذا ممكن، لكنّه ضيّق: اختر إمّا مدّة أطول، وإمّا هدفًا واحدًا ذا أولوية.`,
    southSummer: (destination) =>
      `${destination} تُزار خصوصًا من أكتوبر إلى أفريل. وفي الصيف تجعل الحرارة كلّ جهد غير مستحسن، وينبغي أن تبقى الأيام في الداخل في ساعات الحرّ.`,
    southEffort: (destination) =>
      `${destination} تناسب الإقامات الهادئة. أمّا برنامج استعادة لياقة مكثَّف فتوفّر له وجهة ساحلية ظروفًا أفضل.`,
    recoveryDeclared:
      "أشرت إلى فترة استجمام. ويحترمها البرنامج افتراضيًا، غير أنّ مضمونها ومدّتها يقتضيان تأكيد المهني الذي يتولّى متابعتك.",
    longTrips:
      "تبقى الزيارات المختارة على مقربة مباشرة من مكان إقامتك. وتُستبعَد التنقّلات الطويلة خلال نافذة الاستجمام.",
    family: (travellers) =>
      `المسار مبنيّ لـ${travellers} أشخاص بجدول وإقامة وتنقّلات مشتركة. ويحتفظ كلّ مسافر بمتابعته الصحية الخاصّة، منفصلة عن الآخرين.`,
  },

  quote: {
    care: {
      prevention: "فحص صحي",
      soins: "استشارات تخصّصية",
      dentaire: "علاج أسنان",
      esthetique: "طبّ تجميلي",
      avis: "رأي ثانٍ على ملفّ",
      thermalisme: "حمّام معدني للاسترخاء",
      detente: "منتجع واسترخاء",
      forme: "برنامج استعادة لياقة",
      sport: "استجمام وعلاج حركي",
      nutrition: "مرافقة غذائية",
      mental: "عافية نفسية",
    },
    fallbackCare: "خدمات صحية",
    exams: "فحوص وتصوير",
    perDay: (label, days) => `${label} · ${days} أيام`,
    lodging: (nights, rooms) =>
      `إقامة · ${nights} ليالٍ${rooms > 1 ? ` · ${rooms} غرف` : ""}`,
    transfers: "نقل وتنقّلات محلّية",
    concierge: "مرافقة وتنسيق",
    careNote: "مجال واسع: يتوقّف المبلغ على التقييم الأوّلي وعلى الإجراء المعتمَد.",
    flightNote: "خارج تذكرة الطيران الدولية، وهي على عاتقك وخارج المنصّة.",
    conciergeNote: "أخذ المواعيد، والترجمة، والمرافقة أثناء الإقامة.",
  },

  intent: {
    singleGoal: (goal) => `الهدف الرئيسي: ${goal}`,
    severalGoals: (goals) => `الأهداف: ${goals}`,
    duration: (days) => `مدّة الإقامة: ${days} أيام`,
    travellers: (count) => `سفر بـ${count} أشخاص`,
    fromAbroad: "قدوم من الخارج",
    inAlgeria: "أنت في الجزائر بالفعل",
    destination: (name) => `الوجهة المذكورة: ${name}`,
    recovery: "ينبغي احترام فترة استجمام",
    comfort: (level) => `مستوى الراحة: ${level}`,
    comfortLevels: ["", "أساسي", "مريح", "متميّز"],
    askDuration: "كم يومًا تودّ البقاء؟",
    askOrigin: "هل تقدم من الخارج أم أنت في الجزائر بالفعل؟",
    askRegion: "هل لديك منطقة مفضّلة؟",
  },

  match: {
    goal: "يطابق هدفك",
    onSite: "في المكان",
    onSiteDetail: "يقع في الوجهة المعتمدة لمسارك، دون تنقّل بين المدن.",
    language: "لغة التواصل",
    languageDetail: (languages) => `استقبال مصرَّح به بـ${languages}.`,
    international: "معتاد على المرضى القادمين من الخارج",
    internationalDetail: "تكفّل بالإقامات المبرمَجة انطلاقًا من الخارج.",
    budget: "منسجم مع مستوى راحتك",
    budgetTiers: ["", "تموضع أساسي", "تموضع مريح", "تموضع متميّز"],
    verified: "معلومات مُتحقَّق منها",
    verifiedDetail: (checks, date) => `${checks} — تُحقِّق منها في ${date}.`,
    declared: "معلومات تصريحية",
    declaredDetail: "بطاقة ملأتها المؤسسة، لم تتحقّق منها المنصّة بعد.",
    recovery: "مفيد في مرحلة استجمامك",
    recoveryDetail: "يمكن إدراجه بعد إجراء، متى صادق ممارسك على الإيقاع.",
    unknownDate: "تاريخ غير معروف",
  },
};

export const PLANNER_TEXT: Partial<Record<PlannerLocale, PlannerText>> = {
  fr: FR,
  en: EN,
  ar: AR,
};

export function plannerText(locale: PlannerLocale = "fr"): PlannerText {
  return PLANNER_TEXT[locale] ?? FR;
}
