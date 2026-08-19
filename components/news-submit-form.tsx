"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { WILAYAS } from "@/data/geo";
import { NEWS_CATEGORY_LABEL, type NewsCategory } from "@/types/news";

const CATEGORIES = Object.keys(NEWS_CATEGORY_LABEL) as NewsCategory[];

/**
 * Formulaire partenaire.
 *
 * C'est la meilleure source de la veille : un établissement qui ouvre connaît
 * la date exacte, l'adresse exacte et le prix exact. L'agent, lui, doit les
 * deviner à partir d'un article de presse.
 *
 * La soumission entre malgré tout en file de modération : personne ne publie
 * directement sur la plateforme.
 */
export function NewsSubmitForm() {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;

    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/actualites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          summary: form.get("summary"),
          category: form.get("category"),
          wilayaCode: form.get("wilayaCode"),
          startsOn: form.get("startsOn") || undefined,
          sourceUrl: form.get("sourceUrl"),
          sourceName: form.get("sourceName"),
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Envoi impossible.");
      setSent(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Envoi impossible.");
    } finally {
      setPending(false);
    }
  };

  if (sent) {
    return (
      <div className="card p-8">
        <CheckCircle2 size={26} strokeWidth={1.6} style={{ color: "var(--secondary)" }} />
        <h2 className="mt-4 text-[1.3rem]">Proposition enregistrée</h2>
        <p className="mt-3 max-w-lg leading-7 muted">
          Merci. Elle sera relue avant d&apos;apparaître dans le fil. Nous vérifions
          systématiquement la source, la date et le lieu — c&apos;est ce qui fait que nos
          lecteurs peuvent s&apos;y fier.
        </p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-ghost mt-6">
          Proposer autre chose
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card grid gap-5 p-7 sm:p-8">
      <Field label="Titre" hint="Ce que vous annonceriez en une phrase.">
        <input
          name="title"
          required
          minLength={8}
          maxLength={180}
          className="field"
          placeholder="Ouverture d'un centre de thalassothérapie à Aïn Turck"
        />
      </Field>

      <Field label="Description" hint="Ce qu'il faut savoir : quoi, pour qui, quand.">
        <textarea
          name="summary"
          required
          minLength={20}
          maxLength={600}
          rows={4}
          className="field resize-none"
          placeholder="Bassins d'eau de mer chauffée, espace de récupération et programmes encadrés…"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Catégorie">
          <select name="category" required defaultValue="evenement" className="field">
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {NEWS_CATEGORY_LABEL[category]}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Wilaya">
          <select name="wilayaCode" required defaultValue="16" className="field">
            {WILAYAS.map((wilaya) => (
              <option key={wilaya.code} value={wilaya.code}>
                {wilaya.code} — {wilaya.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Date de début" hint="Facultatif pour une ouverture.">
          <input type="date" name="startsOn" className="field" />
        </Field>

        <Field label="Organisation">
          <input
            name="sourceName"
            required
            minLength={2}
            maxLength={120}
            className="field"
            placeholder="Nom de votre établissement"
          />
        </Field>
      </div>

      <Field
        label="Lien vérifiable"
        hint="Page officielle, communiqué ou article. Sans lien, nous ne publions pas."
      >
        <input type="url" name="sourceUrl" required className="field" placeholder="https://…" />
      </Field>

      {error && (
        <p role="alert" className="text-[0.86rem]" style={{ color: "#9a3b30" }}>
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className="btn btn-primary">
          <Send size={15} />
          {pending ? "Envoi…" : "Envoyer la proposition"}
        </button>
        <p className="text-[0.78rem] faint">Relu avant publication.</p>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[0.86rem] font-medium">{label}</span>
      {hint && <span className="mt-0.5 block text-[0.76rem] leading-5 faint">{hint}</span>}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
