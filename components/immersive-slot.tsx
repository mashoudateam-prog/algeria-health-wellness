import { Box, Camera, Film, Sparkles } from "lucide-react";
import { PanoramaViewer } from "@/components/panorama-viewer";
import { VideoFrame } from "@/components/video-frame";
import { resolveImmersive } from "@/lib/immersive";

/**
 * Emplacement immersif.
 *
 * Choisit le meilleur média disponible pour un lieu : panorama 360°, vidéo,
 * ou modèle 3D. Sans média, affiche une invitation explicite plutôt qu'un
 * espace vide — le dispositif se comprend même avant d'être rempli.
 */
export function ImmersiveSlot({
  slug,
  title,
  className = "h-[26rem]",
}: {
  slug: string;
  title: string;
  className?: string;
}) {
  const assets = resolveImmersive(slug);

  if (assets.panorama) {
    return (
      <PanoramaViewer
        src={assets.panorama}
        alt={`Vue à 360 degrés de ${title}`}
        caption="Vue 360°"
        className={className}
      />
    );
  }

  if (assets.video) {
    return (
      <VideoFrame
        src={assets.video}
        poster={assets.poster ?? undefined}
        label={`Vidéo — ${title}`}
        className={className}
      />
    );
  }

  return <PendingSlot slug={slug} title={title} className={className} />;
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
}: {
  slug: string;
  title: string;
  className: string;
}) {
  return (
    <figure
      className={`frame frame-plain flex items-center justify-center ${className}`}
      style={{ background: "linear-gradient(152deg, #1d3b32 0%, #2f5f73 58%, #17382f 100%)" }}
    >
      <div className="max-w-md px-8 py-10 text-center">
        <Sparkles size={22} strokeWidth={1.6} className="mx-auto" style={{ color: "#c08a63" }} />
        <p className="mt-4 serif text-[clamp(1.3rem,2.6vw,1.9rem)] leading-tight text-white">
          {title} en immersion
        </p>
        <p className="mt-3 text-[0.84rem] leading-6 text-white/60">
          Cet emplacement attend son contenu. Déposez un fichier et il s&apos;affiche,
          sans modification de code.
        </p>

        <ul className="mt-6 space-y-2 text-left text-[0.74rem] leading-5 text-white/55">
          <li className="flex items-start gap-2.5">
            <Camera size={13} className="mt-0.5 shrink-0" />
            <span>
              <code className="text-white/75">{slug}-360.jpg</code> — panorama, mode
              photosphère d&apos;un téléphone
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Film size={13} className="mt-0.5 shrink-0" />
            <span>
              <code className="text-white/75">{slug}.mp4</code> — vidéo, avec une affiche
              en <code className="text-white/75">{slug}-poster.jpg</code>
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Box size={13} className="mt-0.5 shrink-0" />
            <span>
              <code className="text-white/75">{slug}.glb</code> — modèle 3D, capture Luma
              AI ou Polycam
            </span>
          </li>
        </ul>

        <p className="mt-5 text-[0.7rem] text-white/35">
          Dossier <code>public/immersive/</code>
        </p>
      </div>
    </figure>
  );
}
