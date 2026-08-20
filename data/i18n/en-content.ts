import type { GoalId } from "@/types/domain";

/**
 * English content overrides.
 *
 * Keyed by the same identifiers as the French source data, so a missing entry
 * degrades to French rather than to an empty page. Adding a language means
 * adding a file like this one — the French data files are never touched.
 *
 * Written, not machine-translated. The register matches the French: plain,
 * measured, never promotional. The caveats are translated with particular
 * care, since they are the sentences that carry legal weight.
 */

/* ------------------------------------------------------------------ */
/* Goals                                                               */
/* ------------------------------------------------------------------ */

export const EN_GOALS: Partial<Record<GoalId, { label: string; short: string }>> = {
  soins: { label: "Get treatment", short: "Consultation, tests, care pathway" },
  dentaire: { label: "Dental", short: "Treatment, prosthetics, smile aesthetics" },
  esthetique: { label: "Aesthetics", short: "Dermatology and aesthetic medicine" },
  forme: { label: "Get back in shape", short: "A gradual, supervised return" },
  detente: { label: "Unwind", short: "Spa, rest, letting go" },
  thermalisme: { label: "Thermal springs", short: "Spa towns and wellbeing courses" },
  nutrition: { label: "Nutrition", short: "Assessment and dietary support" },
  prevention: { label: "Prevention", short: "Full health check" },
  mental: { label: "Mental wellbeing", short: "Sleep, mental load, calm" },
  sport: { label: "Sport & recovery", short: "Performance and return to effort" },
  entrainement: { label: "Keep training", short: "Hold your rhythm during the stay" },
  avis: { label: "Ask for an opinion", short: "Second opinion on an existing file" },
  sejour: { label: "Organise a health stay", short: "Full coordination of the trip" },
};

/* ------------------------------------------------------------------ */
/* Journey universes                                                   */
/* ------------------------------------------------------------------ */

interface UniverseText {
  name: string;
  claim: string;
  description: string;
  suitedFor: string[];
  honestNote: string;
}

export const EN_UNIVERSES: Record<string, UniverseText> = {
  thalasso: {
    name: "Thalassotherapy & sea",
    claim: "Seawater, light, and the rhythm of the coast.",
    description:
      "Heated seawater baths, pools, water treatments and quiet rooms facing the Mediterranean. Algeria's coastline runs more than twelve hundred kilometres, much of it still lightly built.",
    suitedFor: [
      "A few days away, between sea and rest",
      "Recovering after a demanding period",
      "A stay for two or with family, without a heavy programme",
    ],
    honestNote:
      "Thalassotherapy is a setting for relaxation and recovery. It treats no condition, and we will never present it as doing so.",
  },
  thermalisme: {
    name: "Thermal springs & courses",
    claim: "Springs used since antiquity.",
    description:
      "Algeria has many hot springs, some in use since Roman times — the Aquae Flavianae at Khenchela still hold their basins. Baths, traditional hammams and organised rest.",
    suitedFor: [
      "A slow stay built around bathing and rest",
      "The cool season, October to April",
      "Those looking for a rhythm rather than a programme",
    ],
    honestNote:
      "No thermal water is presented here as treatment for an illness: such a claim requires an official medical source, which we do not have.",
  },
  "remise-en-forme": {
    name: "Fitness & training",
    claim: "Start again, or simply lose nothing.",
    description:
      "Two different needs under one roof. Building back gradually, with a starting assessment and supervised progression. Or holding your rhythm if you already train, with gym access and a pool.",
    suitedFor: [
      "Returning after a long break",
      "Keeping up training during a holiday",
      "Going back to exercise after a procedure, once cleared",
    ],
    honestNote:
      "Returning to exercise after a medical procedure is decided with the practitioner treating you, not with a platform. We organise the setting, not the decision.",
  },
  repos: {
    name: "Rest & restoration",
    claim: "Silence is a resource, and a rare one.",
    description:
      "Places where you sleep better because the setting allows it: dry air, cool nights, little light pollution, little noise. The M'Zab valley and the southern palm groves offer conditions hard to find elsewhere.",
    suitedFor: [
      "A mental load that needs to come down",
      "Sleep that needs recovering",
      "A deliberate break from screens",
    ],
    honestNote:
      "Rest helps; it does not cure. If your sleep or your condition worries you, speak to a health professional before travelling.",
  },
  evasion: {
    name: "Wide open spaces",
    claim: "From the Tassili to the ridges of Kabylia.",
    description:
      "Walking, relief and open country. The Sahara covers more than eight tenths of the territory, and the north lines up wooded massifs and national parks that fall into the sea. A stay where the body works without a gym.",
    suitedFor: [
      "Walking several hours a day",
      "An active stay rather than a treatment stay",
      "Discovering landscapes few people travel",
    ],
    honestNote:
      "The Deep South is visited from October to April, with organised guidance. In summer, the heat makes any effort inadvisable.",
  },
  soin: {
    name: "Care & prevention",
    claim: "A check-up, an opinion, a planned procedure.",
    description:
      "The medical side of the stay: a full health check, a specialist consultation, dental work, a second opinion on an existing file. Organised around the rest it requires, never strung together without breathing room.",
    suitedFor: [
      "Taking stock in a few days",
      "A planned procedure, with time to recover on site",
      "A second opinion on a file already put together",
    ],
    honestNote:
      "The platform organises and directs. It makes no diagnosis, prescribes nothing, and never interprets a test or imaging result.",
  },
};

