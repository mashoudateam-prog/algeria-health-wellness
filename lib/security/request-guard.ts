import type { NextRequest } from "next/server";

/**
 * Contrôles d'entrée communs aux routes API.
 *
 * Trois principes :
 *   1. rien n'est lu depuis le client sans validation de type ET de taille ;
 *   2. le débit est limité par identifiant d'appelant ;
 *   3. les messages d'erreur ne révèlent jamais l'état interne du système.
 *
 * ⚠️ Le compteur de débit vit en mémoire du processus : suffisant pour un
 * déploiement mono-instance et pour la démonstration, à remplacer par un
 * magasin partagé (Redis, Durable Object…) dès qu'il y a plusieurs instances.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Nombre de requêtes autorisées dans la fenêtre. */
  limit: number;
  /** Durée de la fenêtre, en millisecondes. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  bucket.count += 1;

  // Purge opportuniste : évite que la table grossisse indéfiniment.
  if (buckets.size > 5_000) {
    for (const [entryKey, entry] of buckets) {
      if (entry.resetAt <= now) buckets.delete(entryKey);
    }
  }

  if (bucket.count > limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  return { allowed: true, remaining: limit - bucket.count, retryAfterSeconds: 0 };
}

/**
 * Identifiant d'appelant. Les en-têtes de proxy sont déclaratifs et falsifiables :
 * ils suffisent à limiter un débit, jamais à autoriser un accès.
 */
export function callerKey(request: NextRequest, scope: string): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  return `${scope}:${ip}`;
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export class ValidationError extends Error {}

/** Chaîne bornée. Rejette tout ce qui n'est pas une chaîne, y compris `null`. */
export function readString(
  value: unknown,
  field: string,
  { min = 0, max = 1_000, required = true }: { min?: number; max?: number; required?: boolean } = {},
): string {
  if (value === undefined || value === null) {
    if (required) throw new ValidationError(`Champ « ${field} » manquant.`);
    return "";
  }
  if (typeof value !== "string") throw new ValidationError(`Champ « ${field} » invalide.`);

  const trimmed = value.trim();
  if (trimmed.length < min) throw new ValidationError(`Champ « ${field} » trop court.`);
  if (trimmed.length > max) throw new ValidationError(`Champ « ${field} » trop long.`);
  return trimmed;
}

/** Liste bornée de valeurs appartenant à un ensemble fermé. */
export function readEnumList<T extends string>(
  value: unknown,
  field: string,
  allowed: readonly T[],
  maxItems = 12,
): T[] {
  if (value === undefined || value === null) return [];
  if (!Array.isArray(value)) throw new ValidationError(`Champ « ${field} » invalide.`);
  if (value.length > maxItems) throw new ValidationError(`Champ « ${field} » trop long.`);

  const set = new Set<string>(allowed);
  const result: T[] = [];
  for (const entry of value) {
    if (typeof entry !== "string" || !set.has(entry)) {
      throw new ValidationError(`Valeur non reconnue dans « ${field} ».`);
    }
    if (!result.includes(entry as T)) result.push(entry as T);
  }
  return result;
}

export function readInteger(
  value: unknown,
  field: string,
  { min, max, fallback }: { min: number; max: number; fallback: number },
): number {
  if (value === undefined || value === null || value === "") return fallback;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(parsed)) throw new ValidationError(`Champ « ${field} » invalide.`);
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

/** Corps JSON borné : refuse une charge utile démesurée avant de la parser. */
export async function readJsonBody(request: NextRequest, maxBytes = 32_000): Promise<unknown> {
  const declared = request.headers.get("content-length");
  if (declared && Number(declared) > maxBytes) {
    throw new ValidationError("Charge utile trop volumineuse.");
  }

  const raw = await request.text();
  if (raw.length > maxBytes) throw new ValidationError("Charge utile trop volumineuse.");

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new ValidationError("Corps de requête illisible.");
  }
}
