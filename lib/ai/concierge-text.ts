import type { Locale } from "@/lib/i18n/config";

/**
 * Réponses du concierge, par langue.
 *
 * Le moteur reste dans `concierge.ts` : ici, uniquement du texte. La séparation
 * évite le piège habituel — un jeu de règles dupliqué par langue qui diverge au
 * premier correctif. Un motif ajouté vaut pour toutes les langues ; seule la
 * réponse change.
 *
 * Les réponses traduites disent exactement ce que dit le français, y compris
 * les refus : « la plateforme ne délivre aucun conseil juridique ni migratoire »
 * n'a pas de version adoucie.
 */

export type RuleId =
  | "salutation"
  | "fonctionnement"
  | "partage"
  | "documents"
  | "budget"
  | "secondAvis"
  | "etranger"
  | "langues"
  | "humain"
  | "thermalisme";

export interface RuleText {
  answer: string;
  suggestions?: string[];
}

export interface ConciergeText {
  rules: Record<RuleId, RuleText>;
  /** Réponse de repli, construite à partir de ce que le classifieur a compris. */
  fallback: {
    understood: (summary: string) => string;
    canBuild: (days: number, goals: string) => string;
    toRefine: (question: string) => string;
    suggestions: string[];
  };
  urgencySuggestions: string[];
  /** Message d'ouverture du fil de discussion. */
  opening: RuleText;
}

const FR: ConciergeText = {
  rules: {
    salutation: {
      answer:
        "Bonjour. Je peux vous aider à préparer un séjour de santé, de bien-être ou de remise en forme en Algérie. Dites-moi ce que vous souhaitez améliorer et combien de temps vous comptez rester, et je construirai une première proposition de parcours.",
      suggestions: [
        "Je veux venir une semaine pour prendre soin de moi",
        "Comment ça fonctionne ?",
        "Quels documents dois-je préparer ?",
      ],
    },
    fonctionnement: {
      answer:
        "Vous décrivez votre projet en une phrase. La plateforme en déduit vos objectifs, une destination, un enchaînement de journées, des établissements pertinents et une estimation de budget. Vous ajustez ce que vous voulez, puis vous demandez une estimation détaillée aux établissements retenus. Un conseiller humain peut reprendre la main à n'importe quelle étape.",
      suggestions: ["Construire mon parcours", "Quels sont les frais ?"],
    },
    partage: {
      answer:
        "Vos documents restent dans votre espace. Un partage est toujours nominatif, limité dans le temps et révocable en un geste. Chaque consultation est inscrite dans un journal que vous seul consultez, dans la rubrique Sécurité et confiance. Rien n'est transmis à un établissement sans une action explicite de votre part.",
      suggestions: ["Voir le centre de confiance", "Révoquer un accès"],
    },
    documents: {
      answer:
        "Réunissez vos comptes rendus récents, vos dernières analyses, vos imageries et la liste de vos traitements en cours. Déposez-les dans votre Health Passport : vous pourrez ensuite ouvrir un accès temporaire à un praticien, pour une durée que vous choisissez, et le révoquer à tout moment. La plateforme vérifie que le dossier est complet, mais elle n'interprète jamais un résultat.",
      suggestions: ["Comment fonctionne le partage ?", "Qui peut voir mes documents ?"],
    },
    budget: {
      answer:
        "La plateforme affiche une estimation ventilée par poste : soins, honoraires, examens, hébergement, transport, conciergerie. Ce sont des ordres de grandeur, jamais un prix garanti. Le montant définitif est établi par l'établissement après évaluation, et un devis professionnel signé est la seule référence engageante.",
      suggestions: ["Construire mon parcours", "Demander une estimation détaillée"],
    },
    secondAvis: {
      answer:
        "Le module de second avis fonctionne en quatre temps : vous décrivez votre demande, vous déposez vos documents, la plateforme vérifie que le dossier est complet, puis il est transmis à un professionnel habilité qui vous répond par une synthèse écrite. La vérification porte sur les pièces manquantes, pas sur le contenu médical.",
      suggestions: ["Préparer mon dossier", "Quels documents fournir ?"],
    },
    etranger: {
      answer:
        "Le mode « Je viens de l'étranger » couvre la préparation du dossier, la coordination des rendez-vous, l'interprète, l'hébergement et les transferts. En revanche, la plateforme ne délivre aucun conseil juridique ni migratoire : pour un visa ou une formalité d'entrée, référez-vous aux autorités consulaires compétentes, qui sont seules à jour.",
      suggestions: ["Organiser un séjour depuis l'étranger", "Parler à un conseiller"],
    },
    langues: {
      answer:
        "Chaque fiche indique les langues d'accueil déclarées par l'établissement. Un interprète peut être organisé pour les consultations lorsque c'est nécessaire — précisez-le au moment de la demande, cela conditionne le choix des créneaux.",
      suggestions: ["Voir les établissements", "Parler à un conseiller"],
    },
    humain: {
      answer:
        "Un conseiller peut vous accompagner à tout moment : le bouton « Parler à un conseiller » est présent sur chaque page. Le premium ne se résume pas à l'automatisation, et certaines situations méritent une voix humaine.",
      suggestions: ["Parler à un conseiller"],
    },
    thermalisme: {
      answer:
        "L'Algérie compte plusieurs sites thermaux fréquentés de longue date, notamment dans les wilayas de Guelma, Khenchela, Aïn Defla et Tlemcen. Nous les présentons comme des lieux de détente et de récupération. Aucune eau thermale n'est présentée comme le traitement d'une maladie : ce type d'affirmation exige une source médicale officielle.",
      suggestions: ["Explorer le thermalisme", "Construire un séjour détente"],
    },
  },

  fallback: {
    understood: (summary) => `Voici ce que je comprends de votre demande : ${summary}.`,
    canBuild: (days, goals) => `Je peux construire un parcours de ${days} jours autour de ${goals}.`,
    toRefine: (question) => `Pour affiner : ${question}`,
    suggestions: ["Construire ce parcours", "Parler à un conseiller"],
  },

  urgencySuggestions: ["Parler à un conseiller"],

  opening: {
    answer:
      "Bonjour. Je peux vous aider à préparer un séjour de santé, de bien-être ou de remise en forme en Algérie : comprendre l'offre, organiser les rendez-vous, préparer vos documents, ou construire un parcours. Que souhaitez-vous faire ?",
    suggestions: [
      "Je veux venir une semaine pour prendre soin de moi",
      "Quels documents dois-je préparer ?",
      "Comment fonctionne le partage de mes documents ?",
    ],
  },
};

