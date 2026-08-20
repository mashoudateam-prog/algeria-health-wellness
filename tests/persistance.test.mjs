import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { useDriver } from "@/lib/db/client";
import { PostgresNewsStore } from "@/lib/news/store-postgres";

/**
 * L'entrepôt PostgreSQL, exécuté pour de vrai.
 *
 * PGlite est PostgreSQL compilé en WebAssembly : le schéma et les requêtes
 * passent par un vrai moteur, index uniques et transactions compris. Sans
 * cela, on livrerait du SQL que personne n'aurait jamais fait tourner.
 */

let pglite;
let store;

before(async () => {
  pglite = await new PGlite();
  useDriver({
    query: async (text, values = []) => {
      const r = await pglite.query(text, values);
      return { rows: r.rows, rowCount: r.affectedRows ?? r.rows.length };
    },
    exec: (text) => pglite.exec(text),
  });
  store = new PostgresNewsStore();
});

after(async () => {
  useDriver(null);
  await pglite?.close();
});

/**
 * Un élément distinct à chaque appel.
 *
 * Titre et URL sont uniques par défaut : les index de dédoublonnage sont
 * réels, et deux tests qui partageraient un titre verraient l'un préparer
 * silencieusement rien du tout. Une collision se demande explicitement.
 */
let compteur = 0;

function item(surcharge = {}) {
  compteur += 1;
  return {
    id: `item-${compteur}`,
    title: `Ouverture de la saison thermale nº${compteur}`,
    summary: "Les bassins rouvrent pour la saison fraîche.",
    category: "cure",
    status: "propose",
    origin: "rss",
    sourceName: "Presse",
    sourceUrl: `https://exemple.dz/saison-thermale-${compteur}`,
    locationLabel: "Guelma",
    wilayaCode: "24",
    startsOn: "2026-10-01",
    endsOn: null,
    relevance: 70,
    notes: [],
    demo: false,
    collectedAt: new Date().toISOString(),
    ...surcharge,
  };
}

test("le schéma se crée et un élément fait l'aller-retour", async () => {
  const { added } = await store.add([item({ id: "aller-retour" })]);
  assert.equal(added, 1);

  const [lu] = await store.list("propose");
  assert.equal(lu.id, "aller-retour");
  assert.equal(lu.category, "cure");
  assert.equal(lu.locationLabel, "Guelma");
  // Une date de calendrier ne doit pas se décaler d'un jour au passage.
  assert.equal(lu.startsOn, "2026-10-01");
  assert.deepEqual(lu.notes, []);
});

test("la base refuse le doublon, par URL comme par titre", async () => {
  const prepare = await store.add([
    item({ id: "origine", title: "Ouverture de la saison thermale nº2", sourceUrl: "https://exemple.dz/unique-1" }),
  ]);
  assert.equal(prepare.added, 1, "la préparation du test n'a rien inséré");

  // Même URL, identifiant et titre différents.
  const parUrl = await store.add([
    item({ id: "copie-url", sourceUrl: "https://exemple.dz/unique-1" }),
  ]);
  assert.equal(parUrl.added, 0, "un doublon d'URL a été inséré");
  assert.equal(parUrl.skipped, 1);

  // Même titre, URL différente.
  const parTitre = await store.add([
    item({ id: "copie-titre", title: "Ouverture de la saison thermale nº2", sourceUrl: "https://exemple.dz/unique-2" }),
  ]);
  assert.equal(parTitre.added, 0, "un doublon de titre a été inséré");
});

test("une décision de modération est écrite et relue", async () => {
  await store.add([item({ id: "a-moderer", sourceUrl: "https://exemple.dz/a-moderer" })]);

  const publie = await store.setStatus("a-moderer", "publie");
  assert.equal(publie?.status, "publie");

  const publies = await store.list("publie");
  assert.ok(publies.some((entry) => entry.id === "a-moderer"));

  const inconnu = await store.setStatus("nexiste-pas", "publie");
  assert.equal(inconnu, null);
});

test("un lot mêlant nouveautés et doublons est compté juste", async () => {
  const lot = [
    item({ id: "lot-1", title: "Festival de la datte", sourceUrl: "https://exemple.dz/lot-1" }),
    item({ id: "lot-2", title: "Salon du bien-être", sourceUrl: "https://exemple.dz/lot-2" }),
    item({ id: "lot-3", title: "Festival de la datte", sourceUrl: "https://exemple.dz/lot-3" }),
  ];

  const { added, skipped } = await store.add(lot);
  assert.equal(added, 2, "les deux titres distincts devaient entrer");
  assert.equal(skipped, 1, "le titre répété devait être écarté");
});

test("le compte rendu du dernier passage est conservé", async () => {
  await store.recordRun({
    at: "2026-08-20T06:00:00.000Z",
    sources: [{ label: "Presse", collected: 12 }],
    proposed: 3,
    rejected: 9,
    rejectionReasons: { "hors périmètre": 9 },
  });

  const dernier = await store.lastRun();
  assert.equal(dernier.proposed, 3);
  assert.equal(dernier.sources[0].label, "Presse");
  assert.equal(dernier.rejectionReasons["hors périmètre"], 9);
});

test("les index de dédoublonnage sont interrogeables", async () => {
  const urls = await store.knownUrls();
  const titres = await store.knownTitles();
  assert.ok(urls.size > 0);
  assert.ok(titres.size > 0);
  // Le titre est indexé normalisé : sans accents ni majuscules.
  assert.ok([...titres].every((t) => t === t.toLowerCase()));
});
