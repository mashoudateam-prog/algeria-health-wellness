import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge, Eyebrow, VerificationBadge } from "@/components/badges";
import { DESTINATION_BY_SLUG } from "@/data/destinations";
import { FACILITIES, FACILITY_KIND_LABEL, PROFESSIONALS } from "@/data/facilities";

export const metadata: Metadata = {
  title: "Établissements et professionnels",
  description:
    "Annuaire des établissements et praticiens : spécialités, langues d'accueil, services d'accompagnement et statut de vérification.",
};

export default function ProfessionnelsPage() {
  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>Annuaire</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
          Établissements et professionnels
        </h1>
        <p className="lede mt-6">
          Une liste consultée n&apos;est pas une recommandation. Ici, aucun score : chaque
          fiche indique ce qui a été vérifié, et ce qui reste déclaratif.
        </p>
      </div>

      <div className="mt-8">
        <DemoBadge label="Catalogue de démonstration — établissements fictifs" />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {FACILITIES.map((facility) => {
          const destination = DESTINATION_BY_SLUG.get(facility.destinationSlug);
          const team = PROFESSIONALS.filter((professional) => professional.facilityId === facility.id);

          return (
            <article key={facility.id} className="card flex flex-col p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{FACILITY_KIND_LABEL[facility.kind]}</span>
                <VerificationBadge verification={facility.verification} />
              </div>

              <h2 className="mt-3.5 text-[1.16rem] leading-snug">{facility.name}</h2>
              <p className="mt-1 text-[0.8rem] faint">{destination?.name}</p>
              <p className="mt-3 flex-1 text-[0.86rem] leading-6 muted">{facility.summary}</p>

              <dl className="mt-5 space-y-1.5 border-t pt-4 text-[0.78rem]" style={{ borderColor: "var(--border)" }}>
                <div className="flex gap-2">
                  <dt className="faint">Langues</dt>
                  <dd>{facility.languages.join(", ")}</dd>
                </div>
                {team.length > 0 && (
                  <div className="flex gap-2">
                    <dt className="faint">Praticiens</dt>
                    <dd>{team.length}</dd>
                  </div>
                )}
                <div className="flex gap-2">
                  <dt className="faint">International</dt>
                  <dd>{facility.internationalPatients ? "Oui" : "Non déclaré"}</dd>
                </div>
              </dl>

              <Link
                href={`/professionnels/${facility.slug}`}
                className="btn btn-quiet mt-4 self-start text-[0.82rem]"
              >
                Voir la fiche
                <ArrowRight size={14} />
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
