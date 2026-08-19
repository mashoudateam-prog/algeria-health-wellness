import { ArrowRight, Landmark, MapPin, Timer } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/badges";
import { Reveal } from "@/components/reveal";
import { DESTINATION_BY_SLUG } from "@/data/destinations";
import { HERITAGE_EFFORT_LABEL, HERITAGE_SITES } from "@/data/heritage";
import { hasImmersive } from "@/lib/immersive";

export const metadata: Metadata = {
  title: "Patrimoine",
  description:
    "Les sept sites algériens inscrits au patrimoine mondial et les grands lieux du pays, intégrés à votre séjour selon la distance, l'effort et la durée.",
};

export default function PatrimoinePage() {
  const unesco = HERITAGE_SITES.filter((site) => site.kind === "unesco");
  const majeurs = HERITAGE_SITES.filter((site) => site.kind === "site-majeur");

  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>Patrimoine</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
          Sept sites au patrimoine mondial.
          <br />
          <span style={{ color: "var(--sage, #7d927b)" }}>Et le temps de les voir.</span>
        </h1>
        <p className="lede mt-6">
          Un séjour de santé laisse des journées libres. Elles ne sont pas du temps mort :
          chaque site est rattaché à une destination, avec sa distance, l&apos;effort de
          marche qu&apos;il demande et la durée à prévoir. Le planificateur s&apos;en sert
          pour ne proposer que ce qui tient dans votre journée.
        </p>
      </div>

      <h2 className="mt-16 text-[clamp(1.6rem,3.2vw,2.3rem)]">
        Inscrits au patrimoine mondial
      </h2>
      <p className="mt-3 text-[0.9rem] muted">
        Sept sites, de la Casbah d&apos;Alger au Tassili n&apos;Ajjer.
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {unesco.map((site, index) => (
          <Reveal key={site.slug} delay={index * 0.04}>
            <SiteCard site={site} />
          </Reveal>
        ))}
      </div>

      <h2 className="mt-20 text-[clamp(1.6rem,3.2vw,2.3rem)]">Autres lieux majeurs</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {majeurs.map((site, index) => (
          <Reveal key={site.slug} delay={index * 0.04}>
            <SiteCard site={site} />
          </Reveal>
        ))}
      </div>

      <div
        className="mt-16 rounded-[28px] border p-7"
        style={{ borderColor: "var(--border)", background: "var(--surface-soft)" }}
      >
        <h2 className="text-[1.1rem]">Ce que nous n&apos;affichons pas</h2>
        <p className="mt-3 max-w-3xl text-[0.88rem] leading-7 muted">
          Ni horaires, ni tarifs, ni jours de fermeture : ces informations changent et nous
          ne les avons pas à jour. Les durées indiquées sont des estimations de confort,
          pas des durées officielles. Vérifiez auprès du site avant de vous déplacer.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function SiteCard({ site }: { site: (typeof HERITAGE_SITES)[number] }) {
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
          <span className="badge">Site majeur</span>
        )}
        {immersive && <span className="badge">Immersion disponible</span>}
      </div>

      <h3 className="mt-3.5 text-[1.2rem] leading-snug">{site.name}</h3>
      <p className="mt-1 text-[0.78rem] faint">{site.wilayaName}</p>
      <p className="mt-3 flex-1 text-[0.88rem] leading-6 muted">{site.summary}</p>

      <dl className="mt-5 space-y-1.5 border-t pt-4 text-[0.8rem]" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Depuis</dt>
          <MapPin size={13} className="shrink-0 faint" />
          <dd>
            {site.distanceKm === 0
              ? `Sur place à ${destination?.name ?? site.wilayaName}`
              : `${site.distanceKm} km depuis ${destination?.name ?? site.wilayaName}`}
          </dd>
        </div>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Durée et effort</dt>
          <Timer size={13} className="shrink-0 faint" />
          <dd>
            {site.hours >= 24 ? `${Math.round(site.hours / 24)} jours` : `${site.hours} h`} ·{" "}
            {HERITAGE_EFFORT_LABEL[site.effort]}
          </dd>
        </div>
      </dl>

      <Link href={`/patrimoine/${site.slug}`} className="btn btn-quiet mt-4 self-start text-[0.82rem]">
        Découvrir
        <ArrowRight size={14} />
      </Link>
    </article>
  );
}
