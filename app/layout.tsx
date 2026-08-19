import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { LOCALE_DIR, LOCALE_TAG } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/server";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getTranslation();
  const english = locale === "en";

  return {
    metadataBase: new URL("https://algeria-health-wellness.vercel.app"),
    title: {
      default: english
        ? "Algeria Health & Wellness — your health, your stay, your journey"
        : "Algeria Health & Wellness — votre santé, votre séjour, votre parcours",
      template: "%s · Algeria Health & Wellness",
    },
    description: english
      ? "Plan a health, wellbeing and fitness stay in Algeria: a journey built around your goals, verified professionals and facilities, and human support."
      : "Préparez un séjour de santé, de bien-être et de remise en forme en Algérie : parcours construit sur mesure, professionnels et établissements vérifiés, accompagnement humain.",
    keywords: english
      ? ["health tourism Algeria", "wellness Algeria", "thermal springs Algeria", "health travel", "fitness retreat"]
      : ["tourisme de santé Algérie", "bien-être Algérie", "thermalisme Algérie", "séjour santé", "remise en forme"],
    // Chaque page existe dans les deux langues : on le déclare aux moteurs.
    alternates: {
      languages: { fr: "/", en: "/en" },
    },
    openGraph: {
      type: "website",
      locale: LOCALE_TAG[locale].replace("-", "_"),
      title: "Algeria Health & Wellness",
      description: english
        ? "A new way to prepare a health, wellbeing and fitness stay in Algeria."
        : "Une nouvelle façon de préparer votre séjour de santé, de bien-être et de remise en forme en Algérie.",
    },
    // Doublon volontaire de `app/robots.ts` : la balise couvre les agents qui
    // ignorent robots.txt. Tant que le catalogue est fictif, il ne doit pas
    // apparaître dans un moteur de recherche.
    robots:
      process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true"
        ? { index: true, follow: true }
        : { index: false, follow: false, nocache: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, t } = await getTranslation();

  return (
    <html
      lang={LOCALE_TAG[locale]}
      dir={LOCALE_DIR[locale]}
      className={`${display.variable} ${sans.variable}`}
    >
      <body>
        <I18nProvider locale={locale}>
          <a href="#contenu" className="skip-link">
            {t.nav.skipToContent}
          </a>
          <SiteNav />
          <main id="contenu">{children}</main>
          <SiteFooter />
        </I18nProvider>
      </body>
    </html>
  );
}
