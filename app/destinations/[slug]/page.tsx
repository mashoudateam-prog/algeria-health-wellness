import { ArrowRight, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoBadge, Eyebrow, VerificationBadge } from "@/components/badges";
import { PhotoPlate } from "@/components/photo-plate";
import { Reveal } from "@/components/reveal";
import { DESTINATIONS, getDestination } from "@/data/destinations";
import { FACILITY_KIND_LABEL, facilitiesForDestination } from "@/data/facilities";
import { REGION_LABEL } from "@/data/geo";
import { GOAL_BY_ID } from "@/data/goals";
import { RETREATS } from "@/data/retreats";

export function generateStaticParams() {
  return DESTINATIONS.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) return { title: "Destination introuvable" };

  return {
    title: `${destination.name} — ${destination.tagline}`,
    description: destination.intro,
  };
}

/** Ordre de lecture éditorial : on commence par le soin, on finit par le lieu. */
const SECTIONS = [
  { key: "offreMedicale", title: "L'offre médicale" },
  { key: "bienEtre", title: "Bien-être et récupération" },
  { key: "recuperation", title: "Le rythme sur place" },
  { key: "hebergement", title: "Où loger" },
  { key: "accessibilite", title: "Accessibilité" },
  { key: "transport", title: "Se déplacer" },
  { key: "gastronomie", title: "À table" },
  { key: "patrimoine", title: "Le lieu" },
] as const;

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const destination = getDestination(slug);
  if (!destination) notFound();

  const facilities = facilitiesForDestination(destination.slug);
  const retreats = RETREATS.filter((retreat) => retreat.destinationSlug === destination.slug);

  return (
    <>
      <section className="shell grid items-end gap-10 pb-14 pt-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <Eyebrow>{REGION_LABEL[destination.region]}</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.4rem,6vw,4.2rem)]">{destination.name}</h1>
          <p className="mt-4 text-[clamp(1.1rem,2.4vw,1.6rem)] leading-snug" style={{ color: "var(--sage, #7d927b)" }}>
            {destination.tagline}
          </p>
          <p className="mt-7 max-w-xl leading-8 muted">{destination.intro}</p>

          <ul className="mt-7 flex flex-wrap gap-2">
            {destination.bestFor.map((entry) => (
              <li key={entry} className="badge">
                {entry}
              </li>
            ))}
          </ul>
        </div>

        <PhotoPlate
          slug={destination.slug}
          alt={destination.photo.alt}
          caption={destination.name}
          overline={destination.tagline}
          priority
          className="h-[26rem] lg:h-[32rem]"
        />
      </section>

      {/* Spécialités */}
      <section className="border-y" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="shell section-tight">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-[clamp(1.6rem,3.2vw,2.3rem)]">Ce pour quoi on y vient</h2>
              <p className="mt-4 max-w-md leading-7 muted">
                Les objectifs auxquels cette destination répond le mieux, et les spécialités
                déclarées par les structures de la région.
              </p>
            </div>
            <div>
              <h3 className="text-[0.66rem] uppercase tracking-[0.22em] faint">Objectifs adaptés</h3>
              <ul className="mt-3.5 flex flex-wrap gap-2">
                {destination.strengths.map((goalId) => {
                  const goal = GOAL_BY_ID.get(goalId);
                  return (
                    <li key={goalId} className="badge">
                      <span aria-hidden="true">{goal?.emoji}</span> {goal?.label ?? goalId}
                    </li>
                  );
                })}
              </ul>

              <h3 className="mt-8 text-[0.66rem] uppercase tracking-[0.22em] faint">
                Spécialités présentes dans la région
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
          {SECTIONS.map((section, index) => (
            <Reveal key={section.key} delay={index * 0.03}>
              <article>
                <h2 className="serif text-[1.35rem] leading-snug">{section.title}</h2>
                <p className="mt-3.5 leading-7 muted">{destination.editorial[section.key]}</p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14">
            <h2 className="serif text-[1.35rem] leading-snug">À voir, à vivre</h2>
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
              <h2 className="text-[clamp(1.6rem,3.2vw,2.3rem)]">Structures référencées</h2>
              <DemoBadge label="Catalogue de démonstration" />
            </div>
            <p className="mt-3 max-w-2xl text-[0.9rem] leading-7 muted">
              Ces fiches sont fictives et servent uniquement à rendre l&apos;interface
              démontrable. Aucun établissement réel n&apos;est nommé tant que des partenaires
              vérifiés ne sont pas intégrés.
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {facilities.map((facility) => (
                <article key={facility.id} className="card flex flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge">{FACILITY_KIND_LABEL[facility.kind]}</span>
                    <VerificationBadge verification={facility.verification} />
                  </div>
                  <h3 className="mt-3.5 text-[1.14rem] leading-snug">{facility.name}</h3>
                  <p className="mt-2.5 flex-1 text-[0.86rem] leading-6 muted">{facility.summary}</p>
                  <p className="mt-4 text-[0.76rem] faint">
                    Langues : {facility.languages.join(", ")}
                  </p>
                  <Link
                    href={`/professionnels/${facility.slug}`}
                    className="btn btn-quiet mt-4 self-start text-[0.82rem]"
                  >
                    Voir la fiche
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
          <h2 className="text-[clamp(1.6rem,3.2vw,2.3rem)]">Séjours proposés ici</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {retreats.map((retreat) => (
              <Link key={retreat.slug} href="/sejours" className="card group p-6 transition-transform hover:-translate-y-0.5">
                <span className="badge">{retreat.days} jours</span>
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
            <h2 className="text-[clamp(1.4rem,3vw,2rem)]">Construire un séjour à {destination.name}</h2>
            <p className="mt-2.5 max-w-lg text-[0.92rem] leading-7 text-white/55">
              Indiquez vos objectifs : le parcours, les professionnels et l&apos;estimation
              se construisent en quelques secondes.
            </p>
          </div>
          <Link href={`/parcours?q=${encodeURIComponent(`Un séjour à ${destination.name}`)}`} className="btn btn-accent">
            <Sparkles size={16} />
            Construire mon parcours
          </Link>
        </div>
      </section>
    </>
  );
}
