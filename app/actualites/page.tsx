import { ArrowUpRight, CalendarDays, MapPin, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge, Eyebrow } from "@/components/badges";
import { Reveal } from "@/components/reveal";
import { newsStore } from "@/lib/news/store";
import { localizedNewsItem } from "@/lib/i18n/content";
import type { NewsItem } from "@/types/news";
import { LOCALE_TAG, localizePath, type Locale } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.news.title, description: t.meta.news.description };
}

const CATEGORY_TONE: Record<string, string> = {
  cure: "#2f5f73",
  festival: "#9a6845",
  gastronomie: "#9a6845",
  ouverture: "#17382f",
  promotion: "#7d927b",
  evenement: "#17382f",
};

export default async function ActualitesPage() {
  const { locale, t } = await getTranslation();
  const items = (await newsStore.list("publie")).map((item) => localizedNewsItem(item, locale));

  return (
    <section className="shell section-tight">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow>{t.newsPage.eyebrow}</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
            {t.newsPage.title1}
            <br />
            {t.newsPage.title2}
          </h1>
          <p className="lede mt-6">{t.newsPage.lede}</p>
        </div>

        <Link href={localizePath("/actualites/proposer", locale)} className="btn btn-ghost">
          <Plus size={15} />
          {t.newsPage.submit}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="card mt-12 p-8 text-[0.92rem] leading-7 muted">{t.newsPage.empty}</p>
      ) : (
        <ol className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.04}>
              <NewsCard item={item} locale={locale} t={t} />
            </Reveal>
          ))}
        </ol>
      )}

      <div
        className="mt-14 rounded-[28px] border p-7"
        style={{ borderColor: "var(--border)", background: "var(--surface-soft)" }}
      >
        <h2 className="text-[1.1rem]">{t.newsPage.howTitle}</h2>
        <p className="mt-3 max-w-3xl text-[0.88rem] leading-7 muted">
          {t.newsPage.howBodyStart} <strong>{t.newsPage.howBodyStrong}</strong>
          {t.newsPage.howBodyEnd}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function NewsCard({ item, locale, t }: { item: NewsItem; locale: Locale; t: Dictionary }) {
  const tone = CATEGORY_TONE[item.category] ?? "var(--primary)";

  return (
    <li className="card flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge" style={{ color: tone, borderColor: `${tone}44` }}>
          {t.newsPage.categories[item.category]}
        </span>
        {item.demo && <DemoBadge />}
      </div>

      <h2 className="mt-4 text-[1.12rem] leading-snug">{item.title}</h2>
      <p className="mt-3 flex-1 text-[0.88rem] leading-6 muted">{item.summary}</p>

      <dl className="mt-5 space-y-1.5 border-t pt-4 text-[0.8rem]" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <dt className="sr-only">{t.newsPage.place}</dt>
          <MapPin size={13} className="shrink-0 faint" />
          <dd>{item.locationLabel}</dd>
        </div>
        {item.startsOn && (
          <div className="flex items-center gap-2">
            <dt className="sr-only">{t.newsPage.date}</dt>
            <CalendarDays size={13} className="shrink-0 faint" />
            <dd>{formatRange(item.startsOn, item.endsOn, locale, t)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 text-[0.76rem] faint">
        <span>
          {t.newsPage.origins[item.origin]} · {item.sourceName}
        </span>
        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 underline"
          >
            {t.common.source}
            <ArrowUpRight size={12} />
          </a>
        )}
      </div>
    </li>
  );
}

function formatRange(
  startsOn: string,
  endsOn: string | null,
  locale: Locale,
  t: Dictionary,
): string {
  const format = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString(LOCALE_TAG[locale], {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return endsOn ? t.newsPage.range(format(startsOn), format(endsOn)) : format(startsOn);
}
