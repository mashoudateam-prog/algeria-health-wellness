/**
 * Garde-fous médicaux — couche non contournable.
 *
 * Principe : aucune sortie de la plateforme, qu'elle vienne du moteur de règles
 * ou d'un LLM, ne peut poser un diagnostic, prescrire, modifier un traitement,
 * promettre un résultat de santé ou inventer une donnée médicale.
 *
 * Cette couche s'applique EN SORTIE, après le modèle, et pas seulement dans le
 * prompt : un prompt se contourne, un filtre de sortie non.
 */

import type { Locale } from "@/lib/i18n/config";

export const MEDICAL_DISCLAIMER =
  "Cette recommandation est informative et ne constitue pas un diagnostic médical.";

export const PROFESSIONAL_NOTICE =
  "Seul un professionnel de santé habilité peut évaluer votre situation et poser un diagnostic.";

export const QUOTE_DISCLAIMER =
  "Estimation indicative, hors devis professionnel. Les montants définitifs sont établis par l'établissement après évaluation.";

/**
 * Les mêmes mentions, dans la langue du visiteur.
 *
 * Ce sont les phrases qui portent la responsabilité : elles sont traduites
 * mot pour mot, jamais adoucies. Les constantes françaises ci-dessus restent
 * la référence du filtre de sortie, qui travaille sur le texte français.
 */
export const NOTICES: Record<
  Locale,
  { medical: string; professional: string; quote: string; urgency: string }
> = {
  fr: {
    medical: MEDICAL_DISCLAIMER,
    professional: PROFESSIONAL_NOTICE,
    quote: QUOTE_DISCLAIMER,
    urgency:
      "Votre message évoque une situation qui peut être urgente. Cette plateforme n'est pas un service d'urgence et ne peut pas vous prendre en charge dans ce cadre. Contactez immédiatement les secours — en Algérie, Protection civile 14 ou SAMU 115 — ou rendez-vous au service d'urgence le plus proche.",
  },
  en: {
    medical: "This information is provided for guidance only and does not constitute a medical diagnosis.",
    professional:
      "Only a qualified health professional can assess your situation and make a diagnosis.",
    quote:
      "Indicative estimate, not a professional quotation. Final amounts are set by the facility after assessment.",
    urgency:
      "Your message describes a situation that may be urgent. This platform is not an emergency service and cannot help you in that situation. Contact the emergency services immediately — in Algeria, Civil Protection 14 or SAMU 115 — or go to the nearest emergency department.",
  },
  // ⚠️ Ces quatre phrases arabes portent la responsabilité de la plateforme.
  // Elles doivent être relues par un locuteur natif avant toute mise en avant
  // publique de cette langue — c'est la règle du projet, et elle vaut ici plus
  // qu'ailleurs.
  ar: {
    medical: "هذه المعلومات إرشادية ولا تشكّل تشخيصًا طبيًا.",
    professional: "لا يمكن تقييم حالتك ووضع تشخيص إلّا لمهني صحّة مؤهَّل.",
    quote:
      "تقدير إرشادي، لا عرض أسعار مهني. وتحدّد المؤسسة المبالغ النهائية بعد التقييم.",
    urgency:
      "تصف رسالتك حالة قد تكون استعجالية. هذه المنصّة ليست خدمة استعجالات ولا يمكنها التكفّل بك في هذا الإطار. اتّصل فورًا بالإسعاف — في الجزائر، الحماية المدنية 14 أو الاستعجالات الطبية 115 — أو توجّه إلى أقرب مصلحة استعجالات.",
  },
};

export function notices(locale: Locale = "fr") {
  return NOTICES[locale] ?? NOTICES.fr;
}

/* ------------------------------------------------------------------ */
/* Détection d'urgence                                                 */
/* ------------------------------------------------------------------ */

