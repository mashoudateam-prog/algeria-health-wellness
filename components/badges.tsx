"use client";

import { BadgeCheck, FileQuestion } from "lucide-react";
import { useTranslation } from "@/components/i18n-provider";
import { LOCALE_TAG, type Locale } from "@/lib/i18n/config";
import { localizedTerms } from "@/lib/i18n/content";
import type { Verification } from "@/types/domain";

/**
 * Badges de statut.
 *
 * Composant client : le libellé s'affiche sur des pages serveur comme sur le
 * constructeur de parcours, et ces trois mots — vérifié, déclaratif, démo —
 * sont lus sur presque chaque fiche. Les faire dépendre d'une prop passée à la
 * main aurait garanti qu'on l'oublie quelque part.
 */

/** Signale sans ambiguïté un contenu de démonstration. */
export function DemoBadge({ label }: { label?: string }) {
  const { t } = useTranslation();
  return (
    <span className="badge badge-demo" title={t.badges.demoTitle}>
      {label ?? t.common.demo}
    </span>
  );
}

/**
 * Statut de vérification. Jamais de certification inventée : on affiche
 * uniquement ce qui a été contrôlé, et la date du contrôle.
 */
export function VerificationBadge({ verification }: { verification: Verification }) {
  const { locale, t } = useTranslation();

  if (verification.status === "verifie") {
    const checks = localizedTerms(verification.checks, locale).join(", ");
    return (
      <span
        className="badge badge-verified"
        title={`${t.badges.checkedOn(formatDate(verification.checkedAt, locale, t.badges.unknownDate))} — ${checks}`}
      >
        <BadgeCheck size={13} />
        {t.common.verified}
      </span>
    );
  }

  if (verification.status === "en-cours") {
    return (
      <span className="badge" title={t.common.verificationPending}>
        {t.common.verificationPending}
      </span>
    );
  }

  return (
    <span className="badge" title={t.badges.declaredTitle}>
      <FileQuestion size={13} />
      {t.common.declarative}
    </span>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow eyebrow-line">{children}</p>;
}

function formatDate(iso: string | null, locale: Locale, unknown: string): string {
  if (!iso) return unknown;
  return new Date(iso).toLocaleDateString(LOCALE_TAG[locale], {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
