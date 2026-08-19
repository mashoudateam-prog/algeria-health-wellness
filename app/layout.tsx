import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://algeria-health-wellness.local"),
  title: {
    default: "Algeria Health & Wellness — votre santé, votre séjour, votre parcours",
    template: "%s · Algeria Health & Wellness",
  },
  description:
    "Préparez un séjour de santé, de bien-être et de remise en forme en Algérie : parcours construit sur mesure, professionnels et établissements vérifiés, accompagnement humain.",
  keywords: [
    "tourisme de santé Algérie",
    "bien-être Algérie",
    "thermalisme Algérie",
    "séjour santé",
    "remise en forme",
  ],
  openGraph: {
    type: "website",
    locale: "fr_DZ",
    title: "Algeria Health & Wellness",
    description:
      "Une nouvelle façon de préparer votre séjour de santé, de bien-être et de remise en forme en Algérie.",
  },
  // Doublon volontaire de `app/robots.ts` : la balise couvre les agents qui
  // ignorent robots.txt. Tant que le catalogue est fictif, il ne doit pas
  // apparaître dans un moteur de recherche.
  robots:
    process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true"
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ee",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${sans.variable}`}>
      <body>
        <a href="#contenu" className="skip-link">
          Aller au contenu principal
        </a>
        <SiteNav />
        <main id="contenu">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
