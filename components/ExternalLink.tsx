import type { AnchorHTMLAttributes } from "react";
import type { Lang } from "@/lib/i18n";

// Screen reader note for links that open in a new tab, per language.
export const NEW_TAB: Record<Lang, string> = { en: " (opens in a new tab)", nl: " (opent in een nieuw tabblad)" };

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; note?: Lang };

// A link that leaves the site. It opens in a new tab, so the reader keeps their place here.
export default function Ext({ href, note = "en", children, "aria-label": aria, ...rest }: Props) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={aria && `${aria}${NEW_TAB[note]}`} {...rest}>
      {children}
      {!aria && <span className="sr-only">{NEW_TAB[note]}</span>}
    </a>
  );
}

// The same for links in HTML rendered from Markdown: absolute http(s) links open in a new tab.
export function externalLinksInHtml(html: string, lang: Lang = "en"): string {
  return html.replace(/<a href="(https?:\/\/[^"]+)"([^>]*)>([\s\S]*?)<\/a>/g, (_, href: string, attrs: string, text: string) =>
    `<a href="${href}"${attrs} target="_blank" rel="noopener noreferrer">${text}<span class="sr-only">${NEW_TAB[lang]}</span></a>`,
  );
}
