import type { NextRequest } from "next/server";
import type { ApiErrors } from "./errors";

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

/**
 * Erreur de validation portant un code, pas une phrase.
 *
 * Le garde ne connaît pas la langue de l'appelant — il est appelé avant même
 * que le corps de la requête soit lu. Il décrit donc ce qui ne va pas, et la
 * route rend la phrase dans la langue du visiteur.
 */
export type ValidationCode =
  | "fieldMissing"
  | "fieldInvalid"
  | "fieldTooShort"
  | "fieldTooLong"
  | "valueNotAllowed"
  | "unreadableBody"
  | "goalOrProjectRequired"
  | "linkScheme"
  | "unknownWilaya"
  | "unknownCategory"
  | "badDateFormat"
  | "duplicateLink"
  | "unknownDecision";

export class ValidationError extends Error {
  constructor(
    readonly code: ValidationCode,
    readonly field = "",
  ) {
    super(`${code}:${field}`);
    this.name = "ValidationError";
  }
}

/** Rend une erreur de validation dans la langue de l'appelant. */
export function validationMessage(error: ValidationError, errors: ApiErrors): string {
  switch (error.code) {
    case "fieldMissing":
      return errors.fieldMissing(error.field);
    case "fieldInvalid":
      return errors.fieldInvalid(error.field);
    case "fieldTooShort":
      return errors.fieldTooShort(error.field);
    case "fieldTooLong":
      return errors.fieldTooLong(error.field);
    case "valueNotAllowed":
      return errors.valueNotAllowed(error.field);
    case "unreadableBody":
      return errors.unreadableBody;
    case "goalOrProjectRequired":
      return errors.goalOrProjectRequired;
    case "linkScheme":
      return errors.linkScheme;
    case "unknownWilaya":
      return errors.unknownWilaya;
    case "unknownCategory":
      return errors.unknownCategory;
    case "badDateFormat":
      return errors.badDateFormat;
    case "duplicateLink":
      return errors.duplicateLink;
    case "unknownDecision":
      return errors.unknownDecision;
  }
}

/** Chaîne bornée. Rejette tout ce qui n'est pas une chaîne, y compris `null`. */
export function readString(
  value: unknown,
  field: string,
  { min = 0, max = 1_000, required = true }: { min?: number; max?: number; required?: boolean } = {},
): string {
  if (value === undefined || value === null) {
    if (required) throw new ValidationError("fieldMissing", field);
    return "";
  }
  if (typeof value !== "string") throw new ValidationError("fieldInvalid", field);

  const trimmed = value.trim();
  if (trimmed.length < min) throw new ValidationError("fieldTooShort", field);
  if (trimmed.length > max) throw new ValidationError("fieldTooLong", field);
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
  if (!Array.isArray(value)) throw new ValidationError("fieldInvalid", field);
  if (value.length > maxItems) throw new ValidationError("fieldTooLong", field);

  const set = new Set<string>(allowed);
  const result: T[] = [];
  for (const entry of value) {
    if (typeof entry !== "string" || !set.has(entry)) {
      throw new ValidationError("valueNotAllowed", field);
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
  if (!Number.isFinite(parsed)) throw new ValidationError("fieldInvalid", field);
  return Math.min(max, Math.max(min, Math.round(parsed)));
}

/** Corps JSON borné : refuse une charge utile démesurée avant de la parser. */
export async function readJsonBody(request: NextRequest, maxBytes = 32_000): Promise<unknown> {
  const declared = request.headers.get("content-length");
  if (declared && Number(declared) > maxBytes) {
    throw new ValidationError("fieldTooLong", "body");
  }

  const raw = await request.text();
  if (raw.length > maxBytes) throw new ValidationError("fieldTooLong", "body");

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new ValidationError("unreadableBody");
  }
}
