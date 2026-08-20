import { ArrowRight, Landmark, MapPin, Timer } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/badges";
import { Reveal } from "@/components/reveal";
import { DESTINATION_BY_SLUG } from "@/data/destinations";
import { HERITAGE_SITES } from "@/data/heritage";
import { hasImmersive } from "@/lib/immersive";
import { localizePath, type Locale } from "@/lib/i18n/config";
import { heritageEffortLabel, localizedHeritage } from "@/lib/i18n/content";
import { getTranslation } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getTranslation();
  return {
    title: t.heritage.eyebrow,
    description:
      locale === "en"
        ? "Algeria's seven World Heritage sites and the country's major places, woven into your stay by distance, effort and time required."
        : "Les sept sites algériens inscrits au patrimoine mondial et les grands lieux du pays, intégrés à votre séjour selon la distance, l'effort et la durée.",
  };
}

export default async function PatrimoinePage() {
  const { locale, t } = await getTranslation();
  const sites = HERITAGE_SITES.map((site) => localizedHeritage(site, locale));
  const unesco = sites.filter((site) => site.kind === "unesco");
  const majeurs = sites.filter((site) => site.kind === "site-majeur");

  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>{t.heritage.eyebrow}</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
          {t.heritage.title1}
          <br />
          <span style={{ color: "var(--sage, #7d927b)" }}>{t.heritage.title2}</span>
        </h1>
        <p className="lede mt-6">
          {t.heritage.lede}
        </p>
      </div>

      <h2 className="mt-16 text-[clamp(1.6rem,3.2vw,2.3rem)]">
        {t.heritage.unescoTitle}
      </h2>
      <p className="mt-3 text-[0.9rem] muted">
        {t.heritage.unescoBody}
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {unesco.map((site, index) => (
          <Reveal key={site.slug} delay={index * 0.04}>
            <SiteCard site={site} locale={locale} t={t} />
          </Reveal>
        ))}
      </div>

      <h2 className="mt-20 text-[clamp(1.6rem,3.2vw,2.3rem)]">{t.heritage.majorTitle}</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {majeurs.map((site, index) => (
          <Reveal key={site.slug} delay={index * 0.04}>
            <SiteCard site={site} locale={locale} t={t} />
          </Reveal>
        ))}
      </div>

      <div
        className="mt-16 rounded-[28px] border p-7"
        style={{ borderColor: "var(--border)", background: "var(--surface-soft)" }}
      >
        <h2 className="text-[1.1rem]">{t.heritage.notShownTitle}</h2>
        <p className="mt-3 max-w-3xl text-[0.88rem] leading-7 muted">
          {t.heritage.notShownBody}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SiteCard({
  site,
  locale,
  t,
}: {
  site: (typeof HERITAGE_SITES)[number];
  locale: Locale;
  t: Dictionary;
}) {
  const destination = DESTINATION_BY_SLUG.get(site.nearestDestination);
  const immersive = hasImmersive(site.slug);

  return (
    <article className="card flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        {site.kind === "unesco" ? (
          <span className="badge badge-verified">
            <Landmark size={12} />
            UNESCO {site.inscribedIn}
          </span>
        ) : (
          <span className="badge">{t.heritage.majorSite}</span>
        )}
        {immersive && <span className="badge">{t.heritage.immersionAvailable}</span>}
      </div>

      <h3 className="mt-3.5 text-[1.2rem] leading-snug">{site.name}</h3>
      <p className="mt-1 text-[0.78rem] faint">{site.wilayaName}</p>
      <p className="mt-3 flex-1 text-[0.88rem] leading-6 muted">{site.summary}</p>

      <dl className="mt-5 space-y-1.5 border-t pt-4 text-[0.8rem]" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <dt className="sr-only">{t.common.from}</dt>
          <MapPin size={13} className="shrink-0 faint" />
          <dd>
            {site.distanceKm === 0
              ? `${t.heritage.onSite} — ${destination?.name ?? site.wilayaName}`
              : `${site.distanceKm} km — ${destination?.name ?? site.wilayaName}`}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">{t.heritage.plan}</dt>
          <Timer size={13} className="shrink-0 faint" />
          <dd>
            {site.hours >= 24
              ? `${Math.round(site.hours / 24)} ${t.common.days}`
              : `${site.hours} ${t.common.hours}`}{" "}
            ·{" "}
            {heritageEffortLabel(site.effort, t)}
          </dd>
        </div>
      </dl>

      <Link
        href={localizePath(`/patrimoine/${site.slug}`, locale)}
        className="btn btn-quiet mt-4 self-start text-[0.82rem]"
      >
        {t.common.readMore}
        <ArrowRight size={14} />
      </Link>
    </article>
  );
}
