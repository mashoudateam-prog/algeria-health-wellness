/**
 * Corps éditorial des destinations, en anglais.
 *
 * Séparé de `en-content.ts` : c'est le texte le plus long du site et il évolue
 * indépendamment des accroches. Les toponymes gardent leur graphie locale
 * (Aïn El Turck, Seraïdi, Hammam Debagh) — un visiteur qui cherche le lieu sur
 * une carte doit trouver le même nom.
 *
 * Aucune vertu thérapeutique n'est ajoutée à la traduction : là où le français
 * précise qu'un site thermal relève de la détente et non du soin, l'anglais le
 * dit aussi.
 */

export interface EditorialText {
  offreMedicale: string;
  bienEtre: string;
  hebergement: string;
  accessibilite: string;
  transport: string;
  gastronomie: string;
  patrimoine: string;
}

export const EN_EDITORIAL: Record<string, EditorialText> = {
  alger: {
    offreMedicale:
      "Algiers brings together the widest range of technical facilities and specialties in the country, a density that helps when a journey chains consultation, imaging and laboratory work into a single stay.",
    bienEtre:
      "The seafront, from Sidi Fredj to Aïn Taya, offers places to rest less than an hour from appointments. Hotels around the bay have spa and pool areas suited to recovery days.",
    hebergement:
      "International hotels to the west and near the airport, guest houses and quieter residences on the heights. Staying close to where you are treated cuts the fatigue of the stay considerably.",
    accessibilite:
      "Houari Boumediene international airport, the country's main point of entry, about twenty kilometres from the centre. Passenger port and rail links east and west.",
    transport:
      "Metro, tram and cable cars structure travel around the city. At peak times, allow generous margins between appointments: traffic is the leading cause of delay in an Algiers itinerary.",
    gastronomie:
      "Mediterranean cooking, fish from the bay, fresh produce markets. Easy to reconcile with nutritional support during the stay.",
    patrimoine:
      "A city rising like an amphitheatre above its bay, where the Ottoman medina, nineteenth-century planning and modern architecture sit on top of one another. A setting that makes the days without appointments memorable.",
  },
  oran: {
    offreMedicale:
      "The hospital and university hub of western Algeria, Oran has enough clinics and practices for most planned journeys, without the congestion of the capital.",
    bienEtre:
      "The Oran corniche, from Aïn El Turck to Les Andalouses, lines up beaches, hotels and fitness centres. The mild season from April to June suits outdoor programmes particularly well.",
    hebergement:
      "A dense seaside hotel offering west of the city, urban residences near the centre. Places along the corniche make it easy to chain a morning session, the sea and rest.",
    accessibilite:
      "Ahmed Ben Bella international airport, with regular links to Europe. The city is served by train from Algiers and by the east–west motorway network.",
    transport:
      "Urban tram and taxis. The corniche is best covered by car; allow twenty to forty minutes between the western beaches and the centre.",
    gastronomie:
      "Grilled fish, coastal cooking, Andalusian influences. Portions worth adjusting with nutritional follow-up if the stay aims at weight loss.",
    patrimoine:
      "A port city layered with Spanish, Ottoman and French history, known for its relaxed relationship with the sea and its music scene.",
  },
  constantine: {
    offreMedicale:
      "Constantine is the main hospital and university centre of eastern Algeria, which makes it a reference point for second-opinion requests in that part of the country.",
    bienEtre:
      "The wilaya is close to several thermal sites in the east, including Hammam Debagh in the Guelma wilaya, about an hour and a half by road. Following care with a relaxation cure is straightforward to arrange.",
    hebergement:
      "Urban hotels on the heights and near the new university district. Prefer accommodation up on the plateau: it is markedly quieter than the old centre.",
    accessibilite:
      "Mohamed Boudiaf international airport, with links to Europe and the country's main cities. East–west motorway and rail service.",
    transport:
      "Tram and an urban cable car crossing the gorges. The terrain imposes sharp changes in level: something to weigh after a procedure.",
    gastronomie:
      "Eastern Algerian cooking, slow-cooked dishes, almond and honey pastries. A generous table, worth framing if the stay includes a nutrition strand.",
    patrimoine:
      "The ancient city of Cirta, a Numidian capital that became a city of bridges. The site is spectacular and is best visited slowly — which suits a recovery stay well.",
  },
  tlemcen: {
    offreMedicale:
      "A university town with a hospital centre and a network of practices. Suited to consultations, check-ups and follow-up, less so to the heaviest technical procedures.",
    bienEtre:
      "The wilaya has thermal sites frequented for generations, notably around Hammam Boughrara. The Lalla Setti plateau offers laid-out walking areas above the town.",
    hebergement:
      "Hotels on the Lalla Setti plateau and in the historic centre. Nights are cool for much of the year: pack accordingly.",
    accessibilite:
      "Zenata airport, with domestic links and some international flights. About two hours by road from Oran.",
    transport:
      "A cable car linking the town to the plateau, plus taxis. A town on a human scale, largely walkable in its centre.",
    gastronomie:
      "A marked Andalusian heritage, pastries, festive dishes. Local produce from the plateaus and honey from the region.",
    patrimoine:
      "The former capital of the Zianid kingdom, long a crossroads between the Maghreb and al-Andalus. The town keeps its tradition of craft and classical music.",
  },
  bejaia: {
    offreMedicale:
      "Hospital facilities and practices covering everyday needs and follow-up. For heavier technical work, Algiers is about three hours away by road.",
    bienEtre:
      "The Corniche coastline, from Boulimat to Les Aiguades, alternates coves and forest. Natural ground for supervised outdoor sessions, with no heavy equipment.",
    hebergement:
      "Hotels and rentals along the corniche and in town. The western coast is quieter, the town more practical for appointments.",
    accessibilite:
      "Soummam Abane Ramdane airport, with domestic and seasonal links. Coastal road from Algiers, about three hours.",
    transport:
      "A car is recommended for the corniche: the walking sites are scattered. Taxis in town.",
    gastronomie:
      "Kabyle cooking, olive oil from the Soummam valley, fish. A dietary base that fits naturally with a nutrition programme.",
    patrimoine:
      "The former Hammadid capital and a great medieval port of learning, backing onto a national park — an uncommon combination of town, forest and sea.",
  },
  annaba: {
    offreMedicale:
      "A university hospital centre and private clinics covering most planned needs in the eastern region.",
    bienEtre:
      "The coastal strip from Seraïdi to Chetaïbi offers long, lightly built-up beaches. The Edough forest above brings coolness in summer.",
    hebergement:
      "Seaside hotels north of the city and accommodation up in Seraïdi. Both options are less than thirty minutes from the centre.",
    accessibilite:
      "Rabah Bitat airport, with domestic and international links. Close to the country's eastern border and well served by motorway.",
    transport:
      "Taxis and car. The northern coast calls for a vehicle; the city itself is easily covered on foot.",
    gastronomie:
      "Seafood, eastern cooking, citrus from the plain. Simple tables and harbour fishmongers.",
    patrimoine:
      "Built beside ancient Hippo, the city keeps a calm Mediterranean atmosphere, turned towards its gulf.",
  },
  biskra: {
    offreMedicale:
      "Hospital facilities and practices covering everyday needs and follow-up. Heavier journeys are usually combined with Constantine or Algiers.",
    bienEtre:
      "The region has several hot-water sites frequented for generations, notably around Hammam Salihine. Local tradition associates them with relaxation and rest, without this amounting to medical treatment.",
    hebergement:
      "Urban hotels and palm-grove accommodation around Tolga and the oasis villages. Winter nights are cool, the days mild.",
    accessibilite: "Mohamed Khider airport, with domestic links. Road from Constantine or Batna, about three hours.",
    transport:
      "A car is essential to reach the oases and the gorges. Distances run to tens of kilometres.",
    gastronomie:
      "Deglet Nour dates from the region's palm groves, southern cooking, wheat dishes. Simple produce, easy to fit into an eating plan.",
    patrimoine:
      "An oasis town long described as the gateway to the desert, ringed by one of the country's largest palm groves.",
  },
  ghardaia: {
    offreMedicale:
      "Local provision for consultations and follow-up. Technical procedures are planned in the major northern hubs.",
    bienEtre:
      "No mass tourism, little noise, and an urban layout built around restraint. The setting itself acts as the relaxation programme.",
    hebergement:
      "Traditional guest houses and valley hotels. The thick architecture keeps rooms cool through the day.",
    accessibilite: "Noumérat airport, with domestic links. Road from Algiers, about six hours.",
    transport:
      "Short journeys between the towns of the valley. Respect for local custom, photography in particular, is expected.",
    gastronomie:
      "Simple Saharan cooking, dates, local bread. A regular meal rhythm, favourable to dietary rebalancing.",
    patrimoine:
      "The urban ensemble of the M'Zab, often cited as a model of architecture adapted to the desert, built from the eleventh century onwards.",
  },
};
