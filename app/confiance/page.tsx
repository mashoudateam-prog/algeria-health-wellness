import { BadgeCheck, Bot, Eye, KeyRound, Lock, ShieldAlert, Timer } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/badges";
import { providerStatus } from "@/lib/ai/provider";
import { localizePath } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.trust.title, description: t.meta.trust.description };
}

const PRINCIPLE_ICONS = [Lock, Timer, Eye, KeyRound];

export default async function ConfiancePage() {
  const { locale, t } = await getTranslation();
  const link = (href: string) => localizePath(href, locale);
  const provider = providerStatus();

  return (
    <>
      <section className="shell section-tight">
        <div className="max-w-2xl">
          <Eyebrow>{t.trustPage.eyebrow}</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">{t.trustPage.title}</h1>
          <p className="lede mt-6">{t.trustPage.lede}</p>
        </div>
      </section>

      {/* Données */}
      <section id="donnees" className="border-y" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="shell section-tight">
          <h2 className="text-[clamp(1.7rem,3.4vw,2.4rem)]">{t.trustPage.dataTitle}</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {t.trustPage.principles.map((principle, index) => {
              const Icon = PRINCIPLE_ICONS[index];
              return (
                <article key={principle.title}>
                  <Icon size={22} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
                  <h3 className="mt-3.5 text-[1.14rem] leading-snug">{principle.title}</h3>
                  <p className="mt-2.5 text-[0.9rem] leading-7 muted">{principle.body}</p>
                </article>
              );
            })}
          </div>

          <Link href={link("/espace/documents")} className="btn btn-quiet mt-10">
            {t.trustPage.accessLog}
          </Link>
        </div>
      </section>

      {/* Vérification */}
      <section id="verification" className="shell section-tight">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <BadgeCheck size={24} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
            <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.4rem)]">
              {t.trustPage.verificationTitle}
            </h2>
            <p className="mt-5 leading-7 muted">{t.trustPage.verificationBody}</p>
          </div>

          <div className="space-y-4">
            {t.trustPage.statuses.map((entry) => (
              <div key={entry.label} className="card p-6">
                <h3 className="text-[1.02rem]">{entry.label}</h3>
                <p className="mt-2 text-[0.88rem] leading-6 muted">{entry.body}</p>
              </div>
            ))}

            <div
              className="rounded-[24px] border p-6"
              style={{ borderColor: "rgba(154,104,69,0.3)", background: "rgba(154,104,69,0.06)" }}
            >
              <h3 className="flex items-center gap-2 text-[1rem]">
                <ShieldAlert size={17} style={{ color: "var(--accent)" }} />
                {t.trustPage.noInventedCertification}
              </h3>
              <p className="mt-2 text-[0.88rem] leading-6 muted">{t.trustPage.noInventedBody}</p>
            </div>
          </div>
        </div>
      </section>

      {/* IA */}
      <section id="ia" style={{ background: "var(--surface-deep)", color: "#fff" }}>
        <div className="shell section-tight">
          <Bot size={24} strokeWidth={1.6} style={{ color: "var(--terracotta-soft, #c08a63)" }} />
          <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.4rem)]">{t.trustPage.aiTitle}</h2>
          <p className="mt-5 max-w-2xl leading-7 text-white/55">{t.trustPage.aiBody}</p>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-[0.66rem] uppercase tracking-[0.22em] text-white/40">
                {t.trustPage.aiCanTitle}
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.92rem] leading-7 text-white/80">
                {t.trustPage.aiCan.map((entry) => (
                  <li key={entry} className="flex gap-3">
                    <span aria-hidden="true" style={{ color: "var(--terracotta-soft, #c08a63)" }}>
                      +
                    </span>
                    {entry}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[0.66rem] uppercase tracking-[0.22em] text-white/40">
                {t.trustPage.aiCannotTitle}
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.92rem] leading-7 text-white/80">
                {t.trustPage.aiCannot.map((entry) => (
                  <li key={entry} className="flex gap-3">
                    <span aria-hidden="true" className="text-white/40">
                      ×
                    </span>
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-7">
            <p className="text-[0.86rem] leading-6 text-white/55">
              {t.trustPage.engineActive}{" "}
              <strong className="text-white">{provider.label}</strong>. {t.trustPage.engineBody}
            </p>
            <p className="mt-4 text-[0.86rem] leading-6 text-white/55">
              {t.trustPage.emergencyBody}
            </p>
          </div>
        </div>
      </section>

      <section className="shell section-tight">
        <div className="max-w-3xl">
          <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">{t.trustPage.questionTitle}</h2>
          <p className="mt-4 leading-7 muted">{t.trustPage.questionBody}</p>
          <Link href={link("/concierge#humain")} className="btn btn-primary mt-7">
            {t.common.talkToAdviser}
          </Link>
        </div>
      </section>
    </>
  );
}
