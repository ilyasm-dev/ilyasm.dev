"use client";

import { usePathname } from "next/navigation";
import { otherLanguagePath, type Lang } from "@/lib/i18n";

// Links to this page in the other language, or to that language's home page when there is no translation.
// A plain link, because each language has its own root layout and the switch reloads the page anyway.
// The header shows the round code label, the footer the language's name as text.
export default function LangSwitch({ from, to, label, name, asText = false }: { from: Lang; to: Lang; label: string; name: string; asText?: boolean }) {
  const href = otherLanguagePath(usePathname() ?? "/", from);
  if (asText) {
    return (
      <a className="footer-lang" href={href} hrefLang={to} lang={to}>
        {name}
      </a>
    );
  }
  return (
    <a className="lang-switch" href={href} hrefLang={to} lang={to} aria-label={name} title={name}>
      {label}
    </a>
  );
}
