import type { MetadataRoute } from "next";
import { languageAlternates } from "@/lib/i18n";
import { allPosts } from "@/lib/posts";

export const dynamic = "force-static";

const SITE = "https://ilyasm.dev";
const PATHS = ["/", "/nl/", "/work/llama-cpp/", "/work/rolantir/", "/sample-report/", "/cv/", "/privacy/", "/nl/privacy/"];

// Writing is listed once a post is published. Draft previews are never listed.
function writingPaths(): string[] {
  const posts = allPosts().filter((p) => !p.draft);
  return posts.length ? ["/writing/", ...posts.map((p) => `/writing/${p.slug}/`)] : [];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [...PATHS, ...writingPaths()].map((path) => {
    const languages = languageAlternates(path);
    return {
      url: `${SITE}${path}`,
      changeFrequency: "monthly",
      priority: path === "/" || path === "/nl/" ? 1 : 0.6,
      ...(languages && { alternates: { languages: Object.fromEntries(Object.entries(languages).map(([k, v]) => [k, `${SITE}${v}`])) } }),
    };
  });
}