const EN: ConciergeText = {
  rules: {
    salutation: {
      answer:
        "Hello. I can help you prepare a stay in Algeria built around health, wellbeing or getting back in shape. Tell me what you would like to improve and how long you plan to stay, and I will put together a first draft itinerary.",
      suggestions: [
        "I want to come for a week to take care of myself",
        "How does it work?",
        "Which documents should I prepare?",
      ],
    },
    fonctionnement: {
      answer:
        "You describe your plan in one sentence. The platform infers your goals, a destination, a sequence of days, relevant facilities and a budget estimate. You adjust whatever you like, then ask the selected facilities for a detailed estimate. A human adviser can take over at any stage.",
      suggestions: ["Build my journey", "What are the costs?"],
    },
    partage: {
      answer:
        "Your documents stay in your space. Sharing is always named, time-limited and revocable in one gesture. Every time a document is opened it is written into a log only you can read, under Security and trust. Nothing is passed to a facility without an explicit action from you.",
      suggestions: ["See the trust centre", "Revoke an access"],
    },
    documents: {
      answer:
        "Gather your recent reports, your latest tests, your imaging and the list of treatments you are currently on. Put them in your Health Passport: you can then open temporary access for a practitioner, for a period you choose, and revoke it at any time. The platform checks that the file is complete, but it never interprets a result.",
      suggestions: ["How does sharing work?", "Who can see my documents?"],
    },
    budget: {
      answer:
        "The platform shows an estimate broken down by item: care, fees, tests, accommodation, transport, concierge. These are orders of magnitude, never a guaranteed price. The final amount is set by the facility after assessment, and a signed professional quotation is the only binding reference.",
      suggestions: ["Build my journey", "Ask for a detailed estimate"],
    },
    secondAvis: {
      answer:
        "The second-opinion module works in four steps: you describe your request, you upload your documents, the platform checks that the file is complete, then it is passed to a qualified professional who answers with a written summary. The check concerns missing documents, not medical content.",
      suggestions: ["Prepare my file", "Which documents are needed?"],
    },
    etranger: {
      answer:
        "The \"I am coming from abroad\" mode covers preparing the file, coordinating appointments, interpreting, accommodation and transfers. The platform gives no legal or immigration advice, however: for a visa or an entry formality, refer to the competent consular authorities, who alone are up to date.",
      suggestions: ["Organise a stay from abroad", "Talk to an adviser"],
    },
    langues: {
      answer:
        "Every listing states the languages the facility declares it works in. An interpreter can be arranged for consultations where needed — say so when you make the request, as it determines which slots are available.",
      suggestions: ["See the facilities", "Talk to an adviser"],
    },
    humain: {
      answer:
        "An adviser can accompany you at any moment: the \"Talk to an adviser\" button is on every page. Premium is not just automation, and some situations deserve a human voice.",
      suggestions: ["Talk to an adviser"],
    },
    thermalisme: {
      answer:
        "Algeria has several thermal sites frequented for generations, notably in the wilayas of Guelma, Khenchela, Aïn Defla and Tlemcen. We present them as places of relaxation and recovery. No thermal water is presented as the treatment for an illness: a claim of that kind requires an official medical source.",
      suggestions: ["Explore thermal spas", "Build a relaxation stay"],
    },
  },

  fallback: {
    understood: (summary) => `Here is what I understand from your request: ${summary}.`,
    canBuild: (days, goals) => `I can build a ${days}-day journey around ${goals}.`,
    toRefine: (question) => `To refine it: ${question}`,
    suggestions: ["Build this journey", "Talk to an adviser"],
  },

  urgencySuggestions: ["Talk to an adviser"],

  opening: {
    answer:
      "Hello. I can help you prepare a stay in Algeria built around health, wellbeing or fitness: understanding what is available, arranging appointments, preparing your documents, or building an itinerary. What would you like to do?",
    suggestions: [
      "I want to come for a week to take care of myself",
      "Which documents should I prepare?",
      "How does sharing my documents work?",
    ],
  },
};

export const CONCIERGE_TEXT: Partial<Record<Locale, ConciergeText>> = { fr: FR, en: EN };

export function conciergeText(locale: Locale = "fr"): ConciergeText {
  return CONCIERGE_TEXT[locale] ?? FR;
}
