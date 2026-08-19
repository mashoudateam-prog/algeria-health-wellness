import { Clock, MessageCircle, PhoneCall, UserRound } from "lucide-react";
import type { Metadata } from "next";
import { Eyebrow } from "@/components/badges";
import { ConciergeChat } from "@/components/concierge-chat";
import { providerStatus } from "@/lib/ai/provider";

export const metadata: Metadata = {
  title: "Concierge santé",
  description:
    "Un assistant pour préparer votre séjour, organiser vos rendez-vous et comprendre le déroulement administratif. Un conseiller humain reste joignable.",
};

export default function ConciergePage() {
  const provider = providerStatus();

  return (
    <section className="shell section-tight">
      <div className="grid gap-10 lg:grid-cols-[1.4fr_0.6fr]">
        <div>
          <Eyebrow>Votre concierge</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">
            Une question sur votre séjour&nbsp;?
          </h1>
          <p className="mt-5 max-w-xl leading-7 muted">
            Le concierge connaît la plateforme, les destinations et le déroulement d&apos;un
            séjour. Il n&apos;émet aucun avis médical : pour cela, il vous oriente vers un
            professionnel habilité.
          </p>

          <div className="mt-8">
            <ConciergeChat />
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-28 lg:h-fit">
          <div id="humain" className="card p-6" style={{ scrollMarginTop: "7rem" }}>
            <UserRound size={22} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
            <h2 className="mt-3.5 text-[1.14rem] leading-snug">Un humain peut vous accompagner</h2>
            <p className="mt-2.5 text-[0.88rem] leading-6 muted">
              Certaines situations méritent une voix, pas une interface. Un conseiller peut
              reprendre le dossier à tout moment, sans que vous ayez à tout réexpliquer.
            </p>

            <ul className="mt-5 space-y-3 text-[0.86rem]">
              <li className="flex items-center gap-2.5">
                <PhoneCall size={15} style={{ color: "var(--secondary)" }} />
                Rappel demandé sous 24 h ouvrées
              </li>
              <li className="flex items-center gap-2.5">
                <Clock size={15} style={{ color: "var(--secondary)" }} />
                Dimanche au jeudi, 9 h – 17 h
              </li>
              <li className="flex items-center gap-2.5">
                <MessageCircle size={15} style={{ color: "var(--secondary)" }} />
                Suivi écrit conservé dans votre espace
              </li>
            </ul>

            <button type="button" className="btn btn-primary mt-6 w-full">
              Demander à être rappelé
            </button>
            <p className="mt-2.5 text-[0.72rem] leading-5 faint">
              Démonstration : la prise de contact n&apos;est pas encore raccordée à un
              service réel.
            </p>
          </div>

          <div className="card-soft p-6">
            <h2 className="text-[0.66rem] uppercase tracking-[0.22em] faint">Moteur actif</h2>
            <p className="mt-2.5 text-[0.88rem] leading-6">{provider.label}</p>
            <p className="mt-3 text-[0.78rem] leading-5 faint">
              {provider.active
                ? "Les réponses passent par un filtre de sortie qui bloque diagnostic, prescription et promesse de résultat."
                : "Aucune clé API configurée : les réponses proviennent du moteur de règles déterministe, avec les mêmes garde-fous."}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
