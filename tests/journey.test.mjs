import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyIntent } from "@/lib/ai/intent";
import { buildJourney, buildJourneyFromBrief } from "@/lib/ai/planner";

const PHRASE =
  "Je viens de France pour 10 jours : je voudrais faire mes dents, perdre un peu de poids et me reposer.";

test("comprend une demande exprimée en langage naturel", () => {
  const { brief, understood } = classifyIntent(PHRASE);

  assert.equal(brief.durationDays, 10);
  assert.equal(brief.origin, "etranger");
  assert.ok(brief.goals.includes("dentaire"), "objectif dentaire non détecté");
  assert.ok(brief.goals.includes("forme"), "objectif remise en forme non détecté");
  assert.ok(brief.flags.needsProfessionalOpinion, "un objectif médical impose l'avis professionnel");
  assert.ok(understood.length >= 2);
});

test("comprend « une semaine » et un voyage à deux", () => {
  const { brief } = classifyIntent("Une semaine à Oran avec ma femme pour nous détendre.");
  assert.equal(brief.durationDays, 7);
  assert.equal(brief.travellers, 2);
  assert.equal(brief.destinationSlug, "oran");
});

test("construit un parcours cohérent et borné", () => {
  const plan = buildJourney(PHRASE);

  assert.ok(plan.steps.length > 0);
  assert.equal(plan.generatedBy, "regles");

  // Aucune étape ne sort de la durée du séjour.
  for (const step of plan.steps) {
    assert.ok(step.day >= 1 && step.day <= plan.brief.durationDays, `jour hors bornes : ${step.day}`);
  }

  // Le jour d'arrivée ne porte aucun acte.
  const careOnArrival = plan.steps.some(
    (step) => step.day === 1 && (step.kind === "soin" || step.kind === "examen"),
  );
  assert.equal(careOnArrival, false, "un acte est programmé le jour de l'arrivée");

  // Le départ est bien la dernière étape.
  assert.equal(plan.steps.at(-1)?.kind, "logistique");
});

test("aucun effort soutenu dans les 48 h suivant un acte", () => {
  const plan = buildJourney(PHRASE);
  const careDays = plan.steps.filter((step) => step.kind === "soin").map((step) => step.day);

  for (const step of plan.steps) {
    if (step.intensity !== "soutenue" && step.intensity !== "moderee") continue;
    for (const careDay of careDays) {
      const gap = step.day - careDay;
      assert.ok(gap <= 0 || gap >= 2, `effort ${step.intensity} au jour ${step.day} après un acte au jour ${careDay}`);
    }
  }
});

test("chaque recommandation est justifiée", () => {
  const plan = buildJourney(PHRASE);
  assert.ok(plan.matches.length > 0, "aucun établissement proposé");

  for (const match of plan.matches) {
    assert.ok(match.reasons.length >= 1, "recommandation sans motif affiché");
    assert.ok(match.reasons.length <= 5, "trop de motifs affichés");
    for (const reason of match.reasons) {
      assert.ok(reason.label.length > 0 && reason.detail.length > 0);
    }
  }
});

test("l'estimation est cohérente et jamais présentée comme un prix", () => {
  const plan = buildJourney(PHRASE);

  assert.equal(plan.quote.kind, "estimation");
  assert.ok(plan.quote.totalMin > 0);
  assert.ok(plan.quote.totalMax > plan.quote.totalMin);
  assert.ok(!/prix garanti/i.test(plan.quote.disclaimer));

  const sumMin = plan.quote.lines.reduce((total, line) => total + line.min, 0);
  assert.equal(sumMin, plan.quote.totalMin, "le total ne correspond pas aux lignes");
});

test("le rappel réglementaire accompagne toujours le parcours", () => {
  const plan = buildJourney(PHRASE);
  assert.ok(plan.disclaimer.includes("diagnostic"));
});

test("un séjour très court reste réalisable et signalé", () => {
  const { brief } = classifyIntent("3 jours à Alger pour un bilan et mes dents.");
  const plan = buildJourneyFromBrief(brief);

  assert.ok(plan.steps.length > 0);
  assert.ok(
    plan.cautions.some((caution) => caution.includes("serré")),
    "le cumul d'objectifs médicaux sur un séjour court doit être signalé",
  );
});

test("un parcours familial mentionne l'organisation partagée", () => {
  const { brief } = classifyIntent("Nous venons en famille une semaine à Annaba pour nous reposer.");
  const plan = buildJourneyFromBrief(brief);

  assert.ok(brief.travellers >= 3);
  assert.ok(
    plan.cautions.some((caution) => caution.includes("commun")),
    "un voyage à plusieurs doit signaler le calendrier et les transports communs",
  );
});
