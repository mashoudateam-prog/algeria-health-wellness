import { Accessibility, Globe, MapPin, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBadge, Eyebrow, VerificationBadge } from "@/components/badges";
import { DESTINATION_BY_SLUG } from "@/data/destinations";
import {
  FACILITIES,
  FACILITY_BY_SLUG,
  FACILITY_KIND_LABEL,
  professionalsForFacility,
} from "@/data/facilities";

export function generateStaticParams() {
  return FACILITIES.map((facility) => ({ slug: facility.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const facility = FACILITY_BY_SLUG.get(slug);
  if (!facility) return { title: "Fiche introuvable" };
  return { title: facility.name, description: facility.summary };
}

const TIER_LABEL = ["", "Positionnement essentiel", "Positionnement confort", "Positionnement premium"];

export default async function FacilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const facility = FACILITY_BY_SLUG.get(slug);
  if (!facility) notFound();

  const destination = DESTINATION_BY_SLUG.get(facility.destinationSlug);
  const team = professionalsForFacility(facility.id);

  return (
    <section className="shell section-tight">
      <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr]">
        <div>
          <Eyebrow>{FACILITY_KIND_LABEL[facility.kind]}</Eyebrow>
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

          <h2 className="mt-10 text-[1.3rem]">Spécialités déclarées</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {facility.specialties.map((specialty) => (
              <li key={specialty} className="badge">
                {specialty}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-[1.3rem]">Services d&apos;accompagnement</h2>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {facility.services.map((service) => (
              <li key={service} className="card-soft px-4 py-3 text-[0.88rem] leading-6">
                {service}
              </li>
            ))}
          </ul>

          <h2 className="mt-10 text-[1.3rem]">Accessibilité</h2>
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
              <h2 className="mt-10 text-[1.3rem]">Praticiens rattachés</h2>
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
                        <dt>Expérience déclarée</dt>
                        <dd>{professional.experienceYears} ans</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt>Langues</dt>
                        <dd>{professional.languages.join(", ")}</dd>
                      </div>
                      <div className="flex gap-2">
                        <dt>Second avis</dt>
                        <dd>{professional.acceptsSecondOpinion ? "Accepté" : "Non proposé"}</dd>
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
            <h2 className="text-[0.66rem] uppercase tracking-[0.22em] faint">En résumé</h2>
            <dl className="mt-4 space-y-3.5 text-[0.88rem]">
              <div>
                <dt className="faint">Langues d&apos;accueil</dt>
                <dd className="mt-0.5 flex items-center gap-2">
                  <Globe size={14} />
                  {facility.languages.join(", ")}
                </dd>
              </div>
              <div>
                <dt className="faint">Patients internationaux</dt>
                <dd className="mt-0.5">
                  {facility.internationalPatients ? "Prise en charge déclarée" : "Non déclaré"}
                </dd>
              </div>
              <div>
                <dt className="faint">Niveau de positionnement</dt>
                <dd className="mt-0.5">{TIER_LABEL[facility.priceTier]}</dd>
              </div>
            </dl>

            <div className="mt-6 border-t pt-5" style={{ borderColor: "var(--border)" }}>
              <h3 className="text-[0.66rem] uppercase tracking-[0.22em] faint">Ce qui a été vérifié</h3>
              <ul className="mt-3 space-y-1.5 text-[0.82rem] leading-5 muted">
                {facility.verification.checks.map((check) => (
                  <li key={check}>{check}</li>
                ))}
              </ul>
            </div>

            <Link
              href={`/parcours?q=${encodeURIComponent(`Un séjour à ${destination?.name ?? "Alger"}`)}`}
              className="btn btn-primary mt-6 w-full"
            >
              <Sparkles size={15} />
              Intégrer à un parcours
            </Link>
            <Link href="/concierge" className="btn btn-ghost mt-2.5 w-full">
              Parler à un conseiller
            </Link>
          </div>

          <p className="mt-4 text-[0.76rem] leading-5 faint">
            Aucun tarif, aucune disponibilité et aucune certification ne sont affichés tant
            qu&apos;ils n&apos;ont pas été fournis et datés par l&apos;établissement.
          </p>
        </aside>
      </div>
    </section>
  );
}
