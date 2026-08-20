import type { Metadata } from "next";
import Link from "next/link";
import { DemoBadge, Eyebrow } from "@/components/badges";
import { DocumentVault } from "@/components/document-vault";
import { localizePath } from "@/lib/i18n/config";
import { getTranslation } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.passport.title, description: t.meta.passport.description };
}

export default async function DocumentsPage() {
  const { locale, t } = await getTranslation();

  return (
    <section className="shell section-tight">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="max-w-2xl">
          <Eyebrow>{t.passport.eyebrow}</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">{t.passport.title}</h1>
          <p className="lede mt-5">{t.passport.lede}</p>
        </div>
        <DemoBadge label={t.passport.demoLabel} />
      </div>

      <div className="mt-10">
        <DocumentVault />
      </div>

      <p className="mt-12 max-w-3xl text-[0.82rem] leading-6 faint">
        {t.passport.noticeStart}{" "}
        <Link href={localizePath("/confiance#donnees", locale)} className="underline">
          {t.passport.noticeLink}
        </Link>
        .
      </p>
    </section>
  );
}
