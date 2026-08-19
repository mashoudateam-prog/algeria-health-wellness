import { ArrowUpRight, CalendarDays, MapPin, Plus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge, Eyebrow } from "@/components/badges";
import { Reveal } from "@/components/reveal";
import { newsStore } from "@/lib/news/store";
import { NEWS_CATEGORY_LABEL, NEWS_ORIGIN_LABEL, type NewsItem } from "@/types/news";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Événements, festivals, ouvertures et cures saisonnières en Algérie : une veille éditoriale vérifiée avant publication.",
};

const CATEGORY_TONE: Record<string, string> = {
  cure: "#2f5f73",
  festival: "#9a6845",
  gastronomie: "#9a6845",
  ouverture: "#17382f",
  promotion: "#7d927b",
  evenement: "#17382f",
};

export default async function ActualitesPage() {
  const items = await newsStore.list("publie");

  return (
    <section className="shell section-tight">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow>Le fil</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
            Ce qui se passe en Algérie,
            <br />
            côté santé et bien-être.
          </h1>
          <p className="lede mt-6">
            Festivals, cures saisonnières, nouvelles adresses, rendez-vous gastronomiques.
            Une veille automatisée propose ; une personne vérifie avant publication.
          </p>
        </div>

        <Link href="/actualites/proposer" className="btn btn-ghost">
          <Plus size={15} />
          Proposer un événement
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="card mt-12 p-8 text-[0.92rem] leading-7 muted">
          Aucune actualité publiée pour le moment. La veille tourne chaque jour et les
          propositions sont examinées avant d&apos;apparaître ici.
        </p>
      ) : (
        <ol className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item, index) => (
            <Reveal key={item.id} delay={index * 0.04}>
              <NewsCard item={item} />
            </Reveal>
          ))}
        </ol>
      )}

      <div
        className="mt-14 rounded-[28px] border p-7"
        style={{ borderColor: "var(--border)", background: "var(--surface-soft)" }}
      >
        <h2 className="text-[1.1rem]">Comment ce fil est constitué</h2>
        <p className="mt-3 max-w-3xl text-[0.88rem] leading-7 muted">
          Un agent parcourt chaque jour des flux de presse algériens, une recherche web
          ciblée et les soumissions de nos partenaires. Il écarte automatiquement ce qui
          n&apos;a pas de source vérifiable, ce qui sort du périmètre santé et bien-être,
          et les doublons. Ce qui reste est <strong>proposé</strong>, jamais publié : une
          personne relit et décide. Aucune information ne paraît ici sans avoir été
          validée, et chaque élément affiche sa source.
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

function NewsCard({ item }: { item: NewsItem }) {
  const tone = CATEGORY_TONE[item.category] ?? "var(--primary)";

  return (
    <li className="card flex h-full flex-col p-6">
      <div className="flex flex-wrap items-center gap-2">
        <span className="badge" style={{ color: tone, borderColor: `${tone}44` }}>
          {NEWS_CATEGORY_LABEL[item.category]}
        </span>
        {item.demo && <DemoBadge />}
      </div>

      <h2 className="mt-4 text-[1.12rem] leading-snug">{item.title}</h2>
      <p className="mt-3 flex-1 text-[0.88rem] leading-6 muted">{item.summary}</p>

      <dl className="mt-5 space-y-1.5 border-t pt-4 text-[0.8rem]" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2">
          <dt className="sr-only">Lieu</dt>
          <MapPin size={13} className="shrink-0 faint" />
          <dd>{item.locationLabel}</dd>
        </div>
        {item.startsOn && (
          <div className="flex items-center gap-2">
            <dt className="sr-only">Date</dt>
            <CalendarDays size={13} className="shrink-0 faint" />
            <dd>{formatRange(item.startsOn, item.endsOn)}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4 flex items-center justify-between gap-3 text-[0.76rem] faint">
        <span>
          {NEWS_ORIGIN_LABEL[item.origin]} · {item.sourceName}
        </span>
        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center gap-1 underline"
          >
            Source
            <ArrowUpRight size={12} />
          </a>
        )}
      </div>
    </li>
  );
}

function formatRange(startsOn: string, endsOn: string | null): string {
  const format = (iso: string) =>
    new Date(`${iso}T00:00:00Z`).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return endsOn ? `Du ${format(startsOn)} au ${format(endsOn)}` : format(startsOn);
}
