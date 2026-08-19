import { NextResponse, type NextRequest } from "next/server";
import { authorizeCron } from "@/lib/news/admin-auth";
import { runCollection } from "@/lib/news/collect";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** La lecture de cinq flux distants demande du temps. */
export const maxDuration = 60;

/**
 * Déclenche un passage de veille.
 *
 * Appelé par la tâche planifiée quotidienne, ou à la main depuis la page de
 * modération. Protégé : sans jeton, n'importe qui pourrait faire marteler les
 * sites de presse par notre serveur.
 *
 * GET et POST font la même chose — Vercel Cron émet un GET.
 */
async function handle(request: NextRequest) {
  const auth = authorizeCron(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: auth.status });
  }

  try {
    const { run, proposals } = await runCollection();

    return NextResponse.json(
      {
        ok: true,
        // Rien n'est publié : ce sont des propositions en attente d'un humain.
        proposees: run.proposed,
        rejetees: run.rejected,
        sources: run.sources,
        motifsDeRejet: run.rejectionReasons,
        apercu: proposals.slice(0, 5).map((item) => ({
          titre: item.title,
          categorie: item.category,
          lieu: item.locationLabel,
          pertinence: item.relevance,
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[actualites] collecte en échec", error);
    return NextResponse.json({ error: "La collecte a échoué." }, { status: 500 });
  }
}

export const GET = handle;
export const POST = handle;
