import { NextResponse, type NextRequest } from "next/server";
import { AccountExists, accounts } from "@/lib/auth/accounts";
import { closeSession, currentAccount, openSession } from "@/lib/auth/session";
import { CAPACITES } from "@/lib/auth/roles";
import { apiErrors, requestLocale } from "@/lib/security/errors";
import {
  ValidationError,
  callerKey,
  rateLimit,
  readJsonBody,
  readString,
  validationMessage,
} from "@/lib/security/request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Inscription, connexion, déconnexion.
 *
 * Le débit est serré : cinq tentatives par minute et par appelant. C'est la
 * seule défense qui vaille contre l'essai systématique de mots de passe, la
 * comparaison à temps constant ne protégeant que du canal temporel.
 *
 * Un échec de connexion ne dit jamais lequel des deux champs est faux : le
 * dire reviendrait à confirmer qu'une adresse est inscrite.
 */

/** Le compte connecté et ce qu'il peut faire. */
export async function GET() {
  const account = await currentAccount();
  if (!account) return NextResponse.json({ account: null }, { headers: { "Cache-Control": "no-store" } });

  return NextResponse.json(
    { account, capacites: CAPACITES[account.role] },
    { headers: { "Cache-Control": "no-store" } },
  );
}

export async function POST(request: NextRequest) {
  const errors = apiErrors(requestLocale(request));

  const limit = rateLimit(callerKey(request, "compte"), { limit: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return NextResponse.json(
      { error: errors.tooManyRequests },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  try {
    const body = (await readJsonBody(request)) as Record<string, unknown>;
    const action = readString(body.action, "action", { min: 1, max: 20 });

    if (action === "deconnexion") {
      await closeSession();
      return NextResponse.json({ account: null });
    }

    const email = readString(body.email, "email", { min: 5, max: 200 });
    const password = readString(body.password, "password", { min: 10, max: 200 });

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      throw new ValidationError("fieldInvalid", "email");
    }

    if (action === "inscription") {
      const displayName = readString(body.displayName, "displayName", { min: 2, max: 80 });

      // Le premier compte créé administre : sans lui, personne ne pourrait
      // promouvoir qui que ce soit. Les suivants sont de simples visiteurs.
      const premier = (await accounts.count()) === 0;
      const account = await accounts.create({
        email,
        password,
        displayName,
        role: premier ? "admin" : "visiteur",
      });

      await openSession(account.id);
      return NextResponse.json({ account, capacites: CAPACITES[account.role] }, { status: 201 });
    }

    if (action === "connexion") {
      const { verifyPassword } = await import("@/lib/auth/accounts");
      const stored = await accounts.byEmail(email);

      // Vérification menée même sans compte, pour que la durée de la réponse
      // ne révèle pas si l'adresse est inscrite.
      const leurre = "scrypt$" + "0".repeat(32) + "$" + "0".repeat(128);
      const ok = await verifyPassword(password, stored?.passwordHash ?? leurre);

      if (!stored || !ok) {
        return NextResponse.json({ error: errors.badCredentials }, { status: 401 });
      }

      await openSession(stored.id);
      const account = {
        id: stored.id,
        email: stored.email,
        displayName: stored.displayName,
        role: stored.role,
      };
      return NextResponse.json({ account, capacites: CAPACITES[account.role] });
    }

    throw new ValidationError("valueNotAllowed", "action");
  } catch (error) {
    if (error instanceof AccountExists) {
      return NextResponse.json({ error: errors.accountExists }, { status: 409 });
    }
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: validationMessage(error, errors) }, { status: 400 });
    }
    console.error("[compte] échec", error);
    return NextResponse.json({ error: errors.accountFailed }, { status: 500 });
  }
}
