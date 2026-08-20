import type { Metadata } from "next";
import { Eyebrow } from "@/components/badges";
import { AlgeriaMap } from "@/components/algeria-map";
import { getTranslation } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.map.title, description: t.meta.map.description };
}

export default async function CartePage() {
  const { t } = await getTranslation();

  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>{t.map.eyebrow}</Eyebrow>
        <h1 className="mt-6 text-[clamp(2.2rem,5vw,3.4rem)]">
          {t.map.title1}
          <br />
          {t.map.title2}
        </h1>
        <p className="lede mt-6">{t.map.lede}</p>
      </div>

      <div className="mt-12">
        <AlgeriaMap />
      </div>
    </section>
  );
}
