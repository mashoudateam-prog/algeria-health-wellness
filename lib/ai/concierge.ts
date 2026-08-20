import { DESTINATIONS } from "@/data/destinations";
import { GOALS } from "@/data/goals";
import { localizedGoal } from "@/lib/i18n/content";
import type { ConciergeMessage } from "@/types/domain";
import { detectUrgency, enforceGuardrails, normalize, notices } from "./guardrails";
import { conciergeText, type RuleId } from "./concierge-text";
import { classifyIntent } from "./intent";
import { buildSystemPrompt, resolveProvider } from "./provider";
import type { Locale } from "@/lib/i18n/config";

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
  id: RuleId;
  match: RegExp;
  medical?: boolean;
}

/**
 * Un seul jeu de motifs pour toutes les langues.
 *
 * Dupliquer les règles par langue reviendrait à corriger deux fois chaque
 * faux positif — et à en oublier un. Les termes anglais sont donc ajoutés au
 * motif existant, et seule la réponse est traduite.
 */
const RULES: Rule[] = [
  {
    id: "salutation",
    match: /\b(bonjour|salut|bonsoir|hello|hi|hey|good morning|good evening)\b/,
  },
  {
    id: "fonctionnement",
    match:
      /\b(comment ca marche|comment ca fonctionne|c'est quoi|expliquer la plateforme|fonctionnement|how does it work|how it works|what is this|explain the platform)\b/,
  },
  // ⚠️ Ordre significatif : la première règle qui correspond l'emporte.
  // « le partage de mes documents » contient les deux thèmes ; l'intention
  // porte sur le partage, donc cette règle passe avant celle des documents.
  {
    id: "partage",
    match:
      /\b(partages?|partager|acces|confidentialite|donnees|rgpd|securite|qui peut voir|shar(e|es|ing)|access|privacy|confidential|gdpr|who can see)\b/,
  },
  {
    id: "documents",
    match:
      /\b(documents?|papiers?|dossiers?|apporter|pieces?|justificatifs?|paperwork|records?|files?|bring)\b/,
    medical: true,
  },
  {
    id: "budget",
    match:
      /\b(prix|tarifs?|couts?|couter|budgets?|combien|devis|estimations?|factures?|price|prices|cost|costs|fees?|how much|quote|quotation|estimate)\b/,
  },
  {
    id: "secondAvis",
    match:
      /\b(second avis|deuxieme avis|relire mon dossier|avis medical|contre expertise|second opinion|review my file|medical opinion)\b/,
    medical: true,
  },
  {
    id: "etranger",
    match:
      /\b(etranger|visas?|frontieres?|douane|assurances?|passeport|vols?|billets?|abroad|border|customs|insurance|passport|flights?|tickets?)\b/,
  },
  {
    id: "langues",
    match:
      /\b(langues?|traductions?|interpretes?|anglais|arabe|languages?|translation|interpreter|english|arabic)\b/,
  },
  {
    id: "humain",
    match:
      /\b(humain|conseillers?|quelqu'un|telephone|appeler|parler a|human|adviser|advisor|someone|phone|call|speak to)\b/,
  },
  {
    id: "thermalisme",
    match:
      /\b(thermal(e|es|aux)?|thermalisme|cures?|hammams?|sources? chaudes?|hot springs?|spa cure|balneotherapy)\b/,
  },
];

function ruleBasedAnswer(message: string, locale: Locale): ConciergeMessage {
  const text = normalize(message);
  const tx = conciergeText(locale);

  const rule = RULES.find((entry) => entry.match.test(text));
  if (rule) {
    const answer = tx.rules[rule.id];
    return {
      role: "concierge",
      content: answer.answer,
      notice: rule.medical ? notices(locale).medical : undefined,
      suggestions: answer.suggestions,
    };
  }

  // Aucune règle ne s'applique : on s'appuie sur ce que le classifieur a compris
  // du message, ce qui vaut mieux qu'une réponse générique.
  const { brief, understood, missing } = classifyIntent(message, locale);
  const goalNames = brief.goals
    .map((id) => {
      const goal = GOALS.find((g) => g.id === id);
      return goal ? localizedGoal(goal, locale).label.toLowerCase() : undefined;
    })
    .filter(Boolean)
    .join(", ");

  const parts = [
    tx.fallback.understood(understood.join(" · ").toLowerCase()),
    tx.fallback.canBuild(brief.durationDays, goalNames),
  ];

  if (missing.length > 0) parts.push(tx.fallback.toRefine(missing[0]));

  return {
    role: "concierge",
    content: parts.join(" "),
    notice: brief.flags.needsProfessionalOpinion ? notices(locale).professional : undefined,
    suggestions: tx.fallback.suggestions,
  };
}

/* ------------------------------------------------------------------ */
/* Point d'entrée                                                      */
/* ------------------------------------------------------------------ */

export interface ConciergeInput {
  message: string;
  history: ConciergeMessage[];
  locale?: Locale;
}

export async function askConcierge({
  message,
  history,
  locale = "fr",
}: ConciergeInput): Promise<ConciergeMessage> {
  /* 1. Urgence — court-circuite tout le reste. */
  const urgency = detectUrgency(message, locale);
  if (urgency.detected) {
    return {
      role: "concierge",
      content: urgency.message,
      notice: notices(locale).professional,
      suggestions: conciergeText(locale).urgencySuggestions,
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
          ? ruleBasedAnswer(message, locale)
          : { role: "concierge", content: result.text };
    } catch {
      // Une panne du fournisseur ne doit jamais interrompre le service :
      // on retombe sur le moteur de règles.
      draft = ruleBasedAnswer(message, locale);
    }
  } else {
    draft = ruleBasedAnswer(message, locale);
  }

  /* 3. Garde-fous en sortie, sur tous les chemins. */
  const checked = enforceGuardrails(draft.content);

  /* 4. Rappel réglementaire si le sujet touche au médical. */
  const { brief } = classifyIntent(message, locale);
  const medical = brief.flags.needsProfessionalOpinion || !checked.safe;

  return {
    role: "concierge",
    content: checked.text,
    notice: draft.notice ?? (medical ? notices(locale).medical : undefined),
    suggestions: draft.suggestions,
  };
}
