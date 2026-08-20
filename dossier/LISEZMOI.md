# Dossier de candidature

## Contenu

| Fichier | Rôle |
|---|---|
| `00-email-de-soumission.md` | Trois versions du courriel + liste de contrôle avant envoi |
| `01-executive-summary.md` | Pièce 1 — fiche de présentation (3 pages) |
| `02-preuve-de-concept.md` | Pièce 2 — démonstration technique, scénario vidéo |
| `03-business-case.md` | Pièce 3 — viabilité économique et impact |
| `pdf/` | Les trois pièces converties, prêtes à joindre |

## Régénérer les PDF après modification d'un document

Les fichiers Markdown sont la source ; les PDF en sont dérivés. Après toute
modification, régénérer plutôt que d'éditer le PDF.

```bash
cd dossier
npm install pdf-lib
node build.cjs
```

`build.cjs` convertit le Markdown en HTML mis en page pour l'impression, le
rend via Chrome headless (`--print-to-pdf`), puis estampille le pied de page
numéroté avec `pdf-lib` — Chrome ne sachant pas numéroter les pages lui-même.

Le chemin de Chrome est en tête de `build.cjs` et peut demander un ajustement
selon la machine.

## Avant dépôt

- L'Executive Summary doit tenir en **3 pages** : le vérifier après toute
  addition, la contrainte est dans le règlement du concours.
- Remplir les champs `[À SOURCER]` du Business Case avec les données
  officielles (ONS, Ministère du Tourisme, WTTC).
- Renseigner l'URL de déploiement et le lien de la vidéo.
