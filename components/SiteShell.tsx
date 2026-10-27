import Link from "next/link";
import Ext from "@/components/ExternalLink";
import LangOffer from "@/components/LangOffer";
import LangSwitch from "@/components/LangSwitch";
import { allPosts } from "@/lib/posts";
import ThemeToggle from "@/components/ThemeToggle";
import { COPY } from "@/content/copy";
import { HOME, type Lang } from "@/lib/i18n";

// Tells search engines which profiles belong to the same person.
const PERSON = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Ilyas Mallah",
  url: "https://ilyasm.dev/",
  jobTitle: "Software engineer",
  address: { "@type": "PostalAddress", addressCountry: "NL" },
  knowsAbout: ["Compilers", "GPU performance", "LLM inference", "WebAssembly", "Database performance"],
  sameAs: [
    "https://github.com/ilyas-mallah",
    "https://www.linkedin.com/in/ilyas-mallah",
    "https://x.com/ilyasmdev",
    "https://orcid.org/0009-0009-1694-3955",
  ],
};

// Applies a saved theme before first paint, so the page never flashes the wrong colors.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

// The document, header and footer, shared by the English and Dutch root layouts.
export default function SiteShell({ lang, fontClass, children }: { lang: Lang; fontClass: string; children: React.ReactNode }) {
  const t = COPY[lang].site;
  const home = HOME[lang];
  const enOnly = lang === "en" ? undefined : "en";
  // The footer links to Writing once a post is published (or in a local draft preview).
  const hasPosts = allPosts().length > 0;
  return (
    <html lang={lang} className={fontClass} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON) }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          {t.skip}
        </a>
        <header className="site-header">
          <div className="wrap header-inner">
            <Link href={home} className="brand">
              Ilyas Mallah
            </Link>
            <nav>
              <Link href={`${home}#start`}>{t.nav.start}</Link>
              <Link href={`${home}#work`} className="nav-work">
                {t.nav.work}
              </Link>
              <Link href={`${home}#contact`}>{t.nav.contact}</Link>
              <LangSwitch from={lang} to={t.switchTo.lang} label={t.switchTo.label} name={t.switchTo.name} />
              <ThemeToggle label={t.theme} />
            </nav>
          </div>
        </header>
        <LangOffer from={lang} to={t.switchTo.lang} text={COPY[t.switchTo.lang].site.offer} />
        {children}
        <footer className="site-footer">
          <div className="wrap footer-inner">
            <span className="footer-legal">
              Ilyas Mallah &middot; I. Mallah Development &middot; KvK 98045024 &middot;{" "}
              <Link href={lang === "nl" ? "/nl/privacy/" : "/privacy/"}>{t.privacy}</Link>
            </span>
            <span className="footer-links">
              {/* A full page load, so a visit from here carries ilyasm.dev as its referrer and CV PDF visits stay apart. */}
              <a href="/cv/" hrefLang={enOnly}>
                {t.cv}
              </a>
              {hasPosts && (
                <Link href="/writing/" hrefLang={enOnly}>
                  {t.writing}
                </Link>
              )}
              <Ext href="https://github.com/ilyas-mallah" note={lang}>
                GitHub
              </Ext>
              <Ext href="https://github.com/green-real" note={lang}>
                {t.earlier}
              </Ext>
              <Link href={`${home}#contact`}>{t.email}</Link>
            </span>
            <span className="footer-prefs">
              <LangSwitch from={lang} to={t.switchTo.lang} label={t.switchTo.label} name={t.switchTo.name} asText />
              <ThemeToggle label={t.theme} />
            </span>
          </div>
        </footer>
        <script
          type="module"
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "622e4ebceeab46088e7e2b5203ec64ff"}'
        />
      </body>
    </html>
  );
}
