"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  Info,
  MapPin,
  RotateCcw,
  Sparkles,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FACILITY_BY_ID, FACILITY_KIND_LABEL } from "@/data/facilities";
import { DESTINATIONS } from "@/data/destinations";
import { GOALS } from "@/data/goals";
import { formatDZD } from "@/lib/ai/quote";
import { STEP_KIND_LABEL } from "@/lib/ai/planner";
import type { GoalId, JourneyPlan, Origin, StepKind } from "@/types/domain";

/* ------------------------------------------------------------------ */

interface PlanResponse {
  plan: JourneyPlan;
  understood: string[];
  missing: string[];
  confidence: number;
}

/** Étapes de la révélation progressive : la phrase devient un séjour, sous les yeux. */
const STAGES = [
  { key: "objectif", label: "Objectif" },
  { key: "destination", label: "Destination" },
  { key: "soins", label: "Soins & bien-être" },
  { key: "professionnels", label: "Professionnels" },
  { key: "hebergement", label: "Hébergement" },
  { key: "itineraire", label: "Itinéraire" },
  { key: "budget", label: "Budget" },
  { key: "parcours", label: "Mon parcours" },
] as const;

const STEP_TONE: Record<StepKind, string> = {
  soin: "#9a6845",
  examen: "#9a6845",
  recuperation: "#2f5f73",
  "bien-etre": "#2f5f73",
  activite: "#17382f",
  nutrition: "#17382f",
  logistique: "#8b968f",
  repos: "#8b968f",
};

