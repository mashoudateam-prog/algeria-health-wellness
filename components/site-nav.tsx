"use client";

import { Compass, HeartPulse, MessageCircle, Route, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/components/i18n-provider";
import { LOCALES, LOCALE_LABEL, LOCALE_SHORT, localizePath, stripLocale } from "@/lib/i18n/config";

export function SiteNav() {
  const pathname = usePathname();
  const { locale, t } = useTranslation();

  // Le middleware réécrit l'URL : `usePathname` rend déjà le chemin sans
  // préfixe de langue. On le normalise tout de même, pour ne pas dépendre
  // d'un détail d'implémentation du routeur.
  const bare = stripLocale(pathname);
  const isActive = (href: string) => (href === "/" ? bare === "/" : bare.startsWith(href));

  /** Ajoute le préfixe de langue à un lien interne. */
  const link = (href: string) => localizePath(href, locale);

  const PRIMARY = [
    { href: "/parcours", label: t.nav.journey },
    { href: "/univers", label: t.nav.universes },
    { href: "/destinations", label: t.nav.destinations },
    { href: "/patrimoine", label: t.nav.heritage },
    { href: "/sejours", label: t.nav.retreats },
    { href: "/actualites", label: t.nav.news },
  ];

  /** Barre inférieure mobile : cinq entrées, comme une application native. */
  const MOBILE = [
    { href: "/", label: t.nav.home, icon: HeartPulse },
    { href: "/destinations", label: t.nav.explore, icon: Compass },
    { href: "/parcours", label: t.nav.journey, icon: Route },
    { href: "/concierge", label: t.nav.concierge, icon: MessageCircle },
    { href: "/compte", label: t.nav.account, icon: User },
  ];

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
          <Link href={link("/")} className="flex items-center gap-3" aria-label={t.nav.homeAria}>
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

          <nav
            className="hidden items-center gap-6 text-[0.86rem] min-[1000px]:flex"
            aria-label={t.nav.mainNav}
          >
            {PRIMARY.map((item) => (
              <Link
                key={item.href}
                href={link(item.href)}
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

          <div className="flex items-center gap-2.5">
            <LocaleSwitcher pathname={bare} current={locale} label={t.nav.language} />
            <Link href={link("/concierge")} className="btn btn-ghost btn-sm hidden lg:inline-flex">
              <MessageCircle size={15} />
              {t.nav.adviser}
            </Link>
            <Link href={link("/parcours")} className="btn btn-primary btn-sm">
              {t.nav.start}
            </Link>
          </div>
        </div>
      </header>

      <nav
        className="fixed bottom-0 left-0 z-40 w-full border-t min-[1000px]:hidden"
        aria-label={t.nav.mobileNav}
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
                  href={link(item.href)}
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

/* ------------------------------------------------------------------ */

/**
 * Sélecteur de langue.
 *
 * Il conserve la page courante : changer de langue depuis une fiche de
 * patrimoine mène à la même fiche, pas à l'accueil. C'est ce qu'on attend, et
 * c'est rarement fait.
 */
function LocaleSwitcher({
  pathname,
  current,
  label,
}: {
  pathname: string;
  current: string;
  label: string;
}) {
  return (
    <div
      className="flex items-center rounded-full border p-0.5"
      style={{ borderColor: "var(--border-strong)" }}
      role="group"
      aria-label={label}
    >
      {LOCALES.map((entry) => {
        const active = entry === current;
        return (
          <Link
            key={entry}
            href={localizePath(pathname, entry)}
            hrefLang={entry}
            aria-current={active ? "true" : undefined}
            title={LOCALE_LABEL[entry]}
            className="rounded-full px-2.5 py-1 text-[0.7rem] font-medium transition-colors"
            style={{
              background: active ? "var(--primary)" : "transparent",
              color: active ? "#fff" : "var(--muted)",
            }}
          >
            {LOCALE_SHORT[entry]}
          </Link>
        );
      })}
    </div>
  );
}
