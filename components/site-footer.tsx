import { HeartPulse } from "lucide-react";
import Link from "next/link";

const COLUMNS = [
  {
    title: "Découvrir",
    links: [
      { href: "/parcours", label: "Construire mon parcours" },
      { href: "/destinations", label: "Destinations santé" },
      { href: "/carte", label: "Carte santé de l'Algérie" },
      { href: "/sejours", label: "Séjours bien-être" },
    ],
  },
  {
    title: "Mon espace",
    links: [
      { href: "/espace", label: "Tableau de bord" },
      { href: "/espace/documents", label: "Health Passport" },
      { href: "/concierge", label: "Concierge santé" },
    ],
  },
  {
    title: "Confiance",
    links: [
      { href: "/confiance", label: "Sécurité et confidentialité" },
      { href: "/confiance#verification", label: "Comment nous vérifions" },
      { href: "/confiance#ia", label: "Limites de l'IA" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer style={{ background: "#111d19", color: "#fff" }}>
      <div className="shell section-tight">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <HeartPulse size={18} strokeWidth={1.8} />
              </span>
              <span className="text-[0.82rem] font-semibold tracking-[0.2em]">
                ALGERIA HEALTH &amp; WELLNESS
              </span>
            </div>
            <p className="mt-5 max-w-sm text-[0.9rem] leading-7 text-white/55">
              Votre santé. Votre séjour. Votre parcours. Une plateforme qui réunit soins,
              bien-être, récupération et hospitalité, sans jamais remplacer un professionnel
              de santé.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-[0.66rem] uppercase tracking-[0.22em] text-white/40">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-[0.88rem] text-white/70">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="transition-colors hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-7">
          <p className="text-[0.78rem] leading-6 text-white/45">
            Les informations diffusées sur cette plateforme sont indicatives et ne
            constituent pas un diagnostic médical. Seul un professionnel de santé habilité
            peut évaluer votre situation. Le catalogue d&apos;établissements et de praticiens
            actuellement affiché est un jeu de démonstration, signalé comme tel.
          </p>
          <p className="mt-4 text-[0.78rem] text-white/35">
            © {new Date().getFullYear()} Algeria Health &amp; Wellness — projet en construction.
          </p>
        </div>
      </div>
    </footer>
  );
}
