/**
 * Construction du dossier PDF.
 *
 * Chaîne : Markdown -> HTML mis en page pour l'impression -> Chrome headless
 * (--print-to-pdf) -> pdf-lib pour le pied de page numéroté.
 *
 * Chrome est utilisé pour le rendu parce qu'il gère seul ce qui coûte cher à
 * faire à la main : coupure de tableau entre deux pages, veuves et orphelines,
 * césure française. Le numéro de page est estampillé après coup, faute de
 * compteur de page en CSS dans Chrome.
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { convert } = require("./md-to-html.cjs");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PROJET = "C:\\Users\\Benyahia Samir\\Documents\\Algeria-Health-Wellness";
const SOURCE = path.join(PROJET, "dossier");
const SORTIE = path.join(SOURCE, "pdf");
// Les fichiers intermédiaires ne sont pas versionnés.
const TRAVAIL = path.join(SOURCE, ".build");

const DOCUMENTS = [
  {
    fichier: "01-executive-summary.md",
    pdf: "AHW-01-Executive-Summary.pdf",
    titre: "Executive Summary",
  },
  {
    fichier: "02-preuve-de-concept.md",
    pdf: "AHW-02-Preuve-de-concept.pdf",
    titre: "Preuve de concept",
  },
  {
    fichier: "03-business-case.md",
    pdf: "AHW-03-Business-Case.pdf",
    titre: "Business Case",
  },
];

const CSS = `
@page { size: A4; margin: 15mm 17mm 18mm 17mm; }

* { box-sizing: border-box; }

html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }

body {
  margin: 0;
  font-family: "Georgia", "Times New Roman", serif;
  font-size: 9.9pt;
  line-height: 1.42;
  color: #1c1c1a;
  hyphens: auto;
  -webkit-hyphens: auto;
}

/* --- Titres ---------------------------------------------------- */

h1 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 21pt;
  line-height: 1.15;
  letter-spacing: -0.01em;
  margin: 0 0 2mm;
  color: #17382f;
}

h2 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 13.5pt;
  line-height: 1.25;
  margin: 5.5mm 0 2.2mm;
  padding-bottom: 1.6mm;
  border-bottom: 0.6pt solid #c8c2b4;
  color: #17382f;
  break-after: avoid;
  page-break-after: avoid;
}

/* Le sous-titre du document suit immédiatement le titre : pas de filet. */
h1 + h2 {
  margin-top: 1mm;
  border-bottom: none;
  padding-bottom: 0;
  font-size: 12pt;
  font-weight: 400;
  color: #55635a;
}

h3 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 11pt;
  margin: 4.5mm 0 1.6mm;
  color: #2f5f73;
  break-after: avoid;
  page-break-after: avoid;
}

h4 {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 10pt;
  margin: 5mm 0 1.5mm;
  color: #3a3a36;
  break-after: avoid;
  page-break-after: avoid;
}

/* --- Corps ------------------------------------------------------ */

p { margin: 0 0 2.2mm; orphans: 3; widows: 3; }

