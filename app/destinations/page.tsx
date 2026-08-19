import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/badges";
import { PhotoPlate } from "@/components/photo-plate";
import { Reveal } from "@/components/reveal";
import { DESTINATIONS } from "@/data/destinations";
import { REGION_LABEL } from "@/data/geo";
import { GOAL_BY_ID } from "@/data/goals";

export const metadata: Metadata = {
  title: "Destinations santé",
  description:
    "Alger, Oran, Constantine, Tlemcen, Béjaïa, Annaba, Biskra, Ghardaïa : huit destinations pour un séjour de santé, de bien-être ou de remise en forme.",
};

export default function DestinationsPage() {
  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>Health destinations</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
          Huit façons de prendre soin de soi en Algérie.
        </h1>
        <p className="lede mt-6">
          Chaque destination a son climat, son rythme et ses points forts. Le bon choix
          dépend moins de la ville que de ce que vous venez y faire.
        </p>
      </div>

      <div className="mt-14 space-y-16">
        {DESTINATIONS.map((destination, index) => (
          <Reveal key={destination.slug} delay={0.03}>
            <article
              className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                index % 2 === 1 ? "lg:[&>figure]:order-2" : ""
              }`}
            >
              <PhotoPlate
                slug={destination.slug}
                alt={destination.photo.alt}
                caption={destination.name}
                overline={REGION_LABEL[destination.region]}
                index={index + 1}
                scrim="bottom"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-[22rem] lg:h-[29rem]"
              />

              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.24em]" style={{ color: "var(--accent)" }}>
                  {REGION_LABEL[destination.region]}
                </p>
                <h2 className="mt-3 text-[clamp(1.8rem,3.6vw,2.6rem)]">{destination.name}</h2>
                <p className="mt-2 text-[1.02rem]" style={{ color: "var(--sage, #7d927b)" }}>
                  {destination.tagline}
                </p>
                <p className="mt-5 leading-7 muted">{destination.intro}</p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {destination.strengths.slice(0, 5).map((goalId) => (
                    <li key={goalId} className="badge">
                      {GOAL_BY_ID.get(goalId)?.label ?? goalId}
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/destinations/${destination.slug}`}
                  className="btn btn-quiet group mt-7"
                >
                  Découvrir {destination.name}
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
