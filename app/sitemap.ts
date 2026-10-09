import type { MetadataRoute } from "next";

export const dynamic = "force-static";

// /cv/ is left out on purpose: it's the same page under a separate path for analytics, with "/" as its canonical.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://ilyasm.dev/", changeFrequency: "monthly", priority: 1 }];
}
