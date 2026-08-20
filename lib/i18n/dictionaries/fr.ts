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
    account: "Compte",
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
    conciergeHelps: [
      "Préparer les questions à poser au praticien",
      "Organiser l’arrivée, les transferts et l’hébergement",
      "Trouver des activités compatibles avec la récupération",
    ],
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
    failed: "La construction du parcours a échoué. Réessayez.",
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

  /**
   * Titres et descriptions d'onglet.
   *
   * Regroupés ici plutôt que dispersés dans chaque page : c'est le premier
   * texte que lit un moteur de recherche, et le dernier qu'on pense à
   * traduire quand il vit à côté du composant.
   */
  meta: {
    journey: {
      title: "Construire mon parcours",
      description:
        "Décrivez votre projet en une phrase : objectifs, destination, soins, professionnels, itinéraire et budget estimatif se construisent devant vous.",
    },
    universes: {
      title: "Univers de séjour",
      description:
        "Thalassothérapie, thermalisme, remise en forme, repos, évasion, soins : six façons d'aborder un séjour en Algérie, et ce que chacune permet vraiment.",
    },
    destinations: {
      title: "Destinations santé",
      description:
        "Alger, Oran, Constantine, Tlemcen, Béjaïa, Annaba, Biskra, Ghardaïa : huit destinations pour un séjour de santé, de bien-être ou de remise en forme.",
    },
    heritage: {
      title: "Patrimoine",
      description:
        "Sept sites inscrits au patrimoine mondial et cinq sites majeurs, avec la distance, l'effort de marche et le temps à prévoir depuis votre destination.",
    },
    retreats: {
      title: "Séjours bien-être",
      description:
        "Reset, Sleep, Fit, Recovery, Mind & Body, Digital Break : des séjours de 3 à 10 jours construits autour d'un rythme, pas d'une promesse.",
    },
    news: {
      title: "Actualités",
      description:
        "Événements, festivals, ouvertures et cures saisonnières en Algérie : une veille éditoriale vérifiée avant publication.",
    },
    submitNews: {
      title: "Proposer un événement",
      description:
        "Vous organisez un événement, ouvrez un établissement ou lancez une offre en Algérie ? Proposez-le pour le fil d'actualité.",
    },
    moderation: { title: "Modération du fil", description: "" },
    map: {
      title: "Carte santé de l'Algérie",
      description:
        "Explorez les destinations santé de l'Algérie : cliniques, dentaire, rééducation, thermalisme, remise en forme, hébergements adaptés.",
    },
    concierge: {
      title: "Concierge santé",
      description:
        "Un assistant pour préparer votre séjour, organiser vos rendez-vous et comprendre le déroulement administratif. Un conseiller humain reste joignable.",
    },
    trust: {
      title: "Sécurité et confiance",
      description:
        "Comment vos données sont protégées, comment les professionnels sont vérifiés, et où s'arrête précisément l'intelligence artificielle sur cette plateforme.",
    },
    space: {
      title: "Mon espace",
      description:
        "Votre parcours, vos rendez-vous, vos documents et votre budget, réunis en un seul endroit.",
    },
    account: {
      title: "Mon compte",
      description: "Connexion, création de compte et rôles sur la plateforme.",
    },
    passport: {
      title: "Health Passport",
      description:
        "Centralisez vos documents médicaux, ouvrez un accès temporaire à un praticien, révoquez-le quand vous voulez, et consultez le journal des accès.",
    },
  },

  regions: {
    littoral: "Littoral méditerranéen",
    "hauts-plateaux": "Hauts plateaux",
    sud: "Sud et portes du Sahara",
    "grand-sud": "Grand Sud",
  },

  destinations: {
    eyebrow: "Health destinations",
    title: "Huit façons de prendre soin de soi en Algérie.",
    lede:
      "Chaque destination a son climat, son rythme et ses points forts. Le bon choix dépend moins de la ville que de ce que vous venez y faire.",
    discover: (name: string) => `Découvrir ${name}`,
    medicalOffer: "Offre de soins",
    wellbeing: "Bien-être et détente",
    recovery: "Récupération",
    activities: "À faire sur place",
    specialtiesHere: "Spécialités présentes",
    facilitiesHere: "Établissements sur place",
    bestFor: "Indiqué pour",
    getThere: "Y aller",
    airport: "Aéroport",
    nearbyHeritage: "Patrimoine à proximité",
    buildHere: (name: string) => `Construire un parcours à ${name}`,
    stayIn: (name: string) => `Un séjour à ${name}`,
    notFound: "Destination introuvable",
    noFacilities:
      "Aucun établissement de démonstration n'est rattaché à cette destination pour le moment.",

    whyCome: "Ce pour quoi on y vient",
    whyComeBody:
      "Les objectifs auxquels cette destination répond le mieux, et les spécialités déclarées par les structures de la région.",
    suitedGoals: "Objectifs adaptés",
    seeAndLive: "À voir, à vivre",
    listedFacilities: "Structures référencées",
    demoCatalogue: "Catalogue de démonstration",
    demoNotice:
      "Ces fiches sont fictives et servent uniquement à rendre l'interface démontrable. Aucun établissement réel n'est nommé tant que des partenaires vérifiés ne sont pas intégrés.",
    retreatsHere: "Séjours proposés ici",
    ctaBody:
      "Indiquez vos objectifs : le parcours, les professionnels et l'estimation se construisent en quelques secondes.",

    sections: {
      offreMedicale: "L'offre médicale",
      bienEtre: "Bien-être et récupération",
      recuperation: "Le rythme sur place",
      hebergement: "Où loger",
      accessibilite: "Accessibilité",
      transport: "Se déplacer",
      gastronomie: "À table",
      patrimoine: "Le lieu",
    },
  },

  map: {
    eyebrow: "Algeria Health Map",
    title1: "Le territoire, lu par",
    title2: "la santé et le bien-être.",
    lede:
      "Filtrez par type de structure et découvrez comment se répartit l'offre entre littoral, hauts plateaux et Sahara.",
    filterGroup: "Filtrer par type de structure",
    showAll: "Tout afficher",
    svgLabel: "Carte de l'Algérie situant les destinations santé",
    svgTitle: "Carte santé de l'Algérie",
    simplified: "Tracé simplifié, destiné à la lecture et non à la navigation.",
    close: "Fermer le détail",
    listedFacilities: "Structures référencées",
    noMatch: "Aucune structure ne correspond aux filtres actifs.",
    demoNotice: "Catalogue de démonstration : ces structures sont fictives.",
    selectPrompt: "Sélectionnez une destination",
    selectBody:
      "Les pastilles indiquent le nombre de structures correspondant aux filtres. Touchez une destination pour en voir le détail.",
    footnote: (destinations: number, wilayas: number) =>
      `${destinations} destinations éditoriales · ${wilayas} wilayas · aucune donnée de localisation n'est collectée.`,
  },

  retreats: {
    eyebrow: "Wellness retreats",
    title: "Des séjours construits autour d'un rythme.",
    lede:
      "Chaque programme décrit une durée, des activités et un niveau d'intensité — jamais un effet physiologique promis. Un séjour organise votre temps ; il ne soigne pas à votre place.",
    demoLabel: "Programmes de démonstration — fourchettes indicatives",
    included: "Inclus",
    schedule: "Déroulé",
    dayShort: "J",
    adapt: "Adapter à mon cas",
    request: (name: string, days: number, destination: string) =>
      `${name} : ${days} jours à ${destination}`,
    footnote:
      "Ces montants sont des ordres de grandeur destinés à la démonstration. Ils ne proviennent d'aucun établissement réel et ne constituent pas un devis. Le vocabulaire employé évite volontairement les promesses non étayées : nous ne parlons pas de « detox », terme sans définition médicale établie, mais du rythme réellement proposé.",
    intensity: {
      repos: "Repos",
      douce: "Intensité douce",
      moderee: "Intensité modérée",
      soutenue: "Intensité soutenue",
    },
  },

  trustPage: {
    eyebrow: "Safety & Trust",
    title: "Ce que nous faisons de vos données, et où s'arrête l'IA.",
    lede:
      "La santé n'est pas un domaine où l'on demande de faire confiance sur parole. Cette page décrit les règles telles qu'elles sont appliquées dans le code, pas telles qu'on aimerait les présenter.",

    dataTitle: "Vos données",
    principles: [
      {
        title: "Vos documents restent les vôtres",
        body: "Ils sont stockés dans votre espace et ne sont transmis à personne sans une action explicite de votre part. Aucun partage n'est automatique, aucun n'est permanent.",
      },
      {
        title: "Un partage a toujours une fin",
        body: "Chaque accès est nominatif et porte une date d'expiration que vous choisissez. Passé ce délai, il se ferme seul. Vous pouvez aussi le révoquer immédiatement.",
      },
      {
        title: "Vous voyez qui a consulté quoi",
        body: "Chaque ouverture d'un document est inscrite dans un journal que vous seul consultez : qui, quel document, à quel moment.",
      },
      {
        title: "Le minimum de données nécessaires",
        body: "Nous ne demandons que ce qui sert au séjour. Renseigner un antécédent ou une allergie reste volontaire, et vous pouvez le retirer.",
      },
    ],
    accessLog: "Voir le journal d'accès de mon espace",

    verificationTitle: "Comment nous vérifions",
    verificationBody:
      "Un badge « Vérifié » ne signifie pas que nous garantissons la qualité des soins — nous n'avons pas qualité à l'évaluer. Il signifie que des éléments précis ont été contrôlés, et il indique lesquels, avec la date.",
    statuses: [
      {
        label: "Vérifié",
        body: "Identité juridique, adresse et spécialités déclarées ont été contrôlées. La fiche indique la date du dernier contrôle et la liste exacte de ce qui a été vérifié.",
      },
      {
        label: "Vérification en cours",
        body: "Le dossier a été reçu, le contrôle n'est pas terminé. La fiche reste consultable, avec cette mention.",
      },
      {
        label: "Déclaratif",
        body: "Les informations viennent de l'établissement et n'ont pas encore été contrôlées. C'est écrit sur la fiche, sans euphémisme.",
      },
    ],
    noInventedCertification: "Aucune certification n'est inventée",
    noInventedBody:
      "Si nous ne disposons pas d'un document, rien n'est affiché. Un champ vide vaut mieux qu'une mention rassurante mais infondée.",

    aiTitle: "Les limites de l'IA",
    aiBody:
      "Ces limites ne sont pas seulement écrites dans les consignes données au modèle. Elles sont appliquées à la sortie, sur chaque réponse, quelle que soit son origine — moteur de règles ou modèle de langage. Une consigne se contourne ; un filtre de sortie, non.",
    aiCanTitle: "Ce que l'assistant peut faire",
    aiCan: [
      "Comprendre une intention exprimée en langage naturel",
      "Organiser des besoins en catégories et en étapes",
      "Proposer des professionnels et expliquer pourquoi",
      "Construire un itinéraire et estimer des contraintes logistiques",
      "Préparer des questions à poser au praticien",
      "Repérer qu'une pièce semble manquante dans un dossier",
    ],
    aiCannotTitle: "Ce qu'il ne fera jamais",
    aiCannot: [
      "Poser ou suggérer un diagnostic",
      "Prescrire un traitement ou indiquer une posologie",
      "Commenter, modifier ou interrompre un traitement en cours",
      "Interpréter médicalement une analyse ou une imagerie",
      "Promettre un résultat de santé",
      "Inventer un établissement, un tarif ou une certification",
    ],
    engineActive: "Moteur actuellement actif :",
    engineBody:
      "Lorsqu'aucun fournisseur n'est configuré, la plateforme fonctionne intégralement sur son moteur de règles déterministe — mêmes garde-fous, mêmes résultats reproductibles.",
    emergencyBody:
      "En cas de formulation évoquant une urgence, l'assistant interrompt toute autre réponse et renvoie vers les secours. En Algérie : Protection civile 14, SAMU 115.",

    questionTitle: "Une question sur vos données ?",
    questionBody:
      "Un conseiller peut répondre directement, sans passer par l'assistant. Les demandes portant sur l'accès, la rectification ou la suppression de vos informations sont traitées par une personne.",
  },

  vault: {
    filterGroup: "Filtrer par catégorie",
    all: (n: number) => `Tous (${n})`,
    addedOn: (date: string) => `ajouté le ${date}`,
    share: "Partager",
    attentionNote:
      "Signalé automatiquement sur la forme du document — son contenu médical n’est jamais analysé.",
    accesses: (n: number) => `Accès (${n} actif${n > 1 ? "s" : ""})`,
    revokedOn: (date: string) => `Révoqué le ${date}`,
    expiresOn: (date: string) => `Expire le ${date}`,
    revoke: "Révoquer",
    auditTitle: "Qui a consulté mes documents",
    auditNotice:
      "Ce journal vous est réservé. Aucune de ces informations n’est visible par les établissements.",
    openAccess: "Ouvrir un accès temporaire",
    cancel: "Annuler",
    recipient: "Destinataire",
    duration: "Durée de l’accès",
    grant: "Accorder l’accès",
    grantNotice: "L’accès se ferme seul à l’échéance. Vous pouvez le révoquer avant.",
    durations: { d1: "24 heures", d7: "7 jours", d30: "30 jours" },
    you: "Vous",
    granted: (destinataire: string, jours: number, date: string) =>
      `Accès accordé à ${destinataire} pour ${jours} jour${jours > 1 ? "s" : ""}, jusqu’au ${date}.`,
    revokedLog: (destinataire: string) => `Accès de ${destinataire} révoqué immédiatement.`,
    megabytes: (n: string) => `${n} Mo`,
    categories: {
      analyses: "Analyses",
      imagerie: "Imagerie",
      ordonnances: "Ordonnances",
      "comptes-rendus": "Comptes rendus",
      factures: "Factures",
      administratif: "Administratif",
    },
  },

  submitForm: {
    sentTitle: "Proposition enregistrée",
    sentBody:
      "Merci. Elle sera relue avant d’apparaître dans le fil. Nous vérifions systématiquement la source, la date et le lieu — c’est ce qui fait que nos lecteurs peuvent s’y fier.",
    sentAgain: "Proposer autre chose",
    title: "Titre",
    titleHint: "Ce que vous annonceriez en une phrase.",
    titlePlaceholder: "Ouverture d’un centre de thalassothérapie à Aïn Turck",
    description: "Description",
    descriptionHint: "Ce qu’il faut savoir : quoi, pour qui, quand.",
    descriptionPlaceholder:
      "Bassins d’eau de mer chauffée, espace de récupération et programmes encadrés…",
    category: "Catégorie",
    wilaya: "Wilaya",
    startsOn: "Date de début",
    startsOnHint: "Facultatif pour une ouverture.",
    organisation: "Organisation",
    organisationPlaceholder: "Nom de votre établissement",
    sourceUrl: "Lien vérifiable",
    sourceUrlHint: "Page officielle, communiqué ou article. Sans lien, nous ne publions pas.",
    sending: "Envoi…",
    send: "Envoyer la proposition",
    reviewed: "Relu avant publication.",
    failed: "Envoi impossible.",
  },

  immersive: {
    panoramaCaption: "Vue 360°",
    videoLabel: (titre: string) => `Vidéo — ${titre}`,
    panorama360: (titre: string) => `Vue à 360 degrés de ${titre}`,
    pendingTitle: (titre: string) => `${titre} en immersion`,
    pendingBody:
      "Cet emplacement attend son contenu. Déposez un fichier et il s’affiche, sans modification de code.",
    hintPanorama: "panorama, mode photosphère d’un téléphone",
    hintVideo: "vidéo, avec une affiche en",
    hintModel: "modèle 3D, capture Luma AI ou Polycam",
    folder: "Dossier",
  },

  video: {
    play: (titre: string) => `Lire la vidéo : ${titre}`,
    pause: "Mettre en pause",
    unmute: "Activer le son",
    mute: "Couper le son",
    captionsLabel: "Français",
  },

  badges: {
    demoTitle: "Contenu de démonstration, sans valeur réelle",
    declaredTitle: "Informations déclarées par l’établissement, non contrôlées",
    checkedOn: (date: string) => `Contrôlé le ${date}`,
    unknownDate: "date inconnue",
  },

  accountPage: {
    eyebrow: "Votre compte",
    title: "Un compte, un rôle, des droits qui en découlent",
    lede:
      "L’accès à la modération ne repose plus sur un jeton partagé mais sur une personne identifiée. Le jeton reste, réservé à ce qui n’a pas de session : la tâche planifiée, un script d’exploitation.",
    rolesTitle: "Les quatre rôles",
    roleDetails: {
      visiteur: "Construit ses parcours, gère son espace et ses documents.",
      partenaire: "En plus : tient à jour les fiches de son établissement.",
      moderateur: "En plus : décide de ce qui paraît dans le fil d’actualité.",
      admin: "En plus : crée des comptes et attribue les rôles.",
    },
    persistent: "Base connectée : les comptes et les sessions survivent au redéploiement.",
    volatile:
      "Aucune base configurée : les comptes vivent en mémoire du processus et disparaîtront au redémarrage. Renseignez DATABASE_URL pour les conserver.",
  },

  account: {
    loading: "Chargement…",
    signIn: "Se connecter",
    signUp: "Créer un compte",
    signOut: "Se déconnecter",
    displayName: "Nom affiché",
    email: "Adresse e-mail",
    password: "Mot de passe",
    passwordHint: "Au moins dix caractères. Il n’est jamais stocké en clair.",
    pending: "En cours…",
    failed: "L’opération a échoué. Réessayez.",
    canDo: "Ce que ce compte permet",
    notice:
      "Le premier compte créé administre la plateforme. Les suivants sont des visiteurs, et un administrateur peut les promouvoir.",
    roles: {
      visiteur: "Visiteur",
      partenaire: "Partenaire",
      moderateur: "Modérateur",
      admin: "Administrateur",
    },
  },

  chat: {
    title: "Concierge santé",
    subtitle: "Assistant de parcours — ne remplace pas un professionnel",
    thinking: "Le concierge réfléchit…",
    writingAria: "Le concierge rédige une réponse",
    yourMessage: "Votre message",
    placeholder: "Écrivez votre message…",
    send: "Envoyer",
    unavailable: "Réponse indisponible.",
    privacyNotice:
      "N’indiquez pas d’informations que vous ne souhaitez pas transmettre. En cas d’urgence, contactez les secours : Protection civile 14, SAMU 115.",
  },

  conciergePage: {
    eyebrow: "Votre concierge",
    title: "Une question sur votre séjour ?",
    lede:
      "Le concierge connaît la plateforme, les destinations et le déroulement d'un séjour. Il n'émet aucun avis médical : pour cela, il vous oriente vers un professionnel habilité.",
    humanTitle: "Un humain peut vous accompagner",
    humanBody:
      "Certaines situations méritent une voix, pas une interface. Un conseiller peut reprendre le dossier à tout moment, sans que vous ayez à tout réexpliquer.",
    callback: "Rappel demandé sous 24 h ouvrées",
    hours: "Dimanche au jeudi, 9 h – 17 h",
    writtenTrace: "Suivi écrit conservé dans votre espace",
    askCallback: "Demander à être rappelé",
    demoNotice: "Démonstration : la prise de contact n'est pas encore raccordée à un service réel.",
    engineTitle: "Moteur actif",
    engineOn:
      "Les réponses passent par un filtre de sortie qui bloque diagnostic, prescription et promesse de résultat.",
    engineOff:
      "Aucune clé API configurée : les réponses proviennent du moteur de règles déterministe, avec les mêmes garde-fous.",
  },

  passport: {
    eyebrow: "Health Passport",
    title: "Vos documents, sous votre contrôle",
    lede:
      "Un partage est nominatif, limité dans le temps et révocable à tout instant. Chaque geste — le vôtre comme celui d'un praticien — est inscrit au journal.",
    demoLabel: "Documents de démonstration",
    noticeStart:
      "Dans cette démonstration, l'état vit dans votre navigateur et rien n'est transmis. Une mise en production exige un chiffrement au repos, un contrôle d'accès appliqué côté serveur et un journal inaltérable —",
    noticeLink: "voir le centre de confiance",
  },

  space: {
    eyebrow: "Votre espace",
    hello: (name: string) => `Bonjour ${name}`,
    demoLabel: "Compte de démonstration",
    yourJourney: "Votre parcours",
    dates: (from: string, to: string) => `Du ${from} au ${to}`,
    inProgress: "En cours",
    resume: "Reprendre la planification",
    nextAppointment: "Prochain rendez-vous",
    documentsCount: (count: number) => `${count} documents`,
    activeShares: (count: number) =>
      `${count} partage${count > 1 ? "s" : ""} actif${count > 1 ? "s" : ""}`,
    manageDocuments: "Gérer mes documents",
    estimatedBudget: "Budget estimé",
    estimateNotice: "Estimation indicative, hors devis professionnel.",
    conciergeBody: "Une question sur l'organisation, les documents ou le déroulement ?",
    agenda: "Votre agenda",
    demoNotice:
      "Cet espace fonctionne actuellement sur un compte de démonstration : aucune authentification n'est branchée et les données ne sont pas persistées. Les informations affichées sont fictives.",
  },

  newsPage: {
    eyebrow: "Le fil",
    title1: "Ce qui se passe en Algérie,",
    title2: "côté santé et bien-être.",
    lede:
      "Festivals, cures saisonnières, nouvelles adresses, rendez-vous gastronomiques. Une veille automatisée propose ; une personne vérifie avant publication.",
    submit: "Proposer un événement",
    empty:
      "Aucune actualité publiée pour le moment. La veille tourne chaque jour et les propositions sont examinées avant d'apparaître ici.",
    howTitle: "Comment ce fil est constitué",
    howBodyStart:
      "Un agent parcourt chaque jour des flux de presse algériens, une recherche web ciblée et les soumissions de nos partenaires. Il écarte automatiquement ce qui n'a pas de source vérifiable, ce qui sort du périmètre santé et bien-être, et les doublons. Ce qui reste est",
    howBodyStrong: "proposé",
    howBodyEnd:
      ", jamais publié : une personne relit et décide. Aucune information ne paraît ici sans avoir été validée, et chaque élément affiche sa source.",
    place: "Lieu",
    date: "Date",
    range: (from: string, to: string) => `Du ${from} au ${to}`,
    categories: {
      evenement: "Événement",
      ouverture: "Nouvelle adresse",
      promotion: "Offre",
      festival: "Festival",
      gastronomie: "Gastronomie",
      cure: "Cure et thermalisme",
    },
    origins: {
      rss: "Presse",
      recherche: "Recherche web",
      partenaire: "Partenaire",
    },
  },

  submitNews: {
    eyebrow: "Partenaires",
    title: "Vous avez quelque chose à annoncer ?",
    lede:
      "Une ouverture, un festival, une cure saisonnière, un rendez-vous gastronomique. Vous connaissez les détails mieux que n'importe quelle veille automatique.",
    weAccept: "Ce que nous publions",
    accepted: [
      "Ce qui a un lien vérifiable",
      "Ce qui se passe en Algérie",
      "Ce qui touche la santé, le bien-être, la forme ou la gastronomie",
      "Ce qui a une date ou une adresse identifiable",
    ],
    weReject: "Ce que nous écartons",
    rejected: [
      "Les annonces sans source consultable",
      "Les promesses de résultat de santé",
      "Les tarifs présentés comme garantis",
      "Les publications purement publicitaires",
    ],
    notice:
      "Toute proposition est relue avant publication. Nous ne facturons pas la parution et une proposition acceptée ne vaut pas recommandation de notre part.",
  },

  moderation: {
    eyebrow: "Back-office",
    title: "Modération du fil",
    lede: "L'agent propose, vous décidez. Rien n'atteint le fil public sans un clic sur cette page.",
    noticeStart: "Cette page est protégée par un jeton partagé (",
    noticeEnd:
      "), en attendant une véritable authentification avec gestion des rôles. Les décisions sont conservées en mémoire du processus : elles ne survivront pas au prochain déploiement tant que la base de données n'est pas branchée.",
  },

  goalPicker: {
    legend: "Vos objectifs",
    describeLabel: "Ou décrivez votre projet en une phrase",
    placeholder:
      "Je souhaite venir en Algérie une dizaine de jours pour faire un bilan, m'occuper de mes dents et me reposer un peu.",
    examples: [
      "Je viens de France 10 jours : soins dentaires, perdre un peu de poids et me reposer.",
      "Une semaine à Béjaïa pour reprendre le sport après une longue pause.",
      "Bilan de santé complet à Alger, puis quelques jours au calme.",
    ],
    selectedCount: (count: number) =>
      `${count} objectif${count > 1 ? "s" : ""} sélectionné${count > 1 ? "s" : ""}`,
    prompt: "Sélectionnez un objectif ou décrivez votre projet",
  },

  directory: {
    eyebrow: "Annuaire",
    title: "Établissements et professionnels",
    lede:
      "Une liste consultée n'est pas une recommandation. Ici, aucun score : chaque fiche indique ce qui a été vérifié, et ce qui reste déclaratif.",
    demoLabel: "Catalogue de démonstration — établissements fictifs",
    metaDescription:
      "Annuaire des établissements et praticiens : spécialités, langues d'accueil, services d'accompagnement et statut de vérification.",
    languages: "Langues",
    practitioners: "Praticiens",
    international: "International",
    yes: "Oui",
    notDeclared: "Non déclaré",
    specialties: "Spécialités",
    services: "Services d'accompagnement",
    accessibility: "Accessibilité",
    team: "Praticiens",
    notFound: "Établissement introuvable",
    verifiedOn: "Vérifié le",
    checks: "Points contrôlés",
    buildAround: "Construire un parcours autour de cet établissement",

    declaredSpecialties: "Spécialités déclarées",
    attachedPractitioners: "Praticiens rattachés",
    declaredExperience: "Expérience déclarée",
    years: "ans",
    secondOpinion: "Second avis",
    secondOpinionYes: "Accepté",
    secondOpinionNo: "Non proposé",
    inBrief: "En résumé",
    hostLanguages: "Langues d'accueil",
    internationalPatients: "Patients internationaux",
    internationalDeclared: "Prise en charge déclarée",
    positioning: "Niveau de positionnement",
    whatWasVerified: "Ce qui a été vérifié",
    addToJourney: "Intégrer à un parcours",
    stayIn: (destination: string) => `Un séjour à ${destination}`,
    noPricingNotice:
      "Aucun tarif, aucune disponibilité et aucune certification ne sont affichés tant qu'ils n'ont pas été fournis et datés par l'établissement.",
  },

  /** Niveau de positionnement. L'index 0 n'est jamais utilisé. */
  tiers: ["", "Positionnement essentiel", "Positionnement confort", "Positionnement premium"] as [
    string,
    string,
    string,
    string,
  ],

  /** Catégories d'établissement, affichées en badge sur toutes les fiches. */
  facilityKinds: {
    clinique: "Clinique",
    hopital: "Établissement hospitalier",
    dentaire: "Centre dentaire",
    reeducation: "Centre de rééducation",
    thermal: "Station thermale",
    spa: "Spa et bien-être",
    forme: "Centre de remise en forme",
    salle: "Salle de sport",
    laboratoire: "Laboratoire d'analyses",
    imagerie: "Centre d'imagerie",
    nutrition: "Nutrition et diététique",
    hebergement: "Hébergement adapté",
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
