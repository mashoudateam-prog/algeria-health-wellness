"use client";

import { Info, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ConciergeMessage } from "@/types/domain";

const OPENING: ConciergeMessage = {
  role: "concierge",
  content:
    "Bonjour. Je peux vous aider à préparer un séjour de santé, de bien-être ou de remise en forme en Algérie : comprendre l'offre, organiser les rendez-vous, préparer vos documents, ou construire un parcours. Que souhaitez-vous faire ?",
  suggestions: [
    "Je veux venir une semaine pour prendre soin de moi",
    "Quels documents dois-je préparer ?",
    "Comment fonctionne le partage de mes documents ?",
  ],
};

export function ConciergeChat() {
  const [messages, setMessages] = useState<ConciergeMessage[]>([OPENING]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages, pending]);

  const send = async (raw: string) => {
    const message = raw.trim();
    if (!message || pending) return;

    const history = messages;
    setMessages((current) => [...current, { role: "patient", content: message }]);
    setDraft("");
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          history: history.map((entry) => ({ role: entry.role, content: entry.content })),
        }),
      });

      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Réponse indisponible.");
      setMessages((current) => [...current, payload.reply as ConciergeMessage]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Réponse indisponible.");
    } finally {
      setPending(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="card flex h-[min(74vh,680px)] flex-col overflow-hidden">
      <header
        className="flex items-center gap-3 border-b px-6 py-4"
        style={{ borderColor: "var(--border)" }}
      >
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full text-white"
          style={{ background: "var(--primary)" }}
        >
          <Sparkles size={16} />
        </span>
        <div>
          <p className="text-[0.92rem] font-medium">Concierge santé</p>
          <p className="text-[0.72rem] faint">Assistant de parcours — ne remplace pas un professionnel</p>
        </div>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6" role="log" aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={message.role === "patient" ? "flex justify-end" : ""}
          >
            <div className={message.role === "patient" ? "max-w-[85%]" : "max-w-[92%]"}>
              <div
                className="rounded-[20px] px-5 py-3.5 text-[0.92rem] leading-7"
                style={
                  message.role === "patient"
                    ? { background: "var(--primary)", color: "#fff" }
                    : { background: "var(--surface-soft)", color: "var(--text)" }
                }
              >
                {message.content.split("\n").map((line, lineIndex) => (
                  <p key={lineIndex} className={lineIndex > 0 ? "mt-2.5" : undefined}>
                    {line}
                  </p>
                ))}
              </div>

              {message.notice && (
                <p className="mt-2 flex items-start gap-2 px-1 text-[0.76rem] leading-5 faint">
                  <Info size={13} className="mt-0.5 shrink-0" />
                  {message.notice}
                </p>
              )}

              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => send(suggestion)}
                      disabled={pending}
                      className="rounded-full border px-3.5 py-1.5 text-[0.76rem] transition-colors disabled:opacity-40"
                      style={{ borderColor: "var(--border-strong)", color: "var(--muted)" }}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {pending && (
          <p className="text-[0.84rem] faint" aria-label="Le concierge rédige une réponse">
            Le concierge réfléchit…
          </p>
        )}

        {error && (
          <p role="alert" className="text-[0.86rem]" style={{ color: "#9a3b30" }}>
            {error}
          </p>
        )}

        <div ref={endRef} />
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void send(draft);
        }}
        className="border-t px-5 py-4 sm:px-6"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-end gap-3">
          <label htmlFor="message-concierge" className="sr-only">
            Votre message
          </label>
          <textarea
            id="message-concierge"
            ref={inputRef}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                void send(draft);
              }
            }}
            rows={1}
            maxLength={1500}
            placeholder="Écrivez votre message…"
            className="field max-h-32 flex-1 resize-none py-3"
          />
          <button
            type="submit"
            disabled={pending || draft.trim().length === 0}
            className="btn btn-primary shrink-0 px-4"
            aria-label="Envoyer"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="mt-2.5 text-[0.72rem] leading-5 faint">
          N&apos;indiquez pas d&apos;informations que vous ne souhaitez pas transmettre. En
          cas d&apos;urgence, contactez les secours : Protection civile 14, SAMU 115.
        </p>
      </form>
    </div>
  );
}
