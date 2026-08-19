/**
 * Dictionnaire français — source de vérité.
 *
 * Le type de ce fichier contraint toutes les autres langues : une clé ajoutée
 * ici et oubliée ailleurs devient une erreur de compilation, pas une chaîne
 * manquante découverte en production.
 */
export const fr = {
  nav: {
    home: "Accueil",
    journey: "Mon parcours",
    universes: "Univers",
    destinations: "Destinations",
    heritage: "Patrimoine",
    retreats: "Séjours",
    news: "Actualités",
    map: "Carte santé",
    trust: "Confiance",
    concierge: "Concierge",
    profile: "Profil",
    explore: "Explorer",
    start: "Commencer",
    adviser: "Un conseiller",
    skipToContent: "Aller au contenu principal",
    mainNav: "Navigation principale",
    mobileNav: "Navigation mobile",
    homeAria: "Algeria Health & Wellness, accueil",
    language: "Langue",
  },

  common: {
    demo: "Démo",
    verified: "Vérifié",
    declarative: "Déclaratif",
    verificationPending: "Vérification en cours",
    source: "Source",
    readMore: "Découvrir",
    seeSheet: "Voir la fiche",
    buildJourney: "Construire mon parcours",
    talkToAdviser: "Parler à un conseiller",
    days: "jours",
    day: "jour",
    hours: "h",
    travellers: "voyageurs",
    from: "Depuis",
    estimate: "Estimation",
    disclaimer:
      "Cette recommandation est informative et ne constitue pas un diagnostic médical.",
  },

  home: {
    eyebrow: "Health travel · Algérie",
    title1: "Prenez soin de vous.",
    title2: "Découvrez l'Algérie autrement.",
    lede:
      "Soins, bien-être et remise en forme, entre Méditerranée, hauts plateaux et Sahara. Vous ne réservez pas un rendez-vous : vous construisez un parcours.",
    exploreDestinations: "Explorer les destinations",
    step1: "Vous définissez votre objectif",
    step2: "Un parcours se construit",
    step3: "Vous vivez votre séjour",

    contrastsEyebrow: "Un pays de contrastes",
    contrastsTitle1: "Le deuxième plus grand pays d'Afrique.",
    contrastsTitle2: "Et l'un des moins parcourus.",
    contrastsBody:
      "Mille deux cents kilomètres de côte méditerranéenne, des massifs boisés, des hauts plateaux, et un Sahara qui couvre plus de huit dixièmes du territoire. C'est le décor de votre séjour.",

    goalsEyebrow: "Le point de départ",
    goalsTitle: "Que souhaitez-vous améliorer ?",
    goalsBody:
      "Pas de liste de cliniques, pas de moteur de recherche. Vous partez de votre intention — plusieurs objectifs peuvent coexister dans un même séjour, et c'est même le cas le plus fréquent.",
    goalsNotice:
      "Les informations produites sont indicatives et ne constituent pas un diagnostic médical.",

    journeyEyebrow: "Health Journey",
    journeyTitle1: "Dites simplement ce dont vous avez besoin.",
    journeyTitle2: "Le reste s'organise.",
    journeyBody:
      "Votre phrase devient un parcours : une destination, des professionnels, des journées de soin, des temps de récupération, un hébergement, des activités compatibles et un budget estimatif.",
    journeyCta: "Essayer le Journey Builder",

    destinationsEyebrow: "Health destinations",
    destinationsTitle1: "L'Algérie comme",
    destinationsTitle2: "destination de santé.",
    destinationsAll: "Voir les {count} destinations",

    trustEyebrow: "Confiance",
    trustTitle1: "La confiance ne se déclare pas.",
    trustTitle2: "Elle se démontre.",
    trustCta: "Consulter le centre de confiance",

    conciergeEyebrow: "Accompagnement",
    conciergeTitle: "Un humain peut vous accompagner.",
    conciergeBody:
      "Le concierge répond aux questions d'organisation à toute heure. Mais certaines situations demandent une voix, pas une interface — un conseiller reprend alors la main, à votre demande.",
    conciergeOpen: "Ouvrir le concierge",
  },

  phases: {
    discover: { label: "Je définis mon objectif", detail: "Ce que vous voulez améliorer, en vos mots." },
    assess: { label: "La plateforme comprend", detail: "Vos besoins sont organisés, jamais diagnostiqués." },
    plan: { label: "Je découvre mon parcours", detail: "Jour par jour, avec les temps de repos." },
    book: { label: "Je choisis mes professionnels", detail: "Avec les raisons de chaque proposition." },
    experience: { label: "Je vis mon séjour", detail: "Rendez-vous, transferts, récupération, découverte." },
    followUp: { label: "Je suis accompagné après", detail: "Documents, rappels, suivi à distance." },
  },

  trust: {
    verificationTitle: "Vérification affichée, jamais inventée",
    verificationBody:
      "Chaque fiche indique ce qui a été contrôlé et la date du contrôle. Quand une information est seulement déclarée par l'établissement, c'est écrit.",
    documentsTitle: "Vous gardez le contrôle de vos documents",
    documentsBody:
      "Un partage est nominatif, limité dans le temps et révocable. Un journal vous indique qui a consulté quoi, et quand.",
    aiTitle: "L'IA n'exerce pas la médecine",
    aiBody:
      "Elle organise, prépare et oriente. Elle ne pose aucun diagnostic, ne prescrit rien et n'interprète jamais un résultat.",
  },

  builder: {
    eyebrow: "Health Journey Builder",
    title1: "Décrivez votre projet.",
    title2: "Le séjour se construit.",
    projectLabel: "Votre projet, en vos mots",
    projectPlaceholder: "Je veux venir en Algérie pendant une semaine pour prendre soin de moi.",
    goalsLegend: "Vos objectifs",
    moreOptions: "Préciser durée, voyageurs et budget",
    duration: "Durée",
    travellersLabel: "Voyageurs",
    arriving: "Vous arrivez",
    fromAlgeria: "Je suis déjà en Algérie",
    fromAbroad: "Je viens de l'étranger",
    destinationLabel: "Destination souhaitée",
    destinationAuto: "Laisser la plateforme proposer",
    comfort: "Niveau de confort",
    comfortEssential: "Essentiel",
    comfortComfort: "Confort",
    comfortPremium: "Premium",
    build: "Construire mon parcours",
    building: "Construction en cours…",
    rebuild: "Reconstruire",
    buildingStage: "Construction du parcours",

    stageGoal: "Objectif",
    stageDestination: "Destination",
    stageCare: "Soins & bien-être",
    stageProfessionals: "Professionnels",
    stageLodging: "Hébergement",
    stageItinerary: "Itinéraire",
    stageBudget: "Budget",
    stageJourney: "Mon parcours",

    yourJourney: "Votre parcours",
    understood: "Ce que nous avons compris",
    confidence:
      "Niveau de certitude sur les éléments déduits : {percent} %. Corrigez ce qui ne correspond pas et reconstruisez.",
    rulesEngine: "Moteur de règles",
    aiAssisted: "Assisté par IA",
    cautions: "Points de vigilance",
    itineraryTitle: "Votre itinéraire, jour par jour",
    itineraryBody:
      "Les journées suivant un acte sont volontairement allégées. Le rythme reste à confirmer avec le professionnel qui vous prend en charge.",
    matchTitle: "Pourquoi nous vous proposons ces options",
    matchBody:
      "Aucune note globale, aucune étoile. Chaque rapprochement est justifié par des critères que vous pouvez vérifier.",
    budgetTitle: "Estimation du budget",
    budgetItem: "Poste",
    budgetRange: "Fourchette",
    budgetTotal: "Estimation totale",
    budgetCaption: "Estimation ventilée par poste",
    nextSteps: "Prochaines étapes",
    demoNotice:
      "Les établissements et praticiens présentés proviennent d'un catalogue de démonstration : ils sont fictifs et signalés comme tels.",
  },

  universes: {
    eyebrow: "Univers",
    title1: "Six façons d'aborder",
    title2: "un séjour en Algérie.",
    lede:
      "Un objectif répond à « que voulez-vous améliorer ». Un univers répond à « quel genre de séjour voulez-vous vivre ». Les deux se rejoignent dans le même parcours — on n'y entre simplement pas par le même chemin.",
    allows: "Ce que cela permet",
    buildThis: "Construire ce séjour",
    combineTitle: "Ces univers se combinent",
    combineBody:
      "Un bilan le matin, un bain thermal l'après-midi, une marche le lendemain : c'est le cas le plus fréquent, et le planificateur sait le faire tenir sans surcharger vos journées.",
    combineCta: "Décrire mon projet en une phrase",
  },

  heritage: {
    eyebrow: "Patrimoine",
    title1: "Sept sites au patrimoine mondial.",
    title2: "Et le temps de les voir.",
    lede:
      "Un séjour de santé laisse des journées libres. Elles ne sont pas du temps mort : chaque site est rattaché à une destination, avec sa distance, l'effort de marche qu'il demande et la durée à prévoir. Le planificateur s'en sert pour ne proposer que ce qui tient dans votre journée.",
    unescoTitle: "Inscrits au patrimoine mondial",
    unescoBody: "Sept sites, de la Casbah d'Alger au Tassili n'Ajjer.",
    majorTitle: "Autres lieux majeurs",
    whatYouSee: "Ce que l'on y voit",
    whenToGo: "Quand y aller",
    fromYourStay: "Depuis votre séjour",
    nearestDestination: "Destination la plus proche",
    distance: "Distance",
    onSite: "Sur place",
    plan: "À prévoir",
    hoursOnSite: "{hours} heures sur place",
    daysOrganised: "{days} jours, expédition organisée",
    addToJourney: "Intégrer à un parcours",
    nearby: "À proximité",
    majorSite: "Site majeur",
    immersionAvailable: "Immersion disponible",
    notShownTitle: "Ce que nous n'affichons pas",
    notShownBody:
      "Ni horaires, ni tarifs, ni jours de fermeture : ces informations changent et nous ne les avons pas à jour. Les durées indiquées sont des estimations de confort, pas des durées officielles. Vérifiez auprès du site avant de vous déplacer.",
    hoursNotice:
      "Horaires et tarifs non affichés : ils changent et nous ne les avons pas à jour. Vérifiez auprès du site avant de vous déplacer.",
    effortContemplative: "Sans effort",
    effortGentle: "Marche douce",
    effortDemanding: "Marche soutenue",
  },

  footer: {
    tagline:
      "Votre santé. Votre séjour. Votre parcours. Une plateforme qui réunit soins, bien-être, récupération et hospitalité, sans jamais remplacer un professionnel de santé.",
    discover: "Découvrir",
    mySpace: "Mon espace",
    trust: "Confiance",
    dashboard: "Tableau de bord",
    passport: "Health Passport",
    security: "Sécurité et confidentialité",
    howWeVerify: "Comment nous vérifions",
    aiLimits: "Limites de l'IA",
    legal:
      "Les informations diffusées sur cette plateforme sont indicatives et ne constituent pas un diagnostic médical. Seul un professionnel de santé habilité peut évaluer votre situation. Le catalogue d'établissements et de praticiens actuellement affiché est un jeu de démonstration, signalé comme tel.",
    building: "projet en construction",
  },
};

/**
 * La structure est contrainte, pas les valeurs : sans `as const`, chaque champ
 * est un `string` et les autres langues peuvent y placer leur propre texte tout
 * en devant fournir exactement les mêmes clés.
 */
export type Dictionary = typeof fr;
