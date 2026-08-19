# Déploiement

L'application a des routes API (`/api/parcours`, `/api/concierge`) et des pages rendues
côté serveur. Il lui faut un hébergeur qui **exécute Node**, pas de l'hébergement statique.

---

## À lire avant de mettre en ligne

Trois points qui ne relèvent pas de la technique mais de la responsabilité. Ils sont
signalés ici parce qu'un déploiement les rend publics d'un coup.

### 1. Le catalogue est fictif, et il sera visible par tous

`Clinique Ryad`, `Dr A. Benali`, `Centre dentaire Andalus` : ces établissements et
praticiens n'existent pas. L'interface les signale par un badge **DÉMO**, mais ce badge
disparaît dès qu'un contenu est repris hors contexte — capture d'écran, partage, résultat
de recherche.

C'est pourquoi **l'indexation est refusée par défaut** (`app/robots.ts` + balise `robots`).
Ne l'ouvrez qu'après avoir remplacé `data/facilities.ts` par des partenaires réels :

```
NEXT_PUBLIC_ALLOW_INDEXING=true
```

### 2. Il n'y a pas d'authentification

`/espace` et `/espace/documents` sont accessibles sans compte et affichent un dossier de
démonstration. Aucune donnée réelle n'est en jeu aujourd'hui — mais ne laissez personne
y déposer de vrais documents avant que l'authentification et le chiffrement soient en
place. L'interface ne le permet pas ; l'ambiguïté, si.

Si le déploiement est une démonstration commerciale, protégez-le par le mot de passe de
déploiement de votre hébergeur (sur Vercel : *Settings → Deployment Protection*).

### 3. La limitation de débit ne tient pas en serverless

Le compteur vit en mémoire du processus (`lib/security/request-guard.ts`). Sur Vercel,
chaque instance a le sien : la limite réelle devient « 20 par minute **et par instance** ».
Pour une démonstration, c'est acceptable. Pour du trafic réel, il faut un magasin partagé
(Vercel KV, Upstash Redis).

---

## Vercel — le chemin le plus court

### Prérequis

- un compte Vercel ;
- le code sur un dépôt Git distant (GitHub, GitLab, Bitbucket).

Le dépôt local est déjà initialisé avec un premier commit. Il reste à créer le dépôt
distant **depuis votre compte** et à le raccorder :

```bash
git remote add origin <URL_DE_VOTRE_DEPOT>
git push -u origin main
```

### Import

Sur **vercel.com → Add New → Project → Import Git Repository**, sélectionnez le dépôt.
Vercel détecte Next.js seul : aucun réglage de build à saisir.

| Réglage         | Valeur                     |
| --------------- | -------------------------- |
| Framework       | Next.js (détecté)          |
| Build Command   | `npm run build` (par défaut) |
| Output          | `.next` (par défaut)       |
| Install Command | `npm install` (par défaut) |
| Node.js         | 20 ou plus                 |

### Variables d'environnement

**Aucune n'est obligatoire.** Sans clé, la plateforme tourne sur son moteur de règles.

| Variable                    | Quand la renseigner                                  |
| --------------------------- | ---------------------------------------------------- |
| `ANTHROPIC_API_KEY`         | Pour activer le concierge conversationnel enrichi     |
| `AI_MODEL`                  | Pour changer de modèle (défaut `claude-opus-5`)       |
| `AI_PROVIDER=off`           | Pour forcer le moteur de règles malgré une clé        |
| `NEXT_PUBLIC_ALLOW_INDEXING`| `true` seulement une fois le catalogue réel en place  |

Renseignez-les dans **Settings → Environment Variables**, jamais dans le dépôt.

---

## Vercel en ligne de commande

```bash
npm i -g vercel
vercel login
vercel          # déploiement de prévisualisation, URL privée
vercel --prod   # mise en production
```

`vercel login` ouvre votre navigateur : l'authentification se fait de votre côté, aucun
jeton ne transite par le projet.

---

## Autres hébergeurs

L'application n'utilise aucune fonctionnalité propre à Vercel. Tout hébergeur Node
convient.

**Serveur Node classique** (VPS, Render, Railway, Fly.io) :

```bash
npm ci
npm run build
npm start          # écoute sur le port 3230
```

Placez un reverse proxy devant (Nginx, Caddy) pour le TLS. Le port se change avec
`next start -p <port>` dans le script `start`.

**Docker** — aucun `Dockerfile` n'est fourni : le besoin n'est pas encore établi et un
fichier non testé vaut moins que pas de fichier. La base serait `node:22-alpine`, un build
multi-étapes et `output: "standalone"` dans `next.config.ts`.

---

## Vérifications après mise en ligne

```bash
# Les en-têtes de sécurité sont bien servis
curl -sI https://<votre-domaine>/ | grep -iE "content-security|x-frame|referrer|strict-transport"

# L'indexation est bien refusée
curl -s https://<votre-domaine>/robots.txt

# La chaîne complète répond
curl -s -X POST https://<votre-domaine>/api/parcours \
  -H "Content-Type: application/json" \
  -d '{"text":"Une semaine à Oran pour me remettre en forme"}' | head -c 300
```

Puis, à l'œil : la homepage, `/parcours` (construire un parcours de bout en bout), et
`/espace/documents` (accorder puis révoquer un accès).

---

## Ce qu'il faut faire avant un usage réel

Ce déploiement convient à une démonstration. Il ne convient pas encore à des patients.

- authentification, RBAC et 2FA pour les rôles à privilèges ;
- chiffrement des documents au repos et contrôle d'accès **côté serveur** ;
- journal d'audit en append-only ;
- limitation de débit partagée entre instances ;
- CSP avec nonce (le bootstrap Next impose encore `'unsafe-inline'`) ;
- gestion du consentement conforme aux juridictions réellement ciblées ;
- remplacement complet du catalogue de démonstration.
