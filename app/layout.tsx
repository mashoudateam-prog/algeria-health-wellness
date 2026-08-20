import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, Noto_Sans_Arabic } from "next/font/google";
import { I18nProvider } from "@/components/i18n-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { LOCALE_DIR, LOCALE_TAG, type Locale } from "@/lib/i18n/config";
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

/**
 * Face arabe.
 *
 * Ni Fraunces ni Inter ne couvrent l'arabe : sans cette déclaration, le
 * navigateur retomberait sur une police système différente d'un appareil à
 * l'autre, et la mise en page arabe n'aurait plus rien à voir avec les deux
 * autres langues.
 */
const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-arabic",
});

/**
 * Métadonnées de la racine, par langue.
 *
 * Un ternaire ne tenait plus à trois langues : une table indexée par langue
 * rend impossible d'en ajouter une et d'oublier son titre — le typage exige
 * une entrée par langue déclarée.
 */
const RACINE: Record<
  Locale,
  { title: string; description: string; keywords: string[]; ogDescription: string }
> = {
  fr: {
    title: "Algeria Health & Wellness — votre santé, votre séjour, votre parcours",
    description:
      "Préparez un séjour de santé, de bien-être et de remise en forme en Algérie : parcours construit sur mesure, professionnels et établissements vérifiés, accompagnement humain.",
    keywords: ["tourisme de santé Algérie", "bien-être Algérie", "thermalisme Algérie", "séjour santé", "remise en forme"],
    ogDescription:
      "Une nouvelle façon de préparer votre séjour de santé, de bien-être et de remise en forme en Algérie.",
  },
  en: {
    title: "Algeria Health & Wellness — your health, your stay, your journey",
    description:
      "Plan a health, wellbeing and fitness stay in Algeria: a journey built around your goals, verified professionals and facilities, and human support.",
    keywords: ["health tourism Algeria", "wellness Algeria", "thermal springs Algeria", "health travel", "fitness retreat"],
    ogDescription: "A new way to prepare a health, wellbeing and fitness stay in Algeria.",
  },
  ar: {
    title: "Algeria Health & Wellness — صحّتك، إقامتك، مسارك",
    description:
      "هيّئ إقامة صحية وعافية واستعادة لياقة في الجزائر: مسار مبنيّ على أهدافك، ومؤسسات ومهنيّون مُتحقَّق منهم، ومرافقة إنسانية.",
    keywords: ["السياحة الصحية الجزائر", "العافية الجزائر", "الحمّامات المعدنية الجزائر", "إقامة صحية", "استعادة اللياقة"],
    ogDescription: "طريقة جديدة لتهيئة إقامتك الصحية وإقامة العافية واستعادة اللياقة في الجزائر.",
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getTranslation();
  const racine = RACINE[locale];

  return {
    metadataBase: new URL("https://algeria-health-wellness.vercel.app"),
    title: {
      default: racine.title,
      template: "%s · Algeria Health & Wellness",
    },
    description: racine.description,
    keywords: racine.keywords,
    // Chaque page existe dans les trois langues : on le déclare aux moteurs.
    alternates: {
      languages: { fr: "/", en: "/en", ar: "/ar" },
    },
    openGraph: {
      type: "website",
      locale: LOCALE_TAG[locale].replace("-", "_"),
      title: "Algeria Health & Wellness",
      description: racine.ogDescription,
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
      className={`${display.variable} ${sans.variable} ${arabic.variable}`}
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