strong { font-weight: 700; color: #12120f; }

em { font-style: italic; }

code {
  font-family: "Consolas", "Courier New", monospace;
  font-size: 8.6pt;
  background: #f1efe9;
  border: 0.4pt solid #ddd8cc;
  border-radius: 2pt;
  padding: 0.3mm 1mm;
}

a { color: #2f5f73; text-decoration: none; }

pre {
  font-family: "Consolas", "Courier New", monospace;
  font-size: 8.4pt;
  line-height: 1.5;
  background: #f5f3ed;
  border-left: 2.2pt solid #2f5f73;
  padding: 2.6mm 3.2mm;
  margin: 3mm 0;
  white-space: pre-wrap;
  break-inside: avoid;
  page-break-inside: avoid;
}

pre code { background: none; border: none; padding: 0; font-size: inherit; }

hr.rule {
  border: none;
  border-top: 0.6pt solid #d8d2c5;
  margin: 4.5mm 0;
}

/* Le premier filet suit le bloc d'en-tête : il ferait doublon. */
hr.rule:first-of-type { display: none; }

ul, ol { margin: 0 0 3mm; padding-left: 5.5mm; }

li { margin-bottom: 1.2mm; orphans: 2; widows: 2; }

li.check { list-style: none; margin-left: -5.5mm; }

li.check .box { display: inline-block; width: 4.5mm; color: #55635a; }

/* --- Tableaux --------------------------------------------------- */

table {
  width: 100%;
  border-collapse: collapse;
  margin: 2.4mm 0 3.6mm;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 8.5pt;
  line-height: 1.35;
}

thead { display: table-header-group; }

th {
  text-align: left;
  vertical-align: bottom;
  padding: 1.5mm 2mm;
  background: #eeece5;
  border-bottom: 0.9pt solid #17382f;
  font-weight: 700;
  color: #17382f;
}

td {
  vertical-align: top;
  padding: 1.4mm 2mm;
  border-bottom: 0.4pt solid #ddd8cc;
}

tbody tr:nth-child(even) td { background: #faf9f6; }

tr { break-inside: avoid; page-break-inside: avoid; }

/* --- Citations -------------------------------------------------- */

blockquote {
  margin: 3mm 0;
  padding: 2.4mm 3.2mm;
  background: #f5f3ed;
  border-left: 2.2pt solid #9a6845;
  break-inside: avoid;
  page-break-inside: avoid;
}

blockquote p:last-child, blockquote ul:last-child { margin-bottom: 0; }

blockquote ul { padding-left: 4.5mm; }

/* --- En-tête de document ---------------------------------------- */

.entete {
  border-bottom: 1.6pt solid #17382f;
  padding-bottom: 3mm;
  margin-bottom: 4.5mm;
}

.entete .marque {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 7.6pt;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #9a6845;
  margin-bottom: 2mm;
}

.entete .piece {
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 7.6pt;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #77726a;
  float: right;
}
`;

function gabarit(titreOnglet, corps) {
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>${titreOnglet}</title>
<style>${CSS}</style>
</head>
<body>
${corps}
</body>
</html>`;
}

function main() {
  fs.mkdirSync(SORTIE, { recursive: true });
  fs.mkdirSync(TRAVAIL, { recursive: true });

  const { PDFDocument, StandardFonts, rgb } = require("pdf-lib");

  return (async () => {
    for (const [index, doc] of DOCUMENTS.entries()) {
      const md = fs.readFileSync(path.join(SOURCE, doc.fichier), "utf8");

      // Le bloc d'en-tête reprend l'identité du dossier sur chaque pièce.
      const entete = `<div class="entete">
  <span class="piece">Pièce ${index + 1} / 3</span>
  <div class="marque">Concours — Axe 02 · Le Sur-Mesure</div>
</div>`;

      const html = gabarit(`Algeria Health & Wellness — ${doc.titre}`, entete + convert(md));
      const fichierHtml = path.join(TRAVAIL, `${doc.pdf.replace(/\.pdf$/, "")}.html`);
      fs.writeFileSync(fichierHtml, html, "utf8");

      const brut = path.join(TRAVAIL, `brut-${doc.pdf}`);
      execFileSync(
        CHROME,
        [
          "--headless=new",
          "--disable-gpu",
          "--no-pdf-header-footer",
          "--run-all-compositor-stages-before-draw",
          "--virtual-time-budget=10000",
          `--print-to-pdf=${brut}`,
          `file:///${fichierHtml.replace(/\\/g, "/")}`,
        ],
        { stdio: "pipe" },
      );

      // Pied de page : Chrome ne sait pas numéroter, on estampille après coup.
      const pdf = await PDFDocument.load(fs.readFileSync(brut));
      const police = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      const gris = rgb(0.45, 0.44, 0.41);
      const filet = rgb(0.84, 0.82, 0.77);

      pages.forEach((page, i) => {
        const { width } = page.getSize();
        const marge = 48.2; // 17 mm, aligné sur la marge de page
        const y = 34;

        page.drawLine({
          start: { x: marge, y: y + 12 },
          end: { x: width - marge, y: y + 12 },
          thickness: 0.5,
          color: filet,
        });

        page.drawText(`Algeria Health & Wellness — ${doc.titre}`, {
          x: marge,
          y,
          size: 7.5,
          font: police,
          color: gris,
        });

        const numero = `${i + 1} / ${pages.length}`;
        page.drawText(numero, {
          x: width - marge - police.widthOfTextAtSize(numero, 7.5),
          y,
          size: 7.5,
          font: police,
          color: gris,
        });
      });

      const sortie = path.join(SORTIE, doc.pdf);
      fs.writeFileSync(sortie, await pdf.save());
      fs.unlinkSync(brut);
      console.log(`  ✓ ${doc.pdf} — ${pages.length} page(s)`);
    }
  })();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
