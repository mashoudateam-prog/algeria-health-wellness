import type { Metadata } from "next";
import { AccountPanel } from "@/components/account-panel";
import { Eyebrow } from "@/components/badges";
import { storageMode } from "@/lib/news/store";
import { getTranslation } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation();
  return { title: t.meta.account.title, description: t.meta.account.description, robots: { index: false } };
}

export default async function ComptePage() {
  const { t } = await getTranslation();
  const persistant = storageMode() === "postgres";

  return (
    <section className="shell section-tight">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow>{t.accountPage.eyebrow}</Eyebrow>
          <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">{t.accountPage.title}</h1>
          <p className="lede mt-5">{t.accountPage.lede}</p>

          <h2 className="mt-9 text-[0.66rem] uppercase tracking-[0.22em] faint">
            {t.accountPage.rolesTitle}
          </h2>
          <dl className="mt-4 space-y-3.5 text-[0.88rem] leading-6">
            {(["visiteur", "partenaire", "moderateur", "admin"] as const).map((role) => (
              <div key={role}>
                <dt className="font-medium">{t.account.roles[role]}</dt>
                <dd className="muted">{t.accountPage.roleDetails[role]}</dd>
              </div>
            ))}
          </dl>

          <p className="mt-8 text-[0.78rem] leading-5 faint">
            {persistant ? t.accountPage.persistent : t.accountPage.volatile}
          </p>
        </div>

        <div className="lg:pt-2">
          <AccountPanel />
        </div>
      </div>
    </section>
  );
}
