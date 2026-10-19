import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";
import { externalLinksInHtml } from "@/components/ExternalLink";
import { stackTables } from "@/lib/report";

// Published posts are content/writing/<slug>.md, with their images in public/writing/media/. Drafts are read from
// content/drafts/ (ignored by git) only when PREVIEW_DRAFTS=1, so a draft can be checked locally and never ships.
const PUBLISHED = path.join(process.cwd(), "content", "writing");
const DRAFTS = path.join(process.cwd(), "content", "drafts");
const PREVIEW = process.env.PREVIEW_DRAFTS === "1";

export type Post = {
  slug: string;
  title: string;
  summary: string;
  date: string | null;
  html: string;
  draft: boolean;
  minutes: number;
};

// Optional front matter: a block of "key: value" lines between two "---" lines at the top.
function frontMatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { meta: {}, body: raw };
  const meta = Object.fromEntries(
    m[1].split("\n").flatMap((line) => {
      const i = line.indexOf(":");
      return i > 0 ? [[line.slice(0, i).trim(), line.slice(i + 1).trim()]] : [];
    }),
  );
  return { meta, body: raw.slice(m[0].length) };
}

function parse(file: string, draft: boolean): Post {
  const slug = path.basename(file, ".md");
  const raw = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n").replace(/<!--[\s\S]*?-->/g, "").trim();
  const { meta, body: rest } = frontMatter(raw);
  const lines = rest.trim().split("\n");
  const titleLine = lines.findIndex((l) => l.startsWith("# "));
  const title = titleLine >= 0 ? lines[titleLine].slice(2).trim() : slug;
  const body = lines.filter((_, i) => i !== titleLine).join("\n").trim();
  const firstPara = body.split(/\n\s*\n/)[0].replace(/\s+/g, " ");
  const plain = (meta.summary ?? firstPara).replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*]/g, "");
  const media = draft ? "/draft-media/" : "/writing/media/";
  const html = stackTables(marked.parse(body, { async: false }) as string).replace(/src="(?:\.\.\/)*(?:[\w-]+\/)*media\//g, `src="${media}`);
  return {
    slug,
    title,
    summary: plain.length > 220 ? `${plain.slice(0, 217).trimEnd()}...` : plain,
    date: meta.date ?? null,
    html: externalLinksInHtml(html),
    draft,
    minutes: Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 230)),
  };
}

const mdFiles = (dir: string) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => path.join(dir, f)) : []);

// Newest first. Posts without a date go last.
export function allPosts(): Post[] {
  const posts = [...mdFiles(PUBLISHED).map((f) => parse(f, false)), ...(PREVIEW ? mdFiles(DRAFTS).map((f) => parse(f, true)) : [])];
  return posts.sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
}

export function getPost(slug: string): Post {
  const post = allPosts().find((p) => p.slug === slug);
  if (!post) throw new Error(`No post ${slug}`);
  return post;
}

// "October 2026" or "oktober 2026".
export function monthYear(date: string, locale: "en" | "nl" = "en"): string {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString(locale === "nl" ? "nl-NL" : "en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}
