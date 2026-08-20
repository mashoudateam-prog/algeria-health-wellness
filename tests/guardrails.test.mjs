import assert from "node:assert/strict";
import { test } from "node:test";
import {
  MEDICAL_DISCLAIMER,
  detectUrgency,
  enforceGuardrails,
  normalize,
} from "@/lib/ai/guardrails";

/**
 * Les garde-fous sont la contrainte la plus dure du produit : ils doivent tenir
 * même si un modèle de langage produit une sortie non conforme. On teste donc
 * le filtre de SORTIE, pas la consigne d'entrée.
 */

test("normalise en minuscules sans diacritiques", () => {
  assert.equal(normalize("Récupération à Béjaïa"), "recuperation a bejaia");
  assert.equal(normalize("L’été"), "l'ete");
});

test("bloque un diagnostic posé", () => {
  const report = enforceGuardrails("Vous souffrez d'une infection. Reposez-vous bien.");
  assert.equal(report.safe, false);
  assert.ok(report.violations.includes("diagnostic posé"));
  assert.ok(!report.text.includes("Vous souffrez"));
  // Le reste de la réponse survit : on retire le passage, pas le message.
  assert.ok(report.text.includes("Reposez-vous bien."));
});

test("bloque une prescription et une posologie", () => {
  assert.equal(enforceGuardrails("Je vous prescris un antibiotique.").safe, false);
  assert.equal(enforceGuardrails("Prenez 500 mg matin et soir.").safe, false);
});

test("bloque une promesse de résultat", () => {
  assert.equal(enforceGuardrails("Ce séjour guérit votre douleur.").safe, false);
  assert.equal(enforceGuardrails("Résultat garanti après trois séances.").safe, false);
  assert.equal(enforceGuardrails("Cette intervention est sans risque.").safe, false);
});

test("bloque un prix présenté comme garanti", () => {
  const report = enforceGuardrails("Le prix garanti est de 40 000 DZD.");
  assert.equal(report.safe, false);
  assert.ok(report.violations.includes("prix présenté comme garanti"));
});

test("laisse passer une réponse d'organisation légitime", () => {
  const message =
    "Je peux organiser vos rendez-vous sur trois jours et réserver un hébergement proche de la clinique.";
  const report = enforceGuardrails(message);
  assert.equal(report.safe, true);
  assert.equal(report.text, message);
  assert.deepEqual(report.violations, []);
});

test("repère les formulations d'urgence", () => {
  for (const phrase of [
    "j'ai une douleur très forte à la poitrine",
    "c'est urgent",
    "je n'arrive plus à respirer",
  ]) {
    assert.equal(detectUrgency(phrase).detected, true, `non détecté : ${phrase}`);
  }

  assert.ok(detectUrgency("c'est urgent").message.includes("14"));
  assert.equal(detectUrgency("je voudrais organiser un séjour détente").detected, false);
});

test("le rappel réglementaire est disponible et non vide", () => {
  assert.ok(MEDICAL_DISCLAIMER.length > 20);
  assert.ok(MEDICAL_DISCLAIMER.includes("diagnostic"));
});

test("une promesse au pluriel est bloquée comme au singulier", () => {
  // Le sujet publicitaire est presque toujours pluriel — « nos cures »,
  // « nos eaux » — et la faille tenait à ce seul détail de conjugaison.
  const pluriels = [
    "Nos cures font disparaître vos douleurs.",
    "Nos eaux feront disparaître vos douleurs.",
    "Nos cures soignent votre arthrose.",
    "Nos bains traitent votre pathologie.",
    "Nos bains éliminent les toxines.",
    "Résultats garantis en dix jours.",
    "Prix garantis toute l'année.",
  ];

  for (const phrase of pluriels) {
    const rapport = enforceGuardrails(phrase);
    assert.equal(rapport.safe, false, `laissé passer : ${phrase}`);
  }
});

test("le démenti d'une promesse au pluriel reste publiable", () => {
  const dementis = [
    "Nos cures ne font disparaître aucune douleur.",
    "Nous n'affichons jamais de prix garantis.",
    "Nos bains n'éliminent pas les toxines : cette allégation n'a pas de fondement.",
  ];

  for (const phrase of dementis) {
    const rapport = enforceGuardrails(phrase);
    assert.equal(rapport.safe, true, `censuré à tort : ${phrase} (${rapport.violations})`);
  }
});
