import { Box, Camera, Film, Sparkles } from "lucide-react";
import { PanoramaViewer } from "@/components/panorama-viewer";
import { VideoFrame } from "@/components/video-frame";
import { resolveImmersive } from "@/lib/immersive";
import { getTranslation } from "@/lib/i18n/server";
import type { Dictionary } from "@/lib/i18n/dictionaries/fr";

/**
 * Emplacement immersif.
 *
 * Choisit le meilleur média disponible pour un lieu : panorama 360°, vidéo,
 * ou modèle 3D. Sans média, affiche une invitation explicite plutôt qu'un
 * espace vide — le dispositif se comprend même avant d'être rempli.
 */
export async function ImmersiveSlot({
  slug,
  title,
  className = "h-[26rem]",
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const { t } = await getTranslation();
  const assets = resolveImmersive(slug);

  if (assets.panorama) {
    return (
      <PanoramaViewer
        src={assets.panorama}
        alt={t.immersive.panorama360(title)}
        caption={t.immersive.panoramaCaption}
        className={className}
      />
    );
  }

  if (assets.video) {
    return (
      <VideoFrame
        src={assets.video}
        poster={assets.poster ?? undefined}
        label={t.immersive.videoLabel(title)}
        className={className}
      />
    );
  }

  return <PendingSlot slug={slug} title={title} className={className} t={t} />;
}

/* ------------------------------------------------------------------ */

/**
 * Emplacement en attente de contenu.
 *
 * Il annonce ce qui viendra et comment le produire, plutôt que de laisser un
 * trou. Le même parti pris que les planches éditoriales des photographies :
 * un emplacement réservé assumé vaut mieux qu'un remplissage.
 */
function PendingSlot({
  slug,
  title,
  className,
  t,
}: {
  slug: string;
  title: string;
  className: string;
  t: Dictionary;
}) {
  return (
    <figure
      className={`frame frame-plain flex items-center justify-center ${className}`}
      style={{ background: "linear-gradient(152deg, #1d3b32 0%, #2f5f73 58%, #17382f 100%)" }}
    >
      <div className="max-w-md px-8 py-10 text-center">
        <Sparkles size={22} strokeWidth={1.6} className="mx-auto" style={{ color: "#c08a63" }} />
        <p className="mt-4 serif text-[clamp(1.3rem,2.6vw,1.9rem)] leading-tight text-white">
          {t.immersive.pendingTitle(title)}
        </p>
        <p className="mt-3 text-[0.84rem] leading-6 text-white/60">
          {t.immersive.pendingBody}
        </p>

        <ul className="mt-6 space-y-2 text-left text-[0.74rem] leading-5 text-white/55">
          <li className="flex items-start gap-2.5">
            <Camera size={13} className="mt-0.5 shrink-0" />
            <span>
              <code className="text-white/75">{slug}-360.jpg</code> —{" "}
              {t.immersive.hintPanorama}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Film size={13} className="mt-0.5 shrink-0" />
            <span>
              <code className="text-white/75">{slug}.mp4</code> — {t.immersive.hintVideo}{" "}
              <code className="text-white/75">{slug}-poster.jpg</code>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Box size={13} className="mt-0.5 shrink-0" />
            <span>
              <code className="text-white/75">{slug}.glb</code> — {t.immersive.hintModel}
            </span>
          </li>
        </ul>

        <p className="mt-5 text-[0.7rem] text-white/35">
          {t.immersive.folder} <code>public/immersive/</code>
        </p>
      </div>
    </figure>
  );
}
