import type { ReactNode } from "react";
import { resolveImage } from "@/lib/photos";

type Scrim = "none" | "bottom" | "full";

interface PhotoPlateProps {
  slug: string;
  /** Description de secours, utilisée si l'image vient d'un fichier local. */
  alt: string;
  /** Titre gravé sur la planche éditoriale quand aucune image n'est disponible. */
  caption: string;
  overline?: string;
  index?: number;
  className?: string;
  /** Densité du voile sombre posé sur l'image, pour la lisibilité du texte. */
  scrim?: Scrim;
  /** Cadrage de l'image dans son cadre, ex. « center », « 50% 30% ». */
  focal?: string;
  /** Charge l'image sans attendre : à réserver au visuel principal. */
  priority?: boolean;
  /** Indice de largeur affichée, pour que le navigateur choisisse la bonne taille. */
  sizes?: string;
  /** Léger zoom au survol lorsque le cadre est dans un lien `.group`. */
  zoomOnHover?: boolean;
  /** Contenu superposé à l'image. */
  children?: ReactNode;
}

const SCRIM: Record<Scrim, string> = {
  none: "",
  bottom:
    "linear-gradient(to top, rgba(10,22,18,0.78) 0%, rgba(10,22,18,0.34) 34%, rgba(10,22,18,0.04) 62%, transparent 100%)",
  full:
    "linear-gradient(to top, rgba(10,22,18,0.86) 0%, rgba(10,22,18,0.52) 40%, rgba(10,22,18,0.34) 70%, rgba(10,22,18,0.30) 100%)",
};

/**
 * Cadre photographique éditorial.
 *
 * Affiche une photographie réelle quand il en existe une, avec sa localisation
 * et son auteur. À défaut, une planche composée tient la place — assumée
 * visuellement plutôt que masquée par une image de remplissage quelconque.
 */
export function PhotoPlate({
  slug,
  alt,
  caption,
  overline,
  index,
  className = "",
  scrim = "bottom",
  focal = "center",
  priority = false,
  sizes = "100vw",
  zoomOnHover = false,
  children,
}: PhotoPlateProps) {
  const image = resolveImage(slug, alt);

  return (
    <figure className={`frame frame-plain ${className}`}>
      {image ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- srcset servi par le CDN, sans quota d'optimisation */}
          <img
            src={image.src}
            srcSet={image.srcSet}
            sizes={sizes}
            alt={image.alt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className={`h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
              zoomOnHover ? "group-hover:scale-[1.045]" : ""
            }`}
            style={{ objectPosition: focal }}
          />
          {scrim !== "none" && (
            <div className="pointer-events-none absolute inset-0" style={{ background: SCRIM[scrim] }} />
          )}
        </>
      ) : (
        <EditorialPlate caption={caption} overline={overline} index={index} slug={slug} alt={alt} />
      )}

      {children && <div className="absolute inset-0">{children}</div>}

      {image?.credit && (
        <figcaption className="pointer-events-none absolute bottom-0 right-0 z-10 p-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.62rem] leading-none text-white/75 backdrop-blur-md"
            style={{ background: "rgba(10,22,18,0.42)" }}
          >
            <span>{image.credit.location}</span>
            <span aria-hidden="true" className="opacity-40">
              ·
            </span>
            <span className="opacity-70">{image.credit.photographer}</span>
          </span>
        </figcaption>
      )}
    </figure>
  );
}

/* ------------------------------------------------------------------ */

function EditorialPlate({
  caption,
  overline,
  index,
  slug,
  alt,
}: {
  caption: string;
  overline?: string;
  index?: number;
  slug: string;
  alt: string;
}) {
  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(148deg, #e8e0d0 0%, #cfc6b1 42%, #8a9a8b 74%, #2f4a3f 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.22]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(103deg, rgba(255,255,255,0.5) 0 1px, transparent 1px 26px)",
          }}
        />
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
          <div className="flex items-start justify-between text-[0.58rem] uppercase tracking-[0.28em] text-white/70">
            <span>{overline ?? "Planche éditoriale"}</span>
            {index !== undefined && (
              <span className="tabular-nums">{String(index).padStart(2, "0")}</span>
            )}
          </div>
          <div>
            <p className="serif text-[clamp(1.6rem,4vw,2.6rem)] leading-none text-white">{caption}</p>
            <p className="mt-3 max-w-xs text-[0.66rem] leading-5 text-white/60">
              Emplacement réservé — déposez <code className="text-white/75">public/photos/{slug}.jpg</code>.
            </p>
          </div>
        </div>
      </div>
      <span className="sr-only">{alt}</span>
    </>
  );
}
