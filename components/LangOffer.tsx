"use client";

import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Copy } from "@/content/copy/types";
import { OFFERS_FROM, translatedPath, type Lang } from "@/lib/i18n";
import { browserPrefers, readChoice, saveChoice } from "@/lib/langChoice";

// Offers this page in the other language when the visitor's browser prefers it, or they picked it before.
// It renders only in the browser, so the static HTML and crawlers never see it, and it floats, so nothing shifts.
export default function LangOffer({ from, to, text }: { from: Lang; to: Lang; text: Copy["site"]["offer"] }) {
  const path = usePathname() ?? "/";
  const [href, setHref] = useState<string | null>(null);
  const bar = useRef<HTMLElement>(null);

  useEffect(() => {
    const target = OFFERS_FROM.includes(from) ? translatedPath(path, from) : null;
    const choice = readChoice();
    const wanted = choice ? choice === to : browserPrefers(to, from);
    setHref(target && wanted ? target : null);
  }, [path, from, to]);

  // Room at the end of the page, so the bar never covers the footer.
  useEffect(() => {
    const root = document.documentElement;
    if (!href || !bar.current) return;
    const el = bar.current;
    const observer = new ResizeObserver(() => root.style.setProperty("--offer-room", `${el.offsetHeight + 24}px`));
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--offer-room");
    };
  }, [href]);

  if (!href) return null;

  return (
    <aside ref={bar} className="lang-offer" lang={to} aria-label={text.region}>
      <p>{text.text}</p>
      <a href={href} hrefLang={to} className="lang-offer-go" onClick={() => saveChoice(to)}>
        {text.go}
      </a>
      <button
        type="button"
        className="lang-offer-close"
        aria-label={text.close}
        title={text.close}
        onClick={() => {
          saveChoice(from);
          setHref(null);
        }}
      >
        <X size={18} strokeWidth={1.75} aria-hidden="true" />
      </button>
    </aside>
  );
}