/* ------------------------------------------------------------------ */
/* Heritage sites                                                      */
/* ------------------------------------------------------------------ */

interface HeritageText {
  name: string;
  summary: string;
  highlights: string[];
  bestSeason?: string;
}

export const EN_HERITAGE: Record<string, HeritageText> = {
  "casbah-alger": {
    name: "Casbah of Algiers",
    summary:
      "The Ottoman medina of Algiers, built as an amphitheatre above the bay. A tangle of alleyways, covered passages and courtyard houses — still lived in.",
    highlights: [
      "Ottoman-era palaces and courtyard houses",
      "Stepped alleyways opening onto the bay",
      "Ketchaoua Mosque",
      "Everyday neighbourhood life, with nothing staged",
    ],
  },
  tipasa: {
    name: "Tipasa",
    summary:
      "An ancient site set directly on the Mediterranean, layering Punic, Roman and early Christian remains against the sea.",
    highlights: [
      "Roman basilicas and baths at the water's edge",
      "The ancient theatre",
      "The early Christian necropolis",
      "The Royal Mausoleum of Mauretania, nearby",
    ],
    bestSeason: "April to June, September to October",
  },
  djemila: {
    name: "Djémila",
    summary:
      "Ancient Cuicul, a Roman mountain town at 900 metres, remarkable for adapting to the terrain rather than to the usual grid plan.",
    highlights: [
      "Forum and Arch of Caracalla",
      "Theatre built into the slope",
      "Mosaics in the site museum",
      "Christian quarter and baptistery",
    ],
    bestSeason: "Spring and autumn — summer is very hot",
  },
  timgad: {
    name: "Timgad",
    summary:
      "A military colony founded by Trajan around AD 100, often cited as the most complete surviving example of Roman grid urbanism.",
    highlights: [
      "A grid plan readable at a single glance",
      "Arch of Trajan",
      "The ancient public library",
      "Baths and a 3,500-seat theatre",
    ],
    bestSeason: "Spring and autumn — little shade on site",
  },
  "vallee-mzab": {
    name: "M'Zab Valley",
    summary:
      "Five fortified towns built from the 11th century in a Saharan valley. An ensemble often cited as a model of architecture adapted to the desert.",
    highlights: [
      "The five tiered ksour of the valley",
      "Beni Isguen and its architecture",
      "Palm groves and traditional irrigation",
      "The Ghardaïa market",
    ],
    bestSeason: "October to April",
  },
  "tassili-najjer": {
    name: "Tassili n'Ajjer",
    summary:
      "A sandstone plateau in the central Sahara, known for thousands of rock paintings and engravings and for its forests of stone. Both a cultural and a natural site.",
    highlights: [
      "Rock art spanning several millennia",
      "Sandstone formations carved by erosion",
      "Tassili cypresses, among the oldest trees on earth",
      "Night skies of rare clarity",
    ],
    bestSeason: "November to March — organised expedition required",
  },
  "qalaa-beni-hammad": {
    name: "Qal'a of Beni Hammad",
    summary:
      "First capital of the Hammadids, founded in 1007 and later abandoned. Its ruins, at a thousand metres, hold the tallest minaret in Algeria.",
    highlights: [
      "The great mosque's minaret, 25 metres",
      "Remains of the palace and its basins",
      "A little-visited mountain site",
    ],
    bestSeason: "Spring and autumn",
  },
  "mansourah-tlemcen": {
    name: "Mansourah",
    summary:
      "The remains of a 14th-century siege town, dominated by a forty-metre minaret whose collapsed face leaves the structure open.",
    highlights: [
      "A 40-metre minaret, open along its section",
      "The siege town's walls",
      "Immediately next to Tlemcen",
    ],
  },
  "hippone-annaba": {
    name: "Hippo Regius",
    summary:
      "The ancient city where Augustine lived, now an archaeological site below the basilica that bears his name, overlooking the gulf.",
    highlights: [
      "Forum and Roman villas",
      "Saint Augustine's Basilica above",
      "Site museum",
    ],
  },
  "gorges-ghoufi": {
    name: "Ghoufi Balconies",
    summary:
      "A canyon in the Aurès where cave dwellings cling to the rock face above a deep-set palm grove.",
    highlights: [
      "Dwellings carved into the cliff",
      "Palm grove at the canyon floor",
      "Laid-out viewpoints",
    ],
    bestSeason: "October to April",
  },
  "gouraya-bejaia": {
    name: "Gouraya National Park",
    summary:
      "A wooded massif falling into the Mediterranean, with its coves, its cape and a fort overlooking the bay.",
    highlights: ["Cap Carbon and its lighthouse", "Fort Gouraya, a natural belvedere", "The coves of the Corniche"],
  },
  "santa-cruz-oran": {
    name: "Santa Cruz Fort",
    summary:
      "A 16th-century Spanish fortress perched on Murdjajo mountain, taking in the whole Gulf of Oran.",
    highlights: ["Panorama over the bay and the city", "Santa Cruz chapel", "Reached by road or on foot"],
  },
};

