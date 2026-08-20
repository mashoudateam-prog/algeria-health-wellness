import { Clock, MessageCircle, PhoneCall, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { Eyebrow } from "@/components/badges";
import { ConciergeChat } from "@/components/concierge-chat";
import { providerStatus } from "@/lib/ai/provider";
import { getTranslation } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.concierge.title, description: t.meta.concierge.description };
}

export default async function ConciergePage() {
  const { t } = await getTranslation();
  const provider = providerStatus();

  return (
    <section className="shell section-tight">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <Eyebrow>{t.conciergePage.eyebrow}</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">{t.conciergePage.title}</h1>
          <p className="mt-5 max-w-xl leading-7 muted">{t.conciergePage.lede}</p>

          <div className="mt-8">
            <ConciergeChat />
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit">
          <div id="humain" className="card p-6" style={{ scrollMarginTop: "7rem" }}>
            <UserRound size={22} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
            <h2 className="mt-3.5 text-[1.14rem] leading-snug">{t.conciergePage.humanTitle}</h2>
            <p className="mt-2.5 text-[0.88rem] leading-6 muted">{t.conciergePage.humanBody}</p>

            <ul className="mt-5 space-y-3 text-[0.86rem]">
              <li className="flex items-center gap-2.5">
                <PhoneCall size={15} style={{ color: "var(--secondary)" }} />
                {t.conciergePage.callback}
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} style={{ color: "var(--secondary)" }} />
                {t.conciergePage.hours}
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle size={15} style={{ color: "var(--secondary)" }} />
                {t.conciergePage.writtenTrace}
              </li>
            </ul>

            <button type="button" className="btn btn-primary mt-6 w-full">
              {t.conciergePage.askCallback}
            </button>
            <p className="mt-2.5 text-[0.72rem] leading-5 faint">{t.conciergePage.demoNotice}</p>
          </div>

          <div className="card-soft p-6">
            <h2 className="text-[0.66rem] uppercase tracking-[0.22em] faint">
              {t.conciergePage.engineTitle}
            </h2>
            <p className="mt-2.5 text-[0.88rem] leading-6">{provider.label}</p>
            <p className="mt-3 text-[0.78rem] leading-5 faint">
              {provider.active ? t.conciergePage.engineOn : t.conciergePage.engineOff}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
