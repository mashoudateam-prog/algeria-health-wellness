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
