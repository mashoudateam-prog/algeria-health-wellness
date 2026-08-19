"use client";

import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { DESTINATIONS } from "@/data/destinations";
import { FACILITIES, FACILITY_KIND_LABEL } from "@/data/facilities";
import { ALGERIA_PATH, COAST_PATH, MAP_VIEWBOX, REGION_LABEL, WILAYAS, project } from "@/data/geo";
import type { FacilityKind, Region } from "@/types/domain";

/**
 * Algeria Health Map.
 *
 * Carte vectorielle construite à partir des coordonnées réelles des chefs-lieux
 * et d'un contour national simplifié. Aucun fournisseur de tuiles, donc aucune
 * clé d'API, aucun traceur tiers et aucune fuite de la position de l'utilisateur.
 */

const KINDS: FacilityKind[] = [
  "clinique",
  "hopital",
  "dentaire",
  "reeducation",
  "thermal",
  "spa",
  "forme",
  "laboratoire",
  "imagerie",
  "nutrition",
  "hebergement",
];

const REGION_TONE: Record<Region, string> = {
  littoral: "#2f5f73",
  "hauts-plateaux": "#17382f",
  sud: "#9a6845",
  "grand-sud": "#c08a63",
};

export function AlgeriaMap() {
  const [active, setActive] = useState<FacilityKind[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    for (const facility of FACILITIES) {
      if (active.length > 0 && !active.includes(facility.kind)) continue;
      map.set(facility.destinationSlug, (map.get(facility.destinationSlug) ?? 0) + 1);
    }
    return map;
  }, [active]);

  const toggle = (kind: FacilityKind) =>
    setActive((current) =>
      current.includes(kind) ? current.filter((entry) => entry !== kind) : [...current, kind],
    );

  const destination = selected ? DESTINATIONS.find((entry) => entry.slug === selected) : null;
  const destinationFacilities = destination
    ? FACILITIES.filter(
        (facility) =>
          facility.destinationSlug === destination.slug &&
          (active.length === 0 || active.includes(facility.kind)),
      )
    : [];

  return (
    <div className="grid gap-8 lg:grid-cols-[1.55fr_0.45fr]">
      <div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer par type de structure">
          <button
            type="button"
            onClick={() => setActive([])}
            aria-pressed={active.length === 0}
            className="rounded-full border px-3.5 py-2 text-[0.78rem] transition-colors"
            style={{
              borderColor: active.length === 0 ? "var(--primary)" : "var(--border-strong)",
              background: active.length === 0 ? "var(--primary)" : "transparent",
              color: active.length === 0 ? "#fff" : "var(--muted)",
            }}
          >
            Tout afficher
          </button>
          {KINDS.map((kind) => {
            const on = active.includes(kind);
            return (
              <button
                key={kind}
                type="button"
                onClick={() => toggle(kind)}
                aria-pressed={on}
                className="rounded-full border px-3.5 py-2 text-[0.78rem] transition-colors"
                style={{
                  borderColor: on ? "var(--primary)" : "var(--border-strong)",
                  background: on ? "var(--primary)" : "transparent",
                  color: on ? "#fff" : "var(--muted)",
                }}
              >
                {FACILITY_KIND_LABEL[kind]}
              </button>
            );
          })}
        </div>

        <figure
          className="mt-6 overflow-hidden rounded-[32px] border"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <svg
            viewBox={`0 0 ${MAP_VIEWBOX.width} ${MAP_VIEWBOX.height}`}
            className="h-auto w-full"
            role="img"
            aria-label="Carte de l'Algérie situant les destinations santé"
          >
            <title>Carte santé de l&apos;Algérie</title>

            <defs>
              <linearGradient id="territoire" x1="0" y1="0" x2="0.3" y2="1">
                <stop offset="0%" stopColor="#efe9dd" />
                <stop offset="55%" stopColor="#e6dfd0" />
                <stop offset="100%" stopColor="#ded4c0" />
              </linearGradient>
            </defs>

            <path d={ALGERIA_PATH} fill="url(#territoire)" stroke="rgba(22,37,31,0.22)" strokeWidth={1.6} />
            <path d={COAST_PATH} fill="none" stroke="#2f5f73" strokeWidth={2.4} strokeLinecap="round" opacity={0.5} />

            {/* Chefs-lieux : repères discrets de lecture du territoire. */}
            <g>
              {WILAYAS.map((wilaya) => {
                const { x, y } = project(wilaya.lon, wilaya.lat);
                return <circle key={wilaya.code} cx={x} cy={y} r={2.2} fill="rgba(22,37,31,0.2)" />;
              })}
            </g>

            {/* Destinations éditoriales. */}
            <g>
              {DESTINATIONS.map((entry) => {
                const { x, y } = project(entry.lon, entry.lat);
                const count = counts.get(entry.slug) ?? 0;
                const dimmed = active.length > 0 && count === 0;
                const radius = 9 + Math.min(count, 5) * 2.6;
                const isSelected = selected === entry.slug;

                return (
                  <g
                    key={entry.slug}
                    onClick={() => setSelected(isSelected ? null : entry.slug)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelected(isSelected ? null : entry.slug);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`${entry.name} — ${count} structure${count > 1 ? "s" : ""} correspondante${count > 1 ? "s" : ""}`}
                    style={{ cursor: "pointer", opacity: dimmed ? 0.28 : 1, transition: "opacity 240ms" }}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={radius + 7}
                      fill={REGION_TONE[entry.region]}
                      opacity={isSelected ? 0.2 : 0.09}
                    />
                    <circle
                      cx={x}
                      cy={y}
                      r={radius}
                      fill={REGION_TONE[entry.region]}
                      stroke="#fff"
                      strokeWidth={isSelected ? 3 : 2}
                    />
                    {count > 0 && (
                      <text
                        x={x}
                        y={y + 3.6}
                        textAnchor="middle"
                        fontSize={10}
                        fontWeight={600}
                        fill="#fff"
                        style={{ pointerEvents: "none" }}
                      >
                        {count}
                      </text>
                    )}
                    <text
                      x={x}
                      y={y - radius - 9}
                      textAnchor="middle"
                      fontSize={16}
                      fill="#16251f"
                      fontFamily="var(--font-display)"
                      style={{ pointerEvents: "none" }}
                    >
                      {entry.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </figure>

        <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.74rem] faint">
          {(Object.keys(REGION_LABEL) as Region[]).map((region) => (
            <span key={region} className="inline-flex items-center gap-2">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: REGION_TONE[region] }}
              />
              {REGION_LABEL[region]}
            </span>
          ))}
          <span>Tracé simplifié, destiné à la lecture et non à la navigation.</span>
        </figcaption>
      </div>

      <aside className="lg:sticky lg:top-28 lg:h-fit">
        {destination ? (
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.62rem] uppercase tracking-[0.22em] faint">
                  {REGION_LABEL[destination.region]}
                </p>
                <h3 className="mt-2 text-[1.5rem] leading-tight">{destination.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Fermer le détail"
                className="rounded-full p-1.5 transition-colors hover:bg-black/5"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mt-3 text-[0.86rem] leading-6 muted">{destination.tagline}</p>

            <h4 className="mt-6 text-[0.66rem] uppercase tracking-[0.2em] faint">
              Structures référencées
            </h4>
            {destinationFacilities.length > 0 ? (
              <ul className="mt-3 space-y-2.5">
                {destinationFacilities.map((facility) => (
                  <li key={facility.id} className="text-[0.84rem] leading-5">
                    <span className="block">{facility.name}</span>
                    <span className="faint">{FACILITY_KIND_LABEL[facility.kind]}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[0.84rem] leading-6 faint">
                Aucune structure ne correspond aux filtres actifs.
              </p>
            )}

            <p className="mt-5 text-[0.72rem] leading-5 faint">
              Catalogue de démonstration : ces structures sont fictives.
            </p>

            <Link href={`/destinations/${destination.slug}`} className="btn btn-primary mt-6 w-full">
              Découvrir {destination.name}
              <ArrowRight size={15} />
            </Link>
          </div>
        ) : (
          <div className="card-soft p-6">
            <h3 className="text-[1.1rem] leading-snug">Sélectionnez une destination</h3>
            <p className="mt-3 text-[0.86rem] leading-6 muted">
              Les pastilles indiquent le nombre de structures correspondant aux filtres.
              Touchez une destination pour en voir le détail.
            </p>
            <p className="mt-5 text-[0.78rem] leading-5 faint">
              {DESTINATIONS.length} destinations éditoriales · {WILAYAS.length} wilayas ·
              aucune donnée de localisation n&apos;est collectée.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
