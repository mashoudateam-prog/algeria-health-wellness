"use client";

import { AlertTriangle, ArrowUpRight, Check, Database, RefreshCw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { CollectionRun } from "@/lib/news/store";
import { NEWS_CATEGORY_LABEL, NEWS_ORIGIN_LABEL, type NewsItem } from "@/types/news";

/**
 * Console de modération.
 *
 * C'est le point de contrôle humain de toute la veille : rien n'entre dans le
 * fil public sans passer par un clic ici. La page affiche aussi l'état de
 * chaque source, pour qu'un flux mort se remarque tout seul.
 *
 * Le jeton est conservé en `sessionStorage` : il disparaît à la fermeture de
 * l'onglet et n'est jamais écrit dans l'URL.
 */

interface Queue {
  proposes: NewsItem[];
  publies: NewsItem[];
  rejetes: NewsItem[];
  dernierPassage: CollectionRun | null;
  stockage: "postgres" | "memoire";
}

export function NewsModeration() {
  const [token, setToken] = useState("");
  const [queue, setQueue] = useState<Queue | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("ahw-admin-token");
    if (saved) setToken(saved);
  }, []);

  const headers = useCallback(
    (): Record<string, string> =>
      token
        ? { "x-admin-token": token, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" },
    [token],
  );

  const load = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/actualites/moderation", { headers: headers() });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Chargement impossible.");
      setQueue(payload as Queue);
      if (token) sessionStorage.setItem("ahw-admin-token", token);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Chargement impossible.");
      setQueue(null);
    } finally {
      setBusy(false);
    }
  }, [headers, token]);

  useEffect(() => {
    void load();
    // Un seul chargement à l'ouverture ; ensuite l'utilisateur pilote.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decide = async (id: string, decision: "publie" | "rejete") => {
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/actualites/moderation", {
        method: "POST",
        headers: headers(),
        body: JSON.stringify({ id, decision }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Décision refusée.");
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Décision refusée.");
      setBusy(false);
    }
  };

  const collect = async () => {
    setBusy(true);
    setError("");
    setNotice("Collecte en cours — la lecture des flux distants prend quelques secondes.");
    try {
      const response = await fetch("/api/actualites/collecte", {
        method: "POST",
        headers: headers(),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error ?? "Collecte impossible.");
      setNotice(
        `Collecte terminée : ${payload.proposees} proposition(s), ${payload.rejetees} élément(s) écarté(s).`,
      );
      await load();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Collecte impossible.");
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="card flex flex-wrap items-end gap-4 p-5">
        <label className="min-w-[16rem] flex-1">
          <span className="block text-[0.82rem] font-medium">Jeton d&apos;administration</span>
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            placeholder="ADMIN_TOKEN"
            className="field mt-2"
            autoComplete="off"
          />
        </label>
        <button type="button" onClick={load} disabled={busy} className="btn btn-ghost">
          <RefreshCw size={15} />
          Charger
        </button>
        <button type="button" onClick={collect} disabled={busy} className="btn btn-primary">
          Run a collection · Lancer une collecte
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-[0.88rem]" style={{ color: "#9a3b30" }}>
          {error}
        </p>
      )}
      {notice && !error && <p className="mt-4 text-[0.88rem] muted">{notice}</p>}

      {queue && <StockageBanner mode={queue.stockage} />}

      {queue?.dernierPassage && <RunReport run={queue.dernierPassage} />}

      {queue && (
        <>
          <h2 className="mt-12 text-[1.5rem]">
            À examiner <span className="faint">({queue.proposes.length})</span>
          </h2>

          {queue.proposes.length === 0 ? (
            <p className="mt-4 text-[0.9rem] muted">
              Rien en attente. Lancez une collecte pour en proposer.
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {queue.proposes.map((item) => (
                <li key={item.id} className="card p-6">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="badge">{NEWS_CATEGORY_LABEL[item.category]}</span>
                    <span className="badge">{NEWS_ORIGIN_LABEL[item.origin]}</span>
                    <span className="badge">Pertinence {item.relevance}</span>
                  </div>

                  <h3 className="mt-3.5 text-[1.08rem] leading-snug">{item.title}</h3>
                  <p className="mt-2.5 text-[0.88rem] leading-6 muted">{item.summary}</p>

                  <p className="mt-3 text-[0.8rem] faint">
                    {item.locationLabel}
                    {item.startsOn && ` · ${item.startsOn}`} · {item.sourceName}
                  </p>

                  {item.notes.length > 0 && (
                    <ul className="mt-3 space-y-1 text-[0.78rem] faint">
                      {item.notes.map((note) => (
                        <li key={note} className="flex gap-2">
                          <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => decide(item.id, "publie")}
                      disabled={busy}
                      className="btn btn-primary btn-sm"
                    >
                      <Check size={14} />
                      Publier
                    </button>
                    <button
                      type="button"
                      onClick={() => decide(item.id, "rejete")}
                      disabled={busy}
                      className="btn btn-ghost btn-sm"
                    >
                      <X size={14} />
                      Écarter
                    </button>
                    {item.sourceUrl && (
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="btn btn-quiet text-[0.82rem]"
                      >
                        Vérifier la source
                        <ArrowUpRight size={13} />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-10 text-[0.84rem] faint">
            {queue.publies.length} publié(s) · {queue.rejetes.length} écarté(s)
          </p>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function RunReport({ run }: { run: CollectionRun }) {
  const reasons = Object.entries(run.rejectionReasons).sort((a, b) => b[1] - a[1]);

  return (
    <div className="card-soft mt-6 p-6">
      <h2 className="text-[0.66rem] uppercase tracking-[0.22em] faint">
        Dernier passage · {new Date(run.at).toLocaleString("fr-FR")}
      </h2>

      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="text-[0.84rem] font-medium">État des sources</h3>
          <ul className="mt-2.5 space-y-1.5 text-[0.82rem]">
            {run.sources.map((source) => (
              <li key={source.label} className="flex items-center justify-between gap-3">
                <span className={source.error ? "opacity-60" : ""}>{source.label}</span>
                <span
                  className={source.error ? "" : "faint"}
                  style={source.error ? { color: "#9a3b30" } : undefined}
                >
                  {source.error ? source.error : `${source.collected} éléments`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[0.84rem] font-medium">
            Écartés automatiquement ({run.rejected})
          </h3>
          {reasons.length === 0 ? (
            <p className="mt-2.5 text-[0.82rem] faint">Aucun rejet.</p>
          ) : (
            <ul className="mt-2.5 space-y-1.5 text-[0.82rem]">
              {reasons.slice(0, 6).map(([reason, count]) => (
                <li key={reason} className="flex items-center justify-between gap-3">
                  <span className="muted">{reason}</span>
                  <span className="tabular-nums faint">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Sur quoi reposent les décisions prises ici.
 *
 * Un modérateur qui publie doit savoir si sa décision survivra au prochain
 * déploiement. La mention est donc affichée avant la file, pas dans une
 * documentation que personne n'ouvre.
 */
function StockageBanner({ mode }: { mode: "postgres" | "memoire" }) {
  const persistant = mode === "postgres";
  return (
    <p
      className="mt-4 flex items-start gap-2.5 rounded-2xl px-4 py-3 text-[0.84rem] leading-6"
      style={
        persistant
          ? { background: "rgba(125,146,123,0.16)", color: "#2f5940" }
          : { background: "rgba(154,104,69,0.1)", color: "#7a5a2e" }
      }
    >
      <Database size={15} className="mt-1 shrink-0" />
      <span>
        {persistant ? (
          <>
            <strong>Base PostgreSQL connectée.</strong> Les décisions prises ici survivent
            au redéploiement, et le dédoublonnage est arbitré par la base.
          </>
        ) : (
          <>
            <strong>Stockage en mémoire du processus.</strong> Les décisions prises ici ne
            survivront pas au prochain déploiement. Renseignez <code>DATABASE_URL</code>{" "}
            pour les conserver.
          </>
        )}
      </span>
    </p>
  );
}
