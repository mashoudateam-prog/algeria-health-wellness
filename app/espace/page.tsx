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
import { LOCALE_TAG, localizePath } from "@/lib/i18n/config";
import { localizedDemoAccount } from "@/lib/i18n/content";
import { getTranslation } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.space.title, description: t.meta.space.description };
}

export default async function EspacePage() {
  const { locale, t } = await getTranslation();
  const link = (href: string) => localizePath(href, locale);
  const dateFormat = new Intl.DateTimeFormat(LOCALE_TAG[locale], {
    day: "numeric",
    month: "long",
  });
  const formatDate = (iso: string) => dateFormat.format(new Date(`${iso}T00:00:00Z`));

  const { journey, appointments } = localizedDemoAccount(
    { journey: DEMO_JOURNEY, appointments: DEMO_APPOINTMENTS },
    locale,
  );
  const nextAppointment = appointments[0];
  const activeShares = DEMO_DOCUMENTS.reduce(
    (total, document) => total + document.shares.filter((share) => share.revokedAt === null).length,
    0,
  );

  return (
    <section className="shell section-tight">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow eyebrow-line">{t.space.eyebrow}</p>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">
            {t.space.hello(DEMO_PATIENT.firstName)}
          </h1>
        </div>
        <DemoBadge label={t.space.demoLabel} />
      </div>

      {/* Parcours */}
      <div
        className="mt-10 rounded-[32px] p-7 sm:p-9"
        style={{ background: "var(--surface-deep)", color: "#fff" }}
      >
        <p className="text-[0.62rem] uppercase tracking-[0.26em] text-white/40">
          {t.space.yourJourney}
        </p>
        <h2 className="mt-3 text-[clamp(1.5rem,3.4vw,2.3rem)]">{journey.title}</h2>
        <p className="mt-2.5 text-[0.9rem] text-white/55">
          {t.space.dates(formatDate(journey.startsOn), formatDate(journey.endsOn))}
        </p>

        <ol className="mt-9 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {journey.phases.map((phase) => {
            const current = phase.key === journey.currentPhase;
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
                  <p className="mt-0.5 text-[0.68rem] text-white/45">{t.space.inProgress}</p>
                )}
              </li>
            );
          })}
        </ol>

        <Link href={link("/parcours")} className="btn btn-accent mt-8">
          {t.space.resume}
          <ArrowRight size={15} />
        </Link>
      </div>

      {/* Cartes */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <article className="card p-6">
          <CalendarDays size={20} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
          <h2 className="mt-3.5 text-[0.66rem] uppercase tracking-[0.2em] faint">
            {t.space.nextAppointment}
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
          <p className="mt-2.5 text-[1.02rem]">{t.space.documentsCount(DEMO_DOCUMENTS.length)}</p>
          <p className="mt-1.5 text-[0.84rem] muted">{t.space.activeShares(activeShares)}</p>
          <Link href={link("/espace/documents")} className="btn btn-quiet mt-3 text-[0.82rem]">
            {t.space.manageDocuments}
            <ArrowRight size={13} />
          </Link>
        </article>

        <article className="card p-6">
          <Wallet size={20} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
          <h2 className="mt-3.5 text-[0.66rem] uppercase tracking-[0.2em] faint">
            {t.space.estimatedBudget}
          </h2>
          <p className="mt-2.5 text-[1.02rem] tabular-nums">
            {formatDZD(268_000)} – {formatDZD(447_000)}
          </p>
          <p className="mt-1.5 text-[0.8rem] leading-5 faint">{t.space.estimateNotice}</p>
        </article>

        <article className="card p-6">
          <MessageCircle size={20} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
          <h2 className="mt-3.5 text-[0.66rem] uppercase tracking-[0.2em] faint">
            {t.nav.concierge}
          </h2>
          <p className="mt-2.5 text-[0.9rem] leading-6 muted">{t.space.conciergeBody}</p>
          <Link href={link("/concierge")} className="btn btn-quiet mt-3 text-[0.82rem]">
            {t.home.conciergeOpen}
            <ArrowRight size={13} />
          </Link>
        </article>
      </div>

      {/* Agenda */}
      <div className="mt-14">
        <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">{t.space.agenda}</h2>
        <ol className="mt-7 space-y-3">
          {appointments.map((appointment) => (
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

      <p className="mt-12 max-w-3xl text-[0.82rem] leading-6 faint">{t.space.demoNotice}</p>
    </section>
  );
}
