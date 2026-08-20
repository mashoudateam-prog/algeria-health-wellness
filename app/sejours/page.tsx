import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge, Eyebrow } from "@/components/badges";
import { Reveal } from "@/components/reveal";
import { DESTINATION_BY_SLUG } from "@/data/destinations";
import { GOAL_BY_ID } from "@/data/goals";
import { RETREATS } from "@/data/retreats";
import { formatDZD } from "@/lib/ai/quote";
import { localizePath } from "@/lib/i18n/config";
import { localizedDestination, localizedGoal, localizedRetreat } from "@/lib/i18n/content";
import { getTranslation } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.retreats.title, description: t.meta.retreats.description };
}

export default async function SejoursPage() {
  const { locale, t } = await getTranslation();
  const link = (href: string) => localizePath(href, locale);

  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>{t.retreats.eyebrow}</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">{t.retreats.title}</h1>
        <p className="lede mt-6">{t.retreats.lede}</p>
      </div>

      <div className="mt-8">
        <DemoBadge label={t.retreats.demoLabel} />
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {RETREATS.map((raw, index) => {
          const retreat = localizedRetreat(raw, locale);
          const found = DESTINATION_BY_SLUG.get(retreat.destinationSlug);
          const destination = found ? localizedDestination(found, locale) : undefined;
          return (
            <Reveal key={retreat.slug} delay={index * 0.04}>
              <article className="card flex h-full flex-col p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge">
                    {retreat.days} {t.common.days}
                  </span>
                  <span className="badge">{t.retreats.intensity[retreat.intensity]}</span>
                </div>

                <h2 className="mt-5 serif text-[2rem] leading-none">{retreat.name}</h2>
                <p className="mt-3 text-[0.95rem] leading-6 muted">{retreat.claim}</p>
                <p className="mt-4 text-[0.8rem] faint">{destination?.name}</p>

                <h3 className="mt-6 text-[0.64rem] uppercase tracking-[0.2em] faint">
                  {t.retreats.included}
                </h3>
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

                <h3 className="mt-6 text-[0.64rem] uppercase tracking-[0.2em] faint">
                  {t.retreats.schedule}
                </h3>
                <ol className="mt-3 space-y-1.5 text-[0.82rem] leading-5 muted">
                  {retreat.rhythm.map((day, dayIndex) => (
                    <li key={day} className="flex gap-2.5">
                      <span className="tabular-nums faint">
                        {t.retreats.dayShort}
                        {dayIndex + 1}
                      </span>
                      {day}
                    </li>
                  ))}
                </ol>

                <ul className="mt-6 flex flex-wrap gap-1.5">
                  {retreat.goals.map((goalId) => (
                    <li key={goalId} className="badge">
                      {(() => {
                        const goal = GOAL_BY_ID.get(goalId);
                        return goal ? localizedGoal(goal, locale).label : goalId;
                      })()}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto border-t pt-5" style={{ borderColor: "var(--border)" }}>
                  <p className="text-[0.64rem] uppercase tracking-[0.2em] faint">
                    {t.common.estimate}
                  </p>
                  <p className="mt-1 text-[1.02rem] tabular-nums">
                    {formatDZD(retreat.estimateMin)} – {formatDZD(retreat.estimateMax)}
                  </p>
                  <Link
                    href={link(
                      `/parcours?q=${encodeURIComponent(
                        t.retreats.request(retreat.name, retreat.days, destination?.name ?? "Alger"),
                      )}`,
                    )}
                    className="btn btn-quiet group mt-4 text-[0.84rem]"
                  >
                    {t.retreats.adapt}
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>

      <p className="mt-12 max-w-3xl text-[0.84rem] leading-6 faint">{t.retreats.footnote}</p>
    </section>
  );
}
