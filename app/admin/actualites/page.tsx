import type { Metadata } from "next";
import { Eyebrow } from "@/components/badges";
import { NewsModeration } from "@/components/news-moderation";

export const metadata: Metadata = {
  title: "Modération du fil",
  robots: { index: false, follow: false },
};

export default function ModerationPage() {
  return (
    <section className="shell section-tight">
      <div className="max-w-2xl">
        <Eyebrow>Back-office</Eyebrow>
        <h1 className="mt-5 text-[clamp(2rem,4.4vw,3rem)]">Modération du fil</h1>
        <p className="lede mt-5">
          L&apos;agent propose, vous décidez. Rien n&apos;atteint le fil public sans un
          clic sur cette page.
        </p>
      </div>

      <div className="mt-10">
        <NewsModeration />
      </div>

      <p className="mt-12 max-w-3xl text-[0.82rem] leading-6 faint">
        Cette page est protégée par un jeton partagé (<code>ADMIN_TOKEN</code>), en
        attendant une véritable authentification avec gestion des rôles. Les décisions
        sont conservées en mémoire du processus : elles ne survivront pas au prochain
        déploiement tant que la base de données n&apos;est pas branchée.
      </p>
    </section>
  );
}
