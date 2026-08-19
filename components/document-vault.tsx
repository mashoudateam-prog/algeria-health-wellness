"use client";

import { AlertCircle, Clock, Eye, FileText, ShieldOff, Share2, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  DEMO_AUDIT,
  DEMO_DOCUMENTS,
  DOCUMENT_CATEGORY_LABEL,
} from "@/data/demo-account";
import type { AuditEntry, DocumentCategory, VaultDocument } from "@/types/domain";

/**
 * Document Vault — coffre documentaire.
 *
 * Le partage est le cœur du module : nominatif, borné dans le temps, révocable,
 * et systématiquement inscrit au journal d'accès. Toute action produit une
 * entrée d'audit — un partage silencieux serait une faille de conception.
 *
 * ⚠️ Démonstration : l'état vit en mémoire du navigateur. Un vrai coffre exige
 * chiffrement au repos, contrôle d'accès côté serveur et journal inaltérable.
 */

const RECIPIENTS = [
  { value: "Dr A. Benali — Clinique Ryad", kind: "medecin" as const },
  { value: "Dr M. Cherif — Centre dentaire Andalus", kind: "medecin" as const },
  { value: "Clinique Ryad", kind: "clinique" as const },
  { value: "Laboratoire Méditerranée", kind: "laboratoire" as const },
];

const DURATIONS = [
  { label: "24 heures", days: 1 },
  { label: "7 jours", days: 7 },
  { label: "30 jours", days: 30 },
];

const REFERENCE_DATE = new Date("2026-08-19T00:00:00Z");

