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

test("le parcours généré suit la langue du visiteur", () => {
  const { brief } = classifyIntent(PHRASE);
  const fr = buildJourneyFromBrief(brief, "fr");
  const en = buildJourneyFromBrief(brief, "en");

  // Même moteur, même structure : seule la langue change.
  assert.equal(en.steps.length, fr.steps.length);
  assert.deepEqual(
    en.steps.map((step) => [step.day, step.kind]),
    fr.steps.map((step) => [step.day, step.kind]),
  );

  assert.match(en.title, /^10 days in /, `titre non traduit : ${en.title}`);
  assert.match(fr.title, /^10 jours à /, `titre français abîmé : ${fr.title}`);

  // Aucun résidu français dans le texte lu par le visiteur anglophone.
  const anglais = [
    en.title,
    en.summary,
    ...en.steps.flatMap((s) => [s.title, s.detail]),
    ...en.nextActions,
    ...en.cautions,
    ...en.matches.flatMap((m) => m.reasons.flatMap((r) => [r.label, r.detail])),
    ...en.quote.lines.flatMap((l) => [l.label, l.note ?? ""]),
  ].join(" ");
  for (const residu of [/\bjours?\b/i, /\bséance\b/i, /\bjournée\b/i, /\bséjour\b/i, /\bsanté\b/i]) {
    assert.ok(!residu.test(anglais), `résidu français (${residu}) dans le parcours anglais`);
  }
});

test("une langue sans traduction du parcours retombe sur le français", () => {
  const { brief } = classifyIntent(PHRASE);
  // « es » n'existe pas encore : le visiteur doit lire du français, pas du vide.
  const fallback = buildJourneyFromBrief(brief, /** @type {any} */ ("es"));

  assert.match(fallback.title, /^10 jours à /);
  assert.ok(fallback.steps.every((step) => step.title.length > 0));
});

test("comprend une phrase écrite en anglais", () => {
  const { brief, understood } = classifyIntent(
    "I am coming from France for 10 days for dental work and to rest",
    "en",
  );

  assert.equal(brief.durationDays, 10);
  assert.equal(brief.origin, "etranger");
  assert.ok(brief.goals.includes("dentaire"), "objectif dentaire non détecté en anglais");
  assert.ok(brief.flags.needsProfessionalOpinion);
  assert.ok(
    understood.every((line) => !/\b(?:objectif|durée|séjour|arrivée)\b/i.test(line)),
    `« ce que nous avons compris » reste en français : ${understood.join(" | ")}`,
  );
});

test("lit la durée et le nombre de voyageurs en anglais", () => {
  assert.equal(classifyIntent("A week in Oran with my wife", "en").brief.durationDays, 7);
  assert.equal(classifyIntent("A week in Oran with my wife", "en").brief.travellers, 2);
  assert.equal(classifyIntent("Coming from London for a fortnight", "en").brief.durationDays, 14);
  assert.equal(classifyIntent("Ten days in Bejaia to train", "en").brief.durationDays, 10);
  assert.equal(classifyIntent("Two weeks with my family, tight budget", "en").brief.travellers, 3);
  assert.equal(classifyIntent("Two weeks with my family, tight budget", "en").brief.budgetTier, 1);
});

test("un nom de ville ne se reconnaît qu'entier", () => {
  // « Algérie » contient « Alger » : la destination ne doit pas s'en déduire.
  assert.equal(classifyIntent("Je viens en Algérie pour un bilan").brief.destinationSlug, null);
  assert.equal(classifyIntent("I am coming to Algeria for a check-up", "en").brief.destinationSlug, null);

  // Mais la ville nommée, elle, est bien retenue — exonyme compris.
  assert.equal(classifyIntent("Une semaine à Alger").brief.destinationSlug, "alger");
  assert.equal(classifyIntent("A week in Algiers", "en").brief.destinationSlug, "alger");
});

test("« cure thermale » ne déclenche pas d'acte médical", () => {
  // « thermale » contient « mal » : sans borne de mot, l'objectif « me soigner »
  // se déclenchait et le parcours se chargeait de rendez-vous non demandés.
  const { brief } = classifyIntent(
    "Je viens pour 10 jours faire une cure thermale et me remettre en forme.",
  );

  assert.ok(brief.goals.includes("thermalisme"), "objectif thermalisme non détecté");
  assert.ok(brief.goals.includes("forme"), "objectif remise en forme non détecté");
  assert.ok(!brief.goals.includes("soins"), `objectif médical déduit à tort : ${brief.goals}`);
  assert.ok(!brief.flags.needsProfessionalOpinion);

  const plan = buildJourneyFromBrief(brief);
  const actes = plan.steps.filter((s) => s.kind === "soin" || s.kind === "examen");
  assert.equal(actes.length, 0, `actes non demandés : ${actes.map((s) => s.title)}`);
});

test("un terme court ne se déclenche pas à l'intérieur d'un mot", () => {
  // Les flexions restent admises, les collisions non.
  assert.ok(classifyIntent("je veux soigner mes dents").brief.goals.includes("dentaire"));
  assert.ok(classifyIntent("j'ai mal au dos").brief.goals.includes("soins"));
  assert.ok(
    !classifyIntent("relire mon dossier").brief.goals.includes("soins"),
    "« dossier » ne doit pas déclencher « dos »",
  );
});

test("le séjour de remise en forme se termine par son plan de suite", () => {
  // C'est le livrable du séjour : le programme écrit à poursuivre au retour.
  const { brief } = classifyIntent("Dix jours pour me remettre en forme et faire une cure thermale.");
  const plan = buildJourneyFromBrief(brief);

  // La rampe se reconnaît à ses libellés : une destination sans centre de
  // remise en forme au catalogue produit des séances sans établissement, et
  // c est volontaire — aucun établissement n est inventé pour combler un vide.
  const seances = plan.steps.filter(
    (s) => s.kind === "activite" && /(évaluation|séance)/i.test(s.title),
  );
  assert.ok(seances.length >= 4, `rampe trop courte : ${seances.length} séances`);

  const derniere = seances[seances.length - 1];
  assert.match(derniere.title, /bilan/i, `dernière séance inattendue : ${derniere.title}`);
  assert.ok(derniere.day < brief.durationDays, "le bilan doit précéder le jour du départ");
});
