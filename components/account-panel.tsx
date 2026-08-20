"use client";

import { LogIn, LogOut, ShieldCheck, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/components/i18n-provider";

/**
 * Connexion, inscription, déconnexion.
 *
 * Un seul formulaire qui bascule entre deux intentions plutôt que deux pages :
 * quelqu'un qui se trompe d'onglet ne perd pas ce qu'il a saisi.
 *
 * Le mot de passe n'est jamais renvoyé au client, et l'erreur de connexion ne
 * distingue pas l'adresse inconnue du mot de passe faux — le dire reviendrait
 * à confirmer qu'une adresse est inscrite.
 */

interface Account {
  id: string;
  email: string;
  displayName: string;
  role: string;
}

export function AccountPanel() {
  const { t } = useTranslation();
  const [account, setAccount] = useState<Account | null>(null);
  const [capacites, setCapacites] = useState<string[]>([]);
  const [mode, setMode] = useState<"connexion" | "inscription">("connexion");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const r = await fetch("/api/compte", { cache: "no-store" });
        const d = await r.json();
        setAccount(d.account ?? null);
        setCapacites(d.capacites ?? []);
      } finally {
        setChargement(false);
      }
    })();
  }, []);

  const envoyer = async (action: string) => {
    setPending(true);
    setError("");
    try {
      const r = await fetch("/api/compte", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, email, password, displayName }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d?.error ?? t.account.failed);
      setAccount(d.account ?? null);
      setCapacites(d.capacites ?? []);
      setPassword("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : t.account.failed);
    } finally {
      setPending(false);
    }
  };

  if (chargement) {
    return <p className="text-[0.86rem] faint">{t.account.loading}</p>;
  }

  if (account) {
    return (
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <ShieldCheck size={18} strokeWidth={1.6} style={{ color: "var(--secondary)" }} />
          <h2 className="text-[1.05rem]">{account.displayName}</h2>
          <span className="badge">{t.account.roles[account.role as keyof typeof t.account.roles]}</span>
        </div>
        <p className="mt-2 text-[0.84rem] faint">{account.email}</p>

        <h3 className="mt-5 text-[0.66rem] uppercase tracking-[0.2em] faint">
          {t.account.canDo}
        </h3>
        <ul className="mt-2.5 space-y-1 text-[0.86rem] leading-6 muted">
          {capacites.map((entry) => (
            <li key={entry}>— {entry}</li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => envoyer("deconnexion")}
          disabled={pending}
          className="btn btn-ghost mt-6"
        >
          <LogOut size={15} />
          {t.account.signOut}
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void envoyer(mode);
      }}
      className="card grid gap-4 p-6"
    >
      <div className="flex gap-2">
        {(["connexion", "inscription"] as const).map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => {
              setMode(entry);
              setError("");
            }}
            aria-pressed={mode === entry}
            className="rounded-full border px-3.5 py-2 text-[0.78rem] transition-colors"
            style={{
              borderColor: mode === entry ? "var(--primary)" : "var(--border-strong)",
              background: mode === entry ? "var(--primary)" : "transparent",
              color: mode === entry ? "#fff" : "var(--muted)",
            }}
          >
            {entry === "connexion" ? t.account.signIn : t.account.signUp}
          </button>
        ))}
      </div>

      {mode === "inscription" && (
        <label className="block">
          <span className="block text-[0.86rem] font-medium">{t.account.displayName}</span>
          <input
            type="text"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            className="field mt-2"
          />
        </label>
      )}

      <label className="block">
        <span className="block text-[0.86rem] font-medium">{t.account.email}</span>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          autoComplete="email"
          className="field mt-2"
        />
      </label>

      <label className="block">
        <span className="block text-[0.86rem] font-medium">{t.account.password}</span>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={10}
          maxLength={200}
          autoComplete={mode === "inscription" ? "new-password" : "current-password"}
          className="field mt-2"
        />
        <span className="mt-1.5 block text-[0.76rem] leading-5 faint">{t.account.passwordHint}</span>
      </label>

      {error && (
        <p role="alert" className="text-[0.86rem]" style={{ color: "#9a3b30" }}>
          {error}
        </p>
      )}

      <button type="submit" disabled={pending} className="btn btn-primary justify-self-start">
        {mode === "inscription" ? <UserPlus size={15} /> : <LogIn size={15} />}
        {pending ? t.account.pending : mode === "inscription" ? t.account.signUp : t.account.signIn}
      </button>

      <p className="text-[0.76rem] leading-5 faint">{t.account.notice}</p>
    </form>
  );
}
