/**
 * Markdown -> HTML, sous-ensemble maîtrisé.
 *
 * Pas de dépendance : les documents du dossier n'utilisent qu'un sous-ensemble
 * connu (titres, tableaux, listes, citations, gras, italique, code en ligne,
 * cases à cocher, filets). Un convertisseur générique apporterait ici plus de
 * surprises que de service — notamment sur les tableaux, qui portent
 * l'essentiel de l'information.
 */

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Gras, italique, code en ligne, liens. Appliqué après échappement. */
function inline(s) {
  let out = escapeHtml(s);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return out;
}

function splitRow(line) {
  return line
    .replace(/^\||\|$/g, "")
    .split("|")
    .map((cell) => cell.trim());
}

function convert(md) {
  const lines = md.split(/\r?\n/);
  const html = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Bloc de code clôturé. Traité avant tout le reste : son contenu ne doit
    // subir aucune conversion, et ses retours à la ligne sont significatifs.
    if (/^```/.test(line.trim())) {
      const bloc = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i].trim())) {
        bloc.push(lines[i]);
        i++;
      }
      i++; // clôture
      html.push(`<pre><code>${escapeHtml(bloc.join("\n"))}</code></pre>`);
      continue;
    }

    // Filet horizontal
    if (/^---+$/.test(line.trim())) {
      html.push('<hr class="rule">');
      i++;
      continue;
    }

    // Titres
    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      const level = heading[1].length;
      html.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i++;
      continue;
    }

    // Tableau : une ligne de séparation en deuxième position le signale.
    if (line.trim().startsWith("|") && lines[i + 1] && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const header = splitRow(line);
      const rows = [];
      i += 2;
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(splitRow(lines[i]));
        i++;
      }
      const headEmpty = header.every((cell) => cell === "");
      const thead = headEmpty
        ? ""
        : `<thead><tr>${header.map((cell) => `<th>${inline(cell)}</th>`).join("")}</tr></thead>`;
      const tbody = rows
        .map((row) => `<tr>${row.map((cell) => `<td>${inline(cell)}</td>`).join("")}</tr>`)
        .join("");
      html.push(`<table>${thead}<tbody>${tbody}</tbody></table>`);
      continue;
    }

    // Citation
    if (line.trim().startsWith(">")) {
      const block = [];
      while (i < lines.length && lines[i].trim().startsWith(">")) {
        block.push(lines[i].replace(/^\s*>\s?/, ""));
        i++;
      }
      // Une citation peut contenir une liste : on la convertit récursivement.
      html.push(`<blockquote>${convert(block.join("\n"))}</blockquote>`);
      continue;
    }

    // Liste à puces, cases à cocher comprises
    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        let item = lines[i].replace(/^\s*[-*]\s+/, "");
        const box = item.match(/^\[( |x)\]\s*(.*)$/);
        if (box) {
          const mark = box[1] === "x" ? "☑" : "☐";
          items.push(`<li class="check"><span class="box">${mark}</span>${inline(box[2])}</li>`);
        } else {
          items.push(`<li>${inline(item)}</li>`);
        }
        i++;
      }
      html.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // Liste numérotée
    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inline(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      html.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    // Ligne vide
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Paragraphe : on agrège jusqu'à la prochaine rupture.
    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^(#{1,4})\s/.test(lines[i]) &&
      !lines[i].trim().startsWith("|") &&
      !lines[i].trim().startsWith(">") &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      para.push(lines[i]);
      i++;
    }
    if (para.length > 0) html.push(`<p>${inline(para.join(" "))}</p>`);
  }

  return html.join("\n");
}

module.exports = { convert };
