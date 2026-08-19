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
import { localizePath } from "@/lib/i18n/config";
import { fill, getTranslation } from "@/lib/i18n/server";

/** Bandeau éditorial : quatre visages du pays, du Sahara à la Méditerranée. */
const GALLERY = [
  {
    slug: "sahara",
    caption: "Le Tassili",
    note: "Le Grand Sud, ses formations rocheuses et son silence.",
    span: "sm:col-span-2 sm:row-span-2",
    height: "h-[19rem] sm:h-full",
    sizes: "(max-width: 640px) 100vw, 66vw",
  },
  {
    slug: "constantine",
    caption: "Constantine",
    note: "La ville des ponts, suspendue au-dessus de ses gorges.",
    span: "",
    height: "h-[19rem]",
    sizes: "(max-width: 640px) 100vw, 33vw",
  },
  {
    slug: "ghardaia",
    caption: "Le M'Zab",
    note: "Cinq cités fortifiées, patrimoine mondial.",
    span: "",
    height: "h-[19rem]",
    sizes: "(max-width: 640px) 100vw, 33vw",
  },
];

export default async function HomePage() {
  const { locale, t } = await getTranslation();
  const link = (href: string) => localizePath(href, locale);

  const phases = [
    { key: "Discover", ...t.phases.discover },
    { key: "Assess", ...t.phases.assess },
    { key: "Plan", ...t.phases.plan },
    { key: "Book", ...t.phases.book },
    { key: "Experience", ...t.phases.experience },
    { key: "Follow-up", ...t.phases.followUp },
  ];

  const trust = [
    { icon: ShieldCheck, title: t.trust.verificationTitle, body: t.trust.verificationBody },
    { icon: FileCheck2, title: t.trust.documentsTitle, body: t.trust.documentsBody },
    { icon: Stethoscope, title: t.trust.aiTitle, body: t.trust.aiBody },
  ];

  return (
    <>
      {/* ---------------------------------------------------------- HERO */}
      <section className="relative">
        <PhotoPlate
          slug="hero-algerie"
          alt="Le littoral algérien, entre montagne et Méditerranée"
          caption="Algérie"
          overline="Destination"
          index={1}
          priority
          scrim="full"
          focal="50% 42%"
          sizes="100vw"
          className="h-[min(88vh,940px)] rounded-none"
        >
          <div className="shell flex h-full flex-col justify-end pb-12 sm:pb-16">
            <div className="max-w-3xl">
              <p className="eyebrow eyebrow-line" style={{ color: "rgba(255,255,255,0.82)" }}>
                {t.home.eyebrow}
              </p>

              <h1 className="mt-6 text-[clamp(2.7rem,7vw,5.4rem)] text-white">
                {t.home.title1}
                <br />
                {t.home.title2}
              </h1>

              <p className="mt-7 max-w-xl text-[clamp(1rem,1.6vw,1.22rem)] leading-8 text-white/75">
                {t.home.lede}
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link href={link("/parcours")} className="btn btn-primary group">
                  {t.common.buildJourney}
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={link("/destinations")}
                  className="btn"
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    borderColor: "rgba(255,255,255,0.32)",
                    color: "#fff",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  {t.home.exploreDestinations}
                </Link>
              </div>
            </div>
          </div>
        </PhotoPlate>

        {/* Les trois temps, en bandeau sous le visuel */}
        <div style={{ background: "var(--surface-deep)", color: "#fff" }}>
          <ol className="shell grid gap-6 py-8 sm:grid-cols-3">
            {[
              t.home.step1,
              t.home.step2,
              t.home.step3,
            ].map((step, index) => (
              <li key={step} className="flex items-baseline gap-4">
                <span className="serif text-2xl" style={{ color: "var(--terracotta-soft, #c08a63)" }}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="text-[0.92rem] leading-6 text-white/70">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------- BANDEAU ÉDITORIAL */}
      <section className="section">
        <div className="shell">
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>{t.home.contrastsEyebrow}</Eyebrow>
              <h2 className="mt-5 text-[clamp(2rem,4.4vw,3.2rem)]">
                {t.home.contrastsTitle1}
                <br />
                <span style={{ color: "var(--sage, #7d927b)" }}>{t.home.contrastsTitle2}</span>
              </h2>
              <p className="mt-6 leading-7 muted">
                {t.home.contrastsBody}
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-4 sm:auto-rows-[19rem] sm:grid-cols-3">
            {GALLERY.map((item, index) => (
              <Reveal key={item.slug} delay={index * 0.06} className={item.span}>
                <div className={`group relative h-full ${item.height}`}>
                  <PhotoPlate
                    slug={item.slug}
                    alt={item.caption}
                    caption={item.caption}
                    overline="Algérie"
                    index={index + 2}
                    scrim="bottom"
                    zoomOnHover
                    sizes={item.sizes}
                    className="h-full"
                  >
                    <div className="flex h-full flex-col justify-end p-6">
                      <p className="serif text-[clamp(1.5rem,2.4vw,2.1rem)] leading-none text-white">
                        {item.caption}
                      </p>
                      <p className="mt-2.5 max-w-xs text-[0.82rem] leading-5 text-white/70">
                        {item.note}
                      </p>
                    </div>
                  </PhotoPlate>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------- OBJECTIFS */}
      <section
        id="objectifs"
        className="section border-y"
        style={{ borderColor: "var(--border)", background: "var(--surface)" }}
      >
        <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal>
            <Eyebrow>{t.home.goalsEyebrow}</Eyebrow>
            <h2 className="mt-5 text-[clamp(2rem,4.2vw,3.1rem)]">
              {t.home.goalsTitle}
            </h2>
            <p className="mt-6 max-w-md leading-7 muted">
              {t.home.goalsBody}
            </p>
            <p className="mt-5 max-w-md text-[0.82rem] leading-6 faint">
              {t.home.goalsNotice}
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
              {t.home.journeyEyebrow}
            </p>
            <h2 className="mt-5 max-w-3xl text-[clamp(2rem,4.6vw,3.4rem)]">
              {t.home.journeyTitle1}
              <br />
              {t.home.journeyTitle2}
            </h2>
            <p className="mt-7 max-w-2xl text-[1.05rem] leading-8 text-white/55">
              {t.home.journeyBody}
            </p>
          </Reveal>

          <ol
            className="mt-14 grid gap-px overflow-hidden rounded-[28px] sm:grid-cols-2 lg:grid-cols-3"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            {phases.map((phase, index) => (
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
              <Link href={link("/parcours")} className="btn btn-accent group">
                {t.home.journeyCta}
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
              <Eyebrow>{t.home.destinationsEyebrow}</Eyebrow>
              <h2 className="mt-5 text-[clamp(2rem,4.2vw,3.1rem)]">
                {t.home.destinationsTitle1}
                <br />
                {t.home.destinationsTitle2}
              </h2>
            </Reveal>
            <Reveal delay={0.05}>
              <Link href={link("/destinations")} className="btn btn-quiet group">
                {fill(t.home.destinationsAll, { count: DESTINATIONS.length })}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {DESTINATIONS.slice(0, 4).map((destination, index) => (
              <Reveal key={destination.slug} delay={index * 0.05}>
                <Link href={link(`/destinations/${destination.slug}`)} className="group block">
                  <PhotoPlate
                    slug={destination.slug}
                    alt={destination.photo.alt}
                    caption={destination.name}
                    overline={destination.tagline}
                    index={index + 1}
                    scrim="bottom"
                    zoomOnHover
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="h-[27rem]"
                  >
                    <div className="flex h-full flex-col justify-end p-6">
                      <p className="text-[0.6rem] uppercase tracking-[0.24em] text-white/65">
                        {destination.tagline}
                      </p>
                      <p className="mt-2 serif text-[2rem] leading-none text-white">
                        {destination.name}
                      </p>
                    </div>
                  </PhotoPlate>
                  <p className="mt-3.5 text-[0.84rem] leading-6 muted">{destination.intro.split(".")[0]}.</p>
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
            <Eyebrow>{t.home.trustEyebrow}</Eyebrow>
            <h2 className="mt-5 max-w-2xl text-[clamp(1.9rem,3.8vw,2.8rem)]">
              {t.home.trustTitle1}
              <br />
              {t.home.trustTitle2}
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {trust.map((item, index) => {
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
            <Link href={link("/confiance")} className="btn btn-quiet group mt-10">
              {t.home.trustCta}
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
                <Eyebrow>{t.home.conciergeEyebrow}</Eyebrow>
                <h2 className="mt-5 text-[clamp(1.8rem,3.6vw,2.6rem)]">
                  {t.home.conciergeTitle}
                </h2>
                <p className="mt-5 max-w-xl leading-7 muted">
                  {t.home.conciergeBody}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={link("/concierge")} className="btn btn-primary">
                    <MessageCircle size={16} />
                    {t.home.conciergeOpen}
                  </Link>
                  <Link href={link("/concierge#humain")} className="btn btn-ghost">
                    {t.common.talkToAdviser}
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
                      <Icon
                        size={19}
                        strokeWidth={1.6}
                        className="mt-0.5 shrink-0"
                        style={{ color: "var(--secondary)" }}
                      />
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
