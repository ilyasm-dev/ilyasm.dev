import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const PATHS = ["/", "/work/llama-cpp/", "/work/rolantir/", "/sample-report/", "/privacy/"];

// /cv/ is left out on purpose: it's the same page under a separate path for analytics, with "/" as its canonical.
export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: `https://ilyasm.dev${path}`,
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
