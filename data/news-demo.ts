import type { NewsItem } from "@/types/news";

/**
 * ⚠️ FIL DE DÉMONSTRATION
 *
 * Ces éléments sont fictifs et portent `demo: true` : l'interface les signale
 * par un badge DÉMO et n'affiche aucun lien de source, puisqu'il n'y en a pas.
 * Ils existent pour que le fil et la file de modération soient démontrables
 * avant la première collecte réelle.
 *
 * Ils disparaissent d'eux-mêmes dès que de vrais éléments sont validés :
 * supprimez simplement ce tableau, ou laissez-le, la collecte ne s'en occupe pas.
 */
export const DEMO_NEWS: NewsItem[] = [
  {
    id: "demo-cure-hammam",
    title: "Ouverture de la saison thermale dans les stations de l'Est",
    summary:
      "Les établissements thermaux de la région rouvrent pour la saison fraîche, période traditionnellement la plus fréquentée pour les cures de détente et de récupération.",
    category: "cure",
    wilayaCode: "24",
    locationLabel: "Guelma",
    startsOn: "2026-10-01",
    endsOn: null,
    sourceUrl: "",
    sourceName: "Élément de démonstration",
    origin: "partenaire",
    collectedAt: "2026-08-18T09:00:00.000Z",
    status: "publie",
    relevance: 88,
    notes: ["Élément fictif de démonstration"],
    demo: true,
  },
  {
    id: "demo-festival-datte",
    title: "Fête de la datte Deglet Nour dans les palmeraies du Sud",
    summary:
      "Marchés de producteurs, ateliers de cuisine traditionnelle et visites de palmeraies pendant trois jours, à la période de la récolte.",
    category: "gastronomie",
    wilayaCode: "07",
    locationLabel: "Biskra",
    startsOn: "2026-11-06",
    endsOn: "2026-11-08",
    sourceUrl: "",
    sourceName: "Élément de démonstration",
    origin: "partenaire",
    collectedAt: "2026-08-17T14:30:00.000Z",
    status: "publie",
    relevance: 76,
    notes: ["Élément fictif de démonstration"],
    demo: true,
  },
  {
    id: "demo-ouverture-spa",
    title: "Un nouveau centre de remise en forme ouvre sur la corniche",
    summary:
      "Bassin, salle encadrée et espace de récupération, avec des créneaux réservés aux séjours de remise en forme progressive.",
    category: "ouverture",
    wilayaCode: "06",
    locationLabel: "Béjaïa",
    startsOn: null,
    endsOn: null,
    sourceUrl: "",
    sourceName: "Élément de démonstration",
    origin: "partenaire",
    collectedAt: "2026-08-16T08:15:00.000Z",
    status: "publie",
    relevance: 71,
    notes: ["Élément fictif de démonstration"],
    demo: true,
  },
  {
    id: "demo-salon-bien-etre",
    title: "Salon du bien-être et de la santé préventive",
    summary:
      "Trois jours de rencontres entre professionnels de santé, praticiens du bien-être et public, avec des ateliers de prévention.",
    category: "evenement",
    wilayaCode: "16",
    locationLabel: "Alger",
    startsOn: "2026-09-24",
    endsOn: "2026-09-26",
    sourceUrl: "",
    sourceName: "Élément de démonstration",
    origin: "partenaire",
    collectedAt: "2026-08-15T11:00:00.000Z",
    status: "propose",
    relevance: 64,
    notes: ["Élément fictif de démonstration", "En attente de validation"],
    demo: true,
  },
];
