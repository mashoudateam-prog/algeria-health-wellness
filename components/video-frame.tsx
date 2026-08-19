"use client";

import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useRef, useState } from "react";

/**
 * Lecteur vidéo.
 *
 * Contrôles maison plutôt que ceux du navigateur : ils sont identiques partout
 * et respectent la direction artistique. Le lecteur natif reste accessible au
 * clavier via l'élément sous-jacent.
 *
 * La vidéo ne démarre jamais seule avec du son — une page qui parle sans qu'on
 * le lui demande est une page qu'on ferme.
 */
export function VideoFrame({
  src,
  poster,
  label,
  className = "h-[26rem]",
  captions,
}: {
  src: string;
  poster?: string;
  label: string;
  className?: string;
  /** Piste de sous-titres WebVTT, vivement recommandée. */
  captions?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleSound = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  return (
    <figure className={`frame frame-plain relative ${className}`}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={label}
        onEnded={() => setPlaying(false)}
        className="h-full w-full object-cover"
      >
        {captions && <track kind="captions" src={captions} srcLang="fr" label="Français" default />}
      </video>

      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Lire la vidéo : ${label}`}
          className="absolute inset-0 flex items-center justify-center transition-colors hover:bg-black/10"
        >
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full text-white backdrop-blur-md"
            style={{ background: "rgba(23,56,47,0.72)" }}
          >
            <Play size={22} className="ml-0.5" fill="currentColor" />
          </span>
        </button>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        {playing && (
          <button
            type="button"
            onClick={toggle}
            aria-label="Mettre en pause"
            className="flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-md"
            style={{ background: "rgba(10,22,18,0.5)" }}
          >
            <Pause size={14} />
          </button>
        )}
        <button
          type="button"
          onClick={toggleSound}
          aria-label={muted ? "Activer le son" : "Couper le son"}
          className="flex h-8 w-8 items-center justify-center rounded-full text-white backdrop-blur-md"
          style={{ background: "rgba(10,22,18,0.5)" }}
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
    </figure>
  );
}
