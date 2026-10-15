export type Lang = "en" | "nl";

// Pages that exist in both languages, as [English path, Dutch path]. Every other page is English only.
export const PAIRS: [string, string][] = [
  ["/", "/nl/"],
  ["/privacy/", "/nl/privacy/"],
];

export const HOME: Record<Lang, string> = { en: "/", nl: "/nl/" };

const withSlash = (path: string) => (path.endsWith("/") ? path : `${path}/`);

// The same page in the other language, or that language's home page when the page has no translation.
export function otherLanguagePath(path: string, from: Lang): string {
  const p = withSlash(path);
  const pair = PAIRS.find(([en, nl]) => (from === "en" ? en : nl) === p);
  if (pair) return from === "en" ? pair[1] : pair[0];
  return from === "en" ? HOME.nl : HOME.en;
}

// hreflang alternates for a page with a translation, in the shape Next's metadata and sitemap take.
export function languageAlternates(path: string): Record<string, string> | undefined {
  const pair = PAIRS.find(([en, nl]) => en === path || nl === path);
  if (!pair) return undefined;
  return { en: pair[0], nl: pair[1], "x-default": pair[0] };
}

// Formats a measured number for the reader's language: 2.1 in English, 2,1 in Dutch.
export function num(value: number | string, lang: Lang, digits?: number): string {
  const text = typeof value === "number" && digits !== undefined ? value.toFixed(digits) : String(value);
  return lang === "nl" ? text.replace(".", ",") : text;
}

// Fills {name} placeholders in a copy string.
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, key: string) => (key in values ? String(values[key]) : m));
}
