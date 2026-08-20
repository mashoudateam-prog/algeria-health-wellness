import { ArrowRight, Landmark, MapPin, Sparkles, Timer } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Eyebrow } from "@/components/badges";
import { ImmersiveSlot } from "@/components/immersive-slot";
import { DESTINATION_BY_SLUG } from "@/data/destinations";
import { HERITAGE_BY_SLUG, HERITAGE_SITES, heritageNear } from "@/data/heritage";
import { localizePath } from "@/lib/i18n/config";
import { heritageEffortLabel, localizedHeritage } from "@/lib/i18n/content";
import { fill, getTranslation } from "@/lib/i18n/server";

export function generateStaticParams() {
  return HERITAGE_SITES.map((site) => ({ slug: site.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = HERITAGE_BY_SLUG.get(slug);
  const { locale } = await getTranslation();
  if (!found) return { title: locale === "en" ? "Site not found" : "Site introuvable" };
  const site = localizedHeritage(found, locale);
  return { title: site.name, description: site.summary };
}

export default async function HeritagePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = HERITAGE_BY_SLUG.get(slug);
  if (!found) notFound();

  const { locale, t } = await getTranslation();
  const link = (href: string) => localizePath(href, locale);
  const site = localizedHeritage(found, locale);

  const destination = DESTINATION_BY_SLUG.get(site.nearestDestination);
  const nearby = heritageNear(site.nearestDestination)
    .filter((entry) => entry.slug !== site.slug)
    .map((entry) => localizedHeritage(entry, locale));

  return (
    <>
      <section className="shell pt-10">
        <div className="max-w-3xl">
          <Eyebrow>{site.wilayaName}</Eyebrow>
          <h1 className="mt-5 text-[clamp(2.4rem,6vw,4rem)]">{site.name}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {site.kind === "unesco" ? (
              <span className="badge badge-verified">
                <Landmark size={12} />
                UNESCO {site.inscribedIn}
              </span>
            ) : (
              <span className="badge">{t.heritage.majorSite}</span>
            )}
            <span className="badge">
              <Timer size={12} />
              {site.hours >= 24
                ? `${Math.round(site.hours / 24)} ${t.common.days}`
                : `${site.hours} ${t.common.hours}`}
            </span>
            <span className="badge">{heritageEffortLabel(site.effort, t)}</span>
          </div>

          <p className="mt-7 text-[clamp(1.02rem,1.7vw,1.24rem)] leading-8 muted">{site.summary}</p>
        </div>
      </section>

      {/* Immersion */}
      <section className="shell section-tight">
        <ImmersiveSlot slug={site.slug} title={site.name} className="h-[min(70vh,620px)]" />
      </section>

      {/* Détail */}
      <section className="shell pb-16">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
          <div>
            <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">{t.heritage.whatYouSee}</h2>
            <ul className="mt-6 space-y-3">
              {site.highlights.map((highlight) => (
                <li key={highlight} className="card-soft px-5 py-4 text-[0.92rem] leading-6">
                  {highlight}
                </li>
              ))}
            </ul>

            {site.bestSeason && (
              <>
                <h2 className="mt-12 text-[clamp(1.5rem,3vw,2.1rem)]">{t.heritage.whenToGo}</h2>
                <p className="mt-4 leading-7 muted">{site.bestSeason}</p>
              </>
            )}
          </div>

          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="card p-6">
              <h2 className="text-[0.66rem] uppercase tracking-[0.22em] faint">
                {t.heritage.fromYourStay}
              </h2>

              <dl className="mt-4 space-y-3.5 text-[0.88rem]">
                <div>
                  <dt className="faint">{t.heritage.nearestDestination}</dt>
                  <dd className="mt-0.5 flex items-center gap-2">
                    <MapPin size={14} />
                    {destination?.name ?? site.wilayaName}
                  </dd>
                </div>
                <div>
                  <dt className="faint">{t.heritage.distance}</dt>
                  <dd className="mt-0.5">
                    {site.distanceKm === 0 ? t.heritage.onSite : `${site.distanceKm} km`}
                  </dd>
                </div>
                <div>
                  <dt className="faint">{t.heritage.plan}</dt>
                  <dd className="mt-0.5">
                    {site.hours >= 24
                      ? fill(t.heritage.daysOrganised, { days: Math.round(site.hours / 24) })
                      : fill(t.heritage.hoursOnSite, { hours: site.hours })}
                  </dd>
                </div>
              </dl>

              <Link
                href={link(
                  `/parcours?q=${encodeURIComponent(
                    locale === "en"
                      ? `A stay in ${destination?.name ?? site.wilayaName}, visiting ${site.name}`
                      : `Un séjour à ${destination?.name ?? site.wilayaName} avec la visite de ${site.name}`,
                  )}`,
                )}
                className="btn btn-primary mt-6 w-full"
              >
                <Sparkles size={15} />
                {t.heritage.addToJourney}
              </Link>

              {destination && (
                <Link
                  href={link(`/destinations/${destination.slug}`)}
                  className="btn btn-ghost mt-2.5 w-full"
                >
                  {t.common.readMore} — {destination.name}
                </Link>
              )}
            </div>

            <p className="mt-4 text-[0.76rem] leading-5 faint">
              {t.heritage.hoursNotice}
            </p>
          </aside>
        </div>

        {nearby.length > 0 && (
          <div className="mt-16">
            <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">{t.heritage.nearby}</h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {nearby.slice(0, 3).map((entry) => (
                <Link
                  key={entry.slug}
                  href={link(`/patrimoine/${entry.slug}`)}
                  className="card p-6 transition-transform hover:-translate-y-0.5"
                >
                  {entry.kind === "unesco" && (
                    <span className="badge badge-verified">
                      <Landmark size={12} />
                      UNESCO
                    </span>
                  )}
                  <h3 className="mt-3 text-[1.1rem] leading-snug">{entry.name}</h3>
                  <p className="mt-2 text-[0.84rem] leading-6 muted">
                    {entry.summary.split(".")[0]}.
                  </p>
                  <p className="mt-3 text-[0.78rem] faint">
                    {entry.distanceKm === 0 ? t.heritage.onSite : `${entry.distanceKm} km`} ·{" "}
                    {entry.hours >= 24
                      ? `${Math.round(entry.hours / 24)} ${t.common.days}`
                      : `${entry.hours} ${t.common.hours}`}
                  </p>
                  <span className="btn btn-quiet mt-3 text-[0.82rem]">
                    {t.common.readMore}
                    <ArrowRight size={13} />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
