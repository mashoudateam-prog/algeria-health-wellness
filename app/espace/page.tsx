import { ArrowRight, CalendarDays, FileText, MessageCircle, Wallet } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge } from "@/components/badges";
import {
  DEMO_APPOINTMENTS,
  DEMO_DOCUMENTS,
  DEMO_JOURNEY,
  DEMO_PATIENT,
} from "@/data/demo-account";
import { formatDZD } from "@/lib/ai/quote";

export const metadata: Metadata = {
  title: "Mon espace",
  description:
    "Votre parcours, vos rendez-vous, vos documents et votre budget, réunis en un seul endroit.",
};

const DATE_FORMAT = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
});

export default function EspacePage() {
  const nextAppointment = DEMO_APPOINTMENTS[0];
  const activeShares = DEMO_DOCUMENTS.reduce(
    (total, document) => total + document.shares.filter((share) => share.revokedAt === null).length,
    0,
  );

  return (
    <section className="shell section-tight">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow eyebrow-line">Votre espace</p>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">Bonjour {DEMO_PATIENT.firstName}</h1>
        </div>
        <DemoBadge label="Compte de démonstration" />
      </div>

      {/* Parcours */}
      <div
        className="mt-10 rounded-[32px] p-7 sm:p-9"
        style={{ background: "var(--surface-deep)", color: "#fff" }}
      >
        <p className="text-[0.62rem] uppercase tracking-[0.26em] text-white/40">Votre parcours</p>
        <h2 className="mt-3 text-[clamp(1.5rem,3.4vw,2.3rem)]">{DEMO_JOURNEY.title}</h2>
        <p className="mt-2.5 text-[0.9rem] text-white/55">
          Du {formatDate(DEMO_JOURNEY.startsOn)} au {formatDate(DEMO_JOURNEY.endsOn)}
        </p>

        <ol className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {DEMO_JOURNEY.phases.map((phase) => {
            const current = phase.key === DEMO_JOURNEY.currentPhase;
            return (
              <li key={phase.key}>
                <div
                  className="h-1 rounded-full"
                  style={{
                    background: phase.done
                      ? "var(--terracotta-soft, #c08a63)"
                      : current
                        ? "rgba(255,255,255,0.55)"
                        : "rgba(255,255,255,0.14)",
                  }}
                />
                <p
                  className="mt-2.5 text-[0.8rem]"
                  style={{ color: phase.done || current ? "#fff" : "rgba(255,255,255,0.38)" }}
                >
                  {phase.label}
                </p>
                {current && (
                  <p className="mt-0.5 text-[0.68rem] text-white/45">En cours</p>
                )}
              </li>
            );
          })}
        </ol>

        <Link href="/parcours" className="btn btn-accent mt-8">
          Reprendre la planification
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Cartes */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article className="card p-6">
          <CalendarDays size={20} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
          <h2 className="mt-3.5 text-[0.66rem] uppercase tracking-[0.2em] faint">
            Prochain rendez-vous
          </h2>
          <p className="mt-2.5 text-[1.02rem] leading-snug">{nextAppointment.title}</p>
          <p className="mt-1.5 text-[0.84rem] muted">
            {formatDate(nextAppointment.date)} · {nextAppointment.time}
          </p>
          <p className="mt-1 text-[0.8rem] faint">{nextAppointment.facility}</p>
        </article>

        <article className="card p-6">
          <FileText size={20} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
          <h2 className="mt-3.5 text-[0.66rem] uppercase tracking-[0.2em] faint">
            Health Passport
          </h2>
          <p className="mt-2.5 text-[1.02rem]">{DEMO_DOCUMENTS.length} documents</p>
          <p className="mt-1.5 text-[0.84rem] muted">
            {activeShares} partage{activeShares > 1 ? "s" : ""} actif{activeShares > 1 ? "s" : ""}
          </p>
          <Link href="/espace/documents" className="btn btn-quiet mt-3 text-[0.82rem]">
            Gérer mes documents
            <ArrowRight size={13} />
          </Link>
        </article>

        <article className="card p-6">
          <Wallet size={20} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
          <h2 className="mt-3.5 text-[0.66rem] uppercase tracking-[0.2em] faint">
            Budget estimé
          </h2>
          <p className="mt-2.5 text-[1.02rem] tabular-nums">
            {formatDZD(268_000)} – {formatDZD(447_000)}
          </p>
          <p className="mt-1.5 text-[0.8rem] leading-5 faint">
            Estimation indicative, hors devis professionnel.
          </p>
        </article>

        <article className="card p-6">
          <MessageCircle size={20} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
          <h2 className="mt-3.5 text-[0.66rem] uppercase tracking-[0.2em] faint">Concierge</h2>
          <p className="mt-2.5 text-[0.9rem] leading-6 muted">
            Une question sur l&apos;organisation, les documents ou le déroulement ?
          </p>
          <Link href="/concierge" className="btn btn-quiet mt-3 text-[0.82rem]">
            Ouvrir le concierge
            <ArrowRight size={13} />
          </Link>
        </article>
      </div>

      {/* Agenda */}
      <div className="mt-14">
        <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">Votre agenda</h2>
        <ol className="mt-7 space-y-3">
          {DEMO_APPOINTMENTS.map((appointment) => (
            <li key={appointment.id} className="card grid gap-4 p-5 sm:grid-cols-[7.5rem_1fr]">
              <div>
                <p className="text-[0.84rem]">{formatDate(appointment.date)}</p>
                <p className="text-[0.84rem] tabular-nums faint">{appointment.time}</p>
              </div>
              <div>
                <h3 className="text-[1.02rem] leading-snug">{appointment.title}</h3>
                <p className="mt-1 text-[0.84rem] muted">{appointment.facility}</p>
                <p className="mt-1.5 text-[0.8rem] faint">{appointment.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-12 max-w-3xl text-[0.82rem] leading-6 faint">
        Cet espace fonctionne actuellement sur un compte de démonstration : aucune
        authentification n&apos;est branchée et les données ne sont pas persistées. Les
        informations affichées sont fictives.
      </p>
    </section>
  );
}

function formatDate(iso: string): string {
  return DATE_FORMAT.format(new Date(`${iso}T00:00:00Z`));
}