/* ------------------------------------------------------------------ */
/* Destinations — headline text                                        */
/* ------------------------------------------------------------------ */

interface DestinationText {
  tagline: string;
  intro: string;
  bestFor: string[];
  /** Première phrase reprise telle quelle par le planificateur. */
  recovery: string;
  specialties: string[];
  activities: string[];
}

export const EN_DESTINATIONS: Record<string, DestinationText> = {
  alger: {
    tagline: "Health between the Mediterranean and heritage",
    intro:
      "The capital concentrates the widest range of care facilities in the country and remains the simplest point of entry from abroad. You come for a dense schedule, then head down to the bay to recover.",
    bestFor: ["A full check-up in few days", "A stay from abroad", "A second opinion"],
    recovery:
      "Gentle days are recommended between two procedures: the seafront in the morning, rest in the afternoon. The Hamma botanical gardens offer flat, shaded walking suited to a gradual return to activity.",
    specialties: ["Internal medicine", "Cardiology", "Imaging and laboratory", "Dental surgery", "Dermatology", "Ophthalmology"],
    activities: [
      "The Casbah of Algiers, a World Heritage site",
      "Notre-Dame d'Afrique basilica and the view over the bay",
      "The Hamma botanical garden",
      "Tipaza and its Roman remains, a day trip west",
    ],
  },
  oran: {
    tagline: "Open sea and getting back in shape",
    intro:
      "The country's second hub, Oran combines direct international access, an organised seaside life and a gentler pace than the capital. A natural base for stays that mix care and fitness.",
    bestFor: ["Care combined with a fitness programme", "A seaside stay", "Direct arrival from abroad"],
    recovery:
      "Walking along the seafront, swimming in the calm water at Les Andalouses, recovery sessions at the end of the day. The dry late-season climate makes for easier sleep.",
    specialties: ["Orthopaedic surgery", "Dental surgery", "Rehabilitation", "Cardiology", "Ophthalmology"],
    activities: [
      "Santa Cruz fort and the panorama over the gulf",
      "The Létang promenade and the old quarters",
      "The Oran corniche and the beaches of Les Andalouses",
      "A trip to Tlemcen, two hours by road",
    ],
  },
  constantine: {
    tagline: "Mineral calm for recovery",
    intro:
      "Built on a rock carved by the Rhummel gorges, Constantine offers a rare sense of withdrawal. The medical hub of the east, an hour from several thermal towns.",
    bestFor: ["Care then thermal recovery", "A quiet stay", "An eastern Algeria itinerary"],
    recovery:
      "Dry mountain air, cool nights, little tourist pressure. Favourable conditions for sleep and for rest days between two stages of care.",
    specialties: ["Neurology", "General surgery", "Imaging", "Internal medicine", "Rehabilitation"],
    activities: [
      "The suspended bridges above the Rhummel gorges",
      "The Bey's palace and the medina",
      "The war memorial and the views over the valley",
      "Tiddis and the ancient sites of the region",
    ],
  },
  tlemcen: {
    tagline: "Gentle altitude and Andalusian living",
    intro:
      "At eight hundred metres, ringed by plateaus and waterfalls, Tlemcen offers a temperate climate and a rare density of heritage. A destination for convalescence more than for an intensive schedule.",
    bestFor: ["Convalescence", "A cultural wellbeing stay", "A quiet break"],
    recovery:
      "Moderate altitude, dry air and a slow pace. A fitting setting for stays where sleep and a gradual return to walking come first.",
    specialties: ["General and internal medicine", "Dental surgery", "Rehabilitation", "Laboratory"],
    activities: [
      "The great mosque and the Mansourah complex",
      "The Mansourah site and its minaret",
      "The El Ourit waterfalls",
      "The Lalla Setti plateau",
    ],
  },
  bejaia: {
    tagline: "Mountain and sea, to get moving again",
    intro:
      "Where the Gouraya massif falls into the Mediterranean. A destination made for gradual fitness stays, between walking on slopes and recovering by the sea.",
    bestFor: ["Gradual return to fitness", "Sports recovery", "A break in nature"],
    recovery:
      "Sea and hills in alternation: uphill walking in the morning, swimming and rest in the afternoon. Intensity is easy to dose over a week.",
    specialties: ["Trauma care and rehabilitation", "Sports medicine", "General medicine", "Laboratory"],
    activities: [
      "Gouraya national park and Cap Carbon",
      "The beaches and coves of the Corniche",
      "The Soummam valley and its olive groves",
      "The Casbah of Béjaïa",
    ],
  },
  annaba: {
    tagline: "The gentleness of the eastern coast",
    intro:
      "Long sandy beaches, wooded hills and ancient heritage. Annaba suits stays that want to stay light: a short procedure, then several days at the sea's pace.",
    bestFor: ["A short procedure then rest", "A family stay", "A first visit to Algeria"],
    recovery:
      "Long flat beaches, well suited to the walking prescribed after a minor procedure. Sea air and mild temperatures outside high summer.",
    specialties: ["Dental surgery", "Ophthalmology", "Internal medicine", "Imaging"],
    activities: [
      "Saint Augustine basilica and the hill of Hippo",
      "The ancient ruins of Hippo",
      "Seraïdi and the Edough massif",
      "The beaches of Chetaïbi",
    ],
  },
  biskra: {
    tagline: "Gateway to the desert, dry heat and palm groves",
    intro:
      "The first city of the south, known for its palm groves and dry climate. A winter destination: from November to March the mildness is remarkable and the days luminous.",
    bestFor: ["A dry winter stay", "Thermal springs and rest", "A break full of light"],
    recovery:
      "Dry heat, low humidity and constant light in the cool season. Avoid the summer months, when temperatures make any exertion inadvisable.",
    specialties: ["General medicine", "Rheumatology and rehabilitation", "Laboratory"],
    activities: [
      "The Tolga palm groves and oasis villages",
      "The Ghoufi gorges, north in the Aurès",
      "The Ghoufi balconies and their cliff dwellings",
      "Date markets in season",
    ],
  },
  ghardaia: {
    tagline: "The silence of the M'Zab and a slow pace",
    intro:
      "Five fortified towns tiered in a Saharan valley, inscribed on the World Heritage List. The destination of choice when the goal is genuinely to slow down.",
    bestFor: ["A break from screens", "Sleep and mental load", "A contemplative stay"],
    recovery:
      "Very dry air, silent nights, little light pollution. Unusually favourable conditions for deep sleep.",
    specialties: ["General medicine", "Laboratory", "Follow-up and teleconsultation"],
    activities: [
      "The M'Zab valley and its five ksour, a World Heritage site",
      "The traditional market of Ghardaïa",
      "The palm groves of the valley",
      "Beni Isguen and its architecture",
    ],
  },
};
