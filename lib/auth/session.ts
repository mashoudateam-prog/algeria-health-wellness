import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { accounts, type Account, type Role } from "@/lib/auth/accounts";
import { hasRole } from "@/lib/auth/roles";
import { databaseConfigured, query } from "@/lib/db/client";

export { hasRole } from "@/lib/auth/roles";

/**
 * Sessions.
 *
 * Le jeton part dans un cookie `httpOnly` : aucun script de la page ne peut le
 * lire, donc une faille d'injection ne le vole pas. En base, on ne garde que
 * son empreinte SHA-256 — un accès en lecture à la table ne permet pas de se
 * faire passer pour quelqu'un.
 *
 * Pas de JWT : un jeton opaque se révoque en supprimant une ligne, là où un
 * JWT reste valide jusqu'à son expiration quoi qu'on fasse.
 */

const COOKIE = "ahw_session";
const DUREE_JOURS = 30;

function empreinte(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

interface Enregistrement {
  accountId: string;
  expiresAt: number;
}

/** Sessions en mémoire, quand aucune base n'est configurée. */
const globalForSessions = globalThis as unknown as { __sessions?: Map<string, Enregistrement> };
const memoire: Map<string, Enregistrement> =
  globalForSessions.__sessions ?? new Map<string, Enregistrement>();
if (process.env.NODE_ENV !== "production") globalForSessions.__sessions = memoire;

async function enregistrer(hash: string, accountId: string, expiresAt: Date): Promise<void> {
  if (databaseConfigured()) {
    await query(
      `INSERT INTO sessions (token_hash, account_id, expires_at) VALUES ($1, $2, $3)`,
      [hash, accountId, expiresAt.toISOString()],
    );
    return;
  }
  memoire.set(hash, { accountId, expiresAt: expiresAt.getTime() });
}

async function lire(hash: string): Promise<string | null> {
  if (databaseConfigured()) {
    const lignes = await query<{ account_id: string }>(
      `SELECT account_id FROM sessions WHERE token_hash = $1 AND expires_at > NOW()`,
      [hash],
    );
    return lignes[0]?.account_id ?? null;
  }
  const entree = memoire.get(hash);
  if (!entree) return null;
  if (entree.expiresAt <= Date.now()) {
    memoire.delete(hash);
    return null;
  }
  return entree.accountId;
}

async function supprimer(hash: string): Promise<void> {
  if (databaseConfigured()) {
    await query(`DELETE FROM sessions WHERE token_hash = $1`, [hash]);
    return;
  }
  memoire.delete(hash);
}

/* ------------------------------------------------------------------ */

/** Ouvre une session et pose le cookie. */
export async function openSession(accountId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + DUREE_JOURS * 86_400_000);

  await enregistrer(empreinte(token), accountId, expiresAt);

  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

/** Ferme la session courante, côté cookie et côté entrepôt. */
export async function closeSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) await supprimer(empreinte(token));
  store.delete(COOKIE);
}

/** Le compte connecté, ou `null`. Ne lève jamais : une session invalide vaut absence. */
export async function currentAccount(): Promise<Account | null> {
  try {
    const store = await cookies();
    const token = store.get(COOKIE)?.value;
    if (!token) return null;

    const accountId = await lire(empreinte(token));
    if (!accountId) return null;

    return await accounts.byId(accountId);
  } catch {
    return null;
  }
}

/** Le compte connecté s'il atteint le rôle demandé, sinon `null`. */
export async function requireRole(minimum: Role): Promise<Account | null> {
  const account = await currentAccount();
  return hasRole(account, minimum) ? account : null;
}
