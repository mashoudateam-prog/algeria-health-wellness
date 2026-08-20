import assert from "node:assert/strict";
import { test } from "node:test";
import { LOCALES, DEFAULT_LOCALE } from "@/lib/i18n/config";
import { ar } from "@/lib/i18n/dictionaries/ar";
import { en } from "@/lib/i18n/dictionaries/en";
import { fr } from "@/lib/i18n/dictionaries/fr";
import { PLANNER_TEXT } from "@/lib/ai/text";
import { NOTICES } from "@/lib/ai/guardrails";

/**
 * Contrôles mécaniques sur toutes les langues.
 *
 * Le typage garantit déjà qu'aucune clé ne manque. Ce qu'il ne voit pas, et
 * que ces tests attrapent : une chaîne laissée vide, un marqueur `{count}`
 * perdu à la traduction, une fonction qui oublie son paramètre. Autant de
 * fautes qui ne cassent rien à la compilation et se découvrent en production.
 *
 * Six langues restent à intégrer : ce filet existe pour elles.
 */

// Les dictionnaires sont importés directement : passer par le module serveur
// ferait entrer next/headers, qui n'existe pas hors d'une requête.
const DICTIONNAIRES = { fr, en, ar };
const dictionaryFor = (locale) => DICTIONNAIRES[locale];

const source = dictionaryFor(DEFAULT_LOCALE);
const autres = LOCALES.filter((locale) => locale !== DEFAULT_LOCALE);

/** Parcourt deux dictionnaires en parallèle et rapporte les écarts. */
function inspecter(traduit, reference, chemin, anomalies) {
  for (const cle of Object.keys(reference)) {
    const voie = chemin ? `${chemin}.${cle}` : cle;
    const attendu = reference[cle];
    const obtenu = traduit?.[cle];

    if (typeof attendu === "function") {
      if (typeof obtenu !== "function") {
        anomalies.push(`${voie} : fonction absente`);
        continue;
      }
      // Sondes reconnaissables : ce qui entre doit ressortir.
      const sondes = Array.from({ length: attendu.length }, (_, i) => (i === 0 ? "SONDE" : 7));
      let rendu;
      try {
        rendu = String(obtenu(...sondes));
      } catch (erreur) {
        anomalies.push(`${voie} : la fonction lève « ${erreur.message} »`);
        continue;
      }
      const modele = String(attendu(...sondes));
      for (const sonde of sondes) {
        if (modele.includes(String(sonde)) && !rendu.includes(String(sonde))) {
          anomalies.push(`${voie} : le paramètre « ${sonde} » disparaît du rendu`);
        }
      }
      continue;
    }

    if (Array.isArray(attendu)) {
      if (!Array.isArray(obtenu)) {
        anomalies.push(`${voie} : tableau absent`);
        continue;
      }
      if (obtenu.length !== attendu.length) {
        anomalies.push(`${voie} : ${obtenu.length} entrées contre ${attendu.length}`);
      }
      obtenu.forEach((entree, index) => {
        if (entree && typeof entree === "object") {
          inspecter(entree, attendu[index] ?? {}, `${voie}[${index}]`, anomalies);
        } else {
          verifier(entree, attendu[index], `${voie}[${index}]`, anomalies);
        }
      });
      continue;
    }

    if (attendu && typeof attendu === "object") {
      inspecter(obtenu ?? {}, attendu, voie, anomalies);
      continue;
    }

    verifier(obtenu, attendu, voie, anomalies);
  }
}

function verifier(obtenu, attendu, voie, anomalies) {
  if (typeof attendu !== "string") return;

  if (typeof obtenu !== "string") {
    anomalies.push(`${voie} : chaîne absente`);
    return;
  }
  // Le français a des chaînes volontairement vides ; la traduction peut les
  // suivre, mais elle ne doit pas vider ce qui portait du texte.
  if (attendu.trim().length > 0 && obtenu.trim().length === 0) {
    anomalies.push(`${voie} : chaîne vide`);
    return;
  }

  for (const marqueur of attendu.match(/\{\w+\}/g) ?? []) {
    if (!obtenu.includes(marqueur)) anomalies.push(`${voie} : marqueur ${marqueur} perdu`);
  }
}

test("chaque langue traduit tout ce que le français porte", () => {
  for (const locale of autres) {
    const anomalies = [];
    inspecter(dictionaryFor(locale), source, "", anomalies);
    assert.deepEqual(anomalies, [], `dictionnaire « ${locale} » :\n  ${anomalies.join("\n  ")}`);
  }
});

test("le moteur de parcours produit dans chaque langue déclarée", () => {
  // Une langue peut n'avoir que l'interface traduite : c'est le repli prévu.
  // Mais si elle a un texte de moteur, il doit être complet.
  const reference = PLANNER_TEXT[DEFAULT_LOCALE];
  assert.ok(reference, "le français doit toujours être présent");

  for (const locale of autres) {
    const traduit = PLANNER_TEXT[locale];
    if (!traduit) continue;

    const anomalies = [];
    inspecter(traduit, reference, "", anomalies);
    assert.deepEqual(anomalies, [], `moteur « ${locale} » :\n  ${anomalies.join("\n  ")}`);
  }
});

test("les mentions réglementaires existent dans chaque langue", () => {
  // Ce sont les phrases qui portent la responsabilité : aucune langue
  // déclarée ne peut s'en passer, et aucune ne peut les laisser vides.
  for (const locale of LOCALES) {
    const notices = NOTICES[locale];
    assert.ok(notices, `mentions absentes pour « ${locale} »`);

    for (const champ of ["medical", "professional", "quote", "urgency"]) {
      assert.ok(
        typeof notices[champ] === "string" && notices[champ].trim().length > 20,
        `mention « ${champ} » vide ou trop courte en « ${locale} »`,
      );
    }

    // Le renvoi vers les secours doit citer les deux numéros, partout.
    assert.match(notices.urgency, /14/, `numéro de la Protection civile absent en « ${locale} »`);
    assert.match(notices.urgency, /115/, `numéro du SAMU absent en « ${locale} »`);
  }
});