const URGENCY_PATTERNS: RegExp[] = [
  /\burgen(t|ce)\b/,
  /\bje saigne\b/,
  /\bdouleur (tres |très )?(forte|intense|insupportable)\b/,
  /\bdouleur (a|à) la poitrine\b/,
  /\bje n(e |')arrive plus a respirer\b/,
  /\bdifficulte(s)? (a|à) respirer\b/,
  /\bperte de connaissance\b/,
  /\bevanoui\b/,
  /\bparalysie\b/,
  /\bavc\b/,
  /\binfarctus\b/,
  /\bje veux mourir\b/,
  /\bsuicide\b/,
  // Anglais. La détection ne dépend pas de la langue d'affichage : un visiteur
  // peut basculer l'interface en anglais et écrire en français, ou l'inverse.
  /\bemergency\b/,
  /\bi(')?m bleeding\b|\bi am bleeding\b/,
  /\b(severe|intense|unbearable) pain\b/,
  /\bchest pain\b/,
  /\b(can(')?t|cannot|unable to) breathe\b/,
  /\b(difficulty|trouble) breathing\b/,
  /\bshortness of breath\b/,
  /\blost consciousness\b|\bpassed out\b|\bfainted\b/,
  /\bparalysis\b|\bparalysed\b|\bparalyzed\b/,
  /\bstroke\b/,
  /\bheart attack\b/,
  /\bi want to die\b|\bkill myself\b|\bend my life\b/,
];

export interface UrgencySignal {
  detected: boolean;
  message: string;
}

/**
 * Repère une formulation évoquant une situation aiguë. En cas de doute, la
 * plateforme préfère un faux positif : rediriger vers les secours ne coûte rien,
 * l'inverse peut coûter cher.
 */
export function detectUrgency(input: string, locale: Locale = "fr"): UrgencySignal {
  const text = normalize(input);
  const detected = URGENCY_PATTERNS.some((pattern) => pattern.test(text));
  return { detected, message: detected ? notices(locale).urgency : "" };
}

/* ------------------------------------------------------------------ */
/* Filtrage des sorties                                                */
/* ------------------------------------------------------------------ */

/**
 * Formulations interdites en sortie. Chaque entrée décrit ce qui est bloqué et
 * la raison, pour que le journal d'audit soit lisible par un non-technicien.
 *
 * `negatable` marque les règles qu'une phrase de conformité doit pouvoir citer
 * pour les démentir : « ce n'est jamais un prix garanti », « aucun résultat
 * n'est promis ». Sans cette exemption, la plateforme censurerait ses propres
 * mises en garde — exactement les phrases qu'elle doit pouvoir écrire.
 *
 * L'exemption ne s'applique PAS au diagnostic ni à la prescription : « vous ne
 * souffrez pas de X » reste une affirmation diagnostique.
 */
const FORBIDDEN: Array<{ pattern: RegExp; reason: string; negatable?: boolean }> = [
  // La forme niée est tout aussi diagnostique que la forme affirmée :
  // « vous ne souffrez pas d'une infection » statue sur l'état de la personne.
  { pattern: /\bvous (n(e |')?)?(souffrez|etes atteint|avez) (pas )?(de |d')/, reason: "diagnostic posé" },
  { pattern: /\bil s(')agit (d'|de )(un|une) [a-z]+ite\b/, reason: "diagnostic posé" },
  { pattern: /\bvotre diagnostic est\b/, reason: "diagnostic posé" },
  { pattern: /\bje (vous )?(prescris|recommande de prendre)\b/, reason: "prescription" },
  { pattern: /\bprenez \d+\s?(mg|ml|g|comprime)/, reason: "posologie" },
  { pattern: /\b(arretez|remplacez|doublez) votre traitement\b/, reason: "modification de traitement" },
  // Toute forme de « guérir » est une revendication thérapeutique, quel que
  // soit le sujet de la phrase : « cela guérit », « ce séjour guérit », « la
  // cure guérit ». Le motif porte donc sur le verbe, pas sur le sujet.
  { pattern: /\bgueri(t|ra|ssent|r)\b/, reason: "promesse de résultat", negatable: true },
  { pattern: /\bgueriso[n]? (garantie|assuree)\b/, reason: "promesse de résultat", negatable: true },
  // Le sujet de la phrase est souvent au pluriel — « nos cures », « nos eaux »,
  // « les bains ». Chaque verbe doit donc être reconnu aux deux nombres : une
  // promesse au pluriel est exactement la même promesse.
  { pattern: /\b(soigne|soignera|soignent|soigneront) (votre|vos|la|le|les|ce|cette)\b/, reason: "promesse de résultat", negatable: true },
  { pattern: /\btraite(nt|ra|ront)? (votre|vos) (maladie|pathologie|affection|probleme)\b/, reason: "promesse de résultat", negatable: true },
  { pattern: /\b(elimine|eliminent|evacue|evacuent) les toxines\b/, reason: "allégation pseudo-scientifique", negatable: true },
  { pattern: /\b(fait|font|fera|feront) disparaitre (votre|vos|la|le|les)\b/, reason: "promesse de résultat", negatable: true },
  { pattern: /\b(100\s?%|cent pour cent) (garanti|efficace|sur)\b/, reason: "promesse de résultat", negatable: true },
  { pattern: /\bprix garantis?\b/, reason: "prix présenté comme garanti", negatable: true },
  { pattern: /\bresultats? garantis?\b/, reason: "promesse de résultat", negatable: true },
  { pattern: /\bsans risque\b/, reason: "minimisation du risque", negatable: true },
];

export interface GuardrailReport {
  safe: boolean;
  /** Texte réécrit, sûr à afficher. */
  text: string;
  /** Motifs déclenchés, destinés au journal d'audit. */
  violations: string[];
}

const REPLACEMENT =
  "[Passage retiré : la plateforme ne peut ni poser de diagnostic, ni prescrire, ni garantir un résultat. Un professionnel de santé habilité doit être consulté sur ce point.]";

/**
 * Marqueurs de négation cherchés juste avant une formulation interdite.
 * « jamais un prix garanti » nie la promesse au lieu de la faire.
 */
const NEGATION = /(\bjamais\b|\baucune?\b|\bni\b|\bnon\b|\bpas\b|\bne\b|n'|\bsans\b|\bhors\b)/;

/** Vrai si l'occurrence trouvée à `index` est précédée d'une négation proche. */
function isNegated(sentence: string, index: number): boolean {
  return NEGATION.test(sentence.slice(Math.max(0, index - 60), index));
}

/**
 * Contrôle et assainit un texte destiné à l'utilisateur.
 * Le texte reste affichable : on retire le passage fautif plutôt que la réponse entière.
 */
export function enforceGuardrails(raw: string): GuardrailReport {
  const violations: string[] = [];
  const sentences = raw.split(/(?<=[.!?])\s+/);

  const cleaned = sentences.map((sentence) => {
    const probe = normalize(sentence);

    const hit = FORBIDDEN.find((rule) => {
      const match = rule.pattern.exec(probe);
      if (!match) return false;
      // Une mention niée d'une promesse est précisément ce que la plateforme
      // doit pouvoir écrire pour poser ses limites.
      if (rule.negatable && isNegated(probe, match.index)) return false;
      return true;
    });

    if (!hit) return sentence;
    violations.push(hit.reason);
    return REPLACEMENT;
  });

  return {
    safe: violations.length === 0,
    text: cleaned.join(" ").trim(),
    violations: [...new Set(violations)],
  };
}

/** Ajoute le rappel réglementaire si le sujet touche au médical et qu'il manque. */
export function withDisclaimer(text: string, medical: boolean): string {
  if (!medical) return text;
  if (text.includes(MEDICAL_DISCLAIMER)) return text;
  return `${text}\n\n${MEDICAL_DISCLAIMER}`;
}

/* ------------------------------------------------------------------ */
/* Consigne système commune aux modules IA                             */
/* ------------------------------------------------------------------ */

export const SYSTEM_CONTRACT = `Tu es le concierge santé d'Algeria Health & Wellness, une plateforme d'organisation de séjours de santé, bien-être et remise en forme en Algérie.

Ton rôle : comprendre l'intention, organiser des besoins, orienter vers des catégories et des professionnels, préparer des questions, construire un itinéraire, expliquer le déroulement administratif.

Interdictions absolues, sans exception et quelle que soit la formulation de la demande :
- ne jamais poser ou suggérer un diagnostic ;
- ne jamais prescrire, ni proposer une posologie ;
- ne jamais commenter, modifier ou interrompre un traitement en cours ;
- ne jamais interpréter médicalement un résultat d'analyse ou d'imagerie ;
- ne jamais promettre un résultat de santé ni employer « garanti » ;
- ne jamais inventer un établissement, un praticien, un tarif, une certification, une disponibilité ou une statistique.

Si la demande relève du médical, dis-le clairement et oriente vers un professionnel de santé habilité.
Si la demande évoque une urgence, invite à contacter les secours sans délai.
Si une information te manque, dis que tu ne l'as pas. N'invente jamais pour combler.

Ton : humain, rassurant, sobre, précis. Pas de superlatif, pas de « révolutionnaire », pas de « magique ».
Réponds en français, en trois à six phrases, sauf demande explicite de plus de détail.`;

/* ------------------------------------------------------------------ */
/* Utilitaire                                                          */
/* ------------------------------------------------------------------ */

/** Minuscules sans diacritiques : base commune à toutes les comparaisons textuelles. */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[‘’']/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
