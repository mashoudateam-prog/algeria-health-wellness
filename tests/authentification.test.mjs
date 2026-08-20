import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { PGlite } from "@electric-sql/pglite";
import { useDriver } from "@/lib/db/client";
import { AccountExists, accounts, hashPassword, resetAccounts, verifyPassword } from "@/lib/auth/accounts";
import { CAPACITES, hasRole } from "@/lib/auth/roles";

/**
 * Comptes, mots de passe et rôles, exécutés contre un vrai PostgreSQL.
 *
 * Les sessions ne sont pas couvertes ici : elles lisent les cookies de Next,
 * qui n'existent pas hors d'une requête. La logique qu'elles portent — la
 * hiérarchie des rôles — est testée séparément, et c'est elle qui décide.
 */

let pglite;

before(async () => {
  pglite = await new PGlite();
  useDriver({
    query: async (text, values = []) => {
      const r = await pglite.query(text, values);
      return { rows: r.rows, rowCount: r.affectedRows ?? r.rows.length };
    },
    exec: (text) => pglite.exec(text),
  });
  resetAccounts();
});

after(async () => {
  useDriver(null);
  resetAccounts();
  await pglite?.close();
});

test("le mot de passe n'est jamais stocké en clair", async () => {
  const empreinte = await hashPassword("un mot de passe correct");

  assert.ok(!empreinte.includes("un mot de passe correct"), "le mot de passe apparaît dans l'empreinte");
  assert.match(empreinte, /^scrypt\$[0-9a-f]{32}\$[0-9a-f]{128}$/);

  // Deux empreintes du même mot de passe diffèrent : le sel fait son travail.
  const autre = await hashPassword("un mot de passe correct");
  assert.notEqual(empreinte, autre);
});

test("la vérification accepte le bon mot de passe et rejette le reste", async () => {
  const empreinte = await hashPassword("thermalisme2026");

  assert.equal(await verifyPassword("thermalisme2026", empreinte), true);
  assert.equal(await verifyPassword("thermalisme2027", empreinte), false);
  assert.equal(await verifyPassword("", empreinte), false);
  // Une empreinte tronquée ou d'un autre format ne doit pas faire lever.
  assert.equal(await verifyPassword("thermalisme2026", "scrypt$abc"), false);
  assert.equal(await verifyPassword("thermalisme2026", "n'importe quoi"), false);
});

test("un compte se crée et se retrouve par son adresse", async () => {
  const cree = await accounts.create({
    email: "Amina@Exemple.dz",
    password: "un-secret-suffisamment-long",
    displayName: "Amina B.",
    role: "moderateur",
  });

  assert.equal(cree.role, "moderateur");
  assert.equal(cree.displayName, "Amina B.");
  // Le compte public ne porte pas d'empreinte.
  assert.equal("passwordHash" in cree, false);

  // La casse de l'adresse ne crée pas deux personnes.
  const retrouve = await accounts.byEmail("amina@exemple.dz");
  assert.equal(retrouve?.id, cree.id);
  assert.equal(await verifyPassword("un-secret-suffisamment-long", retrouve.passwordHash), true);
});

test("la même adresse ne peut pas servir deux fois", async () => {
  await accounts.create({
    email: "unique@exemple.dz",
    password: "un-secret-suffisamment-long",
    displayName: "Premier",
    role: "partenaire",
  });

  await assert.rejects(
    () =>
      accounts.create({
        email: "UNIQUE@exemple.dz",
        password: "un-autre-secret-long",
        displayName: "Second",
        role: "admin",
      }),
    AccountExists,
    "une seconde inscription sur la même adresse a été acceptée",
  );
});

test("le rôle se change et se relit", async () => {
  const compte = await accounts.create({
    email: "promotion@exemple.dz",
    password: "un-secret-suffisamment-long",
    displayName: "À promouvoir",
    role: "visiteur",
  });

  const promu = await accounts.setRole(compte.id, "moderateur");
  assert.equal(promu?.role, "moderateur");

  const relu = await accounts.byId(compte.id);
  assert.equal(relu?.role, "moderateur");

  assert.equal(await accounts.setRole("compte-inexistant", "admin"), null);
});

test("la hiérarchie des rôles est une échelle", () => {
  const admin = { id: "1", email: "a@b.dz", displayName: "A", role: "admin" };
  const moderateur = { ...admin, role: "moderateur" };
  const partenaire = { ...admin, role: "partenaire" };
  const visiteur = { ...admin, role: "visiteur" };

  // Un rôle supérieur couvre les rôles inférieurs.
  assert.equal(hasRole(admin, "moderateur"), true);
  assert.equal(hasRole(admin, "admin"), true);
  assert.equal(hasRole(moderateur, "partenaire"), true);

  // L'inverse est faux, et c'est tout l'intérêt.
  assert.equal(hasRole(moderateur, "admin"), false);
  assert.equal(hasRole(partenaire, "moderateur"), false);
  assert.equal(hasRole(visiteur, "partenaire"), false);

  // Pas de compte : aucun droit, jamais.
  assert.equal(hasRole(null, "visiteur"), false);
  assert.equal(hasRole(null, "admin"), false);
});
