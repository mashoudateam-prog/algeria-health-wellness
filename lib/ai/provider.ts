import { SYSTEM_CONTRACT } from "./guardrails";

/**
 * Couche fournisseur LLM — volontairement agnostique.
 *
 * Le reste de l'application ne connaît que l'interface `LlmProvider`. Changer
 * de fournisseur, ou n'en avoir aucun, ne modifie aucun autre module.
 *
 * Sans clé API, `resolveProvider()` retourne `null` et la plateforme bascule
 * sur son moteur de règles déterministe : l'application reste entièrement
 * fonctionnelle et démontrable, sans dépendance externe.
 */

export interface LlmMessage {
  role: "user" | "assistant";
  content: string;
}

export interface LlmRequest {
  system: string;
  messages: LlmMessage[];
  maxTokens?: number;
}

export interface LlmResult {
  text: string;
  provider: string;
  model: string;
  /** Le fournisseur a décliné la demande (politique de sécurité côté modèle). */
  refused: boolean;
}

export interface LlmProvider {
  id: string;
  label: string;
  model: string;
  complete(request: LlmRequest): Promise<LlmResult>;
}

/* ------------------------------------------------------------------ */
/* Adaptateur Anthropic                                                */
/* ------------------------------------------------------------------ */

const DEFAULT_ANTHROPIC_MODEL = "claude-opus-5";

function createAnthropicProvider(): LlmProvider {
  const model = process.env.AI_MODEL ?? DEFAULT_ANTHROPIC_MODEL;

  return {
    id: "anthropic",
    label: "Anthropic",
    model,
    async complete({ system, messages, maxTokens = 1200 }) {
      // Import dynamique : le SDK n'est chargé que si une clé est configurée,
      // ce qui garde le démarrage léger dans le mode démonstration.
      const { default: Anthropic } = await import("@anthropic-ai/sdk");
      const client = new Anthropic();

      const response = await client.messages.create({
        model,
        max_tokens: maxTokens,
        // Le contrat système est stable : on le met en cache pour réduire le
        // coût des tours suivants d'une même conversation.
        system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
        messages: messages.map((message) => ({
          role: message.role,
          content: message.content,
        })),
      });

      // Un refus du modèle est un aboutissement normal, pas une erreur HTTP :
      // il faut le tester avant de lire `content`.
      if (response.stop_reason === "refusal") {
        return {
          text: "",
          provider: "anthropic",
          model,
          refused: true,
        };
      }

      const text = response.content
        .filter((block): block is { type: "text"; text: string; citations: never } =>
          block.type === "text",
        )
        .map((block) => block.text)
        .join("\n")
        .trim();

      return { text, provider: "anthropic", model, refused: false };
    },
  };
}

/* ------------------------------------------------------------------ */
/* Résolution                                                          */
/* ------------------------------------------------------------------ */

/** Retourne le fournisseur configuré, ou `null` si la plateforme tourne en mode règles. */
export function resolveProvider(): LlmProvider | null {
  if (process.env.AI_PROVIDER === "off") return null;
  if (process.env.ANTHROPIC_API_KEY) return createAnthropicProvider();
  return null;
}

export function providerStatus(): { active: boolean; label: string } {
  const provider = resolveProvider();
  return provider
    ? { active: true, label: `${provider.label} · ${provider.model}` }
    : { active: false, label: "Moteur de règles (aucune clé configurée)" };
}

/** Contrat système enrichi du contexte produit, commun à tous les modules IA. */
export function buildSystemPrompt(context: string): string {
  return `${SYSTEM_CONTRACT}

# Contexte de la plateforme

${context}

# Style de réponse

Réponds de façon brève et directe. Va à l'essentiel : trois à six phrases suffisent
dans la grande majorité des cas. Évite les préambules, les récapitulatifs de ce que
la personne vient d'écrire et les mises en garde répétées. Une seule réserve, si
elle est nécessaire, suffit.`;
}
