import type { Metadata } from "next";
import { Eyebrow } from "@/components/badges";
import { NewsSubmitForm } from "@/components/news-submit-form";
import { getTranslation } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.submitNews.title, description: t.meta.submitNews.description };
}

export default async function ProposerPage() {
  const { t } = await getTranslation();

  return (
    <section className="shell section-tight">
      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <div>
          <Eyebrow>{t.submitNews.eyebrow}</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">{t.submitNews.title}</h1>
          <p className="lede mt-5">{t.submitNews.lede}</p>

          <div className="mt-9">
            <NewsSubmitForm />
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="card-soft p-6">
            <h2 className="text-[0.66rem] uppercase tracking-[0.22em] faint">
              {t.submitNews.weAccept}
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.86rem] leading-6">
              {t.submitNews.accepted.map((entry) => (
                <li key={entry} className="flex gap-2.5">
                  <span aria-hidden="true" style={{ color: "var(--secondary)" }}>
                    +
                  </span>
                  {entry}
                </li>
              ))}
            </ul>

            <h2 className="mt-7 text-[0.66rem] uppercase tracking-[0.22em] faint">
              {t.submitNews.weReject}
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.86rem] leading-6 muted">
              {t.submitNews.rejected.map((entry) => (
                <li key={entry} className="flex gap-2.5">
                  <span aria-hidden="true" className="faint">
                    ×
                  </span>
                  {entry}
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t pt-4 text-[0.76rem] leading-5 faint" style={{ borderColor: "var(--border)" }}>
              {t.submitNews.notice}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
