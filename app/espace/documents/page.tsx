import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge, Eyebrow } from "@/components/badges";
import { DocumentVault } from "@/components/document-vault";

export const metadata: Metadata = {
  title: "Health Passport",
  description:
    "Centralisez vos documents médicaux, ouvrez un accès temporaire à un praticien, révoquez-le quand vous voulez, et consultez le journal des accès.",
};

export default function DocumentsPage() {
  return (
    <section className="shell section-tight">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl">
          <Eyebrow>Health Passport</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">Vos documents, sous votre contrôle</h1>
          <p className="lede mt-5">
            Un partage est nominatif, limité dans le temps et révocable à tout instant.
            Chaque geste — le vôtre comme celui d&apos;un praticien — est inscrit au journal.
          </p>
        </div>
        <DemoBadge label="Documents de démonstration" />
      </div>

      <div className="mt-10">
        <DocumentVault />
      </div>

      <p className="mt-12 max-w-3xl text-[0.82rem] leading-6 faint">
        Dans cette démonstration, l&apos;état vit dans votre navigateur et rien n&apos;est
        transmis. Une mise en production exige un chiffrement au repos, un contrôle
        d&apos;accès appliqué côté serveur et un journal inaltérable —{" "}
        <Link href="/confiance#donnees" className="underline">
          voir le centre de confiance
        </Link>
        .
      </p>
    </section>
  );
}
