import { HeartPulse } from "lucide-react";
import Link from "next/link";
import { localizePath } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/server";

export async function SiteFooter() {
  const { locale, t } = await getTranslation();
  const link = (href: string) => localizePath(href, locale);

  const columns = [
    {
      title: t.footer.discover,
      links: [
        { href: "/parcours", label: t.common.buildJourney },
        { href: "/univers", label: t.nav.universes },
        { href: "/destinations", label: t.nav.destinations },
        { href: "/patrimoine", label: t.nav.heritage },
        { href: "/carte", label: t.nav.map },
        { href: "/actualites", label: t.nav.news },
        { href: "/sejours", label: t.nav.retreats },
      ],
    },
    {
      title: t.footer.mySpace,
      links: [
        { href: "/espace", label: t.footer.dashboard },
        { href: "/espace/documents", label: t.footer.passport },
        { href: "/concierge", label: t.nav.concierge },
      ],
    },
    {
      title: t.footer.trust,
      links: [
        { href: "/confiance", label: t.footer.security },
        { href: "/confiance#verification", label: t.footer.howWeVerify },
        { href: "/confiance#ia", label: t.footer.aiLimits },
      ],
    },
  ];

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
            <p className="mt-5 max-w-sm text-[0.9rem] leading-7 text-white/55">{t.footer.tagline}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[0.66rem] uppercase tracking-[0.22em] text-white/40">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5 text-[0.88rem] text-white/70">
                  {column.links.map((entry) => (
                    <li key={entry.href}>
                      <Link href={link(entry.href)} className="transition-colors hover:text-white">
                        {entry.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-7">
          <p className="text-[0.78rem] leading-6 text-white/45">{t.footer.legal}</p>
          <p className="mt-4 text-[0.78rem] text-white/35">
            © {new Date().getFullYear()} Algeria Health &amp; Wellness — {t.footer.building}.
          </p>
        </div>
      </div>
    </footer>
  );
}
