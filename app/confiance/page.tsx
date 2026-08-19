import { BadgeCheck, Bot, Eye, KeyRound, Lock, ShieldAlert, Timer } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Eyebrow } from "@/components/badges";
import { providerStatus } from "@/lib/ai/provider";

export const metadata: Metadata = {
  title: "Sécurité et confiance",
  description:
    "Comment vos données sont protégées, comment les professionnels sont vérifiés, et où s'arrête précisément l'intelligence artificielle sur cette plateforme.",
};

const DATA_PRINCIPLES = [
  {
    icon: Lock,
    title: "Vos documents restent les vôtres",
    body: "Ils sont stockés dans votre espace et ne sont transmis à personne sans une action explicite de votre part. Aucun partage n'est automatique, aucun n'est permanent.",
  },
  {
    icon: Timer,
    title: "Un partage a toujours une fin",
    body: "Chaque accès est nominatif et porte une date d'expiration que vous choisissez. Passé ce délai, il se ferme seul. Vous pouvez aussi le révoquer immédiatement.",
  },
  {
    icon: Eye,
    title: "Vous voyez qui a consulté quoi",
    body: "Chaque ouverture d'un document est inscrite dans un journal que vous seul consultez : qui, quel document, à quel moment.",
  },
  {
    icon: KeyRound,
    title: "Le minimum de données nécessaires",
    body: "Nous ne demandons que ce qui sert au séjour. Renseigner un antécédent ou une allergie reste volontaire, et vous pouvez le retirer.",
  },
];

const AI_CAN = [
  "Comprendre une intention exprimée en langage naturel",
  "Organiser des besoins en catégories et en étapes",
  "Proposer des professionnels et expliquer pourquoi",
  "Construire un itinéraire et estimer des contraintes logistiques",
  "Préparer des questions à poser au praticien",
  "Repérer qu'une pièce semble manquante dans un dossier",
];

const AI_CANNOT = [
  "Poser ou suggérer un diagnostic",
  "Prescrire un traitement ou indiquer une posologie",
  "Commenter, modifier ou interrompre un traitement en cours",
  "Interpréter médicalement une analyse ou une imagerie",
  "Promettre un résultat de santé",
  "Inventer un établissement, un tarif ou une certification",
];

