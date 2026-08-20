import { ArrowRight, Info, MapPin, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/badges";
import { PhotoPlate } from "@/components/photo-plate";
import { Reveal } from "@/components/reveal";
import { DESTINATION_BY_SLUG } from "@/data/destinations";
import { GOAL_BY_ID } from "@/data/goals";
import { UNIVERSES } from "@/data/universes";
import { localizePath } from "@/lib/i18n/config";
import { localizedGoal, localizedUniverse } from "@/lib/i18n/content";
import { getTranslation } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.universes.title, description: t.meta.universes.description };
}

export default async function UniversPage() {
  const { locale, t } = await getTranslation();
  const link = (href: string) => localizePath(href, locale);
  const universes = UNIVERSES.map((entry) => localizedUniverse(entry, locale));

  return (
    <>
      <section className="shell pb-10 pt-12">
        <div className="max-w-2xl">
          <Eyebrow>{t.universes.eyebrow}</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
            {t.universes.title1}
            <br />
            <span style={{ color: "var(--sage, #7d927b)" }}>{t.universes.title2}</span>
          </h1>
          <p className="lede mt-6">
            {t.universes.lede}
          </p>
        </div>
      </section>

      {universes.map((universe, index) => (
        <section
          key={universe.slug}
          className="section-tight"
          style={index % 2 === 1 ? { background: "var(--surface)" } : undefined}
        >
          <div className="shell">
            <Reveal>
              <article
                className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-14 ${
                  index % 2 === 1 ? "lg:[&>figure]:order-2" : ""
                }`}
              >
                <PhotoPlate
                  slug={universe.photoSlug}
                  alt={universe.name}
                  caption={universe.name}
                  overline="Univers"
                  index={index + 1}
                  scrim="bottom"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-[20rem] lg:h-[26rem]"
                />

                <div>
                  <span
                    className="text-[0.62rem] uppercase tracking-[0.24em]"
                    style={{ color: universe.accent }}
                  >
                    {String(index + 1).padStart(2, "0")} — {t.universes.eyebrow}
                  </span>

                  <h2 className="mt-3 text-[clamp(1.7rem,3.4vw,2.5rem)]">{universe.name}</h2>
                  <p className="mt-2 text-[1.05rem]" style={{ color: "var(--sage, #7d927b)" }}>
                    {universe.claim}
                  </p>

                  <p className="mt-5 leading-7 muted">{universe.description}</p>

                  <h3 className="mt-7 text-[0.64rem] uppercase tracking-[0.2em] faint">
                    {t.universes.allows}
                  </h3>
                  <ul className="mt-3 space-y-2 text-[0.9rem] leading-6">
                    {universe.suitedFor.map((entry) => (
                      <li key={entry} className="flex gap-2.5">
                        <span aria-hidden="true" style={{ color: universe.accent }}>
                          —
                        </span>
                        {entry}
                      </li>
                    ))}
                  </ul>

                  <p
                    className="mt-6 flex items-start gap-2.5 rounded-2xl px-4 py-3.5 text-[0.84rem] leading-6"
                    style={{ background: "var(--surface-soft)" }}
                  >
                    <Info size={15} className="mt-0.5 shrink-0" style={{ color: universe.accent }} />
                    {universe.honestNote}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-1.5">
                    {universe.goals.map((goalId) => {
                      const raw = GOAL_BY_ID.get(goalId);
                      const goal = raw ? localizedGoal(raw, locale) : undefined;
                      return (
                        <span key={goalId} className="badge">
                          <span aria-hidden="true">{goal?.emoji}</span> {goal?.label ?? goalId}
                        </span>
                      );
                    })}
                  </div>

                  <div className="mt-5 flex flex-wrap items-center gap-2 text-[0.82rem] faint">
                    <MapPin size={13} />
                    {universe.destinations
                      .map((slug) => DESTINATION_BY_SLUG.get(slug)?.name ?? slug)
                      .join(" · ")}
                  </div>

                  <Link
                    href={link(`/parcours?goals=${universe.goals.join(",")}&destination=${universe.destinations[0]}`)}
                    className="btn btn-primary group mt-7"
                  >
                    <Sparkles size={15} />
                    {t.universes.buildThis}
                    <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="shell pb-20">
        <div
          className="rounded-[32px] p-8 sm:p-10"
          style={{ background: "var(--surface-deep)", color: "#fff" }}
        >
          <h2 className="text-[clamp(1.4rem,3vw,2rem)]">{t.universes.combineTitle}</h2>
          <p className="mt-3 max-w-2xl text-[0.94rem] leading-7 text-white/60">
            {t.universes.combineBody}
          </p>
          <Link href={link("/parcours")} className="btn btn-accent mt-7">
            {t.universes.combineCta}
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
