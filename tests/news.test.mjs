import assert from "node:assert/strict";
import { test } from "node:test";
import {
  classify,
  detectEventDates,
  detectWilaya,
  evaluateGates,
  isExcluded,
  scoreRelevance,
} from "@/lib/news/pipeline";

const item = (title, text = "", url = "https://exemple.dz/a") => ({
  title,
  text,
  url,
  sourceName: "Test",
  origin: "rss",
});

const emptyContext = () => ({ seenUrls: new Set(), seenTitles: new Set() });

/**
 * Le premier test couvre un défaut trouvé lors de la toute première collecte
 * réelle : un article sur des migrants arrivant en Espagne avait été proposé,
 * parce que « E-spa-gne » contient « spa ».
 */
test("un terme ne se déclenche pas au milieu d'un mot", () => {
  assert.equal(scoreRelevance(item("Des migrants ont atteint l'Espagne continentale")).score, 0);
  assert.equal(scoreRelevance(item("Le procureur a requis une peine")).score, 0);
  assert.equal(scoreRelevance(item("Un spectacle à guichets fermés")).score, 0);
});

test("le terme se déclenche bien en début de mot, flexions comprises", () => {
  assert.ok(scoreRelevance(item("Ouverture des cures thermales")).score > 0);
  assert.ok(scoreRelevance(item("Les établissements thermaux rouvrent")).score > 0);
  assert.ok(scoreRelevance(item("Un rendez-vous gastronomique à Alger")).score > 0);
  assert.ok(scoreRelevance(item("Nouveau spa sur la corniche")).score > 0);
});

test("le titre pèse plus lourd que le corps du texte", () => {
  const dansLeTitre = scoreRelevance(item("Cure thermale à Guelma")).score;
  const dansLeCorps = scoreRelevance(item("Actualité régionale", "Une cure thermale a débuté")).score;
  assert.ok(dansLeTitre > dansLeCorps, "un terme dans le titre doit compter double");
});

test("les sujets hors périmètre sont écartés quel que soit le score", () => {
  assert.equal(isExcluded(item("Le match de football reporté")), "football");
  assert.equal(isExcluded(item("Cure thermale à Guelma")), null);

  const gate = evaluateGates(
    item("Le club soigne sa santé financière avant le match"),
    emptyContext(),
  );
  assert.equal(gate.accepted, false);
  assert.ok(gate.reasons.some((reason) => reason.includes("hors périmètre")));
});

test("une source non vérifiable est refusée", () => {
  const gate = evaluateGates(
    { ...item("Ouverture d'un centre de thalassothérapie"), url: "" },
    emptyContext(),
  );
  assert.equal(gate.accepted, false);
  assert.ok(gate.reasons.includes("aucune source vérifiable"));
});

test("un élément pertinent et sourcé est accepté", () => {
  const gate = evaluateGates(
    item("Ouverture d'un centre de thalassothérapie à Oran", "Bassins d'eau de mer chauffée."),
    emptyContext(),
  );
  assert.equal(gate.accepted, true, gate.reasons.join(" · "));
});

test("les doublons sont écartés, par URL comme par titre", () => {
  const context = emptyContext();
  const entry = item("Ouverture d'un centre de thalassothérapie à Oran");

  assert.equal(evaluateGates(entry, context).accepted, true);

  context.seenUrls.add("https://exemple.dz/a");
  assert.ok(evaluateGates(entry, context).reasons.includes("déjà collecté"));
});

test("la catégorie est déduite du vocabulaire", () => {
  assert.equal(classify(item("Ouverture des cures thermales de Guelma")), "cure");
  assert.equal(classify(item("Festival de la datte à Tolga")), "festival");
  assert.equal(classify(item("Inauguration d'un nouveau centre à Oran")), "ouverture");
});

test("la wilaya est reconnue quand elle est nommée", () => {
  assert.equal(detectWilaya(item("Cure thermale à Guelma cette semaine")).code, "24");
  assert.equal(detectWilaya(item("Un événement quelque part")).code, null);
});

test("les dates françaises sont lues, et rien n'est deviné", () => {
  const reference = new Date("2026-08-19T00:00:00Z");

  const range = detectEventDates(item("Festival du 6 au 8 novembre"), reference);
  assert.equal(range.startsOn, "2026-11-06");
  assert.equal(range.endsOn, "2026-11-08");

  const single = detectEventDates(item("Rendez-vous le 24 septembre"), reference);
  assert.equal(single.startsOn, "2026-09-24");
  assert.equal(single.endsOn, null);

  // Aucune date lisible : on retourne null plutôt que d'inventer.
  assert.equal(detectEventDates(item("Un événement prochainement"), reference).startsOn, null);
});
