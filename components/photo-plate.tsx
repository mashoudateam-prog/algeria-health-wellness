import { resolvePhoto } from "@/lib/photos";

interface PhotoPlateProps {
  slug: string;
  alt: string;
  /** Titre gravé sur la planche éditoriale lorsqu'aucune photographie n'est déposée. */
  caption: string;
  overline?: string;
  index?: number;
  className?: string;
  /** Retire le voile sombre, pour les usages sans texte superposé. */
  plain?: boolean;
  priority?: boolean;
}

/**
 * Cadre média éditorial.
 *
 * Si une photographie existe dans `public/photos/`, elle est affichée.
 * Sinon, une planche composée tient sa place : bandes de sable et de vert
 * profond, grain, numéro de planche et titre en typographie éditoriale.
 * L'emplacement réservé est assumé visuellement plutôt que masqué.
 */
export function PhotoPlate({
  slug,
  alt,
  caption,
  overline,
  index,
  className = "",
  plain = false,
  priority = false,
}: PhotoPlateProps) {
  const photo = resolvePhoto(slug);

  return (
    <figure className={`frame ${plain ? "frame-plain" : ""} ${className}`}>
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element -- visuel local, dimensions fluides
        <img
          src={photo}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="h-full w-full object-cover"
        />
      ) : (
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
          <div
            className="absolute inset-0 mix-blend-multiply opacity-[0.13]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 26% 22%, rgba(23,56,47,0.85), transparent 58%), radial-gradient(circle at 78% 78%, rgba(154,104,69,0.75), transparent 62%)",
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
              <p className="serif text-[clamp(1.6rem,4vw,2.6rem)] leading-none text-white">
                {caption}
              </p>
              <p className="mt-3 max-w-xs text-[0.66rem] leading-5 text-white/60">
                Emplacement réservé — à remplacer par une photographie sous licence
                (<code className="text-white/75">public/photos/{slug}.jpg</code>).
              </p>
            </div>
          </div>
        </div>
      )}
      {!photo && <span className="sr-only">{alt}</span>}
    </figure>
  );
}
