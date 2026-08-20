"use client";

import { CheckCircle2, Send } from "lucide-react";
import { useState } from "react";
import { WILAYAS } from "@/data/geo";
import { useTranslation } from "@/components/i18n-provider";
import type { NewsCategory } from "@/types/news";

const CATEGORIES: NewsCategory[] = [
  "evenement",
  "ouverture",
  "promotion",
  "festival",
  "gastronomie",
  "cure",
];

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
  const { t } = useTranslation();
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
      if (!response.ok) throw new Error(payload?.error ?? t.submitForm.failed);
      setSent(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.submitForm.failed);
    } finally {
      setPending(false);
    }
  };

  if (sent) {
    return (
      <div className="card p-8">
        <CheckCircle2 size={26} strokeWidth={1.6} style={{ color: "var(--secondary)" }} />
        <h2 className="mt-4 text-[1.3rem]">{t.submitForm.sentTitle}</h2>
        <p className="mt-3 max-w-lg leading-7 muted">{t.submitForm.sentBody}</p>
        <button type="button" onClick={() => setSent(false)} className="btn btn-ghost mt-6">
          {t.submitForm.sentAgain}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card grid gap-5 p-7 sm:p-8">
      <Field label={t.submitForm.title} hint={t.submitForm.titleHint}>
        <input
          name="title"
          required
          minLength={8}
          maxLength={180}
          className="field"
          placeholder={t.submitForm.titlePlaceholder}
        />
      </Field>

      <Field label={t.submitForm.description} hint={t.submitForm.descriptionHint}>
        <textarea
          name="summary"
          required
          minLength={20}
          maxLength={600}
          rows={4}
          className="field resize-none"
          placeholder={t.submitForm.descriptionPlaceholder}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t.submitForm.category}>
          <select name="category" required defaultValue="evenement" className="field">
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {t.newsPage.categories[category]}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t.submitForm.wilaya}>
          <select name="wilayaCode" required defaultValue="16" className="field">
            {WILAYAS.map((wilaya) => (
              <option key={wilaya.code} value={wilaya.code}>
                {wilaya.code} — {wilaya.name}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t.submitForm.startsOn} hint={t.submitForm.startsOnHint}>
          <input type="date" name="startsOn" className="field" />
        </Field>

        <Field label={t.submitForm.organisation}>
          <input
            name="sourceName"
            required
            minLength={2}
            maxLength={120}
            className="field"
            placeholder={t.submitForm.organisationPlaceholder}
          />
        </Field>
      </div>

      <Field
        label={t.submitForm.sourceUrl}
        hint={t.submitForm.sourceUrlHint}
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
          {pending ? t.submitForm.sending : t.submitForm.send}
        </button>
        <p className="text-[0.78rem] faint">{t.submitForm.reviewed}</p>
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
