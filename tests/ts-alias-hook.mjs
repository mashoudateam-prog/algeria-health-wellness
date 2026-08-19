import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/**
 * Résolveur de modules pour les tests.
 *
 * Node exécute nativement le TypeScript (effacement de types), mais ne connaît
 * ni l'alias `@/` du tsconfig ni les imports sans extension. Ce hook comble
 * les deux, ce qui permet de tester les modules du domaine tels qu'ils sont
 * écrits, sans étape de compilation intermédiaire.
 *
 * Les modules internes de Node et les paquets npm sont laissés intacts :
 * `node:assert/strict` ne doit jamais devenir `node:assert/strict.ts`.
 */

const ROOT = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));

const EXTENSIONS = [".ts", ".tsx", "/index.ts"];

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("node:") || specifier.startsWith("data:")) {
    return nextResolve(specifier, context);
  }

  const isAlias = specifier.startsWith("@/");
  const isRelative = specifier.startsWith("./") || specifier.startsWith("../");

  // Paquet npm : rien à faire.
  if (!isAlias && !isRelative && !specifier.startsWith("file:")) {
    return nextResolve(specifier, context);
  }

  const target = isAlias ? pathToFileURL(path.join(ROOT, specifier.slice(2))).href : specifier;

  try {
    return await nextResolve(target, context);
  } catch (error) {
    if (/\.[cm]?[jt]sx?$/.test(target)) throw error;

    for (const extension of EXTENSIONS) {
      try {
        return await nextResolve(`${target}${extension}`, context);
      } catch {
        // Extension suivante.
      }
    }
    throw error;
  }
}