export default function ConfiancePage() {
  const provider = providerStatus();

  return (
    <>
      <section className="shell section-tight">
        <div className="max-w-2xl">
          <Eyebrow>Safety &amp; Trust</Eyebrow>
          <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
            Ce que nous faisons de vos données, et où s&apos;arrête l&apos;IA.
          </h1>
          <p className="lede mt-6">
            La santé n&apos;est pas un domaine où l&apos;on demande de faire confiance sur
            parole. Cette page décrit les règles telles qu&apos;elles sont appliquées dans
            le code, pas telles qu&apos;on aimerait les présenter.
          </p>
        </div>
      </section>

      {/* Données */}
      <section id="donnees" className="border-y" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="shell section-tight">
          <h2 className="text-[clamp(1.7rem,3.4vw,2.4rem)]">Vos données</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {DATA_PRINCIPLES.map((principle) => {
              const Icon = principle.icon;
              return (
                <article key={principle.title}>
                  <Icon size={22} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
                  <h3 className="mt-3.5 text-[1.14rem] leading-snug">{principle.title}</h3>
                  <p className="mt-2.5 text-[0.9rem] leading-7 muted">{principle.body}</p>
                </article>
              );
            })}
          </div>

          <Link href="/espace/documents" className="btn btn-quiet mt-10">
            Voir le journal d&apos;accès de mon espace
          </Link>
        </div>
      </section>

      {/* Vérification */}
      <section id="verification" className="shell section-tight">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <BadgeCheck size={24} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
            <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.4rem)]">Comment nous vérifions</h2>
            <p className="mt-5 leading-7 muted">
              Un badge « Vérifié » ne signifie pas que nous garantissons la qualité des
              soins — nous n&apos;avons pas qualité à l&apos;évaluer. Il signifie que des
              éléments précis ont été contrôlés, et il indique lesquels, avec la date.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                label: "Vérifié",
                body: "Identité juridique, adresse et spécialités déclarées ont été contrôlées. La fiche indique la date du dernier contrôle et la liste exacte de ce qui a été vérifié.",
              },
              {
                label: "Vérification en cours",
                body: "Le dossier a été reçu, le contrôle n'est pas terminé. La fiche reste consultable, avec cette mention.",
              },
              {
                label: "Déclaratif",
                body: "Les informations viennent de l'établissement et n'ont pas encore été contrôlées. C'est écrit sur la fiche, sans euphémisme.",
              },
            ].map((entry) => (
              <div key={entry.label} className="card p-6">
                <h3 className="text-[1.02rem]">{entry.label}</h3>
                <p className="mt-2 text-[0.88rem] leading-6 muted">{entry.body}</p>
              </div>
            ))}

            <div
              className="rounded-[24px] border p-6"
              style={{ borderColor: "rgba(154,104,69,0.3)", background: "rgba(154,104,69,0.06)" }}
            >
              <h3 className="flex items-center gap-2 text-[1rem]">
                <ShieldAlert size={17} style={{ color: "var(--accent)" }} />
                Aucune certification n&apos;est inventée
              </h3>
              <p className="mt-2 text-[0.88rem] leading-6 muted">
                Si nous ne disposons pas d&apos;un document, rien n&apos;est affiché. Un
                champ vide vaut mieux qu&apos;une mention rassurante mais infondée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IA */}
      <section id="ia" style={{ background: "var(--surface-deep)", color: "#fff" }}>
        <div className="shell section-tight">
          <Bot size={24} strokeWidth={1.6} style={{ color: "var(--terracotta-soft, #c08a63)" }} />
          <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.4rem)]">Les limites de l&apos;IA</h2>
          <p className="mt-5 max-w-2xl leading-7 text-white/55">
            Ces limites ne sont pas seulement écrites dans les consignes données au modèle.
            Elles sont appliquées à la sortie, sur chaque réponse, quelle que soit son
            origine — moteur de règles ou modèle de langage. Une consigne se contourne ; un
            filtre de sortie, non.
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="text-[0.66rem] uppercase tracking-[0.22em] text-white/40">
                Ce que l&apos;assistant peut faire
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.92rem] leading-7 text-white/80">
                {AI_CAN.map((entry) => (
                  <li key={entry} className="flex gap-3">
                    <span aria-hidden="true" style={{ color: "var(--terracotta-soft, #c08a63)" }}>
                      +
                    </span>
                    {entry}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-[0.66rem] uppercase tracking-[0.22em] text-white/40">
                Ce qu&apos;il ne fera jamais
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.92rem] leading-7 text-white/80">
                {AI_CANNOT.map((entry) => (
                  <li key={entry} className="flex gap-3">
                    <span aria-hidden="true" className="text-white/40">
                      ×
                    </span>
                    {entry}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-white/10 pt-7">
            <p className="text-[0.86rem] leading-6 text-white/55">
              Moteur actuellement actif : <strong className="text-white">{provider.label}</strong>.
              Lorsqu&apos;aucun fournisseur n&apos;est configuré, la plateforme fonctionne
              intégralement sur son moteur de règles déterministe — mêmes garde-fous, mêmes
              résultats reproductibles.
            </p>
            <p className="mt-4 text-[0.86rem] leading-6 text-white/55">
              En cas de formulation évoquant une urgence, l&apos;assistant interrompt toute
              autre réponse et renvoie vers les secours. En Algérie : Protection civile 14,
              SAMU 115.
            </p>
          </div>
        </div>
      </section>

      <section className="shell section-tight">
        <div className="max-w-3xl">
          <h2 className="text-[clamp(1.5rem,3vw,2.1rem)]">Une question sur vos données ?</h2>
          <p className="mt-4 leading-7 muted">
            Un conseiller peut répondre directement, sans passer par l&apos;assistant. Les
            demandes portant sur l&apos;accès, la rectification ou la suppression de vos
            informations sont traitées par une personne.
          </p>
          <Link href="/concierge#humain" className="btn btn-primary mt-7">
            Parler à un conseiller
          </Link>
        </div>
      </section>
    </>
  );
}
