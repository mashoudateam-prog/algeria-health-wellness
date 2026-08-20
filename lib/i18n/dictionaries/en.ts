import type { Dictionary } from "./fr";

/**
 * English dictionary.
 *
 * Typed against the French source, so a key added there and forgotten here is
 * a compile error rather than a missing string discovered in production.
 *
 * Translated, not transliterated: the register is the same — plain, measured,
 * never promotional. The medical caveats are translated with particular care,
 * since they are the sentences that carry legal weight.
 */
export const en: Dictionary = {
  nav: {
    home: "Home",
    journey: "My journey",
    universes: "Journeys",
    destinations: "Destinations",
    heritage: "Heritage",
    retreats: "Retreats",
    news: "What's on",
    map: "Health map",
    trust: "Trust",
    concierge: "Concierge",
    profile: "Profile",
    account: "Account",
    explore: "Explore",
    start: "Get started",
    adviser: "An adviser",
    skipToContent: "Skip to main content",
    mainNav: "Main navigation",
    mobileNav: "Mobile navigation",
    homeAria: "Algeria Health & Wellness, home",
    language: "Language",
  },

  common: {
    demo: "Demo",
    verified: "Verified",
    declarative: "Self-declared",
    verificationPending: "Verification under way",
    source: "Source",
    readMore: "Explore",
    seeSheet: "View details",
    buildJourney: "Build my journey",
    talkToAdviser: "Talk to an adviser",
    days: "days",
    day: "day",
    hours: "h",
    travellers: "travellers",
    from: "From",
    estimate: "Estimate",
    disclaimer:
      "This information is provided for guidance only and does not constitute a medical diagnosis.",
  },

  home: {
    eyebrow: "Health travel · Algeria",
    title1: "Take care of yourself.",
    title2: "Discover Algeria differently.",
    lede:
      "Care, wellbeing and fitness, between the Mediterranean, the high plateaus and the Sahara. You are not booking an appointment — you are building a journey.",
    exploreDestinations: "Explore destinations",
    step1: "You set your goal",
    step2: "A journey takes shape",
    step3: "You live your stay",

    contrastsEyebrow: "A country of contrasts",
    contrastsTitle1: "Africa's second-largest country.",
    contrastsTitle2: "And one of its least travelled.",
    contrastsBody:
      "Twelve hundred kilometres of Mediterranean coast, wooded massifs, high plateaus, and a Sahara covering more than eight tenths of the territory. This is the setting for your stay.",

    goalsEyebrow: "Where it starts",
    goalsTitle: "What would you like to improve?",
    goalsBody:
      "No list of clinics, no search engine. You start from your own intention — several goals can sit in the same stay, and that is in fact the most common case.",
    goalsNotice:
      "The information produced is indicative and does not constitute a medical diagnosis.",

    journeyEyebrow: "Health Journey",
    journeyTitle1: "Simply say what you need.",
    journeyTitle2: "The rest falls into place.",
    journeyBody:
      "Your sentence becomes a journey: a destination, professionals, days of care, time to recover, somewhere to stay, activities that fit, and an indicative budget.",
    journeyCta: "Try the Journey Builder",

    destinationsEyebrow: "Health destinations",
    destinationsTitle1: "Algeria as a",
    destinationsTitle2: "health destination.",
    destinationsAll: "See all {count} destinations",

    trustEyebrow: "Trust",
    trustTitle1: "Trust is not declared.",
    trustTitle2: "It is demonstrated.",
    trustCta: "Visit the trust centre",

    conciergeEyebrow: "Support",
    conciergeTitle: "A person can accompany you.",
    conciergeBody:
      "The concierge answers practical questions at any hour. But some situations call for a voice rather than an interface — an adviser then takes over, whenever you ask.",
    conciergeOpen: "Open the concierge",
  },

  phases: {
    discover: { label: "I set my goal", detail: "What you want to improve, in your own words." },
    assess: { label: "The platform understands", detail: "Your needs are organised, never diagnosed." },
    plan: { label: "I discover my journey", detail: "Day by day, with time to rest." },
    book: { label: "I choose my professionals", detail: "With the reasons behind every suggestion." },
    experience: { label: "I live my stay", detail: "Appointments, transfers, recovery, discovery." },
    followUp: { label: "I am supported afterwards", detail: "Documents, reminders, remote follow-up." },
  },

  trust: {
    verificationTitle: "Verification shown, never invented",
    verificationBody:
      "Every listing states what was checked and when. Where information is merely declared by the facility, we say so.",
    documentsTitle: "You keep control of your documents",
    documentsBody:
      "Sharing is named, time-limited and revocable. A log shows you who opened what, and when.",
    aiTitle: "The AI does not practise medicine",
    aiBody:
      "It organises, prepares and directs. It makes no diagnosis, prescribes nothing, and never interprets a result.",
  },

  builder: {
    eyebrow: "Health Journey Builder",
    title1: "Describe your plan.",
    title2: "The stay builds itself.",
    projectLabel: "Your plan, in your own words",
    projectPlaceholder: "I'd like to come to Algeria for a week to take care of myself.",
    goalsLegend: "Your goals",
    moreOptions: "Set duration, travellers and budget",
    duration: "Duration",
    travellersLabel: "Travellers",
    arriving: "You are arriving",
    fromAlgeria: "I am already in Algeria",
    fromAbroad: "I am coming from abroad",
    destinationLabel: "Preferred destination",
    destinationAuto: "Let the platform suggest one",
    comfort: "Comfort level",
    comfortEssential: "Essential",
    comfortComfort: "Comfort",
    comfortPremium: "Premium",
    build: "Build my journey",
    building: "Building…",
    rebuild: "Rebuild",
    buildingStage: "Building your journey",

    stageGoal: "Goal",
    stageDestination: "Destination",
    stageCare: "Care & wellbeing",
    stageProfessionals: "Professionals",
    stageLodging: "Accommodation",
    stageItinerary: "Itinerary",
    stageBudget: "Budget",
    stageJourney: "My journey",

    yourJourney: "Your journey",
    understood: "What we understood",
    confidence:
      "Confidence in what we inferred: {percent}%. Correct anything that does not match and rebuild.",
    rulesEngine: "Rules engine",
    aiAssisted: "AI-assisted",
    cautions: "Points to watch",
    itineraryTitle: "Your itinerary, day by day",
    itineraryBody:
      "Days following a procedure are deliberately kept light. The pace remains to be confirmed with the professional treating you.",
    matchTitle: "Why we are suggesting these options",
    matchBody:
      "No overall score, no stars. Every match is justified by criteria you can check for yourself.",
    budgetTitle: "Budget estimate",
    budgetItem: "Item",
    budgetRange: "Range",
    budgetTotal: "Total estimate",
    budgetCaption: "Estimate broken down by item",
    nextSteps: "Next steps",
    failed: "The journey could not be built. Please try again.",
    demoNotice:
      "The facilities and practitioners shown come from a demonstration catalogue: they are fictional and flagged as such.",
  },

  universes: {
    eyebrow: "Journeys",
    title1: "Six ways to approach",
    title2: "a stay in Algeria.",
    lede:
      "A goal answers \"what would you like to improve\". A journey type answers \"what kind of stay do you want to live\". Both meet in the same itinerary — you simply enter through a different door.",
    allows: "What this makes possible",
    buildThis: "Build this stay",
    combineTitle: "These journeys combine",
    combineBody:
      "A health check in the morning, a thermal bath in the afternoon, a walk the next day: that is the most common case, and the planner knows how to fit it without overloading your days.",
    combineCta: "Describe your plan in one sentence",
  },

  heritage: {
    eyebrow: "Heritage",
    title1: "Seven World Heritage sites.",
    title2: "And the time to see them.",
    lede:
      "A health stay leaves free days. They are not dead time: each site is tied to a destination, with its distance, the walking it demands and the time to allow. The planner uses this to suggest only what fits into your day.",
    unescoTitle: "Inscribed on the World Heritage List",
    unescoBody: "Seven sites, from the Casbah of Algiers to Tassili n'Ajjer.",
    majorTitle: "Other major sites",
    whatYouSee: "What you will see",
    whenToGo: "When to go",
    fromYourStay: "From your stay",
    nearestDestination: "Nearest destination",
    distance: "Distance",
    onSite: "On site",
    plan: "Allow for",
    hoursOnSite: "{hours} hours on site",
    daysOrganised: "{days} days, organised expedition",
    addToJourney: "Add to a journey",
    nearby: "Nearby",
    majorSite: "Major site",
    immersionAvailable: "Immersion available",
    notShownTitle: "What we do not display",
    notShownBody:
      "No opening hours, no prices, no closing days: these change and we do not have them up to date. The durations given are comfort estimates, not official visiting times. Check with the site before travelling.",
    hoursNotice:
      "Opening hours and prices are not shown: they change and we do not have them up to date. Check with the site before travelling.",
    effortContemplative: "No effort",
    effortGentle: "Gentle walking",
    effortDemanding: "Demanding walking",
  },

  meta: {
    journey: {
      title: "Build my journey",
      description:
        "Describe your plan in one sentence: goals, destination, care, professionals, itinerary and an indicative budget take shape in front of you.",
    },
    universes: {
      title: "Types of stay",
      description:
        "Thalassotherapy, thermal cures, fitness, rest, escape, care: six ways to approach a stay in Algeria, and what each one actually makes possible.",
    },
    destinations: {
      title: "Health destinations",
      description:
        "Algiers, Oran, Constantine, Tlemcen, Béjaïa, Annaba, Biskra, Ghardaïa: eight destinations for a stay built around health, wellbeing or fitness.",
    },
    heritage: {
      title: "Heritage",
      description:
        "Seven World Heritage sites and five major sites, with the distance, the walking involved and the time to allow from your destination.",
    },
    retreats: {
      title: "Wellbeing retreats",
      description:
        "Reset, Sleep, Fit, Recovery, Mind & Body, Digital Break: stays of 3 to 10 days built around a pace, not a promise.",
    },
    news: {
      title: "What's on",
      description:
        "Events, festivals, openings and seasonal cures in Algeria: an editorial watch checked before publication.",
    },
    submitNews: {
      title: "Submit an event",
      description:
        "Organising an event, opening a facility or launching an offer in Algeria? Submit it for the news feed.",
    },
    moderation: { title: "Feed moderation", description: "" },
    map: {
      title: "Algeria health map",
      description:
        "Explore Algeria's health destinations: clinics, dental care, rehabilitation, thermal spas, fitness centres, adapted accommodation.",
    },
    concierge: {
      title: "Health concierge",
      description:
        "An assistant to prepare your stay, arrange your appointments and understand the administrative steps. A human adviser remains reachable.",
    },
    trust: {
      title: "Security and trust",
      description:
        "How your data is protected, how professionals are verified, and exactly where artificial intelligence stops on this platform.",
    },
    space: {
      title: "My space",
      description:
        "Your journey, your appointments, your documents and your budget, gathered in one place.",
    },
    account: {
      title: "My account",
      description: "Sign in, create an account, and roles on the platform.",
    },
    passport: {
      title: "Health Passport",
      description:
        "Centralise your medical documents, open temporary access to a practitioner, revoke it whenever you want, and review the access log.",
    },
  },

  regions: {
    littoral: "Mediterranean coast",
    "hauts-plateaux": "High plateaus",
    sud: "The south and the gates of the Sahara",
    "grand-sud": "Deep Sahara",
  },

  destinations: {
    eyebrow: "Health destinations",
    title: "Eight ways to take care of yourself in Algeria.",
    lede:
      "Each destination has its own climate, pace and strengths. The right choice depends less on the city than on what you are coming to do there.",
    discover: (name: string) => `Explore ${name}`,
    medicalOffer: "Care available",
    wellbeing: "Wellbeing and relaxation",
    recovery: "Recovery",
    activities: "What to do here",
    specialtiesHere: "Specialties present",
    facilitiesHere: "Facilities here",
    bestFor: "Best for",
    getThere: "Getting there",
    airport: "Airport",
    nearbyHeritage: "Heritage nearby",
    buildHere: (name: string) => `Build a journey in ${name}`,
    stayIn: (name: string) => `A stay in ${name}`,
    notFound: "Destination not found",
    noFacilities: "No demonstration facility is attached to this destination yet.",

    whyCome: "What people come here for",
    whyComeBody:
      "The goals this destination answers best, and the specialties declared by the facilities in the region.",
    suitedGoals: "Goals it suits",
    seeAndLive: "To see, to experience",
    listedFacilities: "Listed facilities",
    demoCatalogue: "Demonstration catalogue",
    demoNotice:
      "These listings are fictional and exist only to make the interface demonstrable. No real facility is named until verified partners are onboarded.",
    retreatsHere: "Retreats offered here",
    ctaBody:
      "Set out your goals: the itinerary, the professionals and the estimate take shape in a few seconds.",

    sections: {
      offreMedicale: "Care available",
      bienEtre: "Wellbeing and recovery",
      recuperation: "The pace on the ground",
      hebergement: "Where to stay",
      accessibilite: "Getting there",
      transport: "Getting around",
      gastronomie: "At the table",
      patrimoine: "The place",
    },
  },

  map: {
    eyebrow: "Algeria Health Map",
    title1: "The country, read through",
    title2: "health and wellbeing.",
    lede:
      "Filter by type of facility and see how provision is spread across the coast, the high plateaus and the Sahara.",
    filterGroup: "Filter by type of facility",
    showAll: "Show all",
    svgLabel: "Map of Algeria showing the health destinations",
    svgTitle: "Algeria health map",
    simplified: "A simplified outline, drawn to be read rather than navigated.",
    close: "Close the panel",
    listedFacilities: "Listed facilities",
    noMatch: "No facility matches the active filters.",
    demoNotice: "Demonstration catalogue: these facilities are fictional.",
    selectPrompt: "Select a destination",
    selectBody:
      "The dots show how many facilities match the filters. Tap a destination to see its detail.",
    footnote: (destinations: number, wilayas: number) =>
      `${destinations} editorial destinations · ${wilayas} wilayas · no location data is collected.`,
  },

  retreats: {
    eyebrow: "Wellness retreats",
    title: "Stays built around a rhythm.",
    lede:
      "Each programme describes a length, a set of activities and a level of intensity — never a promised physiological effect. A retreat organises your time; it does not do the healing for you.",
    demoLabel: "Demonstration programmes — indicative ranges",
    included: "Included",
    schedule: "Day by day",
    dayShort: "D",
    adapt: "Adapt to my case",
    request: (name: string, days: number, destination: string) =>
      `${name}: ${days} days in ${destination}`,
    footnote:
      "These amounts are orders of magnitude for demonstration purposes. They come from no real facility and do not constitute a quotation. The wording deliberately avoids unsupported promises: we do not speak of \"detox\", a term with no established medical definition, but of the rhythm actually offered.",
    intensity: {
      repos: "Rest",
      douce: "Gentle intensity",
      moderee: "Moderate intensity",
      soutenue: "Demanding intensity",
    },
  },

  trustPage: {
    eyebrow: "Safety & Trust",
    title: "What we do with your data, and where the AI stops.",
    lede:
      "Health is not a field where you ask people to take your word for it. This page describes the rules as they are applied in the code, not as we would like to present them.",

    dataTitle: "Your data",
    principles: [
      {
        title: "Your documents stay yours",
        body: "They are stored in your space and are passed to no one without an explicit action from you. No sharing is automatic, and none is permanent.",
      },
      {
        title: "A share always has an end",
        body: "Every access is named and carries an expiry date you choose. Once that date passes, it closes by itself. You can also revoke it immediately.",
      },
      {
        title: "You see who opened what",
        body: "Every time a document is opened it is written into a log only you can read: who, which document, and when.",
      },
      {
        title: "The minimum data needed",
        body: "We ask only for what serves the stay. Recording a medical history or an allergy remains voluntary, and you can remove it.",
      },
    ],
    accessLog: "See the access log in my space",

    verificationTitle: "How we verify",
    verificationBody:
      "A \"Verified\" badge does not mean we guarantee the quality of care — we are not qualified to assess it. It means specific items have been checked, and it states which ones, with the date.",
    statuses: [
      {
        label: "Verified",
        body: "Legal identity, address and declared specialties have been checked. The listing shows the date of the last check and the exact list of what was verified.",
      },
      {
        label: "Verification under way",
        body: "The file has been received; the check is not finished. The listing stays visible, carrying this note.",
      },
      {
        label: "Self-declared",
        body: "The information comes from the facility and has not yet been checked. That is stated on the listing, without euphemism.",
      },
    ],
    noInventedCertification: "No certification is invented",
    noInventedBody:
      "If we do not hold a document, nothing is displayed. An empty field is better than a reassuring but unfounded claim.",

    aiTitle: "The limits of the AI",
    aiBody:
      "These limits are not only written into the instructions given to the model. They are applied to the output, on every answer, whatever its origin — rules engine or language model. An instruction can be worked around; an output filter cannot.",
    aiCanTitle: "What the assistant can do",
    aiCan: [
      "Understand an intention expressed in natural language",
      "Organise needs into categories and steps",
      "Suggest professionals and explain why",
      "Build an itinerary and estimate logistical constraints",
      "Prepare questions to put to the practitioner",
      "Notice that a document seems to be missing from a file",
    ],
    aiCannotTitle: "What it will never do",
    aiCannot: [
      "Make or suggest a diagnosis",
      "Prescribe a treatment or state a dosage",
      "Comment on, change or interrupt an ongoing treatment",
      "Interpret a test or a scan medically",
      "Promise a health outcome",
      "Invent a facility, a price or a certification",
    ],
    engineActive: "Engine currently active:",
    engineBody:
      "When no provider is configured, the platform runs entirely on its deterministic rules engine — the same guardrails, the same reproducible results.",
    emergencyBody:
      "If a message suggests an emergency, the assistant stops every other answer and points to the emergency services. In Algeria: Civil Protection 14, SAMU 115.",

    questionTitle: "A question about your data?",
    questionBody:
      "An adviser can answer directly, without going through the assistant. Requests concerning access to, correction of or deletion of your information are handled by a person.",
  },

  vault: {
    filterGroup: "Filter by category",
    all: (n: number) => `All (${n})`,
    addedOn: (date: string) => `added on ${date}`,
    share: "Share",
    attentionNote:
      "Flagged automatically on the form of the document — its medical content is never analysed.",
    accesses: (n: number) => `Access (${n} active)`,
    revokedOn: (date: string) => `Revoked on ${date}`,
    expiresOn: (date: string) => `Expires on ${date}`,
    revoke: "Revoke",
    auditTitle: "Who has opened my documents",
    auditNotice:
      "This log is yours alone. None of this information is visible to the facilities.",
    openAccess: "Open temporary access",
    cancel: "Cancel",
    recipient: "Recipient",
    duration: "Length of access",
    grant: "Grant access",
    grantNotice: "Access closes by itself at the deadline. You can revoke it before then.",
    durations: { d1: "24 hours", d7: "7 days", d30: "30 days" },
    you: "You",
    granted: (destinataire: string, jours: number, date: string) =>
      `Access granted to ${destinataire} for ${jours} day${jours > 1 ? "s" : ""}, until ${date}.`,
    revokedLog: (destinataire: string) => `Access for ${destinataire} revoked immediately.`,
    megabytes: (n: string) => `${n} MB`,
    categories: {
      analyses: "Test results",
      imagerie: "Imaging",
      ordonnances: "Prescriptions",
      "comptes-rendus": "Reports",
      factures: "Invoices",
      administratif: "Administrative",
    },
  },

  submitForm: {
    sentTitle: "Submission received",
    sentBody:
      "Thank you. It will be read before appearing in the feed. We check the source, the date and the place every time — that is what lets our readers rely on it.",
    sentAgain: "Submit something else",
    title: "Title",
    titleHint: "What you would announce in one sentence.",
    titlePlaceholder: "A thalassotherapy centre opens in Aïn Turck",
    description: "Description",
    descriptionHint: "What matters: what, for whom, when.",
    descriptionPlaceholder:
      "Heated seawater pools, a recovery area and supervised programmes…",
    category: "Category",
    wilaya: "Wilaya",
    startsOn: "Start date",
    startsOnHint: "Optional for an opening.",
    organisation: "Organisation",
    organisationPlaceholder: "Your facility’s name",
    sourceUrl: "Verifiable link",
    sourceUrlHint: "Official page, press release or article. Without a link, we do not publish.",
    sending: "Sending…",
    send: "Send the submission",
    reviewed: "Read before publication.",
    failed: "Could not send.",
  },

  immersive: {
    panoramaCaption: "360° view",
    videoLabel: (titre: string) => `Video — ${titre}`,
    panorama360: (titre: string) => `360-degree view of ${titre}`,
    pendingTitle: (titre: string) => `${titre} in immersion`,
    pendingBody:
      "This slot is waiting for its content. Drop a file in and it appears, with no code change.",
    hintPanorama: "panorama, photosphere mode on a phone",
    hintVideo: "video, with a poster image at",
    hintModel: "3D model, captured with Luma AI or Polycam",
    folder: "Folder",
  },

  video: {
    play: (titre: string) => `Play the video: ${titre}`,
    pause: "Pause",
    unmute: "Turn sound on",
    mute: "Turn sound off",
    captionsLabel: "French",
  },

  badges: {
    demoTitle: "Demonstration content, with no real-world value",
    declaredTitle: "Information declared by the facility, not checked",
    checkedOn: (date) => `Checked on ${date}`,
    unknownDate: "date unknown",
  },

  accountPage: {
    eyebrow: "Your account",
    title: "One account, one role, and the rights that follow",
    lede:
      "Access to moderation no longer rests on a shared token but on an identified person. The token remains, reserved for what has no session: the scheduled task, an operations script.",
    rolesTitle: "The four roles",
    roleDetails: {
      visiteur: "Builds journeys, manages their space and documents.",
      partenaire: "Also: keeps their facility’s listings up to date.",
      moderateur: "Also: decides what appears in the news feed.",
      admin: "Also: creates accounts and assigns roles.",
    },
    persistent: "Database connected: accounts and sessions survive a redeployment.",
    volatile:
      "No database configured: accounts live in process memory and will disappear on restart. Set DATABASE_URL to keep them.",
  },

  account: {
    loading: "Loading…",
    signIn: "Sign in",
    signUp: "Create an account",
    signOut: "Sign out",
    displayName: "Display name",
    email: "Email address",
    password: "Password",
    passwordHint: "At least ten characters. It is never stored in plain text.",
    pending: "Working…",
    failed: "The operation failed. Please try again.",
    canDo: "What this account allows",
    notice:
      "The first account created administers the platform. Later ones are visitors, and an administrator can promote them.",
    roles: {
      visiteur: "Visitor",
      partenaire: "Partner",
      moderateur: "Moderator",
      admin: "Administrator",
    },
  },

  chat: {
    title: "Health concierge",
    subtitle: "A planning assistant — not a substitute for a professional",
    thinking: "The concierge is thinking…",
    writingAria: "The concierge is writing a reply",
    yourMessage: "Your message",
    placeholder: "Write your message…",
    send: "Send",
    unavailable: "No reply available.",
    privacyNotice:
      "Do not enter information you would rather not share. In an emergency, contact the emergency services: Civil Protection 14, SAMU 115.",
  },

  conciergePage: {
    eyebrow: "Your concierge",
    title: "A question about your stay?",
    lede:
      "The concierge knows the platform, the destinations and how a stay unfolds. It gives no medical opinion: for that, it points you to a qualified professional.",
    humanTitle: "A person can accompany you",
    humanBody:
      "Some situations deserve a voice rather than an interface. An adviser can pick up the file at any point, without you having to explain everything again.",
    callback: "Call-back requested within 24 working hours",
    hours: "Sunday to Thursday, 9am – 5pm",
    writtenTrace: "A written record kept in your space",
    askCallback: "Request a call back",
    demoNotice: "Demonstration: contact is not yet connected to a real service.",
    engineTitle: "Active engine",
    engineOn:
      "Answers pass through an output filter that blocks diagnosis, prescription and promises of results.",
    engineOff:
      "No API key configured: answers come from the deterministic rules engine, with the same guardrails.",
  },

  passport: {
    eyebrow: "Health Passport",
    title: "Your documents, under your control",
    lede:
      "Sharing is named, time-limited and revocable at any moment. Every action — yours and a practitioner's — is written into the log.",
    demoLabel: "Demonstration documents",
    noticeStart:
      "In this demonstration, state lives in your browser and nothing is transmitted. Going to production requires encryption at rest, access control enforced server-side and a tamper-proof log —",
    noticeLink: "see the trust centre",
  },

  space: {
    eyebrow: "Your space",
    hello: (name: string) => `Hello ${name}`,
    demoLabel: "Demonstration account",
    yourJourney: "Your journey",
    dates: (from: string, to: string) => `From ${from} to ${to}`,
    inProgress: "In progress",
    resume: "Resume planning",
    nextAppointment: "Next appointment",
    documentsCount: (count: number) => `${count} documents`,
    activeShares: (count: number) => `${count} active share${count > 1 ? "s" : ""}`,
    manageDocuments: "Manage my documents",
    estimatedBudget: "Estimated budget",
    estimateNotice: "Indicative estimate, not a professional quotation.",
    conciergeBody: "A question about the arrangements, the documents or how it unfolds?",
    agenda: "Your schedule",
    demoNotice:
      "This space currently runs on a demonstration account: no authentication is wired up and nothing is persisted. The information shown is fictional.",
  },

  newsPage: {
    eyebrow: "The feed",
    title1: "What is happening in Algeria,",
    title2: "on the health and wellbeing side.",
    lede:
      "Festivals, seasonal cures, new addresses, food events. An automated watch proposes; a person checks before publication.",
    submit: "Submit an event",
    empty:
      "Nothing published yet. The watch runs every day and submissions are reviewed before appearing here.",
    howTitle: "How this feed is built",
    howBodyStart:
      "An agent goes through Algerian press feeds, a targeted web search and partner submissions every day. It automatically discards anything without a verifiable source, anything outside health and wellbeing, and duplicates. What remains is",
    howBodyStrong: "proposed",
    howBodyEnd:
      ", never published: a person reads it and decides. No information appears here without being approved, and every item shows its source.",
    place: "Place",
    date: "Date",
    range: (from: string, to: string) => `From ${from} to ${to}`,
    categories: {
      evenement: "Event",
      ouverture: "New address",
      promotion: "Offer",
      festival: "Festival",
      gastronomie: "Food",
      cure: "Cure and thermal spa",
    },
    origins: {
      rss: "Press",
      recherche: "Web search",
      partenaire: "Partner",
    },
  },

  submitNews: {
    eyebrow: "Partners",
    title: "Do you have something to announce?",
    lede:
      "An opening, a festival, a seasonal cure, a food event. You know the details better than any automated watch.",
    weAccept: "What we publish",
    accepted: [
      "Anything with a verifiable link",
      "Anything happening in Algeria",
      "Anything touching health, wellbeing, fitness or food",
      "Anything with an identifiable date or address",
    ],
    weReject: "What we turn down",
    rejected: [
      "Announcements with no source to check",
      "Promises of health outcomes",
      "Prices presented as guaranteed",
      "Purely advertising posts",
    ],
    notice:
      "Every submission is read before publication. We do not charge for appearing here, and an accepted submission is not a recommendation from us.",
  },

  moderation: {
    eyebrow: "Back office",
    title: "Feed moderation",
    lede: "The agent proposes, you decide. Nothing reaches the public feed without a click on this page.",
    noticeStart: "This page is protected by a shared token (",
    noticeEnd:
      "), pending real authentication with role management. Decisions are held in process memory: they will not survive the next deployment until the database is wired up.",
  },

  goalPicker: {
    legend: "Your goals",
    describeLabel: "Or describe your plan in one sentence",
    placeholder:
      "I would like to come to Algeria for about ten days for a check-up, to sort out my teeth and to rest a little.",
    examples: [
      "Coming from France for 10 days: dental work, losing a little weight and resting.",
      "A week in Béjaïa to get back into sport after a long break.",
      "A full health check in Algiers, then a few quiet days.",
    ],
    selectedCount: (count: number) => `${count} goal${count > 1 ? "s" : ""} selected`,
    prompt: "Select a goal or describe your plan",
  },

  directory: {
    eyebrow: "Directory",
    title: "Facilities and professionals",
    lede:
      "A list you browse is not a recommendation. There are no scores here: every listing states what has been verified, and what remains self-declared.",
    demoLabel: "Demonstration catalogue — fictional facilities",
    metaDescription:
      "Directory of facilities and practitioners: specialties, languages spoken, support services and verification status.",
    languages: "Languages",
    practitioners: "Practitioners",
    international: "International",
    yes: "Yes",
    notDeclared: "Not declared",
    specialties: "Specialties",
    services: "Support services",
    accessibility: "Accessibility",
    team: "Practitioners",
    notFound: "Facility not found",
    verifiedOn: "Verified on",
    checks: "Points checked",
    buildAround: "Build a journey around this facility",

    declaredSpecialties: "Declared specialties",
    attachedPractitioners: "Practitioners at this facility",
    declaredExperience: "Declared experience",
    years: "years",
    secondOpinion: "Second opinion",
    secondOpinionYes: "Accepted",
    secondOpinionNo: "Not offered",
    inBrief: "In brief",
    hostLanguages: "Languages spoken",
    internationalPatients: "International patients",
    internationalDeclared: "Declared as handled",
    positioning: "Positioning",
    whatWasVerified: "What has been verified",
    addToJourney: "Add to a journey",
    stayIn: (destination: string) => `A stay in ${destination}`,
    noPricingNotice:
      "No prices, availability or certifications are shown until they have been supplied and dated by the facility.",
  },

  tiers: ["", "Essential positioning", "Comfort positioning", "Premium positioning"],

  facilityKinds: {
    clinique: "Clinic",
    hopital: "Hospital",
    dentaire: "Dental centre",
    reeducation: "Rehabilitation centre",
    thermal: "Thermal spa",
    spa: "Spa and wellbeing",
    forme: "Fitness centre",
    salle: "Gym",
    laboratoire: "Analysis laboratory",
    imagerie: "Imaging centre",
    nutrition: "Nutrition and dietetics",
    hebergement: "Adapted accommodation",
  },

  footer: {
    tagline:
      "Your health. Your stay. Your journey. A platform bringing together care, wellbeing, recovery and hospitality — without ever replacing a health professional.",
    discover: "Discover",
    mySpace: "My space",
    trust: "Trust",
    dashboard: "Dashboard",
    passport: "Health Passport",
    security: "Security and privacy",
    howWeVerify: "How we verify",
    aiLimits: "The limits of AI",
    legal:
      "The information published on this platform is indicative and does not constitute a medical diagnosis. Only a qualified health professional can assess your situation. The catalogue of facilities and practitioners currently shown is a demonstration set, flagged as such.",
    building: "work in progress",
  },
};
