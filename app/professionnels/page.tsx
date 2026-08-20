import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge, Eyebrow, VerificationBadge } from "@/components/badges";
import { DESTINATION_BY_SLUG } from "@/data/destinations";
import { FACILITIES, PROFESSIONALS } from "@/data/facilities";
import { localizePath } from "@/lib/i18n/config";
import { localizedDestination, localizedFacility } from "@/lib/i18n/content";
import { getTranslation } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.directory.title, description: t.directory.metaDescription };
}

export default async function ProfessionnelsPage() {
  const { locale, t } = await getTranslation();
  const link = (href: string) => localizePath(href, locale);

  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>{t.directory.eyebrow}</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">{t.directory.title}</h1>
        <p className="lede mt-6">{t.directory.lede}</p>
      </div>

      <div className="mt-8">
        <DemoBadge label={t.directory.demoLabel} />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {FACILITIES.map((raw) => {
          const facility = localizedFacility(raw, locale);
          const found = DESTINATION_BY_SLUG.get(facility.destinationSlug);
          const destination = found ? localizedDestination(found, locale) : undefined;
          const team = PROFESSIONALS.filter((professional) => professional.facilityId === facility.id);

          return (
            <article key={facility.id} className="card flex flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{t.facilityKinds[facility.kind]}</span>
                <VerificationBadge verification={facility.verification} />
              </div>

              <h2 className="mt-3.5 text-[1.16rem] leading-snug">{facility.name}</h2>
              <p className="mt-1 text-[0.8rem] faint">{destination?.name}</p>
              <p className="mt-3 flex-1 text-[0.86rem] leading-6 muted">{facility.summary}</p>

              <dl className="mt-5 space-y-1.5 border-t pt-4 text-[0.78rem]" style={{ borderColor: "var(--border)" }}>
                <div className="flex gap-2">
                  <dt className="faint">{t.directory.languages}</dt>
                  <dd>{facility.languages.join(", ")}</dd>
                </div>
                {team.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="faint">{t.directory.practitioners}</dt>
                    <dd>{team.length}</dd>
                  </div>
                )}
                <div className="flex gap-2">
                  <dt className="faint">{t.directory.international}</dt>
                  <dd>{facility.internationalPatients ? t.directory.yes : t.directory.notDeclared}</dd>
                </div>
              </dl>

              <Link
                href={link(`/professionnels/${facility.slug}`)}
                className="btn btn-quiet mt-4 self-start text-[0.82rem]"
              >
                {t.common.seeSheet}
                <ArrowRight size={14} />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
