import type { Destination } from "@/types/domain";

/**
 * Health Destinations — pages éditoriales.
 *
 * Le contenu décrit des villes réelles et s'en tient à des caractéristiques
 * largement établies (géographie, patrimoine, climat, accessibilité). Aucune
 * statistique sanitaire, aucun classement et aucun établissement nommé ici :
 * les structures vivent dans `data/facilities.ts` et sont marquées DÉMO.
 *
 * `photo.url` vide = plaque éditoriale générée. Déposez `public/photos/<slug>.jpg`
 * pour basculer sur une photographie réelle (voir README, section Direction artistique).
 */
export const DESTINATIONS: Destination[] = [
  {
    slug: "alger",
    name: "Alger",
    wilayaCode: "16",
    region: "littoral",
    tagline: "Santé entre Méditerranée et patrimoine",
    intro:
      "La capitale concentre la plus grande diversité de structures de soins du pays et reste la porte d'entrée la plus simple depuis l'étranger. On y vient pour un parcours dense, puis on redescend vers la baie pour récupérer.",
    lon: 3.06,
    lat: 36.75,
    strengths: ["soins", "prevention", "dentaire", "esthetique", "avis", "sejour"],
    bestFor: ["Bilan complet en peu de jours", "Séjour depuis l'étranger", "Second avis"],
    editorial: {
      offreMedicale:
        "Alger réunit l'éventail le plus large de plateaux techniques et de spécialités du pays, avec une densité utile lorsque le parcours enchaîne consultation, imagerie et laboratoire sur un même séjour.",
      specialites: [
        "Médecine interne",
        "Cardiologie",
        "Imagerie et biologie",
        "Chirurgie dentaire",
        "Dermatologie",
        "Ophtalmologie",
      ],
      bienEtre:
        "La façade maritime, de Sidi Fredj à Aïn Taya, offre des lieux de repos à moins d'une heure des rendez-vous. Les hôtels de la baie proposent des espaces spa et piscine adaptés à des journées de récupération.",
      hebergement:
        "Hôtellerie internationale à l'ouest et près de l'aéroport, maisons d'hôtes et résidences plus calmes sur les hauteurs. Choisir la proximité du lieu de soin réduit fortement la fatigue du séjour.",
      accessibilite:
        "Aéroport international Houari Boumediene, principal point d'entrée du pays, à environ vingt kilomètres du centre. Port de voyageurs et liaisons ferroviaires vers l'est et l'ouest.",
      transport:
        "Métro, tramway et téléphériques structurent les déplacements. Aux heures de pointe, prévoir large entre deux rendez-vous : la circulation est le premier facteur de retard d'un parcours algérois.",
      gastronomie:
        "Cuisine méditerranéenne, poisson de la baie, marchés de produits frais. Facile à concilier avec un accompagnement nutritionnel pendant le séjour.",
      recuperation:
        "Journées douces recommandées entre deux actes : bord de mer le matin, repos l'après-midi. Les jardins d'essai du Hamma offrent une marche plate et ombragée, adaptée à une reprise progressive.",
      activites: [
        "Casbah d'Alger, inscrite au patrimoine mondial",
        "Basilique Notre-Dame d'Afrique et vue sur la baie",
        "Jardin d'essai du Hamma",
        "Tipaza et ses vestiges romains, en excursion à l'ouest",
      ],
      patrimoine:
        "Ville en amphithéâtre sur sa baie, où se superposent la médina ottomane, l'urbanisme du XIXᵉ siècle et l'architecture moderne. Un cadre qui rend les journées sans rendez-vous mémorables.",
    },
    photo: { url: "", alt: "Alger, la baie et la ville en amphithéâtre", credit: "Placeholder éditorial", source: "demo" },
  },
  {
    slug: "oran",
    name: "Oran",
    wilayaCode: "31",
    region: "littoral",
    tagline: "Le grand large et la remise en forme",
    intro:
      "Deuxième pôle du pays, Oran combine un accès international direct, une vie balnéaire structurée et un rythme plus fluide que la capitale. Une base naturelle pour les parcours qui mêlent soin et remise en forme.",
    lon: -0.64,
    lat: 35.7,
    strengths: ["soins", "forme", "dentaire", "detente", "sport", "sejour"],
    bestFor: ["Soin combiné à un programme forme", "Séjour balnéaire", "Arrivée directe de l'étranger"],
    editorial: {
      offreMedicale:
        "Pôle hospitalier et universitaire de l'Ouest algérien, Oran dispose d'un tissu de cliniques et de cabinets suffisant pour la plupart des parcours programmés, sans la congestion algéroise.",
      specialites: ["Chirurgie orthopédique", "Chirurgie dentaire", "Rééducation", "Cardiologie", "Ophtalmologie"],
      bienEtre:
        "La corniche oranaise, d'Aïn El Turck aux Andalouses, aligne plages, hôtels et centres de remise en forme. La saison douce d'avril à juin se prête particulièrement aux programmes en extérieur.",
      hebergement:
        "Offre hôtelière balnéaire dense à l'ouest de la ville, résidences urbaines près du centre. Les établissements de la corniche facilitent l'enchaînement séance du matin, mer et repos.",
      accessibilite:
        "Aéroport international Ahmed Ben Bella, liaisons régulières avec l'Europe. Ville desservie par le train depuis Alger et par le réseau autoroutier est-ouest.",
      transport:
        "Tramway urbain et taxis. La corniche se parcourt en voiture ; compter vingt à quarante minutes entre les plages de l'ouest et le centre.",
      gastronomie:
        "Poisson grillé, cuisine de la côte, influences andalouses. Portions à ajuster avec un suivi nutritionnel si le séjour vise une perte de poids.",
      recuperation:
        "Marche sur le front de mer, natation en eau calme aux Andalouses, séances de récupération en fin de journée. Le climat sec de l'arrière-saison facilite le sommeil.",
      activites: [
        "Fort de Santa Cruz et panorama sur le golfe",
        "Promenade de Létang et vieux quartiers",
        "Corniche oranaise et plages des Andalouses",
        "Excursion vers Tlemcen, à deux heures de route",
      ],
      patrimoine:
        "Ville portuaire aux strates espagnoles, ottomanes et françaises, connue pour son rapport décontracté à la mer et sa scène musicale.",
    },
    photo: { url: "", alt: "Oran, la baie et le fort de Santa Cruz", credit: "Placeholder éditorial", source: "demo" },
  },
  {
    slug: "constantine",
    name: "Constantine",
    wilayaCode: "25",
    region: "hauts-plateaux",
    tagline: "Le calme minéral pour récupérer",
    intro:
      "Bâtie sur un rocher creusé par les gorges du Rhummel, Constantine offre une atmosphère de retrait rare. Le pôle médical de l'Est du pays, à une heure de plusieurs stations thermales.",
    lon: 6.61,
    lat: 36.36,
    strengths: ["soins", "thermalisme", "prevention", "mental", "avis"],
    bestFor: ["Soin puis récupération thermale", "Séjour calme", "Parcours de l'Est algérien"],
    editorial: {
      offreMedicale:
        "Constantine est le principal centre hospitalier et universitaire de l'Est algérien, ce qui en fait un point de référence pour les demandes de second avis dans cette partie du pays.",
      specialites: ["Neurologie", "Chirurgie générale", "Imagerie", "Médecine interne", "Rééducation"],
      bienEtre:
        "La wilaya est proche de plusieurs sites thermaux de l'Est, dont Hammam Debagh dans la wilaya de Guelma, à environ une heure trente de route. Un enchaînement soin puis cure de détente y est simple à organiser.",
      hebergement:
        "Hôtellerie urbaine sur les hauteurs et près du nouveau pôle universitaire. Privilégier un hébergement en surplomb : le calme y est nettement meilleur qu'en centre ancien.",
      accessibilite:
        "Aéroport international Mohamed Boudiaf, liaisons vers l'Europe et les grandes villes du pays. Autoroute est-ouest et desserte ferroviaire.",
      transport:
        "Tramway et téléphérique urbain qui franchit les gorges. Le relief impose des dénivelés marqués : à prendre en compte après une intervention.",
      gastronomie:
        "Cuisine de l'Est algérien, plats mijotés, pâtisseries d'amande et de miel. Table généreuse, à cadrer si le séjour comporte un volet nutrition.",
      recuperation:
        "Air sec d'altitude, nuits fraîches, faible pression touristique. Conditions favorables au sommeil et aux journées de repos entre deux étapes de soin.",
      activites: [
        "Ponts suspendus au-dessus des gorges du Rhummel",
        "Palais du Bey et médina",
        "Monument aux Morts et vues sur la vallée",
        "Tiddis et sites antiques de la région",
      ],
      patrimoine:
        "Cité antique de Cirta, capitale numide devenue ville de ponts. Le site, spectaculaire, se visite lentement — ce qui convient bien à un séjour de récupération.",
    },
    photo: { url: "", alt: "Constantine et ses ponts au-dessus des gorges", credit: "Placeholder éditorial", source: "demo" },
  },
  {
    slug: "tlemcen",
    name: "Tlemcen",
    wilayaCode: "13",
    region: "hauts-plateaux",
    tagline: "Altitude douce et art de vivre andalou",
    intro:
      "À huit cents mètres d'altitude, entourée de plateaux et de cascades, Tlemcen offre un climat tempéré et une densité patrimoniale rare. Une destination de convalescence plus que de parcours intensif.",
    lon: -1.32,
    lat: 34.88,
    strengths: ["detente", "thermalisme", "mental", "nutrition", "prevention"],
    bestFor: ["Convalescence", "Séjour bien-être culturel", "Coupure calme"],
    editorial: {
      offreMedicale:
        "Ville universitaire dotée d'un centre hospitalier et d'un tissu de cabinets. Adaptée aux consultations, aux bilans et au suivi, moins aux plateaux techniques les plus lourds.",
      specialites: ["Médecine générale et interne", "Chirurgie dentaire", "Rééducation", "Biologie"],
      bienEtre:
        "La wilaya compte des sites thermaux fréquentés de longue date, notamment autour de Hammam Boughrara. Le plateau de Lalla Setti offre des espaces de marche aménagés au-dessus de la ville.",
      hebergement:
        "Hôtellerie sur le plateau de Lalla Setti et dans le centre historique. Les nuits sont fraîches une bonne partie de l'année : prévoir en conséquence.",
      accessibilite:
        "Aéroport de Zenata, liaisons nationales et quelques vols internationaux. Environ deux heures de route depuis Oran.",
      transport:
        "Téléphérique reliant la ville au plateau, taxis. Ville à taille humaine, largement praticable à pied dans son centre.",
      gastronomie:
        "Héritage andalou marqué, pâtisseries, plats de fête. Produits de terroir des plateaux et miel de la région.",
      recuperation:
        "Altitude modérée, air sec et rythme lent. Cadre indiqué pour les séjours où la priorité est le sommeil et la reprise progressive de la marche.",
      activites: [
        "Grande mosquée et ensemble de Mansourah",
        "Site de Mansourah et minaret",
        "Cascades d'El Ourit",
        "Plateau de Lalla Setti",
      ],
      patrimoine:
        "Ancienne capitale du royaume zianide, longtemps carrefour entre le Maghreb et al-Andalus. La ville conserve une tradition d'artisanat et de musique savante.",
    },
    photo: { url: "", alt: "Tlemcen, patrimoine andalou et plateaux", credit: "Placeholder éditorial", source: "demo" },
  },
  {
    slug: "bejaia",
    name: "Béjaïa",
    wilayaCode: "06",
    region: "littoral",
    tagline: "Montagne et mer pour reprendre le mouvement",
    intro:
      "Là où le massif de Gouraya tombe dans la Méditerranée. Une destination faite pour les parcours de remise en forme progressive, entre marche en relief et récupération en bord de mer.",
    lon: 5.08,
    lat: 36.75,
    strengths: ["forme", "sport", "detente", "mental", "nutrition"],
    bestFor: ["Remise en forme progressive", "Récupération sportive", "Coupure nature"],
    editorial: {
      offreMedicale:
        "Structures hospitalières et cabinets couvrant les besoins courants et le suivi. Pour un plateau technique lourd, Alger reste à environ trois heures de route.",
      specialites: ["Traumatologie et rééducation", "Médecine du sport", "Médecine générale", "Biologie"],
      bienEtre:
        "Le littoral de la Corniche, de Boulimat aux Aiguades, alterne criques et forêts. Terrain naturel pour des séances en extérieur encadrées, sans matériel lourd.",
      hebergement:
        "Hôtels et locations le long de la corniche et en ville. La côte ouest est plus calme, la ville plus pratique pour les rendez-vous.",
      accessibilite:
        "Aéroport de Soummam Abane Ramdane, liaisons nationales et saisonnières. Route côtière depuis Alger, environ trois heures.",
      transport:
        "Voiture recommandée pour la corniche : les sites de marche sont dispersés. Taxis en ville.",
      gastronomie:
        "Cuisine kabyle, huile d'olive de la vallée de la Soummam, poisson. Base alimentaire naturellement compatible avec un programme nutritionnel.",
      recuperation:
        "Alternance mer et relief : marche en dénivelé le matin, nage et repos l'après-midi. Progression d'intensité facile à doser sur une semaine.",
      activites: [
        "Parc national de Gouraya et cap Carbon",
        "Plages et criques de la Corniche",
        "Vallée de la Soummam et oliveraies",
        "Casbah de Béjaïa",
      ],
      patrimoine:
        "Ancienne capitale hammadide et grand port médiéval de savoir, adossée à un parc national — une combinaison peu commune entre ville, forêt et mer.",
    },
    photo: { url: "", alt: "Béjaïa, le cap Carbon et la Méditerranée", credit: "Placeholder éditorial", source: "demo" },
  },
  {
    slug: "annaba",
    name: "Annaba",
    wilayaCode: "23",
    region: "littoral",
    tagline: "Douceur du littoral est",
    intro:
      "Plages de sable long, collines boisées et patrimoine antique. Annaba convient aux séjours qui veulent rester légers : un acte médical court, puis plusieurs jours au rythme de la mer.",
    lon: 7.75,
    lat: 36.9,
    strengths: ["detente", "prevention", "dentaire", "sejour", "mental"],
    bestFor: ["Acte court puis repos", "Séjour familial", "Première venue en Algérie"],
    editorial: {
      offreMedicale:
        "Centre hospitalier universitaire et cliniques privées couvrant la majorité des besoins programmés de la région Est.",
      specialites: ["Chirurgie dentaire", "Ophtalmologie", "Médecine interne", "Imagerie"],
      bienEtre:
        "Le cordon littoral de Seraïdi à Chetaïbi offre des plages étendues et peu construites. La forêt de l'Edough, en surplomb, apporte de la fraîcheur en été.",
      hebergement:
        "Hôtellerie balnéaire au nord de la ville et hébergements de hauteur à Seraïdi. Les deux options sont à moins de trente minutes du centre.",
      accessibilite:
        "Aéroport Rabah Bitat, liaisons nationales et internationales. Proche de la frontière est du pays et bien reliée par l'autoroute.",
      transport:
        "Taxis et voiture. Le littoral nord demande un véhicule ; la ville se parcourt facilement à pied.",
      gastronomie:
        "Produits de la mer, cuisine de l'Est, agrumes de la plaine. Tables simples et poissonneries de port.",
      recuperation:
        "Plages plates et longues, idéales pour la marche prescrite après une intervention légère. Air marin et températures clémentes hors plein été.",
      activites: [
        "Basilique Saint-Augustin et colline d'Hippone",
        "Ruines antiques d'Hippone",
        "Seraïdi et le massif de l'Edough",
        "Plages de Chetaïbi",
      ],
      patrimoine:
        "Bâtie près de l'antique Hippone, la ville conserve une atmosphère méditerranéenne apaisée, tournée vers son golfe.",
    },
    photo: { url: "", alt: "Annaba, le golfe et la colline d'Hippone", credit: "Placeholder éditorial", source: "demo" },
  },
  {
    slug: "biskra",
    name: "Biskra",
    wilayaCode: "07",
    region: "sud",
    tagline: "Porte du désert, chaleur sèche et palmeraies",
    intro:
      "La première ville du Sud, réputée pour ses palmeraies et son climat sec. Une destination d'hiver : de novembre à mars, la douceur y est remarquable et les journées lumineuses.",
    lon: 5.73,
    lat: 34.85,
    strengths: ["thermalisme", "detente", "mental", "forme", "nutrition"],
    bestFor: ["Séjour d'hiver au sec", "Thermalisme et repos", "Coupure lumineuse"],
    editorial: {
      offreMedicale:
        "Structures hospitalières et cabinets répondant aux besoins courants et au suivi. Les parcours lourds se combinent généralement avec Constantine ou Alger.",
      specialites: ["Médecine générale", "Rhumatologie et rééducation", "Biologie"],
      bienEtre:
        "La région compte plusieurs sites d'eaux chaudes fréquentés depuis longtemps, notamment autour de Hammam Salihine. La tradition locale y associe détente et repos, sans que cela constitue un traitement médical.",
      hebergement:
        "Hôtellerie urbaine et hébergements en palmeraie autour de Tolga et des villages d'oasis. Les nuits d'hiver sont fraîches, les journées douces.",
      accessibilite:
        "Aéroport Mohamed Khider, liaisons nationales. Route depuis Constantine ou Batna, environ trois heures.",
      transport:
        "Voiture indispensable pour rejoindre les oasis et les gorges. Les distances se comptent en dizaines de kilomètres.",
      gastronomie:
        "Dattes Deglet Nour des palmeraies de la région, cuisine du Sud, plats de blé. Produits simples et faciles à intégrer à un programme alimentaire.",
      recuperation:
        "Chaleur sèche, faible humidité et lumière constante en saison fraîche. Éviter la période estivale, où les températures rendent tout effort déconseillé.",
      activites: [
        "Palmeraies de Tolga et villages d'oasis",
        "Gorges de Ghoufi, au nord dans les Aurès",
        "Balcons de Ghoufi et habitat troglodytique",
        "Marchés de dattes en saison",
      ],
      patrimoine:
        "Ville-oasis longtemps décrite comme la porte du désert, entourée d'une des plus vastes palmeraies du pays.",
    },
    photo: { url: "", alt: "Biskra, palmeraies et lumière du Sud", credit: "Placeholder éditorial", source: "demo" },
  },
  {
    slug: "ghardaia",
    name: "Ghardaïa",
    wilayaCode: "47",
    region: "sud",
    tagline: "Silence du M'Zab et rythme lent",
    intro:
      "Cinq cités fortifiées étagées dans une vallée du Sahara, inscrites au patrimoine mondial. La destination la plus indiquée quand l'objectif est de ralentir vraiment.",
    lon: 3.67,
    lat: 32.49,
    strengths: ["mental", "detente", "nutrition", "sejour"],
    bestFor: ["Coupure numérique", "Sommeil et charge mentale", "Séjour contemplatif"],
    editorial: {
      offreMedicale:
        "Offre de proximité pour les consultations et le suivi. Les actes techniques se planifient dans les grands pôles du Nord.",
      specialites: ["Médecine générale", "Biologie", "Suivi et téléconsultation"],
      bienEtre:
        "Pas de tourisme de masse, peu de bruit, une organisation urbaine pensée pour la sobriété. Le cadre lui-même fait office de programme de détente.",
      hebergement:
        "Maisons d'hôtes traditionnelles et hôtels de vallée. L'architecture épaisse maintient la fraîcheur des chambres en journée.",
      accessibilite:
        "Aéroport de Noumérat, liaisons nationales. Route depuis Alger, environ six heures.",
      transport:
        "Déplacements courts entre les cités de la vallée. Le respect des usages locaux, notamment pour la photographie, est attendu.",
      gastronomie:
        "Cuisine saharienne simple, dattes, pain de terroir. Rythme de repas régulier, propice à un rééquilibrage alimentaire.",
      recuperation:
        "Air très sec, silence nocturne, faible pollution lumineuse. Conditions inhabituellement favorables au sommeil profond.",
      activites: [
        "Vallée du M'Zab et ses cinq ksour, patrimoine mondial",
        "Marché traditionnel de Ghardaïa",
        "Palmeraies de la vallée",
        "Beni Isguen et son architecture",
      ],
      patrimoine:
        "Ensemble urbain du M'Zab, souvent cité comme un modèle d'architecture adaptée au désert, construit à partir du XIᵉ siècle.",
    },
    photo: { url: "", alt: "Ghardaïa, les cités étagées de la vallée du M'Zab", credit: "Placeholder éditorial", source: "demo" },
  },
];

export const DESTINATION_BY_SLUG = new Map(DESTINATIONS.map((d) => [d.slug, d]));

export function getDestination(slug: string): Destination | undefined {
  return DESTINATION_BY_SLUG.get(slug);
}
