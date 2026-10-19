import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { externalLinksInHtml } from "@/components/ExternalLink";

// The sample report is a Markdown copy of the hub's audit report, rendered at build time.
const FILE = path.join(process.cwd(), "content", "sample-report.md");

export function getReport() {
  const raw = fs.readFileSync(FILE, "utf8").trim();
  const lines = raw.split("\n");
  const titleLine = lines.findIndex((l) => l.startsWith("# "));
  const title = lines[titleLine].slice(2).trim();
  const body = lines.filter((_, i) => i !== titleLine).join("\n").trim();
  const intro = body.split(/\n\s*\n/)[0].replace(/\s+/g, " ");
  return { title, intro, html: externalLinksInHtml(stackTables(marked.parse(body, { async: false }) as string)) };
}

const stripTags = (s: string) => s.replace(/<[^>]+>/g, "").replace(/"/g, "&quot;").trim();

// Tables with four or more columns get a column label on every cell, so CSS can show each row as a card on phones.
// An empty cell is marked, so its card leaves out the label.
export function stackTables(html: string) {
  return html.replace(/<table>([\s\S]*?)<\/table>/g, (table, inner: string) => {
    const labels = [...(inner.match(/<thead>[\s\S]*?<\/thead>/)?.[0] ?? "").matchAll(/<th[^>]*>([\s\S]*?)<\/th>/g)].map((m) => stripTags(m[1]));
    if (labels.length < 4) return table;
    const body = inner.replace(/<tr>([\s\S]*?)<\/tr>/g, (row, cells: string) => {
      let i = 0;
      // The span keeps text and inline code together as one grid item beside the label.
      const labelled = cells.replace(/<td([^>]*)>([\s\S]*?)<\/td>/g, (_, attrs: string, content: string) =>
        content.trim() ? `<td${attrs} data-label="${labels[i++] ?? ""}"><span>${content}</span></td>` : `<td${attrs} data-label="${labels[i++] ?? ""}" data-empty></td>`,
      );
      return `<tr>${labelled}</tr>`;
    });
    return `<table class="table-stack">${body}</table>`;
  });
}
