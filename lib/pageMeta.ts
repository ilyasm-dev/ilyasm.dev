import type { Metadata, Viewport } from "next";
import { COPY } from "@/content/copy";
import { HOME, languageAlternates, type Lang } from "@/lib/i18n";

const SITE = "Ilyas Mallah";
const other = (lang: Lang): Lang => (lang === "en" ? "nl" : "en");

function ogImage(lang: Lang) {
  const t = COPY[lang].site;
  return { url: t.ogImage, width: 1200, height: 630, alt: t.ogAlt };
}

// Canonical, hreflang alternates and Open Graph locale for a page. Only pages in i18n PAIRS get alternates.
function localeMeta(path: string, lang: Lang) {
  const languages = languageAlternates(path);
  return {
    alternates: { canonical: path, ...(languages && { languages }) },
    locale: COPY[lang].locale,
    alternateLocale: languages ? [COPY[other(lang)].locale] : undefined,
  };
}

// Defaults for every page in one language's root layout, which are the home page's own metadata.
export function siteMeta(lang: Lang): Metadata {
  const t = COPY[lang].site;
  const home = HOME[lang];
  const { alternates, locale, alternateLocale } = localeMeta(home, lang);
  return {
    metadataBase: new URL("https://ilyasm.dev"),
    title: { default: t.title, template: `%s | ${SITE}` },
    description: t.description,
    alternates,
    openGraph: { type: "website", siteName: SITE, title: t.title, description: t.description, url: home, locale, alternateLocale, images: [ogImage(lang)] },
    twitter: { card: "summary_large_image", creator: "@ilyasmdev" },
    // Sources in scripts/brand/. The ico is declared 32x32 so browsers that read SVG pick the SVG.
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "32x32" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: "/apple-touch-icon.png",
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f8fa" },
    { media: "(prefers-color-scheme: dark)", color: "#0e0f12" },
  ],
};

// Per-page title, description and url for search results and link previews. A page's openGraph replaces the layout's, so the image is repeated.
export function pageMeta(title: string, description: string, path: string, lang: Lang = "en"): Metadata {
  const full = `${title} | ${SITE}`;
  const image = ogImage(lang);
  const { alternates, locale, alternateLocale } = localeMeta(path, lang);
  return {
    title,
    description,
    alternates,
    openGraph: { type: "website", siteName: SITE, title: full, description, url: path, locale, alternateLocale, images: [image] },
    twitter: { card: "summary_large_image", creator: "@ilyasmdev", title: full, description, images: [image.url] },
  };
}
