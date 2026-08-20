import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";
import type { Account } from "@/lib/auth/accounts";
import { requireRole } from "@/lib/auth/session";

/**
 * Accès aux points d'entrée d'administration.
 *
 * Deux chemins, dans cet ordre :
 *
 *   1. une session ouverte dont le rôle atteint « modérateur » — c'est la voie
 *      humaine, et celle qui trace qui a décidé quoi ;
 *   2. le jeton partagé, réservé à ce qui n'a pas de session : la tâche
 *      planifiée, un script d'exploitation.
 *
 * Le jeton reste comparé à temps constant, et son absence en production
 * continue de fermer la porte plutôt que de l'ouvrir.
 */

export type AuthOutcome =
  | { ok: true; account?: Account }
  | { ok: false; reason: string; status: number };

export async function authorizeAdmin(request: NextRequest): Promise<AuthOutcome> {
  // La session prime : elle dit qui agit, là où un jeton ne dit rien.
  const account = await requireRole("moderateur");
  if (account) return { ok: true, account };

  const expected = process.env.ADMIN_TOKEN;

  if (!expected) {
    if (process.env.NODE_ENV === "production") {
      return {
        ok: false,
        status: 503,
        reason: "Administration désactivée : aucun jeton ADMIN_TOKEN n'est configuré.",
      };
    }
    // En développement local, on laisse passer pour pouvoir travailler.
    return { ok: true };
  }

  const provided =
    request.headers.get("x-admin-token") ??
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ??
    "";

  if (!provided || !constantTimeEquals(provided, expected)) {
    return { ok: false, status: 401, reason: "Jeton d'administration invalide." };
  }

  return { ok: true };
}

/** Comparaison à temps constant, pour ne rien révéler par la durée. */
function constantTimeEquals(a: string, b: string): boolean {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/**
 * Vercel Cron signe ses appels avec `CRON_SECRET`. On accepte cette signature
 * en plus du jeton d'administration, pour que la collecte planifiée fonctionne
 * sans partager le jeton humain avec l'ordonnanceur.
 */
export async function authorizeCron(request: NextRequest): Promise<AuthOutcome> {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const header = request.headers.get("authorization") ?? "";
    if (constantTimeEquals(header, `Bearer ${cronSecret}`)) return { ok: true };
  }
  return authorizeAdmin(request);
}
