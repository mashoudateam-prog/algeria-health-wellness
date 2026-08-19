import type { GoalId } from "@/types/domain";

/**
 * Univers de séjour — les grandes portes d'entrée thématiques.
 *
 * Un objectif répond à « que voulez-vous améliorer ? ». Un univers répond à
 * « quel genre de séjour voulez-vous vivre ? ». Les deux se rejoignent dans le
 * même parcours, mais on n'y entre pas par le même chemin.
 *
 * Vocabulaire : aucun univers ne promet un effet de santé. On décrit un cadre,
 * un rythme et des lieux — jamais un résultat.
 */

export interface Universe {
  slug: string;
  name: string;
  claim: string;
  /** Ce que c'est, sans jargon ni promesse. */
  description: string;
  /** À qui cela s'adresse vraiment. */
  suitedFor: string[];
  /** Ce que la plateforme ne prétend pas. La franchise fait partie de l'offre. */
  honestNote: string;
  goals: GoalId[];
  destinations: string[];
  /** Slug de photo utilisé pour l'illustration. */
  photoSlug: string;
  accent: string;
}

export const UNIVERSES: Universe[] = [
  {
    slug: "thalasso",
    name: "Thalassothérapie & mer",
    claim: "L'eau de mer, la lumière et le rythme du littoral.",
    description:
      "Bains d'eau de mer chauffée, bassins, soins par l'eau et espaces de repos face à la Méditerranée. Le littoral algérien compte plus de mille deux cents kilomètres de côte, dont une grande partie reste peu construite.",
    suitedFor: [
      "Une coupure de quelques jours entre mer et repos",
      "Une récupération après une période chargée",
      "Un séjour à deux ou en famille, sans programme lourd",
    ],
    honestNote:
      "La thalassothérapie est un cadre de détente et de récupération. Elle ne traite aucune pathologie, et nous ne la présenterons jamais comme telle.",
    goals: ["detente", "mental", "sport"],
    destinations: ["oran", "bejaia", "annaba"],
    photoSlug: "bejaia",
    accent: "#2f5f73",
  },
  {
    slug: "thermalisme",
    name: "Thermalisme & cures",
    claim: "Des sources fréquentées depuis l'Antiquité.",
    description:
      "L'Algérie compte de nombreuses sources chaudes, dont certaines exploitées depuis l'époque romaine — les Aquae Flavianae de Khenchela en portent encore les bassins. Bains, hammams traditionnels et temps de repos organisé.",
    suitedFor: [
      "Un séjour lent, centré sur le bain et le repos",
      "La saison fraîche, d'octobre à avril",
      "Ceux qui cherchent un rythme, pas un programme",
    ],
    honestNote:
      "Aucune eau thermale n'est présentée ici comme le traitement d'une maladie : une telle affirmation exige une source médicale officielle, que nous n'avons pas.",
    goals: ["thermalisme", "detente", "mental"],
    destinations: ["constantine", "tlemcen", "biskra"],
    photoSlug: "constantine",
    accent: "#9a6845",
  },
  {
    slug: "remise-en-forme",
    name: "Remise en forme & entraînement",
    claim: "Reprendre, ou simplement ne rien perdre.",
    description:
      "Deux besoins différents sous un même toit. Reprendre progressivement, avec une évaluation de départ et une montée de charge encadrée. Ou garder son rythme quand on s'entraîne déjà, avec un accès en salle et un bassin.",
    suitedFor: [
      "Une reprise après une longue pause",
      "Continuer à s'entraîner pendant des vacances",
      "Le retour à l'effort après une intervention, une fois validé",
    ],
    honestNote:
      "Une reprise après un acte médical se décide avec le praticien qui vous suit, pas avec une plateforme. Nous organisons le cadre, pas la décision.",
    goals: ["forme", "entrainement", "sport", "nutrition"],
    destinations: ["oran", "bejaia", "alger"],
    photoSlug: "oran",
    accent: "#17382f",
  },
  {
    slug: "repos",
    name: "Repos & ressourcement",
    claim: "Le silence est une ressource, et elle est rare.",
    description:
      "Des lieux où l'on dort mieux parce que l'endroit s'y prête : air sec, nuits fraîches, faible pollution lumineuse, peu de bruit. La vallée du M'Zab et les palmeraies du Sud offrent des conditions difficiles à trouver ailleurs.",
    suitedFor: [
      "Une charge mentale à faire redescendre",
      "Un sommeil à retrouver",
      "Une coupure numérique volontaire",
    ],
    honestNote:
      "Le repos aide, il ne soigne pas. Si votre sommeil ou votre état vous inquiète, parlez-en à un professionnel de santé avant de partir.",
    goals: ["mental", "detente", "nutrition"],
    destinations: ["ghardaia", "biskra", "tlemcen"],
    photoSlug: "ghardaia",
    accent: "#7d927b",
  },
  {
    slug: "evasion",
    name: "Évasion & grand air",
    claim: "Du Tassili aux crêtes de Kabylie.",
    description:
      "Marche, relief et grands espaces. Le Sahara couvre plus de huit dixièmes du territoire, et le nord aligne massifs boisés et parcs nationaux qui tombent dans la mer. Un séjour où le corps travaille sans salle.",
    suitedFor: [
      "Marcher plusieurs heures par jour",
      "Un séjour actif plutôt qu'un séjour de soin",
      "Découvrir des paysages peu parcourus",
    ],
    honestNote:
      "Le Grand Sud se visite d'octobre à avril, avec un accompagnement organisé. En été, la chaleur rend tout effort déconseillé.",
    goals: ["sport", "forme", "mental"],
    destinations: ["bejaia", "constantine", "biskra"],
    photoSlug: "sahara",
    accent: "#c08a63",
  },
  {
    slug: "soin",
    name: "Soins & prévention",
    claim: "Un bilan, un avis, un acte programmé.",
    description:
      "Le volet médical du séjour : bilan de santé complet, consultation spécialisée, soins dentaires, second avis sur un dossier existant. Organisé autour du repos nécessaire, jamais enchaîné sans respiration.",
    suitedFor: [
      "Faire le point en peu de jours",
      "Un acte programmé, avec le temps de récupérer sur place",
      "Un second avis sur un dossier déjà constitué",
    ],
    honestNote:
      "La plateforme organise et oriente. Elle ne pose aucun diagnostic, ne prescrit rien, et n'interprète jamais un résultat d'analyse ou d'imagerie.",
    goals: ["prevention", "soins", "dentaire", "avis"],
    destinations: ["alger", "oran", "constantine"],
    photoSlug: "alger",
    accent: "#2f5f73",
  },
];

export const UNIVERSE_BY_SLUG = new Map(UNIVERSES.map((universe) => [universe.slug, universe]));
