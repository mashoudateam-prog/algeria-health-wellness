import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge, Eyebrow } from "@/components/badges";
import { Reveal } from "@/components/reveal";
import { DESTINATION_BY_SLUG } from "@/data/destinations";
import { GOAL_BY_ID } from "@/data/goals";
import { RETREATS } from "@/data/retreats";
import { formatDZD } from "@/lib/ai/quote";
import type { Intensity } from "@/types/domain";

export const metadata: Metadata = {
  title: "Séjours bien-être",
  description:
    "Reset, Sleep, Fit, Recovery, Mind & Body, Digital Break : des séjours de 3 à 10 jours construits autour d'un rythme, pas d'une promesse.",
};

const INTENSITY_LABEL: Record<Intensity, string> = {
  repos: "Repos",
  douce: "Intensité douce",
  moderee: "Intensité modérée",
  soutenue: "Intensité soutenue",
};

export default function SejoursPage() {
  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>Wellness retreats</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
          Des séjours construits autour d&apos;un rythme.
        </h1>
        <p className="lede mt-6">
          Chaque programme décrit une durée, des activités et un niveau d&apos;intensité —
          jamais un effet physiologique promis. Un séjour organise votre temps ; il ne
          soigne pas à votre place.
        </p>
      </div>

      <div className="mt-8">
        <DemoBadge label="Programmes de démonstration — fourchettes indicatives" />
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {RETREATS.map((retreat, index) => {
          const destination = DESTINATION_BY_SLUG.get(retreat.destinationSlug);
          return (
            <Reveal key={retreat.slug} delay={index * 0.04}>
              <article className="card flex h-full flex-col p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge">{retreat.days} jours</span>
                  <span className="badge">{INTENSITY_LABEL[retreat.intensity]}</span>
                </div>

                <h2 className="mt-5 serif text-[2rem] leading-none">{retreat.name}</h2>
                <p className="mt-3 text-[0.95rem] leading-6 muted">{retreat.claim}</p>
                <p className="mt-4 text-[0.8rem] faint">{destination?.name}</p>

                <h3 className="mt-6 text-[0.64rem] uppercase tracking-[0.2em] faint">Inclus</h3>
                <ul className="mt-3 space-y-2 text-[0.85rem] leading-6">
                  {retreat.includes.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span aria-hidden="true" style={{ color: "var(--accent)" }}>
                        —
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>

                <h3 className="mt-6 text-[0.64rem] uppercase tracking-[0.2em] faint">Déroulé</h3>
                <ol className="mt-3 space-y-1.5 text-[0.82rem] leading-5 muted">
                  {retreat.rhythm.map((day, dayIndex) => (
                    <li key={day} className="flex gap-2.5">
                      <span className="tabular-nums faint">J{dayIndex + 1}</span>
                      {day}
                    </li>
                  ))}
                </ol>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {retreat.goals.map((goalId) => (
                    <li key={goalId} className="badge">
                      {GOAL_BY_ID.get(goalId)?.label ?? goalId}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t pt-5" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[0.64rem] uppercase tracking-[0.2em] faint">Estimation</p>
                  <p className="mt-1 text-[1.02rem] tabular-nums">
                    {formatDZD(retreat.estimateMin)} – {formatDZD(retreat.estimateMax)}
                  </p>
                  <Link
                    href={`/parcours?q=${encodeURIComponent(
                      `${retreat.name} : ${retreat.days} jours à ${destination?.name ?? "Alger"}`,
                    )}`}
                    className="btn btn-quiet group mt-4 text-[0.84rem]"
                  >
                    Adapter à mon cas
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-12 max-w-3xl text-[0.84rem] leading-6 faint">
        Ces montants sont des ordres de grandeur destinés à la démonstration. Ils ne
        proviennent d&apos;aucun établissement réel et ne constituent pas un devis. Le
        vocabulaire employé évite volontairement les promesses non étayées : nous ne
        parlons pas de « detox », terme sans définition médicale établie, mais du rythme
        réellement proposé.
      </p>
    </section>
  );
}
