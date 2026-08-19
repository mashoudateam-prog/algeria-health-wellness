import { timingSafeEqual } from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Accès aux points d'entrée d'administration.
 *
 * Un jeton partagé, en attendant une vraie authentification. C'est modeste,
 * et c'est écrit ici pour que personne ne s'y trompe : ce n'est PAS un
 * substitut à l'authentification et au contrôle de rôles à construire.
 *
 * Deux garanties tout de même : comparaison à temps constant, et refus par
 * défaut en production quand aucun jeton n'est configuré. Un secret absent ne
 * doit jamais se traduire par une porte ouverte.
 */

export type AuthOutcome = { ok: true } | { ok: false; reason: string; status: number };

export function authorizeAdmin(request: NextRequest): AuthOutcome {
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
export function authorizeCron(request: NextRequest): AuthOutcome {
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const header = request.headers.get("authorization") ?? "";
    if (constantTimeEquals(header, `Bearer ${cronSecret}`)) return { ok: true };
  }
  return authorizeAdmin(request);
}
