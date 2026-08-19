import { BadgeCheck, FileQuestion } from "lucide-react";
import type { Verification } from "@/types/domain";

/** Signale sans ambiguïté un contenu de démonstration. */
export function DemoBadge({ label = "Démo" }: { label?: string }) {
  return (
    <span className="badge badge-demo" title="Contenu de démonstration, sans valeur réelle">
      {label}
    </span>
  );
}

/**
 * Statut de vérification. Jamais de certification inventée : on affiche
 * uniquement ce qui a été contrôlé, et la date du contrôle.
 */
export function VerificationBadge({ verification }: { verification: Verification }) {
  if (verification.status === "verifie") {
    return (
      <span
        className="badge badge-verified"
        title={`Contrôlé le ${formatDate(verification.checkedAt)} — ${verification.checks.join(", ")}`}
      >
        <BadgeCheck size={13} />
        Vérifié
      </span>
    );
  }

  if (verification.status === "en-cours") {
    return (
      <span className="badge" title="Vérification en cours">
        Vérification en cours
      </span>
    );
  }

  return (
    <span className="badge" title="Informations déclarées par l'établissement, non contrôlées">
      <FileQuestion size={13} />
      Déclaratif
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow eyebrow-line">{children}</p>;
}

function formatDate(iso: string | null): string {
  if (!iso) return "date inconnue";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
