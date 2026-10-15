import type { Metadata } from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import { mono } from "@/lib/fonts";
import { siteMeta } from "@/lib/pageMeta";
import "./globals.css";

// One 404 for both languages, since each language has its own root layout. English, with a way into the Dutch site.
const site = siteMeta("en");
export const metadata: Metadata = { ...site, title: "Page not found | Ilyas Mallah", alternates: undefined, openGraph: undefined };
export { viewport } from "@/lib/pageMeta";

export default function GlobalNotFound() {
  return (
    <SiteShell lang="en" fontClass={mono.variable}>
      <main id="main" className="wrap section page">
        <article className="article">
          <span className="tag tag-soft">404</span>
          <h1>This page does not exist</h1>
          <p className="case-lede">The link may be old or mistyped.</p>
          <p className="case-lede" lang="nl">
            Deze pagina bestaat niet. <a href="/nl/">Naar de Nederlandse startpagina</a>
          </p>
          <p className="report-cta">
            <Link className="button" href="/">
              Go to the home page
            </Link>
          </p>
        </article>
      </main>
    </SiteShell>
  );
}
