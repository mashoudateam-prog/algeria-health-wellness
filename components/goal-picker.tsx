"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { GOALS } from "@/data/goals";
import type { GoalId } from "@/types/domain";

const EXAMPLES = [
  "Je viens de France 10 jours : soins dentaires, perdre un peu de poids et me reposer.",
  "Une semaine à Béjaïa pour reprendre le sport après une longue pause.",
  "Bilan de santé complet à Alger, puis quelques jours au calme.",
];

/**
 * Point d'entrée du produit. On ne demande jamais « choisissez une clinique »,
 * mais « que souhaitez-vous améliorer ? ». Les objectifs sont cumulables, et la
 * phrase libre est facultative — l'un ou l'autre suffit à démarrer.
 */
export function GoalPicker({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [selected, setSelected] = useState<GoalId[]>([]);
  const [text, setText] = useState("");

  const toggle = (id: GoalId) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );

  const start = () => {
    const params = new URLSearchParams();
    if (text.trim()) params.set("q", text.trim());
    if (selected.length > 0) params.set("goals", selected.join(","));
    router.push(`/parcours${params.toString() ? `?${params}` : ""}`);
  };

  const ready = selected.length > 0 || text.trim().length > 3;

  return (
    <div>
      <div
        className="grid gap-2.5"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(9.5rem, 1fr))" }}
        role="group"
        aria-label="Vos objectifs"
      >
        {GOALS.map((goal) => {
          const active = selected.includes(goal.id);
          return (
            <button
              key={goal.id}
              type="button"
              onClick={() => toggle(goal.id)}
              aria-pressed={active}
              className="group rounded-2xl border p-3.5 text-left transition-all duration-200"
              style={{
                borderColor: active ? "var(--primary)" : "var(--border-strong)",
                background: active ? "var(--primary)" : "var(--surface)",
                color: active ? "#fff" : "var(--text)",
              }}
            >
              <span className="text-lg leading-none" aria-hidden="true">
                {goal.emoji}
              </span>
              <span className="mt-2.5 block text-[0.88rem] font-medium leading-tight">
                {goal.label}
              </span>
              {!compact && (
                <span
                  className="mt-1.5 block text-[0.72rem] leading-4"
                  style={{ color: active ? "rgba(255,255,255,0.62)" : "var(--faint)" }}
                >
                  {goal.short}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        <label htmlFor="projet" className="block text-[0.86rem] font-medium">
          Ou décrivez votre projet en une phrase
        </label>
        <textarea
          id="projet"
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={3}
          maxLength={600}
          placeholder="Je souhaite venir en Algérie une dizaine de jours pour faire un bilan, m'occuper de mes dents et me reposer un peu."
          className="field mt-2.5 resize-none"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setText(example)}
              className="rounded-full border px-3 py-1.5 text-[0.72rem] transition-colors"
              style={{ borderColor: "var(--border)", color: "var(--muted)" }}
            >
              {example.length > 52 ? `${example.slice(0, 52)}…` : example}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button type="button" onClick={start} disabled={!ready} className="btn btn-primary group">
          <Sparkles size={16} />
          Construire mon parcours
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
        </button>
        <p className="text-[0.78rem] faint">
          {selected.length > 0
            ? `${selected.length} objectif${selected.length > 1 ? "s" : ""} sélectionné${selected.length > 1 ? "s" : ""}`
            : "Sélectionnez un objectif ou décrivez votre projet"}
        </p>
      </div>
    </div>
  );
}
