import type { Pool, PoolClient } from "pg";

/**
 * Accès à la base, quand il y en a une.
 *
 * Règle du projet : sans configuration, la plateforme fonctionne. Le pilote
 * PostgreSQL n'est donc chargé qu'au premier appel, et seulement si
 * `DATABASE_URL` est renseignée — un déploiement de démonstration ne paie ni
 * le module, ni la connexion.
 *
 * Le choix de `pg` plutôt que d'un client lié à un hébergeur est délibéré :
 * la même base peut vivre chez un fournisseur international ou sur un serveur
 * algérien, sans changer une ligne.
 */

/**
 * Le strict minimum qu'un moteur doit savoir faire.
 *
 * Cette couture existe pour les tests : elle laisse y brancher un PostgreSQL
 * embarqué et exécuter le schéma et les requêtes pour de vrai, plutôt que de
 * livrer du SQL que personne n'a jamais fait tourner.
 */
export interface SqlDriver {
  query(text: string, values?: unknown[]): Promise<{ rows: unknown[]; rowCount: number | null }>;
  exec?(text: string): Promise<unknown>;
}

let pool: Pool | null = null;
let ready: Promise<void> | null = null;
let injected: SqlDriver | null = null;

/** Branche un moteur de test. Passer `null` rend la main à PostgreSQL. */
export function useDriver(driver: SqlDriver | null): void {
  injected = driver;
  ready = null;
}

export function databaseConfigured(): boolean {
  return Boolean(injected) || Boolean(process.env.DATABASE_URL);
}

async function getPool(): Promise<Pool> {
  if (pool) return pool;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL absente : aucune base configurée.");

  const { Pool: PgPool } = await import("pg");
  pool = new PgPool({
    connectionString: url,
    // Les hébergeurs managés imposent TLS mais présentent souvent un
    // certificat que la chaîne locale ne connaît pas.
    ssl: /\bsslmode=require\b/.test(url) ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 8_000,
  });

  return pool;
}

/**
 * Crée le schéma s'il manque, une seule fois par processus.
 *
 * Une migration par fichier serait plus propre pour un produit installé ;
 * ici le schéma est court, et `IF NOT EXISTS` suffit à rendre l'opération
 * rejouable sans risque.
 */
async function ensureSchema(): Promise<void> {
  if (ready) return ready;

  ready = (async () => {
    if (injected) {
      // PGlite refuse plusieurs instructions dans un query() : on passe par
      // exec() quand le moteur le propose, sinon instruction par instruction.
      if (injected.exec) await injected.exec(SCHEMA);
      else for (const ordre of decouper(SCHEMA)) await injected.query(ordre);
      return;
    }
    const client = await (await getPool()).connect();
    try {
      await client.query(SCHEMA);
    } finally {
      client.release();
    }
  })();

  try {
    await ready;
  } catch (error) {
    // Un échec ne doit pas figer la promesse : le prochain appel réessaiera.
    ready = null;
    throw error;
  }
}

/** Exécute une requête sur une base prête. */
export async function query<T extends Record<string, unknown>>(
  text: string,
  values: unknown[] = [],
): Promise<T[]> {
  await ensureSchema();
  if (injected) return (await injected.query(text, values)).rows as T[];
  const result = await (await getPool()).query(text, values);
  return result.rows as T[];
}

/** Découpe un script en instructions, en ignorant les lignes de commentaire. */
function decouper(script: string): string[] {
  return script
    .split(/\r?\n/)
    .filter((ligne) => !ligne.trimStart().startsWith("--"))
    .join("\n")
    .split(";")
    .map((ordre) => ordre.trim())
    .filter(Boolean);
}

/** Enchaîne plusieurs requêtes dans une transaction. */
export async function transaction<T>(work: (client: SqlDriver) => Promise<T>): Promise<T> {
  await ensureSchema();

  if (injected) {
    await injected.query("BEGIN");
    try {
      const result = await work(injected);
      await injected.query("COMMIT");
      return result;
    } catch (error) {
      await injected.query("ROLLBACK");
      throw error;
    }
  }

  const client = await (await getPool()).connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

const SCHEMA = `
CREATE TABLE IF NOT EXISTS news_items (
  id            TEXT PRIMARY KEY,
  title         TEXT NOT NULL,
  summary       TEXT NOT NULL,
  category      TEXT NOT NULL,
  status        TEXT NOT NULL,
  origin        TEXT NOT NULL,
  source_name   TEXT NOT NULL,
  source_url    TEXT NOT NULL,
  canonical_url TEXT NOT NULL,
  title_key     TEXT NOT NULL,
  location_label TEXT NOT NULL,
  wilaya_code   TEXT,
  starts_on     DATE,
  ends_on       DATE,
  relevance     INTEGER NOT NULL DEFAULT 0,
  notes         JSONB NOT NULL DEFAULT '[]'::jsonb,
  demo          BOOLEAN NOT NULL DEFAULT FALSE,
  collected_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Le dédoublonnage se joue sur ces deux colonnes : un index unique fait
-- respecter la règle par la base, pas seulement par le code applicatif.
CREATE UNIQUE INDEX IF NOT EXISTS news_items_canonical_url ON news_items (canonical_url);
CREATE UNIQUE INDEX IF NOT EXISTS news_items_title_key ON news_items (title_key);
CREATE INDEX IF NOT EXISTS news_items_status ON news_items (status, relevance DESC, collected_at DESC);

CREATE TABLE IF NOT EXISTS collection_runs (
  id         BIGSERIAL PRIMARY KEY,
  ran_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  payload    JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS accounts (
  id            TEXT PRIMARY KEY,
  email         TEXT NOT NULL,
  email_key     TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  role          TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at  TIMESTAMPTZ
);

CREATE UNIQUE INDEX IF NOT EXISTS accounts_email_key ON accounts (email_key);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS sessions_account ON sessions (account_id);
CREATE INDEX IF NOT EXISTS sessions_expiry ON sessions (expires_at);
`;
