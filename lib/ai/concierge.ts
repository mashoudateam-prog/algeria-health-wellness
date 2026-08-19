import { DESTINATIONS } from "@/data/destinations";
import { GOALS } from "@/data/goals";
import type { ConciergeMessage } from "@/types/domain";
import {
  MEDICAL_DISCLAIMER,
  PROFESSIONAL_NOTICE,
  detectUrgency,
  enforceGuardrails,
  normalize,
} from "./guardrails";
import { classifyIntent } from "./intent";
import { buildSystemPrompt, resolveProvider } from "./provider";

/**
 * ConversationAssistant — le concierge santé.
 *
 * Chaîne de traitement, dans cet ordre et sans court-circuit possible :
 *   1. détection d'urgence  → réponse de redirection immédiate, rien d'autre ;
 *   2. génération           → LLM encadré si configuré, sinon moteur de règles ;
 *   3. garde-fous en sortie → assainissement du texte, quelle que soit la source ;
 *   4. rappel réglementaire → ajouté dès que le sujet touche au médical.
 *
 * L'étape 3 s'applique aussi aux réponses du moteur de règles : un garde-fou
 * qui ne s'exécute que sur le chemin « IA » finit toujours par être contourné.
 */

const PLATFORM_CONTEXT = `Algeria Health & Wellness organise des séjours combinant soins,
bien-être, remise en forme et découverte de l'Algérie.

Ce que la plateforme sait faire :
- transformer une intention exprimée en langage naturel en parcours structuré jour par jour ;
- proposer des établissements et des professionnels selon des critères explicites, en affichant les raisons du rapprochement ;
- centraliser des documents médicaux dans un coffre personnel, avec partage temporaire et révocable ;
- estimer un budget indicatif ventilé par poste ;
- organiser la logistique : hébergement, transferts, interprète, coordination des rendez-vous ;
- mettre en relation avec un conseiller humain à tout moment.

Destinations éditoriales couvertes : ${DESTINATIONS.map((d) => d.name).join(", ")}.
Objectifs proposés à l'entrée : ${GOALS.map((g) => g.label).join(", ")}.

Le catalogue d'établissements affiché est actuellement un jeu de démonstration
explicitement marqué DÉMO. Ne présente jamais ces fiches comme des établissements réels.`;

/* ------------------------------------------------------------------ */
/* Moteur de règles                                                    */
/* ------------------------------------------------------------------ */

interface Rule {
  match: RegExp;
  answer: string;
  suggestions?: string[];
  medical?: boolean;
}

