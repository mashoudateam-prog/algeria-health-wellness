import path from "node:path";
import type { NextConfig } from "next";

/**
 * Politique de sécurité du contenu.
 *
 * `'unsafe-inline'` sur `script-src` reste nécessaire tant que le bootstrap
 * inline de Next n'est pas servi avec un nonce — cela demande un middleware
 * dédié, à faire avant toute exploitation réelle. Le reste de la politique a
 * déjà de la valeur : elle empêche tout chargement et toute exfiltration vers
 * un domaine tiers, ce qui est la menace principale sur une plateforme santé.
 */
const isDev = process.env.NODE_ENV === "development";

const CSP = [
  "default-src 'self'",
  // `'unsafe-eval'` est indispensable au rafraîchissement à chaud de Next et
  // reste strictement cantonné au développement : la politique servie en
  // production ne l'inclut pas.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  // Seule exception au cloisonnement : le CDN qui sert les photographies
  // vérifiées de `data/photos.ts`. Aucune autre origine externe n'est admise.
  "img-src 'self' data: blob: https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Un lockfile traîne plus haut dans l'arborescence de l'utilisateur ; sans
  // cette ancre, Next remonte jusqu'à lui et trace des fichiers hors projet.
  outputFileTracingRoot: path.join(import.meta.dirname, "."),
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
