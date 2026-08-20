import type { Metadata } from "next";
import { Eyebrow } from "@/components/badges";
import { NewsModeration } from "@/components/news-moderation";
import { getTranslation } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.moderation.title, robots: { index: false, follow: false } };
}

export default async function ModerationPage() {
  const { t } = await getTranslation();

  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>{t.moderation.eyebrow}</Eyebrow>
        <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">{t.moderation.title}</h1>
        <p className="lede mt-5">{t.moderation.lede}</p>
      </div>

      <div className="mt-10">
        <NewsModeration />
      </div>

      <p className="mt-12 max-w-3xl text-[0.82rem] leading-6 faint">
        {t.moderation.noticeStart}
        <code>ADMIN_TOKEN</code>
        {t.moderation.noticeEnd}
      </p>
    </section>
  );
}
