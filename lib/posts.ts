import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const DIR = path.join(process.cwd(), "content", "writing");

export type Post = {
  slug: string;
  title: string;
  summary: string;
  html: string;
  draft: boolean;
  words: number;
};

function parse(slug: string): Post {
  const raw = fs.readFileSync(path.join(DIR, `${slug}.md`), "utf8").replace(/<!--[\s\S]*?-->/g, "").trim();
  const lines = raw.split("\n");
  const titleLine = lines.findIndex((l) => l.startsWith("# "));
  const title = titleLine >= 0 ? lines[titleLine].slice(2).trim() : slug;
  const body = lines.filter((_, i) => i !== titleLine).join("\n").trim();
  const firstPara = body.split(/\n\s*\n/)[0].replace(/\s+/g, " ");
  const summary = firstPara.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*]/g, "");
  return {
    slug,
    title,
    summary: summary.length > 220 ? `${summary.slice(0, 217).trimEnd()}...` : summary,
    html: marked.parse(body, { async: false }) as string,
    draft: true,
    words: body.split(/\s+/).filter(Boolean).length,
  };
}

const ORDER = ["hello", "blackwell-q4_0-cuda-12-8"];

export function allPosts(): Post[] {
  return ORDER.filter((s) => fs.existsSync(path.join(DIR, `${s}.md`))).map(parse);
}

export function getPost(slug: string): Post {
  return parse(slug);
}
