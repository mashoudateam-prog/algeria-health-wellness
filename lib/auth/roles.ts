import type { Account, Role } from "./accounts";

/**
 * Qui a le droit de quoi.
 *
 * Politique pure : aucune dépendance au transport, ni aux cookies, ni à Next.
 * C'est ce qui la rend testable directement — et c'est elle qui décide, donc
 * elle doit l'être.
 *
 * Les rôles forment une échelle : un admin peut ce que peut un modérateur, un
 * modérateur ce que peut un partenaire. L'échelle est écrite une fois ici
 * plutôt que devinée à chaque contrôle.
 */

const RANG: Record<Role, number> = {
  visiteur: 0,
  partenaire: 1,
  moderateur: 2,
  admin: 3,
};

export function hasRole(account: Account | null, minimum: Role): boolean {
  if (!account) return false;
  return RANG[account.role] >= RANG[minimum];
}

/** Ce à quoi chaque rôle donne accès, pour l'afficher sans le recalculer. */
export const CAPACITES: Record<Role, string[]> = {
  visiteur: ["parcours", "espace personnel", "documents"],
  partenaire: ["parcours", "espace personnel", "documents", "fiches de son établissement"],
  moderateur: [
    "parcours",
    "espace personnel",
    "documents",
    "fiches de son établissement",
    "modération du fil",
  ],
  admin: [
    "parcours",
    "espace personnel",
    "documents",
    "fiches de son établissement",
    "modération du fil",
    "gestion des comptes et des rôles",
  ],
};
