import type { Metadata } from "next";

const OG_IMAGE = { url: "/og.png", width: 1200, height: 630, alt: "Ilyas Mallah. I find out why software is slow, and make it fast." };

// Per-page title, description and url for search results and link previews. A page's openGraph replaces the layout's, so the image is repeated.
export function pageMeta(title: string, description: string, path: string): Metadata {
  const full = `${title} | Ilyas Mallah`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "Ilyas Mallah", title: full, description, url: path, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", creator: "@ilyasmdev", title: full, description, images: [OG_IMAGE.url] },
  };
}
