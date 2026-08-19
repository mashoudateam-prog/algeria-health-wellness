import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n/config";

/**
 * Routage des langues.
 *
 * `/en/parcours` est réécrit vers `/parcours`, avec la langue transmise en
 * en-tête. Les pages restent donc à un seul endroit : pas de duplication de
 * l'arborescence, pas de risque qu'une page existe en français et pas en
 * anglais.
 *
 * Le français vit à la racine — c'est la langue d'origine du site.
 */

const LOCALE_HEADER = "x-locale";
const PATH_HEADER = "x-pathname";

/** Ce qui ne doit jamais être réécrit ni redirigé. */
const IGNORED = /^\/(?:api|_next|photos|videos|immersive|favicon|robots\.txt|sitemap\.xml)/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (IGNORED.test(pathname)) return NextResponse.next();

  const segment = pathname.split("/")[1];
  const matched = LOCALES.find((locale) => locale === segment && locale !== DEFAULT_LOCALE);

  const headers = new Headers(request.headers);

  if (matched) {
    // `/en/parcours` → `/parcours`, la langue voyageant dans l'en-tête.
    const rewritten = pathname.slice(matched.length + 1) || "/";
    headers.set(LOCALE_HEADER, matched);
    headers.set(PATH_HEADER, pathname);

    const url = request.nextUrl.clone();
    url.pathname = rewritten;
    return NextResponse.rewrite(url, { request: { headers } });
  }

  headers.set(LOCALE_HEADER, DEFAULT_LOCALE satisfies Locale);
  headers.set(PATH_HEADER, pathname);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
