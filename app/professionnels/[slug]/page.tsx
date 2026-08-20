import { Accessibility, Globe, MapPin, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBadge, Eyebrow, VerificationBadge } from "@/components/badges";
import { DESTINATION_BY_SLUG } from "@/data/destinations";
import { FACILITIES, FACILITY_BY_SLUG, professionalsForFacility } from "@/data/facilities";
import { localizePath } from "@/lib/i18n/config";
import { localizedDestination, localizedFacility, localizedProfessional } from "@/lib/i18n/content";
import { getTranslation } from "@/lib/i18n/server";

export function generateStaticParams() {
  return FACILITIES.map((facility) => ({ slug: facility.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { locale, t } = await getTranslation();
  const found = FACILITY_BY_SLUG.get(slug);
  if (!found) return { title: t.directory.notFound };
  const facility = localizedFacility(found, locale);
  return { title: facility.name, description: facility.summary };
}

export default async function FacilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = FACILITY_BY_SLUG.get(slug);
  if (!found) notFound();

  const { locale, t } = await getTranslation();
  const link = (href: string) => localizePath(href, locale);
  const facility = localizedFacility(found, locale);

  const nearest = DESTINATION_BY_SLUG.get(facility.destinationSlug);
  const destination = nearest ? localizedDestination(nearest, locale) : undefined;
  const team = professionalsForFacility(facility.id).map((entry) => localizedProfessional(entry, locale));

  return (
    <section className="shell section-tight">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <Eyebrow>{t.facilityKinds[facility.kind]}</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,4.6vw,3.2rem)]">{facility.name}</h1>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <VerificationBadge verification={facility.verification} />
            {facility.demo && <DemoBadge />}
            {destination && (
              <span className="badge">
                <MapPin size={13} />
                {destination.name}
              </span>
            )}
          </div>

          <p className="mt-7 max-w-2xl text-[1.02rem] leading-8 muted">{facility.summary}</p>

          <h2 className="mt-10 text-[1.3rem]">{t.directory.declaredSpecialties}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {facility.specialties.map((specialty) => (
              <li key={specialty} className="badge">
                {specialty}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-[1.3rem]">{t.directory.services}</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {facility.services.map((service) => (
              <li key={service} className="card-soft px-4 py-3 text-[0.88rem] leading-6">
                {service}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-[1.3rem]">{t.directory.accessibility}</h2>
          <ul className="mt-4 space-y-2 text-[0.9rem] leading-6 muted">
            {facility.accessibility.map((entry) => (
              <li key={entry} className="flex items-start gap-2.5">
                <Accessibility size={16} className="mt-0.5 shrink-0" style={{ color: "var(--secondary)" }} />
                {entry}
              </li>
            ))}
          </ul>

          {team.length > 0 && (
            <>
              <h2 className="mt-10 text-[1.3rem]">{t.directory.attachedPractitioners}</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {team.map((professional) => (
                  <article key={professional.id} className="card p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <VerificationBadge verification={professional.verification} />
                      {professional.demo && <DemoBadge />}
                    </div>
                    <h3 className="mt-3 text-[1.05rem]">{professional.name}</h3>
                    <p className="mt-1 text-[0.86rem] muted">{professional.specialty}</p>
                    <dl className="mt-3.5 space-y-1 text-[0.78rem] faint">
                      <div className="flex gap-2">
                        <dt>{t.directory.declaredExperience}</dt>
                        <dd>
                          {professional.experienceYears} {t.directory.years}
                        </dd>
                      </div>
                      <div className="flex gap-2">
                        <dt>{t.directory.languages}</dt>
                        <dd>{professional.languages.join(", ")}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt>{t.directory.secondOpinion}</dt>
                        <dd>
                          {professional.acceptsSecondOpinion
                            ? t.directory.secondOpinionYes
                            : t.directory.secondOpinionNo}
                        </dd>
                      </div>
                    </dl>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="card p-6">
            <h2 className="text-[0.66rem] uppercase tracking-[0.22em] faint">{t.directory.inBrief}</h2>
            <dl className="mt-4 space-y-3.5 text-[0.88rem]">
              <div>
                <dt className="faint">{t.directory.hostLanguages}</dt>
                <dd className="mt-0.5 flex items-center gap-2">
                  <Globe size={14} />
                  {facility.languages.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="faint">{t.directory.internationalPatients}</dt>
                <dd className="mt-0.5">
                  {facility.internationalPatients
                    ? t.directory.internationalDeclared
                    : t.directory.notDeclared}
                </dd>
              </div>
              <div>
                <dt className="faint">{t.directory.positioning}</dt>
                <dd className="mt-0.5">{t.tiers[facility.priceTier]}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[0.66rem] uppercase tracking-[0.22em] faint">
                {t.directory.whatWasVerified}
              </h3>
              <ul className="mt-3 space-y-1.5 text-[0.82rem] leading-5 muted">
                {facility.verification.checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            </div>

            <Link
              href={link(
                `/parcours?q=${encodeURIComponent(t.directory.stayIn(destination?.name ?? "Alger"))}`,
              )}
              className="btn btn-primary mt-6 w-full"
            >
              <Sparkles size={15} />
              {t.directory.addToJourney}
            </Link>
            <Link href={link("/concierge")} className="btn btn-ghost mt-2.5 w-full">
              {t.common.talkToAdviser}
            </Link>
          </div>

          <p className="mt-4 text-[0.76rem] leading-5 faint">{t.directory.noPricingNotice}</p>
        </aside>
      </div>
    </section>
  );
}
