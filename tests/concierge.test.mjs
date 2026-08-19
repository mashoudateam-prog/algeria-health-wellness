import assert from "node:assert/strict";
import { test } from "node:test";
import { askConcierge } from "@/lib/ai/concierge";
import { enforceGuardrails } from "@/lib/ai/guardrails";

/**
 * Ces tests couvrent deux défauts trouvés en conditions réelles, pas en théorie :
 * le filtre de sortie censurait les propres mises en garde de la plateforme, et
 * les règles du concierge ignoraient les pluriels.
 */

const ask = (message) => askConcierge({ message, history: [] });

test("une mise en garde qui NIE une promesse n'est pas censurée", () => {
  const compliant = [
    "Ce sont des ordres de grandeur, jamais un prix garanti.",
    "Aucun résultat garanti ne peut vous être promis.",
    "Cette eau thermale ne guérit aucune maladie.",
    "Nous ne prétendons pas que ce séjour soit sans risque.",
  ];

  for (const sentence of compliant) {
    const report = enforceGuardrails(sentence);
    assert.equal(report.safe, true, `censuré à tort : ${sentence}`);
    assert.equal(report.text, sentence);
  }
});

test("la même formulation SANS négation reste bloquée", () => {
  for (const sentence of [
    "Le prix garanti est de 40 000 DZD.",
    "Résultat garanti après trois séances.",
    "Cette cure guérit les douleurs articulaires.",
    "Cette intervention est sans risque.",
  ]) {
    assert.equal(enforceGuardrails(sentence).safe, false, `laissé passer : ${sentence}`);
  }
});

test("un diagnostic nié reste bloqué : la négation n'exempte pas le diagnostic", () => {
  // « Vous ne souffrez pas de X » reste une affirmation diagnostique.
  assert.equal(enforceGuardrails("Vous ne souffrez pas d'une infection.").safe, false);
});

test("le concierge reconnaît les questions au pluriel", async () => {
  const reply = await ask("Quels documents dois-je préparer ?");
  assert.match(reply.content, /Health Passport|comptes rendus/i);
});

test("le concierge répond sur le budget sans passage censuré", async () => {
  const reply = await ask("Combien ça coûte ?");
  assert.ok(!reply.content.includes("Passage retiré"), "la réponse budget a été censurée");
  assert.match(reply.content, /estimation/i);
});

test("l'urgence court-circuite toute autre réponse", async () => {
  const reply = await ask("J'ai une douleur très forte à la poitrine");
  assert.match(reply.content, /urgen/i);
  assert.ok(reply.content.includes("14"), "les numéros de secours doivent être donnés");
  assert.ok(!reply.content.includes("parcours"), "aucune réponse commerciale en situation d'urgence");
});

test("les autres règles répondent bien à leur sujet", async () => {
  const cases = [
    ["Comment fonctionne le partage de mes documents ?", /révocable|journal/i],
    ["Je viens de l'étranger, et le visa ?", /consulaire|juridique/i],
    ["Je voudrais parler à quelqu'un", /conseiller/i],
    ["Parlez-moi des cures thermales", /thermaux|détente/i],
  ];

  for (const [message, expected] of cases) {
    const reply = await ask(message);
    assert.match(reply.content, expected, `réponse inattendue pour : ${message}`);
  }
});
