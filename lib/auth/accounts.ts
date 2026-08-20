import { randomBytes, randomUUID, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { databaseConfigured, query } from "@/lib/db/client";

/**
 * Comptes et rôles.
 *
 * Quatre rôles seulement, et ils décrivent ce qu'une personne fait sur la
 * plateforme, pas un niveau de privilège abstrait. Un partenaire n'est pas un
 * « admin moins quelque chose » : il gère ses fiches, rien d'autre.
 *
 * Le mot de passe n'est jamais stocké. Il est dérivé par scrypt — coûteux à
 * calculer, donc coûteux à attaquer en masse — avec un sel par compte, et
 * comparé à temps constant.
 *
 * Sans base configurée, les comptes vivent en mémoire du processus, comme le
 * reste : la démonstration fonctionne, et rien ne survit à un redémarrage.
 */

export const ROLES = ["visiteur", "partenaire", "moderateur", "admin"] as const;
export type Role = (typeof ROLES)[number];

export interface Account {
  id: string;
  email: string;
  displayName: string;
  role: Role;
}

interface Stored extends Account {
  emailKey: string;
  passwordHash: string;
}

const derive = promisify(scrypt) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;

/** Deux adresses qui ne diffèrent que par la casse désignent la même personne. */
export function emailKey(email: string): string {
  return email.trim().toLowerCase();
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const key = await derive(password, salt, KEY_LENGTH);
  return `scrypt$${salt}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algo, salt, expected] = stored.split("$");
  if (algo !== "scrypt" || !salt || !expected) return false;

  const key = await derive(password, salt, KEY_LENGTH);
  const attendu = Buffer.from(expected, "hex");
  // Longueurs différentes : timingSafeEqual lèverait plutôt que de répondre.
  if (attendu.length !== key.length) return false;
  return timingSafeEqual(key, attendu);
}

/* ------------------------------------------------------------------ */
/* Entrepôt                                                            */
/* ------------------------------------------------------------------ */

export interface AccountStore {
  create(input: {
    email: string;
    password: string;
    displayName: string;
    role: Role;
  }): Promise<Account>;
  byEmail(email: string): Promise<Stored | null>;
  byId(id: string): Promise<Account | null>;
  setRole(id: string, role: Role): Promise<Account | null>;
  count(): Promise<number>;
}

class MemoryAccounts implements AccountStore {
  private rows: Stored[] = [];

  async create({ email, password, displayName, role }: {
    email: string;
    password: string;
    displayName: string;
    role: Role;
  }): Promise<Account> {
    const key = emailKey(email);
    if (this.rows.some((row) => row.emailKey === key)) {
      throw new AccountExists();
    }
    const row: Stored = {
      id: randomUUID(),
      email: email.trim(),
      emailKey: key,
      displayName: displayName.trim(),
      role,
      passwordHash: await hashPassword(password),
    };
    this.rows.push(row);
    return publique(row);
  }

  async byEmail(email: string): Promise<Stored | null> {
    return this.rows.find((row) => row.emailKey === emailKey(email)) ?? null;
  }

  async byId(id: string): Promise<Account | null> {
    const row = this.rows.find((entry) => entry.id === id);
    return row ? publique(row) : null;
  }

  async setRole(id: string, role: Role): Promise<Account | null> {
    const row = this.rows.find((entry) => entry.id === id);
    if (!row) return null;
    row.role = role;
    return publique(row);
  }

  async count(): Promise<number> {
    return this.rows.length;
  }
}

interface Ligne extends Record<string, unknown> {
  id: string;
  email: string;
  email_key: string;
  display_name: string;
  role: string;
  password_hash: string;
}

class PostgresAccounts implements AccountStore {
  async create({ email, password, displayName, role }: {
    email: string;
    password: string;
    displayName: string;
    role: Role;
  }): Promise<Account> {
    const lignes = await query<Ligne>(
      `INSERT INTO accounts (id, email, email_key, display_name, role, password_hash)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email_key) DO NOTHING
       RETURNING id, email, email_key, display_name, role, password_hash`,
      [
        randomUUID(),
        email.trim(),
        emailKey(email),
        displayName.trim(),
        role,
        await hashPassword(password),
      ],
    );

    // Aucune ligne renvoyée : l'index unique a joué, l'adresse existe déjà.
    if (!lignes[0]) throw new AccountExists();
    return publique(versStored(lignes[0]));
  }

  async byEmail(email: string): Promise<Stored | null> {
    const lignes = await query<Ligne>(
      `SELECT id, email, email_key, display_name, role, password_hash
       FROM accounts WHERE email_key = $1`,
      [emailKey(email)],
    );
    return lignes[0] ? versStored(lignes[0]) : null;
  }

  async byId(id: string): Promise<Account | null> {
    const lignes = await query<Ligne>(
      `SELECT id, email, email_key, display_name, role, password_hash
       FROM accounts WHERE id = $1`,
      [id],
    );
    return lignes[0] ? publique(versStored(lignes[0])) : null;
  }

  async setRole(id: string, role: Role): Promise<Account | null> {
    const lignes = await query<Ligne>(
      `UPDATE accounts SET role = $2 WHERE id = $1
       RETURNING id, email, email_key, display_name, role, password_hash`,
      [id, role],
    );
    return lignes[0] ? publique(versStored(lignes[0])) : null;
  }

  async count(): Promise<number> {
    const lignes = await query<{ n: number }>(`SELECT count(*)::int AS n FROM accounts`);
    return lignes[0]?.n ?? 0;
  }
}

/** L'adresse existe déjà. Erreur nommée : la route n'a pas à lire un message. */
export class AccountExists extends Error {
  constructor() {
    super("accountExists");
    this.name = "AccountExists";
  }
}

function versStored(ligne: Ligne): Stored {
  return {
    id: ligne.id,
    email: ligne.email,
    emailKey: ligne.email_key,
    displayName: ligne.display_name,
    role: ligne.role as Role,
    passwordHash: ligne.password_hash,
  };
}

/** Ce qui peut sortir du module : jamais l'empreinte du mot de passe. */
function publique(row: Stored): Account {
  return { id: row.id, email: row.email, displayName: row.displayName, role: row.role };
}

const globalForAccounts = globalThis as unknown as { __accounts?: AccountStore };

function createStore(): AccountStore {
  return databaseConfigured() ? new PostgresAccounts() : new MemoryAccounts();
}

export const accounts: AccountStore = globalForAccounts.__accounts ?? createStore();
if (process.env.NODE_ENV !== "production") globalForAccounts.__accounts = accounts;

/** Remet l'entrepôt à zéro. Réservé aux tests. */
export function resetAccounts(): void {
  globalForAccounts.__accounts = createStore();
}