export function JourneyBuilder({
  initialText = "",
  initialGoals = [],
  initialDestination = "",
}: {
  initialText?: string;
  initialGoals?: GoalId[];
  /** Destination imposée par la page d'origine, à honorer dès la première construction. */
  initialDestination?: string;
}) {
  const reduced = useReducedMotion();

  const [text, setText] = useState(initialText);
  const [goals, setGoals] = useState<GoalId[]>(initialGoals);
  const [days, setDays] = useState(7);
  const [travellers, setTravellers] = useState(1);
  const [origin, setOrigin] = useState<Origin>("algerie");
  const [budgetTier, setBudgetTier] = useState<1 | 2 | 3>(2);
  const [destinationSlug, setDestinationSlug] = useState(initialDestination);

  /**
   * Tant que la personne n'a pas touché aux réglages, ils ne sont pas envoyés :
   * une phrase qui dit « 10 jours depuis la France » doit l'emporter sur les
   * valeurs par défaut des curseurs, sinon la plateforme contredit en silence
   * ce qu'elle vient d'afficher avoir compris.
   */
  const [optionsTouched, setOptionsTouched] = useState(false);

  const [status, setStatus] = useState<"idle" | "building" | "done" | "error">("idle");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<PlanResponse | null>(null);
  const [error, setError] = useState("");
  const [showOptions, setShowOptions] = useState(false);

  const resultRef = useRef<HTMLDivElement>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const build = useCallback(async () => {
    if (!text.trim() && goals.length === 0) return;

    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStatus("building");
    setStage(0);
    setError("");
    setResult(null);

    // La révélation démarre immédiatement : elle accompagne l'attente réseau
    // au lieu de la masquer derrière un indicateur de chargement.
    const step = reduced ? 0 : 460;
    if (!reduced) {
      STAGES.forEach((_, index) => {
        timers.current.push(setTimeout(() => setStage(index + 1), step * (index + 1)));
      });
    }

    try {
      const response = await fetch("/api/parcours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          goals,
          // Une destination reçue en paramètre est envoyée d'emblée : elle vient
          // d'une page qui l'a annoncée au visiteur.
          ...(initialDestination && !optionsTouched ? { destinationSlug: initialDestination } : {}),
          ...(optionsTouched
            ? {
                durationDays: days,
                travellers,
                origin,
                budgetTier,
                destinationSlug: destinationSlug || undefined,
              }
            : {}),
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Génération impossible.");

      const settle = reduced ? 0 : STAGES.length * step + 200;
      timers.current.push(
        setTimeout(() => {
          const data = payload as PlanResponse;
          // Les réglages reflètent désormais ce qui a réellement été retenu :
          // la personne ajuste à partir du parcours affiché, pas d'un état obsolète.
          setDays(data.plan.brief.durationDays);
          setTravellers(data.plan.brief.travellers);
          setOrigin(data.plan.brief.origin);
          setBudgetTier(data.plan.brief.budgetTier);
          setDestinationSlug(data.plan.destination.slug);

          setResult(data);
          setStage(STAGES.length);
          setStatus("done");
          resultRef.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
        }, settle),
      );
    } catch (caught) {
      timers.current.forEach(clearTimeout);
      setError(caught instanceof Error ? caught.message : "Génération impossible.");
      setStatus("error");
    }
  }, [text, goals, days, travellers, origin, budgetTier, destinationSlug, optionsTouched, initialDestination, reduced]);

  // Un parcours pré-rempli depuis la page d'accueil se construit tout seul.
  const autoRan = useRef(false);
  useEffect(() => {
    if (autoRan.current) return;
    if (!initialText && initialGoals.length === 0) return;
    autoRan.current = true;
    void build();
  }, [build, initialText, initialGoals.length]);

  const toggleGoal = (id: GoalId) =>
    setGoals((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );

  const ready = text.trim().length > 3 || goals.length > 0;

  return (
    <>
      {/* ------------------------------------------------------ SAISIE */}
      <section className="shell pb-10 pt-10 lg:pt-14">
        <div className="mx-auto max-w-3xl">
          <p className="eyebrow eyebrow-line">Health Journey Builder</p>
          <h1 className="mt-6 text-[clamp(2.2rem,5.2vw,3.6rem)]">
            Décrivez votre projet.
            <br />
            <span style={{ color: "var(--sage, #7d927b)" }}>Le séjour se construit.</span>
          </h1>

          <div className="card mt-9 p-6 sm:p-8">
            <label htmlFor="projet-libre" className="block text-[0.88rem] font-medium">
              Votre projet, en vos mots
            </label>
            <textarea
              id="projet-libre"
              value={text}
              onChange={(event) => setText(event.target.value)}
              rows={3}
              maxLength={1200}
              placeholder="Je veux venir en Algérie pendant une semaine pour prendre soin de moi."
              className="field mt-2.5 resize-none text-[1.02rem]"
            />

            <fieldset className="mt-6">
              <legend className="text-[0.88rem] font-medium">Vos objectifs</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {GOALS.map((goal) => {
                  const active = goals.includes(goal.id);
                  return (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => toggleGoal(goal.id)}
                      aria-pressed={active}
                      className="rounded-full border px-3.5 py-2 text-[0.8rem] transition-colors"
                      style={{
                        borderColor: active ? "var(--primary)" : "var(--border-strong)",
                        background: active ? "var(--primary)" : "transparent",
                        color: active ? "#fff" : "var(--muted)",
                      }}
                    >
                      <span aria-hidden="true">{goal.emoji}</span> {goal.label}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <button
              type="button"
              onClick={() => setShowOptions((value) => !value)}
              aria-expanded={showOptions}
              className="btn btn-quiet mt-6 text-[0.84rem]"
            >
              Préciser durée, voyageurs et budget
              <ChevronDown
                size={15}
                style={{ transform: showOptions ? "rotate(180deg)" : undefined, transition: "transform 200ms" }}
              />
            </button>

            {showOptions && (
              <div className="mt-5 grid gap-5 border-t pt-6 sm:grid-cols-2" style={{ borderColor: "var(--border)" }}>
                <div>
                  <label htmlFor="duree" className="block text-[0.82rem] font-medium">
                    Durée : <span className="tabular-nums">{days} jours</span>
                  </label>
                  <input
                    id="duree"
                    type="range"
                    min={2}
                    max={21}
                    value={days}
                    onChange={(event) => { setOptionsTouched(true); setDays(Number(event.target.value)); }}
                    className="mt-3 w-full accent-[#17382f]"
                  />
                </div>

                <div>
                  <label htmlFor="voyageurs" className="block text-[0.82rem] font-medium">
                    Voyageurs : <span className="tabular-nums">{travellers}</span>
                  </label>
                  <input
                    id="voyageurs"
                    type="range"
                    min={1}
                    max={6}
                    value={travellers}
                    onChange={(event) => { setOptionsTouched(true); setTravellers(Number(event.target.value)); }}
                    className="mt-3 w-full accent-[#17382f]"
                  />
                </div>

                <div>
                  <label htmlFor="origine" className="block text-[0.82rem] font-medium">
                    Vous arrivez
                  </label>
                  <select
                    id="origine"
                    value={origin}
                    onChange={(event) => { setOptionsTouched(true); setOrigin(event.target.value as Origin); }}
                    className="field mt-2"
                  >
                    <option value="algerie">Je suis déjà en Algérie</option>
                    <option value="etranger">Je viens de l&apos;étranger</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="destination" className="block text-[0.82rem] font-medium">
                    Destination souhaitée
                  </label>
                  <select
                    id="destination"
                    value={destinationSlug}
                    onChange={(event) => { setOptionsTouched(true); setDestinationSlug(event.target.value); }}
                    className="field mt-2"
                  >
                    <option value="">Laisser la plateforme proposer</option>
                    {DESTINATIONS.map((destination) => (
                      <option key={destination.slug} value={destination.slug}>
                        {destination.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <span className="block text-[0.82rem] font-medium">Niveau de confort</span>
                  <div className="mt-2.5 flex gap-2">
                    {(
                      [
                        [1, "Essentiel"],
                        [2, "Confort"],
                        [3, "Premium"],
                      ] as const
                    ).map(([tier, label]) => (
                      <button
                        key={tier}
                        type="button"
                        onClick={() => { setOptionsTouched(true); setBudgetTier(tier); }}
                        aria-pressed={budgetTier === tier}
                        className="flex-1 rounded-full border px-4 py-2.5 text-[0.82rem] transition-colors"
                        style={{
                          borderColor: budgetTier === tier ? "var(--primary)" : "var(--border-strong)",
                          background: budgetTier === tier ? "var(--primary)" : "transparent",
                          color: budgetTier === tier ? "#fff" : "var(--muted)",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={build}
                disabled={!ready || status === "building"}
                className="btn btn-primary group"
              >
                <Sparkles size={16} />
                {status === "building" ? "Construction en cours…" : "Construire mon parcours"}
                {status !== "building" && (
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                )}
              </button>
              {status === "done" && (
                <button type="button" onClick={build} className="btn btn-quiet">
                  <RotateCcw size={14} />
                  Reconstruire
                </button>
              )}
            </div>

            {error && (
              <p role="alert" className="mt-4 text-[0.86rem]" style={{ color: "#9a3b30" }}>
                {error}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- RÉVÉLATION */}
      <AnimatePresence>
        {status === "building" && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="section-tight"
            style={{ background: "var(--surface-deep)", color: "#fff" }}
            aria-live="polite"
          >
            <div className="shell">
              <p className="text-[0.62rem] uppercase tracking-[0.28em] text-white/40">
                Construction du parcours
              </p>
              <ol className="mt-7 space-y-3.5">
                {STAGES.map((entry, index) => {
                  const state = index < stage ? "done" : index === stage ? "active" : "todo";
                  return (
                    <li key={entry.key} className="flex items-center gap-4">
                      <span
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[0.62rem] tabular-nums transition-colors duration-300"
                        style={{
                          borderColor: state === "todo" ? "rgba(255,255,255,0.18)" : "var(--terracotta-soft, #c08a63)",
                          background: state === "done" ? "var(--terracotta-soft, #c08a63)" : "transparent",
                          color: state === "done" ? "#17382f" : "rgba(255,255,255,0.65)",
                        }}
                      >
                        {state === "done" ? <Check size={13} strokeWidth={2.6} /> : String(index + 1).padStart(2, "0")}
                      </span>
                      <span
                        className="serif text-[clamp(1.3rem,3.4vw,2.1rem)] transition-all duration-300"
                        style={{
                          color: state === "todo" ? "rgba(255,255,255,0.24)" : "#fff",
                          transform: state === "active" ? "translateX(4px)" : undefined,
                        }}
                      >
                        {entry.label}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------ RÉSULTAT */}
      <div ref={resultRef}>
        {status === "done" && result && <JourneyResult data={result} />}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Restitution du parcours                                             */
/* ------------------------------------------------------------------ */

function JourneyResult({ data }: { data: PlanResponse }) {
  const { plan, understood, confidence } = data;
  const days = groupByDay(plan);

  return (
    <>
      <section className="section-tight border-y" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="shell">
          <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr]">
            <div>
              <p className="eyebrow eyebrow-line">Votre parcours</p>
              <h2 className="mt-5 text-[clamp(1.9rem,4.4vw,3rem)]">{plan.title}</h2>
              <p className="mt-6 max-w-2xl text-[1.02rem] leading-8 muted">{plan.summary}</p>

              <div className="mt-7 flex flex-wrap gap-2">
                <span className="badge">
                  <MapPin size={13} />
                  {plan.destination.name}
                </span>
                <span className="badge">{plan.brief.durationDays} jours</span>
                {plan.brief.travellers > 1 && (
                  <span className="badge">
                    <Users size={13} />
                    {plan.brief.travellers} voyageurs
                  </span>
                )}
                <span className="badge">
                  {plan.generatedBy === "regles" ? "Moteur de règles" : "Assisté par IA"}
                </span>
              </div>
            </div>

            <aside className="card p-6">
              <h3 className="text-[0.68rem] uppercase tracking-[0.22em] faint">
                Ce que nous avons compris
              </h3>
              <ul className="mt-4 space-y-2.5 text-[0.86rem] leading-6">
                {understood.map((entry) => (
                  <li key={entry} className="flex gap-2.5">
                    <Check size={15} className="mt-0.5 shrink-0" style={{ color: "var(--secondary)" }} />
                    {entry}
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t pt-4 text-[0.76rem] leading-5 faint" style={{ borderColor: "var(--border)" }}>
                Niveau de certitude sur les éléments déduits : {Math.round(confidence * 100)} %.
                Corrigez ce qui ne correspond pas et reconstruisez.
              </p>
            </aside>
          </div>

          {plan.cautions.length > 0 && (
            <div
              className="mt-10 rounded-[24px] border p-6"
              style={{ borderColor: "rgba(154,104,69,0.3)", background: "rgba(154,104,69,0.06)" }}
            >
              <h3 className="flex items-center gap-2 text-[0.9rem] font-medium">
                <AlertTriangle size={16} style={{ color: "var(--accent)" }} />
                Points de vigilance
              </h3>
              <ul className="mt-3.5 space-y-2.5 text-[0.86rem] leading-6 muted">
                {plan.cautions.map((caution) => (
                  <li key={caution}>{caution}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Itinéraire */}
      <section className="section-tight">
        <div className="shell">
          <h3 className="text-[clamp(1.5rem,3vw,2.1rem)]">Votre itinéraire, jour par jour</h3>
          <p className="mt-3 max-w-2xl text-[0.9rem] leading-7 muted">
            Les journées suivant un acte sont volontairement allégées. Le rythme reste à
            confirmer avec le professionnel qui vous prend en charge.
          </p>

          <ol className="mt-10 space-y-8">
            {days.map(([day, steps]) => (
              <li key={day} className="grid gap-5 sm:grid-cols-[5.5rem_1fr]">
                <div className="sm:pt-1">
                  <span className="text-[0.6rem] uppercase tracking-[0.22em] faint">Jour</span>
                  <p className="serif text-3xl leading-none">{String(day).padStart(2, "0")}</p>
                </div>
                <ul className="space-y-2.5">
                  {steps.map((step) => {
                    const facility = step.facilityId ? FACILITY_BY_ID.get(step.facilityId) : undefined;
                    return (
                      <li
                        key={step.id}
                        className="card grid gap-3 p-5 sm:grid-cols-[4.2rem_1fr]"
                        style={{ borderLeft: `3px solid ${STEP_TONE[step.kind]}` }}
                      >
                        <span className="text-[0.82rem] tabular-nums faint">{step.time}</span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h4 className="text-[1.02rem] leading-snug">{step.title}</h4>
                            <span
                              className="badge"
                              style={{ color: STEP_TONE[step.kind], borderColor: `${STEP_TONE[step.kind]}44` }}
                            >
                              {STEP_KIND_LABEL[step.kind]}
                            </span>
                          </div>
                          <p className="mt-2 text-[0.86rem] leading-6 muted">{step.detail}</p>
                          {facility && (
                            <p className="mt-2.5 text-[0.78rem] faint">
                              {FACILITY_KIND_LABEL[facility.kind]} · {facility.name}
                              {facility.demo && <span className="badge badge-demo ml-2">Démo</span>}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Smart Match */}
      <section className="section-tight border-y" style={{ borderColor: "var(--border)", background: "var(--surface)" }}>
        <div className="shell">
          <h3 className="text-[clamp(1.5rem,3vw,2.1rem)]">Pourquoi nous vous proposons ces options</h3>
          <p className="mt-3 max-w-2xl text-[0.9rem] leading-7 muted">
            Aucune note globale, aucune étoile. Chaque rapprochement est justifié par des
            critères que vous pouvez vérifier.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {plan.matches.map((match) => {
              const facility = FACILITY_BY_ID.get(match.facilityId);
              if (!facility) return null;
              return (
                <article key={match.facilityId} className="card flex flex-col p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge">{FACILITY_KIND_LABEL[facility.kind]}</span>
                    {facility.demo && <span className="badge badge-demo">Démo</span>}
                  </div>
                  <h4 className="mt-3.5 text-[1.16rem] leading-snug">{facility.name}</h4>
                  <p className="mt-2.5 text-[0.86rem] leading-6 muted">{facility.summary}</p>

                  <ul className="mt-5 space-y-3 border-t pt-4" style={{ borderColor: "var(--border)" }}>
                    {match.reasons.map((reason) => (
                      <li key={reason.label} className="text-[0.82rem] leading-5">
                        <span className="font-medium">{reason.label}</span>
                        <span className="block faint">{reason.detail}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={`/professionnels/${facility.slug}`}
                    className="btn btn-quiet mt-5 self-start text-[0.82rem]"
                  >
                    Voir la fiche
                    <ArrowRight size={14} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Budget */}
      <section className="section-tight">
        <div className="shell grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h3 className="text-[clamp(1.5rem,3vw,2.1rem)]">Estimation du budget</h3>
            <p className="mt-3 max-w-xl text-[0.9rem] leading-7 muted">{plan.quote.disclaimer}</p>

            <table className="mt-8 w-full text-left text-[0.88rem]">
              <caption className="sr-only">Estimation ventilée par poste</caption>
              <thead>
                <tr className="border-b text-[0.7rem] uppercase tracking-[0.14em] faint" style={{ borderColor: "var(--border)" }}>
                  <th scope="col" className="pb-3 font-medium">Poste</th>
                  <th scope="col" className="pb-3 text-right font-medium">Fourchette</th>
                </tr>
              </thead>
              <tbody>
                {plan.quote.lines.map((line) => (
                  <tr key={line.label} className="border-b" style={{ borderColor: "var(--border)" }}>
                    <td className="py-3.5 pr-4">
                      {line.label}
                      {line.note && <span className="mt-1 block text-[0.76rem] leading-5 faint">{line.note}</span>}
                    </td>
                    <td className="py-3.5 text-right tabular-nums whitespace-nowrap">
                      {formatDZD(line.min)} – {formatDZD(line.max)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th scope="row" className="pt-4 text-left font-medium">Estimation totale</th>
                  <td className="pt-4 text-right font-medium tabular-nums whitespace-nowrap">
                    {formatDZD(plan.quote.totalMin)} – {formatDZD(plan.quote.totalMax)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <aside className="card h-fit p-6">
            <h4 className="text-[0.68rem] uppercase tracking-[0.22em] faint">Prochaines étapes</h4>
            <ol className="mt-4 space-y-3 text-[0.86rem] leading-6">
              {plan.nextActions.map((action, index) => (
                <li key={action} className="flex gap-3">
                  <span className="tabular-nums faint">{String(index + 1).padStart(2, "0")}</span>
                  {action}
                </li>
              ))}
            </ol>
            <Link href="/concierge" className="btn btn-primary mt-6 w-full">
              Parler à un conseiller
            </Link>
          </aside>
        </div>
      </section>

      <section className="section-tight" style={{ background: "var(--surface-soft)" }}>
        <div className="shell flex items-start gap-3">
          <Info size={17} className="mt-0.5 shrink-0" style={{ color: "var(--secondary)" }} />
          <p className="max-w-3xl text-[0.86rem] leading-6 muted">
            {plan.disclaimer} Les établissements et praticiens présentés proviennent d&apos;un
            catalogue de démonstration : ils sont fictifs et signalés comme tels.
          </p>
        </div>
      </section>
    </>
  );
}

function groupByDay(plan: JourneyPlan): Array<[number, JourneyPlan["steps"]]> {
  const map = new Map<number, JourneyPlan["steps"]>();
  for (const step of plan.steps) {
    const bucket = map.get(step.day) ?? [];
    bucket.push(step);
    map.set(step.day, bucket);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}
