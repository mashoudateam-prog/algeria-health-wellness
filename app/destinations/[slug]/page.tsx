import { ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBadge, Eyebrow, VerificationBadge } from "@/components/badges";
import { PhotoPlate } from "@/components/photo-plate";
import { Reveal } from "@/components/reveal";
import { DESTINATIONS, getDestination } from "@/data/destinations";
import { facilitiesForDestination } from "@/data/facilities";
import { GOAL_BY_ID } from "@/data/goals";
import { RETREATS } from "@/data/retreats";
import { localizePath } from "@/lib/i18n/config";
import {
  localizedDestination,
  localizedFacility,
  localizedGoal,
  localizedRetreat,
} from "@/lib/i18n/content";
import { getTranslation } from "@/lib/i18n/server";

export function generateStaticParams() {
  return DESTINATIONS.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await getTranslation();
  const found = getDestination(slug);
  if (!found) return { title: t.destinations.notFound };

  const destination = localizedDestination(found, locale);
  return {
    title: `${destination.name} — ${destination.tagline}`,
    description: destination.intro,
  };
}

/** Ordre de lecture éditorial : on commence par le soin, on finit par le lieu. */
const SECTIONS = [
  "offreMedicale",
  "bienEtre",
  "recuperation",
  "hebergement",
  "accessibilite",
  "transport",
  "gastronomie",
  "patrimoine",
] as const;

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const found = getDestination(slug);
  if (!found) notFound();

  const { locale, t } = await getTranslation();
  const link = (href: string) => localizePath(href, locale);
  const destination = localizedDestination(found, locale);

  const facilities = facilitiesForDestination(destination.slug).map((entry) =>
    localizedFacility(entry, locale),
  );
  const retreats = RETREATS.filter(
    (retreat) => retreat.destinationSlug === destination.slug,
  ).map((retreat) => localizedRetreat(retreat, locale));

  return (
    <>
      <PhotoPlate
        slug={destination.slug}
        alt={destination.photo.alt}
        caption={destination.name}
        overline={destination.tagline}
        priority
        scrim="full"
        sizes="100vw"
        className="h-[min(72vh,720px)] rounded-none"
      >
        <div className="shell flex h-full flex-col justify-end pb-12">
          <p className="eyebrow eyebrow-line" style={{ color: "rgba(255,255,255,0.82)" }}>
            {t.regions[destination.region]}
          </p>
          <h1 className="mt-5 text-[clamp(2.6rem,7vw,5rem)] text-white">{destination.name}</h1>
          <p className="mt-3 text-[clamp(1.05rem,2.2vw,1.6rem)] leading-snug text-white/75">
            {destination.tagline}
          </p>
        </div>
      </PhotoPlate>

      <section className="shell grid gap-10 pb-14 pt-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
        <p className="text-[clamp(1.02rem,1.7vw,1.28rem)] leading-8 muted">{destination.intro}</p>

        <ul className="flex h-fit flex-wrap gap-2">
          {destination.bestFor.map((entry) => (
            <li key={entry} className="badge">
              {entry}
            </li>
          ))}
        </ul>
      </section>

      {/* Spécialités */}
      <section className="border-y" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="shell section-tight">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-[clamp(1.6rem,3.2vw,2.3rem)]">{t.destinations.whyCome}</h2>
              <p className="mt-4 max-w-md leading-7 muted">{t.destinations.whyComeBody}</p>
            </div>
            <div>
              <h3 className="text-[0.66rem] uppercase tracking-[0.22em] faint">
                {t.destinations.suitedGoals}
              </h3>
              <ul className="mt-3.5 flex flex-wrap gap-2">
                {destination.strengths.map((goalId) => {
                  const raw = GOAL_BY_ID.get(goalId);
                  const goal = raw ? localizedGoal(raw, locale) : undefined;
                  return (
                    <li key={goalId} className="badge">
                      <span aria-hidden="true">{goal?.emoji}</span> {goal?.label ?? goalId}
                    </li>
                  );
                })}
              </ul>

              <h3 className="mt-8 text-[0.66rem] uppercase tracking-[0.22em] faint">
                {t.destinations.specialtiesHere}
              </h3>
              <ul className="mt-3.5 flex flex-wrap gap-2">
                {destination.editorial.specialites.map((specialty) => (
                  <li key={specialty} className="badge">
                    {specialty}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Corps éditorial */}
      <section className="shell section-tight">
        <div className="grid gap-x-14 gap-y-12 md:grid-cols-2">
          {SECTIONS.map((key, index) => (
            <Reveal key={key} delay={index * 0.03}>
              <article>
                <h2 className="serif text-[1.35rem] leading-snug">
                  {t.destinations.sections[key]}
                </h2>
                <p className="mt-3.5 leading-7 muted">{destination.editorial[key]}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14">
            <h2 className="serif text-[1.35rem] leading-snug">{t.destinations.seeAndLive}</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {destination.editorial.activites.map((activity) => (
                <li
                  key={activity}
                  className="card-soft px-5 py-4 text-[0.9rem] leading-6"
                >
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Structures */}
      {facilities.length > 0 && (
        <section className="border-y" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
          <div className="shell section-tight">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-[clamp(1.6rem,3.2vw,2.3rem)]">
                {t.destinations.listedFacilities}
              </h2>
              <DemoBadge label={t.destinations.demoCatalogue} />
            </div>
            <p className="mt-3 max-w-2xl text-[0.9rem] leading-7 muted">
              {t.destinations.demoNotice}
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {facilities.map((facility) => (
                <article key={facility.id} className="card flex flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge">{t.facilityKinds[facility.kind]}</span>
                    <VerificationBadge verification={facility.verification} />
                  </div>
                  <h3 className="mt-3.5 text-[1.14rem] leading-snug">{facility.name}</h3>
                  <p className="mt-2.5 flex-1 text-[0.86rem] leading-6 muted">{facility.summary}</p>
                  <p className="mt-4 text-[0.76rem] faint">
                    {t.directory.languages} : {facility.languages.join(", ")}
                  </p>
                  <Link
                    href={link(`/professionnels/${facility.slug}`)}
                    className="btn btn-quiet mt-4 self-start text-[0.82rem]"
                  >
                    {t.common.seeSheet}
                    <ArrowRight size={14} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Séjours */}
      {retreats.length > 0 && (
        <section className="shell section-tight">
          <h2 className="text-[clamp(1.6rem,3.2vw,2.3rem)]">{t.destinations.retreatsHere}</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {retreats.map((retreat) => (
              <Link key={retreat.slug} href={link("/sejours")} className="card group p-6 transition-transform hover:-translate-y-0.5">
                <span className="badge">
                  {retreat.days} {t.common.days}
                </span>
                <h3 className="mt-4 serif text-[1.5rem]">{retreat.name}</h3>
                <p className="mt-2.5 text-[0.88rem] leading-6 muted">{retreat.claim}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="shell pb-20">
        <div
          className="flex flex-wrap items-center justify-between gap-6 rounded-[32px] p-8 sm:p-10"
          style={{ background: "var(--surface-deep)", color: "#fff" }}
        >
          <div>
            <h2 className="text-[clamp(1.4rem,3vw,2rem)]">
              {t.destinations.buildHere(destination.name)}
            </h2>
            <p className="mt-2.5 max-w-lg text-[0.92rem] leading-7 text-white/55">
              {t.destinations.ctaBody}
            </p>
          </div>
          <Link
            href={link(
              `/parcours?q=${encodeURIComponent(t.destinations.stayIn(destination.name))}`,
            )}
            className="btn btn-accent"
          >
            <Sparkles size={16} />
            {t.common.buildJourney}
          </Link>
        </div>
      </section>
    </>
  );
}
