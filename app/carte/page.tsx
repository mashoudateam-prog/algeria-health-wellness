import type { Metadata } from "next";
import { Eyebrow } from "@/components/badges";
import { AlgeriaMap } from "@/components/algeria-map";

export const metadata: Metadata = {
  title: "Carte santé de l'Algérie",
  description:
    "Explorez les destinations santé de l'Algérie : cliniques, dentaire, rééducation, thermalisme, remise en forme, hébergements adaptés.",
};

export default function CartePage() {
  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>Algeria Health Map</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
          Le territoire, lu par
          <br />
          la santé et le bien-être.
        </h1>
        <p className="lede mt-6">
          Filtrez par type de structure et découvrez comment se répartit l&apos;offre entre
          littoral, hauts plateaux et Sahara.
        </p>
      </div>

      <div className="mt-12">
        <AlgeriaMap />
      </div>
    </section>
  );
}
