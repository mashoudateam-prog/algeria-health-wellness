"use client";

import { Compass, HeartPulse, MessageCircle, Route, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const PRIMARY = [
  { href: "/parcours", label: "Mon parcours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/carte", label: "Carte santé" },
  { href: "/sejours", label: "Séjours" },
  { href: "/actualites", label: "Actualités" },
  { href: "/confiance", label: "Confiance" },
];

/** Barre inférieure mobile : cinq entrées, comme une application native. */
const MOBILE = [
  { href: "/", label: "Accueil", icon: HeartPulse },
  { href: "/destinations", label: "Explorer", icon: Compass },
  { href: "/parcours", label: "Parcours", icon: Route },
  { href: "/concierge", label: "Concierge", icon: MessageCircle },
  { href: "/espace", label: "Profil", icon: User },
];

export function SiteNav() {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in srgb, var(--background) 88%, transparent)",
        }}
      >
        <div className="shell flex h-[4.6rem] items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-3" aria-label="Algeria Health & Wellness, accueil">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: "var(--primary)" }}
            >
              <HeartPulse size={18} strokeWidth={1.8} />
            </span>
            <span className="leading-tight">
              <span className="block text-[0.82rem] font-semibold tracking-[0.2em]">ALGERIA</span>
              <span className="block text-[0.6rem] tracking-[0.3em] faint">HEALTH &amp; WELLNESS</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-[0.88rem] min-[900px]:flex" aria-label="Navigation principale">
            {PRIMARY.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="relative py-1 transition-colors"
                style={{ color: isActive(item.href) ? "var(--text)" : "var(--muted)" }}
              >
                {item.label}
                {isActive(item.href) && (
                  <span
                    className="absolute -bottom-0.5 left-0 h-px w-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/concierge" className="btn btn-ghost btn-sm hidden sm:inline-flex">
              <MessageCircle size={15} />
              Un conseiller
            </Link>
            <Link href="/parcours" className="btn btn-primary btn-sm">
              Commencer
            </Link>
          </div>
        </div>
      </header>

      <nav
        className="fixed bottom-0 left-0 z-40 w-full border-t min-[900px]:hidden"
        aria-label="Navigation mobile"
        style={{
          borderColor: "var(--border)",
          background: "color-mix(in srgb, var(--surface) 94%, transparent)",
          backdropFilter: "blur(16px)",
        }}
      >
        <ul className="grid grid-cols-5">
          {MOBILE.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center gap-1 py-2.5 text-[0.62rem] tracking-wide transition-colors"
                  style={{ color: active ? "var(--primary)" : "var(--faint)" }}
                >
                  <Icon size={19} strokeWidth={active ? 2 : 1.6} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
