import type { Metadata } from "next";
import { Eyebrow } from "@/components/badges";
import { NewsSubmitForm } from "@/components/news-submit-form";

export const metadata: Metadata = {
  title: "Proposer un événement",
  description:
    "Vous organisez un événement, ouvrez un établissement ou lancez une offre en Algérie ? Proposez-le pour le fil d'actualité.",
};

export default function ProposerPage() {
  return (
    <section className="shell section-tight">
      <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-16">
        <div>
          <Eyebrow>Partenaires</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">
            Vous avez quelque chose à annoncer&nbsp;?
          </h1>
          <p className="lede mt-5">
            Une ouverture, un festival, une cure saisonnière, un rendez-vous gastronomique.
            Vous connaissez les détails mieux que n&apos;importe quelle veille automatique.
          </p>

          <div className="mt-9">
            <NewsSubmitForm />
          </div>
        </div>

        <aside className="lg:sticky lg:top-28 lg:h-fit">
          <div className="card-soft p-6">
            <h2 className="text-[0.66rem] uppercase tracking-[0.22em] faint">
              Ce que nous publions
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.86rem] leading-6">
              {[
                "Ce qui a un lien vérifiable",
                "Ce qui se passe en Algérie",
                "Ce qui touche la santé, le bien-être, la forme ou la gastronomie",
                "Ce qui a une date ou une adresse identifiable",
              ].map((entry) => (
                <li key={entry} className="flex gap-2.5">
                  <span aria-hidden="true" style={{ color: "var(--secondary)" }}>
                    +
                  </span>
                  {entry}
                </li>
              ))}
            </ul>

            <h2 className="mt-7 text-[0.66rem] uppercase tracking-[0.22em] faint">
              Ce que nous écartons
            </h2>
            <ul className="mt-4 space-y-2.5 text-[0.86rem] leading-6 muted">
              {[
                "Les annonces sans source consultable",
                "Les promesses de résultat de santé",
                "Les tarifs présentés comme garantis",
                "Les publications purement publicitaires",
              ].map((entry) => (
                <li key={entry} className="flex gap-2.5">
                  <span aria-hidden="true" className="faint">
                    ×
                  </span>
                  {entry}
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t pt-4 text-[0.76rem] leading-5 faint" style={{ borderColor: "var(--border)" }}>
              Toute proposition est relue avant publication. Nous ne facturons pas la
              parution et une proposition acceptée ne vaut pas recommandation de notre
              part.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