const RULES: Rule[] = [
  {
    match: /\b(bonjour|salut|bonsoir|hello|coucou)\b/,
    answer:
      "Bonjour. Je peux vous aider à préparer un séjour de santé, de bien-être ou de remise en forme en Algérie. Dites-moi ce que vous souhaitez améliorer et combien de temps vous comptez rester, et je construirai une première proposition de parcours.",
    suggestions: [
      "Je veux venir une semaine pour prendre soin de moi",
      "Comment ça fonctionne ?",
      "Quels documents dois-je préparer ?",
    ],
  },
  {
    match: /\b(comment ca marche|comment ca fonctionne|c'est quoi|expliquer la plateforme|fonctionnement)\b/,
    answer:
      "Vous décrivez votre projet en une phrase. La plateforme en déduit vos objectifs, une destination, un enchaînement de journées, des établissements pertinents et une estimation de budget. Vous ajustez ce que vous voulez, puis vous demandez une estimation détaillée aux établissements retenus. Un conseiller humain peut reprendre la main à n'importe quelle étape.",
    suggestions: ["Construire mon parcours", "Quels sont les frais ?"],
  },
  // ⚠️ Ordre significatif : la première règle qui correspond l'emporte.
  // « le partage de mes documents » contient les deux thèmes ; l'intention
  // porte sur le partage, donc cette règle passe avant celle des documents.
  {
    match: /\b(partages?|partager|acces|confidentialite|donnees|rgpd|securite|qui peut voir)\b/,
    answer:
      "Vos documents restent dans votre espace. Un partage est toujours nominatif, limité dans le temps et révocable en un geste. Chaque consultation est inscrite dans un journal que vous seul consultez, dans la rubrique Sécurité et confiance. Rien n'est transmis à un établissement sans une action explicite de votre part.",
    suggestions: ["Voir le centre de confiance", "Révoquer un accès"],
  },
  {
    match: /\b(documents?|papiers?|dossiers?|apporter|pieces?|justificatifs?)\b/,
    answer:
      "Réunissez vos comptes rendus récents, vos dernières analyses, vos imageries et la liste de vos traitements en cours. Déposez-les dans votre Health Passport : vous pourrez ensuite ouvrir un accès temporaire à un praticien, pour une durée que vous choisissez, et le révoquer à tout moment. La plateforme vérifie que le dossier est complet, mais elle n'interprète jamais un résultat.",
    suggestions: ["Comment fonctionne le partage ?", "Qui peut voir mes documents ?"],
    medical: true,
  },
  {
    match: /\b(prix|tarifs?|couts?|couter|budgets?|combien|devis|estimations?|factures?)\b/,
    answer:
      "La plateforme affiche une estimation ventilée par poste : soins, honoraires, examens, hébergement, transport, conciergerie. Ce sont des ordres de grandeur, jamais un prix garanti. Le montant définitif est établi par l'établissement après évaluation, et un devis professionnel signé est la seule référence engageante.",
    suggestions: ["Construire mon parcours", "Demander une estimation détaillée"],
  },
  {
    match: /\b(second avis|deuxieme avis|relire mon dossier|avis medical|contre expertise)\b/,
    answer:
      "Le module de second avis fonctionne en quatre temps : vous décrivez votre demande, vous déposez vos documents, la plateforme vérifie que le dossier est complet, puis il est transmis à un professionnel habilité qui vous répond par une synthèse écrite. La vérification porte sur les pièces manquantes, pas sur le contenu médical.",
    suggestions: ["Préparer mon dossier", "Quels documents fournir ?"],
    medical: true,
  },
  {
    match: /\b(etranger|visas?|frontieres?|douane|assurances?|passeport|vols?|billets?)\b/,
    answer:
      "Le mode « Je viens de l'étranger » couvre la préparation du dossier, la coordination des rendez-vous, l'interprète, l'hébergement et les transferts. En revanche, la plateforme ne délivre aucun conseil juridique ni migratoire : pour un visa ou une formalité d'entrée, référez-vous aux autorités consulaires compétentes, qui sont seules à jour.",
    suggestions: ["Organiser un séjour depuis l'étranger", "Parler à un conseiller"],
  },
  {
    match: /\b(langues?|traductions?|interpretes?|anglais|arabe)\b/,
    answer:
      "Chaque fiche indique les langues d'accueil déclarées par l'établissement. Un interprète peut être organisé pour les consultations lorsque c'est nécessaire — précisez-le au moment de la demande, cela conditionne le choix des créneaux.",
    suggestions: ["Voir les établissements", "Parler à un conseiller"],
  },
  {
    match: /\b(humain|conseillers?|quelqu'un|telephone|appeler|parler a)\b/,
    answer:
      "Un conseiller peut vous accompagner à tout moment : le bouton « Parler à un conseiller » est présent sur chaque page. Le premium ne se résume pas à l'automatisation, et certaines situations méritent une voix humaine.",
    suggestions: ["Parler à un conseiller"],
  },
  {
    match: /\b(thermal(e|es|aux)?|thermalisme|cures?|hammams?|sources? chaudes?)\b/,
    answer:
      "L'Algérie compte plusieurs sites thermaux fréquentés de longue date, notamment dans les wilayas de Guelma, Khenchela, Aïn Defla et Tlemcen. Nous les présentons comme des lieux de détente et de récupération. Aucune eau thermale n'est présentée comme le traitement d'une maladie : ce type d'affirmation exige une source médicale officielle.",
    suggestions: ["Explorer le thermalisme", "Construire un séjour détente"],
  },
];

function ruleBasedAnswer(message: string): ConciergeMessage {
  const text = normalize(message);

  const rule = RULES.find((entry) => entry.match.test(text));
  if (rule) {
    return {
      role: "concierge",
      content: rule.answer,
      notice: rule.medical ? MEDICAL_DISCLAIMER : undefined,
      suggestions: rule.suggestions,
    };
  }

  // Aucune règle ne s'applique : on s'appuie sur ce que le classifieur a compris
  // du message, ce qui vaut mieux qu'une réponse générique.
  const { brief, understood, missing } = classifyIntent(message);
  const goalNames = brief.goals
    .map((id) => GOALS.find((g) => g.id === id)?.label.toLowerCase())
    .filter(Boolean)
    .join(", ");

  const parts = [
    `Voici ce que je comprends de votre demande : ${understood.join(" · ").toLowerCase()}.`,
    `Je peux construire un parcours de ${brief.durationDays} jours autour de ${goalNames}.`,
  ];

  if (missing.length > 0) {
    parts.push(`Pour affiner : ${missing[0]}`);
  }

  return {
    role: "concierge",
    content: parts.join(" "),
    notice: brief.flags.needsProfessionalOpinion ? PROFESSIONAL_NOTICE : undefined,
    suggestions: ["Construire ce parcours", "Parler à un conseiller"],
  };
}

/* ------------------------------------------------------------------ */
/* Point d'entrée                                                      */
/* ------------------------------------------------------------------ */

export interface ConciergeInput {
  message: string;
  history: ConciergeMessage[];
}

export async function askConcierge({ message, history }: ConciergeInput): Promise<ConciergeMessage> {
  /* 1. Urgence — court-circuite tout le reste. */
  const urgency = detectUrgency(message);
  if (urgency.detected) {
    return {
      role: "concierge",
      content: urgency.message,
      notice: PROFESSIONAL_NOTICE,
      suggestions: ["Parler à un conseiller"],
    };
  }

  /* 2. Génération. */
  const provider = resolveProvider();
  let draft: ConciergeMessage;

  if (provider) {
    try {
      const result = await provider.complete({
        system: buildSystemPrompt(PLATFORM_CONTEXT),
        messages: [
          ...history.slice(-8).map((entry) => ({
            role: entry.role === "patient" ? ("user" as const) : ("assistant" as const),
            content: entry.content,
          })),
          { role: "user" as const, content: message },
        ],
      });

      draft =
        result.refused || result.text.length === 0
          ? ruleBasedAnswer(message)
          : { role: "concierge", content: result.text };
    } catch {
      // Une panne du fournisseur ne doit jamais interrompre le service :
      // on retombe sur le moteur de règles.
      draft = ruleBasedAnswer(message);
    }
  } else {
    draft = ruleBasedAnswer(message);
  }

  /* 3. Garde-fous en sortie, sur tous les chemins. */
  const checked = enforceGuardrails(draft.content);

  /* 4. Rappel réglementaire si le sujet touche au médical. */
  const { brief } = classifyIntent(message);
  const medical = brief.flags.needsProfessionalOpinion || !checked.safe;

  return {
    role: "concierge",
    content: checked.text,
    notice: draft.notice ?? (medical ? MEDICAL_DISCLAIMER : undefined),
    suggestions: draft.suggestions,
  };
}