export function DocumentVault() {
  const [documents, setDocuments] = useState<VaultDocument[]>(DEMO_DOCUMENTS);
  const [audit, setAudit] = useState<AuditEntry[]>(DEMO_AUDIT);
  const [filter, setFilter] = useState<DocumentCategory | "all">("all");
  const [sharing, setSharing] = useState<string | null>(null);

  const categories = useMemo(() => {
    const present = new Set(documents.map((document) => document.category));
    return [...present];
  }, [documents]);

  const visible =
    filter === "all" ? documents : documents.filter((document) => document.category === filter);

  const log = (entry: Omit<AuditEntry, "id" | "at">) => {
    setAudit((current) => [
      {
        id: `audit-${Date.now()}`,
        at: formatStamp(new Date()),
        ...entry,
      },
      ...current,
    ]);
  };

  const share = (documentId: string, recipient: string, days: number) => {
    const target = documents.find((entry) => entry.id === documentId);
    if (!target) return;

    const expiresAt = new Date(REFERENCE_DATE);
    expiresAt.setUTCDate(expiresAt.getUTCDate() + days);
    const expiresIso = expiresAt.toISOString().slice(0, 10);
    const recipientKind = RECIPIENTS.find((entry) => entry.value === recipient)?.kind ?? "clinique";

    setDocuments((current) =>
      current.map((entry) =>
        entry.id === documentId
          ? {
              ...entry,
              shares: [
                ...entry.shares,
                {
                  id: `share-${Date.now()}`,
                  recipient,
                  recipientKind,
                  grantedAt: REFERENCE_DATE.toISOString().slice(0, 10),
                  expiresAt: expiresIso,
                  revokedAt: null,
                },
              ],
            }
          : entry,
      ),
    );

    log({
      actor: "Vous",
      action: "document.partage",
      target: target.name,
      detail: `Accès accordé à ${recipient} pour ${days} jour${days > 1 ? "s" : ""}, jusqu'au ${formatDate(expiresIso)}.`,
    });

    setSharing(null);
  };

  const revoke = (documentId: string, shareId: string) => {
    const target = documents.find((entry) => entry.id === documentId);
    const revoked = target?.shares.find((entry) => entry.id === shareId);
    if (!target || !revoked) return;

    setDocuments((current) =>
      current.map((entry) =>
        entry.id === documentId
          ? {
              ...entry,
              shares: entry.shares.map((entryShare) =>
                entryShare.id === shareId
                  ? { ...entryShare, revokedAt: REFERENCE_DATE.toISOString().slice(0, 10) }
                  : entryShare,
              ),
            }
          : entry,
      ),
    );

    log({
      actor: "Vous",
      action: "document.revoque",
      target: target.name,
      detail: `Accès de ${revoked.recipient} révoqué immédiatement.`,
    });
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.45fr_0.55fr]">
      <div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par catégorie">
          <button
            type="button"
            onClick={() => setFilter("all")}
            aria-pressed={filter === "all"}
            className="rounded-full border px-3.5 py-2 text-[0.78rem] transition-colors"
            style={chipStyle(filter === "all")}
          >
            Tous ({documents.length})
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setFilter(category)}
              aria-pressed={filter === category}
              className="rounded-full border px-3.5 py-2 text-[0.78rem] transition-colors"
              style={chipStyle(filter === category)}
            >
              {DOCUMENT_CATEGORY_LABEL[category]}
            </button>
          ))}
        </div>

        <ul className="mt-6 space-y-4">
          {visible.map((document) => {
            const active = document.shares.filter((entry) => entry.revokedAt === null);
            return (
              <li key={document.id} className="card p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <FileText size={20} strokeWidth={1.6} className="mt-0.5 shrink-0" style={{ color: "var(--secondary)" }} />
                    <div>
                      <h3 className="text-[1rem] leading-snug">{document.name}</h3>
                      <p className="mt-1 text-[0.78rem] faint">
                        {DOCUMENT_CATEGORY_LABEL[document.category]} · {formatSize(document.sizeKb)} ·
                        ajouté le {formatDate(document.addedAt)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSharing(sharing === document.id ? null : document.id)}
                    className="btn btn-ghost btn-sm"
                    aria-expanded={sharing === document.id}
                  >
                    <Share2 size={14} />
                    Partager
                  </button>
                </div>

                {document.needsAttention && (
                  <p
                    className="mt-4 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[0.82rem] leading-5"
                    style={{ background: "rgba(154,104,69,0.09)", color: "#7a5a2e" }}
                  >
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>
                      {document.needsAttention}
                      <span className="mt-1 block text-[0.74rem] opacity-80">
                        Signalé automatiquement sur la forme du document — son contenu médical
                        n&apos;est jamais analysé.
                      </span>
                    </span>
                  </p>
                )}

                {sharing === document.id && (
                  <ShareForm
                    onCancel={() => setSharing(null)}
                    onSubmit={(recipient, days) => share(document.id, recipient, days)}
                  />
                )}

                {document.shares.length > 0 && (
                  <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                    <h4 className="text-[0.64rem] uppercase tracking-[0.2em] faint">
                      Accès ({active.length} actif{active.length > 1 ? "s" : ""})
                    </h4>
                    <ul className="mt-3 space-y-2.5">
                      {document.shares.map((entry) => (
                        <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3">
                          <div className="text-[0.84rem]">
                            <span className={entry.revokedAt ? "line-through opacity-50" : ""}>
                              {entry.recipient}
                            </span>
                            <span className="mt-0.5 flex items-center gap-1.5 text-[0.76rem] faint">
                              <Clock size={12} />
                              {entry.revokedAt
                                ? `Révoqué le ${formatDate(entry.revokedAt)}`
                                : `Expire le ${formatDate(entry.expiresAt)}`}
                            </span>
                          </div>
                          {!entry.revokedAt && (
                            <button
                              type="button"
                              onClick={() => revoke(document.id, entry.id)}
                              className="btn btn-quiet text-[0.78rem]"
                            >
                              <ShieldOff size={13} />
                              Révoquer
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-[0.66rem] uppercase tracking-[0.22em] faint">
            <Eye size={13} />
            Qui a consulté mes documents
          </h2>
          <ol className="mt-4 space-y-4">
            {audit.slice(0, 8).map((entry) => (
              <li key={entry.id} className="border-l-2 pl-3.5" style={{ borderColor: "var(--border-strong)" }}>
                <p className="text-[0.82rem] leading-5">
                  <span className="font-medium">{entry.actor}</span> · {entry.target}
                </p>
                <p className="mt-1 text-[0.76rem] leading-5 faint">{entry.detail}</p>
                <p className="mt-1 text-[0.72rem] tabular-nums faint">{entry.at}</p>
              </li>
            ))}
          </ol>
          <p className="mt-5 border-t pt-4 text-[0.74rem] leading-5 faint" style={{ borderColor: "var(--border)" }}>
            Ce journal vous est réservé. Aucune de ces informations n&apos;est visible par
            les établissements.
          </p>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ShareForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (recipient: string, days: number) => void;
  onCancel: () => void;
}) {
  const [recipient, setRecipient] = useState(RECIPIENTS[0].value);
  const [days, setDays] = useState(7);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(recipient, days);
      }}
      className="mt-5 rounded-[20px] p-5"
      style={{ background: "var(--surface-soft)" }}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-[0.88rem] font-medium">Ouvrir un accès temporaire</h4>
        <button type="button" onClick={onCancel} aria-label="Annuler" className="rounded-full p-1 hover:bg-black/5">
          <X size={15} />
        </button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="destinataire" className="block text-[0.78rem] faint">
            Destinataire
          </label>
          <select
            id="destinataire"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            className="field mt-1.5 text-[0.86rem]"
          >
            {RECIPIENTS.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.value}
              </option>
            ))}
          </select>
        </div>

        <div>
          <span className="block text-[0.78rem] faint">Durée de l&apos;accès</span>
          <div className="mt-1.5 flex gap-1.5">
            {DURATIONS.map((duration) => (
              <button
                key={duration.days}
                type="button"
                onClick={() => setDays(duration.days)}
                aria-pressed={days === duration.days}
                className="flex-1 rounded-full border px-2 py-2 text-[0.76rem] transition-colors"
                style={chipStyle(days === duration.days)}
              >
                {duration.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-sm mt-4">
        Accorder l&apos;accès
      </button>
      <p className="mt-2.5 text-[0.74rem] leading-5 faint">
        L&apos;accès se ferme seul à l&apos;échéance. Vous pouvez le révoquer avant.
      </p>
    </form>
  );
}

/* ------------------------------------------------------------------ */

function chipStyle(active: boolean): React.CSSProperties {
  return {
    borderColor: active ? "var(--primary)" : "var(--border-strong)",
    background: active ? "var(--primary)" : "transparent",
    color: active ? "#fff" : "var(--muted)",
  };
}

function formatSize(kb: number): string {
  return kb >= 1_024 ? `${(kb / 1_024).toFixed(1)} Mo` : `${kb} Ko`;
}

function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatStamp(date: Date): string {
  return `${date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })} ${date
    .toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}`;
}
