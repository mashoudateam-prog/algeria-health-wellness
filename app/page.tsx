import {
  ArrowRight,
  ClipboardList,
  Compass,
  FileCheck2,
  MessageCircle,
  Plane,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import { Eyebrow } from "@/components/badges";
import { GoalPicker } from "@/components/goal-picker";
import { PhotoPlate } from "@/components/photo-plate";
import { Reveal } from "@/components/reveal";
import { DESTINATIONS } from "@/data/destinations";

const PHASES = [
  { key: "Discover", label: "Je définis mon objectif", detail: "Ce que vous voulez améliorer, en vos mots." },
  { key: "Assess", label: "La plateforme comprend", detail: "Vos besoins sont organisés, jamais diagnostiqués." },
  { key: "Plan", label: "Je découvre mon parcours", detail: "Jour par jour, avec les temps de repos." },
  { key: "Book", label: "Je choisis mes professionnels", detail: "Avec les raisons de chaque proposition." },
  { key: "Experience", label: "Je vis mon séjour", detail: "Rendez-vous, transferts, récupération, découverte." },
  { key: "Follow-up", label: "Je suis accompagné après", detail: "Documents, rappels, suivi à distance." },
];

const TRUST = [
  {
    icon: ShieldCheck,
    title: "Vérification affichée, jamais inventée",
    body: "Chaque fiche indique ce qui a été contrôlé et la date du contrôle. Quand une information est seulement déclarée par l'établissement, c'est écrit.",
  },
  {
    icon: FileCheck2,
    title: "Vous gardez le contrôle de vos documents",
    body: "Un partage est nominatif, limité dans le temps et révocable. Un journal vous indique qui a consulté quoi, et quand.",
  },
  {
    icon: Stethoscope,
    title: "L'IA n'exerce pas la médecine",
    body: "Elle organise, prépare et oriente. Elle ne pose aucun diagnostic, ne prescrit rien et n'interprète jamais un résultat.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section className="shell grid items-center gap-12 pb-16 pt-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:pb-24 lg:pt-16">
        <Reveal>
          <Eyebrow>Health travel · Algérie</Eyebrow>

          <h1 className="mt-6 text-[clamp(2.6rem,6.2vw,4.6rem)]">
            Prenez soin de vous.
            <br />
            <span style={{ color: "var(--sage, #7d927b)" }}>Découvrez l&apos;Algérie autrement.</span>
          </h1>

          <p className="lede mt-7 max-w-xl">
            Une nouvelle façon de préparer votre séjour de santé, de bien-être et de remise
            en forme en Algérie. Vous ne réservez pas un rendez-vous : vous construisez un
            parcours.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/parcours" className="btn btn-primary group">
              Construire mon parcours
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/destinations" className="btn btn-ghost">
              Explorer les destinations
            </Link>
          </div>

          <ol className="mt-12 grid max-w-lg grid-cols-3 gap-5 border-t pt-7" style={{ borderColor: "var(--border)" }}>
            {["Vous définissez votre objectif", "Un parcours se construit", "Vous vivez votre séjour"].map(
              (step, index) => (
                <li key={step}>
                  <span className="serif text-2xl" style={{ color: "var(--accent)" }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-1.5 text-[0.78rem] leading-5 muted">{step}</p>
                </li>
              ),
            )}
          </ol>
        </Reveal>

        <Reveal delay={0.08}>
          <PhotoPlate
            slug="hero-algerie"
            alt="Paysage algérien entre Méditerranée et patrimoine"
            caption="Algérie"
            overline="Destination"
            index={1}
            priority
            className="h-[min(72vh,620px)]"
          />
        </Reveal>
      </section>

      {/* ------------------------------------------------- OBJECTIFS */}
      <section
        id="objectifs"
        className="section border-y"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Le point de départ</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,4.2vw,3.1rem)]">
              Que souhaitez-vous
              <br />
              améliorer&nbsp;?
            </h2>
            <p className="mt-6 max-w-md leading-7 muted">
              Pas de liste de cliniques, pas de moteur de recherche. Vous partez de votre
              intention — plusieurs objectifs peuvent coexister dans un même séjour, et
              c&apos;est même le cas le plus fréquent.
            </p>
            <p className="mt-5 max-w-md text-[0.82rem] leading-6 faint">
              Les informations produites sont indicatives et ne constituent pas un
              diagnostic médical.
            </p>
          </Reveal>

          <Reveal delay={0.06}>
            <GoalPicker />
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------- LE PARCOURS */}
      <section className="section" style={{ background: "var(--surface-deep)", color: "#fff" }}>
        <div className="shell">
          <Reveal>
            <p className="eyebrow eyebrow-line" style={{ color: "var(--terracotta-soft, #c08a63)" }}>
              <Sparkles size={14} className="mr-1 inline" />
              Health Journey
            </p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.4rem)]">
              Dites simplement ce dont vous avez besoin.
              <br />
              Le reste s&apos;organise.
            </h2>
            <p className="mt-7 max-w-2xl text-[1.05rem] leading-8 text-white/55">
              Votre phrase devient un parcours : une destination, des professionnels, des
              journées de soin, des temps de récupération, un hébergement, des activités
              compatibles et un budget estimatif.
            </p>
          </Reveal>

          <ol className="mt-14 grid gap-px overflow-hidden rounded-[28px] sm:grid-cols-2 lg:grid-cols-3" style={{ background: "rgba(255,255,255,0.12)" }}>
            {PHASES.map((phase, index) => (
              <li key={phase.key} style={{ background: "var(--surface-deep)" }}>
                <Reveal delay={index * 0.04} className="h-full p-7">
                  <span className="text-[0.6rem] uppercase tracking-[0.26em] text-white/40">
                    {phase.key}
                  </span>
                  <h3 className="mt-3 text-[1.22rem] leading-snug">{phase.label}</h3>
                  <p className="mt-2.5 text-[0.86rem] leading-6 text-white/50">{phase.detail}</p>
                </Reveal>
              </li>
            ))}
          </ol>

          <Reveal delay={0.1}>
            <div className="mt-12">
              <Link href="/parcours" className="btn btn-accent group">
                Essayer le Journey Builder
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------ DESTINATIONS */}
      <section className="section">
        <div className="shell">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <Eyebrow>Health destinations</Eyebrow>
              <h2 className="mt-5 text-[clamp(2rem,4.2vw,3.1rem)]">
                L&apos;Algérie comme
                <br />
                destination de santé.
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <Link href="/destinations" className="btn btn-quiet group">
                Voir les {DESTINATIONS.length} destinations
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.slice(0, 4).map((destination, index) => (
              <Reveal key={destination.slug} delay={index * 0.05}>
                <Link href={`/destinations/${destination.slug}`} className="group block">
                  <PhotoPlate
                    slug={destination.slug}
                    alt={destination.photo.alt}
                    caption={destination.name}
                    overline={destination.tagline}
                    index={index + 1}
                    className="h-[24rem] transition-transform duration-500 group-hover:-translate-y-1"
                  />
                  <p className="mt-3.5 text-[0.84rem] leading-6 muted">{destination.tagline}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- TRUST */}
      <section
        className="section border-y"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="shell">
          <Reveal>
            <Eyebrow>Confiance</Eyebrow>
            <h2 className="mt-5 max-w-2xl text-[clamp(1.9rem,3.8vw,2.8rem)]">
              La confiance ne se déclare pas.
              <br />
              Elle se démontre.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {TRUST.map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 0.05}>
                  <Icon size={24} strokeWidth={1.6} style={{ color: "var(--accent)" }} />
                  <h3 className="mt-4 text-[1.18rem] leading-snug">{item.title}</h3>
                  <p className="mt-3 text-[0.9rem] leading-7 muted">{item.body}</p>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.12}>
            <Link href="/confiance" className="btn btn-quiet group mt-10">
              Consulter le centre de confiance
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------- CONCIERGE */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <div
              className="grid items-center gap-10 rounded-[36px] border p-8 sm:p-12 lg:grid-cols-[1.15fr_0.85fr]"
              style={{ borderColor: "var(--border)", background: "var(--surface-soft)" }}
            >
              <div>
                <Eyebrow>Accompagnement</Eyebrow>
                <h2 className="mt-5 text-[clamp(1.8rem,3.6vw,2.6rem)]">
                  Un humain peut vous accompagner.
                </h2>
                <p className="mt-5 max-w-xl leading-7 muted">
                  Le concierge répond aux questions d&apos;organisation à toute heure. Mais
                  certaines situations demandent une voix, pas une interface — un conseiller
                  reprend alors la main, à votre demande.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/concierge" className="btn btn-primary">
                    <MessageCircle size={16} />
                    Ouvrir le concierge
                  </Link>
                  <Link href="/concierge#humain" className="btn btn-ghost">
                    Parler à un conseiller
                  </Link>
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  { icon: ClipboardList, text: "Préparer les questions à poser au praticien" },
                  { icon: Plane, text: "Organiser l'arrivée, les transferts et l'hébergement" },
                  { icon: Compass, text: "Trouver des activités compatibles avec la récupération" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.text} className="card flex items-start gap-4 p-5">
                      <Icon size={19} strokeWidth={1.6} className="mt-0.5 shrink-0" style={{ color: "var(--secondary)" }} />
                      <span className="text-[0.9rem] leading-6">{item.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
